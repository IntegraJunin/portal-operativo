export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Método no permitido' });

  const { password, baseDeDatos } = req.body;

  // 1. Validar la contraseña en el servidor
  if (password !== process.env.ADMIN_PASSWORD) {
    return res.status(401).json({ error: 'Contraseña incorrecta' });
  }

  // 2. Usar el token guardado en Vercel (nunca visible para el usuario)
  const token = process.env.GITHUB_TOKEN;
  const owner = 'integrajunin'; // Tu usuario/org de GitHub
  const repo = 'tu-repositorio'; // Tu repositorio
  const path = 'precios.json';

  try {
    // Obtener SHA actual
    const getRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${path}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const getData = await getRes.json();

    // Guardar cambios en GitHub
    const putRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${path}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        message: `Actualización de precios (${new Date().toLocaleString()})`,
        content: Buffer.from(JSON.stringify(baseDeDatos, null, 2)).toString('base64'),
        sha: getData.sha
      })
    });

    if (!putRes.ok) throw new Error('Error guardando en GitHub');

    return res.status(200).json({ success: true });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}