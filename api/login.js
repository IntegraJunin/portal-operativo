export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Método no permitido' });
  }

  const { user, password } = req.body || {};
  
  const validUser = process.env.ADMIN_USER || 'admin';
  const validPass = process.env.ADMIN_PASS || 'secreto123';
  const authSecret = process.env.AUTH_SECRET || 'clave_secreta_integra_2026';

  if (user === validUser && password === validPass) {
    // Inyecta la cookie HttpOnly de forma segura
    res.setHeader(
      'Set-Cookie', 
      `auth_token=${authSecret}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=86400`
    );
    return res.status(200).json({ success: true });
  }

  return res.status(401).json({ message: 'Usuario o contraseña incorrectos' });
}