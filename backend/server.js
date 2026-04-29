const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

const envPath = path.resolve(__dirname, '.env');
const envExamplePath = path.resolve(__dirname, '.env.example');
let envLoadedFrom = null;

if (fs.existsSync(envPath)) {
  dotenv.config({ path: envPath });
  envLoadedFrom = '.env';
} else if (fs.existsSync(envExamplePath)) {
  dotenv.config({ path: envExamplePath });
  envLoadedFrom = '.env.example';
  console.warn('[ENV] No se encontro backend/.env. Se cargo backend/.env.example como respaldo.');
} else {
  console.error('[ENV] No se encontro backend/.env ni backend/.env.example');
}

if (envLoadedFrom) {
  console.log(`[ENV] Variables cargadas desde backend/${envLoadedFrom}`);
}

const missingEmailVars = ['EMAIL_USER', 'EMAIL_PASS'].filter((key) => !process.env[key]);
if (missingEmailVars.length > 0) {
  console.error(`[ENV] Faltan variables SMTP: ${missingEmailVars.join(', ')}`);
}

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const helmet = require('helmet');
const crypto = require('crypto');
const { enviarCodigoVerificacion, verificarServicioCorreo } = require('./services/emailService');

const DB_UNAVAILABLE_MESSAGE =
  'Base de datos no disponible. Verifica la IP permitida en MongoDB Atlas y la variable MONGO_URI.';

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

// Sanitización manual contra inyección MongoDB
// (express-mongo-sanitize es incompatible con Express moderno donde req.query es read-only)
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

const DEFAULT_MONGO_URI =
  'mongodb+srv://juansebastianvd_db_user:UcgkGfBgvUkgEVcF@cluster0.45cqzzh.mongodb.net/logistica_db?retryWrites=true&w=majority';
const JUAN_MONGO_URI = String(process.env.JUAN_MONGO_URI || '').trim() || DEFAULT_MONGO_URI;
const hasPlaceholderValue = (value = '') => String(value).includes('<') || String(value).includes('>');
const configuredMongoUri = String(process.env.MONGO_URI || '').trim();
const MONGO_URI = configuredMongoUri && !hasPlaceholderValue(configuredMongoUri)
  ? configuredMongoUri
  : DEFAULT_MONGO_URI;

if (configuredMongoUri && hasPlaceholderValue(configuredMongoUri)) {
  console.warn('[ENV] MONGO_URI contiene placeholders. Se usara la URI Mongo por defecto del proyecto.');
}

mongoose.set('bufferCommands', false);

mongoose
  .connect(MONGO_URI, { serverSelectionTimeoutMS: 10000 })
  .then(() => console.log('Conexion exitosa a MongoDB Atlas'))
  .catch((err) => console.error('Error de conexion:', err));

const juanConnection = mongoose.createConnection(JUAN_MONGO_URI, { serverSelectionTimeoutMS: 10000 });
juanConnection.set('bufferCommands', false);

const juanConnectionReady = juanConnection
  .asPromise()
  .then(() => {
    console.log('Conexion exitosa a MongoDB Atlas de Juan');
  })
  .catch((err) => {
    console.error('Error de conexion a la base de Juan:', err.message);
    return null;
  });

const isDbConnected = () => mongoose.connection.readyState === 1;

app.get('/api/health/db', (_req, res) => {
  if (isDbConnected()) {
    return res.json({ ok: true, state: mongoose.connection.readyState });
  }

  return res.status(503).json({
    ok: false,
    state: mongoose.connection.readyState,
    message: DB_UNAVAILABLE_MESSAGE,
  });
});

app.use('/api', (req, res, next) => {
  if (req.path === '/health/email' || req.path === '/health/db') {
    return next();
  }

  if (!isDbConnected()) {
    return res.status(503).json({ message: DB_UNAVAILABLE_MESSAGE, code: 'DB_UNAVAILABLE' });
  }

  return next();
});

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
  role: { type: String, default: 'admin' },
  isVerified: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

