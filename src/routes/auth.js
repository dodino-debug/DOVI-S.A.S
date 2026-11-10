const router = require('express').Router();
const rateLimit = require('express-rate-limit');
const auth = require('../controllers/auth.controller');
const { requerirSesion } = require('../middlewares/auth');
const { validarLogin, validarCambioClave } = require('../validators/auth.validator');

const limitarLogin = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  skipSuccessfulRequests: true,
  standardHeaders: true,
  legacyHeaders: false,
  message: 'Demasiados intentos fallidos. Espera unos minutos e inténtalo de nuevo.'
});

router.get('/', (req, res) => res.redirect('/login'));
router.get('/login', auth.mostrarLogin);
router.post('/login', limitarLogin, validarLogin, auth.procesarLogin);
router.post('/logout', auth.cerrarSesion);

router.get('/cambiar-clave', requerirSesion, auth.mostrarCambioClave);
router.post('/cambiar-clave', requerirSesion, validarCambioClave, auth.procesarCambioClave);

module.exports = router;