const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Route for sending OTP (Login/Signup)
router.post('/send-otp', authController.requestOTP);

// Route for verifying OTP
router.post('/verify-otp', authController.verifyOTP);

// Admin Specific Routes
router.post('/admin/send-otp', authController.requestAdminOTP);
router.post('/admin/verify-otp', authController.verifyAdminOTP);

module.exports = router;