const { Schema, model } = require('mongoose');

const productSchema = Schema({
  name: {
    type: String,
    required: true,
    minlength: 3,
  },
  description: {
    type: String,
    required: true,
    minlength: 3,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  inventory: {
    type: Number,
    required: true,
    min: 0,
  },
  image: {
    type: String,
    required: true,
  },
  category: {
    type: Schema.Types.ObjectId,
    ref: 'Category',
    required: true
  },
  brand: {
    type: Schema.Types.ObjectId,
    ref: 'Brand',
    required: true
  },
  // seller: {
  //   type: Schema.Types.ObjectId,
  //   ref: 'User',
  //   required: true
  // }

});

module.exports = model('Product', productSchema);

