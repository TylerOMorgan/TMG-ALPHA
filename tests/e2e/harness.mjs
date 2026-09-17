// tests/e2e/harness.mjs
import assert from 'node:assert/strict';

export const DEFAULT_PORT = 4199;
export const DEFAULT_CHROME_PATH = process.env.PLAYWRIGHT_CHROME_PATH ||
  '/home/tyler/.cache/ms-playwright/chromium-1243/chrome-linux64/chrome';

/**
 * Creates a configured browser context and page.
 */
export async function createPageSession(browser, options = {}) {
  const {
    viewport = { width: 1440, height: 900 },
    reducedMotion = 'no-preference', // 'reduce' | 'no-preference'
    blockImages = false,
    extraHttpHeaders = {}
  } = options;

  const context = await browser.newContext({
    viewport,
    reducedMotion,
    extraHttpHeaders,
    bypassCSP: true
  });

  const page = await context.newPage();
  const pageErrors = [];

  page.on('pageerror', (err) => {
    pageErrors.push(err);
  });

  if (blockImages) {
    await page.route('**/*.{png,jpg,jpeg,webp,svg,gif}', (route) => {
      // Abort external image downloads (especially unsplash)
      const url = route.request().url();
      if (url.includes('unsplash.com') || url.includes('images.unsplash')) {
        route.abort('failed');
      } else {
        route.continue();
      }
    });
  }

  return {
    context,
    page,
    getPageErrors: () => [...pageErrors],
    clearPageErrors: () => { pageErrors.length = 0; }
  };
}

/**
 * Waits for the initial Trillex preloader overlay to sweep away and detach.
 */
export async function waitForPreloader(page, timeout = 7000) {
  try {
    await page.waitForFunction(() => {
      const el = document.querySelector('div.fixed.inset-0.bg-trillex-black');
      return !el;
    }, { timeout });
  } catch (err) {
    // If it did not detach within timeout, log and continue
    console.warn(`[harness] Preloader wait warning: ${err.message}`);
  }
}

/**
 * Navigates to the #artists route and ensures page is loaded and ready.
 */
export async function navigateToArtists(page, baseUrl) {
  await page.goto(`${baseUrl}/#artists`);
  await waitForPreloader(page);
  // Ensure visible content container is mounted
  await page.locator('main').waitFor({ state: 'visible', timeout: 5000 });
}

/**
 * Returns the locator scoped to the currently active Artists page container.
 */
export function getArtistsContainer(page) {
  return page.locator('main > div:visible');
}

/**
 * Reset route to #artists and scroll to top without full reload.
 */
export async function resetToArtistsTop(page) {
  await page.evaluate(() => {
    window.location.hash = '#artists';
    if (window.lenis) {
      window.lenis.scrollTo(0, { immediate: true });
    }
    window.scrollTo(0, 0);
  });
  await page.waitForTimeout(100);
}

/**
 * Helper to scroll to a specific vertical coordinate.
 */
export async function scrollToY(page, y, immediate = true) {
  await page.evaluate(({ y, immediate }) => {
    if (window.lenis) {
      window.lenis.scrollTo(y, { immediate });
    } else {
      window.scrollTo(0, y);
    }
  }, { y, immediate });
  await page.waitForTimeout(immediate ? 80 : 250);
}

/**
 * Helper to simulate rapid fling scrolling.
 */
export async function flingScroll(page, deltaY, steps = 8, delayMs = 15) {
  const stepDelta = deltaY / steps;
  for (let i = 0; i < steps; i++) {
    await page.mouse.wheel(0, stepDelta);
    if (delayMs > 0) {
      await page.waitForTimeout(delayMs);
    }
  }
  await page.waitForTimeout(100);
}

/**
 * Standard test case wrapper that logs and aggregates result.
 */
export async function runTest(id, name, results, testFn) {
  process.stdout.write(`  [TEST] ${id}: ${name} ... `);
  try {
    await testFn();
    results.passed++;
    console.log('\x1b[32mPASSED\x1b[0m');
  } catch (err) {
    results.failed++;
    const errMsg = err.message.split('\n')[0];
    console.log(`\x1b[31mFAILED\x1b[0m: ${errMsg}`);
    results.errors.push({ id, name, error: err.message, stack: err.stack });
  }
}

export { assert };
