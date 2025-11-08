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
        orderBy: { name: 'asc' }
      });

      res.json({
        success: true,
        data: categories
      });
    } catch (error) {
      logger.error('Ошибка получения категорий:', error);
      res.status(500).json({
        success: false,
        error: 'Ошибка сервера'
      });
    }
  }
};

module.exports = categoryController;