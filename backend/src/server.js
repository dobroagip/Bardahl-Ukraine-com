const app = require('./app');
const { prisma } = require('./utils/prisma');
const logger = require('./utils/logger');

const PORT = process.env.PORT || 3000;

// Start server
const server = app.listen(PORT, async () => {
  logger.info(`🛒 Bardahl Ukraine Store запущен на http://localhost:${PORT}`);
  
  // Проверяем подключение к БД
  try {
    await prisma.$connect();
    const productCount = await prisma.product.count();
    const categoryCount = await prisma.category.count();
    logger.info(`✅ База данных подключена! Товаров: ${productCount}, Категорий: ${categoryCount}`);
  } catch (error) {
    logger.error(`⚠️ Ошибка подключения к базе: ${error.message}`);
  }
});

// Graceful shutdown
process.on('SIGINT', async () => {
  logger.info('🛑 Graceful shutdown...');
  await prisma.$disconnect();
  server.close(() => {
    logger.info('✅ Сервер остановлен');
    process.exit(0);
  });
});