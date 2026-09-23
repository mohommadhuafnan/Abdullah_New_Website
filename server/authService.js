import crypto from 'node:crypto';
import { Resend } from 'resend';
import dotenv from 'dotenv';

dotenv.config();

const ADMIN_EMAIL = (process.env.ADMIN_EMAIL || 'mohommadhuafnan756@gmail.com').trim().toLowerCase();
const RESEND_API_KEY = process.env.RESEND_API_KEY || '';
const ADMIN_EMAIL_FROM = process.env.ADMIN_EMAIL_FROM || 'onboarding@resend.dev';
const SESSION_SECRET = process.env.SESSION_SECRET || 'abdullah-secure-session-secret-key-2026';

// Initialize Resend
const resend = RESEND_API_KEY ? new Resend(RESEND_API_KEY) : null;

// In-Memory Storage for Challenges & Sessions
// Cleaned up every 5 minutes
const challenges = new Map();
const activeSessions = new Map();
const rateLimits = new Map();

// Helper: Normalize email
export const normalizeEmail = (email) => {
  if (typeof email !== 'string') return '';
  return email.trim().toLowerCase();
};

// Helper: Mask email (e.g. mohommadhuafnan756@gmail.com -> m***************@gmail.com)
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

// Periodic cleanup
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
}, 60 * 1000);

// Helper: Rate limiter
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

// Helper: Hash OTP with challengeId and SESSION_SECRET
const hashOtp = (challengeId, otp) => {
  return crypto
    .createHmac('sha256', SESSION_SECRET)
    .update(`${challengeId}:${otp}`)
    .digest('hex');
};

// Helper: Timing safe comparison
const safeCompare = (a, b) => {
  if (typeof a !== 'string' || typeof b !== 'string') return false;
  const bufA = Buffer.from(a, 'hex');
  const bufB = Buffer.from(b, 'hex');
  if (bufA.length !== bufB.length) return false;
  return crypto.timingSafeEqual(bufA, bufB);
};

// Helper: Generate signed session token
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

  // Store in active sessions map
  // Idle timeout = 30 minutes, absolute timeout = 8 hours
  activeSessions.set(sessionId, {
    sessionId,
    email,
    token,
    idleExpiresAt: now + 30 * 60 * 1000,
    absoluteExpiresAt: now + 8 * 60 * 60 * 1000,
  });

  return token;
};

