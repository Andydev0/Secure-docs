import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request });
  const { pathname } = request.nextUrl;

  // Lista de rotas que não precisam de autenticação
  const publicPaths = ['/auth/signin', '/auth/signup'];
  const isPublicPath = publicPaths.some(path => pathname.startsWith(path));

  // Se está em uma rota pública, permite o acesso
  if (isPublicPath) {
    return NextResponse.next();
  }

  // Se não está autenticado e não é uma rota pública, redireciona para login
  if (!token) {
    return NextResponse.redirect(new URL('/auth/signin', request.url));
  }

  // Se está tentando acessar rotas de admin sem ser admin
  if (pathname.startsWith('/admin') && token.role !== 'ADMIN') {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * 1. /api/auth/* (authentication routes)
     * 2. /_next/* (Next.js internals)
     * 3. /fonts/* (static font files)
     * 4. /icons/* (static icon files)
     * 5. /images/* (static image files)
     * 6. /favicon.ico, /sitemap.xml (static files)
     */
    '/((?!api/auth|_next|fonts|icons|images|favicon.ico|sitemap.xml).*)',
  ],
};
