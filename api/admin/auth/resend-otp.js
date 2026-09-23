import { resendOtp } from '../../../server/authService.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const ip = req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.socket?.remoteAddress || '127.0.0.1';
  const { challengeId } = req.body || {};
  const result = await resendOtp({ challengeId, ip });
  return res.status(result.status).json(result.body);
}
