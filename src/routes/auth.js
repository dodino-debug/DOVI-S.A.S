const router = require('express').Router();
const rateLimit = require('express-rate-limit');
const auth = require('../controllers/auth.controller');
const { requerirSesion } = require('../middlewares/auth');
const { validarLogin, validarCambioClave } = require('../validators/auth.validator');

function evitarCache(req, res, next) {
  res.set('Cache-Control', 'no-store');
  next();
}

const limitarLogin = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  skipSuccessfulRequests: true,
  standardHeaders: true,
  legacyHeaders: false,
  message: 'Demasiados intentos fallidos. Espera unos minutos e inténtalo de nuevo.'
});

router.get(['/', '/login'], (req, res) => res.redirect('/auth/login'));
router.get('/auth/login', evitarCache, auth.mostrarLogin);
router.post(['/login', '/auth/login'], evitarCache, limitarLogin, validarLogin, auth.procesarLogin);
router.post('/logout', auth.cerrarSesion);

router.get('/cambiar-clave', evitarCache, requerirSesion, auth.mostrarCambioClave);
router.post('/cambiar-clave', evitarCache, requerirSesion, validarCambioClave, auth.procesarCambioClave);

module.exports = router;
