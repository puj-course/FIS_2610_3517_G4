const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const helmet = require('helmet');

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

const MONGO_URI =
  process.env.MONGO_URI ||
  'mongodb+srv://juansebastianvd_db_user:UcgkGfBgvUkgEVcF@cluster0.45cqzzh.mongodb.net/logistica_db?retryWrites=true&w=majority';

mongoose
  .connect(MONGO_URI)
  .then(() => console.log('Conexion exitosa a MongoDB Atlas'))
  .catch((err) => console.error('Error de conexion:', err));

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
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  empresa: String,
  telefono: String,
  role: { type: String, default: 'admin' },
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

const normalizeText = (value) => String(value ?? '').trim();
const normalizeNullableText = (value) => {
  const normalized = normalizeText(value);
  return normalized || null;
};
const hasOwn = (object, key) => Object.prototype.hasOwnProperty.call(object, key);

app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password, empresa, telefono } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email y contrasena son requeridos' });
    }

    const existe = await Usuario.findOne({ email });
    if (existe) {
      return res.status(400).json({ message: 'El correo ya esta registrado' });
    }

    const nuevoUsuario = new Usuario({ email, password, empresa, telefono });
    await nuevoUsuario.save();

    res.status(201).json({
      success: true,
      data: {
        user: { _id: nuevoUsuario._id, email: nuevoUsuario.email, empresa: nuevoUsuario.empresa, role: nuevoUsuario.role },
        token: generateToken(nuevoUsuario._id),
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email y contrasena son requeridos' });
    }

    const usuario = await Usuario.findOne({ email });

    if (usuario && (await usuario.comparePassword(password))) {
      res.json({
        success: true,
        data: {
          user: { _id: usuario._id, email: usuario.email, empresa: usuario.empresa, role: usuario.role },
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
    const email = normalizeText(req.query.email);

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
    const ownerEmailNormalizado = normalizeText(ownerEmail);

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
    const email = normalizeText(req.query.email);

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
    const ownerEmailNormalizado = normalizeText(ownerEmail);
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

    if (!Number.isInteger(anioNumero)) {
      return res.status(400).json({ error: 'El anio del vehiculo no es valido.' });
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
      conductorId: normalizeNullableText(conductorId),
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

    if (!Number.isInteger(anioNumero)) {
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
    const email = normalizeText(req.query.email);
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
    const ownerEmailNorm = normalizeText(ownerEmail);

    if (!vehiculoIdNorm || !numeroPolizaNorm || !fechaInicioNorm || !fechaVencimientoNorm || !ownerEmailNorm) {
      return res.status(400).json({ error: 'Todos los campos son obligatorios.' });
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
    const email = normalizeText(req.query.email);
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
    const ownerEmailNorm = normalizeText(ownerEmail);

    if (!vehiculoIdNorm || !numeroRtmNorm || !fechaInicioNorm || !fechaVencimientoNorm || !ownerEmailNorm) {
      return res.status(400).json({ error: 'Todos los campos son obligatorios.' });
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