export const config = {
  // Asegúrate de que el matcher coincida con la ruta exacta de tu archivo
  matcher: ['/editor.html', '/editor'], 
};

export default function middleware(request) {
  const authHeader = request.headers.get('authorization');

  // Si no hay encabezado de autorización, pide credenciales
  if (!authHeader) {
    return new Response('Autenticación requerida', {
      status: 401,
      headers: { 'WWW-Authenticate': 'Basic realm="Acceso al Editor"' },
    });
  }

  try {
    // Decodificar el formato "Basic dXN1YXJpbzpjb250cmFzZcOxYQ=="
    const authValue = authHeader.split(' ')[1];
    const [user, password] = atob(authValue).split(':');

    // Reemplaza por tu usuario y contraseña deseados
    if (user === 'admin' && password === 'secreto123') {
      // Retornar vacío permite que la petición continúe normalmente
      return; 
    }
  } catch (error) {
    // Si atob() falla porque el formato es inválido, evitamos el error 500
    console.error("Error al decodificar credenciales:", error);
  }

  // Si las credenciales son incorrectas o hubo un error
  return new Response('Acceso denegado', {
    status: 401,
    headers: { 'WWW-Authenticate': 'Basic realm="Acceso al Editor"' },
  });
}