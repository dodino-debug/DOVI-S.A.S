const router = require('express').Router();
const admin = require('../controllers/admin.controller');
const { requerirRol, requerirRolApi } = require('../middlewares/auth');

router.get('/admin', requerirRol('admin'), admin.mostrarDashboard);
router.get('/admin/solicitudes/:id', requerirRol('admin'), admin.verSolicitud);
router.get('/admin/reportes', requerirRol('admin'), admin.reportes);

router.get('/api/admin/dashboard', requerirRolApi('admin'), admin.datosDashboard);

module.exports = router;