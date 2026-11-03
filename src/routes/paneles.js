const router = require('express').Router();
const { requerirRol } = require('../middlewares/auth');

const paneles = [
  ['/admin', 'admin', 'Módulo Administrador'],
  ['/supervisor', 'supervisor', 'Módulo Supervisor'],
  ['/empleado', 'empleado', 'Módulo Empleado'],
  ['/cliente', 'cliente', 'Portal Clientes']
];

paneles.forEach(([ruta, rol, titulo]) => {
  router.get(ruta, requerirRol(rol), (req, res) => {
    res.render('pages/panel-provisional', { titulo });
  });
});

module.exports = router;