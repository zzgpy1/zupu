import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken } from '@/lib/auth';

const publicPaths = ['/login', '/api/auth/login'];

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // 公开路径放行
  if (publicPaths.some(p => path.startsWith(p))) {
    return NextResponse.next();
  }

  // 静态资源放行
  if (path.startsWith('/_next') || path.includes('favicon.ico')) {
    return NextResponse.next();
  }

  const token = request.cookies.get('auth_token')?.value;
  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  const payload = await verifyToken(token);
  if (!payload) {
    const response = NextResponse.redirect(new URL('/login', request.url));
    response.cookies.delete('auth_token');
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
