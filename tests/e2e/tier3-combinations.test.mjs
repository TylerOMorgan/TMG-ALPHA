// tests/e2e/tier3-combinations.test.mjs
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
 * Tier 3: Cross-Feature Combinations Suite (8 tests)
 */
export async function runTier3(browser, baseUrl, results) {
  console.log('\n=== TIER 3: CROSS-FEATURE COMBINATIONS (8 TESTS) ===');

  const session = await createPageSession(browser, {
    viewport: { width: 1440, height: 900 }
  });
  const { page, getPageErrors, clearPageErrors } = session;

  try {
    // =========================================================================
    // T3.1: Direct URL Hash Load & Preloader Integration
    // =========================================================================
    await runTest('T3.1', 'Direct URL Hash Load & Preloader Integration', results, async () => {
      clearPageErrors();
      await page.goto(`${baseUrl}/#artists`);
      await waitForPreloader(page);

      // Verify active title
      const title = await page.title();
      assert.ok(title.includes('ARTISTS') || title.includes('TRILLEX'), `Title should indicate Artists or Trillex, got ${title}`);

      // Verify navigation highlights ARTISTS
      const navArtists = page.locator('nav a').filter({ hasText: 'ARTISTS' });
      assert.ok(await navArtists.isVisible(), 'Nav link ARTISTS is visible');
      const cls = await navArtists.getAttribute('class');
      assert.ok(cls.includes('font-bold') || cls.includes('text-white'), 'Nav link ARTISTS has active styling');

      assert.equal(getPageErrors().length, 0);
    });

    // =========================================================================
    // T3.2: Cross-Route Navigation from #about to #artists
    // =========================================================================
    await runTest('T3.2', 'Cross-Route Navigation from #about to #artists', results, async () => {
      clearPageErrors();
      // Go to #about
      await page.goto(`${baseUrl}/#about`);
      await page.waitForTimeout(400);

      // Click ARTISTS link in nav
      const artistsLink = page.locator('nav a').filter({ hasText: 'ARTISTS' }).first();
      await artistsLink.click();
      await page.waitForTimeout(400);

      const scrollY = await page.evaluate(() => window.scrollY);
      assert.equal(scrollY, 0, 'Scroll position should reset to 0 upon route transition');

      const artistsContainer = getArtistsContainer(page);
      assert.ok(await artistsContainer.isVisible(), 'Artists container should be visible');
      assert.equal(getPageErrors().length, 0);
    });

    // =========================================================================
    // T3.3: Cross-Route Navigation from #artists to #contact via Demo CTA
    // =========================================================================
    await runTest('T3.3', 'Cross-Route Navigation from #artists to #contact via Demo CTA', results, async () => {
      clearPageErrors();
      await page.goto(`${baseUrl}/#artists`);
      await page.waitForTimeout(300);

      const artistsContainer = getArtistsContainer(page);
      const ctaButton = artistsContainer.locator('a, button').filter({ hasText: 'SUBMIT YOUR DEMO' }).first();
      await ctaButton.scrollIntoViewIfNeeded();
      await ctaButton.click();
      await page.waitForTimeout(400);

      const hash = await page.evaluate(() => window.location.hash);
      assert.ok(hash.includes('demo'), `Hash should be demo-submission, got: ${hash}`);

      const contactSection = page.locator('main > div:visible').filter({ hasText: /DEMO SUBMISSION|DROP YOUR UNRELEASED|SEND MESSAGE/i });
      assert.ok(await contactSection.count() > 0, 'Contact view should be visible');
      assert.equal(getPageErrors().length, 0);
    });

    // =========================================================================
    // T3.4: Cross-Route Navigation from #artists to #home and Back
    // =========================================================================
    await runTest('T3.4', 'Cross-Route Navigation from #artists to #home and Back', results, async () => {
      clearPageErrors();
      // Click HOME in nav
      const homeLink = page.locator('nav a').filter({ hasText: 'HOME' }).first();
      await homeLink.click();
      await page.waitForTimeout(400);

      // Canvas element should be present in Home view
      const canvas = page.locator('canvas');
      assert.ok(await canvas.count() > 0, 'Three.js canvas exists on Home');

      // Navigate back to ARTISTS
      const artistsLink = page.locator('nav a').filter({ hasText: 'ARTISTS' }).first();
      await artistsLink.click();
      await page.waitForTimeout(400);

      const artistsContainer = getArtistsContainer(page);
      assert.ok(await artistsContainer.isVisible(), 'Artists page re-mounts cleanly');
      assert.equal(getPageErrors().length, 0);
    });

    // =========================================================================
    // T3.5: Browser Popstate History Traversal
    // =========================================================================
    await runTest('T3.5', 'Browser Popstate History Traversal', results, async () => {
      clearPageErrors();
      // Navigate #about -> #artists
      await page.evaluate(() => { window.location.hash = '#about'; });
      await page.waitForTimeout(200);
      await page.evaluate(() => { window.location.hash = '#artists'; });
      await page.waitForTimeout(200);

      // Browser back
      await page.goBack();
      await page.waitForTimeout(300);
      let hash = await page.evaluate(() => window.location.hash);
      assert.ok(hash.includes('about'), `Hash after back should include about, got: ${hash}`);

      // Browser forward
      await page.goForward();
      await page.waitForTimeout(300);
      hash = await page.evaluate(() => window.location.hash);
      assert.ok(hash.includes('artists'), `Hash after forward should include artists, got: ${hash}`);

      assert.equal(getPageErrors().length, 0);
    });

    // =========================================================================
    // T3.6: Mid-Scroll Route Interruption
    // =========================================================================
    await runTest('T3.6', 'Mid-Scroll Route Interruption', results, async () => {
      clearPageErrors();
      await page.evaluate(() => { window.location.hash = '#artists'; });
      await page.waitForTimeout(200);

      // Initiate downward fling
      await flingScroll(page, 3000, 4, 10);

      // Mid-scroll, click ABOUT in nav
      const aboutLink = page.locator('nav a').filter({ hasText: 'ABOUT' }).first();
      await aboutLink.click();
      await page.waitForTimeout(300);

      assert.equal(getPageErrors().length, 0, 'No null reference or runtime errors when interrupting scroll with route switch');
    });

    // =========================================================================
    // T3.7: Window Resize During Active RecordsRail Pin
    // =========================================================================
    await runTest('T3.7', 'Window Resize During Active RecordsRail Pin', results, async () => {
      clearPageErrors();
      await page.evaluate(() => { window.location.hash = '#artists'; });
      await page.waitForTimeout(200);

      await scrollToY(page, 3600);
      await page.waitForTimeout(100);

      // Resize window
      await page.setViewportSize({ width: 1200, height: 800 });
      await page.waitForTimeout(200);
      await page.setViewportSize({ width: 1440, height: 900 });
      await page.waitForTimeout(200);

      const track = page.locator('main > div:visible div').filter({ hasText: 'MIMIMI HARDTEKK' }).first();
      assert.ok(await track.isVisible(), 'Track remains rendered after window resize');
      assert.equal(getPageErrors().length, 0);
    });

    // =========================================================================
    // T3.8: Rapid Repeated Route Switching Loop
    // =========================================================================
    await runTest('T3.8', 'Rapid Repeated Route Switching Loop', results, async () => {
      clearPageErrors();
      const routes = ['#artists', '#about', '#artists', '#contact', '#artists'];
      for (const r of routes) {
        await page.evaluate((targetHash) => {
          window.location.hash = targetHash;
        }, r);
        await page.waitForTimeout(60);
      }
      await page.waitForTimeout(200);

      const artistsContainer = getArtistsContainer(page);
      assert.ok(await artistsContainer.isVisible(), 'Artists container active at end of loop');
      assert.equal(getPageErrors().length, 0, 'Zero errors after rapid route switching');
    });

  } finally {
    await session.context.close();
  }
}
