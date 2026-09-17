// tests/e2e/tier5-adversarial-stress.test.mjs
import {
  createPageSession,
  navigateToArtists,
  scrollToY,
  flingScroll,
  runTest,
  assert
} from './harness.mjs';

/**
 * Tier 5: Adversarial Stress Hardening Suite (12 Scenarios)
 */
export async function runTier5(browser, baseUrl, results) {
  console.log('\n=== TIER 5: ADVERSARIAL STRESS HARDENING (12 TESTS) ===');

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
    // FEATURE 1: ERRATIC FLING SPAM (>10,000px BURSTS) — 3 Tests
    // =========================================================================
    console.log('\n--- Feature 1: Erratic Fling Spam (>10,000px Bursts) ---');

    await runTest('T5.1.1', 'Massive 12,000px Downward Fling Burst', results, async () => {
      clearPageErrors();
      consoleErrors.length = 0;
      await flingScroll(page, 12000, 10, 10);
      await page.waitForTimeout(300);

      assert.equal(getPageErrors().length, 0, `Page errors: ${getPageErrors().map(e => e.message).join('; ')}`);
      const scrollY = await page.evaluate(() => window.scrollY);
      assert.ok(scrollY > 3000, `ScrollY should be deeply advanced, got: ${scrollY}`);
    });

    await runTest('T5.1.2', 'Alternating Directional Reversals (+10k / -10k)', results, async () => {
      clearPageErrors();
      consoleErrors.length = 0;
      for (let i = 0; i < 5; i++) {
        await flingScroll(page, -10000, 5, 5);
        await page.waitForTimeout(50);
        await flingScroll(page, 10000, 5, 5);
        await page.waitForTimeout(50);
      }
      await page.waitForTimeout(200);

      assert.equal(getPageErrors().length, 0, `Errors during violent reversal: ${getPageErrors().map(e => e.message).join('; ')}`);
      const docHeight = await page.evaluate(() => document.documentElement.scrollHeight);
      assert.ok(docHeight > 2000, `Doc height valid: ${docHeight}`);
    });

    await runTest('T5.1.3', 'High-Frequency Wheel Blast (100 Micro-Events)', results, async () => {
      clearPageErrors();
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
    // FEATURE 2: VIEWPORT THRASHING MIDWAY IN RECORDSRAIL — 3 Tests
    // =========================================================================
    console.log('\n--- Feature 2: Viewport Thrashing Midway In RecordsRail ---');

    await runTest('T5.2.1', 'Pin Midway Position Lock', results, async () => {
      clearPageErrors();
      const railPosition = await page.evaluate(() => {
        const h2 = Array.from(document.querySelectorAll('h2')).find(el => el.textContent.includes('THE RECORDS PEOPLE REPEAT'));
        if (!h2) return null;
        const rect = h2.getBoundingClientRect();
        return rect.top + window.scrollY;
      });
      assert.ok(railPosition !== null, 'RecordsRail header found in DOM');

      await scrollToY(page, railPosition + 400);
      await page.waitForTimeout(200);

      const trackState = await page.evaluate(() => {
        const track = document.querySelector('div.records-rail-track, div[class*="records-track"], div[class*="overflow-visible"]');
        return track ? window.getComputedStyle(track).transform : 'not-found';
      });
      assert.ok(trackState !== 'not-found', 'Records rail track exists and is active');
    });

    await runTest('T5.2.2', 'Extreme Viewport Cycling (320px to 2560px)', results, async () => {
      clearPageErrors();
      const testViewports = [
        { width: 320, height: 480 },
        { width: 2560, height: 1440 },
        { width: 375, height: 812 },
        { width: 1920, height: 1080 },
        { width: 320, height: 568 },
        { width: 1440, height: 900 },
      ];

      for (const vp of testViewports) {
        await page.setViewportSize(vp);
        await page.evaluate(() => window.dispatchEvent(new Event('resize')));
        await page.waitForTimeout(60);
      }
      await page.waitForTimeout(200);

      assert.equal(getPageErrors().length, 0, `Errors during extreme viewport cycling`);
    });

    await runTest('T5.2.3', 'Pin Spacer Integrity Post-Thrash', results, async () => {
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
    // FEATURE 3: DOM DEEP INSPECTION — 3 Tests
    // =========================================================================
    console.log('\n--- Feature 3: DOM Deep Inspection ---');

    await runTest('T5.3.1', 'Universal NaN Transform Scan Across All Elements', results, async () => {
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

    await runTest('T5.3.2', 'Horizontal Layout Spill & Unbounded Width Check', results, async () => {
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

    await runTest('T5.3.3', 'Image Element Bounding Box Integrity', results, async () => {
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
    // FEATURE 4: CONSOLE & ERROR AUDIT — 2 Tests
    // =========================================================================
    console.log('\n--- Feature 4: Console & Error Audit ---');

    await runTest('T5.4.1', 'Zero Unhandled Page Errors Across Full Session', results, async () => {
      const pageErrors = getPageErrors();
      assert.equal(pageErrors.length, 0, `Detected ${pageErrors.length} unhandled page errors: ${pageErrors.map(e => e.message).join(' | ')}`);
    });

    await runTest('T5.4.2', 'Zero Fatal Console Error Messages', results, async () => {
      const fatalErrors = consoleErrors.filter(msg => {
        return !msg.includes('favicon.ico') && !msg.includes('net::ERR_');
      });
      assert.equal(fatalErrors.length, 0, `Console error messages: ${fatalErrors.join(' | ')}`);
    });

    // =========================================================================
    // FEATURE 5: ROUTE INTERRUPTION MID-FLING — 1 Test
    // =========================================================================
    console.log('\n--- Feature 5: Route Interruption Mid-Fling ---');

    await runTest('T5.5.1', 'Violent Route Interruption Mid-Fling', results, async () => {
      clearPageErrors();
      const flingPromise = flingScroll(page, 8000, 10, 10);
      await page.waitForTimeout(30);
      await page.evaluate(() => {
        window.location.hash = '#contact';
      });
      await flingPromise;
      await page.waitForTimeout(200);

      await page.evaluate(() => {
        window.location.hash = '#artists';
      });
      await page.waitForTimeout(250);

      assert.equal(getPageErrors().length, 0, `Errors during violent route interruption`);
    });

  } finally {
    await session.context.close();
  }
}
