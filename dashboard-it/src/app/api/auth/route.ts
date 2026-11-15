import { NextResponse } from 'next/server';
import {
  createAdminToken,
  verifyRequestAuth,
  verifyCsrfOrigin,
  safeCompare,
  COOKIE_NAME,
  SESSION_DURATION_SECONDS,
} from '@/lib/auth';

export const dynamic = 'force-dynamic';

// Rate limiter sederhana di memori untuk mencegah brute-force login
interface RateLimitEntry {
  count: number;
  resetAt: number;
}
const loginAttempts = new Map<string, RateLimitEntry>();
const MAX_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000; // 15 menit

function getClientIp(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) return forwarded.split(',')[0].trim();
  return request.headers.get('x-real-ip') || 'unknown-ip';
}

function checkRateLimit(ip: string): { allowed: boolean; retryAfterSec: number } {
  const now = Date.now();
  const entry = loginAttempts.get(ip);
  if (!entry || now > entry.resetAt) {
    return { allowed: true, retryAfterSec: 0 };
  }
  if (entry.count >= MAX_ATTEMPTS) {
    return {
      allowed: false,
      retryAfterSec: Math.ceil((entry.resetAt - now) / 1000),
    };
  }
  return { allowed: true, retryAfterSec: 0 };
}

function recordFailedAttempt(ip: string) {
  const now = Date.now();
  const entry = loginAttempts.get(ip);
  if (!entry || now > entry.resetAt) {
    loginAttempts.set(ip, { count: 1, resetAt: now + WINDOW_MS });
  } else {
    entry.count += 1;
  }
}

function clearAttempts(ip: string) {
  loginAttempts.delete(ip);
}

export async function GET(request: Request) {
  const payload = await verifyRequestAuth(request);
  if (!payload) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }
  return NextResponse.json({
    authenticated: true,
    user: { email: payload.email, role: payload.role },
  });
}

export async function POST(request: Request) {
  try {
    if (!verifyCsrfOrigin(request)) {
      return NextResponse.json(
        { success: false, error: 'Permintaan ditolak (Origin tidak valid).' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { action, email, password } = body;

    if (action === 'logout') {
      const response = NextResponse.json({ success: true, message: 'Berhasil keluar.' });
      response.cookies.set(COOKIE_NAME, '', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        path: '/',
        maxAge: 0,
      });
      return response;
    }

    if (action === 'check') {
      const payload = await verifyRequestAuth(request);
      return NextResponse.json({
        authenticated: Boolean(payload),
        user: payload ? { email: payload.email, role: payload.role } : null,
      });
    }

    // Validasi input login
    const ip = getClientIp(request);
    const rate = checkRateLimit(ip);
    if (!rate.allowed) {
      return NextResponse.json(
        {
          success: false,
          error: `Terlalu banyak percobaan login gagal. Silakan coba lagi dalam ${Math.ceil(rate.retryAfterSec / 60)} menit.`,
        },
        {
          status: 429,
          headers: { 'Retry-After': String(rate.retryAfterSec) },
        }
      );
    }

    if (typeof email !== 'string' || typeof password !== 'string' || !email.trim() || !password) {
      return NextResponse.json(
        { success: false, error: 'Email dan kata sandi wajib diisi.' },
        { status: 400 }
      );
    }

    const validEmail = process.env.ADMIN_EMAIL;
    const validPassword = process.env.ADMIN_PASSWORD;

    if (!validEmail || !validPassword) {
      console.error('[AUTH] ADMIN_EMAIL atau ADMIN_PASSWORD belum dikonfigurasi di environment variables.');
      return NextResponse.json(
        { success: false, error: 'Konfigurasi autentikasi server belum lengkap.' },
        { status: 500 }
      );
    }

    const normalizedEmail = email.trim().toLowerCase();
    const expectedEmail = validEmail.trim().toLowerCase();

    const [emailMatch, passwordMatch] = await Promise.all([
      safeCompare(normalizedEmail, expectedEmail),
      safeCompare(password, validPassword),
    ]);

    if (!emailMatch || !passwordMatch) {
      recordFailedAttempt(ip);
      return NextResponse.json(
        { success: false, error: 'Email atau kata sandi tidak sesuai.' },
        { status: 401 }
      );
    }

    clearAttempts(ip);

    const token = await createAdminToken(expectedEmail);
    const response = NextResponse.json({
      success: true,
      message: 'Login berhasil',
      user: { email: expectedEmail, role: 'admin' },
    });

    response.cookies.set(COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: SESSION_DURATION_SECONDS,
    });

    return response;
  } catch {
    return NextResponse.json(
      { success: false, error: 'Terjadi kesalahan pada server saat memproses autentikasi.' },
      { status: 500 }
    );
  }
}
