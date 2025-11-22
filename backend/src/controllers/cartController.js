const { prisma } = require('../utils/prisma');
const logger = require('../utils/logger');

const cartController = {
  // Получить корзину пользователя
  getCart: async (req, res) => {
    try {
      let cart = await prisma.cart.findUnique({
        where: { userId: req.user.userId },
        include: {
          items: {
            include: {
              product: {
                select: {
                  id: true,
                  name: true,
                  price: true,
                  images: true,
                  stock: true
                }
              }
            }
          }
        }
      });

      // Если корзины нет - создаем
      if (!cart) {
        cart = await prisma.cart.create({
          data: {
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
                    images: true,
                    stock: true
                  }
                }
              }
            }
          }
        });
      }

      // Расчет общей суммы
      const total = cart.items.reduce((sum, item) => {
        return sum + (item.product.price * item.quantity);
      }, 0);

      res.json({
        success: true,
        data: { 
          cart: {
            ...cart,
            total
          }
        }
      });

    } catch (error) {
      logger.error('Помилка отримання кошика:', error);
      res.status(500).json({
        success: false,
        message: 'Помилка сервера'
      });
    }
  },

  // Добавить товар в корзину
  addToCart: async (req, res) => {
    try {
      const { productId, quantity = 1 } = req.body;

      if (!productId) {
        return res.status(400).json({
          success: false,
          message: "productId обов'язковий"
        });
      }

      // Проверяем существование товара
      const product = await prisma.product.findUnique({
        where: { id: parseInt(productId) }
      });

      if (!product) {
        return res.status(404).json({
          success: false,
          message: 'Товар не знайдено'
        });
      }

      // Находим или создаем корзину
      let cart = await prisma.cart.findUnique({
        where: { userId: req.user.userId },
        include: { items: true }
      });

      if (!cart) {
        cart = await prisma.cart.create({
          data: { userId: req.user.userId },
          include: { items: true }
        });
      }

      // Проверяем существующий товар в корзине
      const existingItem = cart.items.find(item => item.productId === parseInt(productId));

      if (existingItem) {
        // Обновляем количество
        await prisma.cartItem.update({
          where: { id: existingItem.id },
          data: { quantity: existingItem.quantity + quantity }
        });
      } else {
        // Добавляем новый товар
        await prisma.cartItem.create({
          data: {
            cartId: cart.id,
            productId: parseInt(productId),
            quantity
          }
        });
      }

      // Возвращаем обновленную корзину
      const updatedCart = await prisma.cart.findUnique({
        where: { userId: req.user.userId },
        include: {
          items: {
            include: {
              product: {
                select: {
                  id: true,
                  name: true,
                  price: true,
                  images: true,
                  stock: true
                }
              }
            }
          }
        }
      });

      const total = updatedCart.items.reduce((sum, item) => {
        return sum + (item.product.price * item.quantity);
      }, 0);

      logger.info(`Товар ${productId} додано до кошика користувача ${req.user.userId}`);

      res.json({
        success: true,
        message: 'Товар додано до кошика',
        data: { 
          cart: {
            ...updatedCart,
            total
          }
        }
      });

    } catch (error) {
      logger.error('Помилка додавання в кошик:', error);
      res.status(500).json({
        success: false,
        message: 'Помилка сервера'
      });
    }
  },

  // Удалить товар из корзины
  removeFromCart: async (req, res) => {
    try {
      const { itemId } = req.params;

      await prisma.cartItem.delete({
        where: { id: parseInt(itemId) }
      });

      // Возвращаем обновленную корзину
      const updatedCart = await prisma.cart.findUnique({
        where: { userId: req.user.userId },
        include: {
          items: {
            include: {
              product: {
                select: {
                  id: true,
                  name: true,
                  price: true,
                  images: true,
                  stock: true
                }
              }
            }
          }
        }
      });

      const total = updatedCart.items.reduce((sum, item) => {
        return sum + (item.product.price * item.quantity);
      }, 0);

      logger.info(`Товар видалено з кошика користувача ${req.user.userId}`);

      res.json({
        success: true,
        message: 'Товар видалено з кошика',
        data: { 
          cart: {
            ...updatedCart,
            total
          }
        }
      });

    } catch (error) {
      logger.error('Помилка видалення з кошика:', error);
      res.status(500).json({
        success: false,
        message: 'Помилка сервера'
      });
    }
  },

  // Обновить количество товара
  updateCartItem: async (req, res) => {
    try {
      const { itemId } = req.params;
      const { quantity } = req.body;

      if (quantity < 1) {
        return res.status(400).json({
          success: false,
          message: 'Кількість повинна бути не менше 1'
        });
      }

      await prisma.cartItem.update({
        where: { id: parseInt(itemId) },
        data: { quantity }
      });

      // Возвращаем обновленную корзину
      const updatedCart = await prisma.cart.findUnique({
        where: { userId: req.user.userId },
        include: {
          items: {
            include: {
              product: {
                select: {
                  id: true,
                  name: true,
                  price: true,
                  images: true,
                  stock: true
                }
              }
            }
          }
        }
      });

      const total = updatedCart.items.reduce((sum, item) => {
        return sum + (item.product.price * item.quantity);
      }, 0);

      res.json({
        success: true,
        message: 'Кількість оновлено',
        data: { 
          cart: {
            ...updatedCart,
            total
          }
        }
      });

    } catch (error) {
      logger.error('Помилка оновлення кошика:', error);
      res.status(500).json({
        success: false,
        message: 'Помилка сервера'
      });
    }
  },

  // Очистить корзину
  clearCart: async (req, res) => {
    try {
      const cart = await prisma.cart.findUnique({
        where: { userId: req.user.userId }
      });

      if (cart) {
        await prisma.cartItem.deleteMany({
          where: { cartId: cart.id }
        });
      }

      // Возвращаем обновленную корзину с пустыми items
      const updatedCart = await prisma.cart.findUnique({
        where: { userId: req.user.userId },
        include: {
          items: {
            include: {
              product: {
                select: {
                  id: true,
                  name: true,
                  price: true,
                  images: true,
                  stock: true
                }
              }
            }
          }
        }
      });

      res.json({
        success: true,
        message: 'Кошик очищено',
        data: { 
          cart: {
            ...updatedCart,
            total: 0
          }
        }
      });

    } catch (error) {
      logger.error('Помилка очищення кошика:', error);
      res.status(500).json({
        success: false,
        message: 'Помилка сервера'
      });
    }
  }
};

module.exports = cartController;
