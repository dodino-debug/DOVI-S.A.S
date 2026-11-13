const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');
const Cliente = require('../models/cliente.model');
const Predio = require('../models/predio.model');
const { claveTemporal } = require('../services/claves');
const { ETIQUETA_ROL } = require('../config/roles');

const esId = (valor) => /^\d{1,9}$/.test(valor);
const texto = (valor) => (typeof valor === 'string' ? valor.trim() : '');

function leerDatos(body) {
  return {
    nombre: texto(body.nombre),
    documento: texto(body.documento),
    telefono: texto(body.telefono),
    direccion: texto(body.direccion_contacto),
    correo: texto(body.correo).toLowerCase()
  };
}

function paraFormulario(id, datos, tieneAcceso) {
  return {
    id,
    nombre: datos.nombre,
    documento: datos.documento,
    telefono: datos.telefono,
    direccion_contacto: datos.direccion,
    correo: datos.correo,
    tiene_acceso: tieneAcceso
  };
}

function mensajesDeError(resultado) {
  return resultado.array({ onlyFirstError: true }).map((e) => e.msg);
}

function mensajeDuplicado(error) {
  return error.constraint === 'idx_clientes_documento'
    ? 'Ya existe un cliente con ese documento.'
    : 'Ya existe un usuario con ese correo.';
}

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
  mostrarForm(
    res,
    200,
    { id: null, nombre: '', documento: '', telefono: '', direccion_contacto: '', correo: '', tiene_acceso: false },
    []
  );
}

async function crear(req, res, next) {
  const datos = leerDatos(req.body);
  const cliente = paraFormulario(null, datos, false);

  try {
    const resultado = validationResult(req);
    if (!resultado.isEmpty()) return mostrarForm(res, 400, cliente, mensajesDeError(resultado));

    let clave = null;
    let hash = null;
    if (datos.correo) {
      clave = claveTemporal();
      hash = await bcrypt.hash(clave, 12);
    }

    const id = await Cliente.crear({ ...datos, hash });

    if (clave) return mostrarCredenciales(res, datos, clave, id);
    res.redirigir(`/admin/clientes/${id}`, 'ok', 'Cliente creado. Ahora puedes registrar sus predios.');
  } catch (error) {
    if (error.code === '23505') return mostrarForm(res, 400, cliente, [mensajeDuplicado(error)]);
    next(error);
  }
}

async function detalle(req, res, next) {
  try {
    if (!esId(req.params.id)) return next();
    const cliente = await Cliente.buscarPorId(Number(req.params.id));
    if (!cliente) return next();
    const predios = await Predio.listarPorCliente(cliente.id);
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

    const actual = await Cliente.buscarPorId(id);
    if (!actual) return next();

    const datos = leerDatos(req.body);
    const cliente = paraFormulario(id, datos, actual.tiene_acceso);

    try {
      const resultado = validationResult(req);
      if (!resultado.isEmpty()) return mostrarForm(res, 400, cliente, mensajesDeError(resultado));

      let clave = null;
      let hash = null;
      if (!actual.tiene_acceso && datos.correo) {
        clave = claveTemporal();
        hash = await bcrypt.hash(clave, 12);
      }

      const cambio = await Cliente.actualizar(id, { ...datos, hash });
      if (!cambio) return next();

      if (cambio.accesoCreado) return mostrarCredenciales(res, datos, clave, id);
      res.redirigir(`/admin/clientes/${id}`, 'ok', 'Cliente actualizado.');
    } catch (error) {
      if (error.code === '23505') return mostrarForm(res, 400, cliente, [mensajeDuplicado(error)]);
      if (error.validacion) return mostrarForm(res, 400, cliente, [error.message]);
      throw error;
    }
  } catch (error) {
    next(error);
  }
}

module.exports = { lista, formularioNuevo, crear, detalle, formularioEditar, actualizar };