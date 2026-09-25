export default function middleware(request) {
  const url = new URL(request.url);

  // Proteger únicamente la ruta /editor.html
  if (url.pathname.endsWith('/editor.html')) {
    const authHeader = request.headers.get('authorization');

    if (authHeader && authHeader.startsWith('Basic ')) {
      try {
        // Decodificar credenciales HTTP Basic Auth
        const authValue = authHeader.split(' ')[1];
        const [user, pwd] = atob(authValue).split(':');

        // Comprobar credenciales
        const adminPwd = process.env.ADMIN_PASSWORD || 'Integra2026';
        if (user === 'admin' && pwd === adminPwd) {
          return; // Permite el acceso a editor.html
        }
      } catch (err) {
        // Si el token enviado no es base64 válido, continúa para solicitar credenciales de nuevo
      }
    }

    // Si no envió credenciales o son incorrectas, solicita login
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