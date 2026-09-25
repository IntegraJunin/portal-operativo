import { NextResponse } from 'next/server';

export default function middleware(request) {
  const url = new URL(request.url);

  if (url.pathname.endsWith('/editor.html')) {
    const authCookie = request.cookies.get('admin_session')?.value;

    // Si la cookie es válida, permite entrar a editor.html
    if (authCookie === 'authenticated') {
      return NextResponse.next();
    }

    // Si no está autenticado, lo devuelve a la página principal
    return NextResponse.redirect(new URL('/', request.url));
  }
}

export const config = {
  matcher: '/editor.html',
};