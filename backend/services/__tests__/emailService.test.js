'use strict';

// Las variables con prefijo 'mock' pueden ser referenciadas en la factory de jest.mock
// aunque esta se eleve (hoist) al inicio del archivo antes de las declaraciones const.
const mockSendMail = jest.fn();
const mockVerify = jest.fn();

jest.mock('nodemailer', () => ({
  createTransport: jest.fn(() => ({ sendMail: mockSendMail, verify: mockVerify })),
}));

// ─── EMAIL_ENABLED = false (sin credenciales) ────────────────────────────────

describe('emailService — EMAIL_ENABLED=false', () => {
  let emailService;

  beforeAll(() => {
    delete process.env.EMAIL_USER;
    delete process.env.EMAIL_PASS;
    jest.resetModules();
    emailService = require('../emailService.js');
  });

  afterAll(() => {
    delete process.env.EMAIL_USER;
    delete process.env.EMAIL_PASS;
  });

  it('verificarServicioCorreo retorna ok=false con reason missing_credentials', async () => {
    const result = await emailService.verificarServicioCorreo();

    expect(result.ok).toBe(false);
    expect(result.reason).toBe('missing_credentials');
    expect(result.message).toMatch(/faltan/i);
  });

  it('verificarServicioCorreo no lanza excepcion aunque falten credenciales', async () => {
    await expect(emailService.verificarServicioCorreo()).resolves.toBeDefined();
  });

  it('enviarCodigoVerificacion lanza error de configuracion', async () => {
    await expect(
      emailService.enviarCodigoVerificacion('dest@test.com', 'Juan', '123456')
    ).rejects.toThrow(/Servicio de correo no configurado/);
  });

  it('enviarCodigoRecuperacion lanza error de configuracion', async () => {
    await expect(
      emailService.enviarCodigoRecuperacion('dest@test.com', 'Ana', '654321')
    ).rejects.toThrow(/Servicio de correo no configurado/);
  });

  it('no llama al transporter cuando faltan credenciales', async () => {
    mockSendMail.mockClear();

    try {
      await emailService.enviarCodigoVerificacion('dest@test.com', 'Test', '000000');
    } catch {
      // esperado
    }

    expect(mockSendMail).not.toHaveBeenCalled();
  });
});

// ─── EMAIL_ENABLED = true (con credenciales) ─────────────────────────────────

describe('emailService — EMAIL_ENABLED=true', () => {
  let emailService;

  beforeAll(() => {
    process.env.EMAIL_USER = 'syntix634@gmail.com';
    process.env.EMAIL_PASS = 'testapppassword';
    jest.resetModules();
    emailService = require('../emailService.js');
  });

  afterAll(() => {
    delete process.env.EMAIL_USER;
    delete process.env.EMAIL_PASS;
  });

  beforeEach(() => {
    mockSendMail.mockReset();
    mockVerify.mockReset();
  });

  // verificarServicioCorreo ──────────────────────────────────────────────────

  it('verificarServicioCorreo retorna ok=true cuando verify() resuelve', async () => {
    mockVerify.mockResolvedValueOnce(true);

    const result = await emailService.verificarServicioCorreo();

    expect(result.ok).toBe(true);
    expect(result.user).toBe('syntix634@gmail.com');
    expect(result.host).toBeDefined();
    expect(result.port).toBeDefined();
  });

  it('verificarServicioCorreo retorna ok=false con reason verify_failed cuando verify() lanza', async () => {
    mockVerify.mockRejectedValueOnce(new Error('connection refused'));

    const result = await emailService.verificarServicioCorreo();

    expect(result.ok).toBe(false);
    expect(result.reason).toBe('verify_failed');
    expect(result.message).toBe('connection refused');
  });

  // enviarCodigoVerificacion ────────────────────────────────────────────────

  it('enviarCodigoVerificacion resuelve cuando sendMail acepta el destinatario', async () => {
    mockSendMail.mockResolvedValueOnce({
      accepted: ['dest@test.com'],
      rejected: [],
      messageId: 'msg-001@test',
    });

    await expect(
      emailService.enviarCodigoVerificacion('dest@test.com', 'Carlos', '111222')
    ).resolves.toBeUndefined();

    expect(mockSendMail).toHaveBeenCalledTimes(1);
  });

  it('enviarCodigoVerificacion incluye el codigo OTP en el asunto del correo', async () => {
    mockSendMail.mockResolvedValueOnce({
      accepted: ['dest@test.com'],
      rejected: [],
      messageId: 'msg-002@test',
    });

    await emailService.enviarCodigoVerificacion('dest@test.com', 'Carlos', '888999');

    const callArgs = mockSendMail.mock.calls[0][0];
    expect(callArgs.html).toContain('888999');
    expect(callArgs.to).toBe('dest@test.com');
  });

  it('enviarCodigoVerificacion lanza error cuando accepted esta vacio', async () => {
    mockSendMail.mockResolvedValueOnce({
      accepted: [],
      rejected: ['dest@test.com'],
      messageId: 'msg-003@test',
    });

    await expect(
      emailService.enviarCodigoVerificacion('dest@test.com', 'Maria', '333444')
    ).rejects.toThrow(/SMTP no confirmo entrega/);
  });

  it('enviarCodigoVerificacion lanza error cuando rejected contiene destinatarios', async () => {
    mockSendMail.mockResolvedValueOnce({
      accepted: ['ok@test.com'],
      rejected: ['bad@test.com'],
      messageId: 'msg-004@test',
    });

    await expect(
      emailService.enviarCodigoVerificacion('bad@test.com', 'Pedro', '555666')
    ).rejects.toThrow(/SMTP no confirmo entrega/);
  });

  // enviarCodigoRecuperacion ────────────────────────────────────────────────

  it('enviarCodigoRecuperacion resuelve cuando sendMail acepta el destinatario', async () => {
    mockSendMail.mockResolvedValueOnce({
      accepted: ['recov@test.com'],
      rejected: [],
      messageId: 'msg-005@test',
    });

    await expect(
      emailService.enviarCodigoRecuperacion('recov@test.com', 'Laura', '777888')
    ).resolves.toBeUndefined();
  });

  it('enviarCodigoRecuperacion incluye el codigo OTP en el cuerpo del correo', async () => {
    mockSendMail.mockResolvedValueOnce({
      accepted: ['recov@test.com'],
      rejected: [],
      messageId: 'msg-006@test',
    });

    await emailService.enviarCodigoRecuperacion('recov@test.com', 'Laura', '424242');

    const callArgs = mockSendMail.mock.calls[0][0];
    expect(callArgs.html).toContain('424242');
  });

  it('enviarCodigoRecuperacion lanza error cuando accepted esta vacio', async () => {
    mockSendMail.mockResolvedValueOnce({
      accepted: [],
      rejected: ['recov@test.com'],
      messageId: 'msg-007@test',
    });

    await expect(
      emailService.enviarCodigoRecuperacion('recov@test.com', 'Luis', '999000')
    ).rejects.toThrow(/SMTP no confirmo entrega/);
  });
});
