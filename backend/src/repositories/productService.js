const productRepository = require('../repositories/productRepository');
const cacheService = require('./cacheService');
const logger = require('../utils/logger');

class ProductService {
  async getProducts({ page = 1, limit = 12, category, search, sortBy = 'name' }) {
    const cacheKey = `products:page:${page}:limit:${limit}:category:${category}:search:${search}:sort:${sortBy}`;
    
    return cacheService.getOrSet(cacheKey, async () => {
      const skip = (page - 1) * limit;
      
      const where = {};
      if (category) where.category = { slug: category };
      
      const options = {
        skip,
        take: limit,
        orderBy: this.getSortOption(sortBy)
      };

      const [products, total] = await Promise.all([
        productRepository.findActiveProducts(where, options),
        productRepository.count({ ...where, isActive: true })
      ]);

      return {
        data: products,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
          hasNext: page * limit < total,
          hasPrev: page > 1
        }
      };
    }, 300); // Кэшируем на 5 минут
  }

  async getProductById(id) {
    const cacheKey = `product:${id}`;
    
    return cacheService.getOrSet(cacheKey, async () => {
      const product = await productRepository.findById(id, {
        category: {
          select: {
            id: true,
            name: true,
            slug: true
          }
        }
      });

      if (!product) {
        throw new Error('Product not found');
      }

      return product;
    }, 600); // Кэшируем на 10 минут
  }

  async searchProducts(query, options = {}) {
    const cacheKey = `products:search:${query}:${JSON.stringify(options)}`;
    
    return cacheService.getOrSet(cacheKey, async () => {
      return productRepository.searchProducts(query, options);
    }, 300);
  }

  async updateProductStock(productId, quantity) {
    // Инвалидируем кэш связанный с этим продуктом
    cacheService.invalidatePattern(`product:${productId}`);
    cacheService.invalidatePattern('products:');
    
    return productRepository.updateStock(productId, quantity);
  }

  getSortOption(sortBy) {
    const sortOptions = {
      'name': { name: 'asc' },
      'price': { price: 'asc' },
      'price-desc': { price: 'desc' },
      'newest': { createdAt: 'desc' }
    };
    
    return sortOptions[sortBy] || { name: 'asc' };
  }
}

module.exports = new ProductService();