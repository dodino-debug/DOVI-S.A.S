const { validationResult } = require('express-validator');
const Finca = require('../models/finca.model');
const Servicio = require('../models/servicio.model');
const Solicitud = require('../models/solicitud.model');
const { ESTADO_SOLICITUD } = require('../config/estados');
const { fechaMinima } = require('../validators/solicitud.validator');
const { texto, mensajesDeError } = require('../utils/entrada');

async function mostrarServicios(req, res, next) {
  try {
    const servicios = await Servicio.listarActivos();
    res.render('pages/cliente/servicios', { servicios });
  } catch (error) {
    next(error);
  }
}

async function mostrarSolicitudes(req, res, next) {
  try {
    const solicitudes = await Solicitud.listarPorCliente(req.session.usuario.id);
    res.render('pages/cliente/solicitudes', { solicitudes, estados: ESTADO_SOLICITUD });
  } catch (error) {
    next(error);
  }
}

async function renderizarFormulario(req, res, estado = 200, formulario = {}, errores = []) {
  const [fincas, servicios] = await Promise.all([
    Finca.listarPorCliente(req.session.usuario.id),
    Servicio.listarActivos()
  ]);
  res.status(estado).render('pages/cliente/solicitar', {
    predios: fincas.filter((finca) => finca.activo),
    servicios,
    fechaMinima: fechaMinima(),
    formulario,
    errores
  });
}

async function mostrarFormulario(req, res, next) {
  try {
    await renderizarFormulario(req, res, 200, { servicio: texto(req.query.servicio) });
  } catch (error) {
    next(error);
  }
}

async function crearSolicitud(req, res, next) {
  const formulario = {
    predio: texto(req.body.predio),
    servicio: texto(req.body.servicio),
    fecha: texto(req.body.fecha),
    detalles: texto(req.body.detalles)
  };

  try {
    const resultado = validationResult(req);
    if (!resultado.isEmpty()) {
      return await renderizarFormulario(req, res, 400, formulario, mensajesDeError(resultado));
    }

    const creada = await Solicitud.crearPendiente(req.session.usuario.id, {
      predio: Number(formulario.predio),
      servicio: Number(formulario.servicio),
      fecha: formulario.fecha,
      detalles: formulario.detalles
    });
    if (!creada) {
      return await renderizarFormulario(req, res, 400, formulario, [
        'Verifica que el predio esté activo y sea tuyo, que el servicio siga disponible y que la fecha sea válida.'
      ]);
    }

    res.redirigir('/cliente/solicitudes', 'ok', 'Solicitud enviada para revisión.');
  } catch (error) {
    next(error);
  }
}

module.exports = { mostrarServicios, mostrarSolicitudes, mostrarFormulario, crearSolicitud };
