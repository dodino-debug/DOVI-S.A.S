const { validationResult } = require('express-validator');
const Cliente = require('../models/cliente.model');
const Finca = require('../models/finca.model');
const { claveTemporal, hashearClave } = require('../services/claves');
const { ETIQUETA_ROL } = require('../config/roles');
const { esId, texto, mensajesDeError } = require('../utils/entrada');

const MENSAJE_DUPLICADO = 'Ya existe un usuario con ese correo.';

const leerDatos = (body) => ({
  nombre: texto(body.nombre),
  correo: texto(body.correo).toLowerCase(),
  telefono: texto(body.telefono)
});

function mostrarForm(res, estado, cliente, errores) {
  res.status(estado).render('pages/admin/clientes/form', { cliente, errores });
}

function mostrarCredenciales(res, datos, clave, clienteId) {
  res.set('Cache-Control', 'no-store');
  res.render('pages/admin/usuarios/credenciales', {
    cuenta: { nombre: datos.nombre, correo: datos.correo, rol: 'cliente' },
    clave,
    accion: 'creada',
    etiquetaRol: ETIQUETA_ROL,
    volver: { href: `/admin/clientes/${clienteId}`, texto: 'Volver al cliente' }
  });
}

async function lista(req, res, next) {
  try {
    const q = texto(req.query.q).slice(0, 100);
    res.render('pages/admin/clientes/lista', { clientes: await Cliente.listar({ q }), q });
  } catch (error) {
    next(error);
  }
}

function formularioNuevo(req, res) {
  mostrarForm(res, 200, { id: null, nombre: '', correo: '', telefono: '' }, []);
}

async function crear(req, res, next) {
  const datos = leerDatos(req.body);
  const cliente = { id: null, ...datos };

  try {
    const resultado = validationResult(req);
    if (!resultado.isEmpty()) return mostrarForm(res, 400, cliente, mensajesDeError(resultado));

    const clave = claveTemporal();
    const hash = await hashearClave(clave);
    const id = await Cliente.crear({ ...datos, hash });
    mostrarCredenciales(res, datos, clave, id);
  } catch (error) {
    if (error.code === '23505') return mostrarForm(res, 400, cliente, [MENSAJE_DUPLICADO]);
    next(error);
  }
}

async function detalle(req, res, next) {
  try {
    if (!esId(req.params.id)) return next();
    const cliente = await Cliente.buscarPorId(Number(req.params.id));
    if (!cliente) return next();
    const predios = await Finca.listarPorCliente(cliente.id);
    res.render('pages/admin/clientes/detalle', { cliente, predios });
  } catch (error) {
    next(error);
  }
}

async function formularioEditar(req, res, next) {
  try {
    if (!esId(req.params.id)) return next();
    const cliente = await Cliente.buscarPorId(Number(req.params.id));
    if (!cliente) return next();
    mostrarForm(res, 200, cliente, []);
  } catch (error) {
    next(error);
  }
}

async function actualizar(req, res, next) {
  try {
    if (!esId(req.params.id)) return next();
    const id = Number(req.params.id);
    const datos = leerDatos(req.body);
    const cliente = { id, ...datos };

    try {
      const resultado = validationResult(req);
      if (!resultado.isEmpty()) return mostrarForm(res, 400, cliente, mensajesDeError(resultado));

      if (!(await Cliente.actualizar(id, datos))) return next();
      res.redirigir(`/admin/clientes/${id}`, 'ok', 'Cliente actualizado.');
    } catch (error) {
      if (error.code === '23505') return mostrarForm(res, 400, cliente, [MENSAJE_DUPLICADO]);
      throw error;
    }
  } catch (error) {
    next(error);
  }
}

module.exports = { lista, formularioNuevo, crear, detalle, formularioEditar, actualizar };
