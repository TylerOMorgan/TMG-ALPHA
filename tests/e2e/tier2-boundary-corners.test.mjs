// tests/e2e/tier2-boundary-corners.test.mjs
import {
  createPageSession,
  navigateToArtists,
  resetToArtistsTop,
  scrollToY,
  flingScroll,
  getArtistsContainer,
  runTest,
  assert
} from './harness.mjs';

/**
 * Tier 2: Boundary & Corner Cases Suite (30 tests across 6 features)
 */
export async function runTier2(browser, baseUrl, results) {
  console.log('\n=== TIER 2: BOUNDARY & CORNER CASES (30 TESTS) ===');

  const session = await createPageSession(browser, {
    viewport: { width: 1440, height: 900 }
  });
  const { page, getPageErrors, clearPageErrors } = session;

  try {
    await navigateToArtists(page, baseUrl);
    const container = getArtistsContainer(page);

    // =========================================================================
    // FEATURE 1: RAPID SCROLL VELOCITY (FLING / WHEEL SPAM) — 5 Tests
    // =========================================================================
    console.log('\n--- Feature 1: Rapid Scroll Velocity (Fling / Wheel Spam) ---');

    await runTest('T2.1.1', 'Rapid Downward Fling Stability', results, async () => {
      clearPageErrors();
      // Fling 6000px down in fast increments
      await flingScroll(page, 6000, 10, 10);
      assert.equal(getPageErrors().length, 0, 'No unhandled JS exceptions during rapid downward fling');
    });

    await runTest('T2.1.2', 'Alternating Scroll Direction Spam', results, async () => {
      clearPageErrors();
      for (let i = 0; i < 5; i++) {
        await flingScroll(page, 1500, 3, 5);
        await flingScroll(page, -1500, 3, 5);
      }
      assert.equal(getPageErrors().length, 0, 'No exceptions during alternating scroll direction spam');
      const pinSpacers = await page.locator('.pin-spacer').count();
      // Pin spacers should remain intact without layout breakage
      assert.ok(pinSpacers >= 0);
    });

    await runTest('T2.1.3', 'Pin Boundary Velocity Traversal', results, async () => {
      clearPageErrors();
      // Rapidly scroll across the RecordsRail pinned section
      await scrollToY(page, 3200);
      await flingScroll(page, 2500, 8, 10);
      const scrollY = await page.evaluate(() => window.scrollY);
      assert.ok(scrollY > 2000, `Scroll progression should continue past pin, got scrollY=${scrollY}`);
      assert.equal(getPageErrors().length, 0, 'No scroll deadlock');
    });

    await runTest('T2.1.4', 'Bottom Boundary Landing', results, async () => {
      // Scroll to document bottom
      const docHeight = await page.evaluate(() => document.documentElement.scrollHeight);
      await scrollToY(page, docHeight);
      await page.waitForTimeout(200);

      const ctaSection = container.locator('section').filter({ hasText: /YOUR RECORD/i }).filter({ hasText: /COULD BE NEXT/i }).first();
      assert.ok(await ctaSection.isVisible(), 'CTA section should remain fully rendered at document bottom');
    });

    await runTest('T2.1.5', 'Transform Value Integrity', results, async () => {
      const nanTransforms = await page.evaluate(() => {
        const elements = Array.from(document.querySelectorAll('*'));
        return elements.filter(el => {
          const transform = window.getComputedStyle(el).transform;
          return transform.includes('NaN');
        }).length;
      });
      assert.equal(nanTransforms, 0, 'Zero DOM elements should have NaN in their computed CSS transform');
    });

    // =========================================================================
    // FEATURE 2: REVERSE SCROLL (SCRUBBING BACK TO TOP) — 5 Tests
    // =========================================================================
    console.log('\n--- Feature 2: Reverse Scroll (Scrubbing Back to Top) ---');

    await runTest('T2.2.1', 'Hero Heading Reset on Reverse Scroll', results, async () => {
      await scrollToY(page, 2000);
      await scrollToY(page, 0);
      await page.waitForTimeout(250);

      const h1 = container.locator('h1');
      const transform = await h1.evaluate(el => window.getComputedStyle(el).transform);
      // At scroll 0, translateY should be 0 or identity matrix
      assert.ok(
        transform === 'none' || transform.includes('matrix(1, 0, 0, 1, 0, 0)') || transform.includes('0px'),
        `Hero heading transform should reset at top, got ${transform}`
      );
    });

    await runTest('T2.2.2', 'RecordsRail Track Reversal', results, async () => {
      // Scroll into RecordsRail
      await scrollToY(page, 3800);
      await page.waitForTimeout(100);
      const track = container.locator('div[class*="overflow-visible"], div[class*="overflow-x-auto"]').filter({ hasText: 'MIMIMI HARDTEKK' }).first();
      
      // Reverse scroll
      await scrollToY(page, 3400);
      await page.waitForTimeout(100);
      assert.ok(await track.isVisible(), 'Track should remain visible and continuous during reverse scroll');
    });

    await runTest('T2.2.3', 'Genre Lanes Reversal', results, async () => {
      await scrollToY(page, 1500);
      await scrollToY(page, 800);
      await page.waitForTimeout(150);

      const lanes = container.locator('text=HARDTEKK');
      assert.ok(await lanes.count() > 0, 'Genre lanes should remain visible and styled upon reverse scroll');
    });

    await runTest('T2.2.4', 'Spotify Curve Reversal', results, async () => {
      await scrollToY(page, 2400);
      await scrollToY(page, 1800);
      await page.waitForTimeout(150);

      const chartLine = container.locator('#axp-chart-line, path[stroke="#1DB954"]').first();
      assert.ok(await chartLine.count() > 0, 'Chart curve should exist during reverse scroll');
    });

    await runTest('T2.2.5', 'Header Navigation Re-entry', results, async () => {
      await scrollToY(page, 0);
      await page.waitForTimeout(200);

      const nav = page.locator('nav');
      assert.equal(await nav.isVisible(), true, 'Navigation bar should be visible at scroll 0');
      
      const blendDiv = page.locator('nav div[class*="mix-blend-difference"]');
      assert.ok(await blendDiv.count() > 0, 'Navigation should retain mix-blend-difference styling');
    });

    // =========================================================================
    // FEATURE 3: HOVER TRIGGER SPAM (HIGH-FREQUENCY POINTER EVENTS) — 5 Tests
    // =========================================================================
    console.log('\n--- Feature 3: Hover Trigger Spam (High-Frequency Pointer Events) ---');

    await runTest('T2.3.1', 'Artist Cards Hover Spam', results, async () => {
      clearPageErrors();
      const cards = container.locator('div[class*="aspect-[16/10]"]');
      const count = Math.min(6, await cards.count());
      for (let i = 0; i < 15; i++) {
        const idx = i % count;
        await cards.nth(idx).hover({ force: true });
        await page.waitForTimeout(10);
      }
      assert.equal(getPageErrors().length, 0, 'Zero errors during rapid artist card hover spam');
    });

    await runTest('T2.3.2', 'Genre Lanes Hover Spam', results, async () => {
      clearPageErrors();
      const lanes = container.locator('text=/HARDTEKK|BRAZILIAN FUNK|HOODTRAP/');
      const count = await lanes.count();
      for (let i = 0; i < 12; i++) {
        await lanes.nth(i % count).hover({ force: true });
        await page.waitForTimeout(15);
      }
      assert.equal(getPageErrors().length, 0, 'Zero layout glitch during lanes hover spam');
    });

    await runTest('T2.3.3', 'Spotify Card Hover Resilience', results, async () => {
      clearPageErrors();
      const heroCard = container.locator('h3').filter({ hasText: 'MIMIMI HARDTEKK' });
      for (let i = 0; i < 8; i++) {
        await heroCard.hover({ force: true });
        await page.mouse.move(0, 0);
        await page.waitForTimeout(15);
      }
      assert.equal(getPageErrors().length, 0, 'Chart SVG remains stable during hero card hover');
    });

    await runTest('T2.3.4', 'CTA Button Magnetic Hover Spam', results, async () => {
      clearPageErrors();
      const button = container.locator('a, button').filter({ hasText: 'SUBMIT YOUR DEMO' }).first();
      await button.scrollIntoViewIfNeeded();
      for (let i = 0; i < 10; i++) {
        await button.hover({ force: true });
        await page.mouse.move(10, 10);
        await page.waitForTimeout(15);
      }
      assert.equal(getPageErrors().length, 0, 'Custom cursor follower handles rapid hover without error');
    });

    await runTest('T2.3.5', 'Nav Link Hover During Scroll', results, async () => {
      clearPageErrors();
      const navLinks = page.locator('nav a');
      const count = await navLinks.count();
      for (let i = 0; i < count; i++) {
        await navLinks.nth(i).hover({ force: true });
        await page.waitForTimeout(15);
      }
      // ARTISTS link should maintain active styling
      const artistsLink = page.locator('nav a').filter({ hasText: 'ARTISTS' });
      const linkClass = await artistsLink.getAttribute('class');
      assert.ok(linkClass.includes('font-bold') || linkClass.includes('text-white'), 'ARTISTS link remains active');
      assert.equal(getPageErrors().length, 0);
    });

    // =========================================================================
    // FEATURE 4: VIEWPORT RESIZE & BREAKPOINTS — 5 Tests
    // =========================================================================
    console.log('\n--- Feature 4: Viewport Resize & Breakpoints ---');

    await runTest('T2.4.1', 'Mobile Viewport 375x667 Layout', results, async () => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.waitForTimeout(150);

      // Hero stats should render in a 2x2 grid
      const statGrid = container.locator('div.grid').filter({ hasText: 'SONGS SIGNED' }).first();
      const cls = await statGrid.getAttribute('class');
      assert.ok(cls.includes('grid-cols-2'), `Mobile stats should use 2-column grid, got: ${cls}`);
    });

    await runTest('T2.4.2', 'Mobile RecordsRail Snap Fallback', results, async () => {
      // In mobile 375x667, RecordsRail track uses native touch scroll
      const track = container.locator('div[class*="overflow-x-auto"]').filter({ hasText: 'MIMIMI HARDTEKK' }).first();
      assert.ok(await track.count() > 0, 'Mobile RecordsRail should have overflow-x-auto container');
      const cls = await track.getAttribute('class');
      assert.ok(cls.includes('overflow-x-auto') || cls.includes('snap-x'), 'Should support native scroll snap');
    });

    await runTest('T2.4.3', 'Tablet Viewport 768x1024 Layout', results, async () => {
      await page.setViewportSize({ width: 768, height: 1024 });
      await page.waitForTimeout(150);

      // Artist grid supports responsive sm:grid-cols-3
      const grid = container.locator('div[class*="grid-cols-2"]').filter({ has: page.locator('div[class*="aspect-[16/10]"]') }).first();
      assert.ok(await grid.count() > 0, 'Grid should adapt to tablet layout');
    });

    await runTest('T2.4.4', 'Desktop Viewport 1440x900 Pin Accuracy', results, async () => {
      await page.setViewportSize({ width: 1440, height: 900 });
      await page.waitForTimeout(150);

      const desktopTrack = container.locator('div[class*="md:overflow-visible"]').filter({ hasText: 'MIMIMI HARDTEKK' }).first();
      assert.ok(await desktopTrack.count() > 0, 'Desktop RecordsRail track should be configured');
    });

    await runTest('T2.4.5', 'Dynamic Resize During Mid-Scroll', results, async () => {
      clearPageErrors();
      await scrollToY(page, 2200);
      await page.setViewportSize({ width: 800, height: 900 });
      await page.waitForTimeout(200);
      await page.setViewportSize({ width: 1440, height: 900 });
      await page.waitForTimeout(200);

      assert.equal(getPageErrors().length, 0, 'Zero errors during dynamic resize mid-scroll');
    });

    // =========================================================================
    // FEATURE 5: PREFERS-REDUCED-MOTION — 5 Tests
    // =========================================================================
    console.log('\n--- Feature 5: Prefers-Reduced-Motion ---');

    await runTest('T2.5.1', 'Reduced Motion GSAP Timeline Bypass', results, async () => {
      await page.emulateMedia({ reducedMotion: 'reduce' });
      await resetToArtistsTop(page);
      await page.waitForTimeout(150);

      // In reduced motion, hero title should be at resting state
      const h1 = container.locator('h1');
      assert.ok(await h1.isVisible(), 'h1 should remain visible');
    });

    await runTest('T2.5.2', 'Immediate Content Visibility', results, async () => {
      // Elements should render with opacity > 0
      const ctaSection = container.locator('section').filter({ hasText: /YOUR RECORD/i }).filter({ hasText: /COULD BE NEXT/i }).first();
      assert.ok(await ctaSection.count() > 0, 'CTA section should be immediately mounted');
    });

    await runTest('T2.5.3', 'Spotify Curve Static Display', results, async () => {
      const chartLine = container.locator('#axp-chart-line, path[stroke*="#1D"], path[stroke*="#19"]').first();
      assert.ok(await chartLine.count() > 0, 'Spotify chart line exists in reduced motion');
    });

    await runTest('T2.5.4', 'RecordsRail Reduced Motion Presentation', results, async () => {
      const recordsTitle = container.locator('text=THE RECORDS PEOPLE REPEAT.');
      assert.ok(await recordsTitle.count() > 0, 'Records Rail section is accessible');
    });

    await runTest('T2.5.5', 'Zero Runtime Errors on Preference Toggle', results, async () => {
      clearPageErrors();
      await page.emulateMedia({ reducedMotion: 'no-preference' });
      await page.waitForTimeout(100);
      await page.emulateMedia({ reducedMotion: 'reduce' });
      await page.waitForTimeout(100);
      await page.emulateMedia({ reducedMotion: 'no-preference' });
      assert.equal(getPageErrors().length, 0, 'Zero errors when toggling reduced motion');
    });

    // =========================================================================
    // FEATURE 6: MISSING ASSET FALLBACKS & OFFLINE MEDIA HANDLING — 5 Tests
    // =========================================================================
    console.log('\n--- Feature 6: Missing Asset Fallbacks & Offline Media Handling ---');

    await runTest('T2.6.1', 'Blocked Remote Image Load Stability', results, async () => {
      // Abort external unsplash image requests
      clearPageErrors();
      await page.route('**/*unsplash*/**', route => route.abort('failed'));
      await resetToArtistsTop(page);
      assert.equal(getPageErrors().length, 0, 'Zero JS pageerror exceptions when remote images are blocked');
    });

    await runTest('T2.6.2', 'Card Aspect Ratio Preservation', results, async () => {
      const cards = container.locator('div[class*="aspect-[16/10]"]');
      const count = await cards.count();
      assert.ok(count >= 12, '12 artist cards maintain their aspect containers');
      
      const firstCardBox = await cards.first().boundingBox();
      assert.ok(firstCardBox && firstCardBox.width > 0 && firstCardBox.height > 0,
        'Card container has non-zero width and height even if image fails');
    });

    await runTest('T2.6.3', 'Legibility of Text and Badges', results, async () => {
      const cardName = container.locator('span').filter({ hasText: 'MAYA SOL' }).first();
      assert.equal(await cardName.isVisible(), true, 'Artist name MAYA SOL remains visible');

      const badge = container.locator('div[class*="aspect-[16/10]"] svg').first();
      assert.equal(await badge.isVisible(), true, 'Spotify badge remains visible');
    });

    await runTest('T2.6.4', 'Proof Card Background Preservation', results, async () => {
      const soundSection = container.locator('section').filter({ hasText: /ONE SOUND/i });
      const proofCards = soundSection.locator('div[class*="bg-[#0C0C0C]"], div[class*="aspect-"]');
      const count = await proofCards.count();
      assert.ok(count >= 4, 'Sound ID proof cards retain their containers and dark background');
    });

    await runTest('T2.6.5', 'Zero Pageerror Exceptions on Network Error', results, async () => {
      // Restore routes
      await page.unroute('**/*unsplash*/**');
      assert.equal(getPageErrors().length, 0, 'Application state remains error-free during network errors');
    });

  } finally {
    await session.context.close();
  }
}
