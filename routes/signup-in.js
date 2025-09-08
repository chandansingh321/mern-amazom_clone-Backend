const express = require("express");
const router = express.Router();
const User = require("../models/user");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");


// Configuration
const  JWT_SECRET = "addhafrabhhekh!%#"
const SALT_ROUNDS = 12;
const TOKEN_EXPIRY = '24h'; // Token expires in 24 hours

// Helper function for consistent error responses
const errorResponse = (res, statusCode, message, errors = []) => {
  return res.status(statusCode).json({
    success: false,
    message,
    errors: errors.length ? errors : undefined
  });
};

// Signup Route
router.post(
  "/signup",
  [
    body("name")
      .trim()
      .isLength({ min: 3 })
      .withMessage("Name must be at least 3 characters long"),
    body("email")
      .trim()
      .isEmail()
      .withMessage("Please enter a valid email")
      .normalizeEmail(),
    body("password")
      .isLength({ min: 8 })
      .withMessage("Password must be at least 8 characters long")
  ],
  async (req, res) => {
    // Validate input
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return errorResponse(res, 400, "Validation failed", errors.array());
    }

    const { name, email, password } = req.body;

    try {
      // Check if user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return errorResponse(res, 400, "Email already in use");
      }

      // Hash password
      const salt = await bcrypt.genSalt(SALT_ROUNDS);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Create new user
      const newUser = await User.create({
        name,
        email,
        password: hashedPassword
      });

      // Generate JWT token
      const token = jwt.sign(
        { 
          userId: newUser._id,
          username: newUser.name
        },
        JWT_SECRET,
        { expiresIn: TOKEN_EXPIRY }
      );

      // Omit password from response
      const userResponse = {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        createdAt: newUser.createdAt
      };

      return res.status(201).json({
        success: true,
        message: "User created successfully",
        token,
        user: userResponse
      });

    } catch (error) {
      console.error("Signup Error:", error);
      return errorResponse(res, 500, "Internal server error");
    }
  }
);

// Login Route
router.post(
  "/login",
  [
    body("email")
      .trim()
      .isEmail()
      .withMessage("Please enter a valid email")
      .normalizeEmail(),
    body("password")
      .exists()
      .withMessage("Password is required")
  ],
  async (req, res) => {
    // Validate input
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return errorResponse(res, 400, "Validation failed", errors.array());
    }

    const { email, password } = req.body;

    try {
      // Find user
      const user = await User.findOne({ email });
      if (!user) {
        return errorResponse(res, 401, "Invalid credentials");
      }

      // Check password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return errorResponse(res, 401, "Invalid credentials");
      }

      // Generate JWT token
      const token = jwt.sign(
        { 
          userId: user._id,
          username: user.name
        },
        JWT_SECRET,
        { expiresIn: TOKEN_EXPIRY }
      );

      // Omit password from response
      const userResponse = {
        id: user._id,
        name: user.name,
        email: user.email
      };

      return res.json({
        success: true,
        message: "Login successful",
        token,
        user: userResponse
      });

    } catch (error) {
      console.error("Login Error:", error);
      return errorResponse(res, 500, "Internal server error");
    }
  }
);

module.exports = router;