const express = require('express');
const router = express.Router();
const CategoryController = require("../controllers/CategoryController")

router.post('/create-categorie', CategoryController.createCategory);
router.get('/category', CategoryController.getProductCategory);
// Add other product routes as needed

module.exports = router;