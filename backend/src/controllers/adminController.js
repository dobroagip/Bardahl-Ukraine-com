const { prisma } = require('../utils/prisma');
const logger = require('../utils/logger');

const adminController = {
  // Получить статистику магазина - УПРОЩЕННАЯ ВЕРСИЯ
  getDashboardStats: async (req, res) => {
    try {
      logger.info('Получение статистики дашборда...');

      // Общая статистика - простые запросы
      const [totalProducts, totalOrders, totalUsers] = await Promise.all([
        prisma.product.count(),
        prisma.order.count(),
        prisma.user.count()
      ]);
      
      // Статистика за сегодня
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const todayOrders = await prisma.order.count({
        where: {
          createdAt: {
            gte: today
          }
        }
      });

      // УПРОЩАЕМ расчет дохода - берем все заказы кроме CANCELLED
      const completedOrders = await prisma.order.findMany({
        where: {
          status: {
            not: 'CANCELLED'
          }
        },
        select: {
          total: true
        }
      });

      // Ручной расчет суммы
      const totalRevenue = completedOrders.reduce((sum, order) => sum + order.total, 0);

      logger.info(`Статистика получена: ${totalProducts} товаров, ${totalOrders} заказов`);

      res.json({
        success: true,
        data: {
          stats: {
            totalProducts,
            totalOrders,
            totalUsers,
            todayOrders,
            totalRevenue: Math.round(totalRevenue * 100) / 100 // округляем до 2 знаков
          }
        }
      });

    } catch (error) {
      logger.error('Ошибка получения статистики:', error);
      console.error('Детали ошибки:', error.message);
      res.status(500).json({
        success: false,
        message: 'Ошибка сервера при получении статистики',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  },

  // Остальные методы остаются без изменений...
  getAllOrders: async (req, res) => {
    try {
      const { page = 1, limit = 10, status } = req.query;
      const skip = (page - 1) * limit;

      const where = {};
      if (status && status !== 'ALL') {
        where.status = status;
      }

      const orders = await prisma.order.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              email: true,
              name: true
            }
          },
          items: {
            include: {
              product: {
                select: {
                  id: true,
                  name: true,
                  price: true
                }
              }
            }
          },
          address: true
        },
        orderBy: {
          createdAt: 'desc'
        },
        skip,
        take: parseInt(limit)
      });

      const totalOrders = await prisma.order.count({ where });

      res.json({
        success: true,
        data: {
          orders,
          pagination: {
            currentPage: parseInt(page),
            totalPages: Math.ceil(totalOrders / limit),
            totalOrders,
            hasNext: page * limit < totalOrders,
            hasPrev: page > 1
          }
        }
      });

    } catch (error) {
      logger.error('Ошибка получения заказов:', error);
      res.status(500).json({
        success: false,
        message: 'Ошибка сервера'
      });
    }
  },

  // Обновить статус заказа
  updateOrderStatus: async (req, res) => {
    try {
      const { orderId } = req.params;
      const { status } = req.body;

      const validStatuses = ['PENDING', 'CONFIRMED', 'SHIPPED', 'DELIVERED', 'CANCELLED'];
      
      if (!validStatuses.includes(status)) {
        return res.status(400).json({
          success: false,
          message: 'Неверный статус заказа'
        });
      }

      const order = await prisma.order.findUnique({
        where: { id: parseInt(orderId) }
      });

      if (!order) {
        return res.status(404).json({
          success: false,
          message: 'Заказ не найден'
        });
      }

      const updatedOrder = await prisma.order.update({
        where: { id: parseInt(orderId) },
        data: { status },
        include: {
          user: {
            select: {
              id: true,
              email: true,
              name: true
            }
          },
          items: {
            include: {
              product: {
                select: {
                  id: true,
                  name: true
                }
              }
            }
          }
        }
      });

      logger.info(`Статус заказа #${orderId} изменен на ${status} администратором`);

      res.json({
        success: true,
        message: 'Статус заказа обновлен',
        data: { order: updatedOrder }
      });

    } catch (error) {
      logger.error('Ошибка обновления статуса заказа:', error);
      res.status(500).json({
        success: false,
        message: 'Ошибка сервера'
      });
    }
  },

  getAllUsers: async (req, res) => {
    try {
      const { page = 1, limit = 10 } = req.query;
      const skip = (page - 1) * limit;

      const users = await prisma.user.findMany({
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          createdAt: true,
          _count: {
            select: {
              orders: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        },
        skip,
        take: parseInt(limit)
      });

      const totalUsers = await prisma.user.count();

      res.json({
        success: true,
        data: {
          users,
          pagination: {
            currentPage: parseInt(page),
            totalPages: Math.ceil(totalUsers / limit),
            totalUsers,
            hasNext: page * limit < totalUsers,
            hasPrev: page > 1
          }
        }
      });

    } catch (error) {
      logger.error('Ошибка получения пользователей:', error);
      res.status(500).json({
        success: false,
        message: 'Ошибка сервера'
      });
    }
  },

  createProduct: async (req, res) => {
    try {
      const { name, description, price, stock, categoryId, images } = req.body;

      const product = await prisma.product.create({
        data: {
          name,
          description,
          price: parseFloat(price),
          stock: parseInt(stock),
          categoryId: parseInt(categoryId),
          images: images || []
        },
        include: {
          category: true
        }
      });

      logger.info(`Создан новый товар: ${name}`);

      res.status(201).json({
        success: true,
        message: 'Товар успешно создан',
        data: { product }
      });

    } catch (error) {
      logger.error('Ошибка создания товара:', error);
      res.status(500).json({
        success: false,
        message: 'Ошибка сервера'
      });
    }
  },

  updateProduct: async (req, res) => {
    try {
      const { productId } = req.params;
      const { name, description, price, stock, categoryId, images, isActive } = req.body;

      const product = await prisma.product.update({
        where: { id: parseInt(productId) },
        data: {
          ...(name && { name }),
          ...(description && { description }),
          ...(price && { price: parseFloat(price) }),
          ...(stock && { stock: parseInt(stock) }),
          ...(categoryId && { categoryId: parseInt(categoryId) }),
          ...(images && { images }),
          ...(isActive !== undefined && { isActive })
        },
        include: {
          category: true
        }
      });

      logger.info(`Товар #${productId} обновлен`);

      res.json({
        success: true,
        message: 'Товар успешно обновлен',
        data: { product }
      });

    } catch (error) {
      logger.error('Ошибка обновления товара:', error);
      res.status(500).json({
        success: false,
        message: 'Ошибка сервера'
      });
    }
  }
};

module.exports = adminController;