import express from 'express';
import cookieParser from 'cookie-parser';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import dotenv from 'dotenv';
import {
  requestOtp,
  verifyOtp,
  resendOtp,
  verifySession,
  logoutSession,
} from './authService.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;
const isProd = process.env.NODE_ENV === 'production';

app.use(express.json());
app.use(cookieParser());

// Trust proxy for accurate IP determination behind Render / Vercel / Nginx
app.set('trust proxy', 1);

// Helper to extract client IP
const getClientIp = (req) => {
  return (
    req.headers['x-forwarded-for']?.split(',')[0]?.trim() ||
    req.socket?.remoteAddress ||
    '127.0.0.1'
  );
};

// Helper to extract session token from cookie or header
const getSessionToken = (req) => {
  return (
    req.cookies?.admin_session ||
    req.headers['authorization']?.replace('Bearer ', '') ||
    null
  );
};

// ==========================================
// AUTHENTICATION API ROUTES
// ==========================================

// 1. POST /api/admin/auth/request-otp
app.post('/api/admin/auth/request-otp', async (req, res) => {
  try {
    const { email } = req.body || {};
    const ip = getClientIp(req);
    const result = await requestOtp({ email, ip });
    return res.status(result.status).json(result.body);
  } catch (err) {
    console.error('[API ERROR] /request-otp:', err);
    return res.status(500).json({ error: 'Unable to process authentication request.' });
  }
});

// 2. POST /api/admin/auth/resend-otp
app.post('/api/admin/auth/resend-otp', async (req, res) => {
  try {
    const { challengeId } = req.body || {};
    const ip = getClientIp(req);
    const result = await resendOtp({ challengeId, ip });
    return res.status(result.status).json(result.body);
  } catch (err) {
    console.error('[API ERROR] /resend-otp:', err);
    return res.status(500).json({ error: 'Unable to process resend request.' });
  }
});

// 3. POST /api/admin/auth/verify-otp
app.post('/api/admin/auth/verify-otp', async (req, res) => {
  try {
    const { challengeId, otp } = req.body || {};
    const ip = getClientIp(req);
    const result = await verifyOtp({ challengeId, otp, ip });

    if (result.token) {
      res.cookie('admin_session', result.token, {
        httpOnly: true,
        secure: isProd,
        sameSite: 'lax',
        maxAge: 8 * 60 * 60 * 1000, // 8 hours
        path: '/',
      });
      // Also return token in body for environments where cookies are restricted
      return res.status(result.status).json({
        ...result.body,
        token: result.token,
      });
    }

    return res.status(result.status).json(result.body);
  } catch (err) {
    console.error('[API ERROR] /verify-otp:', err);
    return res.status(500).json({ error: 'Unable to verify code.' });
  }
});

// 4. GET /api/admin/auth/session
app.get('/api/admin/auth/session', (req, res) => {
  const token = getSessionToken(req);
  const session = verifySession(token);
  if (!session.authenticated) {
    return res.status(401).json({ authenticated: false });
  }
  return res.status(200).json({
    authenticated: true,
    email: session.email,
  });
});

// 5. POST /api/admin/auth/logout
app.post('/api/admin/auth/logout', (req, res) => {
  const token = getSessionToken(req);
  logoutSession(token);
  res.clearCookie('admin_session', { path: '/' });
  return res.status(200).json({ success: true, message: 'Logged out successfully.' });
});

// ==========================================
// STATIC FILES & SPA FALLBACK (Production)
// ==========================================
const distPath = path.resolve(__dirname, '../dist');
app.use(express.static(distPath));

app.use((req, res, next) => {
  // Let /api calls 404 naturally if unmatched
  if (req.path.startsWith('/api')) {
    return res.status(404).json({ error: 'API route not found' });
  }
  // All other GET routes return index.html for React Router
  if (req.method === 'GET') {
    return res.sendFile(path.join(distPath, 'index.html'));
  }
  next();
});

app.listen(PORT, () => {
  console.log(`[SERVER] Abdullah Platform Server running on port ${PORT}`);
});
