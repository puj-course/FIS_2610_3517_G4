const mongoose = require('mongoose');

const ConductorSchema = new mongoose.Schema({
  nombre: String,
  documento: String,
  telefono: String,
  categoria: String,
  fechaVencimiento: String // Guardar como String YYYY-MM-DD es práctico para tu lógica actual
});

module.exports = mongoose.model('Conductor', ConductorSchema);