// 1. REQUEST OTP
export const requestOtp = async ({ email, ip }) => {
  const normalized = normalizeEmail(email);

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

  // If email is NOT authorized admin, return safe generic response
  if (normalized !== ADMIN_EMAIL) {
    // Return safe generic response to prevent email enumeration
    return {
      status: 200,
      body: {
        success: true,
        message: 'If the email is authorized, a verification code has been sent.',
        challengeId: crypto.randomUUID(), // fake challenge id
        maskedEmail: maskEmail(normalized || 'administrator'),
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

  // Send Email via Resend
  let emailSent = false;
  if (resend) {
    try {
      await resend.emails.send({
        from: ADMIN_EMAIL_FROM,
        to: ADMIN_EMAIL,
        subject: 'Admin Login Verification Code',
        html: `
          <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 500px; margin: 0 auto; padding: 32px 24px; background: #020617; color: #f8fafc; border-radius: 20px; border: 1px solid #1e293b;">
            <div style="text-align: center; margin-bottom: 24px;">
              <h2 style="color: #ffffff; margin: 0; font-size: 22px; font-weight: 700;">Admin Login Verification</h2>
              <p style="color: #10b981; font-size: 13px; font-weight: 600; margin-top: 4px; text-transform: uppercase; letter-spacing: 1px;">
                Al Hafeel A. A. M. Abdullah Platform
              </p>
            </div>
            
            <div style="background: #0f172a; padding: 28px 20px; border-radius: 16px; text-align: center; border: 1px solid #334155; margin-bottom: 24px;">
              <p style="color: #cbd5e1; font-size: 14px; margin: 0 0 16px 0;">Your administrator verification code is:</p>
              <div style="font-size: 40px; font-weight: 900; letter-spacing: 12px; color: #fbbf24; font-family: monospace; padding: 8px 0; background: #020617; border-radius: 12px; border: 1px dashed #f59e0b;">
                ${otp}
              </div>
              <p style="color: #94a3b8; font-size: 12px; margin: 16px 0 0 0;">
                ⏱️ This code will expire in <strong style="color: #f8fafc;">5 minutes</strong>.
              </p>
            </div>
            
            <p style="color: #64748b; font-size: 12px; line-height: 1.6; text-align: center; margin: 0;">
              If you did not request this verification code, you can safely ignore this email.<br/>
              <strong style="color: #ef4444;">Do not share this code with anyone.</strong>
            </p>
          </div>
        `,
        text: `Admin Login Verification\n\nYour administrator verification code is: ${otp}\n\nThis code will expire in 5 minutes.\n\nIf you did not request this verification code, you can safely ignore this email.\nDo not share this code with anyone.`,
      });
      emailSent = true;
    } catch (err) {
      console.error('[AUTH ERROR] Failed to deliver OTP email via Resend:', err?.message || err);
      // Fallback: If Resend domain is onboarding and recipient doesn't match account or fails,
      // log notice without leaking OTP.
    }
  } else {
    console.warn('[AUTH WARNING] RESEND_API_KEY is not configured. Email could not be sent.');
  }

  return {
    status: 200,
    body: {
      success: true,
      message: 'A verification code has been sent to the authorized administrator email.',
      challengeId,
      maskedEmail: maskEmail(normalized),
      expiresIn: 300,
    },
  };
};

// 2. RESEND OTP
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
      body: { error: `Please wait ${waitSeconds} seconds before requesting a new code.` },
    };
  }

  // Invalidate old OTP and generate a new one
  const newOtp = crypto.randomInt(1000, 10000).toString();
  challenge.otpHash = hashOtp(challengeId, newOtp);
  challenge.lastSentAt = now;
  challenge.expiresAt = now + 5 * 60 * 1000; // Reset 5 minutes
  challenge.attempts = 0; // Reset attempts for the new code

  if (resend) {
    try {
      await resend.emails.send({
        from: ADMIN_EMAIL_FROM,
        to: ADMIN_EMAIL,
        subject: 'New Admin Login Verification Code',
        html: `
          <div style="font-family: sans-serif; max-width: 500px; margin: 0 auto; padding: 24px; background: #020617; color: #f8fafc; border-radius: 16px; border: 1px solid #1e293b;">
            <h2 style="color: #ffffff; text-align: center; margin: 0 0 16px 0;">New Verification Code</h2>
            <div style="background: #0f172a; padding: 20px; border-radius: 12px; text-align: center; border: 1px solid #334155;">
              <p style="color: #cbd5e1; font-size: 14px; margin: 0 0 12px 0;">Your new administrator verification code is:</p>
              <div style="font-size: 36px; font-weight: 800; letter-spacing: 8px; color: #fbbf24; font-family: monospace;">${newOtp}</div>
              <p style="color: #94a3b8; font-size: 12px; margin: 12px 0 0 0;">Expires in 5 minutes.</p>
            </div>
          </div>
        `,
        text: `Your new admin verification code is: ${newOtp}\nExpires in 5 minutes.`,
      });
    } catch (err) {
      console.error('[AUTH ERROR] Resend error during resend:', err?.message || err);
    }
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

// 3. VERIFY OTP
export const verifyOtp = async ({ challengeId, otp, ip }) => {
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
      body: { error: 'Verification session is invalid or has already been used. Please request a new code.' },
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

  // Check attempt limits (max 5)
  if (challenge.attempts >= challenge.maxAttempts) {
    challenges.delete(challengeId);
    return {
      status: 429,
      body: { error: 'Too many verification attempts. Please request a new code.' },
    };
  }

  challenge.attempts += 1;

  // Compare submitted OTP hash with stored hash
  const submittedHash = hashOtp(challengeId, cleanOtp);
  const isMatch = safeCompare(submittedHash, challenge.otpHash);

  if (!isMatch) {
    const remaining = challenge.maxAttempts - challenge.attempts;
    if (remaining <= 0) {
      challenges.delete(challengeId);
      return {
        status: 429,
        body: { error: 'Too many incorrect attempts. This code has been deactivated. Please request a new code.' },
      };
    }
    return {
      status: 400,
      body: { error: `Incorrect verification code. ${remaining} attempt${remaining === 1 ? '' : 's'} remaining.` },
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
      message: 'Authentication successful. Redirecting to dashboard...',
      email: challenge.email,
    },
    token,
  };
};

// 4. VERIFY SESSION
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

// 5. LOGOUT
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
