const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/auth');

// Публичные routes
router.post('/register', authController.register);
router.post('/login', authController.login);

// Защищенные routes (требуют аутентификации)
router.get('/profile', authMiddleware.authenticate, authController.getProfile);

module.exports = router;