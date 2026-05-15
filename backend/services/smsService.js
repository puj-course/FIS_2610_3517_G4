const axios = require('axios');

const TWILIO_ACCOUNT_SID = String(process.env.TWILIO_ACCOUNT_SID || '').trim();
const TWILIO_AUTH_TOKEN = String(process.env.TWILIO_AUTH_TOKEN || '').trim();
const TWILIO_PHONE_NUMBER = String(process.env.TWILIO_PHONE_NUMBER || '').trim();
const SMS_PROVIDER = String(process.env.SMS_PROVIDER || '').trim().toLowerCase();
const SMS_MOCK_ENABLED = ['true', '1', 'yes', 'si'].includes(
  String(process.env.SMS_MOCK_ENABLED || '').trim().toLowerCase()
);
const SMS_MODE = SMS_PROVIDER === 'mock' || SMS_MOCK_ENABLED ? 'mock' : 'twilio';
// El servicio SMS queda habilitado con Twilio real o con modo academico mock.
const SMS_ENABLED = SMS_MODE === 'mock' || Boolean(TWILIO_ACCOUNT_SID && TWILIO_AUTH_TOKEN && TWILIO_PHONE_NUMBER);

const maskPhone = (phoneNumber) => {
  const digits = String(phoneNumber || '').replace(/\D/g, '');
  if (digits.length <= 4) return '****';
  return `${'*'.repeat(Math.max(digits.length - 4, 4))}${digits.slice(-4)}`;
};

const maskSid = (sid) => {
  const value = String(sid || '');
  if (value.length <= 6) return 'sid-redacted';
  return `${value.slice(0, 2)}***${value.slice(-4)}`;
};

// Función base que hace el request a Twilio.
async function enviarSms(phoneNumber, mensaje) {
  if (SMS_MODE === 'mock') {
    const sid = `SM_MOCK_${Date.now()}`;
    console.log(`[SMS][mock] Envio simulado a ${maskPhone(phoneNumber)}. sid=${maskSid(sid)}`);
    return {
      sid,
      provider: 'mock',
      mock: true,
      message: 'Codigo enviado en modo de prueba.',
    };
  }

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

  return {
    sid: response.data.sid,
    provider: 'twilio',
    mock: false,
    message: 'Codigo enviado por SMS.',
  };
}

// Envía el OTP cuando el usuario se registra y elige SMS como canal de verificación.
async function enviarCodigoVerificacionSms(phoneNumber, nombre, codigo) {
  const expiracion = process.env.OTP_EXPIRACION_MINUTOS || 10;
  const mensaje = `Drive Control: Hola ${nombre || 'Usuario'}, tu codigo de verificacion es ${codigo}. Expira en ${expiracion} minutos.`;
  const result = await enviarSms(phoneNumber, mensaje);
  console.log(`[SMS] OTP de verificacion enviado a ${maskPhone(phoneNumber)}. sid=${maskSid(result.sid)} provider=${result.provider}`);
  return {
    ...result,
    message: result.mock ? 'Codigo de verificacion enviado en modo de prueba.' : result.message,
  };
}

// Envía el OTP cuando el usuario recupera su contraseña y elige SMS.
async function enviarCodigoRecuperacionSms(phoneNumber, nombre, codigo) {
  const expiracion = process.env.OTP_EXPIRACION_MINUTOS || 10;
  const mensaje = `Drive Control: Hola ${nombre || 'Usuario'}, tu codigo de recuperacion es ${codigo}. Expira en ${expiracion} minutos.`;
  const result = await enviarSms(phoneNumber, mensaje);
  console.log(`[SMS] OTP de recuperacion enviado a ${maskPhone(phoneNumber)}. sid=${maskSid(result.sid)} provider=${result.provider}`);
  return {
    ...result,
    message: result.mock ? 'Codigo de recuperacion enviado en modo de prueba.' : result.message,
  };
}

module.exports = {
  enviarCodigoVerificacionSms,
  enviarCodigoRecuperacionSms,
  SMS_ENABLED,
  SMS_MODE,
};
