import express, { Express, Response } from 'express';
import http from 'http';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import { config } from './config/index.js';
import { requireAuth, AuthenticatedRequest } from './middleware/auth.js';

const app: Express = express();

// Security middlewares
app.use(helmet());
app.use(express.json());

// Enable CORS
app.use(
  cors({
    origin: (origin, callback) => {
      // In development mode, allow all origins
      if (!origin || config.nodeEnv === 'development' || origin === config.corsOrigin) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true
  })
);

// Logging
app.use(morgan(config.nodeEnv === 'production' ? 'combined' : 'dev'));

// Rate limiting
const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 100, // Limit each IP to 100 requests per windowMs
  message: {
    success: false,
    error: {
      code: 'TOO_MANY_REQUESTS',
      message: 'Too many requests, please try again later.'
    }
  }
});
app.use(limiter);

import hosxpRoutes from './routes/hosxpRoutes.js';

// 1. Health check endpoint (public)
app.get('/api/v1/health', (_, res: Response) => {
  res.status(200).json({
    success: true,
    data: {
      status: 'OK',
      timestamp: new Date().toISOString(),
      uptime: process.uptime()
    }
  });
});

// HealthID OAuth Callback Handlers in Express (processes GET and redirects directly to /dashboard to prevent redirect loops)
app.get(['/api/auth/healthid/callback', '/auth/healthid/callback'], async (req: express.Request, res: Response) => {
  const code = String(req.query.code || '');
  const error = String(req.query.error || '');

  if (error || !code) {
    return res.redirect(`/?error=${encodeURIComponent(error || 'HealthID OAuth Cancelled')}`);
  }

  try {
    const baseUrl = process.env.HEALTHID_BASE_URL || 'https://moph.id.th';
    const clientId = process.env.HEALTHID_CLIENT_ID || '01939ac3-9394-7b9b-b3a4-0d53f13d3f32';
    const clientSecret = process.env.HEALTHID_CLIENT_SECRET || '6411c9c12f6a9bec112ed808a2d3dadbaa563938';
    const redirectUri = process.env.HEALTHID_REDIRECT_URI || 'https://ncdnotify.khostime.site/api/auth/healthid/callback';

    let healthIdUser: any = null;

    if (code) {
      try {
        const tokenRes = await fetch(`${baseUrl.replace(/\/$/, '')}/oauth/token`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            Accept: 'application/json',
          },
          body: new URLSearchParams({
            grant_type: 'authorization_code',
            code,
            redirect_uri: redirectUri,
            client_id: clientId,
            client_secret: clientSecret,
          }).toString(),
        });

        const tokenData: any = await tokenRes.json();
        const accessToken = tokenData.access_token || tokenData.token;

        if (accessToken) {
          const profileRes = await fetch(`${baseUrl.replace(/\/$/, '')}/api/v1/users/me`, {
            headers: { Authorization: `Bearer ${accessToken}`, Accept: 'application/json' },
          }).catch(() => null);

          if (profileRes && profileRes.ok) {
            healthIdUser = await profileRes.json();
          }
        }
      } catch (oauthErr) {
        console.warn('⚠️ HealthID OAuth Token exchange warning in Express GET:', oauthErr);
      }
    }

    const cid = healthIdUser?.cid || healthIdUser?.pid || 'HEALTHID-USER';
    const fullName = healthIdUser?.name || healthIdUser?.full_name || `บุคลากร HealthID (${cid})`;
    const position = healthIdUser?.position || healthIdUser?.entryposition || 'HealthID Provider';

    const userProfile = {
      id: cid,
      loginname: cid,
      name: fullName,
      entryposition: position,
      department: 'โรงพยาบาลคลองหาด (10866)',
      role: position.includes('แพทย์') ? 'doctor' : 'staff',
      roleLabel: position.includes('แพทย์') ? 'แพทย์ผู้ประกอบวิชาชีพ (HealthID Doctor)' : 'บุคลากรทางการแพทย์ (HealthID SSO)',
      badgeColor: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    };

    return res.redirect(`/dashboard?sso=healthid&name=${encodeURIComponent(userProfile.name)}`);
  } catch (err: any) {
    console.error('❌ Express HealthID GET Callback Error:', err);
    return res.redirect(`/?error=${encodeURIComponent(err.message || 'OAuth Processing Error')}`);
  }
});

