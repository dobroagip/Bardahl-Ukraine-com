const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

// GET /api/products - Список товаров
router.get('/', productController.getProducts);

// GET /api/products/:id - Товар по ID
router.get('/:id', productController.getProductById);

module.exports = router;