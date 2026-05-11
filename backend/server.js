const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

const envPath = path.resolve(__dirname, '.env');
const envExamplePath = path.resolve(__dirname, '.env.example');
let envLoadedFrom = null;
const hasRuntimeMongoEnv = Boolean(process.env.MONGO_URI || process.env.MONGO_USER);

if (fs.existsSync(envPath)) {
  dotenv.config({ path: envPath });
  envLoadedFrom = '.env';
} else if (hasRuntimeMongoEnv) {
  envLoadedFrom = 'variables de entorno del contenedor';
} else if (fs.existsSync(envExamplePath)) {
  dotenv.config({ path: envExamplePath });
  envLoadedFrom = '.env.example';
  console.warn('[ENV] No se encontro backend/.env. Se cargo backend/.env.example como respaldo.');
} else {
  console.error('[ENV] No se encontro backend/.env ni backend/.env.example');
}

if (envLoadedFrom) {
  const envPrefix = envLoadedFrom.startsWith('.')
    ? `backend/${envLoadedFrom}`
    : envLoadedFrom;
  console.log(`[ENV] Variables cargadas desde ${envPrefix}`);
}

const missingEmailVars = ['EMAIL_USER', 'EMAIL_PASS'].filter((key) => !process.env[key]);
if (missingEmailVars.length > 0) {
  console.error(`[ENV] Faltan variables SMTP: ${missingEmailVars.join(', ')}`);
}

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const helmet = require('helmet');
const crypto = require('crypto');
const { OAuth2Client } = require('google-auth-library');
const {
  DEFAULT_MONGO_DB_NAME,
  DEFAULT_MONGO_HOST,
  buildMongoUri,
  getMongoConfigErrors,
} = require('./config/mongo');
const {
  enviarCodigoVerificacion,
  enviarCodigoRecuperacion,
  verificarServicioCorreo,
} = require('./services/emailService');

const DB_UNAVAILABLE_MESSAGE =
  'Base de datos no disponible. Verifica la IP permitida en MongoDB Atlas y la variable MONGO_URI.';
const MONGO_AUTH_ERROR_MESSAGE =
  'Error de autenticacion MongoDB: revisa usuario, contrasena, permisos del usuario en Atlas y que la URI pertenezca al cluster correcto.';
const MONGO_DNS_ERROR_MESSAGE = 'Host del cluster incorrecto o inaccesible.';
const MONGO_SRV_DNS_ERROR_MESSAGE =
  'La red local rechazo la resolucion SRV de MongoDB Atlas. Si usas mongodb+srv y ves querySrv/ECONNREFUSED, cambia temporalmente a una URI directa mongodb:// con los hosts del replica set.';
const MONGO_WHITELIST_ERROR_MESSAGE =
  'MongoDB Atlas rechazo la conexion. Revisa Network Access en MongoDB Atlas y agrega tu IP actual a la whitelist.';

let lastMongoConnectionMessage = DB_UNAVAILABLE_MESSAGE;

const getMongoConnectionMessage = (error) => {
  const rawMessage = String(error?.message || '');
  const message = rawMessage.toLowerCase();
  const code = String(error?.code || '').toUpperCase();

  if (message.includes('bad auth') || message.includes('authentication failed')) {
    return MONGO_AUTH_ERROR_MESSAGE;
  }

  if (
    (code === 'ECONNREFUSED' && message.includes('_mongodb._tcp')) ||
    message.includes('querysrv econnrefused') ||
    message.includes('query srv econnrefused')
  ) {
    return MONGO_SRV_DNS_ERROR_MESSAGE;
  }

  if (
    code === 'ENOTFOUND' ||
    message.includes('enotfound') ||
    message.includes('querysrv') ||
    message.includes('query srv') ||
    message.includes('getaddrinfo')
  ) {
    return MONGO_DNS_ERROR_MESSAGE;
  }

  if (
    message.includes('whitelist') ||
    message.includes('not whitelisted') ||
    message.includes('ip address') ||
    message.includes('network access')
  ) {
    return MONGO_WHITELIST_ERROR_MESSAGE;
  }

  return DB_UNAVAILABLE_MESSAGE;
};

const OTP_EXPIRACION_MINUTOS = parseInt(process.env.OTP_EXPIRACION_MINUTOS || '10');
const OTP_MAX_INTENTOS = parseInt(process.env.OTP_MAX_INTENTOS || '5');
const OTP_COOLDOWN_SEGUNDOS = parseInt(process.env.OTP_COOLDOWN_SEGUNDOS || '60');

// Genera un entero criptograficamente seguro en [min, max).
// Usa crypto.randomInt (Node >= 14.10) con fallback a crypto.randomBytes
// para compatibilidad con versiones anteriores de Node.
const secureRandomInt = (min, max) => {
  if (typeof crypto.randomInt === 'function') {
    return crypto.randomInt(min, max);
  }

  const range = max - min;
  const bytesNeeded = Math.ceil(Math.log2(range) / 8) + 1;
  const maxValid = Math.floor(256 ** bytesNeeded / range) * range;

  let value;
  do {
    value = parseInt(crypto.randomBytes(bytesNeeded).toString('hex'), 16);
  } while (value >= maxValid);

  return min + (value % range);
};

const app = express();

// BLINDAJE DE SEGURIDAD
app.use(helmet());

// Sanitización manual contra inyección MongoDB.
// express-mongo-sanitize puede fallar con Express moderno porque req.query puede ser read-only.
app.use((req, _res, next) => {
  const sanitize = (obj) => {
    if (obj && typeof obj === 'object') {
      for (const key of Object.keys(obj)) {
        if (key.startsWith('$') || key.includes('.')) {
          delete obj[key];
        } else {
          sanitize(obj[key]);
        }
      }
    }
  };

  sanitize(req.body);
  sanitize(req.params);
  next();
});

app.use(cors());
app.use(express.json());

app.get('/api/health/email', async (_req, res) => {
  const smtp = await verificarServicioCorreo();

  if (!smtp.ok) {
    return res.status(500).json({ ok: false, smtp });
  }

  return res.json({ ok: true, smtp });
});

/**
 * CONEXIÓN ÚNICA A MONGODB
 * Todo el backend usa esta conexión:
 * - usuarios
 * - verificacionotps
 * - conductores
 * - vehiculos
 * - soats
 * - rtms
 *
 * El backend prioriza MONGO_URI si existe.
 * Si no existe, compone la conexion con valores por defecto para este proyecto:
 * - MONGO_HOST=cluster0.45cqzzh.mongodb.net
 * - MONGO_DB_NAME=logistica_db
 * y toma las credenciales desde MONGO_USER / MONGO_PASSWORD.
 */
