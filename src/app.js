const path = require('path');
const express = require('express');
const helmet = require('helmet');
const pool = require('./config/db');
const sesion = require('./config/session');
const { tokenCsrf, verificarCsrf } = require('./middlewares/csrf');
const authRoutes = require('./routes/auth');
const panelesRoutes = require('./routes/paneles');

const app = express();

app.set('trust proxy', 1);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(helmet());
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
app.use(sesion);
app.use((req, res, next) => {
  res.locals.usuario = req.session.usuario || null;
  next();
});
app.use(tokenCsrf);
app.use(verificarCsrf);

app.use(authRoutes);
app.use(panelesRoutes);

app.use((req, res) => {
  res.status(404).send('Página no encontrada');
});

app.use((error, req, res, next) => {
  const estado = error.status || 500;
  console.error('Error del servidor:', error.message);
  res.status(estado).send(estado === 500 ? 'Error interno del servidor' : error.message);
});

module.exports = app;