const Usuario = require('../models/usuario.model');

module.exports = async function sesionVigente(req, res, next) {
  const guardado = req.session.usuario;
  if (!guardado) return next();

  try {
    const actual = await Usuario.estadoSesion(guardado.id);

    if (!actual || !actual.activo) {
      return req.session.destroy(() => {
        res.clearCookie('dovi.sid');
        if (req.path.startsWith('/api/')) {
          return res.status(401).json({ error: 'Sesión no válida' });
        }
        res.redirect('/login');
      });
    }

    guardado.nombre = actual.nombre;
    guardado.rol = actual.rol;
    guardado.debeCambiarClave = actual.debe_cambiar_clave;
    next();
  } catch (error) {
    next(error);
  }
};