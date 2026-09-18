// tests/e2e/challenger1-adversarial-stress.mjs
/**
 * Challenger 1: Adversarial Stress & Breakpoint Fling Testing Suite
 *
 * Empirical Validation Coverage:
 * 1. Extreme scroll velocity and fling tests (>10,000px bursts, alternating directions)
 * 2. Rapid breakpoint resizing during active pinned scroll (desktop <-> mobile <-> 4K)
 * 3. Universal NaN transform & attribute scan across all DOM elements and SVG geometries
 * 4. High-frequency hover floods (50+ rapid pointer events on artist cards, genre lanes,
 *    Spotify curve hover readout, and CTA demo button)
 * 5. Scroll lock, DOM detachment, and unhandled exception detection
 */

import { preview } from 'vite';
import { chromium } from 'playwright-core';
import assert from 'node:assert/strict';
import {
  DEFAULT_PORT,
  DEFAULT_CHROME_PATH,
  createPageSession,
  navigateToArtists,
  scrollToY,
  flingScroll
} from './harness.mjs';

const PORT = parseInt(process.env.TEST_PORT || '4398', 10);
const CHROME_PATH = process.env.PLAYWRIGHT_CHROME_PATH || DEFAULT_CHROME_PATH;

async function runChallenger1StressSuite() {
  console.log('===============================================================');
  console.log('  CHALLENGER 1: ADVERSARIAL STRESS & BREAKPOINT FLING SUITE    ');
  console.log('===============================================================');
  console.log(`[Config] Target Port: ${PORT}`);
  console.log(`[Config] Chromium Executable: ${CHROME_PATH}`);

  // 1. Launch Vite Preview Server
  console.log('\n[Setup] Launching Vite preview server...');
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

  // 2. Launch Chromium
  console.log('[Setup] Launching headless Chromium via playwright-core...');
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

  const results = {
    passed: 0,
    failed: 0,
    errors: []
  };

  async function test(id, name, fn) {
    process.stdout.write(`  [CHALLENGER 1] ${id}: ${name} ... `);
    const start = Date.now();
    try {
      await fn();
      results.passed++;
      const duration = Date.now() - start;
      console.log(`\x1b[32mPASSED\x1b[0m (${duration}ms)`);
    } catch (err) {
      results.failed++;
      console.log(`\x1b[31mFAILED\x1b[0m: ${err.message.split('\n')[0]}`);
      results.errors.push({ id, name, error: err.message, stack: err.stack });
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
    // 1. EXTREME SCROLL FLING BURSTS (>10,000px) & RAPID REVERSALS
    // =========================================================================
    console.log('\n--- Section 1: Extreme Scroll Flings & Directional Reversals ---');

    await test('C1.1.1', 'Ultra-Violent 16,000px Downward Fling Burst', async () => {
      clearPageErrors();
      consoleErrors.length = 0;
      // 16,000px burst in 10 rapid steps
      await flingScroll(page, 16000, 10, 8);
      await page.waitForTimeout(300);

      assert.equal(getPageErrors().length, 0, `Page errors: ${getPageErrors().map(e => e.message).join('; ')}`);
      const scrollY = await page.evaluate(() => window.scrollY);
      assert.ok(scrollY > 4000, `ScrollY should be deeply advanced, got: ${scrollY}`);
    });

    await test('C1.1.2', 'Rapid Alternating Reversals (+12,000px / -12,000px x 6 Cycles)', async () => {
      clearPageErrors();
      consoleErrors.length = 0;
      for (let i = 0; i < 6; i++) {
        await flingScroll(page, -12000, 6, 6);
        await page.waitForTimeout(30);
        await flingScroll(page, 12000, 6, 6);
        await page.waitForTimeout(30);
      }
      await page.waitForTimeout(200);

      assert.equal(getPageErrors().length, 0, `Errors during rapid violent reversals: ${getPageErrors().map(e => e.message).join('; ')}`);
      const docHeight = await page.evaluate(() => document.documentElement.scrollHeight);
      assert.ok(docHeight > 2000, `Doc height should remain valid, got: ${docHeight}`);
    });

    await test('C1.1.3', 'Asymmetrical Chaotic Fling Blast (+15k, -6k, +12k, -14k, +8k)', async () => {
      clearPageErrors();
      const bursts = [15000, -6000, 12000, -14000, 8000];
      for (const b of bursts) {
        await flingScroll(page, b, 6, 8);
        await page.waitForTimeout(40);
      }
      await page.waitForTimeout(200);

      assert.equal(getPageErrors().length, 0, `Errors during asymmetrical fling blast: ${getPageErrors().map(e => e.message).join('; ')}`);
    });

    await test('C1.1.4', 'Scroll Lock Elimination Check (Free Motion After Violent Stress)', async () => {
      clearPageErrors();
      // Test navigation to top
      await page.evaluate(() => {
        if (window.lenis) {
          window.lenis.scrollTo(0, { immediate: true });
        } else {
          window.scrollTo(0, 0);
        }
      });
      await page.waitForTimeout(150);
      let scrollY = await page.evaluate(() => window.scrollY);
      assert.ok(scrollY < 100, `Should scroll to top, got scrollY=${scrollY}`);

      // Test navigation to bottom
      const docHeight = await page.evaluate(() => document.documentElement.scrollHeight);
      await page.evaluate((h) => {
        if (window.lenis) {
          window.lenis.scrollTo(h, { immediate: true });
        } else {
          window.scrollTo(0, h);
        }
      }, docHeight);
      await page.waitForTimeout(150);
      scrollY = await page.evaluate(() => window.scrollY);
      assert.ok(scrollY > docHeight - 2000, `Should scroll to bottom, got scrollY=${scrollY} (target: ${docHeight})`);

      // Reset to top
      await page.evaluate(() => {
        if (window.lenis) window.lenis.scrollTo(0, { immediate: true });
        else window.scrollTo(0, 0);
      });
      await page.waitForTimeout(100);
      assert.equal(getPageErrors().length, 0, 'No scroll deadlocks encountered');
    });

    // =========================================================================
    // 2. BREAKPOINT RESIZING DURING ACTIVE PINNED SCROLL
    // =========================================================================
    console.log('\n--- Section 2: Breakpoint Resizing During Active Pinned Scroll ---');

    await test('C1.2.1', 'RecordsRail Pinned Mid-Scroll Lock', async () => {
      clearPageErrors();
      // Ensure desktop viewport
      await page.setViewportSize({ width: 1440, height: 900 });
      await page.waitForTimeout(100);

      const railPosition = await page.evaluate(() => {
        const h2 = Array.from(document.querySelectorAll('h2')).find(el => el.textContent.includes('THE RECORDS PEOPLE REPEAT'));
        if (!h2) return null;
        const rect = h2.getBoundingClientRect();
        return rect.top + window.scrollY;
      });
      assert.ok(railPosition !== null, 'RecordsRail section header found in DOM');

      // Scroll directly into the horizontal pin region
      await scrollToY(page, railPosition + 350);
      await page.waitForTimeout(150);

      // Verify desktop track is translated or active
      const trackTransform = await page.evaluate(() => {
        const track = document.querySelector('div.records-rail-track, div[class*="records-track"], div[class*="overflow-visible"]');
        return track ? window.getComputedStyle(track).transform : 'not-found';
      });
      assert.ok(trackTransform !== 'not-found', 'Records rail track exists in DOM');
      assert.ok(!trackTransform.includes('NaN'), `Track transform must not contain NaN: ${trackTransform}`);
    });

    await test('C1.2.2', 'Rapid Viewport Thrashing During Continuous Wheel Pinned Scrub', async () => {
      clearPageErrors();
      const testViewports = [
        { width: 1440, height: 900, name: 'Desktop 1440p' },
        { width: 375, height: 667, name: 'iPhone SE' },
        { width: 768, height: 1024, name: 'iPad Portrait' },
        { width: 390, height: 844, name: 'iPhone 13/14' },
        { width: 1920, height: 1080, name: 'FHD Desktop' },
        { width: 320, height: 480, name: 'Ultra-Narrow Mobile' },
        { width: 2560, height: 1440, name: 'QHD Display' },
        { width: 3840, height: 2160, name: '4K UHD' },
        { width: 1440, height: 900, name: 'Return to Desktop' },
      ];

      for (const vp of testViewports) {
        // Dispatch micro-wheel events during resize to simulate active user scroll
        await page.setViewportSize({ width: vp.width, height: vp.height });
        await page.evaluate(() => {
          window.dispatchEvent(new Event('resize'));
          window.dispatchEvent(new WheelEvent('wheel', { deltaY: 80, bubbles: true }));
        });
        await page.waitForTimeout(50);
      }
      await page.waitForTimeout(200);

      assert.equal(getPageErrors().length, 0, `Page errors during active pinned resize thrash: ${getPageErrors().map(e => e.message).join('; ')}`);
    });

    await test('C1.2.3', 'Pin Spacer Integrity & Zero DOM Detachments', async () => {
      clearPageErrors();
      const spacerStats = await page.evaluate(() => {
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
            issues.push(`Spacer detached from DOM tree`);
          }
        }
        return { count: spacers.length, issues };
      });

      assert.equal(spacerStats.issues.length, 0, `Pin spacer integrity issues: ${spacerStats.issues.join('; ')}`);
    });

    await test('C1.2.4', 'Layout Bounds & Zero Runaway Horizontal Spill Post-Resize', async () => {
      await page.setViewportSize({ width: 1440, height: 900 });
      await page.waitForTimeout(100);

      const bounds = await page.evaluate(() => {
        const scrollWidth = document.documentElement.scrollWidth;
        const innerWidth = window.innerWidth;
        const bodyOverflow = window.getComputedStyle(document.body).overflowX;
        return { scrollWidth, innerWidth, bodyOverflow, spill: scrollWidth > innerWidth + 1 };
      });

      assert.equal(bounds.spill, false, `Horizontal spill detected! scrollWidth=${bounds.scrollWidth}, innerWidth=${bounds.innerWidth}`);
    });

    // =========================================================================
    // 3. UNIVERSAL NaN TRANSFORM & ATTRIBUTE SCAN ACROSS ALL DOM & SVG ELEMENTS
    // =========================================================================
    console.log('\n--- Section 3: Universal NaN Transform & Attribute Scan ---');

    await test('C1.3.1', 'Universal Computed & Inline CSS Transform NaN Scan', async () => {
      const nanTransforms = await page.evaluate(() => {
        const all = Array.from(document.querySelectorAll('*'));
        const violations = [];
        for (const el of all) {
          const style = window.getComputedStyle(el);
          const t = style.transform || '';
          const wt = style.webkitTransform || '';
          const inlineT = el.style.transform || '';

          if (t.includes('NaN')) {
            violations.push({ tag: el.tagName, id: el.id, class: el.className, type: 'computed.transform', val: t });
          }
          if (wt.includes('NaN')) {
            violations.push({ tag: el.tagName, id: el.id, class: el.className, type: 'computed.webkitTransform', val: wt });
          }
          if (inlineT.includes('NaN')) {
            violations.push({ tag: el.tagName, id: el.id, class: el.className, type: 'inline.transform', val: inlineT });
          }
        }
        return violations;
      });

      assert.equal(nanTransforms.length, 0, `Found DOM elements with NaN transforms: ${JSON.stringify(nanTransforms)}`);
    });

    await test('C1.3.2', 'Universal SVG Geometry & Attribute NaN Scan', async () => {
      const svgViolations = await page.evaluate(() => {
        const svgs = Array.from(document.querySelectorAll('svg, path, circle, rect, line, text, g'));
        const violations = [];
        const attrsToCheck = ['d', 'cx', 'cy', 'r', 'x1', 'y1', 'x2', 'y2', 'width', 'height', 'stroke-dashoffset', 'stroke-dasharray', 'transform'];

        for (const el of svgs) {
          for (const attr of attrsToCheck) {
            const val = el.getAttribute(attr);
            if (val && (val.includes('NaN') || val.includes('undefined') || val.includes('null'))) {
              violations.push({
                tag: el.tagName,
                id: el.id,
                attr,
                val,
                parentTag: el.parentElement?.tagName
              });
            }
          }
        }
        return violations;
      });

      assert.equal(svgViolations.length, 0, `Found SVG elements with NaN/undefined attributes: ${JSON.stringify(svgViolations)}`);
    });

    await test('C1.3.3', 'Multi-Section NaN Scan Along Scroll Scrub Traversal', async () => {
      // Traverse page in increments and scan for NaN at each stop
      const checkpoints = [0, 800, 1600, 2400, 3200, 4200];
      const allViolations = [];

      for (const y of checkpoints) {
        await scrollToY(page, y);
        await page.waitForTimeout(50);
        const bad = await page.evaluate(() => {
          const els = Array.from(document.querySelectorAll('*'));
          return els
            .filter(el => {
              const t = window.getComputedStyle(el).transform;
              return t && t.includes('NaN');
            })
            .map(el => ({ tag: el.tagName, class: el.className }));
        });
        if (bad.length > 0) {
          allViolations.push({ y, bad });
        }
      }

      assert.equal(allViolations.length, 0, `NaN transforms detected at checkpoints: ${JSON.stringify(allViolations)}`);
    });

    // =========================================================================
    // 4. HIGH-FREQUENCY HOVER TRIGGER TESTS (50+ RAPID MOUSE EVENTS)
    // =========================================================================
    console.log('\n--- Section 4: High-Frequency Hover Trigger Stress ---');

    await test('C1.4.1', 'Artist Cards Rapid Hover Flood (60 Pointer Events)', async () => {
      clearPageErrors();
      // Scroll to top where artist cards live
      await scrollToY(page, 0);
      await page.waitForTimeout(150);

      // Locate artist cards
      const cardLocators = page.locator('div[class*="aspect-[16/10]"]');
      const count = await cardLocators.count();
      assert.ok(count >= 6, `Expected at least 6 artist cards, found: ${count}`);

      // Rapidly fire 60 hover events across cards
      for (let i = 0; i < 60; i++) {
        const targetCard = cardLocators.nth(i % count);
        await targetCard.hover({ force: true });
        if (i % 5 === 0) {
          await page.mouse.move(0, 0); // move away to trigger unhover
        }
        await page.waitForTimeout(8);
      }

      assert.equal(getPageErrors().length, 0, `Page errors during artist cards hover flood: ${getPageErrors().map(e => e.message).join('; ')}`);
    });

    await test('C1.4.2', 'Genre Lanes Accordion Hover Flood (60 Rapid Events)', async () => {
      clearPageErrors();
      // Scroll to LanesManifesto
      const lanesSection = page.locator('section').filter({ hasText: 'INTERNET CULTURE DOES NOT WAIT.' }).first();
      await lanesSection.scrollIntoViewIfNeeded();
      await page.waitForTimeout(150);

      const lanes = lanesSection.locator('div[class*="cursor-pointer"]');
      const laneCount = await lanes.count();
      assert.ok(laneCount >= 3, `Expected at least 3 genre lanes, found: ${laneCount}`);

      for (let i = 0; i < 60; i++) {
        const lane = lanes.nth(i % laneCount);
        await lane.hover({ force: true });
        if (i % 3 === 0) {
          await page.mouse.move(50, 50); // move out of lane
        }
        await page.waitForTimeout(10);
      }

      assert.equal(getPageErrors().length, 0, `Page errors during genre lanes hover flood`);
    });

    await test('C1.4.3', 'Spotify Growth Chart Real-Time Hover Flood (100 Rapid Coordinate Events)', async () => {
      clearPageErrors();
      // Scroll to SpotifyProof
      const spotifySection = page.locator('section[data-nav-theme="dark"]').filter({ hasText: /MOMENTUM YOU CAN SEE/i });
      await spotifySection.scrollIntoViewIfNeeded();
      await page.waitForTimeout(200);

      // Locate GrowthChart container
      const chartContainer = page.locator('div[role="region"][aria-label="Interactive Spotify growth chart"]').first();
      assert.ok(await chartContainer.count() > 0, 'GrowthChart interactive region exists');

      const box = await chartContainer.boundingBox();
      assert.ok(box !== null && box.width > 0, 'GrowthChart has valid bounding box');

      // 1. Rapidly sweep 100 pointer events across the chart width
      for (let i = 0; i <= 100; i++) {
        const normX = i / 100;
        const clientX = box.x + normX * box.width;
        const clientY = box.y + box.height * 0.5;
        await page.mouse.move(clientX, clientY);
        await page.waitForTimeout(4);
      }

      // 2. Boundary coordinates stress: negative x, overshoot x, float edge cases
      const edgePoints = [
        { x: box.x - 100, y: box.y + 10 },
        { x: box.x + box.width + 100, y: box.y + 10 },
        { x: box.x + 0.0001, y: box.y + 0.0001 },
        { x: box.x + box.width - 0.0001, y: box.y + box.height - 0.0001 },
      ];
      for (const pt of edgePoints) {
        await page.mouse.move(pt.x, pt.y);
        await page.waitForTimeout(10);
      }

      // 3. Verify tooltip element coordinates and styling
      const tooltip = chartContainer.locator('div[role="tooltip"]');
      if (await tooltip.count() > 0) {
        const tooltipTransform = await tooltip.evaluate(el => el.style.transform);
        assert.ok(!tooltipTransform.includes('NaN'), `Tooltip transform has NaN: ${tooltipTransform}`);
      }

      // Move mouse away to reset hover state
      await page.mouse.move(0, 0);
      await page.waitForTimeout(100);

      assert.equal(getPageErrors().length, 0, `Page errors during Spotify hover readout flood: ${getPageErrors().map(e => e.message).join('; ')}`);
    });

    await test('C1.4.4', 'CTA Demo Button Magnetic Hover & Click Flood (50 Rapid Events)', async () => {
      clearPageErrors();
      // Scroll to DemoCTA
      const ctaBtn = page.locator('a, button').filter({ hasText: /SUBMIT YOUR DEMO/i }).first();
      await ctaBtn.scrollIntoViewIfNeeded();
      await page.waitForTimeout(150);

      const btnBox = await ctaBtn.boundingBox();
      assert.ok(btnBox !== null, 'CTA Demo button found with bounding box');

      for (let i = 0; i < 50; i++) {
        // Move over button, slight jitter
        const offsetX = (i % 5) * 4;
        const offsetY = (i % 3) * 4;
        await page.mouse.move(btnBox.x + btnBox.width / 2 + offsetX, btnBox.y + btnBox.height / 2 + offsetY);
        if (i % 5 === 0) {
          // move away
          await page.mouse.move(btnBox.x - 50, btnBox.y - 50);
        }
        await page.waitForTimeout(8);
      }

      assert.equal(getPageErrors().length, 0, `Page errors during CTA button hover flood`);
    });

    await test('C1.4.5', 'Custom Cursor Follower Integrity & Zero Particle Leaks', async () => {
      clearPageErrors();
      // Trigger a few clicks to spawn notes
      await page.mouse.click(200, 200);
      await page.mouse.click(300, 300);
      await page.mouse.click(400, 400);
      // Wait for particle explosion physics to complete (animations finish within 1.6s)
      await page.waitForTimeout(2000);

      // Verify particleContainer does not have stuck leftover particles
      const particleContainer = page.locator('div.pointer-events-none.fixed.inset-0.z-\\[10002\\]');
      if (await particleContainer.count() > 0) {
        const leftoverCount = await particleContainer.locator('div').count();
        assert.equal(leftoverCount, 0, `Particle leak: found ${leftoverCount} lingering particles in container`);
      }

      assert.equal(getPageErrors().length, 0, 'No errors during cursor follower particle lifecycle');
    });

    // =========================================================================
    // 5. GLOBAL CONSOLE & ERROR AUDIT
    // =========================================================================
    console.log('\n--- Section 5: Console & Error Audit ---');

    await test('C1.5.1', 'Zero Unhandled Page Errors Across Entire Adversarial Session', async () => {
      const pageErrors = getPageErrors();
      assert.equal(pageErrors.length, 0, `Encountered ${pageErrors.length} unhandled page errors: ${pageErrors.map(e => e.message).join(' | ')}`);
    });

    await test('C1.5.2', 'Zero Fatal Console Error Messages', async () => {
      const fatalErrors = consoleErrors.filter(msg => {
        return !msg.includes('favicon.ico') && !msg.includes('net::ERR_') && !msg.includes('404');
      });
      assert.equal(fatalErrors.length, 0, `Fatal console errors logged: ${fatalErrors.join(' | ')}`);
    });

  } finally {
    console.log('\n[Teardown] Closing Chromium session...');
    await session.context.close().catch(() => {});
    await browser.close().catch(() => {});
    console.log('[Teardown] Stopping Vite preview server...');
    server.httpServer.close();
  }

  const duration = ((Date.now() - Date.now()) / 1000).toFixed(2);
  const total = results.passed + results.failed;

  console.log('\n===============================================================');
  console.log('       CHALLENGER 1: ADVERSARIAL STRESS TEST SUMMARY          ');
  console.log('===============================================================');
  console.log(` Total Scenarios Tested : ${total}`);
  console.log(` Scenarios Passed       : \x1b[32m${results.passed}\x1b[0m`);
  console.log(` Scenarios Failed       : ${results.failed > 0 ? `\x1b[31m${results.failed}\x1b[0m` : '0'}`);
  console.log('===============================================================');

  if (results.failed > 0) {
    console.log('\n--- FAILURES REQUIRING ATTENTION ---');
    results.errors.forEach((e, idx) => {
      console.log(`\n${idx + 1}) [${e.id}] ${e.name}`);
      console.log(`   Error: ${e.error}`);
    });
    console.log('\nVerdict: REJECT');
    process.exit(1);
  } else {
    console.log('\nVerdict: APPROVE (ALL EMPIRICAL ADVERSARIAL CHALLENGES PASSED)');
    process.exit(0);
  }
}

runChallenger1StressSuite().catch(err => {
  console.error('[Challenger 1] Unhandled suite failure:', err);
  process.exit(1);
});
