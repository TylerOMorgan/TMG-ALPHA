// tests/e2e/tier4-real-world.test.mjs
import {
  createPageSession,
  waitForPreloader,
  navigateToArtists,
  scrollToY,
  flingScroll,
  getArtistsContainer,
  runTest,
  assert
} from './harness.mjs';

/**
 * Tier 4: Real-World Scenarios (4 comprehensive user journeys)
 */
export async function runTier4(browser, baseUrl, results) {
  console.log('\n=== TIER 4: REAL-WORLD SCENARIOS (4 JOURNEYS) ===');

  // =========================================================================
  // T4.1: The Complete Prospective Artist Journey (Desktop 1920x1080)
  // =========================================================================
  await runTest('T4.1', 'The Complete Prospective Artist Journey (Desktop 1920x1080)', results, async () => {
    const session = await createPageSession(browser, {
      viewport: { width: 1920, height: 1080 }
    });
    const { page, getPageErrors } = session;

    try {
      // 1. Lands on #artists and waits for preloader
      await page.goto(`${baseUrl}/#artists`);
      await waitForPreloader(page);

      const container = getArtistsContainer(page);

      // 2. Inspects Hero and reads 4 stats
      const h1 = container.locator('h1');
      assert.equal(await h1.textContent(), 'ARTISTS');

      const stat900 = container.locator('text=900+');
      assert.ok(await stat900.isVisible(), 'Hero metric 900+ is visible');

      // 3. Hovers artist card
      const card = container.locator('div[class*="aspect-[16/10]"]').first();
      await card.hover({ force: true });
      await page.waitForTimeout(50);

      // 4. Scrolls through Lanes
      await scrollToY(page, 1400);
      const lanesTitle = container.locator('text=/INTERNET CULTURE DOES NOT WAIT/i');
      assert.ok(await lanesTitle.count() > 0, 'Lanes section visible during scroll');

      // 5. Scrolls through Spotify Proof
      await scrollToY(page, 2400);
      const spotifyTitle = container.locator('h2').filter({ hasText: /MOMENTUM/i }).filter({ hasText: /YOU CAN SEE/i });
      assert.ok(await spotifyTitle.count() > 0, 'Spotify section reached');

      // 6. Scrolls through Sound ID Proof
      await scrollToY(page, 3400);
      const soundTitle = container.locator('h2').filter({ hasText: /ONE SOUND/i }).filter({ hasText: /MILLIONS/i });
      assert.ok(await soundTitle.count() > 0, 'Sound ID section reached');

      // 7. Enters Records Rail
      await scrollToY(page, 4400);
      const recordsTitle = container.locator('h2').filter({ hasText: /THE RECORDS PEOPLE REPEAT/i });
      assert.ok(await recordsTitle.count() > 0, 'Records rail reached');

      // 8. Enters Work With Us
      await scrollToY(page, 5200);
      const workTitle = container.locator('h2').filter({ hasText: /MOVE FAST/i }).filter({ hasText: /COMMUNICATE/i });
      assert.ok(await workTitle.count() > 0, 'Work section reached');

      // 9. Clicks SUBMIT YOUR DEMO
      const ctaBtn = container.locator('a, button').filter({ hasText: 'SUBMIT YOUR DEMO' }).first();
      await ctaBtn.scrollIntoViewIfNeeded();
      await ctaBtn.click();
      await page.waitForTimeout(400);

      const hash = await page.evaluate(() => window.location.hash);
      assert.ok(hash.includes('demo'), 'Navigated to demo submission');

      assert.equal(getPageErrors().length, 0, 'Zero JS pageerrors throughout full journey');
    } finally {
      await session.context.close();
    }
  });

  // =========================================================================
  // T4.2: The Mobile Scout Touch Experience (Mobile 375x667)
  // =========================================================================
  await runTest('T4.2', 'The Mobile Scout Touch Experience (Mobile 375x667)', results, async () => {
    const session = await createPageSession(browser, {
      viewport: { width: 375, height: 667 },
      hasTouch: true
    });
    const { page, getPageErrors } = session;

    try {
      await page.goto(`${baseUrl}/#artists`);
      await waitForPreloader(page);

      const container = getArtistsContainer(page);

      // Hero title visible
      const h1 = container.locator('h1');
      assert.ok(await h1.isVisible());

      // 4 stats stack in 2x2 grid without horizontal document overflow
      const hasHorizontalScroll = await page.evaluate(() => {
        return document.documentElement.scrollWidth > window.innerWidth;
      });
      assert.equal(hasHorizontalScroll, false, 'No horizontal document overflow on mobile');

      // Swipes down to RecordsRail native snap container
      await scrollToY(page, 3000);
      const mobileTrack = container.locator('div[class*="overflow-x-auto"]').filter({ hasText: 'MIMIMI HARDTEKK' }).first();
      assert.ok(await mobileTrack.count() > 0, 'Mobile snap track present');

      // Scrolls to CTA and taps
      await scrollToY(page, 6000);
      const ctaBtn = container.locator('a, button').filter({ hasText: 'SUBMIT YOUR DEMO' }).first();
      await ctaBtn.click();
      await page.waitForTimeout(300);

      assert.equal(getPageErrors().length, 0, 'Zero errors during mobile journey');
    } finally {
      await session.context.close();
    }
  });

  // =========================================================================
  // T4.3: The Stress & Chaos Fast-Scroller
  // =========================================================================
  await runTest('T4.3', 'The Stress & Chaos Fast-Scroller', results, async () => {
    const session = await createPageSession(browser, {
      viewport: { width: 1440, height: 900 }
    });
    const { page, getPageErrors } = session;

    try {
      await navigateToArtists(page, baseUrl);

      // High-speed downward wheel fling
      await flingScroll(page, 8000, 10, 5);
      // Immediate reverse fling
      await flingScroll(page, -8000, 10, 5);
      // Alternating bursts
      for (let i = 0; i < 4; i++) {
        await flingScroll(page, 4000, 5, 5);
        await flingScroll(page, -4000, 5, 5);
      }

      // Dynamic resize mid-stress
      await page.setViewportSize({ width: 900, height: 700 });
      await page.waitForTimeout(100);
      await page.setViewportSize({ width: 1440, height: 900 });
      await page.waitForTimeout(100);

      // Verify page is still functional
      const h1 = page.locator('h1:visible');
      assert.ok(await h1.count() > 0, 'Page remains mounted after extreme stress scroll');
      assert.equal(getPageErrors().length, 0, 'Zero errors during stress scroll');
    } finally {
      await session.context.close();
    }
  });

  // =========================================================================
  // T4.4: The Resilient Offline / Low-Spec Experience
  // =========================================================================
  await runTest('T4.4', 'The Resilient Offline / Low-Spec Experience', results, async () => {
    const session = await createPageSession(browser, {
      viewport: { width: 1440, height: 900 },
      reducedMotion: 'reduce',
      blockImages: true
    });
    const { page, getPageErrors } = session;

    try {
      await page.goto(`${baseUrl}/#artists`);
      await waitForPreloader(page);

      const container = getArtistsContainer(page);

      // Text elements render immediately
      const h1 = container.locator('h1');
      assert.ok(await h1.isVisible());

      const stats = container.locator('text=900+');
      assert.ok(await stats.isVisible());

      // Keyboard navigation with Tab
      await page.keyboard.press('Tab');
      await page.keyboard.press('Tab');
      await page.waitForTimeout(50);

      // Check card containers maintain non-zero size without images
      const cards = container.locator('div[class*="aspect-[16/10]"]');
      const box = await cards.first().boundingBox();
      assert.ok(box && box.height > 50, 'Card height is maintained via aspect-ratio');

      assert.equal(getPageErrors().length, 0, 'Zero errors in offline reduced-motion mode');
    } finally {
      await session.context.close();
    }
  });
}
