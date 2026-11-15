const COOKIE_NAME = 'acuuy_admin_token';
// Durasi sesi login (default: 7 hari). Dapat diubah langsung di sini atau melalui env ADMIN_SESSION_DAYS.
const SESSION_DAYS = Number(process.env.ADMIN_SESSION_DAYS) > 0 ? Number(process.env.ADMIN_SESSION_DAYS) : 7;
const SESSION_DURATION_SECONDS = SESSION_DAYS * 24 * 60 * 60; // 7 hari (dalam detik)

export interface AdminTokenPayload {
  email: string;
  role: 'admin';
  iat: number;
  exp: number;
  jti: string;
}

function base64UrlEncode(str: string): string {
  return btoa(str).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function base64UrlDecode(str: string): string {
  let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
  while (base64.length % 4) base64 += '=';
  return atob(base64);
}

function getJwtSecret(): string {
  const secret = process.env.ADMIN_JWT_SECRET;
  if (!secret || secret.length < 32) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('Server misconfiguration: ADMIN_JWT_SECRET must be set and at least 32 characters.');
    }
    return 'dev-only-fallback-secret-do-not-use-in-production-acuuycctv';
  }
  return secret;
}

async function getHmacKey(): Promise<CryptoKey> {
  const secret = getJwtSecret();
  const enc = new TextEncoder();
  return await crypto.subtle.importKey(
    'raw',
    enc.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign', 'verify']
  );
}

/**
 * Constant-time string comparison via HMAC-SHA256 to prevent timing attacks
 */
export async function safeCompare(a: string, b: string): Promise<boolean> {
  const enc = new TextEncoder();
  const key = await getHmacKey();
  const [sigA, sigB] = await Promise.all([
    crypto.subtle.sign('HMAC', key, enc.encode(a)),
    crypto.subtle.sign('HMAC', key, enc.encode(b)),
  ]);
  const bytesA = new Uint8Array(sigA);
  const bytesB = new Uint8Array(sigB);
  if (bytesA.length !== bytesB.length) return false;
  let diff = 0;
  for (let i = 0; i < bytesA.length; i++) {
    diff |= bytesA[i] ^ bytesB[i];
  }
  return diff === 0 && a.length === b.length;
}

export async function createAdminToken(email: string): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  const header = base64UrlEncode(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const payloadObj: AdminTokenPayload = {
    email,
    role: 'admin',
    iat: now,
    exp: now + SESSION_DURATION_SECONDS,
    jti: crypto.randomUUID(),
  };
  const payload = base64UrlEncode(JSON.stringify(payloadObj));

  const key = await getHmacKey();
  const enc = new TextEncoder();
  const signatureBuffer = await crypto.subtle.sign(
    'HMAC',
    key,
    enc.encode(`${header}.${payload}`)
  );

  const bytes = new Uint8Array(signatureBuffer);
  let binary = '';
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }

  const signature = base64UrlEncode(binary);
  return `${header}.${payload}.${signature}`;
}

export async function verifyAdminTokenPayload(
  token: string | undefined | null
): Promise<AdminTokenPayload | null> {
  if (!token) return null;
  const parts = token.split('.');
  if (parts.length !== 3) return null;

  const [header, payload, signature] = parts;

  try {
    const key = await getHmacKey();
    const enc = new TextEncoder();

    const binarySig = base64UrlDecode(signature);
    const sigBytes = new Uint8Array(binarySig.length);
    for (let i = 0; i < binarySig.length; i++) {
      sigBytes[i] = binarySig.charCodeAt(i);
    }

    const valid = await crypto.subtle.verify(
      'HMAC',
      key,
      sigBytes,
      enc.encode(`${header}.${payload}`)
    );

    if (!valid) return null;

    const data = JSON.parse(base64UrlDecode(payload)) as AdminTokenPayload;
    const now = Math.floor(Date.now() / 1000);
    if (!data.exp || data.exp < now) return null;
    if (data.role !== 'admin' || !data.email) return null;

    return data;
  } catch {
    return null;
  }
}

export async function verifyAdminToken(token: string | undefined | null): Promise<boolean> {
  const payload = await verifyAdminTokenPayload(token);
  return payload !== null;
}

export function getCookieFromRequest(request: Request, name = COOKIE_NAME): string | null {
  const cookieHeader = request.headers.get('cookie');
  if (!cookieHeader) return null;
  const cookies = cookieHeader.split(';');
  for (const cookie of cookies) {
    const [k, ...v] = cookie.trim().split('=');
    if (k === name) {
      return decodeURIComponent(v.join('='));
    }
  }
  return null;
}

export async function verifyRequestAuth(request: Request): Promise<AdminTokenPayload | null> {
  const token = getCookieFromRequest(request, COOKIE_NAME);
  return await verifyAdminTokenPayload(token);
}

/**
 * Validate Origin/Host header on state-changing requests to mitigate CSRF
 */
export function verifyCsrfOrigin(request: Request): boolean {
  const method = request.method.toUpperCase();
  if (method === 'GET' || method === 'HEAD' || method === 'OPTIONS') return true;

  const origin = request.headers.get('origin');
  const host = request.headers.get('host');
  if (!origin || !host) return true;

  try {
    const originUrl = new URL(origin);
    return originUrl.host === host;
  } catch {
    return false;
  }
}

export { COOKIE_NAME, SESSION_DURATION_SECONDS };
