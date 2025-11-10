const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const authMiddleware = require('../middleware/auth');

// Все админ routes требуют аутентификации И роли ADMIN
router.get('/dashboard', authMiddleware.authenticate, authMiddleware.requireAdmin, adminController.getDashboardStats);
router.get('/orders', authMiddleware.authenticate, authMiddleware.requireAdmin, adminController.getAllOrders);
router.put('/orders/:orderId/status', authMiddleware.authenticate, authMiddleware.requireAdmin, adminController.updateOrderStatus);
router.get('/users', authMiddleware.authenticate, authMiddleware.requireAdmin, adminController.getAllUsers);
router.post('/products', authMiddleware.authenticate, authMiddleware.requireAdmin, adminController.createProduct);
router.put('/products/:productId', authMiddleware.authenticate, authMiddleware.requireAdmin, adminController.updateProduct);

module.exports = router;