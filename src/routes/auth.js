const router = require('express').Router();
const rateLimit = require('express-rate-limit');
const auth = require('../controllers/auth.controller');
const { requerirSesion } = require('../middlewares/auth');
const { evitarCache } = require('../middlewares/cache');
const {
  validarLogin,
  validarCambioClave,
  validarRecuperacion,
  validarRestablecimiento
} = require('../validators/auth.validator');

const limitarLogin = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  skipSuccessfulRequests: true,
  standardHeaders: true,
  legacyHeaders: false,
  message: 'Demasiados intentos fallidos. Espera unos minutos e inténtalo de nuevo.'
});

const limitarRecuperacion = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: 'Demasiadas solicitudes de recuperación. Espera unos minutos e inténtalo de nuevo.'
});

const limitarRestablecer = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: 'Demasiados intentos de restablecimiento. Espera unos minutos e inténtalo de nuevo.'
});

router.get('/', (req, res) => res.redirect('/login'));
router.get('/login', evitarCache, auth.mostrarLogin);
router.post('/login', evitarCache, limitarLogin, validarLogin, auth.procesarLogin);
router.post('/logout', auth.cerrarSesion);

router.get('/recuperar', evitarCache, auth.mostrarRecuperar);
router.post('/recuperar', evitarCache, limitarRecuperacion, validarRecuperacion, auth.procesarRecuperar);
router.get('/restablecer/:token', evitarCache, auth.mostrarRestablecer);
router.post(
  '/restablecer/:token',
  evitarCache,
  limitarRestablecer,
  validarRestablecimiento,
  auth.procesarRestablecer
);

router.get('/cambiar-clave', evitarCache, requerirSesion, auth.mostrarCambioClave);
router.post('/cambiar-clave', evitarCache, requerirSesion, validarCambioClave, auth.procesarCambioClave);

module.exports = router;
