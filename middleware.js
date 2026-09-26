export const config = {
  matcher: ['/editor.html', '/editor'],
};

export default function middleware(request) {
  // Obtenemos las cookies del navegador
  const cookieHeader = request.headers.get('cookie') || '';

  // Verificamos si existe la cookie que daremos en el login
  if (cookieHeader.includes('admin_session=autorizado')) {
    // Retornar vacío deja que la petición cargue el editor.html
    return;
  }

  // Si no está la cookie, redirigimos a la página de login personalizada
  const url = new URL('/login.html', request.url);
  return Response.redirect(url, 302);
}