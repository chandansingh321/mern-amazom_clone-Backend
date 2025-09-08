const mongoose = require('mongoose');

const inventorySchema = new mongoose.Schema({
  productid: {
   type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  StockQuantity:{
    type:Number,
    required:true,
    min: 0
  },
  LastUpdated: {
    type: Date,
    default: Date.now
  }
  
});

module.exports = mongoose.model('Inventory', inventorySchema);