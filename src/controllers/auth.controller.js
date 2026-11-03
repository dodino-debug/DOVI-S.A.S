const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');
const Usuario = require('../models/usuario.model');

// Hash de relleno: así el tiempo de respuesta es parecido exista o no el correo.
const HASH_FALSO = bcrypt.hashSync('relleno-no-valido', 12);

const RUTA_POR_ROL = {
  admin: '/admin',
  supervisor: '/supervisor',
  empleado: '/empleado',
  cliente: '/cliente'
};

function mostrarLogin(req, res) {
  if (req.session.usuario) return res.redirect(RUTA_POR_ROL[req.session.usuario.rol]);
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
      req.session.usuario = { id: usuario.id, nombre: usuario.nombre, rol: usuario.rol };
      req.session.save((errorGuardar) => {
        if (errorGuardar) return next(errorGuardar);
        res.redirect(RUTA_POR_ROL[usuario.rol]);
      });
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

module.exports = { mostrarLogin, procesarLogin, cerrarSesion };