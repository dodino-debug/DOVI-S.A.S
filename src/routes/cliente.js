const router = require('express').Router();
const { requerirRol } = require('../middlewares/auth');
const { evitarCache } = require('../middlewares/cache');
const portal = require('../controllers/portal-cliente.controller');
const { validarSolicitud } = require('../validators/solicitud.validator');

router.use('/cliente', requerirRol('cliente'), evitarCache);

router.get('/cliente', portal.mostrarServicios);
router.get('/cliente/servicios', portal.mostrarServicios);
router.get('/cliente/solicitar', portal.mostrarFormulario);
router.get('/cliente/solicitudes', portal.mostrarSolicitudes);
router.post('/cliente/solicitudes', validarSolicitud, portal.crearSolicitud);

module.exports = router;
