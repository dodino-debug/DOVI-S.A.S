const crypto = require('crypto');

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
    esperado &&
    enviado.length === esperado.length &&
    crypto.timingSafeEqual(Buffer.from(enviado), Buffer.from(esperado));

  if (valido) return next();

  const error = new Error('Solicitud no autorizada. Recarga la página e inténtalo de nuevo.');
  error.status = 403;
  next(error);
}

module.exports = { tokenCsrf, verificarCsrf };