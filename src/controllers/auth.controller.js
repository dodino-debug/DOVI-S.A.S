const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');
const Usuario = require('../models/usuario.model');
const { rutaInicial } = require('../config/roles');

// Hash de relleno: así el tiempo de respuesta es parecido exista o no el correo.
const HASH_FALSO = bcrypt.hashSync('relleno-no-valido', 12);

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
    const coincide = await bcrypt.compare(req.body.clave, usuario ? usuario.password_hash : HASH_FALSO);

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
  res.render('pages/auth/cambiar-clave', {
    error: null,
    obligatorio: req.session.usuario.debeCambiarClave
  });
}

async function procesarCambioClave(req, res, next) {
  const obligatorio = req.session.usuario.debeCambiarClave;
  const responder = (estado, error) =>
    res.status(estado).render('pages/auth/cambiar-clave', { error, obligatorio });

  try {
    if (!validationResult(req).isEmpty()) {
      return responder(
        400,
        'La nueva contraseña debe tener entre 10 y 64 caracteres, ser distinta de la actual y coincidir con la confirmación.'
      );
    }

    const usuario = await Usuario.buscarPorId(req.session.usuario.id);
    if (!usuario || !usuario.activo) {
      return req.session.destroy(() => res.redirect('/login'));
    }

    const correcta = await bcrypt.compare(req.body.claveActual, usuario.password_hash);
    if (!correcta) return responder(401, 'La contraseña actual no es correcta.');

    const hash = await bcrypt.hash(req.body.claveNueva, 12);
    await Usuario.actualizarClave(usuario.id, hash);

    req.session.usuario.debeCambiarClave = false;
    req.session.save((error) => {
      if (error) return next(error);
      res.redirect(rutaInicial(req.session.usuario));
    });
  } catch (error) {
    next(error);
  }
}

function cerrarSesion(req, res, next) {
  req.session.destroy((error) => {
    if (error) return next(error);
    res.clearCookie('dovi.sid');
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