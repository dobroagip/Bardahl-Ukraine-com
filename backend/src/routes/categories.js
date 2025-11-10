const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');

// GET /api/categories - Список категорий
router.get('/', categoryController.getCategories);

module.exports = router;