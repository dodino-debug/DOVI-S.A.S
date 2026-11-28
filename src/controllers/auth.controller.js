const { validationResult } = require('express-validator');
const Usuario = require('../models/usuario.model');
const { rutaInicial } = require('../config/roles');
const { COOKIE_NAME, COOKIE_CLEAR_OPTIONS } = require('../config/session');
const { hashearClave, compararClave } = require('../services/claves');

function mostrarLogin(req, res) {
  if (req.session.usuario) return res.redirect(rutaInicial(req.session.usuario));
  res.render('pages/auth/login', { error: null, correo: '' });
}

async function procesarLogin(req, res, next) {
  const correo = typeof req.body.correo === 'string' ? req.body.correo.trim().toLowerCase() : '';

  try {
    if (!validationResult(req).isEmpty()) {
      return res.status(400).render('pages/auth/login', {
        error: 'Ingresa un correo y una contraseña válidos.',
        correo
      });
    }

    const usuario = await Usuario.buscarPorCorreo(correo);
    const coincide = await compararClave(req.body.clave, usuario ? usuario.password_hash : null);

    if (!usuario || !coincide || !usuario.activo) {
      return res.status(401).render('pages/auth/login', {
        error: 'Correo o contraseña incorrectos.',
        correo
      });
    }

    req.session.regenerate((errorRegenerar) => {
      if (errorRegenerar) return next(errorRegenerar);
      req.session.usuario = {
        id: usuario.id,
        nombre: usuario.nombre,
        rol: usuario.rol,
        esSupervisor: usuario.es_supervisor,
        debeCambiarClave: usuario.debe_cambiar_clave
      };
      req.session.save((errorGuardar) => {
        if (errorGuardar) return next(errorGuardar);
        res.redirect(rutaInicial(req.session.usuario));
      });
    });
  } catch (error) {
    next(error);
  }
}

function mostrarCambioClave(req, res) {
  res.render('pages/auth/cambiar-claves', {
    error: null,
    obligatorio: req.session.usuario.debeCambiarClave
  });
}

async function procesarCambioClave(req, res, next) {
  const obligatorio = req.session.usuario.debeCambiarClave;
  const responder = (estado, error) =>
    res.status(estado).render('pages/auth/cambiar-claves', { error, obligatorio });

  try {
    if (!validationResult(req).isEmpty()) {
      return responder(
        400,
        'La nueva contraseña debe tener entre 10 y 64 caracteres, ser distinta de la actual y coincidir con la confirmación.'
      );
    }

    const usuario = await Usuario.buscarPorId(req.session.usuario.id);
    if (!usuario || !usuario.activo) {
      return req.session.destroy(() => {
        res.clearCookie(COOKIE_NAME, COOKIE_CLEAR_OPTIONS);
        res.redirect('/login');
      });
    }

    const correcta = await compararClave(req.body.claveActual, usuario.password_hash);
    if (!correcta) return responder(401, 'La contraseña actual no es correcta.');

    const hash = await hashearClave(req.body.claveNueva);
    await Usuario.actualizarClave(usuario.id, hash);
    await Usuario.cerrarSesiones(usuario.id, req.sessionID);

    const sesionActualizada = { ...req.session.usuario, debeCambiarClave: false };
    req.session.regenerate((errorRegenerar) => {
      if (errorRegenerar) return next(errorRegenerar);
      req.session.usuario = sesionActualizada;
      req.session.save((errorGuardar) => {
        if (errorGuardar) return next(errorGuardar);
        res.redirect(rutaInicial(req.session.usuario));
      });
    });
  } catch (error) {
    next(error);
  }
}

function cerrarSesion(req, res, next) {
  req.session.destroy((error) => {
    if (error) return next(error);
    res.clearCookie(COOKIE_NAME, COOKIE_CLEAR_OPTIONS);
    res.redirect('/login');
  });
}

module.exports = {
  mostrarLogin,
  procesarLogin,
  mostrarCambioClave,
  procesarCambioClave,
  cerrarSesion
};
