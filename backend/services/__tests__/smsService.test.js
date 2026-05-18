'use strict';

// Variable con prefijo 'mock' — puede ser referenciada en la factory de jest.mock (hoisted).
const mockAxiosPost = jest.fn();

jest.mock('axios', () => ({
  post: mockAxiosPost,
}));

// ─── SMS_ENABLED = false (sin credenciales Twilio) ────────────────────────────

describe('smsService — SMS_ENABLED=false', () => {
  let smsService;

  beforeAll(() => {
    delete process.env.TWILIO_ACCOUNT_SID;
    delete process.env.TWILIO_AUTH_TOKEN;
    delete process.env.TWILIO_PHONE_NUMBER;
    jest.resetModules();
    smsService = require('../smsService.js');
  });

  afterAll(() => {
    delete process.env.TWILIO_ACCOUNT_SID;
    delete process.env.TWILIO_AUTH_TOKEN;
    delete process.env.TWILIO_PHONE_NUMBER;
  });

  it('SMS_ENABLED es false cuando faltan las tres credenciales', () => {
    expect(smsService.SMS_ENABLED).toBe(false);
  });

  it('enviarCodigoRecuperacionSms lanza error de configuracion', async () => {
    await expect(
      smsService.enviarCodigoRecuperacionSms('+573001234567', 'Juan', '123456')
    ).rejects.toThrow(/Servicio SMS no configurado/);
  });

  it('no realiza ninguna llamada HTTP cuando SMS_ENABLED es false', async () => {
    mockAxiosPost.mockClear();

    try {
      await smsService.enviarCodigoRecuperacionSms('+573001234567', 'Juan', '123456');
    } catch {
      // esperado
    }

    expect(mockAxiosPost).not.toHaveBeenCalled();
  });

  it('SMS_ENABLED es false cuando solo falta TWILIO_PHONE_NUMBER', async () => {
    process.env.TWILIO_ACCOUNT_SID = 'ACtest';
    process.env.TWILIO_AUTH_TOKEN = 'authtest';
    delete process.env.TWILIO_PHONE_NUMBER;
    jest.resetModules();
    const partialService = require('../smsService.js');

    expect(partialService.SMS_ENABLED).toBe(false);

    delete process.env.TWILIO_ACCOUNT_SID;
    delete process.env.TWILIO_AUTH_TOKEN;
  });
});

// ─── SMS_ENABLED = true (con credenciales Twilio) ────────────────────────────

describe('smsService — SMS_ENABLED=true', () => {
  let smsService;

  const FAKE_SID = 'ACfake123456789abcdef';
  const FAKE_TOKEN = 'auth_token_fake_xyz';
  const FAKE_PHONE = '+15551234567';

  beforeAll(() => {
    process.env.TWILIO_ACCOUNT_SID = FAKE_SID;
    process.env.TWILIO_AUTH_TOKEN = FAKE_TOKEN;
    process.env.TWILIO_PHONE_NUMBER = FAKE_PHONE;
    jest.resetModules();
    smsService = require('../smsService.js');
  });

  afterAll(() => {
    delete process.env.TWILIO_ACCOUNT_SID;
    delete process.env.TWILIO_AUTH_TOKEN;
    delete process.env.TWILIO_PHONE_NUMBER;
  });

  beforeEach(() => {
    mockAxiosPost.mockReset();
  });

  it('SMS_ENABLED es true cuando las tres credenciales estan presentes', () => {
    expect(smsService.SMS_ENABLED).toBe(true);
  });

  it('enviarCodigoRecuperacionSms resuelve cuando Twilio confirma con sid', async () => {
    mockAxiosPost.mockResolvedValueOnce({ data: { sid: 'SMabc123def456' } });

    await expect(
      smsService.enviarCodigoRecuperacionSms('+573001234567', 'Laura', '654321')
    ).resolves.toBeUndefined();

    expect(mockAxiosPost).toHaveBeenCalledTimes(1);
  });

  it('llama a la URL correcta de la API de Twilio con el SID de cuenta', async () => {
    mockAxiosPost.mockResolvedValueOnce({ data: { sid: 'SMxxx' } });

    await smsService.enviarCodigoRecuperacionSms('+573001234567', 'Maria', '111222');

    const [url] = mockAxiosPost.mock.calls[0];
    expect(url).toContain(FAKE_SID);
    expect(url).toContain('Messages.json');
  });

  it('envia autenticacion Basic con el SID y el token de Twilio', async () => {
    mockAxiosPost.mockResolvedValueOnce({ data: { sid: 'SMyyy' } });

    await smsService.enviarCodigoRecuperacionSms('+573001234567', 'Carlos', '333444');

    const [, , config] = mockAxiosPost.mock.calls[0];
    expect(config.auth.username).toBe(FAKE_SID);
    expect(config.auth.password).toBe(FAKE_TOKEN);
  });

  it('envia el numero destino en el payload del mensaje', async () => {
    mockAxiosPost.mockResolvedValueOnce({ data: { sid: 'SMzzz' } });

    await smsService.enviarCodigoRecuperacionSms('+573009876543', 'Pedro', '555666');

    const [, body] = mockAxiosPost.mock.calls[0];
    expect(body).toContain('To=%2B573009876543');
  });

  it('lanza error cuando Twilio responde sin sid en data', async () => {
    mockAxiosPost.mockResolvedValueOnce({ data: {} });

    await expect(
      smsService.enviarCodigoRecuperacionSms('+573001234567', 'Ana', '777888')
    ).rejects.toThrow(/Twilio no confirmo el envio del SMS/);
  });

  it('lanza error cuando Twilio responde con data null', async () => {
    mockAxiosPost.mockResolvedValueOnce({ data: null });

    await expect(
      smsService.enviarCodigoRecuperacionSms('+573001234567', 'Luis', '999000')
    ).rejects.toThrow(/Twilio no confirmo el envio del SMS/);
  });

  it('propaga el error de red cuando axios.post falla', async () => {
    mockAxiosPost.mockRejectedValueOnce(new Error('Network Error'));

    await expect(
      smsService.enviarCodigoRecuperacionSms('+573001234567', 'Sofia', '112233')
    ).rejects.toThrow('Network Error');
  });
});
