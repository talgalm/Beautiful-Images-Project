const express = require('express');
const router = express.Router();

const AuthController = require('../Controllers/authController');

// Define routes for authentication
router.post('/login', AuthController.login);
router.post('/register', AuthController.register);

module.exports = router;
