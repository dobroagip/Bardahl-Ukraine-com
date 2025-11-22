const BaseRepository = require('./baseRepository');
const { prisma } = require('../utils/prisma');

class ProductRepository extends BaseRepository {
  constructor() {
    super(prisma.product);
  }

  async findActiveProducts(where = {}, options = {}) {
    const { include, ...restOptions } = options;

    return this.model.findMany({
      where: {
        ...where,
        isActive: true
      },
      include: include ?? {
        category: {
          select: {
            id: true,
            name: true,
            slug: true
          }
        }
      },
      ...restOptions
    });
  }

  async searchProducts(query, options = {}) {
    if (!query) {
      return [];
    }

    const { include, ...restOptions } = options;

    return this.model.findMany({
      where: {
        isActive: true,
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
          { description: { contains: query, mode: 'insensitive' } }
        ]
      },
      include: include ?? {
        category: {
          select: {
            id: true,
            name: true,
            slug: true
          }
        }
      },
      ...restOptions
    });
  }

  async updateStock(productId, quantity) {
    return this.model.update({
      where: {
        id: parseInt(productId, 10)
      },
      data: {
        stock: quantity
      }
    });
  }
}

module.exports = new ProductRepository();

