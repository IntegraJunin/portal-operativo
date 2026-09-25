export function middleware(request) {
  const url = new URL(request.url);

  // Proteger únicamente la ruta /editor.html
  if (url.pathname.endsWith('/editor.html')) {
    const authHeader = request.headers.get('authorization');

    if (authHeader) {
      // Decodificar credenciales HTTP Basic Auth
      const authValue = authHeader.split(' ')[1];
      const [user, pwd] = atob(authValue).split(':');

      // Comprobar credenciales de administrador (usa la variable de Vercel o la clave por defecto)
      const adminPwd = process.env.ADMIN_PASSWORD || 'Integra2026';
      if (user === 'admin' && pwd === adminPwd) {
        return; // Permite el acceso a editor.html
      }
    }

    // Si no envió credenciales o son incorrectas, el servidor solicita login
    return new Response('Acceso restringido al Portal de Administración INTEGRA', {
      status: 401,
      headers: {
        'WWW-Authenticate': 'Basic realm="Portal Operativo INTEGRA"',
      },
    });
  }
}

export const config = {
  matcher: '/editor.html',
};