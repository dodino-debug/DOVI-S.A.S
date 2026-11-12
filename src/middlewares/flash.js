module.exports = function flash(req, res, next) {
  // Las consultas automáticas del tablero no deben consumir el aviso.
  if (req.path.startsWith('/api/')) return next();

  res.locals.flash = req.session.flash || null;
  delete req.session.flash;

  res.redirigir = (destino, tipo, texto) => {
    req.session.flash = { tipo, texto };
    req.session.save(() => res.redirect(destino));
  };

  next();
};