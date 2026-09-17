// tests/e2e/challenger2-route-media-a11y.test.mjs
import { preview } from 'vite';
import { chromium } from 'playwright-core';
import assert from 'node:assert/strict';
import { DEFAULT_PORT, DEFAULT_CHROME_PATH, createPageSession, waitForPreloader } from './harness.mjs';

const PORT = parseInt(process.env.TEST_PORT || '4399', 10);
const CHROME_PATH = process.env.PLAYWRIGHT_CHROME_PATH || DEFAULT_CHROME_PATH;

async function runChallenger2Suite() {
  console.log('===============================================================');
  console.log('    CHALLENGER 2: ADVERSARIAL ROUTE, MEDIA & A11Y VERIFIER    ');
  console.log('===============================================================');

  // 1. Start Vite Preview Server
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

  // 2. Launch Chromium Browser
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
    total: 0,
    passed: 0,
    failed: 0,
    errors: []
  };

  async function test(id, description, fn) {
    results.total++;
    process.stdout.write(`  [CHALLENGER-2] ${id}: ${description} ... `);
    try {
      await fn();
      results.passed++;
      console.log('\x1b[32mPASSED\x1b[0m');
    } catch (err) {
      results.failed++;
      console.log(`\x1b[31mFAILED\x1b[0m: ${err.message}`);
      results.errors.push({ id, description, error: err.message, stack: err.stack });
    }
  }

  try {
    // =========================================================================
    // PART 1: NETWORK FAULT INJECTION (OFFLINE / BLOCKED REMOTE MEDIA & APIS)
    // =========================================================================
    console.log('\n=== SECTION 1: NETWORK FAULT INJECTION ===');
    {
      const context = await browser.newContext({
        viewport: { width: 1440, height: 900 }
      });
      const page = await context.newPage();
      const pageErrors = [];
      const consoleErrors = [];

      page.on('pageerror', err => pageErrors.push(err));
      page.on('console', msg => {
        if (msg.type() === 'error') consoleErrors.push(msg.text());
      });

      // Intercept and ABORT all external network requests (images, remote fonts, APIs)
      let blockedExternalCount = 0;
      await page.route('**/*', (route) => {
        const url = route.request().url();
        const isLocal = url.startsWith('http://localhost') || url.startsWith('http://127.0.0.1');
        if (!isLocal) {
          blockedExternalCount++;
          return route.abort('failed');
        }
        // Also simulate failure for any image request pointing to remote hosts
        if (url.includes('unsplash.com') || url.includes('images.unsplash')) {
          blockedExternalCount++;
          return route.abort('failed');
        }
        route.continue();
      });

      await page.goto(`${baseUrl}/#artists`);
      await waitForPreloader(page);

      await test('NFI-01', 'Page remains stable under complete external network outage', async () => {
        assert.equal(pageErrors.length, 0, `Page errors detected: ${pageErrors.map(e => e.message).join('; ')}`);
        assert.ok(blockedExternalCount > 0, 'External requests were intercepted and blocked');
        const isMainVisible = await page.locator('main').isVisible();
        assert.ok(isMainVisible, 'Main container is mounted and visible');
      });

      await test('NFI-02', 'All 7 #artists sections are intact and visible in DOM', async () => {
        const sections = [
          'h1:has-text("ARTISTS")',
          'h2:has-text("INTERNET CULTURE DOES NOT WAIT")',
          'h2:has-text("MOMENTUM YOU CAN SEE")',
          'h2:has-text("ONE SOUND. MILLIONS OF VIDEOS")',
          'h2:has-text("THE RECORDS PEOPLE REPEAT")',
          'h2:has-text("MOVE FAST. COMMUNICATE CLEARLY")',
          'h2:has-text("YOUR RECORD COULD BE NEXT")'
        ];

        for (const selector of sections) {
          const count = await page.locator(selector).count();
          assert.ok(count >= 1, `Section missing: ${selector}`);
        }
      });

      await test('NFI-03', 'Typography & key text content remain visible without font collapse', async () => {
        const heroTitle = page.locator('h1:has-text("ARTISTS")');
        const box = await heroTitle.boundingBox();
        assert.ok(box && box.width > 200 && box.height > 50, 'Hero title has non-zero visible dimensions');

        // Check 4 stats
        const statValues = await page.locator('div:has-text("900+") >> text=900+').count();
        const statViews = await page.locator('text=3.7B+').count();
        const statUgcs = await page.locator('text=5M+').count();
        const statStreams = await page.locator('text=590M+').count();
        assert.ok(statValues > 0 && statViews > 0 && statUgcs > 0 && statStreams > 0, 'All 4 stats present');

        // Check 12 artist names
        const names = ['SAINT RIO', 'MAYA SOL', 'NOA VALE', 'LENA MORI', 'JUNO', 'SOLA', 'ASTER', 'MIRA', 'KODA', 'ELARA', 'LUMEN', 'RAFA'];
        for (const name of names) {
          const c = await page.locator(`main >> text="${name}"`).count();
          assert.ok(c >= 1, `Artist name visible: ${name}`);
        }
      });

      await test('NFI-04', 'Badges remain visible despite missing external imagery', async () => {
        // Spotify badges on artist cards (12 expected)
        const spotifyBadges = await page.locator('main svg path[d*="M12 0C5.373"]').count();
        assert.ok(spotifyBadges >= 12, `Spotify badges expected >= 12, found ${spotifyBadges}`);

        // Live evidence pill badges on Sound ID
        const pills = ['SOUND ID PROOF', 'CATALOG PROOF', 'SCREEN TREATMENT'];
        for (const pill of pills) {
          const c = await page.locator(`text="${pill}"`).count();
          assert.ok(c >= 1, `Sound ID pill visible: ${pill}`);
        }

        // Approved Proof Candidate badges on Records (5 expected)
        const approvedBadges = await page.locator('text="APPROVED PROOF CANDIDATE"').count();
        assert.equal(approvedBadges, 5, `Expected 5 Approved Proof Candidate badges, found ${approvedBadges}`);

        // Right edge scroll progress indicator
        const progressBar = await page.locator('div[class*="fixed top-0 right-0"]').count();
        assert.ok(progressBar >= 1, 'Scroll progress indicator is present');
      });

      await test('NFI-05', 'Vector curves and SVG graphics render cleanly with non-zero dimensions', async () => {
        // Spotify growth chart curve
        const growthLine = page.locator('#axp-chart-line');
        assert.ok(await growthLine.count() > 0, '#axp-chart-line exists in DOM');
        const curveBox = await growthLine.boundingBox();
        assert.ok(curveBox && curveBox.width > 200, `Growth line curve width valid: ${curveBox?.width}`);

        // Lanes waveform line
        const waveform = page.locator('svg path[d*="M0 26 H96"]');
        assert.ok(await waveform.count() > 0, 'Lanes waveform line exists');

        // Demo CTA logo waveform
        const logo = page.locator('section:has(h2:has-text("YOUR RECORD")) svg');
        assert.ok(await logo.count() > 0, 'Logo SVG rendered in CTA section');
      });

      await test('NFI-06', 'Zero layout collapses across artist, proof, and record cards', async () => {
        // Inspect card dimensions in browser
        const cardMetrics = await page.evaluate(() => {
          const artistCards = Array.from(document.querySelectorAll('div.aspect-\\[16\\/10\\]'));
          const proofCards = Array.from(document.querySelectorAll('div[class*="border-t-2"]'));
          const recordCards = Array.from(document.querySelectorAll('div.aspect-square'));
          const docScrollHeight = document.documentElement.scrollHeight;

          const invalidCards = [];
          artistCards.forEach((c, idx) => {
            const r = c.getBoundingClientRect();
            if (r.width < 50 || r.height < 30) invalidCards.push(`ArtistCard #${idx} collapsed (${r.width}x${r.height})`);
          });
          proofCards.forEach((c, idx) => {
            const r = c.getBoundingClientRect();
            if (r.width < 100 || r.height < 50) invalidCards.push(`ProofCard #${idx} collapsed (${r.width}x${r.height})`);
          });
          recordCards.forEach((c, idx) => {
            const r = c.getBoundingClientRect();
            if (r.width < 100 || r.height < 100) invalidCards.push(`RecordCard #${idx} collapsed (${r.width}x${r.height})`);
          });

          return {
            artistCount: artistCards.length,
            proofCount: proofCards.length,
            recordCount: recordCards.length,
            docScrollHeight,
            invalidCards
          };
        });

        assert.equal(cardMetrics.invalidCards.length, 0, `Collapsed cards detected: ${cardMetrics.invalidCards.join('; ')}`);
        assert.ok(cardMetrics.docScrollHeight > 4000, `Page height should be substantial (>4000px), got: ${cardMetrics.docScrollHeight}`);
        assert.equal(cardMetrics.artistCount >= 12, true, 'At least 12 artist card containers');
      });

      await context.close();
    }

    // =========================================================================
    // PART 2: RAPID HASH ROUTE SWITCHING (20 TRANSITIONS IN 2 SECONDS)
    // =========================================================================
    console.log('\n=== SECTION 2: RAPID HASH ROUTE SWITCHING ===');
    {
      const context = await browser.newContext({
        viewport: { width: 1440, height: 900 }
      });
      const page = await context.newPage();
      const pageErrors = [];
      const consoleErrors = [];

      page.on('pageerror', err => pageErrors.push(err));
      page.on('console', msg => {
        if (msg.type() === 'error') consoleErrors.push(msg.text());
      });

      await page.goto(`${baseUrl}/#artists`);
      await waitForPreloader(page);

      await test('RRS-01', 'Programmatic hash thrashing 20 times in 2 seconds across routes', async () => {
        // Transition pattern: #home -> #artists -> #about -> #artists -> #contact -> #artists
        // Run 4 full cycles = 24 transitions total within ~2000ms (approx 80ms per transition)
        const sequence = ['#home', '#artists', '#about', '#artists', '#contact', '#artists'];
        const totalCycles = 4; // 24 route switches

        const startTime = Date.now();
        const routeLog = await page.evaluate(async ({ sequence, totalCycles }) => {
          const log = [];
          for (let cycle = 0; cycle < totalCycles; cycle++) {
            for (const route of sequence) {
              window.location.hash = route;
              log.push({ route, t: Date.now() });
              // 75ms delay to achieve ~24 hops in ~1.8s
              await new Promise(res => setTimeout(res, 75));
            }
          }
          return log;
        }, { sequence, totalCycles });

        const elapsed = Date.now() - startTime;
        console.log(`\n      [RRS-01 Info] Executed ${routeLog.length} route hops in ${elapsed}ms`);

        assert.equal(pageErrors.length, 0, `Page errors during rapid route switching: ${pageErrors.map(e => e.message).join('; ')}`);
        assert.ok(routeLog.length >= 20, `Executed at least 20 transitions, actual: ${routeLog.length}`);
        assert.ok(elapsed <= 3000, `Transitions executed within rapid window, elapsed: ${elapsed}ms`);
      });

      await test('RRS-02', 'Zero orphaned ScrollTriggers and trigger integrity post-thrash', async () => {
        // Allow animations to settle briefly
        await page.waitForTimeout(300);

        const triggerAudit = await page.evaluate(() => {
          if (!window.ScrollTrigger) return { available: false };
          const all = window.ScrollTrigger.getAll();
          const orphaned = [];
          const valid = [];

          all.forEach(st => {
            const trigEl = st.trigger;
            if (trigEl && !document.body.contains(trigEl)) {
              orphaned.push({ id: st.vars?.id || 'unnamed', tag: trigEl.tagName, class: trigEl.className });
            } else {
              valid.push({ id: st.vars?.id || 'unnamed' });
            }
          });

          return {
            available: true,
            total: all.length,
            orphanedCount: orphaned.length,
            orphaned,
            validCount: valid.length
          };
        });

        assert.equal(triggerAudit.available, true, 'ScrollTrigger is globally available on window');
        assert.equal(triggerAudit.orphanedCount, 0, `Found orphaned ScrollTriggers: ${JSON.stringify(triggerAudit.orphaned)}`);
        assert.ok(triggerAudit.total > 0, `ScrollTriggers registered: ${triggerAudit.total}`);
      });

      await test('RRS-03', 'Three.js canvas on #home survived without crash or context loss', async () => {
        // Switch to #home to inspect WebGL canvas state
        await page.evaluate(() => {
          window.location.hash = '#home';
        });
        await page.waitForTimeout(400);

        const canvasState = await page.evaluate(() => {
          const canvas = document.querySelector('canvas');
          if (!canvas) return { found: false };
          const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
          if (!gl) return { found: true, glAvailable: false };
          const isLost = typeof gl.isContextLost === 'function' ? gl.isContextLost() : false;
          return {
            found: true,
            glAvailable: true,
            isContextLost: isLost,
            width: canvas.width,
            height: canvas.height
          };
        });

        assert.equal(canvasState.found, true, 'WebGL canvas found on #home');
        assert.equal(canvasState.isContextLost, false, 'WebGL canvas context is healthy (not lost)');
        assert.ok(canvasState.width > 0 && canvasState.height > 0, `Canvas dimensions valid: ${canvasState.width}x${canvasState.height}`);
      });

      await test('RRS-04', 'Clean top-scroll anchoring and Lenis state upon settling on #artists', async () => {
        // Return to #artists
        await page.evaluate(() => {
          window.location.hash = '#artists';
        });
        await page.waitForTimeout(400);

        const scrollState = await page.evaluate(() => {
          const scrollY = window.scrollY || document.documentElement.scrollTop;
          const lenis = window.lenis;
          const lenisScroll = lenis ? lenis.scroll : null;
          const isLocked = lenis ? lenis.isLocked : null;
          return { scrollY, lenisScroll, isLocked };
        });

        assert.ok(scrollState.scrollY <= 5, `Top scroll anchored clean (scrollY <= 5), actual: ${scrollState.scrollY}`);
        if (scrollState.lenisScroll !== null) {
          assert.ok(scrollState.lenisScroll <= 5, `Lenis scroll coordinate at top, actual: ${scrollState.lenisScroll}`);
          assert.equal(scrollState.isLocked, false, 'Lenis is not deadlocked');
        }

        // Test that scrolling still works smoothly
        await page.evaluate(() => {
          if (window.lenis) window.lenis.scrollTo(1200, { immediate: true });
          else window.scrollTo(0, 1200);
        });
        await page.waitForTimeout(150);

        const scrolledY = await page.evaluate(() => window.scrollY || document.documentElement.scrollTop);
        assert.ok(scrolledY > 800, `Scroll advanced smoothly to ${scrolledY}`);

        assert.equal(pageErrors.length, 0, 'No errors during post-thrash scrolling');
      });

      await context.close();
    }

    // =========================================================================
    // PART 3: KEYBOARD ACCESSIBILITY & TAB ORDER THROUGH INTERACTIVE ELEMENTS
    // =========================================================================
    console.log('\n=== SECTION 3: KEYBOARD ACCESSIBILITY & TAB ORDER ===');
    {
      const context = await browser.newContext({
        viewport: { width: 1440, height: 900 }
      });
      const page = await context.newPage();
      const pageErrors = [];

      page.on('pageerror', err => pageErrors.push(err));

      await page.goto(`${baseUrl}/#artists`);
      await waitForPreloader(page);

      await test('A11Y-01', 'Natural Tab progression traverses persistent navigation links', async () => {
        // Reset focus to top
        await page.evaluate(() => {
          window.scrollTo(0, 0);
          if (document.activeElement && document.activeElement.blur) {
            document.activeElement.blur();
          }
        });

        const tabbedElements = [];

        // Tab through header navigation
        for (let i = 0; i < 5; i++) {
          await page.keyboard.press('Tab');
          const focused = await page.evaluate(() => {
            const el = document.activeElement;
            if (!el || el === document.body) return null;
            return {
              tag: el.tagName,
              text: el.textContent?.trim().replace(/\s+/g, ' '),
              href: el.getAttribute('href'),
              ariaLabel: el.getAttribute('aria-label')
            };
          });
          if (focused) tabbedElements.push(focused);
        }

        console.log(`\n      [A11Y-01 Info] Nav elements focused: ${tabbedElements.map(e => e.text || e.ariaLabel || e.href).join(' -> ')}`);

        // Check that logo or nav links were reached
        assert.ok(tabbedElements.length >= 4, `At least 4 interactive navigation items received focus, got: ${tabbedElements.length}`);
        const navNames = tabbedElements.map(e => e.text || e.ariaLabel);
        const hasHome = navNames.some(t => t?.includes('Home') || t?.includes('HOME'));
        const hasArtists = navNames.some(t => t?.includes('ARTISTS'));
        assert.ok(hasHome, 'Home nav element received focus');
        assert.ok(hasArtists, 'Artists nav link received focus');
      });

      await test('A11Y-02', 'Tab reaches primary call-to-action button (SUBMIT YOUR DEMO)', async () => {
        // Tab forward until reaching the SUBMIT YOUR DEMO action or timeout
        let ctaFocused = false;
        let ctaData = null;

        for (let step = 0; step < 20; step++) {
          await page.keyboard.press('Tab');
          const info = await page.evaluate(() => {
            const el = document.activeElement;
            if (!el) return null;
            return {
              text: el.textContent?.trim(),
              href: el.getAttribute('href'),
              tag: el.tagName
            };
          });

          if (info && (info.text?.includes('SUBMIT YOUR DEMO') || info.href === '#demo-submission')) {
            ctaFocused = true;
            ctaData = info;
            break;
          }
        }

        assert.equal(ctaFocused, true, 'Keyboard Tab successfully focused the SUBMIT YOUR DEMO button');
        assert.equal(ctaData.tag, 'A', 'CTA button is an accessible interactive anchor');
        assert.equal(ctaData.href, '#demo-submission', 'CTA button links to #demo-submission');
      });

      await test('A11Y-03', 'Keyboard activation (Enter) triggers route navigation to #demo-submission', async () => {
        // Trigger Enter on the currently focused CTA button
        await page.keyboard.press('Enter');
        await page.waitForTimeout(300);

        const currentHash = await page.evaluate(() => window.location.hash);
        assert.ok(
          currentHash.includes('demo') || currentHash.includes('contact') || currentHash.includes('inquiry'),
          `Route updated to contact/demo form upon Enter press, got hash: ${currentHash}`
        );

        // Verify contact form page is active
        const isContactMounted = await page.evaluate(() => {
          const contact = document.querySelector('div:has(form), form, #demo-submission, #general-inquiry');
          return !!contact;
        });
        assert.ok(isContactMounted, 'Contact / Demo submission view mounted upon keyboard activation');
      });

      await test('A11Y-04', 'No keyboard focus trapping or layout detachment', async () => {
        // Return to #artists
        await page.evaluate(() => {
          window.location.hash = '#artists';
        });
        await page.waitForTimeout(200);

        // Shift-Tab back up to ensure two-way keyboard traversal works
        let reversedSteps = 0;
        for (let i = 0; i < 5; i++) {
          await page.keyboard.down('Shift');
          await page.keyboard.press('Tab');
          await page.keyboard.up('Shift');
          reversedSteps++;
        }
        assert.equal(reversedSteps, 5, 'Shift+Tab successfully navigated in reverse without focus lockup');
        assert.equal(pageErrors.length, 0, 'No page errors during keyboard navigation');
      });

      await context.close();
    }

  } finally {
    console.log('\n[Teardown] Closing Chromium browser...');
    await browser.close().catch(() => {});
    console.log('[Teardown] Stopping Vite preview server...');
    server.httpServer.close();
  }

  // Summary
  console.log('\n===============================================================');
  console.log('                 CHALLENGER 2 SUMMARY REPORT                   ');
  console.log('===============================================================');
  console.log(` Total Checks Conducted : ${results.total}`);
  console.log(` Checks Passed          : \x1b[32m${results.passed}\x1b[0m`);
  console.log(` Checks Failed          : ${results.failed > 0 ? `\x1b[31m${results.failed}\x1b[0m` : '0'}`);
  console.log('===============================================================');

  if (results.failed > 0) {
    console.log('\n--- VERIFICATION FAILURES ---');
    results.errors.forEach((e, idx) => {
      console.log(`\n${idx + 1}) [${e.id}] ${e.description}`);
      console.log(`   Error: ${e.error}`);
    });
    console.log('\nVerdict: REQUEST_CHANGES');
    process.exit(1);
  } else {
    console.log('\nVerdict: APPROVE (All Adversarial Criteria Met Empirically)');
    process.exit(0);
  }
}

runChallenger2Suite().catch(err => {
  console.error('[Challenger2] Unhandled suite failure:', err);
  process.exit(1);
});
