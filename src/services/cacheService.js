const NodeCache = require('node-cache');
const logger = require('../utils/logger');

class CacheService {
  constructor() {
    this.cache = new NodeCache({ 
      stdTTL: 300, // 5 минут по умолчанию
      checkperiod: 60 // Проверка каждую минуту
    });
    
    logger.info('✅ Cache service initialized');
  }

  // Получить данные из кэша или выполнить функцию
  async getOrSet(key, fetchFunction, ttl = 300) {
    const cached = this.cache.get(key);
    if (cached) {
      logger.info(`📦 Cache HIT: ${key}`);
      return cached;
    }
    
    logger.info(`🔄 Cache MISS: ${key}`);
    const data = await fetchFunction();
    this.cache.set(key, data, ttl);
    return data;
  }

  // Инвалидировать кэш по ключу
  invalidate(key) {
    this.cache.del(key);
    logger.info(`🗑️  Cache invalidated: ${key}`);
  }

  // Инвалидировать все ключи по паттерну
  invalidatePattern(pattern) {
    const keys = this.cache.keys();
    const matchingKeys = keys.filter(key => key.includes(pattern));
    
    matchingKeys.forEach(key => {
      this.cache.del(key);
    });
    
    logger.info(`🗑️  Cache invalidated pattern: ${pattern} (${matchingKeys.length} keys)`);
  }

  // Статистика кэша
  getStats() {
    return this.cache.getStats();
  }
}

module.exports = new CacheService();