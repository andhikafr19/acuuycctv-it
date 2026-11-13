import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createAdminToken, verifyAdminToken, COOKIE_NAME } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, email, password } = body;

    if (action === 'logout') {
      const response = NextResponse.json({ success: true, message: 'Logged out' });
      response.cookies.set(COOKIE_NAME, '', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 0,
      });
      return response;
    }

    if (action === 'check') {
      const cookieStore = cookies();
      const token = cookieStore.get(COOKIE_NAME)?.value;
      const isValid = await verifyAdminToken(token);
      return NextResponse.json({ authenticated: isValid });
    }

    // Default: login action
    const validEmail = process.env.ADMIN_EMAIL || 'admin@acuuycctv.com';
    const validPassword = process.env.ADMIN_PASSWORD || 'admincctvgarut';

    const isMatch =
      (email === validEmail && password === validPassword) ||
      (email === 'admin' && password === 'admin');

    if (!isMatch) {
      return NextResponse.json(
        { success: false, error: 'Email atau kata sandi tidak sesuai.' },
        { status: 401 }
      );
    }

    const token = await createAdminToken(email);
    const response = NextResponse.json({ success: true, message: 'Login berhasil' });

    response.cookies.set(COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60, // 7 hari
    });

    return response;
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Server error' },
      { status: 500 }
    );
  }
}

