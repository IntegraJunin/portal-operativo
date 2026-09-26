export const config = {
  matcher: ['/editor.html', '/editor'],
};

export default function middleware(request) {
  const cookieHeader = request.headers.get('cookie') || '';
  const authSecret = process.env.AUTH_SECRET || 'clave_secreta_integra_2026';

  // Si contiene la cookie correcta, retornar nada (void) permite a Vercel servir el editor.html
  if (cookieHeader.includes(`auth_token=${authSecret}`)) {
    return;
  }

  // Si no está autenticado, redirige al login
  const url = new URL('/login.html', request.url);
  return Response.redirect(url, 302);
}