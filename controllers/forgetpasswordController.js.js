const crypto = require('crypto');
const nodemailer = require('nodemailer');
const bcrypt = require('bcryptjs');
const User = require('../models/user');


const forgetPassword = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ message: 'User not found' });

  const token = crypto.randomBytes(32).toString('hex');
  const expiry = Date.now() + 3600000; // 1 hour

  user.resetToken = token;
  user.resetTokenExpiry = expiry;
  await user.save();

  // Send email
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: "smtp.gmail.email",
    port: 587, // or Mailtrap for dev
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const resetLink = `${process.env.frontend}/reset-password/${token}`;
  console.log("resetLink",resetLink)

  const info = await transporter.sendMail({
    from: {
        name: "amazone_clone service",
        address: process.env.EMAIL_USER
    },
    to: email,
    subject: 'Password Reset',
    html: `<p>You requested a password reset</p><a href="${resetLink}">Click here to reset</a>`,
  });

  res.json({ info, message: 'Check your email for reset link' });
};

// Reset Password Controller
const resetPassword = async (req, res) => {
    const { token } = req.params;
  const { newPassword } = req.body;

  const user = await User.findOne({
    resetToken: token,
    resetTokenExpiry: { $gt: Date.now() },
  });

  if (!user) return res.status(400).json({ message: 'Invalid or expired token' });

  const bcrypt = require('bcrypt');
  const hashedPassword = await bcrypt.hash(newPassword, 12);

  user.password = hashedPassword;
  user.resetToken = undefined;
  user.resetTokenExpiry = undefined;
  await user.save(); 

  res.json({ message: 'Password reset successful' });
};

module.exports = { forgetPassword, resetPassword };
