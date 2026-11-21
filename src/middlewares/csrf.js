const crypto = require('crypto');
const { rutaInicial } = require('../config/roles');

const FORMATO_TOKEN = /^[a-f0-9]{64}$/;

function tokenCsrf(req, res, next) {
  if (!req.session.csrfToken) {
    req.session.csrfToken = crypto.randomBytes(32).toString('hex');
  }
  res.locals.csrfToken = req.session.csrfToken;
  next();
}

function verificarCsrf(req, res, next) {
  if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) return next();

  const enviado = req.body && req.body._csrf;
  const esperado = req.session.csrfToken;
  const valido =
    typeof enviado === 'string' &&
    FORMATO_TOKEN.test(enviado) &&
    typeof esperado === 'string' &&
    FORMATO_TOKEN.test(esperado) &&
    crypto.timingSafeEqual(Buffer.from(enviado), Buffer.from(esperado));

  if (valido) return next();

  if (req.method === 'POST' && ['/login', '/cambiar-clave'].includes(req.path)) {
    const usuario = req.session.usuario;
    if (req.path === '/login' && usuario) {
      return res.redirect(303, rutaInicial(usuario));
    }

    res.set('Cache-Control', 'no-store');
    if (usuario) {
      return res.status(403).render('pages/auth/cambiar-claves', {
        error: 'El formulario se renovó. Vuelve a escribir las contraseñas y guarda el cambio.',
        obligatorio: usuario.debeCambiarClave
      });
    }

    return res.status(403).render('pages/auth/login', {
      error: 'El formulario se renovó. Vuelve a iniciar sesión con tu correo y contraseña.',
      correo: ''
    });
  }

  const error = new Error('Solicitud no autorizada. Recarga la página e inténtalo de nuevo.');
  error.status = 403;
  next(error);
}

module.exports = { tokenCsrf, verificarCsrf };
