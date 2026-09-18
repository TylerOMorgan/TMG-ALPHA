// tests/e2e/test_4k.mjs
import { preview } from 'vite';
import { chromium } from 'playwright-core';
import { DEFAULT_CHROME_PATH, waitForPreloader } from './harness.mjs';

const PORT = 4599;
const CHROME_PATH = process.env.PLAYWRIGHT_CHROME_PATH || DEFAULT_CHROME_PATH;

async function check4K() {
  console.log('Testing 4K UHD (3840x2160)...');
  const server = await preview({
    preview: { port: PORT, strictPort: false }
  });
  const serverPort = server.httpServer.address().port;
  const baseUrl = `http://localhost:${serverPort}`;
  console.log(`Server at ${baseUrl}`);

  const browser = await chromium.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--disable-gpu']
  });

  const context = await browser.newContext({
    viewport: { width: 3840, height: 2160 }
  });
  const page = await context.newPage();

  page.on('response', resp => {
    if (resp.status() >= 400) {
      console.log(`HTTP Error Response: ${resp.status()} for ${resp.url()}`);
    }
  });

  const routes = ['#home', '#about', '#artists', '#contact'];
  for (const route of routes) {
    console.log(`Checking ${route} at 4K...`);
    const page = await context.newPage();
    await page.goto(`${baseUrl}/${route}`, { waitUntil: 'load' });
    await waitForPreloader(page, 5000);
    await page.waitForTimeout(1000);

    const check = await page.evaluate(() => {
      const docEl = document.documentElement;
      const body = document.body;
      return {
        docScrollWidth: docEl.scrollWidth,
        bodyScrollWidth: body.scrollWidth,
        innerWidth: window.innerWidth,
        docOverflow: docEl.scrollWidth > window.innerWidth,
        bodyOverflow: body.scrollWidth > window.innerWidth
      };
    });
    console.log(`Result for ${route}:`, check);
    await page.close();
  }

  await browser.close();
  await server.httpServer.close();
  console.log('Done 4K test!');
}

check4K().catch(err => {
  console.error('Error in 4K test:', err);
  process.exit(1);
});
