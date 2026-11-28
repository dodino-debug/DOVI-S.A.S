const Usuario = require('../models/usuario.model');
const { COOKIE_NAME, COOKIE_CLEAR_OPTIONS } = require('../config/session');

module.exports = async function sesionVigente(req, res, next) {
  const guardado = req.session && req.session.usuario;
  if (!guardado) return next();

  try {
    const actual = await Usuario.estadoSesion(guardado.id);

    if (!actual || !actual.activo) {
      return req.session.destroy(() => {
        res.clearCookie(COOKIE_NAME, COOKIE_CLEAR_OPTIONS);
        if (req.path.startsWith('/api/')) {
          return res.status(401).json({ error: 'Sesión no válida' });
        }
        res.redirect('/login');
      });
    }

    guardado.nombre = actual.nombre;
    guardado.rol = actual.rol;
    guardado.esSupervisor = actual.es_supervisor;
    guardado.debeCambiarClave = actual.debe_cambiar_clave;
    next();
  } catch (error) {
    next(error);
  }
};
