const session = require('express-session');
const PgStore = require('connect-pg-simple')(session);
const pool = require('./db');

const COOKIE_NAME = 'dovi.sid';
const ES_PRODUCCION = process.env.NODE_ENV === 'production';

const COOKIE_CLEAR_OPTIONS = {
  httpOnly: true,
  secure: ES_PRODUCCION,
  sameSite: 'lax',
  path: '/'
};

const sesion = session({
  store: new PgStore({ pool, tableName: 'session' }),
  name: COOKIE_NAME,
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    ...COOKIE_CLEAR_OPTIONS,
    maxAge: 1000 * 60 * 60 * 8
  }
});

module.exports = sesion;
module.exports.COOKIE_NAME = COOKIE_NAME;
module.exports.COOKIE_CLEAR_OPTIONS = COOKIE_CLEAR_OPTIONS;
