function smtpConfigurado() {
  return Boolean(process.env.SMTP_HOST && process.env.SMTP_HOST.trim());
}

function crearTransporteSmtp() {
  let nodemailer;
  try {
    nodemailer = require('nodemailer');
  } catch {
    throw new Error('SMTP_HOST está configurado pero el paquete "nodemailer" no está instalado.');
  }

  const puerto = Number(process.env.SMTP_PORT) || 587;
  const seguro = process.env.SMTP_SECURE === 'true' || puerto === 465;

  const configuracion = {
    host: process.env.SMTP_HOST.trim(),
    port: puerto,
    secure: seguro
  };

  if (process.env.SMTP_USER && process.env.SMTP_PASS) {
    configuracion.auth = {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    };
  }

  return nodemailer.createTransport(configuracion);
}

async function enviarRecuperacionClave({ para, nombre, enlace, minutos }) {
  if (!smtpConfigurado()) {
    if (process.env.NODE_ENV !== 'production') {
      console.log('\n=== [DEV] ENLACE DE RECUPERACIÓN DE CONTRASEÑA ===');
      console.log(`Usuario: ${nombre} <${para}>`);
      console.log(`Enlace (válido ${minutos} minutos): ${enlace}`);
      console.log('==================================================\n');
      return;
    }

    console.error(
      '[CORREO] SMTP_HOST no está configurado en producción; no se pudo enviar el correo de recuperación.'
    );
    return;
  }

  const transporte = crearTransporteSmtp();
  const remitente = process.env.SMTP_FROM || 'no-reply@dovi.com';

  await transporte.sendMail({
    from: remitente,
    to: para,
    subject: 'DOVI S.A.S. | Restablecimiento de contraseña',
    text: [
      `Hola ${nombre},`,
      '',
      'Recibimos una solicitud para restablecer tu contraseña en la plataforma de DOVI S.A.S.',
      `Abre el siguiente enlace dentro de los próximos ${minutos} minutos:`,
      '',
      enlace,
      '',
      'Este enlace es de un solo uso. Si no solicitaste este cambio, puedes ignorar este mensaje.'
    ].join('\n')
  });
}

module.exports = { enviarRecuperacionClave, smtpConfigurado };