const MONGO_URI = buildMongoUri(process.env);
const mongoConfigErrors = getMongoConfigErrors(process.env);

const describeMongoTarget = (mongoUri = '') => {
  const value = String(mongoUri);
  const protocol = value.startsWith('mongodb+srv://') ? 'mongodb+srv' : 'mongodb';
  const withoutProtocol = value.replace(/^mongodb(\+srv)?:\/\//, '');
  const withoutCredentials = withoutProtocol.includes('@')
    ? withoutProtocol.slice(withoutProtocol.indexOf('@') + 1)
    : withoutProtocol;
  const [hostSegment = '', pathSegment = ''] = withoutCredentials.split('/');
  const dbName = (pathSegment.split('?')[0] || DEFAULT_MONGO_DB_NAME).trim();

  return {
    protocol,
    hosts: hostSegment,
    database: dbName || DEFAULT_MONGO_DB_NAME,
    source: hostSegment.includes('mongodb') && !hostSegment.startsWith('mongodb:')
      ? 'atlas'
      : 'local-compose',
  };
};

const mongoTarget = describeMongoTarget(MONGO_URI);

if (mongoConfigErrors.length > 0) {
  console.error(
    `[ENV] Configuracion Mongo incompleta. Usa MONGO_URI o configura MONGO_USER/MONGO_PASSWORD para ${DEFAULT_MONGO_HOST}/${DEFAULT_MONGO_DB_NAME}.`
  );
  process.exit(1);
}

mongoose.set('bufferCommands', false);

mongoose.connect(MONGO_URI, { serverSelectionTimeoutMS: 10000 })
  .then(() => {
    lastMongoConnectionMessage = null;
    console.log(`Conexion exitosa a MongoDB (${mongoTarget.source}) usando ${mongoTarget.database}`);
  })
  .catch((err) => {
    lastMongoConnectionMessage = getMongoConnectionMessage(err);
    console.error(lastMongoConnectionMessage);
  });

mongoose.connection.on('error', (err) => {
  lastMongoConnectionMessage = getMongoConnectionMessage(err);
  console.error(lastMongoConnectionMessage);
});

mongoose.connection.on('disconnected', () => {
  lastMongoConnectionMessage = lastMongoConnectionMessage || DB_UNAVAILABLE_MESSAGE;
});

const isDbConnected = () => mongoose.connection.readyState === 1;
const getDbUnavailableMessage = () => lastMongoConnectionMessage || DB_UNAVAILABLE_MESSAGE;

app.get('/api/health/db', (_req, res) => {
  if (isDbConnected()) {
    return res.json({
      ok: true,
      state: mongoose.connection.readyState,
      database: mongoose.connection.name || mongoTarget.database,
      target: mongoTarget,
    });
  }

  return res.status(503).json({
    ok: false,
    state: mongoose.connection.readyState,
    target: mongoTarget,
    message: getDbUnavailableMessage(),
  });
});

app.use('/api', (req, res, next) => {
  if (req.path === '/health/email' || req.path === '/health/db') {
    return next();
  }

  if (!isDbConnected()) {
    return res.status(503).json({
      message: getDbUnavailableMessage(),
      code: 'DB_UNAVAILABLE',
    });
  }

  return next();
});

// ─────────────────────────────────────────────────────────────────────────────
// MODELOS
// ─────────────────────────────────────────────────────────────────────────────

const ConductorSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  documento: { type: String, required: true },
  telefono: String,
  categoria: String,
  fechaVencimiento: { type: String, required: true },
  ownerEmail: { type: String, required: true },
});

const Conductor = mongoose.model('Conductor', ConductorSchema);

const VehiculoSchema = new mongoose.Schema({
  placa: { type: String, required: true },
  marca: String,
  modelo: String,
  anio: Number,
  tipo: String,
  conductorId: { type: String, default: null },
  ownerEmail: { type: String, required: true },
  ownerEmpresa: String,
});

const Vehiculo = mongoose.model('Vehiculo', VehiculoSchema);

