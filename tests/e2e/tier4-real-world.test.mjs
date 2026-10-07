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
 * Tier 4: Real-World Scenarios (4 journeys and 5 touch viewport checks)
 */
export async function runTier4(browser, baseUrl, results) {
  console.log('\n=== TIER 4: REAL-WORLD SCENARIOS (4 JOURNEYS + 5 TOUCH VIEWPORTS) ===');

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

      const statGrid = container.locator('div.grid').filter({ hasText: 'SONGS SIGNED' }).first();
      await page.waitForFunction(el => {
        const expected = ['962', '4.2B+', '7M+', '700M+'];
        return [...el.children].every((card, index) => card.children[1].textContent.trim() === expected[index]);
      }, await statGrid.elementHandle(), { timeout: 8000 });
      const vals = await statGrid.evaluate(el => [...el.children].map(c => c.children[1].textContent.trim()));
      assert.deepEqual(vals, ['962', '4.2B+', '7M+', '700M+']);

      // 3. Hovers an artist card currently inside the viewport
      // (the marquee translates cells, so the first cell may sit off-canvas)
      const cells = container.locator('div[class*="aspect-square"]');
      let hovered = false;
      for (let i = 0; i < 16 && !hovered; i++) {
        const box = await cells.nth(i).boundingBox();
        if (box && box.x >= 0 && box.x + box.width <= 1920) {
          await cells.nth(i).hover({ force: true });
          hovered = true;
        }
      }
      assert.ok(hovered, 'Hovered an in-view artist card');
      await page.waitForTimeout(50);

      // 4. Scrolls through the record selector strip
      await scrollToY(page, 1400);
      const stripLabel = container.locator('text=SELECT RECORD');
      assert.ok(await stripLabel.count() > 0, 'Record strip visible during scroll');

      // 5. Scrolls through Spotify Proof
      await scrollToY(page, 2400);
      const spotifyTitle = container.locator('h2').filter({ hasText: /MOMENTUM/i }).filter({ hasText: /YOU CAN SEE/i });
      assert.ok(await spotifyTitle.count() > 0, 'Spotify section reached');

      // 6. Scrolls through Sound ID Proof
      await scrollToY(page, 3400);
      const soundTitle = container.locator('h2').filter({ hasText: /ONE SOUND/i }).filter({ hasText: /MILLIONS/i });
      assert.ok(await soundTitle.count() > 0, 'Sound ID section reached');

      // 7. Selects a record, deep-dive follows
      await container.getByRole('button', { name: /Odnogo Ultrafunk/i }).click();
      await page.waitForTimeout(300);
      const deepDive = container.locator('h3').filter({ hasText: 'ODNOGO ULTRAFUNK' });
      assert.ok(await deepDive.count() > 0, 'Record deep-dive reached');

      // 8. Reaches the footer scroll-to-top control
      await scrollToY(page, 6000);
      const topBtn = container.locator('button[aria-label="Scroll to top"]').first();
      assert.ok(await topBtn.count() > 0, 'Footer scroll-to-top reached');

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

      const stats = container.locator('text="SONGS SIGNED"');
      assert.ok(await stats.isVisible());

      // Keyboard navigation with Tab
      await page.keyboard.press('Tab');
      await page.keyboard.press('Tab');
      await page.waitForTimeout(50);

      // Check card containers maintain non-zero size without images
      const cards = container.locator('div[class*="aspect-square"]');
      const box = await cards.first().boundingBox();
      assert.ok(box && box.height > 50, 'Card height is maintained via aspect-ratio');

      assert.equal(getPageErrors().length, 0, 'Zero errors in offline reduced-motion mode');
    } finally {
      await session.context.close();
    }
  });

  // Real touch input across small phones, larger phones, and tablets.
  for (const width of [320, 375, 390, 430, 768]) {
    await runTest(`T4.5.${width}`, `Mobile Record And Daily Chart Interactions (${width}px)`, results, async () => {
      const session = await createPageSession(browser, {
        viewport: { width, height: 900 },
        hasTouch: true,
      });
      const { page, getPageErrors } = session;
      try {
        await navigateToArtists(page, baseUrl);
        const container = getArtistsContainer(page);
        const strip = container.locator('#spotify-record-strip');
        const cards = strip.locator('button');
        const titles = () => cards.locator('img').evaluateAll(els => els.map(el => el.alt));
        const originalOrder = await titles();
        assert.equal(await strip.locator('[title="Drag to reorder"]').count(), 0);

        const chart = container.getByRole('region', { name: 'Interactive Spotify growth chart' });
        await chart.scrollIntoViewIfNeeded();
        assert.equal(await container.getByText('TAP FOR DAILY DATA', { exact: true }).isVisible(), true);
        assert.equal(await container.getByText('HOVER FOR DAILY DATA', { exact: true }).isVisible(), false);
        const chartBox = await chart.boundingBox();
        for (const offset of [0, 1, 2, 28, 29]) {
          const x = Math.max(1, Math.min(chartBox.width - 1, chartBox.width * offset / 29));
          await page.touchscreen.tap(chartBox.x + x, chartBox.y + chartBox.height / 2);
          const tooltip = container.getByRole('tooltip');
          assert.equal((await tooltip.locator('span').nth(1).textContent()).trim(), `${offset + 1} SEP`);
          const tooltipBox = await tooltip.boundingBox();
          assert.ok(tooltipBox.x >= 0 && tooltipBox.x + tooltipBox.width <= width + 1, 'Daily tooltip fits the viewport');
        }
        const heading = await container.getByText('STREAM VELOCITY', { exact: true }).boundingBox();
        const topTick = await container.getByRole('img', { name: /^Daily streams axis:/ }).getByText('60K', { exact: true }).boundingBox();
        assert.ok(heading.y + heading.height < topTick.y, 'Chart heading clears the highest axis label');

        await strip.scrollIntoViewIfNeeded();
        const box = await strip.boundingBox();
        const client = await page.context().newCDPSession(page);
        const startX = box.x + box.width * 0.85;
        const y = box.y + box.height / 2;
        await client.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: startX, y }] });
        for (let step = 1; step <= 10; step++) {
          await client.send('Input.dispatchTouchEvent', {
            type: 'touchMove',
            touchPoints: [{ x: startX - box.width * 0.65 * step / 10, y }],
          });
        }
        await client.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
        await page.waitForTimeout(600);
        assert.ok(await strip.evaluate(el => el.scrollLeft) > 100, 'A touch swipe scrolls the record strip');
        assert.equal(await cards.first().getAttribute('aria-pressed'), 'true', 'Swiping preserves selection');
        assert.deepEqual(await titles(), originalOrder, 'Swiping preserves card order');
        await cards.nth(1).scrollIntoViewIfNeeded();
        await cards.nth(1).tap();
        assert.equal(await cards.nth(1).getAttribute('aria-pressed'), 'true', 'A tap selects a record after swiping');
        assert.equal(await container.locator('h3').textContent(), 'ODNOGO ULTRAFUNK');

        const soundCard = container.getByRole('link', { name: 'Open MIMIMI HARDTEKK on TikTok', exact: true });
        await soundCard.scrollIntoViewIfNeeded();
        assert.equal(await soundCard.locator('[data-card-tilt]').evaluate(el => getComputedStyle(el).transform), 'none', 'Touch devices do not run mouse tracking');
        assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth), false, 'No horizontal document overflow');
        assert.equal(getPageErrors().length, 0, 'No runtime errors during mobile interactions');
      } finally {
        await session.context.close();
      }
    });
  }
}
