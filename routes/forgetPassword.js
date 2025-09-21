const express = require('express');
const router = express.Router();
const forgetPasswordController = require('../controllers/forgetpasswordController.js.js');

// Forgot password route
router.post('/forget', forgetPasswordController.forgetPassword);

// Reset password route
router.post('/reset/:token', forgetPasswordController.resetPassword);

module.exports = router;