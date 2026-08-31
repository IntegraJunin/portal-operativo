// Candado simple de acceso para el Portal Operativo INTEGRA.
// Aviso: al ser un sitio estático (GitHub Pages), esto NO es seguridad real:
// cualquiera que abra las herramientas de desarrollador puede ver el usuario
// y la contraseña en este archivo. Sirve solo para que no entre cualquiera
// por casualidad. Para control de acceso real hace falta un servicio como
// Cloudflare Access delante del sitio.
(function () {
    const USUARIO = 'Integra';
    const CLAVE = 'Integra2026';
    const CLAVE_STORAGE = 'integra_portal_auth_ok';

    const yaAutenticado = sessionStorage.getItem(CLAVE_STORAGE) === 'si';

    const estilos = document.createElement('style');
    estilos.textContent = `
        #integra-login-overlay {
            position: fixed; inset: 0; z-index: 99999;
            background: #f7f5f0;
            display: flex; align-items: center; justify-content: center;
            font-family: 'Comfortaa', cursive;
            padding: 1.5rem;
        }
        #integra-login-overlay .caja {
            background: #ffffff;
            border-radius: 2rem;
            padding: 2.5rem 2rem;
            max-width: 360px;
            width: 100%;
            box-shadow: 0 4px 20px rgba(0,0,0,0.06);
            text-align: center;
        }
        #integra-login-overlay h1 {
            font-family: 'Outfit', sans-serif;
            font-weight: 800;
            font-size: 2rem;
            color: #5c4b3f;
            margin: 0 0 .25rem;
        }
        #integra-login-overlay p.sub {
            color: #9a8d7d; font-weight: 600; font-size: .85rem; margin: 0 0 1.5rem;
        }
        #integra-login-overlay input {
            width: 100%; box-sizing: border-box;
            padding: .8rem 1rem; margin-bottom: .7rem;
            border-radius: 999px; border: 1px solid #e7e2d6;
            font-family: 'Comfortaa', cursive; font-weight: 600;
            outline: none; background: #fcfbfa;
        }
        #integra-login-overlay input:focus { box-shadow: 0 0 0 3px #efeadd; }
        #integra-login-overlay button {
            width: 100%; border: none; cursor: pointer;
            padding: .85rem 1rem; border-radius: 999px;
            background: #5c4b3f; color: #fff;
            font-family: 'Outfit', sans-serif; font-weight: 700; font-size: .95rem;
            margin-top: .3rem;
        }
        #integra-login-overlay button:hover { background: #47392f; }
        #integra-login-overlay .error {
            color: #b3543b; font-weight: 700; font-size: .82rem; margin-top: .8rem; min-height: 1.1em;
        }
    `;
    document.head.appendChild(estilos);

    if (yaAutenticado) return; // no bloquea nada, sigue cargando la página normal

    // Oculta el contenido real hasta que se autentique
    document.documentElement.style.visibility = 'hidden';

    window.addEventListener('DOMContentLoaded', () => {
        const overlay = document.createElement('div');
        overlay.id = 'integra-login-overlay';
        overlay.innerHTML = `
            <div class="caja">
                <h1>integra ✳</h1>
                <p class="sub">Acceso al Portal Operativo</p>
                <input type="text" id="integra-login-user" placeholder="Usuario" autocomplete="username">
                <input type="password" id="integra-login-pass" placeholder="Contraseña" autocomplete="current-password">
                <button id="integra-login-btn">Ingresar</button>
                <div class="error" id="integra-login-error"></div>
            </div>`;
        document.body.appendChild(overlay);
        document.documentElement.style.visibility = 'visible';

        const inputUser = document.getElementById('integra-login-user');
        const inputPass = document.getElementById('integra-login-pass');
        const errorBox = document.getElementById('integra-login-error');

        function intentarIngresar() {
            if (inputUser.value === USUARIO && inputPass.value === CLAVE) {
                sessionStorage.setItem(CLAVE_STORAGE, 'si');
                overlay.remove();
            } else {
                errorBox.textContent = 'Usuario o contraseña incorrectos.';
                inputPass.value = '';
            }
        }

        document.getElementById('integra-login-btn').addEventListener('click', intentarIngresar);
        [inputUser, inputPass].forEach(inp => {
            inp.addEventListener('keydown', e => { if (e.key === 'Enter') intentarIngresar(); });
        });
        inputUser.focus();
    });
})();
