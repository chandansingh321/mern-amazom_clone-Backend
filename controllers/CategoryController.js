const mongoose = require("mongoose");
const Category = require('../models/category');
const Product = require('../models/Product');
exports.createCategory = async (req, res) => {
  try {
    const CategoryRef = new Category(req.body);
    const savedCategory = await CategoryRef.save();
    res.status(201).json({
      success: true,
      data: savedCategory
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};


exports.getProductCategory = async (req, res) => {
    try {
      // 1. Fixed variable name - should match what you're querying
      // Assuming you have a Category model imported

      let procustData=[]
        const fetched_data = await Category.find().lean()
        if(fetched_data.length>0){
             procustData=await Promise.all(fetched_data.map(async(item)=>{
                const productsDetails=await Product.find({categoryId:item._id}).lean()
                return {...item,products:productsDetails}
            }))
        }

        res.status(200).json({
            success: true,
            count: Category.length,  // 2. Changed to categories.length to match the data
            data: procustData           // 3. Changed to return categories instead of undefined 'products'
          });
     
    } catch (error) {
      console.error('Error fetching Category:', error);  // 4. Updated error message
      res.status(500).json({
        success: false,
        error: 'Server error while fetching Category'  // 5. Updated error message
      });
    }
  };