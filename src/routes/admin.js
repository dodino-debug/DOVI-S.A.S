const router = require('express').Router();
const admin = require('../controllers/admin.controller');
const servicios = require('../controllers/servicios.controller');
const { validarServicio } = require('../validators/servicio.validator');
const { requerirRol, requerirRolApi } = require('../middlewares/auth');

const soloAdmin = requerirRol('admin');

router.get('/admin', soloAdmin, admin.mostrarDashboard);
router.get('/admin/solicitudes/:id', soloAdmin, admin.verSolicitud);
router.get('/admin/reportes', soloAdmin, admin.reportes);

router.get('/admin/servicios', soloAdmin, servicios.lista);
router.get('/admin/servicios/nuevo', soloAdmin, servicios.formularioNuevo);
router.post('/admin/servicios', soloAdmin, validarServicio, servicios.crear);
router.get('/admin/servicios/:id/editar', soloAdmin, servicios.formularioEditar);
router.post('/admin/servicios/:id', soloAdmin, validarServicio, servicios.actualizar);
router.post('/admin/servicios/:id/estado', soloAdmin, servicios.cambiarEstado);

router.get('/api/admin/dashboard', requerirRolApi('admin'), admin.datosDashboard);

module.exports = router;