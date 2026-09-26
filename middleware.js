export const config = {
  matcher: ['/editor.html', '/editor'],
};

export default function middleware(request) {
  const cookieHeader = request.headers.get('cookie') || '';

  // Verificamos si la cookie existe
  if (cookieHeader.includes('admin_session=autorizado')) {
    // Esta es la forma oficial en Vercel para decirle "déjalo pasar"
    return new Response(null, {
      headers: { 'x-middleware-next': '1' }
    });
  }

  // Si no está la cookie, rebota al usuario a la página de login
  const url = new URL('/login.html', request.url);
  return Response.redirect(url, 302);
}