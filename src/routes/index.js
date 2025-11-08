const express = require('express');
const router = express.Router();

// Health check
router.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    service: 'Bardahl Ukraine Store API',
    version: '1.0.0'
  });
});

// API info
router.get('/info', (req, res) => {
  res.json({
    name: 'Bardahl Ukraine Store API',
    version: '1.0.0',
    description: 'Интернет-магазин машинных масел и автохимии Bardahl | Украина',
    endpoints: [
      'GET /api/health - Статус сервера',
      'GET /api/info - Информация об API',
      'GET /api/products - Список товаров',
      'GET /api/categories - Список категорий'
    ]
  });
});

// Mount routes
router.use('/products', require('./products'));
router.use('/categories', require('./categories'));

module.exports = router;