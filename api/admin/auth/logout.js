import { logoutSession } from '../../../server/authService.js';

export default function handler(req, res) {
  const cookieHeader = req.headers.cookie || '';
  const cookies = Object.fromEntries(
    cookieHeader.split(';').map((c) => {
      const [k, ...v] = c.trim().split('=');
      return [k, v.join('=')];
    })
  );

  const token = cookies.admin_session || req.headers['authorization']?.replace('Bearer ', '') || null;
  logoutSession(token);

  res.setHeader(
    'Set-Cookie',
    'admin_session=; HttpOnly; Secure; SameSite=Lax; Max-Age=0; Path=/'
  );

  return res.status(200).json({ success: true, message: 'Logged out successfully.' });
}
