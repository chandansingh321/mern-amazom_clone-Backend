const express = require('express');
const router = express.Router();
const CategoryController = require("../controllers/CategoryController")
const productController = require('../controllers/productController');

router.post('/create-product', productController.createProduct);
router.get('/product/:id', productController.getProduct);
router.get('/productone/:id', productController.getProductOne);
router.get('/search', productController.searchProducts);

// Add other product routes as needed

module.exports = router;