import { join } from 'path';

export default {
  // Ubah ke cache directory yang benar
  cacheDirectory: join(process.cwd(), '.cache', 'puppeteer'),
  executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || null, // Atur executable path jika diperlukan
};
