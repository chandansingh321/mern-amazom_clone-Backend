const mongoose = require('mongoose');
const { Schema } = mongoose;

const cartSchema = new Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true
  },
  items: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  deletedAt:{
    type:Date,
    default: Date.now
  },
  isdeletedAt:{
    type:Boolean,
    default: false
  }
});

const Cart = mongoose.model('Cart', cartSchema);

module.exports = Cart;