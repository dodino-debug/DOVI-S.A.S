const { validationResult } = require('express-validator');
const Solicitud = require('../models/solicitud.model');
const Labor = require('../models/labor.model');
const { esId, texto, mensajesDeError } = require('../utils/entrada');
const { ESTADO_SOLICITUD } = require('../config/estados');

const ESTADOS_FILTRO = Object.keys(ESTADO_SOLICITUD);
const SE_PUEDE_DECIDIR = ['PENDIENTE', 'REAGENDADA'];

async function mostrarDetalle(res, codigo, solicitud, extra = {}) {
  const [labores, historial] = await Promise.all([
    Labor.listarPorSolicitud(solicitud.id),
    Solicitud.listarHistorial(solicitud.id)
  ]);
  res.status(codigo).render('pages/admin/solicitudes/detalle', {
    solicitud,
    labores,
    historial,
    puedeDecidir: SE_PUEDE_DECIDIR.includes(solicitud.estado) && solicitud.sin_labor_activa,
    puedeProgramar: ['APROBADA', 'REAGENDADA'].includes(solicitud.estado) && solicitud.sin_labor_activa,
    errores: [],
    abierta: null,
    valores: { nota: '', fecha: '' },
    ...extra
  });
}

async function lista(req, res, next) {
  try {
    const estado = ESTADOS_FILTRO.includes(req.query.estado) ? req.query.estado : null;
    res.render('pages/admin/solicitudes/lista', {
      solicitudes: await Solicitud.listar({ estado }),
      filtro: estado || ''
    });
  } catch (error) {
    next(error);
  }
}

async function ver(req, res, next) {
  try {
    if (!esId(req.params.id)) return next();
    const solicitud = await Solicitud.buscarPorId(Number(req.params.id));
    if (!solicitud) return next();
    await mostrarDetalle(res, 200, solicitud);
  } catch (error) {
    next(error);
  }
}

const PARTICIPIO = { aprobar: 'aprobada', rechazar: 'rechazada', reagendar: 'reagendada' };

function decidir(accion) {
  return async (req, res, next) => {
    try {
      if (!esId(req.params.id)) return next();
      const id = Number(req.params.id);

      const solicitud = await Solicitud.buscarPorId(id);
      if (!solicitud) return next();

      const valores = { nota: texto(req.body.nota), fecha: texto(req.body.fecha) };
      const resultado = validationResult(req);
      if (!resultado.isEmpty()) {
        return await mostrarDetalle(res, 400, solicitud, {
          errores: mensajesDeError(resultado),
          abierta: accion,
          valores
        });
      }

      try {
        const cambio = await Solicitud.decidir(id, {
          accion,
          adminId: req.session.usuario.id,
          nota: valores.nota,
          fecha: accion === 'reagendar' ? valores.fecha : null
        });
        if (!cambio) return next();
      } catch (error) {
        if (!error.validacion) throw error;
        const actual = await Solicitud.buscarPorId(id);
        return await mostrarDetalle(res, 400, actual, { errores: [error.message], valores });
      }

      if (accion === 'aprobar' && req.body.programar === '1') {
        return res.redirigir(
          `/admin/labores/nueva?solicitud=${id}`,
          'ok',
          `Solicitud #${id} aprobada. Programa ahora su labor.`
        );
      }
      res.redirigir(
        '/admin/solicitudes',
        'ok',
        `Solicitud #${id} ${PARTICIPIO[accion]}. Se notificó al cliente.`
      );
    } catch (error) {
      next(error);
    }
  };
}

module.exports = {
  lista,
  ver,
  aprobar: decidir('aprobar'),
  rechazar: decidir('rechazar'),
  reagendar: decidir('reagendar')
};
