export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Método no permitido' });
  }

  // 1. Validar autenticación mediante Cookie HttpOnly
  const cookies = req.headers.cookie || '';
  const authSecret = process.env.AUTH_SECRET || 'clave_secreta_integra_2026';

  if (!cookies.includes(`auth_token=${authSecret}`)) {
    return res.status(401).json({ message: 'No autorizado. Debe iniciar sesión.' });
  }

  try {
    const owner = process.env.GITHUB_OWNER || 'integrajunin';
    const repo = process.env.GITHUB_REPO || 'portal-operativo';
    const branch = process.env.GITHUB_BRANCH || 'main';
    const token = process.env.GITHUB_TOKEN;

    const headers = {
      'Accept': 'application/vnd.github.v3+json',
      'User-Agent': 'INTEGRA-Portal-App'
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    // Petición servidor-a-servidor (Node.js procesa la redirección de GitHub internamente sin CORS)
    const githubRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/zipball/${branch}`, {
      headers,
      redirect: 'follow'
    });

    if (!githubRes.ok) {
      return res.status(githubRes.status).json({ 
        message: `Error de GitHub (${githubRes.status}). Verifique permisos del repositorio o PAT.` 
      });
    }

    // Recibimos el archivo binario y lo enviamos al navegador como descarga nativa
    const arrayBuffer = await githubRes.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    res.setHeader('Content-Type', 'application/zip');
    res.setHeader('Content-Disposition', `attachment; filename="${repo}-backup.zip"`);
    return res.status(200).send(buffer);

  } catch (error) {
    console.error('Error en /api/backup:', error);
    return res.status(500).json({ message: 'Error interno al generar el backup.' });
  }
}