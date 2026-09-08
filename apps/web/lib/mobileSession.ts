/**
 * Session tokens for the khh-mobile app.
 *
 * A hand-rolled compact HS256 JWT (header.payload.signature, base64url,
 * HMAC-SHA256) using only Node's built-in `crypto` — no new dependency
 * for a single sign/verify pair. Structurally a real JWT, so any
 * standard JWT tool can inspect it, but we don't pull in a library to
 * produce it.
 */
import { createHmac, timingSafeEqual } from 'crypto';

export interface MobileSessionPayload {
  hn: string;
  role: 'patient' | 'caregiver';
  iat: number;
  exp: number;
}

const SESSION_TTL_SECONDS = 60 * 60 * 24 * 30; // 30 days

function getSecret(): string {
  const secret = process.env.SESSION_SECRET;
  if (!secret) {
    throw new Error('SESSION_SECRET is not configured');
  }
  return secret;
}

function base64url(input: Buffer | string): string {
  return Buffer.from(input)
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

function base64urlDecode(input: string): Buffer {
  const padded = input.replace(/-/g, '+').replace(/_/g, '/').padEnd(Math.ceil(input.length / 4) * 4, '=');
  return Buffer.from(padded, 'base64');
}

function sign(data: string): string {
  return base64url(createHmac('sha256', getSecret()).update(data).digest());
}

export function createMobileSession(hn: string, role: 'patient' | 'caregiver' = 'patient'): string {
  const header = base64url(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const now = Math.floor(Date.now() / 1000);
  const payload = base64url(
    JSON.stringify({ hn, role, iat: now, exp: now + SESSION_TTL_SECONDS } satisfies MobileSessionPayload)
  );
  const signature = sign(`${header}.${payload}`);
  return `${header}.${payload}.${signature}`;
}

export function verifyMobileSession(token: string | null | undefined): MobileSessionPayload | null {
  if (!token) return null;
  const parts = token.split('.');
  if (parts.length !== 3) return null;
  const [header, payload, signature] = parts;

  try {
    const expected = sign(`${header}.${payload}`);
    const a = Buffer.from(signature);
    const b = Buffer.from(expected);
    if (a.length !== b.length || !timingSafeEqual(a, b)) return null;

    const decoded = JSON.parse(base64urlDecode(payload).toString('utf8')) as MobileSessionPayload;
    if (!decoded.exp || decoded.exp < Math.floor(Date.now() / 1000)) return null;
    if (!decoded.hn) return null;
    return decoded;
  } catch {
    return null;
  }
}

/** Pulls the bearer token out of a standard Authorization header. */
export function getBearerToken(request: Request): string | null {
  const header = request.headers.get('authorization') || request.headers.get('Authorization');
  if (!header || !header.startsWith('Bearer ')) return null;
  return header.slice('Bearer '.length).trim();
}
