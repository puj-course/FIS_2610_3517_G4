const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

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
const Usuario = mongoose.model('Usuario', UsuarioSchema);

const normalizeText = (value) => String(value ?? '').trim();
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

    const { password: _, ...userSinPassword } = nuevoUsuario.toObject();
    res.status(201).json({ user: userSinPassword });
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

    const usuario = await Usuario.findOne({ email, password });
    if (!usuario) {
      return res.status(401).json({ message: 'Credenciales invalidas' });
    }

    const { password: _, ...userSinPassword } = usuario.toObject();
    res.json({ user: userSinPassword });
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

    if (!nombre || !documento || !telefono || !fechaVencimiento || !ownerEmail) {
      return res
        .status(400)
        .json({ error: 'Todos los campos obligatorios deben estar completos.' });
    }

    const documentoNormalizado = normalizeText(documento);
    const ownerEmailNormalizado = normalizeText(ownerEmail);

    const existente = await Conductor.findOne({
      documento: documentoNormalizado,
      ownerEmail: ownerEmailNormalizado,
    });

    if (existente) {
      return res.status(400).json({ error: 'Ya existe un conductor con este documento.' });
    }

    const nuevo = new Conductor({
      nombre: normalizeText(nombre),
      documento: documentoNormalizado,
      telefono: normalizeText(telefono),
      categoria: normalizeText(categoria),
      fechaVencimiento: normalizeText(fechaVencimiento),
      ownerEmail: ownerEmailNormalizado,
    });

    await nuevo.save();
    res.status(201).json(nuevo);
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

    if (!placa || !marca || !modelo || !anio || !tipo || !ownerEmail) {
      return res
        .status(400)
        .json({ error: 'Todos los campos obligatorios deben estar completos.' });
    }

    const placaNormalizada = normalizeText(placa).toUpperCase();
    const ownerEmailNormalizado = normalizeText(ownerEmail);
    const anioNumero = Number(anio);

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
      marca: normalizeText(marca),
      modelo: normalizeText(modelo),
      anio: anioNumero,
      tipo: normalizeText(tipo),
      conductorId: conductorId ? normalizeText(conductorId) : null,
      ownerEmail: ownerEmailNormalizado,
      ownerEmpresa: normalizeText(ownerEmpresa),
    });

    await nuevo.save();
    res.status(201).json(nuevo);
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

    const conductorId = normalizeText(req.body.conductorId) || null;
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
    }

    vehiculo.conductorId = conductorId;
    await vehiculo.save();

    res.json(vehiculo);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor backend listo en http://localhost:${PORT}`);
});
