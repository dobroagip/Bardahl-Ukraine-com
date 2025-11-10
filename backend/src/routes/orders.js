const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const authMiddleware = require('../middleware/auth');

// Все routes требуют аутентификации
router.post('/create', authMiddleware.authenticate, orderController.createOrder);
router.get('/history', authMiddleware.authenticate, orderController.getOrderHistory);
router.get('/:orderId', authMiddleware.authenticate, orderController.getOrderDetails);
router.put('/:orderId/cancel', authMiddleware.authenticate, orderController.cancelOrder); 
module.exports = router;