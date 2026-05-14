const axios = require('axios');

const TWILIO_ACCOUNT_SID = String(process.env.TWILIO_ACCOUNT_SID || '').trim();
const TWILIO_AUTH_TOKEN = String(process.env.TWILIO_AUTH_TOKEN || '').trim();
const TWILIO_PHONE_NUMBER = String(process.env.TWILIO_PHONE_NUMBER || '').trim();
// El servicio SMS es opcional; si no hay credenciales se lanza error controlado.
const SMS_ENABLED = Boolean(TWILIO_ACCOUNT_SID && TWILIO_AUTH_TOKEN && TWILIO_PHONE_NUMBER);

// Función base que hace el request a Twilio.
async function enviarSms(phoneNumber, mensaje) {
  if (!SMS_ENABLED) {
    throw new Error(
      'Servicio SMS no configurado: faltan TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN o TWILIO_PHONE_NUMBER.'
    );
  }

  const body = new URLSearchParams({
    To: phoneNumber,
    From: TWILIO_PHONE_NUMBER,
    Body: mensaje,
  });

  const response = await axios.post(
    `https://api.twilio.com/2010-04-01/Accounts/${TWILIO_ACCOUNT_SID}/Messages.json`,
    body.toString(),
    {
      auth: {
        username: TWILIO_ACCOUNT_SID,
        password: TWILIO_AUTH_TOKEN,
      },
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      timeout: 10000,
    }
  );

  if (!response?.data?.sid) {
    throw new Error('Twilio no confirmo el envio del SMS.');
  }

  return response.data.sid;
}

// Envía el OTP cuando el usuario se registra y elige SMS como canal de verificación.
async function enviarCodigoVerificacionSms(phoneNumber, nombre, codigo) {
  const expiracion = process.env.OTP_EXPIRACION_MINUTOS || 10;
  const mensaje = `Drive Control: Hola ${nombre || 'Usuario'}, tu codigo de verificacion es ${codigo}. Expira en ${expiracion} minutos.`;
  const sid = await enviarSms(phoneNumber, mensaje);
  console.log(`[SMS] OTP de verificacion enviado a ${phoneNumber}. sid=${sid}`);
}

// Envía el OTP cuando el usuario recupera su contraseña y elige SMS.
async function enviarCodigoRecuperacionSms(phoneNumber, nombre, codigo) {
  const expiracion = process.env.OTP_EXPIRACION_MINUTOS || 10;
  const mensaje = `Drive Control: Hola ${nombre || 'Usuario'}, tu codigo de recuperacion es ${codigo}. Expira en ${expiracion} minutos.`;
  const sid = await enviarSms(phoneNumber, mensaje);
  console.log(`[SMS] OTP de recuperacion enviado a ${phoneNumber}. sid=${sid}`);
}

module.exports = { enviarCodigoVerificacionSms, enviarCodigoRecuperacionSms, SMS_ENABLED };
