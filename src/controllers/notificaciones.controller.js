const Notificacion = require('../models/notificacion.model');
const { esId } = require('../utils/entrada');

async function listar(req, res, next) {
  try {
    res.set('Cache-Control', 'no-store');
    res.json(await Notificacion.listar(req.session.usuario.id));
  } catch (error) {
    next(error);
  }
}

async function marcarLeida(req, res, next) {
  try {
    if (!esId(req.params.id)) return res.status(400).json({ error: 'Identificador no válido' });
    await Notificacion.marcarLeida(req.session.usuario.id, Number(req.params.id));
    res.json({ ok: true });
  } catch (error) {
    next(error);
  }
}

async function marcarTodas(req, res, next) {
  try {
    await Notificacion.marcarTodas(req.session.usuario.id);
    res.json({ ok: true });
  } catch (error) {
    next(error);
  }
}

module.exports = { listar, marcarLeida, marcarTodas };
