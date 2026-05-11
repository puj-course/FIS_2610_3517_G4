const axios = require('axios');

const TWILIO_ACCOUNT_SID = String(process.env.TWILIO_ACCOUNT_SID || '').trim();
const TWILIO_AUTH_TOKEN = String(process.env.TWILIO_AUTH_TOKEN || '').trim();
const TWILIO_PHONE_NUMBER = String(process.env.TWILIO_PHONE_NUMBER || '').trim();
const SMS_ENABLED = Boolean(TWILIO_ACCOUNT_SID && TWILIO_AUTH_TOKEN && TWILIO_PHONE_NUMBER);

async function enviarCodigoRecuperacionSms(phoneNumber, nombre, codigo) {
  if (!SMS_ENABLED) {
    throw new Error(
      'Servicio SMS no configurado: faltan TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN o TWILIO_PHONE_NUMBER.'
    );
  }

  const body = new URLSearchParams({
    To: phoneNumber,
    From: TWILIO_PHONE_NUMBER,
    Body: `Drive Control: ${nombre || 'Usuario'}, tu codigo de recuperacion es ${codigo}. Expira en ${process.env.OTP_EXPIRACION_MINUTOS || 10} minutos.`,
  });

  const response = await axios.post(
    `https://api.twilio.com/2010-04-01/Accounts/${TWILIO_ACCOUNT_SID}/Messages.json`,
    body.toString(),
    {
      auth: {
        username: TWILIO_ACCOUNT_SID,
        password: TWILIO_AUTH_TOKEN,
      },
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      timeout: 10000,
    }
  );

  if (!response?.data?.sid) {
    throw new Error('Twilio no confirmo el envio del SMS.');
  }

  console.log(`[SMS] OTP de recuperacion enviado a ${phoneNumber}. sid=${response.data.sid}`);
}

module.exports = { enviarCodigoRecuperacionSms, SMS_ENABLED };
