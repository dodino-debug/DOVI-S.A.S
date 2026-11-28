require('dotenv').config();
const { validarEntorno } = require('./config/env');

validarEntorno();

const app = require('./app');

const PORT = Number(process.env.PORT) || 3000;

app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});
