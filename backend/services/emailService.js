const nodemailer = require('nodemailer');

// Transporter SMTP reutilizable para todos los correos transaccionales.
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.EMAIL_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

async function enviarCodigoVerificacion(email, nombre, codigo) {
  // Plantilla de bienvenida con OTP temporal para activacion de cuenta.
  const mailOptions = {
    from: `"Drive Control" <${process.env.EMAIL_USER}>`,
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

  await transporter.sendMail(mailOptions);
}

module.exports = { enviarCodigoVerificacion };
