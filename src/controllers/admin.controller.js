const Dashboard = require('../models/dashboard.model');

async function mostrarDashboard(req, res, next) {
  try {
    const datos = await Dashboard.obtenerDashboard();
    res.render('pages/admin/dashboard', {
      resumen: datos,
      solicitudes: datos.solicitudes,
      activos: datos.serviciosActivos
    });
  } catch (error) {
    next(error);
  }
}

async function datosDashboard(req, res, next) {
  try {
    const datos = await Dashboard.obtenerDashboard();
    res.set('Cache-Control', 'no-store');
    res.json(datos);
  } catch (error) {
    next(error);
  }
}

module.exports = { mostrarDashboard, datosDashboard };
