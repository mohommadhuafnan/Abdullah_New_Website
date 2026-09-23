import { verifySession } from '../../../server/authService.js';

export default function handler(req, res) {
  const cookieHeader = req.headers.cookie || '';
  const cookies = Object.fromEntries(
    cookieHeader.split(';').map((c) => {
      const [k, ...v] = c.trim().split('=');
      return [k, v.join('=')];
    })
  );

  const token = cookies.admin_session || req.headers['authorization']?.replace('Bearer ', '') || null;
  const session = verifySession(token);

  if (!session.authenticated) {
    return res.status(401).json({ authenticated: false });
  }

  return res.status(200).json({
    authenticated: true,
    email: session.email,
  });
}
