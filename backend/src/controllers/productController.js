const { prisma } = require('../utils/prisma');
const logger = require('../utils/logger');

const productController = {
  getProducts: async (req, res) => {
    try {
      console.log('📦 Getting products...');
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 12;
      const skip = (page - 1) * limit;

      const [products, total] = await Promise.all([
        prisma.product.findMany({
          include: { 
            category: {
              select: {
                id: true,
                name: true,
                slug: true
              }
            } 
          },
          where: { isActive: true },
          skip,
          take: limit,
          orderBy: { name: 'asc' }
        }),
        prisma.product.count({ where: { isActive: true } })
      ]);

      res.json({
        success: true,
        data: products,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
          hasNext: page * limit < total,
          hasPrev: page > 1
        }
      });
    } catch (error) {
      logger.error('Помилка отримання товарів:', error);
      res.status(500).json({
        success: false,
        message: 'Помилка сервера'
      });
    }
  },

  getProductById: async (req, res) => {
    try {
      const product = await prisma.product.findUnique({
        where: { id: parseInt(req.params.id) },
        include: { category: true }
      });

      if (!product) {
        return res.status(404).json({
          success: false,
          message: 'Товар не знайдено'
        });
      }

      res.json({
        success: true,
        data: product
      });
    } catch (error) {
      logger.error('Помилка отримання товару:', error);
      res.status(500).json({
        success: false,
        message: 'Помилка сервера'
      });
    }
  }
};

module.exports = productController;