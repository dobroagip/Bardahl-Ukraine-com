const bcrypt = require('bcryptjs');

const passwordUtils = {
  hash: async (password) => {
    return await bcrypt.hash(password, 12);
  },
  
  compare: async (password, hashedPassword) => {
    return await bcrypt.compare(password, hashedPassword);
  }
};

module.exports = passwordUtils;