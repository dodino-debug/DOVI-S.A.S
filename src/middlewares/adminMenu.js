function setAdminMenu(req, res, next) {
  res.locals.enlaces = [
    ['dashboard', '/admin/dashboard', 'Tablero'],
    ['clientes', '/admin/clientes', 'Clientes'],
    ['servicios', '/admin/servicios', 'Servicios'],
    ['usuarios', '/admin/usuarios', 'Usuarios'],
    ['reportes', '/admin/reportes', 'Reportes']
  ];
  next();
}

module.exports = setAdminMenu;
