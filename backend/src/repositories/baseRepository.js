const logger = require('../utils/logger');

class BaseRepository {
  constructor(model) {
    this.model = model;
  }

  async findById(id, include = {}) {
    try {
      return await this.model.findUnique({
        where: { id: parseInt(id) },
        include
      });
    } catch (error) {
      logger.error(`Repository error in findById: ${error.message}`);
      throw error;
    }
  }

  async findMany(where = {}, include = {}, options = {}) {
    try {
      return await this.model.findMany({
        where,
        include,
        ...options
      });
    } catch (error) {
      logger.error(`Repository error in findMany: ${error.message}`);
      throw error;
    }
  }

  async count(where = {}) {
    try {
      return await this.model.count({ where });
    } catch (error) {
      logger.error(`Repository error in count: ${error.message}`);
      throw error;
    }
  }

  async create(data) {
    try {
      return await this.model.create({ data });
    } catch (error) {
      logger.error(`Repository error in create: ${error.message}`);
      throw error;
    }
  }

  async update(id, data) {
    try {
      return await this.model.update({
        where: { id: parseInt(id) },
        data
      });
    } catch (error) {
      logger.error(`Repository error in update: ${error.message}`);
      throw error;
    }
  }
}

module.exports = BaseRepository;