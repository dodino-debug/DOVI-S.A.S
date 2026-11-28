const { validationResult } = require('express-validator');
const Labor = require('../models/labor.model');
const Solicitud = require('../models/solicitud.model');
const { esId, texto, mensajesDeError } = require('../utils/entrada');
const { hoyBogota, leerRango } = require('../utils/fechas');
const { ESTADOS, siguientes } = require('../services/estados-labor');

function leerEmpleados(valor) {
  const ids = [].concat(valor || []);
  if (ids.length > 100 || ids.some((id) =>
    typeof id !== 'string' || !/^[1-9]\d{0,9}$/.test(id) || Number(id) > 2147483647)) {
    return [];
  }
  return ids.map(Number);
}

async function mostrarFormulario(res, codigo, { labor, errores = [], resumen = null }) {
  const editando = Boolean(labor.id);
  const [solicitudes, empleados] = editando
    ? [[], []]
    : await Promise.all([Solicitud.pendientesDeProgramar(), Labor.empleadosDisponibles(labor.empleados)]);

  const hoy = hoyBogota();
  const elegida = solicitudes.find((solicitud) => solicitud.id === labor.solicitud_id);
  if (codigo === 200 && !labor.fecha && elegida?.fecha_deseada >= hoy) {
    labor.fecha = elegida.fecha_deseada;
  }

  res.status(codigo).render('pages/admin/labores/form', {
    labor,
    errores,
    resumen,
    editando,
    solicitudes,
    empleados,
    hoy
  });
}

async function mostrarDetalle(res, codigo, labor, errores = []) {
  const asignados = labor.cuadrilla.map((e) => e.id);
  const empleados = await Labor.empleadosDisponibles(asignados);
  res.status(codigo).render('pages/admin/labores/detalle', {
    labor,
    errores,
    empleados,
    asignados,
    siguientes: siguientes(labor.estado),
    puedeAsignar: ['PENDIENTE', 'EN PROCESO'].includes(labor.estado),
    puedeEditar: labor.estado === 'PENDIENTE'
  });
}

async function lista(req, res, next) {
  try {
    const estado = ESTADOS.includes(req.query.estado) ? req.query.estado : null;
    const rango = leerRango(req.query, 0);
    const labores = rango.error
      ? []
      : await Labor.listar({ estado, desde: rango.desde, hasta: rango.hasta });

    res.render('pages/admin/labores/lista', {
      labores,
      error: rango.error,
      filtros: { estado: estado || '', desde: rango.desde, hasta: rango.hasta }
    });
  } catch (error) {
    next(error);
  }
}

async function formularioNuevo(req, res, next) {
  try {
    const preseleccion = /^\d{1,9}$/.test(String(req.query.solicitud)) ? Number(req.query.solicitud) : null;
    await mostrarFormulario(res, 200, {
      labor: { id: null, solicitud_id: preseleccion, fecha: '', hora: '', empleados: [] }
    });
  } catch (error) {
    next(error);
  }
}

async function crear(req, res, next) {
  const datos = {
    solicitudId: /^\d{1,9}$/.test(String(req.body.solicitud_id)) ? Number(req.body.solicitud_id) : null,
    fecha: texto(req.body.fecha),
    hora: texto(req.body.hora),
    empleados: leerEmpleados(req.body.empleados)
  };
  const labor = { id: null, solicitud_id: datos.solicitudId, fecha: datos.fecha, hora: datos.hora, empleados: datos.empleados };

  try {
    const resultado = validationResult(req);
    if (!resultado.isEmpty()) {
      return await mostrarFormulario(res, 400, { labor, errores: mensajesDeError(resultado) });
    }

    const id = await Labor.crear(datos);
    res.redirigir('/admin/labores', 'ok', `Labor #${id} programada.`);
  } catch (error) {
    if (error.validacion) {
      try {
        return await mostrarFormulario(res, 400, { labor, errores: [error.message] });
      } catch (errorInterno) {
        return next(errorInterno);
      }
    }
    next(error);
  }
}

async function ver(req, res, next) {
  try {
    if (!esId(req.params.id)) return next();
    const labor = await Labor.buscarPorId(Number(req.params.id));
    if (!labor) return next();
    await mostrarDetalle(res, 200, labor);
  } catch (error) {
    next(error);
  }
}

async function formularioEditar(req, res, next) {
  try {
    if (!esId(req.params.id)) return next();
    const labor = await Labor.buscarPorId(Number(req.params.id));
    if (!labor) return next();
    if (labor.estado !== 'PENDIENTE') {
      return res.redirigir(`/admin/labores/${labor.id}`, 'error', 'Solo se puede editar una labor que esté pendiente.');
    }
    await mostrarFormulario(res, 200, {
      labor: { id: labor.id, fecha: labor.fecha, hora: labor.hora },
      resumen: labor
    });
  } catch (error) {
    next(error);
  }
}

async function actualizar(req, res, next) {
  try {
    if (!esId(req.params.id)) return next();
    const id = Number(req.params.id);
    const actual = await Labor.buscarPorId(id);
    if (!actual) return next();

    const datos = { fecha: texto(req.body.fecha), hora: texto(req.body.hora) };
    const labor = { id, ...datos };

    const resultado = validationResult(req);
    if (!resultado.isEmpty()) {
      return await mostrarFormulario(res, 400, { labor, resumen: actual, errores: mensajesDeError(resultado) });
    }

    try {
      if (!(await Labor.actualizar(id, datos))) return next();
    } catch (error) {
      if (!error.validacion) throw error;
      return await mostrarFormulario(res, 400, { labor, resumen: actual, errores: [error.message] });
    }
    res.redirigir(`/admin/labores/${id}`, 'ok', 'Labor actualizada. Se notificó a su cuadrilla.');
  } catch (error) {
    next(error);
  }
}

async function asignar(req, res, next) {
  try {
    if (!esId(req.body.id_labor)) return next();
    const id = Number(req.body.id_labor);
    const empleados = leerEmpleados(req.body.empleados);

    try {
      if (!(await Labor.asignar(id, empleados))) return next();
    } catch (error) {
      if (!error.validacion) throw error;
      const labor = await Labor.buscarPorId(id);
      if (!labor) return next();
      return await mostrarDetalle(res, 400, labor, [error.message]);
    }
    res.redirigir(`/admin/labores/${id}`, 'ok', 'Cuadrilla asignada. Se notificó a los empleados nuevos.');
  } catch (error) {
    next(error);
  }
}

async function cambiarEstado(req, res, next) {
  try {
    if (!esId(req.params.id)) return next();
    const id = Number(req.params.id);
    const labor = await Labor.buscarPorId(id);
    if (!labor) return next();

    const resultado = validationResult(req);
    if (!resultado.isEmpty()) {
      return await mostrarDetalle(res, 400, labor, mensajesDeError(resultado));
    }

    try {
      if (!(await Labor.cambiarEstado(id, req.body.estado, texto(req.body.observaciones)))) return next();
    } catch (error) {
      if (!error.validacion) throw error;
      return await mostrarDetalle(res, 400, labor, [error.message]);
    }
    res.redirigir(`/admin/labores/${id}`, 'ok', 'Estado de la labor actualizado.');
  } catch (error) {
    next(error);
  }
}

module.exports = {
  lista,
  formularioNuevo,
  crear,
  ver,
  formularioEditar,
  actualizar,
  asignar,
  cambiarEstado
};
