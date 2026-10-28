export const logger = {
  info: (msg, meta = '') => console.log(`\x1b[36m[INFO]\x1b[0m ${msg}`, meta),
  warn: (msg, meta = '') => console.warn(`\x1b[33m[WARN]\x1b[0m ${msg}`, meta),
  error: (msg, meta = '') => console.error(`\x1b[31m[ERROR]\x1b[0m ${msg}`, meta),
  success: (msg, meta = '') => console.log(`\x1b[32m[SUCCESS]\x1b[0m ${msg}`, meta),
};

export default logger;
