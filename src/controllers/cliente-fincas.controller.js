const { validationResult } = require('express-validator');
const Finca = require('../models/finca.model');
const { esId, texto, mensajesDeError } = require('../utils/entrada');

const MENSAJE_DUPLICADO = 'Ya tienes un predio registrado con ese nombre.';

const leerDatos = (body) => ({
  nombre: texto(body.nombre),
  ubicacion: texto(body.ubicacion),
  area: texto(body.area).replace(',', '.')
});

const areaTexto = (area) => (area ? String(Number(area)) : '');

function mostrarForm(res, estado, predio, errores) {
  res.status(estado).render('pages/cliente/fincas/form', { predio, errores });
}

async function lista(req, res, next) {
  try {
    const predios = await Finca.listarPorCliente(req.session.usuario.id);
    res.render('pages/cliente/fincas/lista', { predios });
  } catch (error) {
    next(error);
  }
}

function formularioNuevo(req, res) {
  mostrarForm(res, 200, { id: null, nombre: '', ubicacion: '', area: '' }, []);
}

async function crear(req, res, next) {
  const clienteId = req.session.usuario.id;
  const datos = leerDatos(req.body);
  const predio = { id: null, ...datos };

  try {
    const resultado = validationResult(req);
    if (!resultado.isEmpty()) {
      return mostrarForm(res, 400, predio, mensajesDeError(resultado));
    }

    try {
      await Finca.crear(clienteId, datos);
    } catch (error) {
      if (error.code === '23505') return mostrarForm(res, 400, predio, [MENSAJE_DUPLICADO]);
      throw error;
    }

    res.redirigir('/cliente/fincas', 'ok', 'Predio registrado correctamente.');
  } catch (error) {
    next(error);
  }
}

async function formularioEditar(req, res, next) {
  try {
    if (!esId(req.params.id)) return next();
    const actual = await Finca.buscarPorIdYCliente(Number(req.params.id), req.session.usuario.id);
    if (!actual) return next();

    mostrarForm(
      res,
      200,
      {
        id: actual.id,
        nombre: actual.nombre,
        ubicacion: actual.ubicacion,
        area: areaTexto(actual.area_hectareas)
      },
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
    const clienteId = req.session.usuario.id;

    // Valida propiedad antes de procesar cambios (prevención IDOR).
    const actual = await Finca.buscarPorIdYCliente(id, clienteId);
    if (!actual) return next();

    const datos = leerDatos(req.body);
    const predio = { id, ...datos };

    const resultado = validationResult(req);
    if (!resultado.isEmpty()) {
      return mostrarForm(res, 400, predio, mensajesDeError(resultado));
    }

    try {
      const actualizado = await Finca.actualizarDeCliente(id, clienteId, datos);
      if (!actualizado) return next();
    } catch (error) {
      if (error.code === '23505') return mostrarForm(res, 400, predio, [MENSAJE_DUPLICADO]);
      throw error;
    }

    res.redirigir('/cliente/fincas', 'ok', 'Predio actualizado correctamente.');
  } catch (error) {
    next(error);
  }
}

module.exports = { lista, formularioNuevo, crear, formularioEditar, actualizar };
