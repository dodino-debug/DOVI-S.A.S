function requerirSesion(req, res, next) {
  if (!req.session.usuario) return res.redirect('/login');
  next();
}

function requerirRol(...rolesPermitidos) {
  return (req, res, next) => {
    const usuario = req.session.usuario;
    if (!usuario) return res.redirect('/login');
    if (usuario.debeCambiarClave) return res.redirect('/cambiar-clave');
    if (!rolesPermitidos.includes(usuario.rol)) {
      return res.status(403).send('No tienes permiso para ver esta página.');
    }
    next();
  };
}

module.exports = { requerirSesion, requerirRol };