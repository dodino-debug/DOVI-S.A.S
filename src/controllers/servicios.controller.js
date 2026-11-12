const { validationResult } = require('express-validator');
const Servicio = require('../models/servicio.model');

const esId = (valor) => /^\d{1,9}$/.test(valor);
const texto = (valor) => (typeof valor === 'string' ? valor.trim() : '');

function mostrarFormulario(res, estado, servicio, errores) {
  res.status(estado).render('pages/admin/servicios/form', { servicio, errores });
}

async function lista(req, res, next) {
  try {
    res.render('pages/admin/servicios/lista', { servicios: await Servicio.listar() });
  } catch (error) {
    next(error);
  }
}

function formularioNuevo(req, res) {
  mostrarFormulario(res, 200, { id: null, nombre: '', descripcion: '' }, []);
}

async function formularioEditar(req, res, next) {
  try {
    if (!esId(req.params.id)) return next();
    const servicio = await Servicio.buscarPorId(Number(req.params.id));
    if (!servicio) return next();
    mostrarFormulario(res, 200, servicio, []);
  } catch (error) {
    next(error);
  }
}

async function procesar(req, res, next, id) {
  const servicio = { id, nombre: texto(req.body.nombre), descripcion: texto(req.body.descripcion) };

  try {
    const resultado = validationResult(req);
    if (!resultado.isEmpty()) {
      const errores = resultado.array({ onlyFirstError: true }).map((e) => e.msg);
      return mostrarFormulario(res, 400, servicio, errores);
    }

    if (id) {
      if (!(await Servicio.actualizar(id, servicio))) return next();
      return res.redirigir('/admin/servicios', 'ok', 'Servicio actualizado.');
    }

    await Servicio.crear(servicio);
    res.redirigir('/admin/servicios', 'ok', 'Servicio creado.');
  } catch (error) {
    if (error.code === '23505') {
      return mostrarFormulario(res, 400, servicio, ['Ya existe un servicio con ese nombre.']);
    }
    next(error);
  }
}

const crear = (req, res, next) => procesar(req, res, next, null);

function actualizar(req, res, next) {
  if (!esId(req.params.id)) return next();
  return procesar(req, res, next, Number(req.params.id));
}

async function cambiarEstado(req, res, next) {
  try {
    if (!esId(req.params.id)) return next();
    const activo = req.body.activo === 'true';
    const servicio = await Servicio.cambiarEstado(Number(req.params.id), activo);
    if (!servicio) return next();
    res.redirigir(
      '/admin/servicios',
      'ok',
      `Servicio "${servicio.nombre}" ${activo ? 'activado' : 'desactivado'}.`
    );
  } catch (error) {
    next(error);
  }
}

module.exports = { lista, formularioNuevo, formularioEditar, crear, actualizar, cambiarEstado };