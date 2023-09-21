const { Schema, model } = require('mongoose');

const categorySchema = Schema({
  name: { type: String, required: true, },
  fechaCreacion: { type: Date, required: true, },
  fechaActualizacion: { type: Date, required: true },
});

module.exports = model('Category', categorySchema);

