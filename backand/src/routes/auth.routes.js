// auth.routes.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
//signup user
router.post('/register', authController.register);

//verify otp
router.post('/verify-otp',authController.verifyOTP)

//login
router.post('/login',authController.login)

module.exports = router; // ✅ Must export the router