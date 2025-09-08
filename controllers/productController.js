const Product = require('../models/Product');

exports.createProduct = async (req, res) => {
  try {
    const product = new Product(req.body);
    const savedProduct = await product.save();
    res.status(201).json({
      success: true,
      data: savedProduct
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};



exports.getProduct = async (req, res) => {  // Added async and req parameter
  try {
    const categoryid = req.params.id;

    if (!categoryid) {
      return res.status(400).json({
        success: false,
        error: 'category ID is required'
      });
    }
    const products = await Product.find({categoryId: categoryid}) // Fixed query and added await
    res.status(200).json({  // Changed status to 200 for successful GET
      success: true,
      count: products.length,  // Added count of products
      data: products
    });
  } catch (error) {
    console.error('Error fetching products:', error);  // Added error logging
    res.status(500).json({  // Changed to 500 for server errors
      success: false,
      error: 'Server error while fetching products'
    });
  }
};
exports.getProductOne = async (req, res) => {
  try {
    // 1. Get ID from URL parameters (not req.body for GET requests)
    const productid = req.params.id;

    // 2. Validate ID exists
    if (!productid) {
      return res.status(400).json({
        success: false,
        error: 'Product ID is required'
      });
    }

    // 3. Find product by ID (using findById instead of find)
    const product = await Product.findById(productid);

    // 4. Check if product exists
    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Product not found'
      });
    }

    // 5. Return successful response
    res.status(200).json({
      success: true,
      data: product
    });

  } catch (error) {
    console.error('Error fetching product:', error);
    
    // Handle specific MongoDB CastError (invalid ID format)
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        error: 'Invalid product ID format'
      });
    }

    // Generic server error
    res.status(500).json({
      success: false,
      error: 'Server error while fetching product'
    });
  }
};
// controllers/productController.js


exports.searchProducts = async (req, res) => {
  const rawQuery = req.query.q;
  const query = rawQuery?.replace(/['"]+/g, '').trim(); // remove quotes

  if (!query) {
    return res.status(400).json({
      success: false,
      message: 'Search query is required'
    });
  }

  try {
    const regex = new RegExp(query, 'i');

    const results = await Product.find({
      $or: [
        { name: { $regex: regex } },
        { description: { $regex: regex } }
      ]
    });

    console.log("Matched results:", results);

    if (results.length === 0) {
      return res.status(404).json({
        success: false,
        data:[],
        message: `No products found for "${query}".`
      });
    }

    res.status(200).json({
      success: true,
      count: results.length,
      data: results
    });
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during search'
    });
  }
};


