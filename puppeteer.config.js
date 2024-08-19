// puppeteer.config.cjs
const { join } = require('path');

module.exports = {
  cacheDirectory: join(__dirname, '.cache', 'puppeteer'), // Path ke cache browser Puppeteer
  executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || null, // Path ke executable browser, jika disediakan
};