const UsuarioSchema = new mongoose.Schema({
  nombre: { type: String, default: '' },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  empresa: String,
  telefono: String,
  googleId: { type: String, default: null },
  role: { type: String, default: 'admin' },
  isVerified: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

// Hook: encripta la contraseña antes de guardar.
UsuarioSchema.pre('save', async function () {
  if (!this.isModified('password')) return;

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Método: compara contraseña candidata con el hash.
UsuarioSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

const Usuario = mongoose.model('Usuario', UsuarioSchema);

const SoatSchema = new mongoose.Schema({
  vehiculoId: { type: String, required: true },
  placaVehiculo: String,
  numeroPoliza: { type: String, required: true },
  aseguradora: String,
  fechaExpedicion: String,
  fechaInicioVigencia: String,
  fechaFinVigencia: String,
  fechaInicio: String,
  fechaVencimiento: String,
  observaciones: String,
  ownerEmail: { type: String, required: true },
  ownerEmpresa: String,
  seedTag: String,
});

const Soat = mongoose.model('Soat', SoatSchema);

const RtmSchema = new mongoose.Schema({
  vehiculoId: { type: String, required: true },
  placaVehiculo: String,
  numeroCertificado: String,
  numeroRtm: String,
  cda: String,
  nitCda: String,
  fechaExpedicion: String,
  fechaInicio: String,
  fechaVencimiento: { type: String, required: true },
  resultado: String,
  observaciones: String,
  ownerEmail: { type: String, required: true },
  ownerEmpresa: String,
  seedTag: String,
});

const Rtm = mongoose.model('Rtm', RtmSchema);

const VerificacionOTPSchema = new mongoose.Schema({
  email: { type: String, required: true },
  codigoHash: { type: String, required: true },
  expiresAt: { type: Date, required: true },
  intentos: { type: Number, default: 0 },
  ultimoEnvio: { type: Date, default: Date.now },
  createdAt: { type: Date, default: Date.now },
});

VerificacionOTPSchema.index({ email: 1 });
VerificacionOTPSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const VerificacionOTP = mongoose.model('VerificacionOTP', VerificacionOTPSchema);

const PasswordResetOTPSchema = new mongoose.Schema({
  email: { type: String, required: true },
  codigoHash: { type: String, required: true },
  expiresAt: { type: Date, required: true },
  intentos: { type: Number, default: 0 },
  ultimoEnvio: { type: Date, default: Date.now },
  createdAt: { type: Date, default: Date.now },
});

PasswordResetOTPSchema.index({ email: 1 });
PasswordResetOTPSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const PasswordResetOTP = mongoose.model('PasswordResetOTP', PasswordResetOTPSchema);

// ─────────────────────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────────────────────

const normalizeText = (value) => String(value ?? '').trim();

const normalizeEmail = (value) => normalizeText(value).toLowerCase();

const GOOGLE_CLIENT_ID = normalizeText(process.env.GOOGLE_CLIENT_ID);
const googleClient = GOOGLE_CLIENT_ID ? new OAuth2Client(GOOGLE_CLIENT_ID) : null;

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const DUPLICATE_EMAIL_MESSAGE = 'Ya existe una cuenta con este correo electrónico.';

const normalizeNullableText = (value) => {
  const normalized = normalizeText(value);
  return normalized || null;
};

const hasOwn = (object, key) => Object.prototype.hasOwnProperty.call(object, key);

const PLATE_REGEX = /^[A-Z]{3}[0-9]{3}$/;
const CEDULA_REGEX = /^[0-9]{10}$/;
const COLOMBIAN_MOBILE_REGEX = /^3[0-9]{9}$/;
const DOCUMENT_CODE_REGEX = /^[A-Z0-9-]{6,30}$/;

const normalizePlate = (value) =>
  normalizeText(value).toUpperCase().replace(/[\s.-]+/g, '');

const normalizeDocumentCode = (value) => normalizeText(value).toUpperCase();

const isValidPlate = (value) => PLATE_REGEX.test(normalizePlate(value));

const isValidDateValue = (value) => {
  const dateText = normalizeText(value);
  const match = dateText.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!match) return false;

  const [, year, month, day] = match;
  const parsed = new Date(Number(year), Number(month) - 1, Number(day));

  return (
    !Number.isNaN(parsed.getTime()) &&
    parsed.getFullYear() === Number(year) &&
    parsed.getMonth() === Number(month) - 1 &&
    parsed.getDate() === Number(day)
  );
};

const isValidDateRange = (fechaInicio, fechaVencimiento) =>
  Boolean(
    isValidDateValue(fechaInicio) &&
    isValidDateValue(fechaVencimiento) &&
    new Date(fechaVencimiento).getTime() >= new Date(fechaInicio).getTime()
  );

const findOwnedVehicle = (vehiculoId, ownerEmail) => {
  if (!mongoose.Types.ObjectId.isValid(vehiculoId)) {
    return null;
  }

  return Vehiculo.findOne({ _id: vehiculoId, ownerEmail });
};

const buildSoatPayload = async (body, ownerEmailFallback = '') => {
  const vehiculoId = normalizeText(body.vehiculoId);
  const ownerEmail = normalizeEmail(ownerEmailFallback || body.ownerEmail);
  const numeroPoliza = normalizeDocumentCode(body.numeroPoliza);
  const aseguradora = normalizeText(body.aseguradora);
  const fechaExpedicion = normalizeText(body.fechaExpedicion);
  const fechaInicioVigencia = normalizeText(body.fechaInicioVigencia || body.fechaInicio);
  const fechaFinVigencia = normalizeText(body.fechaFinVigencia || body.fechaVencimiento);
  const placaRecibida = normalizePlate(body.placaVehiculo || body.placa);

  if (!vehiculoId || !numeroPoliza || !aseguradora || !fechaExpedicion || !fechaInicioVigencia || !fechaFinVigencia || !ownerEmail) {
    return { error: 'Todos los campos obligatorios del SOAT deben estar completos.' };
  }

  if (!DOCUMENT_CODE_REGEX.test(numeroPoliza)) {
    return { error: 'El numero de poliza debe ser alfanumerico y tener entre 6 y 30 caracteres.' };
  }

  if (!isValidDateValue(fechaExpedicion)) {
    return { error: 'La fecha de expedicion no es valida.' };
  }

  if (!isValidDateRange(fechaInicioVigencia, fechaFinVigencia)) {
    return { error: 'La fecha fin de vigencia no puede ser anterior a la fecha de inicio.' };
  }

  const vehiculo = await findOwnedVehicle(vehiculoId, ownerEmail);

  if (!vehiculo) {
    return { error: 'El vehiculo seleccionado no existe o no pertenece al usuario.' };
  }

  const placaVehiculo = placaRecibida || normalizePlate(vehiculo.placa);

  if (!isValidPlate(placaVehiculo)) {
    return { error: 'La placa asociada debe tener formato ABC123.' };
  }

  return {
    payload: {
      vehiculoId,
      placaVehiculo,
      numeroPoliza,
      aseguradora,
      fechaExpedicion,
      fechaInicioVigencia,
      fechaFinVigencia,
      fechaInicio: fechaInicioVigencia,
      fechaVencimiento: fechaFinVigencia,
      observaciones: normalizeText(body.observaciones),
      ownerEmail,
      ownerEmpresa: normalizeText(body.ownerEmpresa),
      seedTag: normalizeText(body.seedTag),
    },
  };
};

const buildRtmPayload = async (body, ownerEmailFallback = '') => {
  const vehiculoId = normalizeText(body.vehiculoId);
  const ownerEmail = normalizeEmail(ownerEmailFallback || body.ownerEmail);
  const numeroCertificado = normalizeDocumentCode(body.numeroCertificado || body.numeroRtm);
  const cda = normalizeText(body.cda);
  const fechaExpedicion = normalizeText(body.fechaExpedicion || body.fechaInicio);
  const fechaVencimiento = normalizeText(body.fechaVencimiento);
  const placaRecibida = normalizePlate(body.placaVehiculo || body.placa);
  const resultado = normalizeText(body.resultado || 'Aprobado');

  if (!vehiculoId || !numeroCertificado || !cda || !fechaExpedicion || !fechaVencimiento || !ownerEmail) {
    return { error: 'Todos los campos obligatorios de la RTM deben estar completos.' };
  }

  if (!DOCUMENT_CODE_REGEX.test(numeroCertificado)) {
    return { error: 'El numero de certificado debe ser alfanumerico y tener entre 6 y 30 caracteres.' };
  }

  if (!isValidDateRange(fechaExpedicion, fechaVencimiento)) {
    return { error: 'La fecha de vencimiento no puede ser anterior a la fecha de expedicion.' };
  }

  if (!['Aprobado', 'Rechazado', 'Pendiente'].includes(resultado)) {
    return { error: 'El resultado de la RTM no es valido.' };
  }

  const vehiculo = await findOwnedVehicle(vehiculoId, ownerEmail);

  if (!vehiculo) {
    return { error: 'El vehiculo seleccionado no existe o no pertenece al usuario.' };
  }

  const placaVehiculo = placaRecibida || normalizePlate(vehiculo.placa);

  if (!isValidPlate(placaVehiculo)) {
    return { error: 'La placa asociada debe tener formato ABC123.' };
  }

  return {
    payload: {
      vehiculoId,
      placaVehiculo,
      numeroCertificado,
      numeroRtm: numeroCertificado,
      cda,
      nitCda: normalizeText(body.nitCda),
      fechaExpedicion,
      fechaInicio: fechaExpedicion,
      fechaVencimiento,
      resultado,
      observaciones: normalizeText(body.observaciones),
      ownerEmail,
      ownerEmpresa: normalizeText(body.ownerEmpresa),
      seedTag: normalizeText(body.seedTag),
    },
  };
};

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'syntix_super_secret_key', {
    expiresIn: '30d',
  });
};

const generateRandomPassword = () => crypto.randomBytes(24).toString('hex');

const verifyGoogleIdentity = async (idToken) => {
  if (!GOOGLE_CLIENT_ID || !googleClient) {
    const error = new Error('Google Auth no esta configurado en el backend.');
    error.statusCode = 503;
    throw error;
  }

  const ticket = await googleClient.verifyIdToken({
    idToken,
    audience: GOOGLE_CLIENT_ID,
  });

  const payload = ticket.getPayload();

  if (!payload?.email || !payload?.email_verified) {
    const error = new Error('Google no devolvio un correo verificado para esta cuenta.');
    error.statusCode = 400;
    throw error;
  }

  return payload;
};

// ─────────────────────────────────────────────────────────────────────────────
// AUTH
// ─────────────────────────────────────────────────────────────────────────────

// Registro: crea usuario no verificado y dispara envío de OTP al correo.
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password, nombre, empresa, telefono } = req.body;

    const emailNormalizado = normalizeEmail(email);
    const nombreNormalizado = normalizeText(nombre);
    const empresaNormalizada = normalizeText(empresa);
    const telefonoNormalizado = normalizeText(telefono);

    if (!empresaNormalizada) {
      return res.status(400).json({ message: 'Ingresa el nombre de la empresa.' });
    }

    if (!telefonoNormalizado) {
      return res.status(400).json({ message: 'Ingresa el teléfono.' });
    }

    if (!COLOMBIAN_MOBILE_REGEX.test(telefonoNormalizado)) {
      return res.status(400).json({ message: 'El celular debe tener 10 digitos e iniciar por 3.' });
    }

    if (!EMAIL_REGEX.test(emailNormalizado)) {
      return res.status(400).json({ message: 'Ingresa un correo electrónico válido.' });
    }

    if (!password) {
      return res.status(400).json({ message: 'Ingresa una contraseña.' });
    }

    if (String(password).length < 6) {
      return res.status(400).json({ message: 'La contraseña debe tener al menos 6 caracteres' });
    }

    const existe = await Usuario.findOne({ email: emailNormalizado });

    if (existe) {
      return res.status(400).json({ message: DUPLICATE_EMAIL_MESSAGE });
    }

    const nuevoUsuario = new Usuario({
      nombre: nombreNormalizado,
      email: emailNormalizado,
      password,
      empresa: empresaNormalizada,
      telefono: telefonoNormalizado,
      isVerified: false,
    });

    await nuevoUsuario.save();

    const codigo = String(secureRandomInt(100000, 999999));
    const codigoHash = await bcrypt.hash(codigo, 10);
    const expiresAt = new Date(Date.now() + OTP_EXPIRACION_MINUTOS * 60 * 1000);

    await VerificacionOTP.findOneAndDelete({ email: emailNormalizado });

    await new VerificacionOTP({
      email: emailNormalizado,
      codigoHash,
      expiresAt,
    }).save();

    try {
      await enviarCodigoVerificacion(emailNormalizado, nombreNormalizado || empresaNormalizada, codigo);
    } catch (emailErr) {
      console.error('Error al enviar correo:', emailErr.message);

      return res.status(500).json({
        message: `No se pudo enviar el correo de verificacion: ${emailErr.message}`,
      });
    }

    return res.status(201).json({
      success: true,
      message: 'Registro exitoso. Revisa tu correo para verificar tu cuenta.',
      data: {
        email: emailNormalizado,
        needsVerification: true,
      },
    });
  } catch (err) {
    if (err?.name === 'MongooseServerSelectionError' || err?.name === 'MongoServerSelectionError') {
      return res.status(503).json({
        message: getDbUnavailableMessage(),
        code: 'DB_UNAVAILABLE',
      });
    }

    return res.status(500).json({ message: err.message });
  }
});

