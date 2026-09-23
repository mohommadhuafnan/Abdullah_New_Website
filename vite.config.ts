import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import fs from 'node:fs';
import path from 'node:path';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    {
      name: 'copy-404-fallback',
      closeBundle() {
        const distDir = path.resolve(process.cwd(), 'dist');
        const indexPath = path.join(distDir, 'index.html');
        const fallbackPath = path.join(distDir, '404.html');
        if (fs.existsSync(indexPath)) {
          fs.copyFileSync(indexPath, fallbackPath);
        }
      },
    },
    {
      name: 'auth-api-plugin',
      configureServer(server) {
        server.middlewares.use(async (req, res, next) => {
          if (!req.url || !req.url.startsWith('/api/admin/auth/')) {
            return next();
          }

          // @ts-ignore - dynamic import of server authService
          const { requestOtp, verifyOtp, resendOtp, verifySession, logoutSession } = await import(
            './server/authService.js'
          );

          const rawIp = req.headers['x-forwarded-for'];
          const ip =
            (typeof rawIp === 'string'
              ? rawIp.split(',')[0]
              : Array.isArray(rawIp)
              ? rawIp[0]
              : null)?.trim() ||
            req.socket?.remoteAddress ||
            '127.0.0.1';

          // Helper to parse cookies
          const cookieHeader = req.headers.cookie || '';
          const cookies = Object.fromEntries(
            cookieHeader.split(';').map((c) => {
              const [k, ...v] = c.trim().split('=');
              return [k, v.join('=')];
            })
          );
          const token =
            cookies.admin_session ||
            req.headers['authorization']?.replace('Bearer ', '') ||
            null;

          interface AuthRequestBody {
            email?: string;
            challengeId?: string;
            otp?: string;
          }

          // Helper to read JSON body
          const readJsonBody = (): Promise<AuthRequestBody> =>
            new Promise((resolve) => {
              let raw = '';
              req.on('data', (chunk) => {
                raw += chunk;
              });
              req.on('end', () => {
                try {
                  resolve(JSON.parse(raw || '{}'));
                } catch {
                  resolve({});
                }
              });
            });

          const url = req.url.split('?')[0];

          try {
            if (url === '/api/admin/auth/request-otp' && req.method === 'POST') {
              const body = await readJsonBody();
              const result = await requestOtp({ email: body.email, ip });
              res.statusCode = result.status;
              res.setHeader('Content-Type', 'application/json');
              return res.end(JSON.stringify(result.body));
            }

            if (url === '/api/admin/auth/resend-otp' && req.method === 'POST') {
              const body = await readJsonBody();
              const result = await resendOtp({ challengeId: body.challengeId, ip });
              res.statusCode = result.status;
              res.setHeader('Content-Type', 'application/json');
              return res.end(JSON.stringify(result.body));
            }

            if (url === '/api/admin/auth/verify-otp' && req.method === 'POST') {
              const body = await readJsonBody();
              const result = await verifyOtp({ challengeId: body.challengeId, otp: body.otp || '', email: body.email, ip });
              if (result.token) {
                res.setHeader(
                  'Set-Cookie',
                  `admin_session=${result.token}; HttpOnly; SameSite=Lax; Path=/; Max-Age=28800`
                );
                res.statusCode = result.status;
                res.setHeader('Content-Type', 'application/json');
                return res.end(JSON.stringify({ ...result.body, token: result.token }));
              }
              res.statusCode = result.status;
              res.setHeader('Content-Type', 'application/json');
              return res.end(JSON.stringify(result.body));
            }

            if (url === '/api/admin/auth/session' && req.method === 'GET') {
              const session = verifySession(token);
              if (!session.authenticated) {
                res.statusCode = 401;
                res.setHeader('Content-Type', 'application/json');
                return res.end(JSON.stringify({ authenticated: false }));
              }
              res.statusCode = 200;
              res.setHeader('Content-Type', 'application/json');
              return res.end(JSON.stringify({ authenticated: true, email: session.email }));
            }

            if (url === '/api/admin/auth/logout' && req.method === 'POST') {
              logoutSession(token);
              res.setHeader(
                'Set-Cookie',
                'admin_session=; HttpOnly; SameSite=Lax; Path=/; Max-Age=0'
              );
              res.statusCode = 200;
              res.setHeader('Content-Type', 'application/json');
              return res.end(JSON.stringify({ success: true, message: 'Logged out successfully.' }));
            }

            // Unmatched auth endpoint
            res.statusCode = 404;
            res.setHeader('Content-Type', 'application/json');
            return res.end(JSON.stringify({ error: 'Auth route not found' }));
          } catch (err) {
            console.error('[VITE AUTH ERROR]', err);
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            return res.end(JSON.stringify({ error: 'Internal server error' }));
          }
        });
      },
    },
  ],
});
