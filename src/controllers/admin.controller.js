const Dashboard = require('../models/dashboard.model');
const Solicitud = require('../models/solicitud.model');

const ETIQUETA_ESTADO = {
  pendiente_revision: 'Pendiente revisión',
  aprobada: 'Aprobada',
  rechazada: 'Rechazada',
  reagendada: 'Reagendada',
  en_proceso: 'En proceso',
  completada: 'Completada'
};

async function mostrarDashboard(req, res, next) {
  try {
    const datos = await Dashboard.obtenerDashboard();
    res.render('pages/admin/dashboard', { resumen: datos, solicitudes: datos.solicitudes });
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

async function verSolicitud(req, res, next) {
  try {
    if (!/^\d{1,9}$/.test(req.params.id)) return next();
    const solicitud = await Solicitud.buscarPorId(Number(req.params.id));
    if (!solicitud) return next();
    res.render('pages/admin/solicitud', {
      solicitud,
      estadoEtiqueta: ETIQUETA_ESTADO[solicitud.estado] || solicitud.estado
    });
  } catch (error) {
    next(error);
  }
}

function reportes(req, res) {
  res.render('pages/admin/proximamente', { titulo: 'Reportes' });
}

module.exports = { mostrarDashboard, datosDashboard, verSolicitud, reportes };