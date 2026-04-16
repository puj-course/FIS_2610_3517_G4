const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// --- MIDDLEWARES ---
app.use(cors());
app.use(express.json());

// --- CONEXIÓN A MONGODB ATLAS ---
const MONGO_URI = "mongodb+srv://juansebastianvd_db_user:UcgkGfBgvUkgEVcF@cluster0.45cqzzh.mongodb.net/logistica_db?retryWrites=true&w=majority";

mongoose.connect(MONGO_URI)
  .then(() => console.log('✅ Conexión exitosa a MongoDB Atlas'))
  .catch(err => console.error('❌ Error de conexión:', err));

// --- MODELOS DE DATOS ---

const ConductorSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  documento: { type: String, required: true },
  telefono: String,
  categoria: String,
  fechaVencimiento: { type: String, required: true },
  ownerEmail: { type: String, required: true }
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
  ownerEmpresa: String
});
const Vehiculo = mongoose.model('Vehiculo', VehiculoSchema);

// --- MODELO DE USUARIO ---
const UsuarioSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  empresa: String,
  telefono: String,
  role: { type: String, default: 'admin' }
});
const Usuario = mongoose.model('Usuario', UsuarioSchema);

// --- RUTAS DE AUTENTICACIÓN ---

// Registro de usuario
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password, empresa, telefono } = req.body; // ✅ FIX: era req.query
    if (!email || !password) {
      return res.status(400).json({ message: 'Email y contraseña son requeridos' });
    }
    const existe = await Usuario.findOne({ email });
    if (existe) return res.status(400).json({ message: 'El correo ya está registrado' });

    const nuevoUsuario = new Usuario({ email, password, empresa, telefono });
    await nuevoUsuario.save();

    // ✅ FIX: devolver { user: ... } sin la contraseña
    const { password: _, ...userSinPassword } = nuevoUsuario.toObject();
    res.status(201).json({ user: userSinPassword });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Login de usuario
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email y contraseña son requeridos' });
    }
    const usuario = await Usuario.findOne({ email, password }); // usar bcrypt en producción
    if (!usuario) return res.status(401).json({ message: 'Credenciales inválidas' });

    // ✅ FIX: devolver { user: ... } sin la contraseña
    const { password: _, ...userSinPassword } = usuario.toObject();
    res.json({ user: userSinPassword });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// --- RUTAS PARA CONDUCTORES ---

app.get('/api/conductores', async (req, res) => {
  try {
    const { email } = req.query;
    const data = await Conductor.find({ ownerEmail: email });
    res.json(data);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/conductores', async (req, res) => {
  try {
    const nuevo = new Conductor(req.body);
    await nuevo.save();
    res.status(201).json(nuevo);
  } catch (err) { res.status(400).json({ error: err.message }); }
});

// --- RUTAS PARA VEHÍCULOS ---

app.get('/api/vehiculos', async (req, res) => {
  try {
    const { email } = req.query;
    const data = await Vehiculo.find({ ownerEmail: email });
    res.json(data);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/vehiculos', async (req, res) => {
  try {
    const nuevo = new Vehiculo(req.body);
    await nuevo.save();
    res.status(201).json(nuevo);
  } catch (err) { res.status(400).json({ error: err.message }); }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor backend listo en http://localhost:${PORT}`);
});