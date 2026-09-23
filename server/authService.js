import crypto from 'node:crypto';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import dns from 'node:dns';

// Force IPv4-first DNS order to prevent IPv6 ENETUNREACH on Linux containers (Render/Docker)
if (dns && dns.setDefaultResultOrder) {
  dns.setDefaultResultOrder('ipv4first');
}

dotenv.config();

const SESSION_SECRET = process.env.SESSION_SECRET || 'abdullah-secure-session-secret-key-2026';

// --------------------------------------------------------------------------
// 1. Authorized Emails Allowlist
// --------------------------------------------------------------------------
export const getAuthorizedAdminEmails = () => {
  const list = [];
  if (process.env.ADMIN_EMAILS) {
    list.push(...process.env.ADMIN_EMAILS.split(','));
  }
  if (process.env.ADMIN_EMAIL) {
    list.push(...process.env.ADMIN_EMAIL.split(','));
  }
  if (list.length === 0) {
    list.push('mohommadhuafnan756@gmail.com', 'aamabdullah441@gmail.com');
  }
  return [...new Set(list.map((e) => e.trim().toLowerCase()).filter(Boolean))];
};

export const normalizeEmail = (email) => {
  if (typeof email !== 'string') return '';
  return email.trim().toLowerCase();
};

export const isAuthorizedAdmin = (email) => {
  const norm = normalizeEmail(email);
  if (!norm) return false;
  const authorized = getAuthorizedAdminEmails();
  return authorized.includes(norm);
};

export const maskEmail = (email) => {
  const norm = normalizeEmail(email);
  const parts = norm.split('@');
  if (parts.length !== 2) return '***@***.com';
  const name = parts[0];
  const domain = parts[1];
  if (name.length <= 2) {
    return `${name[0]}*@${domain}`;
  }
  const first = name[0];
  const masked = '*'.repeat(Math.max(name.length - 1, 5));
  return `${first}${masked}@${domain}`;
};

// --------------------------------------------------------------------------
// 2. In-Memory Store for OTP Challenges, Sessions, Rate Limits
// --------------------------------------------------------------------------
const challenges = new Map();
const activeSessions = new Map();
const rateLimits = new Map();

// Periodic cleanup (every 60 seconds)
setInterval(() => {
  const now = Date.now();
  for (const [id, challenge] of challenges.entries()) {
    if (challenge.expiresAt < now || challenge.used) {
      challenges.delete(id);
    }
  }
  for (const [token, session] of activeSessions.entries()) {
    if (session.absoluteExpiresAt < now || session.idleExpiresAt < now) {
      activeSessions.delete(token);
    }
  }
  for (const [key, record] of rateLimits.entries()) {
    if (record.resetAt < now) {
      rateLimits.delete(key);
    }
  }
}, 60 * 1000).unref();

// Rate limiter helper
const checkRateLimit = (key, maxRequests, windowMs) => {
  const now = Date.now();
  let record = rateLimits.get(key);
  if (!record || record.resetAt < now) {
    record = { count: 1, resetAt: now + windowMs };
    rateLimits.set(key, record);
    return { allowed: true, remaining: maxRequests - 1 };
  }
  if (record.count >= maxRequests) {
    return { allowed: false, remaining: 0, resetIn: Math.ceil((record.resetAt - now) / 1000) };
  }
  record.count += 1;
  return { allowed: true, remaining: maxRequests - record.count };
};

// Cryptographic helpers
const hashOtp = (challengeId, otp) => {
  return crypto
    .createHmac('sha256', SESSION_SECRET)
    .update(`${challengeId}:${otp}`)
    .digest('hex');
};

const safeCompare = (a, b) => {
  if (typeof a !== 'string' || typeof b !== 'string') return false;
  const bufA = Buffer.from(a, 'hex');
  const bufB = Buffer.from(b, 'hex');
  if (bufA.length !== bufB.length) return false;
  return crypto.timingSafeEqual(bufA, bufB);
};

const createSessionToken = (email) => {
  const now = Date.now();
  const sessionId = crypto.randomUUID();
  const payload = JSON.stringify({
    sessionId,
    email,
    createdAt: now,
  });
  const encodedPayload = Buffer.from(payload).toString('base64url');
  const signature = crypto
    .createHmac('sha256', SESSION_SECRET)
    .update(encodedPayload)
    .digest('base64url');

  const token = `${encodedPayload}.${signature}`;

  // Store in active sessions: 30 minutes idle, 8 hours absolute
  activeSessions.set(sessionId, {
    sessionId,
    email,
    token,
    idleExpiresAt: now + 30 * 60 * 1000,
    absoluteExpiresAt: now + 8 * 60 * 60 * 1000,
  });

  return token;
};

