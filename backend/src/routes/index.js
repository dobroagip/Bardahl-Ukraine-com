const express = require('express');
const router = express.Router();
const orderRoutes = require('./orders');

// Импортируем все роуты
const productRoutes = require('./products');
const categoryRoutes = require('./categories');
const authRoutes = require('./auth'); // ← ДОБАВЛЯЕМ
const cartRoutes = require('./cart'); 
const adminRoutes = require('./admin');
// Подключаем роуты
router.use('/products', productRoutes);
router.use('/categories', categoryRoutes);
router.use('/auth', authRoutes); 
router.use('/cart', cartRoutes);
router.use('/orders', orderRoutes);
router.use('/admin', adminRoutes);

// Базовый endpoint для проверки API
router.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Bardahl Ukraine API is running!',
    endpoints: {
      products: '/api/products',
      categories: '/api/categories',
      auth: '/api/auth',
      cart: '/api/cart',
      orders: '/api/orders',
      admin: '/api/admin'
    }
  });
});

module.exports = router;