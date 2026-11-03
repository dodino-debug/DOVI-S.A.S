const session = require('express-session');
const PgStore = require('connect-pg-simple')(session);
const pool = require('./db');

module.exports = session({
  store: new PgStore({ pool, tableName: 'session' }),
  name: 'dovi.sid',
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 1000 * 60 * 60 * 8
  }
});