// Export internal state for security test suite
export const _getChallengeForTesting = (id) => challenges.get(id);
export const _getActiveSessionForTesting = (id) => activeSessions.get(id);
export const _clearRateLimitsForTesting = () => { rateLimits.clear(); };

let cachedTransporter = null;

export const setSmtpTransporterForTesting = (transporter) => {
  cachedTransporter = transporter;
};

export const getSmtpTransporter = () => {
  const user = (process.env.SMTP_USER || '').trim();
  const pass = (process.env.SMTP_PASSWORD || process.env.SMTP_PASS || '').replace(/\s+/g, '');
  const host = process.env.SMTP_HOST || 'smtp.gmail.com';
  const port = parseInt(process.env.SMTP_PORT || '465', 10);

  if (!user || !pass) return null;

  if (!cachedTransporter) {
    cachedTransporter = nodemailer.createTransport({
      host: host.includes('gmail') ? 'smtp.gmail.com' : host,
      port,
      secure: port === 465,
      family: 4, // Strict IPv4 to avoid IPv6 ENETUNREACH in cloud containers
      auth: { user, pass },
      connectionTimeout: 15000,
      greetingTimeout: 15000,
      socketTimeout: 20000,
    });
  }
  return cachedTransporter;
};

export const sendAdminOtpEmail = async (email, otp) => {
  const user = (process.env.SMTP_USER || '').trim();
  const pass = (process.env.SMTP_PASSWORD || process.env.SMTP_PASS || '').replace(/\s+/g, '');
  const transporter = getSmtpTransporter();
  if (!transporter) {
    throw new Error('Email service is not configured. Please set SMTP_USER and SMTP_PASSWORD.');
  }

  const sender = process.env.SMTP_FROM || `"Admin Security System" <${user}>`;

  const html = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 32px 24px; background: #020617; color: #f8fafc; border-radius: 16px; border: 1px solid #1e293b;">
      <h2 style="color: #ffffff; margin-top: 0; font-size: 20px;">Admin Login Verification Code</h2>
      <p style="color: #cbd5e1; font-size: 14px; line-height: 1.5;">Hello,</p>
      <p style="color: #cbd5e1; font-size: 14px; line-height: 1.5;">Your Admin Dashboard verification code is:</p>
      <div style="font-size: 38px; font-weight: 800; letter-spacing: 10px; color: #10b981; font-family: monospace; padding: 16px 0; text-align: center; background: #0f172a; border-radius: 12px; margin: 20px 0; border: 1px dashed #059669;">
        ${otp}
      </div>
      <p style="color: #cbd5e1; font-size: 13px;">This code will expire in <strong>5 minutes</strong>.</p>
      <p style="color: #ef4444; font-size: 13px;">Do not share this code with anyone.</p>
      <p style="color: #64748b; font-size: 12px; margin-top: 24px;">If you did not request this code, you can safely ignore this email.</p>
      <hr style="border: none; border-top: 1px solid #1e293b; margin: 20px 0;" />
      <p style="color: #94a3b8; font-size: 12px; margin-0;">Regards,<br/>Admin Security System</p>
    </div>
  `;

  const text = `Hello,\n\nYour Admin Dashboard verification code is:\n\n${otp}\n\nThis code will expire in 5 minutes.\n\nDo not share this code with anyone.\n\nIf you did not request this code, you can safely ignore this email.\n\nRegards,\nAdmin Security System`;

  const mailOptions = {
    from: sender,
    to: email,
    subject: 'Admin Login Verification Code',
    html,
    text,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (err) {
    console.warn('[AUTH SMTP] Primary delivery attempt failed:', err?.message || err);
    if (user && pass) {
      console.log('[AUTH SMTP] Retrying via direct Gmail SSL (port 465, IPv4)...');
      const fallbackTransporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        family: 4,
        auth: { user, pass },
        connectionTimeout: 15000,
        socketTimeout: 20000,
      });
      await fallbackTransporter.sendMail(mailOptions);
      cachedTransporter = fallbackTransporter;
      return;
    }
    throw err;
  }
};

// --------------------------------------------------------------------------
// 4. STEP 1: REQUEST OTP
// --------------------------------------------------------------------------
export const requestOtp = async ({ email, ip }) => {
  const normalized = normalizeEmail(email);

  // Validate email format
  if (!normalized || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized)) {
    return {
      status: 400,
      body: { error: 'Please enter a valid email address.' },
    };
  }

  // Rate limit by IP (10 requests per 15 mins)
  const ipLimit = checkRateLimit(`req_ip_${ip}`, 10, 15 * 60 * 1000);
  if (!ipLimit.allowed) {
    return {
      status: 429,
      body: { error: `Too many requests. Please wait ${ipLimit.resetIn} seconds before trying again.` },
    };
  }

  // Rate limit by email (5 requests per 15 mins)
  const emailLimit = checkRateLimit(`req_email_${normalized}`, 5, 15 * 60 * 1000);
  if (!emailLimit.allowed) {
    return {
      status: 429,
      body: { error: `Too many requests. Please wait ${emailLimit.resetIn} seconds before trying again.` },
    };
  }

  // If email is NOT authorized admin, return safe generic response to prevent enumeration
  if (!isAuthorizedAdmin(normalized)) {
    return {
      status: 200,
      body: {
        success: true,
        message: 'If the email is authorized, a verification code has been sent.',
        challengeId: crypto.randomUUID(), // fake challenge id
        maskedEmail: maskEmail(normalized),
        expiresIn: 300,
      },
    };
  }

  // Generate 4-digit cryptographically secure OTP
  const otp = crypto.randomInt(1000, 10000).toString();
  const challengeId = crypto.randomUUID();
  const now = Date.now();
  const expiresAt = now + 5 * 60 * 1000; // 5 minutes

  // Hash OTP and store challenge
  const otpHash = hashOtp(challengeId, otp);
  challenges.set(challengeId, {
    challengeId,
    email: normalized,
    otpHash,
    createdAt: now,
    expiresAt,
    attempts: 0,
    maxAttempts: 5,
    lastSentAt: now,
    used: false,
  });

  // Dispatch OTP email through Gmail SMTP
  try {
    await sendAdminOtpEmail(normalized, otp);
  } catch (err) {
    console.error('[AUTH ERROR] Failed to deliver OTP email:', err?.message || err);
    challenges.delete(challengeId);
    return {
      status: 502,
      body: {
        error: 'Unable to send the verification code. Please try again later.',
        message: 'Unable to send the verification code. Please try again later.',
      },
    };
  }

  return {
    status: 200,
    body: {
      success: true,
      message: `A verification code has been sent to ${maskEmail(normalized)}.`,
      challengeId,
      maskedEmail: maskEmail(normalized),
      expiresIn: 300,
    },
  };
};

// --------------------------------------------------------------------------
// 5. STEP 2: RESEND OTP
// --------------------------------------------------------------------------
export const resendOtp = async ({ challengeId, ip }) => {
  // Rate limit by IP
  const ipLimit = checkRateLimit(`resend_ip_${ip}`, 10, 15 * 60 * 1000);
  if (!ipLimit.allowed) {
    return {
      status: 429,
      body: { error: `Too many requests. Please wait ${ipLimit.resetIn} seconds before trying again.` },
    };
  }

  const challenge = challenges.get(challengeId);
  if (!challenge || challenge.used || challenge.expiresAt < Date.now()) {
    return {
      status: 400,
      body: { error: 'Verification session expired. Please return to login and enter your email again.' },
    };
  }

  // 60-second cooldown check
  const now = Date.now();
  const timeSinceLastSent = now - challenge.lastSentAt;
  if (timeSinceLastSent < 60 * 1000) {
    const waitSeconds = Math.ceil((60 * 1000 - timeSinceLastSent) / 1000);
    return {
      status: 429,
      body: { error: `Please wait ${waitSeconds} seconds before requesting another code.` },
    };
  }

  // Invalidate old OTP and generate a new one
  const newOtp = crypto.randomInt(1000, 10000).toString();
  challenge.otpHash = hashOtp(challengeId, newOtp);
  challenge.lastSentAt = now;
  challenge.expiresAt = now + 5 * 60 * 1000; // Reset 5 minutes
  challenge.attempts = 0; // Reset attempts for the new code

  try {
    await sendAdminOtpEmail(challenge.email, newOtp);
  } catch (err) {
    console.error('[AUTH ERROR] Failed to resend OTP email:', err?.message || err);
    return {
      status: 502,
      body: {
        error: 'Unable to deliver new verification code. Please try again later.',
      },
    };
  }

  return {
    status: 200,
    body: {
      success: true,
      message: 'A new verification code has been sent.',
      expiresIn: 300,
    },
  };
};

// --------------------------------------------------------------------------
// 6. STEP 3: VERIFY OTP (Bound to Email)
// --------------------------------------------------------------------------
export const verifyOtp = async ({ challengeId, otp, email, ip }) => {
  // Rate limit by IP
  const ipLimit = checkRateLimit(`verify_ip_${ip}`, 30, 15 * 60 * 1000);
  if (!ipLimit.allowed) {
    return {
      status: 429,
      body: { error: 'Too many verification attempts. Please wait before trying again.' },
    };
  }

  // Input validation: OTP must be exactly 4 digits
  if (typeof otp !== 'string' || !/^\d{4}$/.test(otp.trim())) {
    return {
      status: 400,
      body: { error: 'Please enter a valid 4-digit numeric verification code.' },
    };
  }

  const cleanOtp = otp.trim();
  const challenge = challenges.get(challengeId);

  // If challenge does not exist, was used, or is fake
  if (!challenge || challenge.used) {
    return {
      status: 400,
      body: { error: 'This verification code has already been used or is invalid. Please request a new code.' },
    };
  }

  // Check expiration (5 minutes)
  const now = Date.now();
  if (challenge.expiresAt < now) {
    challenges.delete(challengeId);
    return {
      status: 400,
      body: { error: 'This verification code has expired. Please request a new code.' },
    };
  }

  // EMAIL BINDING: Verify OTP challenge belongs to the same email address
  if (email) {
    const normalizedEmail = normalizeEmail(email);
    if (normalizedEmail !== challenge.email) {
      return {
        status: 401,
        body: { error: 'Authentication denied. Verification code does not match this email address.' },
      };
    }
  }

  // Check attempt limits (max 5)
  if (challenge.attempts >= challenge.maxAttempts) {
    challenge.used = true;
    challenges.delete(challengeId);
    return {
      status: 429,
      body: { error: 'Too many attempts. Please request a new verification code.' },
    };
  }

  challenge.attempts += 1;

  // Compare submitted OTP hash with stored hash
  const submittedHash = hashOtp(challengeId, cleanOtp);
  const isMatch = safeCompare(submittedHash, challenge.otpHash);

  if (!isMatch) {
    const remaining = challenge.maxAttempts - challenge.attempts;
    if (remaining <= 0) {
      challenge.used = true;
      challenges.delete(challengeId);
      return {
        status: 429,
        body: { error: 'Too many attempts. Please request a new verification code.' },
      };
    }
    return {
      status: 400,
      body: { error: `Invalid verification code. Please try again. (${remaining} attempt${remaining === 1 ? '' : 's'} remaining)` },
    };
  }

  // SUCCESS: Mark challenge as used and delete it to prevent replay
  challenge.used = true;
  challenges.delete(challengeId);

  // Create cryptographically signed server session
  const token = createSessionToken(challenge.email);

  return {
    status: 200,
    body: {
      success: true,
      message: 'Authentication successful. Welcome to the admin dashboard.',
      email: challenge.email,
    },
    token,
  };
};

// --------------------------------------------------------------------------
// 7. STEP 4: VERIFY SESSION
// --------------------------------------------------------------------------
export const verifySession = (token) => {
  if (!token || typeof token !== 'string') {
    return { authenticated: false };
  }

  const parts = token.split('.');
  if (parts.length !== 2) {
    return { authenticated: false };
  }

  const [encodedPayload, signature] = parts;
  const expectedSig = crypto
    .createHmac('sha256', SESSION_SECRET)
    .update(encodedPayload)
    .digest('base64url');

  if (!safeCompare(signature, expectedSig)) {
    return { authenticated: false };
  }

  try {
    const payload = JSON.parse(Buffer.from(encodedPayload, 'base64url').toString('utf8'));
    const session = activeSessions.get(payload.sessionId);

    if (!session) {
      return { authenticated: false };
    }

    // Verify admin email is still in allowlist
    if (!isAuthorizedAdmin(session.email)) {
      activeSessions.delete(payload.sessionId);
      return { authenticated: false };
    }

    const now = Date.now();
    // Check absolute expiration (8 hours)
    if (session.absoluteExpiresAt < now) {
      activeSessions.delete(payload.sessionId);
      return { authenticated: false };
    }

    // Check idle expiration (30 mins)
    if (session.idleExpiresAt < now) {
      activeSessions.delete(payload.sessionId);
      return { authenticated: false };
    }

    // Slide idle expiration forward (active use)
    session.idleExpiresAt = now + 30 * 60 * 1000;

    return {
      authenticated: true,
      email: session.email,
    };
  } catch {
    return { authenticated: false };
  }
};

// --------------------------------------------------------------------------
// 8. Centralized Server Authorization Middleware: requireAdmin
// --------------------------------------------------------------------------
export const requireAdmin = (req, res, next) => {
  const token =
    req.cookies?.admin_session ||
    req.headers['authorization']?.replace('Bearer ', '') ||
    null;

  const session = verifySession(token);
  if (!session.authenticated) {
    return res.status(401).json({
      error: 'Unauthorized: Admin authentication required.',
      authenticated: false,
    });
  }

  req.admin = { email: session.email };
  next();
};

// --------------------------------------------------------------------------
// 9. LOGOUT SESSION
// --------------------------------------------------------------------------
export const logoutSession = (token) => {
  if (!token) return true;
  try {
    const parts = token.split('.');
    if (parts.length === 2) {
      const payload = JSON.parse(Buffer.from(parts[0], 'base64url').toString('utf8'));
      if (payload.sessionId) {
        activeSessions.delete(payload.sessionId);
      }
    }
  } catch {
    // Ignore error
  }
  return true;
};
