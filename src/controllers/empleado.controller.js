const Labor = require('../models/labor.model');
const { ESTADO_LABOR } = require('../config/estados');
const { fechaMinima } = require('../validators/solicitud.validator');
const { validationResult } = require('express-validator');
const { texto } = require('../utils/entrada');

const formatoFecha = new Intl.DateTimeFormat('es-CO', {
  weekday: 'long',
  day: 'numeric',
  month: 'long',
  year: 'numeric',
  timeZone: 'UTC'
});

const ESTILOS_ESTADO = {
  PENDIENTE: 'pendiente',
  'EN PROCESO': 'en-proceso',
  COMPLETADA: 'completada',
  CANCELADA: 'cancelada'
};

const DOMINIOS_MAPA = new Set(['maps.google.com', 'maps.app.goo.gl', 'www.openstreetmap.org']);

function enlaceMapa(ubicacion) {
  const valor = ubicacion.trim();
  const coordenadas = valor.match(/^([+-]?\d+(?:\.\d+)?)\s*,\s*([+-]?\d+(?:\.\d+)?)$/);
  if (coordenadas && Math.abs(Number(coordenadas[1])) <= 90 && Math.abs(Number(coordenadas[2])) <= 180) {
    return `https://maps.google.com/?q=${encodeURIComponent(`${coordenadas[1]},${coordenadas[2]}`)}`;
  }

  if (!URL.canParse(valor)) return null;
  const url = new URL(valor);
  if (url.protocol === 'https:' && !url.username && !url.password && !url.port &&
      (DOMINIOS_MAPA.has(url.hostname) || (url.hostname === 'www.google.com' && /^\/maps(?:\/|$)/.test(url.pathname)))) {
    return url.href;
  }

  return null;
}

async function mostrarLabores(req, res) {
  const labores = await Labor.listarPorEmpleado(req.session.usuario.id);
  const hoy = fechaMinima();
  const porDia = [
    { id: 'hoy', titulo: 'Hoy', labores: [] },
    { id: 'proximas', titulo: 'Próximas', labores: [] },
    { id: 'anteriores', titulo: 'Anteriores', labores: [] }
  ];
  for (const labor of labores) {
    const grupo = labor.fecha === hoy ? porDia[0] : labor.fecha > hoy ? porDia[1] : porDia[2];
    grupo.labores.push({
      ...labor,
      fechaVisible: formatoFecha.format(new Date(`${labor.fecha}T00:00:00Z`)),
      estadoVisible: ESTADO_LABOR[labor.estado],
      estiloEstado: ESTILOS_ESTADO[labor.estado],
      mapa: enlaceMapa(labor.ubicacion || '')
    });
  }
  porDia[2].labores.sort((a, b) => b.fecha.localeCompare(a.fecha));

  res.set('Cache-Control', 'no-store');
  res.render('pages/empleado/labores', { grupos: porDia.filter((grupo) => grupo.labores.length) });
}

function registrarAvance(estadoActual, estadoNuevo, mensaje) {
  return async (req, res, next) => {
    const id = Number(req.params.id);
    if (!/^[1-9]\d{0,9}$/.test(req.params.id) || id > 2147483647) return next();

    const validacion = validationResult(req);
    if (!validacion.isEmpty()) {
      return res.redirigir('/empleado', 'error', validacion.array()[0].msg);
    }

    const guardado = await Labor.actualizarAvance(
      id,
      req.session.usuario.id,
      estadoActual,
      estadoNuevo,
      estadoNuevo === 'COMPLETADA' ? texto(req.body.observaciones) || null : null
    );
    if (!guardado) {
      return res.redirigir('/empleado', 'error', 'No se pudo actualizar la labor. Revisa su estado y tus asignaciones.');
    }

    res.redirigir('/empleado', 'ok', mensaje);
  };
}

const iniciarLabor = registrarAvance('PENDIENTE', 'EN PROCESO', 'Labor iniciada.');
const completarLabor = registrarAvance('EN PROCESO', 'COMPLETADA', 'Labor completada.');

module.exports = { mostrarLabores, iniciarLabor, completarLabor };
