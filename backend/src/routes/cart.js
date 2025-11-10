const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const authMiddleware = require('../middleware/auth');

// Все routes требуют аутентификации
router.get('/', authMiddleware.authenticate, cartController.getCart);
router.post('/add', authMiddleware.authenticate, cartController.addToCart);
router.put('/item/:itemId', authMiddleware.authenticate, cartController.updateCartItem); 
router.delete('/item/:itemId', authMiddleware.authenticate, cartController.removeFromCart);
router.delete('/clear', authMiddleware.authenticate, cartController.clearCart);
module.exports = router;