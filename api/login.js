// api/login.js
export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Método no permitido' });
  }

  const { user, password } = req.body;

  // Compara con la variable de entorno de Vercel
  const adminPwd = process.env.ADMIN_PASSWORD || 'Integra2026';

  if (user === 'admin' && password === adminPwd) {
    // Establece la cookie de sesión desde el servidor (HTTP-Only para mayor seguridad)
    res.setHeader(
      'Set-Cookie',
      `admin_session=authenticated; Path=/; Max-Age=86400; SameSite=Lax; HttpOnly`
    );
    return res.status(200).json({ success: true });
  }

  return res.status(401).json({ success: false, message: 'Usuario o contraseña incorrectos' });
}