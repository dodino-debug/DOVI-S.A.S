const { validationResult } = require('express-validator');
const Finca = require('../models/finca.model');
const Servicio = require('../models/servicio.model');
const Solicitud = require('../models/solicitud.model');
const { ESTADO_SOLICITUD } = require('../config/estados');
const { fechaMinima } = require('../validators/solicitud.validator');
const { texto, mensajesDeError } = require('../utils/entrada');

function renderizar(res, seccion, datos, estado = 200) {
  res.set('Cache-Control', 'no-store');
  res.status(estado).render('pages/cliente/portal', { seccion, ...datos });
}

async function mostrarServicios(req, res) {
  renderizar(res, 'servicios', { servicios: await Servicio.listarActivos() });
}

async function mostrarSolicitudes(req, res) {
  const solicitudes = await Solicitud.listarPorCliente(req.session.usuario.id);
  renderizar(res, 'solicitudes', { solicitudes, estados: ESTADO_SOLICITUD });
}

async function renderizarFormulario(req, res, estado = 200, formulario = {}, errores = []) {
  const [fincas, servicios] = await Promise.all([
    Finca.listarPorCliente(req.session.usuario.id),
    Servicio.listarActivos()
  ]);
  renderizar(res, 'solicitar', {
    predios: fincas.filter((finca) => finca.activo),
    servicios,
    fechaMinima: fechaMinima(),
    formulario,
    errores
  }, estado);
}

function mostrarFormulario(req, res) {
  return renderizarFormulario(req, res, 200, { servicio: texto(req.query.servicio) });
}

async function crearSolicitud(req, res) {
  const formulario = {
    predio: texto(req.body.predio),
    servicio: texto(req.body.servicio),
    fecha: texto(req.body.fecha),
    detalles: texto(req.body.detalles)
  };

  const resultado = validationResult(req);
  if (!resultado.isEmpty()) {
    return renderizarFormulario(req, res, 400, formulario, mensajesDeError(resultado));
  }

  const creada = await Solicitud.crearPendiente(req.session.usuario.id, formulario);
  if (!creada) {
    return renderizarFormulario(req, res, 400, formulario, [
      'Verifica que el predio esté activo y sea tuyo, que el servicio siga disponible y que la fecha sea válida.'
    ]);
  }

  res.redirigir('/cliente/solicitudes', 'ok', 'Solicitud enviada para revisión.');
}

module.exports = { mostrarServicios, mostrarSolicitudes, mostrarFormulario, crearSolicitud };
