const mongoose = require("mongoose");
const Cart = require('../models/cart');
const Product = require('../models/Product');

exports.cart = async (req, res) => {
  try {
    const cartRef = new Cart(req.body);
    const savedCart = await cartRef.save();
    res.status(201).json({
      success: true,
      data: savedCart
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};
exports.getcart = async (req, res) => {
    let procustData=[]
    try {
        const userid = req.params.id;
        console.log(userid, "userid")
    
        if (!userid) {
          return res.status(400).json({
            success: false,
            error: 'user ID is required'
          });
        }
        const fetched_data = await Cart.find({user: userid}).lean(); // Fixed query and added await
        if(fetched_data.length>0){
             procustData=await Promise.all(fetched_data.map(async(item)=>{
                const products =await Product.findById(item.items._id).lean()
            return {...item,products:products}
             }))
        }
        
        res.status(200).json({  // Changed status to 200 for successful GET
          success: true,
          count: fetched_data.length,  // Added count of products
          data: procustData
        });
      } catch (error) {
        console.error('Error fetching cart products:', error);  // Added error logging
        res.status(500).json({  // Changed to 500 for server errors
          success: false,
          error: 'Server error while fetching cart products'
        });
      } 
};


exports.deleteCartItem = async (req, res) => {
  try {
    const cartItemId = req.params.id;

    if (!cartItemId) {
      return res.status(400).json({
        success: false,
        error: 'Cart item ID is required',
      });
    }

    const deletedItem = await Cart.findByIdAndDelete(cartItemId);

    if (!deletedItem) {
      return res.status(404).json({
        success: false,
        error: 'Cart item not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Cart item deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting cart item:', error);
    res.status(500).json({
      success: false,
      error: 'Server error while deleting cart item',
    });
  }
};

// export default (getcart, deleteCartItem, cart )