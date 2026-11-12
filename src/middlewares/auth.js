
function requerirSesion(req, res, next) {
  if (!req.session.usuario) return res.redirect('/login');
  next();
}

function requerirRol(...rolesPermitidos) {
  return (req, res, next) => {
    const usuario = req.session.usuario;

    if (!usuario) return res.redirect('/login');

    if (usuario.debeCambiarClave) {
      return res.redirect('/cambiar-clave');
    }

    if (!rolesPermitidos.includes(usuario.rol)) {
      return res.status(403).send('No tienes permiso para ver esta página.');
    }

    next();
  };
}

function requerirRolApi(...rolesPermitidos) {
  return (req, res, next) => {
    const usuario = req.session.usuario;

    if (!usuario) {
      return res.status(401).json({
        error: 'Debes iniciar sesión.'
      });
    }

    if (usuario.debeCambiarClave) {
      return res.status(403).json({
        error: 'Debes cambiar tu contraseña.'
      });
    }

    if (!rolesPermitidos.includes(usuario.rol)) {
      return res.status(403).json({
        error: 'No tienes permiso para acceder.'
      });
    }

    next();
  };
}

module.exports = {
  requerirSesion,
  requerirRol,
  requerirRolApi
};
