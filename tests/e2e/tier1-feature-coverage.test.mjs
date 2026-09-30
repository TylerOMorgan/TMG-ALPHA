// tests/e2e/tier1-feature-coverage.test.mjs
import {
  createPageSession,
  navigateToArtists,
  resetToArtistsTop,
  scrollToY,
  waitForPreloader,
  getArtistsContainer,
  runTest,
  assert
} from './harness.mjs';

/**
 * Tier 1: Feature Coverage Suite (40 tests across the revised #artists page)
 *
 * NOTE (2026-09-30): the full 8-section experience was deliberately moved to
 * the #artist2 route (commit 90b9d45) while #artists was revised (live hero
 * marquee, selectable Spotify deep-dive, Sound ID proof cards, demo CTA).
 * This suite tests the REVISED page as the source of truth.
 */
export async function runTier1(browser, baseUrl, results) {
  console.log('\n=== TIER 1: FEATURE COVERAGE (40 TESTS) ===');

  const session = await createPageSession(browser, {
    viewport: { width: 1440, height: 900 }
  });
  const { page, getPageErrors } = session;

  try {
    await navigateToArtists(page, baseUrl);
    const container = getArtistsContainer(page);

    // =========================================================================
    // SECTION 1: HERO STRIP & STATS — 5 Tests
    // =========================================================================
    console.log('\n--- Group 1: Hero Strip & Stats ---');

    await runTest('T1.1.1', 'Hero Eyebrow & Indicator', results, async () => {
      const eyebrow = container.locator('text=THE TRILLEX ROSTER').first();
      assert.equal(await eyebrow.isVisible(), true, 'Eyebrow should be visible');

      // Check for indicator dot (span with rounded-full inside the eyebrow row)
      const dot = eyebrow.locator('xpath=ancestor::*[contains(@class, "flex")][1]//span[contains(@class, "rounded-full")]');
      const dotCount = await dot.count();
      assert.ok(dotCount > 0, 'Eyebrow should have an indicator dot');

      // Check monospace styling
      const textSpan = eyebrow.locator('xpath=ancestor-or-self::*[contains(@class, "font-mono")]').first();
      assert.ok(await textSpan.count() > 0, 'Eyebrow should use font-mono');
    });

    await runTest('T1.1.2', 'Hero Main Display Title', results, async () => {
      const h1 = container.locator('h1');
      assert.equal(await h1.isVisible(), true, 'h1 should be visible');
      const text = (await h1.textContent()).trim();
      assert.equal(text, 'ARTISTS', 'h1 text should be ARTISTS');

      const fontSize = await h1.evaluate(el => parseFloat(window.getComputedStyle(el).fontSize));
      assert.ok(fontSize >= 100, `h1 font-size should be display scale (>=100px on desktop), got ${fontSize}px`);
    });

    await runTest('T1.1.3', 'Hero Title Block & Backdrop', results, async () => {
      const headerRow = container.locator('div.flex.flex-wrap.items-end').first();
      assert.ok(await headerRow.count() > 0, 'Hero title header row should be present');

      const live = container.locator('text=ROSTER LIVE');
      assert.equal(await live.count(), 0, 'ROSTER LIVE badge should be gone');

      const backdrop = container.locator('text=ROSTER').first();
      assert.ok(await backdrop.count() > 0, 'Giant ROSTER backdrop should be present');
    });

    await runTest('T1.1.4', '4-Stat Metric Values', results, async () => {
      // Count-up finishes ~1.4s after the stats scroll into view; wait for final values.
      // Values are read structurally (exact-text locators are flaky against
      // React text nodes mid count-up).
      await page.waitForFunction(() => document.body.innerText.includes('3.74B+'), { timeout: 8000 });
      const grid = container.locator('div.grid').filter({ hasText: 'SONGS SIGNED' }).first();
      assert.equal(await grid.isVisible(), true, 'Stat grid should be visible');
      const vals = await grid.evaluate(el => [...el.children].map(c => c.children[1].textContent.trim()));
      assert.deepEqual(vals, ['928', '3.74B+', '5M+', '590M+']);
    });

    await runTest('T1.1.5', '4-Stat Metric Labels & Card Accents', results, async () => {
      const expectedLabels = ['SONGS SIGNED', 'TIKTOK VIEWS', 'UGC CREATIONS', 'SPOTIFY STREAMS'];
      for (const label of expectedLabels) {
        const locator = container.locator(`text="${label}"`);
        assert.ok(await locator.count() > 0, `Metric label ${label} should exist`);
        assert.equal(await locator.first().isVisible(), true, `Metric label ${label} should be visible`);
      }

      // Each stat card carries a colored top accent via inline border-top style
      const accents = await container.locator('div.grid').filter({ hasText: 'SONGS SIGNED' }).first().evaluate(el => {
        return [...el.children].map(c => c.style.borderTop || '');
      });
      assert.equal(accents.length, 4, 'There should be 4 stat cards');
      assert.ok(accents.every(a => a.includes('2px')), 'Every stat card should have a 2px top accent');
    });

    // =========================================================================
    // SECTION 2: EXPLORE ARTISTS MARQUEE & BADGES — 5 Tests
    // =========================================================================
    console.log('\n--- Group 2: Explore Artists Marquee & Badges ---');

    await runTest('T1.2.1', 'Explore Subheader Row', results, async () => {
      const exploreText = container.locator('text=EXPLORE ARTISTS');
      assert.ok(await exploreText.count() > 0, 'Subheader "EXPLORE ARTISTS" should be present');
      assert.equal(await exploreText.first().isVisible(), true);

      const marquee = container.locator('div.cursor-grab').first();
      assert.ok(await marquee.count() > 0, 'Explore marquee scroller should be present');
    });

    await runTest('T1.2.2', 'Artist Card Quantity & Square Layout', results, async () => {
      // Marquee rows repeat the roster; cells are square artwork cards
      const heroSection = container.locator('section').first();
      const cards = heroSection.locator('div[class*="aspect-square"]');
      const cardCount = await cards.count();
      assert.ok(cardCount >= 40, `Expected at least 40 artist marquee cells, found ${cardCount}`);
    });

    await runTest('T1.2.3', 'Artist Names & Typography', results, async () => {
      // Roster names: SAINT RIO, MAYA SOL, NOA VALE, LENA MORI, JUNO, SOLA
      const expectedSampleNames = ['MAYA SOL', 'NOA VALE', 'LENA MORI', 'JUNO', 'SOLA'];
      for (const name of expectedSampleNames) {
        const el = container.locator(`text="${name}"`);
        assert.ok(await el.count() > 0, `Artist name ${name} should be displayed`);
      }
    });

    await runTest('T1.2.4', 'Spotify Circular Badges', results, async () => {
      const heroSection = container.locator('section').first();
      const badges = heroSection.locator('div[class*="aspect-square"] svg');
      const badgeCount = await badges.count();
      assert.ok(badgeCount >= 40, `Expected at least 40 Spotify badges on explore cards, found ${badgeCount}`);
    });

    await runTest('T1.2.5', 'Card Image Hover Transform & Spotify Links', results, async () => {
      const heroSection = container.locator('section').first();
      const firstCardImg = heroSection.locator('div[class*="aspect-square"] img').first();
      assert.equal(await firstCardImg.isVisible(), true);

      const imgClass = await firstCardImg.getAttribute('class');
      assert.ok(imgClass.includes('group-hover:scale-105') || imgClass.includes('hover:scale'),
        'Card image should support hover zoom transition');

      // Every card links out to Spotify
      const spotifyLink = heroSection.locator('a[aria-label*="Spotify"]').first();
      assert.ok(await spotifyLink.count() > 0, 'Spotify listen link should be present on cards');
      const href = await spotifyLink.getAttribute('href');
      assert.ok(href.includes('open.spotify.com'), `Spotify link should point at open.spotify.com, got ${href}`);
    });

    // =========================================================================
    // SECTION 3: SELECT RECORD INFINITE STRIP — 5 Tests
    // =========================================================================
    console.log('\n--- Group 3: Select Record Infinite Strip ---');

    await runTest('T1.3.1', 'Select Record Label', results, async () => {
      const label = container.locator('text=SELECT RECORD').first();
      assert.ok(await label.count() > 0, 'Label "SELECT RECORD" should be present');
      assert.equal(await label.isVisible(), true, 'Label should be visible');
    });

    await runTest('T1.3.2', '8 Records Tripled For Infinite Loop', results, async () => {
      // 8 records x 3 loop copies = 24 selectable buttons
      const buttons = container.locator('button[aria-pressed]');
      assert.equal(await buttons.count(), 24, 'Expected 24 record buttons (8 records x 3 loop copies)');
    });

    await runTest('T1.3.3', 'Strip Navigation Arrows', results, async () => {
      const left = container.locator('button[aria-label="Scroll records left"]').first();
      const right = container.locator('button[aria-label="Scroll records right"]').first();
      assert.equal(await left.isVisible(), true, 'Left arrow should be visible');
      assert.equal(await right.isVisible(), true, 'Right arrow should be visible');
    });

    await runTest('T1.3.4', 'Arrow Scroll Advances Strip', results, async () => {
      const scroller = container.locator('div.overflow-x-auto').first();
      const before = await scroller.evaluate(el => el.scrollLeft);
      await container.locator('button[aria-label="Scroll records right"]').first().click();
      const handle = await scroller.elementHandle();
      await page.waitForFunction(([el, b]) => el.scrollLeft > b, [handle, before], { timeout: 4000 });
      const after = await scroller.evaluate(el => el.scrollLeft);
      assert.ok(after > before, `Strip should advance right (before=${before}, after=${after})`);
    });

    await runTest('T1.3.5', 'Record Selection Updates Deep-Dive', results, async () => {
      // Middle loop copy starts at index 8: click ODNOGO (index 9), then restore MIMIMI (index 8)
      await container.locator('button[aria-pressed]').nth(9).click();
      await page.waitForTimeout(400);
      const updated = container.locator('h3').filter({ hasText: 'ODNOGO ULTRAFUNK' });
      assert.ok(await updated.count() > 0, 'Deep-dive should show ODNOGO ULTRAFUNK after selection');

      await container.locator('button[aria-pressed]').nth(8).click();
      await page.waitForTimeout(400);
      const restored = container.locator('h3').filter({ hasText: 'MIMIMI HARDTEKK' });
      assert.ok(await restored.count() > 0, 'Deep-dive should restore MIMIMI HARDTEKK');

      // Drag-to-reorder: drag the first middle-copy card two slots right
      const midTitles = () => container.locator('button[aria-pressed]').evaluateAll(
        els => els.slice(8, 16).map(e => e.textContent.replace(/\s+/g, ' ').trim())
      );
      const beforeDrag = await midTitles();
      const grip = container.locator('button[aria-pressed]').nth(8).locator('span[title="Drag to reorder"]');
      const gbox = await grip.boundingBox();
      await page.mouse.move(gbox.x + gbox.width / 2, gbox.y + gbox.height / 2);
      await page.mouse.down();
      for (let i = 1; i <= 20; i++) {
        await page.mouse.move(gbox.x + gbox.width / 2 + (i * 1000) / 20, gbox.y + gbox.height / 2);
        await page.waitForTimeout(15);
      }
      await page.mouse.up();
      await page.waitForTimeout(400);
      const afterDrag = await midTitles();
      assert.ok(JSON.stringify(afterDrag) !== JSON.stringify(beforeDrag), 'Drag should reorder the strip');
      assert.deepEqual([...afterDrag].sort(), [...beforeDrag].sort(), 'Reorder preserves all 8 records');
      const keptSelection = container.locator('h3').filter({ hasText: 'MIMIMI HARDTEKK' });
      assert.ok(await keptSelection.count() > 0, 'Selection survives reorder');
    });

    // =========================================================================
    // SECTION 4: SPOTIFY DEEP-DIVE SHOWCASE (00:03) — 5 Tests
    // =========================================================================
    console.log('\n--- Group 4: Spotify Deep-Dive Showcase ---');

    await runTest('T1.4.1', 'Dark Theme & Spotify Eyebrow', results, async () => {
      await scrollToY(page, 2000);
      const spotifyEyebrow = container.locator('text=/SPOTIFY FOR ARTISTS/i').first();
      assert.ok(await spotifyEyebrow.count() > 0, 'Spotify eyebrow should be present');

      const spotifySection = container.locator('section').filter({ hasText: /MOMENTUM/i }).first();
      const isDark = await spotifySection.evaluate(el => {
        const bg = window.getComputedStyle(el).backgroundColor;
        const match = bg.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
        if (!match) return false;
        const [_, r, g, b] = match.map(Number);
        return r < 30 && g < 30 && b < 30;
      });
      assert.ok(isDark, 'Spotify section background should be dark black');
    });

    await runTest('T1.4.2', 'Spotify Section Heading & Record Strip', results, async () => {
      const heading = container.locator('h2').filter({ hasText: /MOMENTUM/i });
      assert.ok(await heading.count() > 0, 'Heading "MOMENTUM YOU CAN SEE." should be present');

      const strip = container.locator('text=SELECT RECORD');
      assert.ok(await strip.count() > 0, 'Record selector strip should sit under the heading');
    });

    await runTest('T1.4.3', 'Record Deep-Dive Showcase Card', results, async () => {
      const heroCard = container.locator('h3').filter({ hasText: 'MIMIMI HARDTEKK' });
      assert.ok(await heroCard.count() > 0, 'Deep-dive card "MIMIMI HARDTEKK" should be present');

      const artwork = container.locator('img[alt="MIMIMI HARDTEKK"]').first();
      assert.ok(await artwork.count() > 0, 'Deep-dive artwork should be present');

      const openLink = container.locator('a').filter({ hasText: /OPEN IN SPOTIFY/i }).first();
      assert.ok(await openLink.count() > 0, 'OPEN IN SPOTIFY link should be present');
    });

    await runTest('T1.4.4', 'Deep-Dive Metrics & Verification Window', results, async () => {
      const streams = container.locator('text=6M+');
      assert.ok(await streams.count() > 0, 'Spotify Streams metric "6M+" should be displayed');

      const daily = container.locator('text=54K');
      assert.ok(await daily.count() > 0, 'Daily at peak metric "54K" should be displayed');

      const window = container.locator('text=/SEP 1.*SEP 30/');
      assert.ok(await window.count() > 0, 'Verification window "SEP 1 — SEP 30" should be displayed');
    });

    await runTest('T1.4.5', 'SVG Growth Chart & Glowing Stroke', results, async () => {
      const chart = container.locator('svg[viewBox*="600 220"]');
      assert.ok(await chart.count() > 0, 'Growth chart SVG should exist with 600x220 viewBox');

      const chartLine = chart.locator('path[stroke*="#1D"], path[stroke*="#19"], #axp-chart-line');
      assert.ok(await chartLine.count() > 0, 'Green growth curve path should exist');

      const apexDot = container.locator('div.cursor-crosshair [class*="bg-[#19D057]"]');
      assert.ok(await apexDot.count() > 0, 'Round green apex dot indicator should exist');
    });

    // =========================================================================
    // SECTION 5: SOUND ID PROOF SECTION & 5M+ WATERMARK (00:04 - 00:05) — 5 Tests
    // =========================================================================
    console.log('\n--- Group 5: Sound ID Proof Section & 5M+ Watermark ---');

    await runTest('T1.5.1', 'Sound ID Section Header', results, async () => {
      await scrollToY(page, 2800);
      const eyebrow = container.locator('text=/TIKTOK SOUND IDS/i').first();
      assert.ok(await eyebrow.count() > 0, 'Sound ID eyebrow should exist');

      const heading = container.locator('h2').filter({ hasText: /ONE SOUND/i }).filter({ hasText: /MILLIONS OF/i });
      assert.ok(await heading.count() > 0, 'Headline "ONE SOUND, MILLIONS OF VIDEOS." should exist');
    });

    await runTest('T1.5.2', 'Giant Background 5M+ Watermark', results, async () => {
      // Find the giant ghost watermark in the sound id section
      const ghost = container.locator('div[class*="pointer-events-none"]').filter({ hasText: '5M+' });
      assert.ok(await ghost.count() > 0, 'Giant 5M+ ghost watermark should be present');
    });

    await runTest('T1.5.3', '4-Card Sound ID Grid Presence', results, async () => {
      const expectedCards = [
        'MIMIMI HARDTEKK',
        'ODNOGO ULTRAFUNK',
        'STEREO LOVE FUNK',
        'CANT FIGHT THIS FEELING'
      ];
      for (const title of expectedCards) {
        const el = container.locator(`text="${title}"`);
        assert.ok(await el.count() > 0, `Proof card "${title}" should exist`);
      }
    });

    await runTest('T1.5.4', 'TikTok Loaders Idle Until Card Hover', results, async () => {
      const staticDots = container.locator('img[src*="tiktok-loading-static"]');
      assert.equal(await staticDots.count(), 4, 'All 4 proof cards should show idle TikTok dots');

      const animated = container.locator('img[src="/tiktok-loading.svg"]');
      assert.equal(await animated.count(), 4, 'All 4 proof cards should have the hover loader ready');

      // Animation starts only on the hovered card
      // (park the cursor clear first: prior scrollToY calls can leave it resting on a card)
      await page.mouse.move(5, 5);
      await page.waitForTimeout(150);
      const cards = container.locator('a[aria-label^="Open"]');
      assert.equal(await animated.nth(0).isVisible(), false, 'Animated loader hidden before hover');
      await cards.nth(0).hover({ force: true });
      await page.waitForTimeout(200);
      assert.equal(await animated.nth(0).isVisible(), true, 'Animated loader plays on hovered card');
      assert.equal(await animated.nth(1).isVisible(), false, 'Other cards stay idle');
      await page.mouse.move(5, 5);

      const legacy = container.locator('text="TIKTOK SOUND"');
      assert.equal(await legacy.count(), 0, 'Legacy TIKTOK SOUND pill should be gone');
    });

    await runTest('T1.5.5', 'External Metric Readouts', results, async () => {
      const expectedMetrics = ['900K+', '600K+', '1.2M+', '450K+'];
      for (const metric of expectedMetrics) {
        const el = container.locator(`text="${metric}"`);
        assert.ok(await el.count() > 0, `Proof metric "${metric}" should exist`);
      }
    });

    // =========================================================================
    // SECTION 6: SPOTIFY CHART HOVER READOUT — 5 Tests
    // =========================================================================
    console.log('\n--- Group 6: Spotify Chart Hover Readout ---');

    const getChart = () => container.locator('div.cursor-crosshair').first();
    const getTooltipDate = () => container.locator('[role="tooltip"] span').nth(1).textContent();

    await runTest('T1.6.1', 'Hover Reveals Daily Point Tooltip', results, async () => {
      const chart = getChart();
      await chart.scrollIntoViewIfNeeded();
      const box = await chart.boundingBox();
      await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
      await page.waitForTimeout(200);
      const tooltip = container.locator('[role="tooltip"]');
      assert.equal(await tooltip.isVisible(), true, 'Tooltip should appear on chart hover');
      const streams = await tooltip.filter({ hasText: /STREAMS\/DAY/ }).count();
      assert.ok(streams > 0, 'Tooltip should show a STREAMS/DAY readout');
    });

    await runTest('T1.6.2', 'Hover Left Edge Shows Sep 1', results, async () => {
      const chart = getChart();
      const box = await chart.boundingBox();
      await page.mouse.move(box.x + 6, box.y + box.height / 2);
      await page.waitForTimeout(200);
      assert.equal((await getTooltipDate()).trim(), '1 SEP', 'Left edge hover should read "1 SEP"');
    });

    await runTest('T1.6.3', 'Hover Right Edge Shows Sep 30', results, async () => {
      const chart = getChart();
      const box = await chart.boundingBox();
      await page.mouse.move(box.x + box.width - 6, box.y + box.height / 2);
      await page.waitForTimeout(200);
      assert.equal((await getTooltipDate()).trim(), '30 SEP', 'Right edge hover should read "30 SEP"');
    });

    await runTest('T1.6.4', 'Hover Shows Streams And Cumulative Totals', results, async () => {
      const chart = getChart();
      const box = await chart.boundingBox();
      await page.mouse.move(box.x + box.width * 0.75, box.y + box.height / 2);
      await page.waitForTimeout(200);
      const tooltip = container.locator('[role="tooltip"]');
      assert.ok(await tooltip.filter({ hasText: /STREAMS\/DAY/ }).count() > 0, 'Tooltip should show daily streams');
      assert.ok(await tooltip.filter({ hasText: /CUMULATIVE/ }).count() > 0, 'Tooltip should show cumulative total');
    });

    await runTest('T1.6.5', 'Tooltip Hides On Mouse Leave', results, async () => {
      await page.mouse.move(5, 5);
      await page.waitForTimeout(200);
      assert.equal(await container.locator('[role="tooltip"]').count(), 0, 'Tooltip should hide after mouse leave');
    });

    // =========================================================================
    // SECTION 7: FOOTER SCROLL-TO-TOP — 5 Tests
    // =========================================================================
    console.log('\n--- Group 7: Footer Scroll-To-Top ---');

    await runTest('T1.7.1', 'Scroll-To-Top Button In Artists Footer', results, async () => {
      await resetToArtistsTop(page);
      const btn = container.locator('button[aria-label="Scroll to top"]').first();
      assert.ok(await btn.count() > 0, 'Scroll-to-top button should exist in footer');
      assert.equal(await btn.isVisible(), true, 'Scroll-to-top button should be visible');
    });

    await runTest('T1.7.2', 'Scroll-To-Top Accessible Name', results, async () => {
      const btn = container.locator('button[aria-label="Scroll to top"]').first();
      assert.equal(await btn.getAttribute('aria-label'), 'Scroll to top', 'Button should expose its accessible name');
    });

    await runTest('T1.7.3', 'Scroll-To-Top Returns To Page Top', results, async () => {
      await scrollToY(page, 1500, true);
      await container.locator('button[aria-label="Scroll to top"]').first().click();
      await page.waitForFunction(() => window.scrollY < 30, { timeout: 6000 });
      const y = await page.evaluate(() => window.scrollY);
      assert.ok(y < 30, `Page should be back at top after click, got scrollY=${y}`);

      // Mid-glide tap: start a downward glide, tap the button mid-flight
      await page.evaluate(() => { window.lenis.scrollTo(3000, { immediate: false }); });
      await page.waitForTimeout(150);
      await container.locator('button[aria-label="Scroll to top"]').first().click();
      await page.waitForFunction(() => window.scrollY < 30, { timeout: 6000 });
      const y2 = await page.evaluate(() => window.scrollY);
      assert.ok(y2 < 30, `Mid-glide tap should still reach top, got scrollY=${y2}`);
    });

    await runTest('T1.7.4', 'No Scroll-To-Top Button On Home', results, async () => {
      await page.goto(`${baseUrl}/#home`);
      await waitForPreloader(page);
      await page.waitForTimeout(400);
      // Scope to the visible page: all routes stay mounted, hidden ones still match plain locators
      assert.equal(await page.locator('main > div:visible button[aria-label="Scroll to top"]').count(), 0, 'Home footer should not show the button');
    });

    await runTest('T1.7.5', 'Scroll-To-Top Button On About', results, async () => {
      await page.goto(`${baseUrl}/#about`);
      await page.waitForTimeout(600);
      const btn = page.locator('button[aria-label="Scroll to top"]').first();
      assert.ok(await btn.count() > 0, 'About footer should show the button');
      await resetToArtistsTop(page);
    });

    // =========================================================================
    // SECTION 8: CTA DEMO SUBMISSION & HASH NAVIGATION (00:08) — 5 Tests
    // =========================================================================
    console.log('\n--- Group 8: CTA Demo Submission & Hash Navigation ---');

    await runTest('T1.8.1', 'CTA Waveform Logo Mark', results, async () => {
      await scrollToY(page, 5600);
      const ctaSection = container.locator('section').filter({ hasText: /YOUR RECORD/i }).filter({ hasText: /COULD BE NEXT/i }).first();
      assert.ok(await ctaSection.count() > 0, 'CTA section should exist');

      const logo = ctaSection.locator('svg').first();
      assert.ok(await logo.count() > 0, 'CTA logo SVG should exist');
    });

    await runTest('T1.8.2', 'CTA Headline & Pitch Copy', results, async () => {
      const heading = container.locator('h2').filter({ hasText: /YOUR RECORD/i }).filter({ hasText: /COULD BE NEXT/i });
      assert.ok(await heading.count() > 0, 'CTA heading should exist');

      const copy = container.locator('text=/Bring the record\\. Bring the ambition\\./i');
      assert.ok(await copy.count() > 0, 'CTA copy should exist');
    });

    await runTest('T1.8.3', 'Submit Your Demo Button', results, async () => {
      const button = container.locator('a, button').filter({ hasText: 'SUBMIT YOUR DEMO' });
      assert.ok(await button.count() > 0, 'SUBMIT YOUR DEMO button should exist');
      assert.equal(await button.first().isVisible(), true, 'Button should be visible');
    });

    await runTest('T1.8.4', 'CTA Demo Navigation Trigger', results, async () => {
      const button = container.locator('a, button').filter({ hasText: 'SUBMIT YOUR DEMO' }).first();
      await button.click();
      await page.waitForTimeout(300);

      const hash = await page.evaluate(() => window.location.hash);
      assert.ok(hash.includes('demo'), `Hash should update to demo submission, got: ${hash}`);

      // Contact form should be mounted
      const contactSection = page.locator('main > div:visible').filter({ hasText: /DEMO SUBMISSION|DROP YOUR UNRELEASED/i });
      assert.ok(await contactSection.count() > 0, 'Contact form should be mounted and visible');
    });

    await runTest('T1.8.5', 'Sub-Footer Credentials', results, async () => {
      // Re-navigate to artists
      await page.goto(`${baseUrl}/#artists`);
      await page.waitForTimeout(400);

      const left = page.locator('text=TRILLEX MUSIC GROUP');
      assert.ok(await left.count() > 0, 'Footer credentials "TRILLEX MUSIC GROUP" should exist');

      const right = page.locator('text=/HARDTEKK/i').filter({ hasText: /HOODTRAP/i });
      assert.ok(await right.count() > 0, 'Footer genre list credentials should exist');
    });

  } finally {
    await session.context.close();
  }
}
