const { prisma } = require('../utils/prisma');
const passwordUtils = require('../utils/password');
const jwtUtils = require('../utils/jwt');
const logger = require('../utils/logger');

const authController = {
  // Регистрация пользователя
  register: async (req, res) => {
    try {
      const { email, password, name } = req.body;

      // Валидация
      if (!email || !password || !name) {
        return res.status(400).json({
          success: false,
          message: "Всі поля обов'язкові: email, password, name"
        });
      }

      // Проверка существующего пользователя
      const existingUser = await prisma.user.findUnique({
        where: { email }
      });

      if (existingUser) {
        return res.status(409).json({
          success: false,
          message: 'Користувач з таким email вже існує'
        });
      }

      // Хеширование пароля и создание пользователя
      const hashedPassword = await passwordUtils.hash(password);
      
      const user = await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          name,
          // role по умолчанию CUSTOMER
        },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          createdAt: true
        }
      });

      // Создаем корзину для пользователя
      await prisma.cart.create({
        data: {
          userId: user.id
        }
      });

      // Генерация JWT токена
      const token = jwtUtils.generateToken({
        userId: user.id,
        email: user.email,
        role: user.role
      });

      logger.info(`Новий користувач зареєстрований: ${user.email}`);

      res.status(201).json({
        success: true,
        message: 'Користувач успішно зареєстрований',
        data: {
          user,
          token
        }
      });

    } catch (error) {
      logger.error('Помилка реєстрації:', error);
      res.status(500).json({
        success: false,
        message: 'Помилка сервера при реєстрації'
      });
    }
  },

  // Логин пользователя
  login: async (req, res) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({
          success: false,
          message: "Email та password обов'язкові"
        });
      }

      // Поиск пользователя
      const user = await prisma.user.findUnique({
        where: { email },
        select: {
          id: true,
          email: true,
          password: true,
          name: true,
          role: true,
          createdAt: true
        }
      });

      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Невірний email або password'
        });
      }

      // Проверка пароля
      const isPasswordValid = await passwordUtils.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({
          success: false,
          message: 'Невірний email або password'
        });
      }

      // Генерация токена
      const token = jwtUtils.generateToken({
        userId: user.id,
        email: user.email,
        role: user.role
      });

      // Убираем пароль из ответа
      const { password: _, ...userWithoutPassword } = user;

      logger.info(`Користувач увійшов в систему: ${user.email}`);

      res.json({
        success: true,
        message: 'Успішний вхід в систему',
        data: {
          user: userWithoutPassword,
          token
        }
      });

    } catch (error) {
      logger.error('Помилка входу:', error);
      res.status(500).json({
        success: false,
        message: 'Помилка сервера при вході'
      });
    }
  },

  // Получение профиля пользователя
  getProfile: async (req, res) => {
    try {
      const user = await prisma.user.findUnique({
        where: { id: req.user.userId },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          createdAt: true,
          updatedAt: true,
          addresses: true
        }
      });

      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'Користувач не знайдений'
        });
      }

      res.json({
        success: true,
        data: { user }
      });

    } catch (error) {
      logger.error('Помилка отримання профілю:', error);
      res.status(500).json({
        success: false,
        message: 'Помилка сервера'
      });
    }
  }
};

module.exports = authController;