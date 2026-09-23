import { verifyOtp } from '../../../server/authService.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const ip = req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.socket?.remoteAddress || '127.0.0.1';
  const { challengeId, otp } = req.body || {};
  const result = await verifyOtp({ challengeId, otp, ip });

  if (result.token) {
    res.setHeader(
      'Set-Cookie',
      `admin_session=${result.token}; HttpOnly; Secure; SameSite=Lax; Max-Age=${8 * 60 * 60}; Path=/`
    );
    return res.status(result.status).json({
      ...result.body,
      token: result.token,
    });
  }

  return res.status(result.status).json(result.body);
}
