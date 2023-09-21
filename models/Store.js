const { Schema, model } = require('mongoose');

const storeSchema = Schema({
  name: { type: String, required: true, minlength: 6, },
  description: { type: String, required: true, minlength: 6}
});

module.exports = model('Store', storeSchema);