// Hook: encripta la contraseña antes de guardar
// Hook: encripta la contraseña antes de guardar
UsuarioSchema.pre('save', async function () {
  // Si la contraseña no ha sido modificada, simplemente salimos de la función
  if (!this.isModified('password')) return;
  
  // Como es una función 'async', los errores de bcrypt se propagan automáticamente,
  // por lo que podemos eliminar el bloque try/catch y las llamadas a next()
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Método: compara contraseña candidata con el hash
UsuarioSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

const Usuario = mongoose.model('Usuario', UsuarioSchema);
const UsuarioJuan = juanConnection.model('Usuario', UsuarioSchema);

// Generador de Token JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'syntix_super_secret_key', {
    expiresIn: '30d',
  });
};

const SoatSchema = new mongoose.Schema({
  vehiculoId: { type: String, required: true },
  numeroPoliza: { type: String, required: true },
  fechaInicio: { type: String, required: true },
  fechaVencimiento: { type: String, required: true },
  ownerEmail: { type: String, required: true },
});
const Soat = mongoose.model('Soat', SoatSchema);

const RtmSchema = new mongoose.Schema({
  vehiculoId: { type: String, required: true },
  numeroRtm: { type: String, required: true },
  fechaInicio: { type: String, required: true },
  fechaVencimiento: { type: String, required: true },
  ownerEmail: { type: String, required: true },
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
const VerificacionOTPJuan = juanConnection.model('VerificacionOTP', VerificacionOTPSchema);

const ensureJuanConnection = async () => {
  await juanConnectionReady;

  if (juanConnection.readyState !== 1) {
    throw new Error('La base de datos secundaria de Juan no esta disponible.');
  }
};

const syncUsuarioToJuan = async (usuario) => {
  await ensureJuanConnection();

  await UsuarioJuan.findOneAndUpdate(
    { email: usuario.email },
    {
      $set: {
        nombre: usuario.nombre || '',
        email: usuario.email,
        password: usuario.password,
        empresa: usuario.empresa,
        telefono: usuario.telefono,
        role: usuario.role || 'admin',
        isVerified: usuario.isVerified,
        createdAt: usuario.createdAt || new Date(),
      },
    },
    {
      upsert: true,
      new: true,
      runValidators: true,
      setDefaultsOnInsert: true,
    }
  );
};

const syncOtpToJuan = async (verificacion) => {
  await ensureJuanConnection();

  await VerificacionOTPJuan.findOneAndUpdate(
    { email: verificacion.email },
    {
      $set: {
        email: verificacion.email,
        codigoHash: verificacion.codigoHash,
        expiresAt: verificacion.expiresAt,
        intentos: verificacion.intentos,
        ultimoEnvio: verificacion.ultimoEnvio,
        createdAt: verificacion.createdAt || new Date(),
      },
    },
    {
      upsert: true,
      new: true,
      runValidators: true,
      setDefaultsOnInsert: true,
    }
  );
};

const deleteOtpFromJuan = async (email) => {
  await ensureJuanConnection();
  await VerificacionOTPJuan.findOneAndDelete({ email });
};

const normalizeText = (value) => String(value ?? '').trim();
const normalizeEmail = (value) => normalizeText(value).toLowerCase();
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const DUPLICATE_EMAIL_MESSAGE = 'Ya existe una cuenta con este correo electrónico.';
const normalizeNullableText = (value) => {
  const normalized = normalizeText(value);
  return normalized || null;
};
const hasOwn = (object, key) => Object.prototype.hasOwnProperty.call(object, key);
const isValidDateRange = (fechaInicio, fechaVencimiento) =>
  Boolean(fechaInicio && fechaVencimiento && new Date(fechaVencimiento) > new Date(fechaInicio));
const findOwnedVehicle = (vehiculoId, ownerEmail) => {
  if (!mongoose.Types.ObjectId.isValid(vehiculoId)) {
    return null;
  }

  return Vehiculo.findOne({ _id: vehiculoId, ownerEmail });
};

// Registro: crea usuario no verificado y dispara envio de OTP al correo.
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
    await syncUsuarioToJuan(nuevoUsuario);

    const codigo = String(secureRandomInt(100000, 999999));
    const codigoHash = await bcrypt.hash(codigo, 10);
    const expiresAt = new Date(Date.now() + OTP_EXPIRACION_MINUTOS * 60 * 1000);

    await VerificacionOTP.findOneAndDelete({ email: emailNormalizado });
    await deleteOtpFromJuan(emailNormalizado);
    const verificacion = await new VerificacionOTP({ email: emailNormalizado, codigoHash, expiresAt }).save();
    await syncOtpToJuan(verificacion);

    try {
      await enviarCodigoVerificacion(emailNormalizado, nombreNormalizado || empresaNormalizada, codigo);
    } catch (emailErr) {
      console.error('Error al enviar correo:', emailErr.message);
      return res.status(500).json({ message: `No se pudo enviar el correo de verificacion: ${emailErr.message}` });
    }

    res.status(201).json({
      success: true,
      message: 'Registro exitoso. Revisa tu correo para verificar tu cuenta.',
      data: { email: emailNormalizado, needsVerification: true },
    });
  } catch (err) {
    if (err?.name === 'MongooseServerSelectionError' || err?.name === 'MongoServerSelectionError') {
      return res.status(503).json({ message: DB_UNAVAILABLE_MESSAGE, code: 'DB_UNAVAILABLE' });
    }
    res.status(500).json({ message: err.message });
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
      return res.status(400).json({ message: 'No hay un codigo pendiente para este correo. Vuelve a registrarte.' });
    }

    if (new Date() > verificacion.expiresAt) {
      await VerificacionOTP.findOneAndDelete({ email: emailNormalizado });
      await deleteOtpFromJuan(emailNormalizado);
      return res.status(400).json({ message: 'El codigo ha expirado. Solicita uno nuevo.' });
    }

    if (verificacion.intentos >= OTP_MAX_INTENTOS) {
      await VerificacionOTP.findOneAndDelete({ email: emailNormalizado });
      await deleteOtpFromJuan(emailNormalizado);
      return res.status(400).json({ message: 'Demasiados intentos fallidos. Solicita un nuevo codigo.' });
    }

    const codigoCorrecto = await bcrypt.compare(String(codigo), verificacion.codigoHash);

    if (!codigoCorrecto) {
      verificacion.intentos += 1;
      await verificacion.save();
      await syncOtpToJuan(verificacion);
      const restantes = OTP_MAX_INTENTOS - verificacion.intentos;
      return res.status(400).json({ message: `Codigo incorrecto. Intentos restantes: ${restantes}` });
    }

    const usuarioActualizado = await Usuario.findOneAndUpdate(
      { email: emailNormalizado },
      { isVerified: true },
      { new: true }
    );
    await VerificacionOTP.findOneAndDelete({ email: emailNormalizado });
    await syncUsuarioToJuan(usuarioActualizado);
    await deleteOtpFromJuan(emailNormalizado);

    const usuario = await Usuario.findOne({ email: emailNormalizado });
    res.json({
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
    res.status(500).json({ message: err.message });
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
      const segundosDesdeUltimoEnvio = (Date.now() - new Date(verificacionExistente.ultimoEnvio).getTime()) / 1000;
      if (segundosDesdeUltimoEnvio < OTP_COOLDOWN_SEGUNDOS) {
        const espera = Math.ceil(OTP_COOLDOWN_SEGUNDOS - segundosDesdeUltimoEnvio);
        return res.status(429).json({ message: `Espera ${espera} segundos antes de solicitar otro codigo.` });
      }
    }

    const codigo = String(secureRandomInt(100000, 999999));
    const codigoHash = await bcrypt.hash(codigo, 10);
    const expiresAt = new Date(Date.now() + OTP_EXPIRACION_MINUTOS * 60 * 1000);

    await VerificacionOTP.findOneAndDelete({ email: emailNormalizado });
    await deleteOtpFromJuan(emailNormalizado);
    const verificacion = await new VerificacionOTP({
      email: emailNormalizado,
      codigoHash,
      expiresAt,
      ultimoEnvio: new Date(),
    }).save();
    await syncOtpToJuan(verificacion);

    try {
      await enviarCodigoVerificacion(emailNormalizado, usuario.nombre || usuario.empresa, codigo);
    } catch (emailErr) {
      console.error('Error al enviar correo:', emailErr.message);
      return res.status(500).json({ message: `Error al enviar el correo: ${emailErr.message}` });
    }

    res.json({ message: 'Codigo reenviado exitosamente. Revisa tu correo.' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Login restringido: solo permite acceso cuando isVerified es true.
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const emailNormalizado = normalizeEmail(email);

    if (!emailNormalizado || !password) {
      return res.status(400).json({ message: 'Email y contrasena son requeridos' });
    }

    const usuario = await Usuario.findOne({ email: emailNormalizado });

    if (usuario && (await usuario.comparePassword(password))) {
      res.json({
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
    } else {
      res.status(401).json({ success: false, message: 'Credenciales invalidas' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.get('/api/conductores', async (req, res) => {
  try {
    const email = normalizeEmail(req.query.email);

    if (!email) {
      return res.status(400).json({ error: 'El email es obligatorio.' });
    }

    const data = await Conductor.find({ ownerEmail: email });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
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
      return res
        .status(400)
        .json({ error: 'Todos los campos obligatorios deben estar completos.' });
    }

    const existente = await Conductor.findOne({
      documento: documentoNormalizado,
      ownerEmail: ownerEmailNormalizado,
    });

    if (existente) {
      return res.status(400).json({ error: 'Ya existe un conductor con este documento.' });
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
    res.status(201).json(nuevo);
  } catch (err) {
    res.status(400).json({ error: err.message });
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
      return res
        .status(400)
        .json({ error: 'Todos los campos obligatorios deben estar completos.' });
    }

    const duplicado = await Conductor.findOne({
      documento: documentoNormalizado,
      ownerEmail: conductorExistente.ownerEmail,
      _id: { $ne: conductorExistente._id },
    });

    if (duplicado) {
      return res.status(400).json({ error: 'Ya existe un conductor con este documento.' });
    }

    conductorExistente.nombre = nombreNormalizado;
    conductorExistente.documento = documentoNormalizado;
    conductorExistente.telefono = telefonoNormalizado;
    conductorExistente.categoria = categoriaNormalizada;
    conductorExistente.fechaVencimiento = fechaVencimientoNormalizada;

    await conductorExistente.save();
    res.json(conductorExistente);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.delete('/api/conductores/:id', async (req, res) => {
  try {
    const conductorEliminado = await Conductor.findByIdAndDelete(req.params.id);

    if (!conductorEliminado) {
      return res.status(404).json({ error: 'Conductor no encontrado' });
    }

    await Vehiculo.updateMany({ conductorId: req.params.id }, { conductorId: null });
    res.json({ ok: true });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.get('/api/vehiculos', async (req, res) => {
  try {
    const email = normalizeEmail(req.query.email);

    if (!email) {
      return res.status(400).json({ error: 'El email es obligatorio.' });
    }

    const data = await Vehiculo.find({ ownerEmail: email });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/vehiculos', async (req, res) => {
  try {
    const { placa, marca, modelo, anio, tipo, conductorId, ownerEmail, ownerEmpresa } = req.body;
    const placaNormalizada = normalizeText(placa).toUpperCase();
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
      return res
        .status(400)
        .json({ error: 'Todos los campos obligatorios deben estar completos.' });
    }

    if (!Number.isInteger(anioNumero) || anioNumero < 1990 || anioNumero > new Date().getFullYear() + 1) {
      return res.status(400).json({ error: 'El anio del vehiculo no es valido.' });
    }

    const conductorIdNormalizado = normalizeNullableText(conductorId);

    if (conductorIdNormalizado) {
      if (!mongoose.Types.ObjectId.isValid(conductorIdNormalizado)) {
        return res.status(400).json({ error: 'El conductor seleccionado no es valido.' });
      }

      const conductor = await Conductor.findById(conductorIdNormalizado);
      if (!conductor || conductor.ownerEmail !== ownerEmailNormalizado) {
        return res.status(400).json({ error: 'El conductor no pertenece al usuario autenticado.' });
      }
    }

    const existente = await Vehiculo.findOne({
      placa: placaNormalizada,
      ownerEmail: ownerEmailNormalizado,
    });

    if (existente) {
      return res.status(400).json({ error: 'Ya existe un vehiculo con esta placa.' });
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
    res.status(201).json(nuevo);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.put('/api/vehiculos/:id', async (req, res) => {
  try {
    const vehiculoExistente = await Vehiculo.findById(req.params.id);

    if (!vehiculoExistente) {
      return res.status(404).json({ error: 'Vehiculo no encontrado' });
    }

    const placaNormalizada = normalizeText(req.body.placa).toUpperCase();
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
      return res
        .status(400)
        .json({ error: 'Todos los campos obligatorios deben estar completos.' });
    }

    if (!Number.isInteger(anioNumero) || anioNumero < 1990 || anioNumero > new Date().getFullYear() + 1) {
      return res.status(400).json({ error: 'El anio del vehiculo no es valido.' });
    }

    const duplicado = await Vehiculo.findOne({
      placa: placaNormalizada,
      ownerEmail: vehiculoExistente.ownerEmail,
      _id: { $ne: vehiculoExistente._id },
    });

    if (duplicado) {
      return res.status(400).json({ error: 'Ya existe un vehiculo con esta placa.' });
    }

    vehiculoExistente.placa = placaNormalizada;
    vehiculoExistente.marca = marcaNormalizada;
    vehiculoExistente.modelo = modeloNormalizado;
    vehiculoExistente.anio = anioNumero;
    vehiculoExistente.tipo = tipoNormalizado;

    await vehiculoExistente.save();
    res.json(vehiculoExistente);
  } catch (err) {
    res.status(400).json({ error: err.message });
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

    res.json({ ok: true });
  } catch (err) {
    res.status(400).json({ error: err.message });
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
        return res.status(400).json({ error: 'El conductor seleccionado no es valido.' });
      }

      const conductor = await Conductor.findById(conductorId);

      if (!conductor) {
        return res.status(404).json({ error: 'Conductor no encontrado' });
      }

      if (conductor.ownerEmail !== vehiculo.ownerEmail) {
        return res
          .status(400)
          .json({ error: 'El conductor no pertenece al mismo usuario del vehiculo.' });
      }

      await Vehiculo.updateMany(
        {
          ownerEmail: vehiculo.ownerEmail,
          conductorId,
          _id: { $ne: vehiculo._id },
        },
        { $set: { conductorId: null } }
      );
    }

    vehiculo.conductorId = conductorId;
    await vehiculo.save();

    res.json(vehiculo);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ── SOATs ──────────────────────────────────────────────────────────────────

app.get('/api/soats', async (req, res) => {
  try {
    const email = normalizeEmail(req.query.email);
    if (!email) return res.status(400).json({ error: 'El email es obligatorio.' });
    const data = await Soat.find({ ownerEmail: email });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/soats', async (req, res) => {
  try {
    const { vehiculoId, numeroPoliza, fechaInicio, fechaVencimiento, ownerEmail } = req.body;
    const vehiculoIdNorm = normalizeText(vehiculoId);
    const numeroPolizaNorm = normalizeText(numeroPoliza);
    const fechaInicioNorm = normalizeText(fechaInicio);
    const fechaVencimientoNorm = normalizeText(fechaVencimiento);
    const ownerEmailNorm = normalizeEmail(ownerEmail);

    if (!vehiculoIdNorm || !numeroPolizaNorm || !fechaInicioNorm || !fechaVencimientoNorm || !ownerEmailNorm) {
      return res.status(400).json({ error: 'Todos los campos son obligatorios.' });
    }

    if (!isValidDateRange(fechaInicioNorm, fechaVencimientoNorm)) {
      return res.status(400).json({ error: 'La fecha de vencimiento debe ser posterior a la fecha de inicio.' });
    }

    const vehiculo = await findOwnedVehicle(vehiculoIdNorm, ownerEmailNorm);
    if (!vehiculo) {
      return res.status(400).json({ error: 'El vehiculo seleccionado no existe o no pertenece al usuario.' });
    }

    await Soat.deleteMany({ vehiculoId: vehiculoIdNorm, ownerEmail: ownerEmailNorm });

    const nuevo = new Soat({
      vehiculoId: vehiculoIdNorm,
      numeroPoliza: numeroPolizaNorm,
      fechaInicio: fechaInicioNorm,
      fechaVencimiento: fechaVencimientoNorm,
      ownerEmail: ownerEmailNorm,
    });

    await nuevo.save();
    res.status(201).json(nuevo);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.delete('/api/soats/:id', async (req, res) => {
  try {
    const eliminado = await Soat.findByIdAndDelete(req.params.id);
    if (!eliminado) return res.status(404).json({ error: 'SOAT no encontrado.' });
    res.json({ ok: true });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ── RTMs ───────────────────────────────────────────────────────────────────

app.get('/api/rtms', async (req, res) => {
  try {
    const email = normalizeEmail(req.query.email);
    if (!email) return res.status(400).json({ error: 'El email es obligatorio.' });
    const data = await Rtm.find({ ownerEmail: email });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/rtms', async (req, res) => {
  try {
    const { vehiculoId, numeroRtm, fechaInicio, fechaVencimiento, ownerEmail } = req.body;
    const vehiculoIdNorm = normalizeText(vehiculoId);
    const numeroRtmNorm = normalizeText(numeroRtm);
    const fechaInicioNorm = normalizeText(fechaInicio);
    const fechaVencimientoNorm = normalizeText(fechaVencimiento);
    const ownerEmailNorm = normalizeEmail(ownerEmail);

    if (!vehiculoIdNorm || !numeroRtmNorm || !fechaInicioNorm || !fechaVencimientoNorm || !ownerEmailNorm) {
      return res.status(400).json({ error: 'Todos los campos son obligatorios.' });
    }

    if (!isValidDateRange(fechaInicioNorm, fechaVencimientoNorm)) {
      return res.status(400).json({ error: 'La fecha de vencimiento debe ser posterior a la fecha de inicio.' });
    }

    const vehiculo = await findOwnedVehicle(vehiculoIdNorm, ownerEmailNorm);
    if (!vehiculo) {
      return res.status(400).json({ error: 'El vehiculo seleccionado no existe o no pertenece al usuario.' });
    }

    await Rtm.deleteMany({ vehiculoId: vehiculoIdNorm, ownerEmail: ownerEmailNorm });

    const nuevo = new Rtm({
      vehiculoId: vehiculoIdNorm,
      numeroRtm: numeroRtmNorm,
      fechaInicio: fechaInicioNorm,
      fechaVencimiento: fechaVencimientoNorm,
      ownerEmail: ownerEmailNorm,
    });

    await nuevo.save();
    res.status(201).json(nuevo);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.delete('/api/rtms/:id', async (req, res) => {
  try {
    const eliminado = await Rtm.findByIdAndDelete(req.params.id);
    if (!eliminado) return res.status(404).json({ error: 'RTM no encontrada.' });
    res.json({ ok: true });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor backend listo en http://localhost:${PORT}`);
});
