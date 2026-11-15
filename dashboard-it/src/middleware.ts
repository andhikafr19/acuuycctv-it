import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyAdminToken, COOKIE_NAME } from '@/lib/auth';

function applySecurityHeaders(response: NextResponse, isProtected = false): NextResponse {
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  response.headers.set('X-DNS-Prefetch-Control', 'off');
  if (isProtected) {
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');
  }
  return response;
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Lewati asset statis Next.js & file publik
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/images') ||
    pathname.startsWith('/favicon') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  // Izinkan endpoint autentikasi
  if (pathname.startsWith('/api/auth')) {
    return applySecurityHeaders(NextResponse.next(), true);
  }

  const token = request.cookies.get(COOKIE_NAME)?.value;
  const isAuthenticated = await verifyAdminToken(token);

  // Jika membuka halaman /login
  if (pathname.startsWith('/login')) {
    if (isAuthenticated) {
      const redirectParam = request.nextUrl.searchParams.get('redirect');
      const safeRedirect =
        redirectParam && redirectParam.startsWith('/') && !redirectParam.startsWith('//')
          ? redirectParam
          : '/';
      return applySecurityHeaders(NextResponse.redirect(new URL(safeRedirect, request.url)));
    }
    return applySecurityHeaders(NextResponse.next());
  }

  // Proteksi seluruh halaman dashboard dan API internal
  if (!isAuthenticated) {
    if (pathname.startsWith('/api/')) {
      return applySecurityHeaders(
        NextResponse.json(
          { success: false, error: 'Unauthorized: Sesi tidak valid atau telah berakhir. Silakan login kembali.' },
          { status: 401 }
        ),
        true
      );
    }

    const loginUrl = new URL('/login', request.url);
    if (pathname !== '/') {
      loginUrl.searchParams.set('redirect', pathname);
    }
    return applySecurityHeaders(NextResponse.redirect(loginUrl), true);
  }

  return applySecurityHeaders(NextResponse.next(), true);
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};

