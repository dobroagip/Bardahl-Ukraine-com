const { verifyToken } = require('../utils/jwt');
const logger = require('../utils/logger');

const authMiddleware = {
  // ВРЕМЕННАЯ ЗАГЛУШКА - для разработки
  authenticate: (req, res, next) => {
    // Автоматически "авторизуем" тестового пользователя
    req.user = { 
      userId: 1, 
      email: 'test@bardahl.ua', 
      role: 'CUSTOMER'
    };
    logger.info(`Auto-auth user: ${req.user.email}`);
    next();
  },

  // Для админских routes - устанавливаем роль ADMIN
  requireAdmin: (req, res, next) => {
    // Автоматически "авторизуем" админа
    req.user = { 
      userId: 1, 
      email: 'admin@bardahl.ua', 
      role: 'ADMIN'  // ← ВАЖНО: устанавливаем роль ADMIN
    };
    logger.info(`Auto-auth admin: ${req.user.email}`);
    next();
  }
};

module.exports = authMiddleware;