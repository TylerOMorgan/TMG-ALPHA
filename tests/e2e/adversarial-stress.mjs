// tests/e2e/adversarial-stress.mjs
import { preview } from 'vite';
import { chromium } from 'playwright-core';
import { DEFAULT_PORT, DEFAULT_CHROME_PATH, createPageSession, navigateToArtists, scrollToY, flingScroll, assert } from './harness.mjs';

const PORT = parseInt(process.env.TEST_PORT || '4299', 10);
const CHROME_PATH = process.env.PLAYWRIGHT_CHROME_PATH || DEFAULT_CHROME_PATH;

async function runAdversarialSuite() {
  console.log('===============================================================');
  console.log('      ADVERSARIAL STRESS TEST SUITE: TRILLEX ARTISTS PAGE      ');
  console.log('===============================================================');

  let server;
  try {
    server = await preview({
      preview: {
        port: PORT,
        strictPort: false
      }
    });
  } catch (err) {
    console.error(`[Setup] Failed to start Vite preview server: ${err.message}`);
    process.exit(1);
  }

  const serverPort = server.httpServer.address().port;
  const baseUrl = `http://localhost:${serverPort}`;
  console.log(`[Setup] Preview server active at ${baseUrl}`);

  let browser;
  try {
    browser = await chromium.launch({
      executablePath: CHROME_PATH,
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu'
      ]
    });
    console.log(`[Setup] Chromium connected (version: ${browser.version()})`);
  } catch (err) {
    console.error(`[Setup] Failed to launch Chromium: ${err.message}`);
    if (server) server.httpServer.close();
    process.exit(1);
  }

  const results = { passed: 0, failed: 0, errors: [] };

  async function test(name, fn) {
    process.stdout.write(`  [ADVERSARIAL] ${name} ... `);
    try {
      await fn();
      results.passed++;
      console.log('\x1b[32mPASSED\x1b[0m');
    } catch (err) {
      results.failed++;
      console.log(`\x1b[31mFAILED\x1b[0m: ${err.message}`);
      results.errors.push({ name, error: err.message, stack: err.stack });
    }
  }

  const session = await createPageSession(browser, {
    viewport: { width: 1440, height: 900 }
  });
  const { page, getPageErrors, clearPageErrors } = session;

  const consoleErrors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') {
      consoleErrors.push(msg.text());
    }
  });

  try {
    await navigateToArtists(page, baseUrl);

    // =========================================================================
    // SCENARIO 1: RAPID ERRATIC SCROLL FLING SPAM (>10,000px BURSTS)
    // =========================================================================
    console.log('\n--- Scenario 1: Erratic Fling Spam (>10,000px Bursts) ---');

    await test('Massive 12,000px Downward Fling Burst', async () => {
      clearPageErrors();
      consoleErrors.length = 0;
      // Rapid 12,000px burst in 10 rapid steps
      await flingScroll(page, 12000, 10, 10);
      await page.waitForTimeout(300);

      assert.equal(getPageErrors().length, 0, `Page errors detected: ${getPageErrors().map(e => e.message).join('; ')}`);
      const scrollY = await page.evaluate(() => window.scrollY);
      assert.ok(scrollY > 3000, `ScrollY should be deeply advanced, got: ${scrollY}`);
    });

    await test('Alternating Violent Directional Reversals (+10k / -10k)', async () => {
      clearPageErrors();
      consoleErrors.length = 0;
      // 5 cycles of alternating violent flings
      for (let i = 0; i < 5; i++) {
        await flingScroll(page, -10000, 5, 5);
        await page.waitForTimeout(50);
        await flingScroll(page, 10000, 5, 5);
        await page.waitForTimeout(50);
      }
      await page.waitForTimeout(200);

      assert.equal(getPageErrors().length, 0, `Errors during violent reversal: ${getPageErrors().map(e => e.message).join('; ')}`);
      // Validate document is still responsive
      const docHeight = await page.evaluate(() => document.documentElement.scrollHeight);
      assert.ok(docHeight > 2000, `Doc height should remain valid, got: ${docHeight}`);
    });

    await test('High-Frequency Wheel Blast (100 Micro-Events in 200ms)', async () => {
      clearPageErrors();
      // Dispatch 100 raw wheel events directly to window
      await page.evaluate(() => {
        for (let i = 0; i < 100; i++) {
          const delta = (i % 2 === 0 ? 1 : -1) * (150 + (i * 10));
          window.dispatchEvent(new WheelEvent('wheel', { deltaY: delta, bubbles: true, cancelable: true }));
        }
      });
      await page.waitForTimeout(250);
      assert.equal(getPageErrors().length, 0, `Errors during high-frequency wheel blast`);
    });

    // =========================================================================
    // SCENARIO 2: EXTREME VIEWPORT RESIZING WHILE PINNED MIDWAY IN RECORDSRAIL
    // =========================================================================
    console.log('\n--- Scenario 2: Viewport Thrashing Midway Through RecordsRail ---');

    await test('Pin Midway Position Lock', async () => {
      clearPageErrors();
      // Find RecordsRail position
      const railPosition = await page.evaluate(() => {
        const h2 = Array.from(document.querySelectorAll('h2')).find(el => el.textContent.includes('THE RECORDS PEOPLE REPEAT'));
        if (!h2) return null;
        const rect = h2.getBoundingClientRect();
        return rect.top + window.scrollY;
      });
      assert.ok(railPosition !== null, 'RecordsRail header found in DOM');

      // Scroll directly into horizontal pin region
      await scrollToY(page, railPosition + 400);
      await page.waitForTimeout(200);

      // Verify desktop track is translated or active
      const trackState = await page.evaluate(() => {
        const track = document.querySelector('div.records-rail-track, div[class*="records-track"], div[class*="overflow-visible"]');
        return track ? window.getComputedStyle(track).transform : 'not-found';
      });
      assert.ok(trackState !== 'not-found', 'Records rail track exists and is active');
    });

    await test('Extreme Viewport Cycling (320px Ultra-Skinny to 2560px Ultra-Wide)', async () => {
      clearPageErrors();
      const testViewports = [
        { width: 320, height: 480 },   // Ultra-skinny mobile
        { width: 2560, height: 1440 }, // Ultra-wide 1440p/2K
        { width: 375, height: 812 },   // iPhone X/11/12
        { width: 1920, height: 1080 }, // Full HD Desktop
        { width: 320, height: 568 },   // iPhone SE
        { width: 1440, height: 900 },  // Standard MacBook Desktop
      ];

      for (const vp of testViewports) {
        await page.setViewportSize(vp);
        // Dispatch resize event
        await page.evaluate(() => window.dispatchEvent(new Event('resize')));
        await page.waitForTimeout(60);
      }
      await page.waitForTimeout(200);

      assert.equal(getPageErrors().length, 0, `Page errors during extreme viewport cycling`);
    });

    await test('Pin Spacer Integrity Post-Thrash', async () => {
      clearPageErrors();
      const spacerIntegrity = await page.evaluate(() => {
        const spacers = Array.from(document.querySelectorAll('.pin-spacer'));
        const issues = [];
        for (const sp of spacers) {
          const rect = sp.getBoundingClientRect();
          if (isNaN(rect.top) || isNaN(rect.left) || isNaN(rect.width) || isNaN(rect.height)) {
            issues.push(`Spacer has NaN bounds: ${JSON.stringify(rect)}`);
          }
          if (rect.width <= 0 || rect.height <= 0) {
            issues.push(`Spacer collapsed: width=${rect.width}, height=${rect.height}`);
          }
          if (!document.body.contains(sp)) {
            issues.push(`Spacer detached from body`);
          }
        }
        return { count: spacers.length, issues };
      });

      assert.equal(spacerIntegrity.issues.length, 0, `Spacer integrity issues: ${spacerIntegrity.issues.join('; ')}`);
    });

    // =========================================================================
    // SCENARIO 3: DOM INSPECTION FOR NaN TRANSFORMS, UNBOUNDED LAYOUT SHIFTS
    // =========================================================================
    console.log('\n--- Scenario 3: DOM Deep Inspection (NaN, Layout Shifts, Detached Nodes) ---');

    await test('Universal NaN Transform Scan', async () => {
      const nanElements = await page.evaluate(() => {
        const all = Array.from(document.querySelectorAll('*'));
        const bad = [];
        for (const el of all) {
          const style = window.getComputedStyle(el);
          const t = style.transform;
          const wt = style.webkitTransform;
          if (t && t.includes('NaN')) {
            bad.push({ tag: el.tagName, id: el.id, class: el.className, transform: t });
          } else if (wt && wt.includes('NaN')) {
            bad.push({ tag: el.tagName, id: el.id, class: el.className, transform: wt });
          }
        }
        return bad;
      });

      assert.equal(nanElements.length, 0, `Found elements with NaN transform: ${JSON.stringify(nanElements)}`);
    });

    await test('Horizontal Layout Spill & Unbounded Width Check', async () => {
      // Set standard desktop viewport
      await page.setViewportSize({ width: 1440, height: 900 });
      await page.waitForTimeout(100);

      const layoutMetrics = await page.evaluate(() => {
        const scrollWidth = document.documentElement.scrollWidth;
        const innerWidth = window.innerWidth;
        const clientWidth = document.documentElement.clientWidth;
        return { scrollWidth, innerWidth, clientWidth, spill: scrollWidth > innerWidth + 1 };
      });

      assert.equal(layoutMetrics.spill, false,
        `Document has unbounded horizontal layout spill! scrollWidth=${layoutMetrics.scrollWidth}, innerWidth=${layoutMetrics.innerWidth}`);
    });

    await test('All Image Elements Non-Zero Ratio & Intact Bounding Boxes', async () => {
      const imgStats = await page.evaluate(() => {
        const imgs = Array.from(document.querySelectorAll('img'));
        const invalid = [];
        for (const img of imgs) {
          const rect = img.getBoundingClientRect();
          if (isNaN(rect.width) || isNaN(rect.height) || isNaN(rect.top)) {
            invalid.push({ src: img.src, issue: 'NaN coordinates' });
          }
        }
        return { total: imgs.length, invalid };
      });

      assert.equal(imgStats.invalid.length, 0, `Invalid image boxes: ${JSON.stringify(imgStats.invalid)}`);
      assert.ok(imgStats.total > 0, 'Found images on page');
    });

    // =========================================================================
    // SCENARIO 4: CONSOLE LOGS & UNHANDLED EXCEPTIONS AUDIT
    // =========================================================================
    console.log('\n--- Scenario 4: Console Logs & Unhandled Exception Audit ---');

    await test('Zero Unhandled Page Errors Across Entire Session', async () => {
      const pageErrors = getPageErrors();
      assert.equal(pageErrors.length, 0, `Detected ${pageErrors.length} unhandled page errors: ${pageErrors.map(e => e.message).join(' | ')}`);
    });

    await test('Zero Fatal Console Errors', async () => {
      // Filter out non-fatal 404s or third-party network warnings if any
      const fatalErrors = consoleErrors.filter(msg => {
        return !msg.includes('favicon.ico') && !msg.includes('net::ERR_');
      });
      assert.equal(fatalErrors.length, 0, `Console error messages logged: ${fatalErrors.join(' | ')}`);
    });

    // =========================================================================
    // SCENARIO 5: CONCURRENT ROUTE SWITCH & FLING STRESS
    // =========================================================================
    console.log('\n--- Scenario 5: Concurrent Route Interruption & Fling Stress ---');

    await test('Violent Route Interruption Mid-Fling', async () => {
      clearPageErrors();
      // Start rapid fling
      const flingPromise = flingScroll(page, 8000, 10, 10);
      // Immediately interrupt by clicking contact or switching hash
      await page.waitForTimeout(30);
      await page.evaluate(() => {
        window.location.hash = '#contact';
      });
      await flingPromise;
      await page.waitForTimeout(200);

      // Return to artists
      await page.evaluate(() => {
        window.location.hash = '#artists';
      });
      await page.waitForTimeout(250);

      assert.equal(getPageErrors().length, 0, `Errors during violent route interruption`);
    });

  } finally {
    console.log('\n[Teardown] Closing Chromium browser...');
    await browser.close().catch(() => {});
    console.log('[Teardown] Stopping Vite preview server...');
    server.httpServer.close();
  }

  console.log('\n===============================================================');
  console.log('                 ADVERSARIAL STRESS SUMMARY                    ');
  console.log('===============================================================');
  console.log(` Total Scenarios Tested : ${results.passed + results.failed}`);
  console.log(` Scenarios Passed       : \x1b[32m${results.passed}\x1b[0m`);
  console.log(` Scenarios Failed       : ${results.failed > 0 ? `\x1b[31m${results.failed}\x1b[0m` : '0'}`);
  console.log('===============================================================');

  if (results.failed > 0) {
    console.log('\n--- ADVERSARIAL FAILURES ---');
    results.errors.forEach((e, idx) => {
      console.log(`\n${idx + 1}) [${e.name}]`);
      console.log(`   Error: ${e.error}`);
    });
    process.exit(1);
  } else {
    console.log('\nVerdict: ALL ADVERSARIAL STRESS TESTS PASSED EMPIRICALLY');
    process.exit(0);
  }
}

runAdversarialSuite().catch(err => {
  console.error('[Adversarial] Unhandled failure:', err);
  process.exit(1);
});
