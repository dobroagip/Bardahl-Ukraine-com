const { prisma } = require('../utils/prisma');
const logger = require('../utils/logger');

const orderController = {
  // Создать заказ из корзины
  createOrder: async (req, res) => {
    try {
      const { addressId, notes } = req.body;

      // Получаем корзину пользователя
      const cart = await prisma.cart.findUnique({
        where: { userId: req.user.userId },
        include: {
          items: {
            include: {
              product: true
            }
          }
        }
      });

      if (!cart || cart.items.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'Кошик порожній'
        });
      }

      // Рассчитываем общую сумму
      const total = cart.items.reduce((sum, item) => {
        return sum + (item.product.price * item.quantity);
      }, 0);

      // Создаем заказ
      const order = await prisma.order.create({
        data: {
          userId: req.user.userId,
          total,
          addressId: addressId || null,
          items: {
            create: cart.items.map(item => ({
              productId: item.productId,
              quantity: item.quantity,
              price: item.product.price
            }))
          }
        },
        include: {
          items: {
            include: {
              product: {
                select: {
                  id: true,
                  name: true,
                  images: true
                }
              }
            }
          },
          address: true
        }
      });

      // Очищаем корзину после создания заказа
      await prisma.cartItem.deleteMany({
        where: { cartId: cart.id }
      });

      logger.info(`Створено нове замовлення #${order.id} для користувача ${req.user.userId}`);

      res.status(201).json({
        success: true,
        message: 'Замовлення успішно створено',
        data: { order }
      });

    } catch (error) {
      logger.error('Помилка створення замовлення:', error);
      res.status(500).json({
        success: false,
        message: 'Помилка сервера при створенні замовлення'
      });
    }
  },

  // Получить историю заказов пользователя
  getOrderHistory: async (req, res) => {
    try {
      const orders = await prisma.order.findMany({
        where: { userId: req.user.userId },
        include: {
          items: {
            include: {
              product: {
                select: {
                  id: true,
                  name: true,
                  images: true
                }
              }
            }
          },
          address: true
        },
        orderBy: {
          createdAt: 'desc'
        }
      });

      res.json({
        success: true,
        data: { orders }
      });

    } catch (error) {
      logger.error('Помилка отримання історії замовлень:', error);
      res.status(500).json({
        success: false,
        message: 'Помилка сервера'
      });
    }
  },

  // Получить детали заказа
  getOrderDetails: async (req, res) => {
    try {
      const { orderId } = req.params;

      const order = await prisma.order.findFirst({
        where: { 
          id: parseInt(orderId),
          userId: req.user.userId 
        },
        include: {
          items: {
            include: {
              product: {
                select: {
                  id: true,
                  name: true,
                  price: true,
                  images: true
                }
              }
            }
          },
          address: true
        }
      });

      if (!order) {
        return res.status(404).json({
          success: false,
          message: 'Замовлення не знайдено'
        });
      }

      res.json({
        success: true,
        data: { order }
      });

    } catch (error) {
      logger.error('Помилка отримання деталей замовлення:', error);
      res.status(500).json({
        success: false,
        message: 'Помилка сервера'
      });
    }
  },

  // Отменить заказ (только для статуса PENDING)
  cancelOrder: async (req, res) => {
    try {
      const { orderId } = req.params;

      const order = await prisma.order.findFirst({
        where: { 
          id: parseInt(orderId),
          userId: req.user.userId 
        }
      });

      if (!order) {
        return res.status(404).json({
          success: false,
          message: 'Замовлення не знайдено'
        });
      }

      if (order.status !== 'PENDING') {
        return res.status(400).json({
          success: false,
          message: 'Можна скасувати тільки замовлення зі статусом PENDING'
        });
      }

      const updatedOrder = await prisma.order.update({
        where: { id: parseInt(orderId) },
        data: { status: 'CANCELLED' }
      });

      logger.info(`Замовлення #${orderId} скасовано користувачем ${req.user.userId}`);

      res.json({
        success: true,
        message: 'Замовлення успішно скасовано',
        data: { order: updatedOrder }
      });

    } catch (error) {
      logger.error('Помилка скасування замовлення:', error);
      res.status(500).json({
        success: false,
        message: 'Помилка сервера'
      });
    }
  }
};

module.exports = orderController;