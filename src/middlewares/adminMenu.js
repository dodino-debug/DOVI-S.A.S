// src/middlewares/adminMenu.js
function setAdminMenu(req, res, next) {
    // Definimos los enlaces del menú de administración
    res.locals.enlaces = [
        ['dashboard', '/admin/dashboard', 'Tablero'],
        ['usuarios', '/admin/usuarios', 'Usuarios'],
        // Agrega aquí los demás módulos que tenga tu panel (ej. inventario, clientes, etc.)
    ];
    next();
}

module.exports = setAdminMenu;