const isProd = process.env.NODE_ENV === 'production';

const logger = {
  error: (...args) => {
    // In development log to console. In production this can be forwarded to external service.
    console.error(...args);
  },
  info: (...args) => {
    if (!isProd) console.info(...args);
  },
  debug: (...args) => {
    if (!isProd) console.debug(...args);
  }
};

export default logger;
