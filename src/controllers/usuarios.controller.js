const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');
const Usuario = require('../models/usuario.model');
const { claveTemporal } = require('../services/claves');
const { ETIQUETA_ROL } = require('../config/roles');

const ROLES = ['admin', 'supervisor', 'empleado', 'cliente'];
const ROLES_CREABLES = ['admin', 'supervisor', 'empleado'];
const MENSAJE_CLIENTE = 'Los datos de los clientes se editarán desde el módulo de Clientes.';

const esId = (valor) => /^\d{1,9}$/.test(valor);
const texto = (valor) => (typeof valor === 'string' ? valor.trim() : '');

function leerDatos(body) {
  return {
    nombre: texto(body.nombre),
    correo: texto(body.correo).toLowerCase(),
    telefono: texto(body.telefono),
    rol: texto(body.rol),
    supervisorId: /^\d{1,9}$/.test(String(body.supervisor_id)) ? Number(body.supervisor_id) : null
  };
}

async function mostrarForm(res, estado, cuenta, errores) {
  const supervisores = await Usuario.listarSupervisores(cuenta.supervisor_id || null);
  res.status(estado).render('pages/admin/usuarios/form', {
    cuenta,
    errores,
    supervisores,
    etiquetaRol: ETIQUETA_ROL,
    rolesCreables: ROLES_CREABLES
  });
}

function mostrarCredenciales(res, cuenta, clave, accion) {
  res.set('Cache-Control', 'no-store');
  res.render('pages/admin/usuarios/credenciales', {
    cuenta,
    clave,
    accion,
    etiquetaRol: ETIQUETA_ROL
  });
}

async function lista(req, res, next) {
  try {
    const rol = ROLES.includes(req.query.rol) ? req.query.rol : null;
    const estado = req.query.estado === 'activos' ? 'activos'
      : req.query.estado === 'inactivos' ? 'inactivos' : '';
    const activo = estado === 'activos' ? true : estado === 'inactivos' ? false : null;

    res.render('pages/admin/usuarios/listas', {
      usuarios: await Usuario.listar({ rol, activo }),
      filtros: { rol: rol || '', estado },
      etiquetaRol: ETIQUETA_ROL,
      roles: ROLES
    });
  } catch (error) {
    next(error);
  }
}

async function formularioNuevo(req, res, next) {
  try {
    await mostrarForm(
      res,
      200,
      { id: null, nombre: '', correo: '', telefono: '', rol: 'empleado', supervisor_id: null },
      []
    );
  } catch (error) {
    next(error);
  }
}

async function crear(req, res, next) {
  const datos = leerDatos(req.body);
  const cuenta = { id: null, ...datos, supervisor_id: datos.supervisorId };

  try {
    const resultado = validationResult(req);
    if (!resultado.isEmpty()) {
      const errores = resultado.array({ onlyFirstError: true }).map((e) => e.msg);
      return await mostrarForm(res, 400, cuenta, errores);
    }

    const clave = claveTemporal();
    const hash = await bcrypt.hash(clave, 12);
    await Usuario.crear({ ...datos, hash });
    mostrarCredenciales(res, cuenta, clave, 'creada');
  } catch (error) {
    try {
      if (error.code === '23505') {
        return await mostrarForm(res, 400, cuenta, ['Ya existe un usuario con ese correo.']);
      }
      if (error.validacion) return await mostrarForm(res, 400, cuenta, [error.message]);
    } catch (errorInterno) {
      return next(errorInterno);
    }
    next(error);
  }
}

async function formularioEditar(req, res, next) {
  try {
    if (!esId(req.params.id)) return next();
    const cuenta = await Usuario.buscarDetalle(Number(req.params.id));
    if (!cuenta) return next();
    if (cuenta.rol === 'cliente') return res.redirigir('/admin/usuarios', 'error', MENSAJE_CLIENTE);
    await mostrarForm(res, 200, cuenta, []);
  } catch (error) {
    next(error);
  }
}

async function actualizar(req, res, next) {
  try {
    if (!esId(req.params.id)) return next();
    const id = Number(req.params.id);

    const actual = await Usuario.buscarDetalle(id);
    if (!actual) return next();
    if (actual.rol === 'cliente') return res.redirigir('/admin/usuarios', 'error', MENSAJE_CLIENTE);

    const datos = leerDatos(req.body);
    const cuenta = { id, ...datos, rol: actual.rol, supervisor_id: datos.supervisorId };

    try {
      const resultado = validationResult(req);
      if (!resultado.isEmpty()) {
        const errores = resultado.array({ onlyFirstError: true }).map((e) => e.msg);
        return await mostrarForm(res, 400, cuenta, errores);
      }

      if (!(await Usuario.actualizar(id, datos))) return next();
      res.redirigir('/admin/usuarios', 'ok', 'Usuario actualizado.');
    } catch (error) {
      if (error.code === '23505') {
        return await mostrarForm(res, 400, cuenta, ['Ya existe un usuario con ese correo.']);
      }
      if (error.validacion) return await mostrarForm(res, 400, cuenta, [error.message]);
      throw error;
    }
  } catch (error) {
    next(error);
  }
}

async function cambiarEstado(req, res, next) {
  try {
    if (!esId(req.params.id)) return next();
    const id = Number(req.params.id);
    const activo = req.body.activo === 'true';

    const cuenta = await Usuario.buscarDetalle(id);
    if (!cuenta) return next();

    if (!activo && id === req.session.usuario.id) {
      return res.redirigir('/admin/usuarios', 'error', 'No puedes desactivar tu propia cuenta.');
    }

    const cambiado = await Usuario.cambiarEstado(id, activo);
    if (!cambiado) {
      return res.redirigir(
        '/admin/usuarios',
        'error',
        'No se puede desactivar al único administrador activo.'
      );
    }

    if (!activo) await Usuario.cerrarSesiones(id);
    res.redirigir(
      '/admin/usuarios',
      'ok',
      `Usuario "${cambiado.nombre}" ${activo ? 'activado' : 'desactivado'}.`
    );
  } catch (error) {
    next(error);
  }
}

async function restablecerClave(req, res, next) {
  try {
    if (!esId(req.params.id)) return next();
    const id = Number(req.params.id);

    if (id === req.session.usuario.id) {
      return res.redirigir(
        '/admin/usuarios',
        'error',
        'Para cambiar tu propia contraseña usa la opción de cambiar contraseña.'
      );
    }

    const clave = claveTemporal();
    const hash = await bcrypt.hash(clave, 12);
    const cuenta = await Usuario.restablecerClave(id, hash);
    if (!cuenta) return next();

    mostrarCredenciales(res, cuenta, clave, 'restablecida');
  } catch (error) {
    next(error);
  }
}

module.exports = {
  lista,
  formularioNuevo,
  crear,
  formularioEditar,
  actualizar,
  cambiarEstado,
  restablecerClave
};