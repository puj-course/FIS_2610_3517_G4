const assert = require('node:assert/strict');
const test = require('node:test');
const axios = require('axios');

const SMS_SERVICE_PATH = '../services/smsService';
const MODULE_PATH = require.resolve(SMS_SERVICE_PATH);

const TEST_ENV = {
  TWILIO_ACCOUNT_SID: 'AC_TEST_SID',
  TWILIO_AUTH_TOKEN: 'test-auth-token',
  TWILIO_PHONE_NUMBER: '+15550000000',
  OTP_EXPIRACION_MINUTOS: '10',
};

const originalEnv = { ...process.env };
const originalPost = axios.post;
const originalLog = console.log;

const loadSmsService = (env = TEST_ENV) => {
  delete require.cache[MODULE_PATH];
  process.env = { ...originalEnv, ...env };
  return require(SMS_SERVICE_PATH);
};

const resetRuntime = () => {
  delete require.cache[MODULE_PATH];
  process.env = { ...originalEnv };
  axios.post = originalPost;
  console.log = originalLog;
};

test.afterEach(() => {
  resetRuntime();
});

test('envia codigo de verificacion por Twilio cuando existe sid', async () => {
  const calls = [];
  const logs = [];
  axios.post = async (...args) => {
    calls.push(args);
    return { data: { sid: 'SM_TEST_VERIFICATION' } };
  };
  console.log = (...args) => logs.push(args.join(' '));

  const { SMS_ENABLED, enviarCodigoVerificacionSms } = loadSmsService();

  await enviarCodigoVerificacionSms('+573001112233', 'Laura', '123456');

  assert.equal(SMS_ENABLED, true);
  assert.equal(calls.length, 1);
  assert.match(calls[0][0], /\/Accounts\/AC_TEST_SID\/Messages\.json$/);
  assert.equal(calls[0][2].auth.username, TEST_ENV.TWILIO_ACCOUNT_SID);
  assert.equal(calls[0][2].auth.password, TEST_ENV.TWILIO_AUTH_TOKEN);
  assert.equal(calls[0][2].headers['Content-Type'], 'application/x-www-form-urlencoded');
  assert.equal(calls[0][2].timeout, 10000);
  assert.match(calls[0][1], /To=%2B573001112233/);
  assert.match(calls[0][1], /From=%2B15550000000/);
  assert.match(calls[0][1], /codigo\+de\+verificacion\+es\+123456/);
  assert.equal(logs.length, 1);
});

test('envia codigo de recuperacion por Twilio cuando existe sid', async () => {
  const calls = [];
  axios.post = async (...args) => {
    calls.push(args);
    return { data: { sid: 'SM_TEST_RECOVERY' } };
  };
  console.log = () => {};

  const { enviarCodigoRecuperacionSms } = loadSmsService();

  await enviarCodigoRecuperacionSms('+573009998877', 'Carlos', '654321');

  assert.equal(calls.length, 1);
  assert.match(calls[0][1], /To=%2B573009998877/);
  assert.match(calls[0][1], /codigo\+de\+recuperacion\+es\+654321/);
});

test('lanza error controlado cuando falta TWILIO_ACCOUNT_SID', async () => {
  const { enviarCodigoRecuperacionSms, SMS_ENABLED } = loadSmsService({
    ...TEST_ENV,
    TWILIO_ACCOUNT_SID: '',
  });

  assert.equal(SMS_ENABLED, false);
  await assert.rejects(
    () => enviarCodigoRecuperacionSms('+573001112233', 'Laura', '123456'),
    /Servicio SMS no configurado/
  );
});

test('lanza error controlado cuando falta TWILIO_AUTH_TOKEN', async () => {
  const { enviarCodigoRecuperacionSms, SMS_ENABLED } = loadSmsService({
    ...TEST_ENV,
    TWILIO_AUTH_TOKEN: '',
  });

  assert.equal(SMS_ENABLED, false);
  await assert.rejects(
    () => enviarCodigoRecuperacionSms('+573001112233', 'Laura', '123456'),
    /Servicio SMS no configurado/
  );
});

test('lanza error controlado cuando falta TWILIO_PHONE_NUMBER', async () => {
  const { enviarCodigoRecuperacionSms, SMS_ENABLED } = loadSmsService({
    ...TEST_ENV,
    TWILIO_PHONE_NUMBER: '',
  });

  assert.equal(SMS_ENABLED, false);
  await assert.rejects(
    () => enviarCodigoRecuperacionSms('+573001112233', 'Laura', '123456'),
    /Servicio SMS no configurado/
  );
});

test('lanza error cuando Twilio no retorna sid', async () => {
  axios.post = async () => ({ data: {} });

  const { enviarCodigoRecuperacionSms } = loadSmsService();

  await assert.rejects(
    () => enviarCodigoRecuperacionSms('+573001112233', 'Laura', '123456'),
    /Twilio no confirmo el envio del SMS/
  );
});

test('propaga excepcion cuando Twilio responde con error', async () => {
  axios.post = async () => {
    throw new Error('Twilio unavailable');
  };

  const { enviarCodigoRecuperacionSms } = loadSmsService();

  await assert.rejects(
    () => enviarCodigoRecuperacionSms('+573001112233', 'Laura', '123456'),
    /Twilio unavailable/
  );
});

test('no imprime credenciales Twilio en logs de envio exitoso', async () => {
  const logs = [];
  axios.post = async () => ({ data: { sid: 'SM_SAFE_LOG' } });
  console.log = (...args) => logs.push(args.join(' '));

  const { enviarCodigoRecuperacionSms } = loadSmsService();

  await enviarCodigoRecuperacionSms('+573001112233', 'Laura', '123456');

  const joinedLogs = logs.join('\n');
  assert.doesNotMatch(joinedLogs, new RegExp(TEST_ENV.TWILIO_ACCOUNT_SID));
  assert.doesNotMatch(joinedLogs, new RegExp(TEST_ENV.TWILIO_AUTH_TOKEN));
});
