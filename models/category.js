const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  deletedAt: {
    type: Date,
    default: Date.now
  },
  isdeleted: {
    type:Boolean,
    default:false
  }
  
});

module.exports = mongoose.model('categorie', categorySchema);