app.post('/api/auth/verificar-codigo', async (req, res) => {
  try {
    const { email, codigo } = req.body;
    const emailNormalizado = normalizeEmail(email);

    if (!emailNormalizado || !codigo) {
      return res.status(400).json({ message: 'Email y codigo son requeridos' });
    }

    const verificacion = await VerificacionOTP.findOne({ email: emailNormalizado });

    if (!verificacion) {
      return res.status(400).json({
        message: 'No hay un codigo pendiente para este correo. Vuelve a registrarte.',
      });
    }

    if (new Date() > verificacion.expiresAt) {
      await VerificacionOTP.findOneAndDelete({ email: emailNormalizado });

      return res.status(400).json({
        message: 'El codigo ha expirado. Solicita uno nuevo.',
      });
    }

    if (verificacion.intentos >= OTP_MAX_INTENTOS) {
      await VerificacionOTP.findOneAndDelete({ email: emailNormalizado });

      return res.status(400).json({
        message: 'Demasiados intentos fallidos. Solicita un nuevo codigo.',
      });
    }

    const codigoCorrecto = await bcrypt.compare(String(codigo), verificacion.codigoHash);

    if (!codigoCorrecto) {
      verificacion.intentos += 1;
      await verificacion.save();

      const restantes = OTP_MAX_INTENTOS - verificacion.intentos;

      return res.status(400).json({
        message: `Codigo incorrecto. Intentos restantes: ${restantes}`,
      });
    }

    await Usuario.findOneAndUpdate(
      { email: emailNormalizado },
      { isVerified: true },
      { new: true }
    );

    await VerificacionOTP.findOneAndDelete({ email: emailNormalizado });

    const usuario = await Usuario.findOne({ email: emailNormalizado });

    return res.json({
      success: true,
      message: 'Cuenta verificada exitosamente.',
      data: {
        user: {
          _id: usuario._id,
          email: usuario.email,
          empresa: usuario.empresa,
          telefono: usuario.telefono,
          role: usuario.role,
        },
        token: generateToken(usuario._id),
      },
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

app.post('/api/auth/reenviar-codigo', async (req, res) => {
  try {
    const { email } = req.body;
    const emailNormalizado = normalizeEmail(email);

    if (!emailNormalizado) {
      return res.status(400).json({ message: 'Email es requerido' });
    }

    const usuario = await Usuario.findOne({ email: emailNormalizado });

    if (!usuario) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    if (usuario.isVerified) {
      return res.status(400).json({ message: 'Esta cuenta ya esta verificada' });
    }

    const verificacionExistente = await VerificacionOTP.findOne({ email: emailNormalizado });

    if (verificacionExistente) {
      const segundosDesdeUltimoEnvio =
        (Date.now() - new Date(verificacionExistente.ultimoEnvio).getTime()) / 1000;

      if (segundosDesdeUltimoEnvio < OTP_COOLDOWN_SEGUNDOS) {
        const espera = Math.ceil(OTP_COOLDOWN_SEGUNDOS - segundosDesdeUltimoEnvio);

        return res.status(429).json({
          message: `Espera ${espera} segundos antes de solicitar otro codigo.`,
        });
      }
    }

    const codigo = String(secureRandomInt(100000, 999999));
    const codigoHash = await bcrypt.hash(codigo, 10);
    const expiresAt = new Date(Date.now() + OTP_EXPIRACION_MINUTOS * 60 * 1000);

    await VerificacionOTP.findOneAndDelete({ email: emailNormalizado });

    await new VerificacionOTP({
      email: emailNormalizado,
      codigoHash,
      expiresAt,
      ultimoEnvio: new Date(),
    }).save();

    try {
      await enviarCodigoVerificacion(emailNormalizado, usuario.nombre || usuario.empresa, codigo);
    } catch (emailErr) {
      console.error('Error al enviar correo:', emailErr.message);

      return res.status(500).json({
        message: `Error al enviar el correo: ${emailErr.message}`,
      });
    }

    return res.json({
      message: 'Codigo reenviado exitosamente. Revisa tu correo.',
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const emailNormalizado = normalizeEmail(email);

    if (!emailNormalizado || !password) {
      return res.status(400).json({ message: 'Email y contrasena son requeridos' });
    }

    const usuario = await Usuario.findOne({ email: emailNormalizado });

    if (usuario && (await usuario.comparePassword(password))) {
      return res.json({
        success: true,
        data: {
          user: {
            _id: usuario._id,
            email: usuario.email,
            empresa: usuario.empresa,
            telefono: usuario.telefono,
            role: usuario.role,
          },
          token: generateToken(usuario._id),
        },
      });
    }

    return res.status(401).json({
      success: false,
      message: 'Credenciales invalidas',
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

app.post('/api/auth/google', async (req, res) => {
  try {
    const { idToken, empresa, telefono } = req.body;

    if (!idToken) {
      return res.status(400).json({ message: 'El token de Google es requerido.' });
    }

    const googleProfile = await verifyGoogleIdentity(idToken);
    const emailNormalizado = normalizeEmail(googleProfile.email);
    const empresaNormalizada = normalizeText(empresa);
    const telefonoNormalizado = normalizeText(telefono);
    const nombreNormalizado = normalizeText(googleProfile.name);

    if (telefonoNormalizado && !COLOMBIAN_MOBILE_REGEX.test(telefonoNormalizado)) {
      return res.status(400).json({
        message: 'El celular debe tener 10 digitos e iniciar por 3.',
      });
    }

    let usuario = await Usuario.findOne({ email: emailNormalizado });
    let created = false;

    if (!usuario) {
      if (!empresaNormalizada) {
        return res.status(400).json({
          message: 'Ingresa el nombre de la empresa para completar el registro con Google.',
        });
      }

      if (!telefonoNormalizado) {
        return res.status(400).json({
          message: 'Ingresa el teléfono para completar el registro con Google.',
        });
      }

      usuario = new Usuario({
        nombre: nombreNormalizado,
        email: emailNormalizado,
        password: generateRandomPassword(),
        empresa: empresaNormalizada,
        telefono: telefonoNormalizado,
        isVerified: true,
        googleId: String(googleProfile.sub || ''),
      });

      await usuario.save();
      created = true;
    } else {
      let shouldSave = false;

      if (!usuario.googleId && googleProfile.sub) {
        usuario.googleId = String(googleProfile.sub);
        shouldSave = true;
      }

      if (!usuario.nombre && nombreNormalizado) {
        usuario.nombre = nombreNormalizado;
        shouldSave = true;
      }

      if (!usuario.empresa && empresaNormalizada) {
        usuario.empresa = empresaNormalizada;
        shouldSave = true;
      }

      if (!usuario.telefono && telefonoNormalizado) {
        usuario.telefono = telefonoNormalizado;
        shouldSave = true;
      }

      if (!usuario.isVerified) {
        usuario.isVerified = true;
        shouldSave = true;
      }

      if (shouldSave) {
        await usuario.save();
      }
    }

    return res.json({
      success: true,
      message: created
        ? 'Cuenta creada con Google correctamente.'
        : 'Sesion iniciada con Google correctamente.',
      data: {
        user: {
          _id: usuario._id,
          email: usuario.email,
          empresa: usuario.empresa,
          telefono: usuario.telefono,
          role: usuario.role,
        },
        token: generateToken(usuario._id),
        created,
      },
    });
  } catch (err) {
    if (err?.name === 'MongooseServerSelectionError' || err?.name === 'MongoServerSelectionError') {
      return res.status(503).json({
        message: getDbUnavailableMessage(),
        code: 'DB_UNAVAILABLE',
      });
    }

    const googleErrorMessage = String(err?.message || '').toLowerCase();
    if (
      googleErrorMessage.includes('token used too late') ||
      googleErrorMessage.includes('jwt') ||
      googleErrorMessage.includes('wrong recipient') ||
      googleErrorMessage.includes('invalid token') ||
      googleErrorMessage.includes('wrong number of segments')
    ) {
      return res.status(401).json({ message: 'El token de Google no es valido o ya expiro.' });
    }

    return res.status(err.statusCode || 500).json({ message: err.message });
  }
});

app.post('/api/auth/recuperar-cuenta', async (req, res) => {
  try {
    const { email } = req.body;
    const emailNormalizado = normalizeEmail(email);

    if (!EMAIL_REGEX.test(emailNormalizado)) {
      return res.status(400).json({ message: 'Ingresa un correo electronico valido.' });
    }

    const usuario = await Usuario.findOne({ email: emailNormalizado });

    if (!usuario) {
      return res.status(404).json({ message: 'No existe una cuenta con este correo.' });
    }

    const recuperacionExistente = await PasswordResetOTP.findOne({ email: emailNormalizado });

    if (recuperacionExistente) {
      const segundosDesdeUltimoEnvio =
        (Date.now() - new Date(recuperacionExistente.ultimoEnvio).getTime()) / 1000;

      if (segundosDesdeUltimoEnvio < OTP_COOLDOWN_SEGUNDOS) {
        const espera = Math.ceil(OTP_COOLDOWN_SEGUNDOS - segundosDesdeUltimoEnvio);

        return res.status(429).json({
          message: `Espera ${espera} segundos antes de solicitar otro codigo.`,
        });
      }
    }

    const codigo = String(secureRandomInt(100000, 999999));
    const codigoHash = await bcrypt.hash(codigo, 10);
    const expiresAt = new Date(Date.now() + OTP_EXPIRACION_MINUTOS * 60 * 1000);

    await PasswordResetOTP.findOneAndDelete({ email: emailNormalizado });

    await new PasswordResetOTP({
      email: emailNormalizado,
      codigoHash,
      expiresAt,
      ultimoEnvio: new Date(),
    }).save();

    try {
      await enviarCodigoRecuperacion(emailNormalizado, usuario.nombre || usuario.empresa, codigo);
    } catch (emailErr) {
      console.error('Error al enviar correo de recuperacion:', emailErr.message);

      return res.status(500).json({
        message: `Error al enviar el correo de recuperacion: ${emailErr.message}`,
      });
    }

    return res.json({
      success: true,
      message: 'Codigo de recuperacion enviado. Revisa tu correo.',
      data: { email: emailNormalizado },
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

app.post('/api/auth/restablecer-password', async (req, res) => {
  try {
    const { email, codigo, password, nuevaPassword } = req.body;
    const emailNormalizado = normalizeEmail(email);
    const passwordNueva = String(nuevaPassword || password || '');

    if (!emailNormalizado || !codigo || !passwordNueva) {
      return res.status(400).json({ message: 'Email, codigo y nueva contrasena son requeridos.' });
    }

    if (passwordNueva.length < 6) {
      return res.status(400).json({ message: 'La contrasena debe tener al menos 6 caracteres.' });
    }

    const recuperacion = await PasswordResetOTP.findOne({ email: emailNormalizado });

    if (!recuperacion) {
      return res.status(400).json({ message: 'No hay un codigo de recuperacion pendiente para este correo.' });
    }

    if (new Date() > recuperacion.expiresAt) {
      await PasswordResetOTP.findOneAndDelete({ email: emailNormalizado });

      return res.status(400).json({ message: 'El codigo ha expirado. Solicita uno nuevo.' });
    }

    if (recuperacion.intentos >= OTP_MAX_INTENTOS) {
      await PasswordResetOTP.findOneAndDelete({ email: emailNormalizado });

      return res.status(400).json({ message: 'Demasiados intentos fallidos. Solicita un nuevo codigo.' });
    }

    const codigoCorrecto = await bcrypt.compare(String(codigo), recuperacion.codigoHash);

    if (!codigoCorrecto) {
      recuperacion.intentos += 1;
      await recuperacion.save();

      const restantes = OTP_MAX_INTENTOS - recuperacion.intentos;

      return res.status(400).json({
        message: `Codigo incorrecto. Intentos restantes: ${restantes}`,
      });
    }

    const usuario = await Usuario.findOne({ email: emailNormalizado });

    if (!usuario) {
      await PasswordResetOTP.findOneAndDelete({ email: emailNormalizado });
      return res.status(404).json({ message: 'Usuario no encontrado.' });
    }

    usuario.password = passwordNueva;
    usuario.isVerified = true;
    await usuario.save();

    await PasswordResetOTP.findOneAndDelete({ email: emailNormalizado });

    return res.json({
      success: true,
      message: 'Contrasena actualizada. Ya puedes iniciar sesion.',
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// CONDUCTORES
// ─────────────────────────────────────────────────────────────────────────────

app.get('/api/conductores', async (req, res) => {
  try {
    const email = normalizeEmail(req.query.email);

    if (!email) {
      return res.status(400).json({ error: 'El email es obligatorio.' });
    }

    const data = await Conductor.find({ ownerEmail: email });

    return res.json(data);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

app.post('/api/conductores', async (req, res) => {
  try {
    const { nombre, documento, telefono, categoria, fechaVencimiento, ownerEmail } = req.body;

    const nombreNormalizado = normalizeText(nombre);
    const documentoNormalizado = normalizeText(documento);
    const telefonoNormalizado = normalizeText(telefono);
    const categoriaNormalizada = normalizeText(categoria);
    const fechaVencimientoNormalizada = normalizeText(fechaVencimiento);
    const ownerEmailNormalizado = normalizeEmail(ownerEmail);

    if (
      !nombreNormalizado ||
      !documentoNormalizado ||
      !telefonoNormalizado ||
      !fechaVencimientoNormalizada ||
      !ownerEmailNormalizado
    ) {
      return res.status(400).json({
        error: 'Todos los campos obligatorios deben estar completos.',
      });
    }

    if (!CEDULA_REGEX.test(documentoNormalizado)) {
      return res.status(400).json({
        error: 'La cedula debe tener exactamente 10 digitos numericos.',
      });
    }

    if (!COLOMBIAN_MOBILE_REGEX.test(telefonoNormalizado)) {
      return res.status(400).json({
        error: 'El celular debe tener 10 digitos e iniciar por 3.',
      });
    }

    const existente = await Conductor.findOne({
      documento: documentoNormalizado,
      ownerEmail: ownerEmailNormalizado,
    });

    if (existente) {
      return res.status(400).json({
        error: 'Ya existe un conductor con este documento.',
      });
    }

    const nuevo = new Conductor({
      nombre: nombreNormalizado,
      documento: documentoNormalizado,
      telefono: telefonoNormalizado,
      categoria: categoriaNormalizada,
      fechaVencimiento: fechaVencimientoNormalizada,
      ownerEmail: ownerEmailNormalizado,
    });

    await nuevo.save();

    return res.status(201).json(nuevo);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
});

app.put('/api/conductores/:id', async (req, res) => {
  try {
    const conductorExistente = await Conductor.findById(req.params.id);

    if (!conductorExistente) {
      return res.status(404).json({ error: 'Conductor no encontrado' });
    }

    const nombreNormalizado = normalizeText(req.body.nombre);
    const documentoNormalizado = normalizeText(req.body.documento);
    const telefonoNormalizado = normalizeText(req.body.telefono);
    const categoriaNormalizada = normalizeText(req.body.categoria);
    const fechaVencimientoNormalizada = normalizeText(req.body.fechaVencimiento);

    if (
      !nombreNormalizado ||
      !documentoNormalizado ||
      !telefonoNormalizado ||
      !fechaVencimientoNormalizada
    ) {
      return res.status(400).json({
        error: 'Todos los campos obligatorios deben estar completos.',
      });
    }

    if (!CEDULA_REGEX.test(documentoNormalizado)) {
      return res.status(400).json({
        error: 'La cedula debe tener exactamente 10 digitos numericos.',
      });
    }

    if (!COLOMBIAN_MOBILE_REGEX.test(telefonoNormalizado)) {
      return res.status(400).json({
        error: 'El celular debe tener 10 digitos e iniciar por 3.',
      });
    }

    const duplicado = await Conductor.findOne({
      documento: documentoNormalizado,
      ownerEmail: conductorExistente.ownerEmail,
      _id: { $ne: conductorExistente._id },
    });

    if (duplicado) {
      return res.status(400).json({
        error: 'Ya existe un conductor con este documento.',
      });
    }

    conductorExistente.nombre = nombreNormalizado;
    conductorExistente.documento = documentoNormalizado;
    conductorExistente.telefono = telefonoNormalizado;
    conductorExistente.categoria = categoriaNormalizada;
    conductorExistente.fechaVencimiento = fechaVencimientoNormalizada;

    await conductorExistente.save();

    return res.json(conductorExistente);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
});

app.delete('/api/conductores/:id', async (req, res) => {
  try {
    const conductorEliminado = await Conductor.findByIdAndDelete(req.params.id);

    if (!conductorEliminado) {
      return res.status(404).json({ error: 'Conductor no encontrado' });
    }

    await Vehiculo.updateMany({ conductorId: req.params.id }, { conductorId: null });

    return res.json({ ok: true });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// VEHÍCULOS
// ─────────────────────────────────────────────────────────────────────────────

app.get('/api/vehiculos', async (req, res) => {
  try {
    const email = normalizeEmail(req.query.email);

    if (!email) {
      return res.status(400).json({ error: 'El email es obligatorio.' });
    }

    const data = await Vehiculo.find({ ownerEmail: email });

    return res.json(data);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

app.post('/api/vehiculos', async (req, res) => {
  try {
    const { placa, marca, modelo, anio, tipo, conductorId, ownerEmail, ownerEmpresa } = req.body;

    const placaNormalizada = normalizePlate(placa);
    const marcaNormalizada = normalizeText(marca);
    const modeloNormalizado = normalizeText(modelo);
    const anioNormalizado = normalizeText(anio);
    const tipoNormalizado = normalizeText(tipo);
    const ownerEmailNormalizado = normalizeEmail(ownerEmail);
    const ownerEmpresaNormalizada = normalizeText(ownerEmpresa);
    const anioNumero = Number(anio);

    if (
      !placaNormalizada ||
      !marcaNormalizada ||
      !modeloNormalizado ||
      !anioNormalizado ||
      !tipoNormalizado ||
      !ownerEmailNormalizado
    ) {
      return res.status(400).json({
        error: 'Todos los campos obligatorios deben estar completos.',
      });
    }

    if (!Number.isInteger(anioNumero) || anioNumero < 1990 || anioNumero > new Date().getFullYear() + 1) {
      return res.status(400).json({
        error: 'El anio del vehiculo no es valido.',
      });
    }

    if (!isValidPlate(placaNormalizada)) {
      return res.status(400).json({
        error: 'La placa debe tener formato ABC123: tres letras y tres numeros, sin guiones ni espacios.',
      });
    }

    const conductorIdNormalizado = normalizeNullableText(conductorId);

    if (conductorIdNormalizado) {
      if (!mongoose.Types.ObjectId.isValid(conductorIdNormalizado)) {
        return res.status(400).json({
          error: 'El conductor seleccionado no es valido.',
        });
      }

      const conductor = await Conductor.findById(conductorIdNormalizado);

      if (!conductor || conductor.ownerEmail !== ownerEmailNormalizado) {
        return res.status(400).json({
          error: 'El conductor no pertenece al usuario autenticado.',
        });
      }
    }

    const existente = await Vehiculo.findOne({
      placa: placaNormalizada,
      ownerEmail: ownerEmailNormalizado,
    });

    if (existente) {
      return res.status(400).json({
        error: 'Ya existe un vehiculo con esta placa.',
      });
    }

    const nuevo = new Vehiculo({
      placa: placaNormalizada,
      marca: marcaNormalizada,
      modelo: modeloNormalizado,
      anio: anioNumero,
      tipo: tipoNormalizado,
      conductorId: conductorIdNormalizado,
      ownerEmail: ownerEmailNormalizado,
      ownerEmpresa: ownerEmpresaNormalizada,
    });

    await nuevo.save();

    return res.status(201).json(nuevo);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
});

app.put('/api/vehiculos/:id', async (req, res) => {
  try {
    const vehiculoExistente = await Vehiculo.findById(req.params.id);

    if (!vehiculoExistente) {
      return res.status(404).json({ error: 'Vehiculo no encontrado' });
    }

    const placaNormalizada = normalizePlate(req.body.placa);
    const marcaNormalizada = normalizeText(req.body.marca);
    const modeloNormalizado = normalizeText(req.body.modelo);
    const anioNormalizado = normalizeText(req.body.anio);
    const tipoNormalizado = normalizeText(req.body.tipo);
    const anioNumero = Number(req.body.anio);

    if (
      !placaNormalizada ||
      !marcaNormalizada ||
      !modeloNormalizado ||
      !anioNormalizado ||
      !tipoNormalizado
    ) {
      return res.status(400).json({
        error: 'Todos los campos obligatorios deben estar completos.',
      });
    }

    if (!Number.isInteger(anioNumero) || anioNumero < 1990 || anioNumero > new Date().getFullYear() + 1) {
      return res.status(400).json({
        error: 'El anio del vehiculo no es valido.',
      });
    }

    if (!isValidPlate(placaNormalizada)) {
      return res.status(400).json({
        error: 'La placa debe tener formato ABC123: tres letras y tres numeros, sin guiones ni espacios.',
      });
    }

    const duplicado = await Vehiculo.findOne({
      placa: placaNormalizada,
      ownerEmail: vehiculoExistente.ownerEmail,
      _id: { $ne: vehiculoExistente._id },
    });

    if (duplicado) {
      return res.status(400).json({
        error: 'Ya existe un vehiculo con esta placa.',
      });
    }

    vehiculoExistente.placa = placaNormalizada;
    vehiculoExistente.marca = marcaNormalizada;
    vehiculoExistente.modelo = modeloNormalizado;
    vehiculoExistente.anio = anioNumero;
    vehiculoExistente.tipo = tipoNormalizado;

    await vehiculoExistente.save();

    return res.json(vehiculoExistente);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
});

app.delete('/api/vehiculos/:id', async (req, res) => {
  try {
    const vehiculoEliminado = await Vehiculo.findByIdAndDelete(req.params.id);

    if (!vehiculoEliminado) {
      return res.status(404).json({ error: 'Vehiculo no encontrado' });
    }

    await Soat.deleteMany({
      vehiculoId: String(vehiculoEliminado._id),
      ownerEmail: vehiculoEliminado.ownerEmail,
    });

    await Rtm.deleteMany({
      vehiculoId: String(vehiculoEliminado._id),
      ownerEmail: vehiculoEliminado.ownerEmail,
    });

    return res.json({ ok: true });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
});

app.put('/api/vehiculos/:id/conductor', async (req, res) => {
  try {
    if (!hasOwn(req.body, 'conductorId')) {
      return res.status(400).json({ error: 'El conductorId es obligatorio.' });
    }

    const conductorId = normalizeNullableText(req.body.conductorId);
    const vehiculo = await Vehiculo.findById(req.params.id);

    if (!vehiculo) {
      return res.status(404).json({ error: 'Vehiculo no encontrado' });
    }

    if (conductorId) {
      if (!mongoose.Types.ObjectId.isValid(conductorId)) {
        return res.status(400).json({
          error: 'El conductor seleccionado no es valido.',
        });
      }

      const conductor = await Conductor.findById(conductorId);

      if (!conductor) {
        return res.status(404).json({ error: 'Conductor no encontrado' });
      }

      if (conductor.ownerEmail !== vehiculo.ownerEmail) {
        return res.status(400).json({
          error: 'El conductor no pertenece al mismo usuario del vehiculo.',
        });
      }

      await Vehiculo.updateMany(
        {
          ownerEmail: vehiculo.ownerEmail,
          conductorId,
          _id: { $ne: vehiculo._id },
        },
        {
          $set: { conductorId: null },
        }
      );
    }

    vehiculo.conductorId = conductorId;
    await vehiculo.save();

    return res.json(vehiculo);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// SOAT
// ─────────────────────────────────────────────────────────────────────────────

app.get('/api/soats', async (req, res) => {
  try {
    const email = normalizeEmail(req.query.email);

    if (!email) {
      return res.status(400).json({ error: 'El email es obligatorio.' });
    }

    const data = await Soat.find({ ownerEmail: email });

    return res.json(data);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

app.post('/api/soats', async (req, res) => {
  try {
    const { error, payload } = await buildSoatPayload(req.body);

    if (error) {
      return res.status(400).json({ error });
    }

    await Soat.deleteMany({
      vehiculoId: payload.vehiculoId,
      ownerEmail: payload.ownerEmail,
    });

    const nuevo = new Soat(payload);
    await nuevo.save();

    return res.status(201).json(nuevo);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
});

app.put('/api/soats/:id', async (req, res) => {
  try {
    const soatExistente = await Soat.findById(req.params.id);

    if (!soatExistente) {
      return res.status(404).json({ error: 'SOAT no encontrado.' });
    }

    const { error, payload } = await buildSoatPayload(
      {
        ...req.body,
        vehiculoId: req.body.vehiculoId || soatExistente.vehiculoId,
      },
      soatExistente.ownerEmail
    );

    if (error) {
      return res.status(400).json({ error });
    }

    Object.assign(soatExistente, payload);
    await soatExistente.save();

    return res.json(soatExistente);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
});

app.delete('/api/soats/:id', async (req, res) => {
  try {
    const eliminado = await Soat.findByIdAndDelete(req.params.id);

    if (!eliminado) {
      return res.status(404).json({ error: 'SOAT no encontrado.' });
    }

    return res.json({ ok: true });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// RTM
// ─────────────────────────────────────────────────────────────────────────────

app.get('/api/rtms', async (req, res) => {
  try {
    const email = normalizeEmail(req.query.email);

    if (!email) {
      return res.status(400).json({ error: 'El email es obligatorio.' });
    }

    const data = await Rtm.find({ ownerEmail: email });

    return res.json(data);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

app.post('/api/rtms', async (req, res) => {
  try {
    const { error, payload } = await buildRtmPayload(req.body);

    if (error) {
      return res.status(400).json({ error });
    }

    await Rtm.deleteMany({
      vehiculoId: payload.vehiculoId,
      ownerEmail: payload.ownerEmail,
    });

    const nuevo = new Rtm(payload);
    await nuevo.save();

    return res.status(201).json(nuevo);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
});

app.put('/api/rtms/:id', async (req, res) => {
  try {
    const rtmExistente = await Rtm.findById(req.params.id);

    if (!rtmExistente) {
      return res.status(404).json({ error: 'RTM no encontrada.' });
    }

    const { error, payload } = await buildRtmPayload(
      {
        ...req.body,
        vehiculoId: req.body.vehiculoId || rtmExistente.vehiculoId,
      },
      rtmExistente.ownerEmail
    );

    if (error) {
      return res.status(400).json({ error });
    }

    Object.assign(rtmExistente, payload);
    await rtmExistente.save();

    return res.json(rtmExistente);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
});

app.delete('/api/rtms/:id', async (req, res) => {
  try {
    const eliminado = await Rtm.findByIdAndDelete(req.params.id);

    if (!eliminado) {
      return res.status(404).json({ error: 'RTM no encontrada.' });
    }

    return res.json({ ok: true });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// SERVER
// ─────────────────────────────────────────────────────────────────────────────

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Servidor backend listo en http://localhost:${PORT}`);
});
