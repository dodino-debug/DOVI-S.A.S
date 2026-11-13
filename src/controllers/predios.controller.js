const { validationResult } = require('express-validator');
const Cliente = require('../models/cliente.model');
const Predio = require('../models/predio.model');

const esId = (valor) => /^\d{1,9}$/.test(valor);
const texto = (valor) => (typeof valor === 'string' ? valor.trim() : '');
const MENSAJE_DUPLICADO = 'Este cliente ya tiene un predio con ese nombre.';

function leerDatos(body) {
  return {
    nombre: texto(body.nombre),
    ubicacion: texto(body.ubicacion),
    area: texto(body.area).replace(',', '.')
  };
}

const areaTexto = (area) => (area ? String(Number(area)) : '');

function mostrarForm(res, estado, cliente, predio, errores) {
  res.status(estado).render('pages/admin/predios/form', { cliente, predio, errores });
}

function mensajesDeError(resultado) {
  return resultado.array({ onlyFirstError: true }).map((e) => e.msg);
}

async function formularioNuevo(req, res, next) {
  try {
    if (!esId(req.params.id)) return next();
    const cliente = await Cliente.buscarPorId(Number(req.params.id));
    if (!cliente) return next();
    mostrarForm(res, 200, cliente, { id: null, nombre: '', ubicacion: '', area: '' }, []);
  } catch (error) {
    next(error);
  }
}

async function crear(req, res, next) {
  try {
    if (!esId(req.params.id)) return next();
    const clienteId = Number(req.params.id);
    const cliente = await Cliente.buscarPorId(clienteId);
    if (!cliente) return next();

    const datos = leerDatos(req.body);
    const predio = { id: null, ...datos };

    const resultado = validationResult(req);
    if (!resultado.isEmpty()) return mostrarForm(res, 400, cliente, predio, mensajesDeError(resultado));

    try {
      await Predio.crear(clienteId, datos);
    } catch (error) {
      if (error.code === '23505') return mostrarForm(res, 400, cliente, predio, [MENSAJE_DUPLICADO]);
      throw error;
    }
    res.redirigir(`/admin/clientes/${clienteId}`, 'ok', 'Predio creado.');
  } catch (error) {
    next(error);
  }
}

async function formularioEditar(req, res, next) {
  try {
    if (!esId(req.params.id)) return next();
    const actual = await Predio.buscarPorId(Number(req.params.id));
    if (!actual) return next();
    mostrarForm(
      res,
      200,
      { id: actual.cliente_id, nombre: actual.cliente_nombre },
      { id: actual.id, nombre: actual.nombre, ubicacion: actual.ubicacion, area: areaTexto(actual.area_hectareas) },
      []
    );
  } catch (error) {
    next(error);
  }
}

async function actualizar(req, res, next) {
  try {
    if (!esId(req.params.id)) return next();
    const id = Number(req.params.id);
    const actual = await Predio.buscarPorId(id);
    if (!actual) return next();

    const cliente = { id: actual.cliente_id, nombre: actual.cliente_nombre };
    const datos = leerDatos(req.body);
    const predio = { id, ...datos };

    const resultado = validationResult(req);
    if (!resultado.isEmpty()) return mostrarForm(res, 400, cliente, predio, mensajesDeError(resultado));

    try {
      if (!(await Predio.actualizar(id, datos))) return next();
    } catch (error) {
      if (error.code === '23505') return mostrarForm(res, 400, cliente, predio, [MENSAJE_DUPLICADO]);
      throw error;
    }
    res.redirigir(`/admin/clientes/${actual.cliente_id}`, 'ok', 'Predio actualizado.');
  } catch (error) {
    next(error);
  }
}

async function cambiarEstado(req, res, next) {
  try {
    if (!esId(req.params.id)) return next();
    const activo = req.body.activo === 'true';
    const predio = await Predio.cambiarEstado(Number(req.params.id), activo);
    if (!predio) return next();
    res.redirigir(
      `/admin/clientes/${predio.cliente_id}`,
      'ok',
      `Predio "${predio.nombre}" ${activo ? 'activado' : 'desactivado'}.`
    );
  } catch (error) {
    next(error);
  }
}

module.exports = { formularioNuevo, crear, formularioEditar, actualizar, cambiarEstado };