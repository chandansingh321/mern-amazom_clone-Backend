const express = require('express');
const router = express.Router();
const cartController = require("../controllers/cartController");
const { authenticatMiddleware } = require('../middleware/authenticatmiddle');
// const { authenticatmiddle } = require('../middleware/authenticatmiddle');

router.post('/addtocart',authenticatMiddleware, cartController.cart);
router.get('/cart/:id',authenticatMiddleware, cartController.getcart);
router.delete('/delete/:id',authenticatMiddleware, cartController.deleteCartItem);


// Add other product routes as needed

module.exports = router;