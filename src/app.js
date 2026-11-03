const path = require('path');
const express = require('express');
const helmet = require('helmet');
const pool = require('./config/db');

const app = express();

app.set('trust proxy', 1);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(helmet());
app.use(express.static(path.join(__dirname, '..', 'public')));

app.get('/', async (req, res, next) => {
  try {
    const resultado = await pool.query('SELECT NOW() AS ahora');
    res.render('pages/inicio', { ahora: resultado.rows[0].ahora });
  } catch (error) {
    next(error);
  }
});

app.use((error, req, res, next) => {
  console.error('Error del servidor:', error.message);
  res.status(500).send('Error interno del servidor');
});

module.exports = app;