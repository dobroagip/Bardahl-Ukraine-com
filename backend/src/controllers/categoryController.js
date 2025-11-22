const { prisma } = require('../utils/prisma');
const logger = require('../utils/logger');

const categoryController = {
  getCategories: async (req, res) => {
    try {
      console.log('📁 Getting categories...');
      const categories = await prisma.category.findMany({
        include: {
          products: {
            where: { isActive: true },
            select: { id: true, name: true, price: true, images: true }
          }
        },
        orderBy: { order: 'asc' }
      });

      res.json({
        success: true,
        data: categories
      });
    } catch (error) {
      logger.error('Помилка отримання категорій:', error);
      res.status(500).json({
        success: false,
        message: 'Помилка сервера'
      });
    }
  },

  createCategory: async (req, res) => {
    try {
      const { name, slug } = req.body;

      if (!name || !slug) {
        return res.status(400).json({
          success: false,
          message: 'Назва та slug обов\'язкові'
        });
      }

      const existing = await prisma.category.findUnique({
        where: { slug }
      });

      if (existing) {
        return res.status(400).json({
          success: false,
          message: 'Категорія з таким slug вже існує'
        });
      }
      const maxOrder = await prisma.category.aggregate({
        _max: { order: true }
      });

      const category = await prisma.category.create({
        data: {
          name,
          slug,
          order: (maxOrder._max.order || 0) + 1
        }
      });

      logger.info('Створено категорію: ' + name);

      res.status(201).json({
        success: true,
        message: 'Категорію створено',
        data: category
      });
    } catch (error) {
      logger.error('Помилка створення категорії:', error);
      res.status(500).json({
        success: false,
        message: 'Помилка сервера'
      });
    }
  },

  updateCategory: async (req, res) => {
    try {
      const { id } = req.params;
      const { name, slug } = req.body;

      const existing = await prisma.category.findUnique({
        where: { id: parseInt(id) }
      });

      if (!existing) {
        return res.status(404).json({
          success: false,
          message: 'Категорію не знайдено'
        });
      }

      const category = await prisma.category.update({
        where: { id: parseInt(id) },
        data: {
          name,
          slug
        }
      });

      logger.info('Оновлено категорію #' + id + ': ' + name);

      res.json({
        success: true,
        message: 'Категорію оновлено',
        data: category
      });
    } catch (error) {
      logger.error('Помилка оновлення категорії:', error);
      res.status(500).json({
        success: false,
        message: 'Помилка сервера'
      });
    }
  },

  deleteCategory: async (req, res) => {
    try {
      const { id } = req.params;

      const productsCount = await prisma.product.count({
        where: { categoryId: parseInt(id) }
      });

      if (productsCount > 0) {
        return res.status(400).json({
          success: false,
          message: 'Не можна видалити категорію, в ній ' + productsCount + ' товарів'
        });
      }

      await prisma.category.delete({
        where: { id: parseInt(id) }
      });

      logger.info('Видалено категорію #' + id);

      res.json({
        success: true,
        message: 'Категорію видалено'
      });
    } catch (error) {
      logger.error('Помилка видалення категорії:', error);
      res.status(500).json({
        success: false,
        message: 'Помилка сервера'
      });
    }
  },
reorderCategories: async (req, res) => {
    try {
      const { categories } = req.body; // [{ id, order }, { id, order }, ...]

      if (!Array.isArray(categories)) {
        return res.status(400).json({
          success: false,
          message: 'Невірний формат даних'
        });
      }

      // Обновляем order для каждой категории
      const updates = categories.map((cat, index) =>
        prisma.category.update({
          where: { id: parseInt(cat.id) },
          data: { order: index }
        })
      );

      await prisma.$transaction(updates);

      logger.info('Порядок категорій оновлено');

      res.json({
        success: true,
        message: 'Порядок оновлено'
      });
    } catch (error) {
      logger.error('Помилка зміни порядку:', error);
      res.status(500).json({
        success: false,
        message: 'Помилка сервера'
      });
    }
  }
};

module.exports = categoryController;