const { rutaInicial } = require('../config/roles');

function requerirSesion(req, res, next) {
  if (!req.session || !req.session.usuario) return res.redirect('/login');
  next();
}

// 'supervisor' no es un rol de la base de datos: es un empleado con es_supervisor.
// Un supervisor también pasa los controles de 'empleado'.
function permitido(usuario, roles) {
  return roles.includes(usuario.rol) || (Boolean(usuario.esSupervisor) && roles.includes('supervisor'));
}

function requerirRol(...rolesPermitidos) {
  return (req, res, next) => {
    const usuario = req.session && req.session.usuario;
    if (!usuario) return res.redirect('/login');
    if (usuario.debeCambiarClave) return res.redirect('/cambiar-clave');
    if (!permitido(usuario, rolesPermitidos)) {
      return res.status(403).render('pages/error', {
        codigo: 403,
        titulo: 'Acceso denegado',
        mensaje: 'No tienes permiso para ver esta página.',
        volverHref: rutaInicial(usuario),
        volverTexto: 'Volver a mi panel'
      });
    }
    next();
  };
}

function requerirRolApi(...rolesPermitidos) {
  return (req, res, next) => {
    const usuario = req.session && req.session.usuario;
    if (!usuario) return res.status(401).json({ error: 'Sesión no iniciada' });
    if (usuario.debeCambiarClave || !permitido(usuario, rolesPermitidos)) {
      return res.status(403).json({ error: 'Sin permiso' });
    }
    next();
  };
}

module.exports = { requerirSesion, requerirRol, requerirRolApi };