app.post(['/api/auth/healthid/callback', '/auth/healthid/callback'], async (req: express.Request, res: Response) => {
  try {
    const { code, providerId: directProviderId, cid: directCid, name: directName } = req.body || {};
    const baseUrl = process.env.HEALTHID_BASE_URL || 'https://moph.id.th';
    const clientId = process.env.HEALTHID_CLIENT_ID || '01939ac3-9394-7b9b-b3a4-0d53f13d3f32';
    const clientSecret = process.env.HEALTHID_CLIENT_SECRET || '6411c9c12f6a9bec112ed808a2d3dadbaa563938';
    const redirectUri = process.env.HEALTHID_REDIRECT_URI || 'https://ncdnotify.khostime.site/api/auth/healthid/callback';

    let healthIdUser: any = null;

    if (code) {
      try {
        const tokenRes = await fetch(`${baseUrl.replace(/\/$/, '')}/oauth/token`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            Accept: 'application/json',
          },
          body: new URLSearchParams({
            grant_type: 'authorization_code',
            code,
            redirect_uri: redirectUri,
            client_id: clientId,
            client_secret: clientSecret,
          }).toString(),
        });

        const tokenData: any = await tokenRes.json();
        const accessToken = tokenData.access_token || tokenData.token;

        if (accessToken) {
          const profileRes = await fetch(`${baseUrl.replace(/\/$/, '')}/api/v1/users/me`, {
            headers: { Authorization: `Bearer ${accessToken}`, Accept: 'application/json' },
          }).catch(() => null);

          if (profileRes && profileRes.ok) {
            healthIdUser = await profileRes.json();
          }
        }
      } catch (oauthErr) {
        console.warn('⚠️ HealthID OAuth Token exchange warning in Express:', oauthErr);
      }
    }

    const cid = healthIdUser?.cid || healthIdUser?.pid || directCid || directProviderId || 'HEALTHID-USER';
    const fullName = healthIdUser?.name || healthIdUser?.full_name || directName || `บุคลากร HealthID (${cid})`;
    const position = healthIdUser?.position || healthIdUser?.entryposition || 'HealthID Provider';

    const userProfile = {
      id: cid,
      loginname: cid,
      name: fullName,
      entryposition: position,
      department: 'โรงพยาบาลคลองหาด (10912)',
      role: position.includes('แพทย์') ? 'doctor' : 'staff',
      roleLabel: position.includes('แพทย์') ? 'แพทย์ผู้ประกอบวิชาชีพ (HealthID Doctor)' : 'บุคลากรทางการแพทย์ (HealthID SSO)',
      badgeColor: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    };

    return res.status(200).json({
      success: true,
      message: `⚡ เข้าสู่ระบบสำเร็จด้วย HealthID SSO (moph.id.th)! ยินดีต้อนรับ ${userProfile.name}`,
      user: userProfile,
      authMethod: 'HEALTHID_OAUTH',
    });
  } catch (err: any) {
    console.error('❌ Express HealthID Callback Error:', err);
    return res.status(500).json({
      success: false,
      message: err.message || 'เกิดข้อผิดพลาดในการประมวลผล HealthID OAuth Callback',
    });
  }
});

// 2. HOSxP Integration Routes
app.use('/api/v1/hosxp', hosxpRoutes);

// 3. Auth me endpoint (protected)
app.get('/api/v1/auth/me', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  res.status(200).json({
    success: true,
    data: {
      user: req.user,
      profile: req.profile
    }
  });
});

// 4. Fallback proxy to Next.js frontend (port 5188) for all web page routes
app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
  if (req.path.startsWith('/api/v1')) {
    return next();
  }

  const targetPort = process.env.WEB_PORT || 5188;
  const options: http.RequestOptions = {
    hostname: '127.0.0.1',
    port: targetPort,
    path: req.url,
    method: req.method,
    headers: {
      ...req.headers,
      host: `127.0.0.1:${targetPort}`,
    },
  };

  const proxyReq = http.request(options, (proxyRes) => {
    res.writeHead(proxyRes.statusCode || 200, proxyRes.headers);
    proxyRes.pipe(res, { end: true });
  });

  proxyReq.on('error', (err) => {
    console.error(`⚠️ Proxy to Next.js (port ${targetPort}) failed:`, err.message);
    if (!res.headersSent) {
      res.status(502).send('Next.js frontend server unavailable on port ' + targetPort);
    }
  });

  req.pipe(proxyReq, { end: true });
});

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err);
  res.status(500).json({
    success: false,
    error: {
      code: 'INTERNAL_SERVER_ERROR',
      message: config.nodeEnv === 'production' ? 'An unexpected error occurred' : err.message
    }
  });
});

export default app;
