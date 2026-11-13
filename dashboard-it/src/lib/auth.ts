const COOKIE_NAME = 'acuuy_admin_token';
const DEFAULT_SECRET = '628445946cd6480c9bde6f1d5ec7491367fd82e3a02aa44def4881fb1f78a001';

function base64UrlEncode(str: string): string {
  return btoa(str).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function base64UrlDecode(str: string): string {
  let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
  while (base64.length % 4) base64 += '=';
  return atob(base64);
}

async function getHmacKey(): Promise<CryptoKey> {
  const secret = process.env.ADMIN_JWT_SECRET || DEFAULT_SECRET;
  const enc = new TextEncoder();
  return await crypto.subtle.importKey(
    'raw',
    enc.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign', 'verify']
  );
}

export async function createAdminToken(email: string): Promise<string> {
  const header = base64UrlEncode(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const payload = base64UrlEncode(
    JSON.stringify({
      email,
      role: 'admin',
      exp: Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60, // 7 hari
    })
  );

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

export async function verifyAdminToken(token: string | undefined | null): Promise<boolean> {
  if (!token) return false;
  const parts = token.split('.');
  if (parts.length !== 3) return false;

  const [header, payload, signature] = parts;

  try {
    const key = await getHmacKey();
    const enc = new TextEncoder();

    // Verify signature
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

    if (!valid) return false;

    const data = JSON.parse(base64UrlDecode(payload));
    if (data.exp && data.exp < Math.floor(Date.now() / 1000)) return false;
    return data.role === 'admin';
  } catch {
    return false;
  }
}

export { COOKIE_NAME };
