const { Schema, model } = require('mongoose');

const brandSchema = Schema({
    name: {
        type: String,
        required: true,
    },
    fechaCreacion: {
        type: Date,
        required: true,
    },
    fechaActualizacion: {
        type: Date,
        required: true
    },
});

module.exports = model('Brand', brandSchema);
