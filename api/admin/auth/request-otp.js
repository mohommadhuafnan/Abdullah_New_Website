import { requestOtp } from '../../../server/authService.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const ip = req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.socket?.remoteAddress || '127.0.0.1';
  const { email } = req.body || {};
  const result = await requestOtp({ email, ip });
  return res.status(result.status).json(result.body);
}
