const path = require('path');
const express = require('express');
const helmet = require('helmet');
const pool = require('./config/db');
const sesion = require('./config/session');
const { rutaInicial } = require('./config/roles');
const { tokenCsrf, verificarCsrf } = require('./middlewares/csrf');
const flash = require('./middlewares/flash');
const sesionVigente = require('./middlewares/sesion-vigente');
const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');
const clienteRoutes = require('./routes/cliente');
const empleadoRoutes = require('./routes/empleado');

const app = express();
const esProduccion = process.env.NODE_ENV === 'production';

app.set('trust proxy', 1);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'"],
        styleSrc: ["'self'", 'https://fonts.googleapis.com'],
        fontSrc: ["'self'", 'https://fonts.gstatic.com'],
        imgSrc: ["'self'", 'data:'],
        connectSrc: ["'self'"],
        formAction: ["'self'"],
        frameAncestors: ["'none'"],
        baseUri: ["'self'"],
        objectSrc: ["'none'"],
        upgradeInsecureRequests: esProduccion ? [] : null
      }
    }
  })
);

app.use(express.static(path.join(__dirname, '..', 'public')));

app.get('/salud', async (req, res, next) => {
  try {
    await pool.query('SELECT 1');
    res.json({ estado: 'ok' });
  } catch (error) {
    next(error);
  }
});

app.use(express.urlencoded({ extended: false }));

// ORDEN CRÍTICO: La sesión y validación de usuario vigente van antes de CSRF
app.use(sesion);
app.use(sesionVigente);
app.use(flash);

app.use((req, res, next) => {
  res.locals.usuario = (req.session && req.session.usuario) || null;
  next();
});

app.use(tokenCsrf);
app.use(verificarCsrf);

app.use(authRoutes);
app.use(adminRoutes);
app.use(clienteRoutes);
app.use(empleadoRoutes);

function destinoSeguro(req) {
  const usuario = req.session && req.session.usuario;
  return usuario
    ? { href: rutaInicial(usuario), texto: 'Volver a mi panel' }
    : { href: '/login', texto: 'Ir al inicio de sesión' };
}

function esPeticionApi(req) {
  return req.path.startsWith('/api/') || (req.accepts(['html', 'json']) === 'json');
}

app.use((req, res) => {
  if (esPeticionApi(req)) {
    return res.status(404).json({ error: 'Recurso no encontrado' });
  }
  const volver = destinoSeguro(req);
  res.status(404).render('pages/error', {
    codigo: 404,
    titulo: 'Página no encontrada',
    mensaje: 'La página que buscas no existe o fue movida.',
    volverHref: volver.href,
    volverTexto: volver.texto
  });
});

app.use((error, req, res, next) => {
  const estado = Number.isInteger(error.status) && error.status >= 400 && error.status < 600
    ? error.status
    : 500;

  const marcaTiempo = new Date().toISOString();
  console.error(
    `[${marcaTiempo}] ${req.method} ${req.originalUrl} -> ${estado}: ${error.message}`
  );
  if (estado >= 500 && error.stack) {
    console.error(error.stack);
  }

  const mensaje =
    estado < 500 && error.exponer
      ? error.message
      : estado === 403
        ? 'No tienes permiso para realizar esta acción.'
        : estado === 400
          ? 'La solicitud no es válida.'
          : 'Ocurrió un error interno del servidor. Inténtalo de nuevo más tarde.';

  if (esPeticionApi(req)) {
    return res.status(estado).json({ error: mensaje });
  }

  const volver = destinoSeguro(req);
  res.status(estado).render('pages/error', {
    codigo: estado,
    titulo: estado >= 500 ? 'Error del servidor' : 'No se pudo completar la solicitud',
    mensaje,
    volverHref: volver.href,
    volverTexto: volver.texto
  });
});

module.exports = app;
