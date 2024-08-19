// puppeteer.config.mjs
import { join } from 'path';

export default {
  cacheDirectory: join(import.meta.url, '..', '..', '.cache', 'puppeteer'),
  executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || null,
};
