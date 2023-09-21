const { Schema, model } = require('mongoose');

const userSchema = Schema({
  name: { type: String, required: true, minlength: 6, },
  email: { type: String, required: true, unique: true, },
  password: { type: String, required: true, minlength: 6, },
  role: { type: String, enum: ['admin', 'seller'], default: 'seller' },
  store: { type: Schema.Types.ObjectId, ref: 'Store'},
});

module.exports = model('User', userSchema);

