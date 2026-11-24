const Dashboard = require('../models/dashboard.model');
const Solicitud = require('../models/solicitud.model');
const { ESTADO_SOLICITUD } = require('../config/estados');
const { validationResult } = require('express-validator');
const { fechaMinima } = require('../validators/solicitud.validator');
const { esId, texto, mensajesDeError } = require('../utils/entrada');

const CONFIRMACION = {
  APROBADA: 'Solicitud aprobada.',
  RECHAZADA: 'Solicitud rechazada.',
  REAGENDADA: 'Solicitud reagendada y aprobada para la nueva fecha.'
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
    if (!esId(req.params.id)) return next();
    const solicitud = await Solicitud.buscarPorId(Number(req.params.id));
    if (!solicitud) return next();
    await renderizarSolicitud(res, solicitud);
  } catch (error) {
    next(error);
  }
}

async function renderizarSolicitud(res, solicitud, estado = 200, errores = [], formulario = {}) {
  const historial = await Solicitud.listarHistorial(solicitud.id);
  res.status(estado).render('pages/admin/solicitud', {
    solicitud,
    historial,
    errores,
    formulario,
    fechaMinima: fechaMinima(),
    estadoEtiqueta: ESTADO_SOLICITUD[solicitud.estado] || solicitud.estado
  });
}

function resolverSolicitud(accion) {
  return async (req, res, next) => {
    if (!esId(req.params.id)) return next();
    const id = Number(req.params.id);
    const fecha = accion === 'REAGENDADA' ? texto(req.body.fecha) : null;
    const motivo = accion === 'RECHAZADA' ? texto(req.body.motivo) : null;
    const formulario = { fecha, motivo };

    try {
      const solicitud = await Solicitud.buscarPorId(id);
      if (!solicitud) return next();
      const resultado = validationResult(req);
      if (!resultado.isEmpty()) {
        return await renderizarSolicitud(res, solicitud, 400, mensajesDeError(resultado), formulario);
      }
      if (accion === 'REAGENDADA' && fecha === solicitud.fecha_deseada) {
        return await renderizarSolicitud(res, solicitud, 400, [
          'Selecciona una fecha diferente de la fecha solicitada.'
        ], formulario);
      }

      const resuelta = await Solicitud.resolver(id, req.session.usuario.id, accion, formulario);
      if (!resuelta) {
        const actual = await Solicitud.buscarPorId(id);
        if (!actual) return next();
        return await renderizarSolicitud(res, actual, 409, [
          actual.estado === 'PENDIENTE'
            ? 'La fecha ya no es válida. Selecciona otra fecha para reagendar.'
            : 'Esta solicitud ya fue resuelta.'
        ], formulario);
      }

      res.redirigir(`/admin/solicitudes/${id}`, 'ok', CONFIRMACION[accion]);
    } catch (error) {
      next(error);
    }
  };
}

function reportes(req, res) {
  res.render('pages/admin/proximamente', { titulo: 'Reportes' });
}

module.exports = { mostrarDashboard, datosDashboard, verSolicitud, resolverSolicitud, reportes };
