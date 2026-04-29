const nodemailer = require('nodemailer');

const EMAIL_USER = process.env.EMAIL_USER;
const EMAIL_PASS = process.env.EMAIL_PASS;
const EMAIL_HOST = process.env.EMAIL_HOST || 'smtp.gmail.com';
const EMAIL_PORT = parseInt(process.env.EMAIL_PORT || '587');
const EMAIL_SECURE = process.env.EMAIL_SECURE === 'true' || EMAIL_PORT === 465;
const EMAIL_ENABLED = Boolean(EMAIL_USER && EMAIL_PASS);

// Transporter SMTP reutilizable para todos los correos transaccionales.
const transporter = nodemailer.createTransport({
  host: EMAIL_HOST,
  port: EMAIL_PORT,
  secure: EMAIL_SECURE,
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASS,
  },
});

async function verificarServicioCorreo() {
  if (!EMAIL_ENABLED) {
    return {
      ok: false,
      reason: 'missing_credentials',
      message: 'Faltan EMAIL_USER y/o EMAIL_PASS',
      host: EMAIL_HOST,
      port: EMAIL_PORT,
      secure: EMAIL_SECURE,
    };
  }

  try {
    await transporter.verify();
    return {
      ok: true,
      host: EMAIL_HOST,
      port: EMAIL_PORT,
      secure: EMAIL_SECURE,
      user: EMAIL_USER,
    };
  } catch (error) {
    return {
      ok: false,
      reason: 'verify_failed',
      message: error.message,
      code: error.code,
      host: EMAIL_HOST,
      port: EMAIL_PORT,
      secure: EMAIL_SECURE,
      user: EMAIL_USER,
    };
  }
}

async function enviarCodigoVerificacion(email, nombre, codigo) {
  if (!EMAIL_ENABLED) {
    throw new Error('Servicio de correo no configurado: faltan EMAIL_USER y/o EMAIL_PASS en backend/.env');
  }

  // Plantilla de bienvenida con OTP temporal para activacion de cuenta.
  const mailOptions = {
    from: `"Drive Control" <${EMAIL_USER}>`,
    to: email,
    subject: 'Código de verificación - Drive Control',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 480px; margin: auto; padding: 32px; border: 1px solid #e5e7eb; border-radius: 8px;">
        <h2 style="color: #1e3a5f;">¡Bienvenido a Drive Control, ${nombre || email}!</h2>
        <p style="color: #374151;">Para activar tu cuenta, ingresa el siguiente código de verificación en la aplicación:</p>
        <div style="text-align: center; margin: 32px 0;">
          <span style="font-size: 36px; font-weight: bold; letter-spacing: 10px; color: #1e3a5f; background: #f3f4f6; padding: 16px 24px; border-radius: 8px;">${codigo}</span>
        </div>
        <p style="color: #6b7280; font-size: 14px;">Este código expira en <strong>${process.env.OTP_EXPIRACION_MINUTOS || 10} minutos</strong>.</p>
        <p style="color: #6b7280; font-size: 14px;">Si no creaste esta cuenta, puedes ignorar este correo.</p>
        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 24px 0;" />
        <p style="color: #9ca3af; font-size: 12px; text-align: center;">Drive Control &mdash; Sistema de gestión logística</p>
      </div>
    `,
  };

  const info = await transporter.sendMail(mailOptions);
  const accepted = Array.isArray(info.accepted) ? info.accepted : [];
  const rejected = Array.isArray(info.rejected) ? info.rejected : [];

  if (accepted.length === 0 || rejected.length > 0) {
    throw new Error(`SMTP no confirmo entrega. accepted=${accepted.length} rejected=${rejected.length}`);
  }

  console.log(`[EMAIL] OTP enviado a ${email}. messageId=${info.messageId}`);
}

module.exports = { enviarCodigoVerificacion, verificarServicioCorreo };
