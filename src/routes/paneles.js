const router = require('express').Router();
const { requerirRol } = require('../middlewares/auth');
const portal = require('../controllers/portal-cliente.controller');
const { validarSolicitud } = require('../validators/solicitud.validator');

const soloCliente = requerirRol('cliente');

router.get('/cliente', soloCliente, portal.mostrarServicios);
router.get('/cliente/solicitar', soloCliente, portal.mostrarFormulario);
router.get('/cliente/solicitudes', soloCliente, portal.mostrarSolicitudes);
router.post('/cliente/solicitudes', soloCliente, validarSolicitud, portal.crearSolicitud);

router.get('/empleado', requerirRol('empleado'), (req, res) => {
  res.render('pages/panel-provisional', { titulo: 'Módulo Empleado' });
});

module.exports = router;
