// tests/e2e/tier1-feature-coverage.test.mjs
import {
  createPageSession,
  navigateToArtists,
  resetToArtistsTop,
  scrollToY,
  getArtistsContainer,
  runTest,
  assert
} from './harness.mjs';

/**
 * Tier 1: Feature Coverage Suite (40 tests across 8 timestamp sections)
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
    // SECTION 1: HERO STRIP & STATS (00:00) — 5 Tests
    // =========================================================================
    console.log('\n--- Group 1: Hero Strip & Stats (00:00) ---');

    await runTest('T1.1.1', 'Hero Eyebrow & Indicator', results, async () => {
      const eyebrow = container.locator('text=/ARTISTS/i').filter({ hasText: /WHY WORK WITH US/i }).first();
      await assert.equal(await eyebrow.isVisible(), true, 'Eyebrow should be visible');
      
      // Check for orange indicator dot (span with rounded-full and signal class)
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

    await runTest('T1.1.3', 'Hero Subtitle Head & Tail Copy', results, async () => {
      const head = container.locator('text=/The artists\\. The records\\. The proof\\./i');
      assert.ok(await head.count() > 0, 'Head copy "The artists. The records. The proof." should be present');
      assert.equal(await head.first().isVisible(), true, 'Head copy should be visible');

      const tail = container.locator('text=/Built around the sounds moving internet culture\\./i');
      assert.ok(await tail.count() > 0, 'Tail copy "Built around the sounds moving internet culture." should be present');
      assert.equal(await tail.first().isVisible(), true, 'Tail copy should be visible');
    });

    await runTest('T1.1.4', '4-Stat Metric Values', results, async () => {
      const expectedValues = ['900+', '3.7B+', '5M+', '590M+'];
      for (const val of expectedValues) {
        const locator = container.locator(`text="${val}"`);
        assert.ok(await locator.count() > 0, `Metric value ${val} should exist`);
        assert.equal(await locator.first().isVisible(), true, `Metric value ${val} should be visible`);
      }
    });

    await runTest('T1.1.5', '4-Stat Metric Labels & Dividers', results, async () => {
      const expectedLabels = ['SONGS SIGNED', 'TIKTOK VIEWS', 'UGC CREATIONS', 'SPOTIFY STREAMS'];
      for (const label of expectedLabels) {
        const locator = container.locator(`text="${label}"`);
        assert.ok(await locator.count() > 0, `Metric label ${label} should exist`);
        assert.equal(await locator.first().isVisible(), true, `Metric label ${label} should be visible`);
      }
      
      // Metric strip container has border styling
      const metricContainer = container.locator('div.grid').filter({ hasText: 'SONGS SIGNED' }).first();
      const hasBorder = await metricContainer.evaluate(el => {
        const cls = el.className;
        return cls.includes('border-y') || cls.includes('border-t');
      });
      assert.ok(hasBorder, 'Metric strip container should have hairline border styling');
    });

    // =========================================================================
    // SECTION 2: INTERACTIVE EXPLORE ARTISTS GRID & BADGES (00:00 - 00:01) — 5 Tests
    // =========================================================================
    console.log('\n--- Group 2: Interactive Explore Artists Grid & Badges (00:00 - 00:01) ---');

    await runTest('T1.2.1', 'Explore Subheader Row', results, async () => {
      const exploreText = container.locator('text=EXPLORE ARTISTS');
      assert.ok(await exploreText.count() > 0, 'Subheader "EXPLORE ARTISTS" should be present');
      assert.equal(await exploreText.first().isVisible(), true);

      const twoWorldsText = container.locator('text=/TWO WORLDS/i');
      assert.ok(await twoWorldsText.count() > 0, 'Subheader "TWO WORLDS" should be present');
    });

    await runTest('T1.2.2', 'Artist Card Quantity & Grid Layout', results, async () => {
      // Explore grid cards are within the hero section and have aspect-[16/10]
      const heroSection = container.locator('section').first();
      const cards = heroSection.locator('div[class*="aspect-[16/10]"]');
      const cardCount = await cards.count();
      assert.ok(cardCount >= 12, `Expected at least 12 artist cards in Explore grid, found ${cardCount}`);
    });

    await runTest('T1.2.3', 'Artist Names & Typography', results, async () => {
      // Roster names: IO/SAINT RIO, MAYA SOL, NOA VALE, LENA MORI, JUNO, SOLA
      const expectedSampleNames = ['MAYA SOL', 'NOA VALE', 'LENA MORI', 'JUNO', 'SOLA'];
      for (const name of expectedSampleNames) {
        const el = container.locator(`text="${name}"`);
        assert.ok(await el.count() > 0, `Artist name ${name} should be displayed`);
      }
    });

    await runTest('T1.2.4', 'Spotify Circular Badges', results, async () => {
      const heroSection = container.locator('section').first();
      const badges = heroSection.locator('div[class*="aspect-[16/10]"] svg');
      const badgeCount = await badges.count();
      assert.ok(badgeCount >= 12, `Expected at least 12 Spotify badges on explore cards, found ${badgeCount}`);
    });

    await runTest('T1.2.5', 'Card Image Hover Transform & Footer Disclaimer', results, async () => {
      const heroSection = container.locator('section').first();
      const firstCardImg = heroSection.locator('div[class*="aspect-[16/10]"] img').first();
      assert.equal(await firstCardImg.isVisible(), true);
      
      const imgClass = await firstCardImg.getAttribute('class');
      assert.ok(imgClass.includes('group-hover:scale-105') || imgClass.includes('hover:scale'),
        'Card image should support hover zoom transition');

      // Grid footer disclaimers
      const footerLeft = container.locator('text=CONCEPT ARTIST IMAGERY');
      assert.ok(await footerLeft.count() > 0, 'Grid footer "CONCEPT ARTIST IMAGERY" should be present');
      
      const footerRight = container.locator('text=FINAL ROSTER APPROVAL REQUIRED');
      assert.ok(await footerRight.count() > 0, 'Grid footer "FINAL ROSTER APPROVAL REQUIRED" should be present');
    });

    // =========================================================================
    // SECTION 3: OFF-WHITE SECTION & EXPANDABLE GENRE LANES (00:01 - 00:02) — 5 Tests
    // =========================================================================
    console.log('\n--- Group 3: Off-White Section & Expandable Genre Lanes (00:01 - 00:02) ---');

    await runTest('T1.3.1', 'Theme Background & Text Color Switch', results, async () => {
      await scrollToY(page, 1100);
      const lanesHeading = container.locator('text=/DOES NOT WAIT/i').first();
      assert.ok(await lanesHeading.count() > 0, 'Lanes heading should exist');
      
      const lanesSection = container.locator('section').filter({ hasText: /DOES NOT WAIT/i }).first();
      const bgColor = await lanesSection.evaluate(el => window.getComputedStyle(el).backgroundColor);
      // Trillex bone color: #EFECE1, #ECEADE, #EBE7DD
      assert.ok(
        bgColor.includes('239, 236, 225') || bgColor.includes('235, 231, 221') || bgColor.includes('236, 234, 222'),
        `Lanes section background should be warm bone, got ${bgColor}`
      );
    });

    await runTest('T1.3.2', 'Lanes Eyebrow & Display Headline', results, async () => {
      const eyebrow = container.locator('text=/OUR LANES/i').filter({ hasText: /INTERNET DRIVEN MUSIC/i });
      assert.ok(await eyebrow.count() > 0, 'Lanes eyebrow should be present');

      const title = container.locator('h2').filter({ hasText: /INTERNET CULTURE DOES NOT WAIT/i });
      assert.ok(await title.count() > 0, 'Lanes title "INTERNET CULTURE DOES NOT WAIT." should be present');
    });

    await runTest('T1.3.3', '3 Genre Lanes Presence & Content', results, async () => {
      const lanes = ['HARDTEKK', 'BRAZILIAN FUNK', 'HOODTRAP'];
      for (const lane of lanes) {
        const el = container.locator(`text="${lane}"`);
        assert.ok(await el.count() > 0, `Genre lane ${lane} should be present`);
      }
      // Check indices 01, 02, 03
      const indices = ['01', '02', '03'];
      for (const idx of indices) {
        const el = container.locator(`text="${idx}"`);
        assert.ok(await el.count() > 0, `Lane index ${idx} should be present`);
      }
    });

    await runTest('T1.3.4', 'Lane Alignment & Color Hierarchy', results, async () => {
      // 01 HARDTEKK should have signal color styling
      const hardtekk = container.locator('span').filter({ hasText: 'HARDTEKK' }).first();
      const hardtekkClass = await hardtekk.getAttribute('class');
      assert.ok(
        hardtekkClass.includes('text-trillex-signal') || hardtekkClass.includes('text-[#') || hardtekkClass.includes('orange'),
        `HARDTEKK should have signal orange color, got class: ${hardtekkClass}`
      );

      // 02 BRAZILIAN FUNK is right-aligned
      const brazilian = container.locator('div').filter({ hasText: 'BRAZILIAN FUNK' }).first();
      const brClass = await brazilian.getAttribute('class');
      assert.ok(
        brClass.includes('justify-end') || brClass.includes('ml-auto') || (await brazilian.locator('.ml-auto, [class*="justify-end"]').count()) > 0,
        `BRAZILIAN FUNK row should be right-aligned, got class: ${brClass}`
      );
    });

    await runTest('T1.3.5', 'Waveform Line Accent', results, async () => {
      // Look for the waveform SVG
      const waveform = container.locator('svg[viewBox*="340 52"], svg path[d*="M0 26"]');
      assert.ok(await waveform.count() > 0, 'Waveform SVG line should be present in Lanes section');
    });

    // =========================================================================
    // SECTION 4: GLOWING SPOTIFY FOR ARTISTS GRAPH CARDS (00:03) — 5 Tests
    // =========================================================================
    console.log('\n--- Group 4: Glowing Spotify For Artists Graph Cards (00:03) ---');

    await runTest('T1.4.1', 'Dark Theme Return & Spotify Eyebrow', results, async () => {
      await scrollToY(page, 2000);
      const spotifyEyebrow = container.locator('text=/SPOTIFY FOR ARTISTS/i').filter({ hasText: /GROWTH PROOF/i });
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

    await runTest('T1.4.2', 'Spotify Section Heading & Description', results, async () => {
      const heading = container.locator('h2').filter({ hasText: /MOMENTUM/i });
      assert.ok(await heading.count() > 0, 'Heading "MOMENTUM YOU CAN SEE." should be present');

      const copy = container.locator('text=/Real growth belongs beside the record that created it/i');
      assert.ok(await copy.count() > 0, 'Spotify section copy should be present');
    });

    await runTest('T1.4.3', '3-Card Fanned Stacking Hierarchy', results, async () => {
      // Check for Back Card (ARTIST), Mid Card (GROWTH 02), Hero Card (MIMIMI HARDTEKK)
      const artistCard = container.locator('text=/ARTIST \\(/i');
      assert.ok(await artistCard.count() > 0, 'Back card "ARTIST (" should be present');

      const growthCard = container.locator('text=/GROWTH 02/i');
      assert.ok(await growthCard.count() > 0, 'Mid card "GROWTH 02" should be present');

      const heroCard = container.locator('h3').filter({ hasText: 'MIMIMI HARDTEKK' });
      assert.ok(await heroCard.count() > 0, 'Hero card "MIMIMI HARDTEKK" should be present');
    });

    await runTest('T1.4.4', 'Hero Proof Card Metrics & Title', results, async () => {
      const streams = container.locator('text=6M+');
      assert.ok(await streams.count() > 0, 'Spotify Streams metric "6M+" should be displayed');

      const daily = container.locator('text=54K');
      assert.ok(await daily.count() > 0, 'Daily at Snapshot metric "54K" should be displayed');

      const breakout = container.locator('text=BREAKOUT MOMENT');
      assert.ok(await breakout.count() > 0, 'Breakout moment label should be displayed');
    });

    await runTest('T1.4.5', 'SVG Growth Chart & Glowing Stroke', results, async () => {
      const chart = container.locator('svg[viewBox*="600 220"]');
      assert.ok(await chart.count() > 0, 'Growth chart SVG should exist with 600x220 viewBox');

      const chartLine = chart.locator('path[stroke*="#1D"], path[stroke*="#19"], #axp-chart-line');
      assert.ok(await chartLine.count() > 0, 'Green growth curve path should exist');

      const chartDot = chart.locator('circle[fill*="#1D"], circle[fill*="#19"], circle[filter*="glow"]');
      assert.ok(await chartDot.count() > 0, 'Green breakout moment dot indicator should exist');
    });

    // =========================================================================
    // SECTION 5: SOUND ID PROOF SECTION & 5M+ WATERMARK (00:04 - 00:05) — 5 Tests
    // =========================================================================
    console.log('\n--- Group 5: Sound ID Proof Section & 5M+ Watermark (00:04 - 00:05) ---');

    await runTest('T1.5.1', 'Sound ID Section Header', results, async () => {
      await scrollToY(page, 2800);
      const eyebrow = container.locator('text=/SOUND IDS/i').filter({ hasText: /CULTURAL REACH/i });
      assert.ok(await eyebrow.count() > 0, 'Sound ID eyebrow should exist');

      const heading = container.locator('h2').filter({ hasText: /ONE SOUND/i }).filter({ hasText: /MILLIONS OF/i });
      assert.ok(await heading.count() > 0, 'Headline "ONE SOUND. MILLIONS OF VIDEOS." should exist');
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
        'INTERNET CULTURE IN MOTION',
        'NEXT WINNER EVIDENCE'
      ];
      for (const title of expectedCards) {
        const el = container.locator(`text="${title}"`);
        assert.ok(await el.count() > 0, `Proof card "${title}" should exist`);
      }
    });

    await runTest('T1.5.4', 'Live Evidence Badges / Pills', results, async () => {
      const expectedPills = ['SOUND ID PROOF', 'CATALOG PROOF', 'SCREEN TREATMENT'];
      for (const pill of expectedPills) {
        const el = container.locator(`text="${pill}"`);
        assert.ok(await el.count() > 0, `Evidence pill badge "${pill}" should exist`);
      }
    });

    await runTest('T1.5.5', 'External Metric Readouts & Baselines', results, async () => {
      const expectedMetrics = ['900K+', '600K+', '5M+', 'LIVE'];
      for (const metric of expectedMetrics) {
        const el = container.locator(`text="${metric}"`);
        assert.ok(await el.count() > 0, `Proof metric "${metric}" should exist`);
      }
    });

    // =========================================================================
    // SECTION 6: HORIZONTAL RECORD RAILS & APPROVED PROOF BADGES (00:06) — 5 Tests
    // =========================================================================
    console.log('\n--- Group 6: Horizontal Record Rails & Approved Proof Badges (00:06) ---');

    await runTest('T1.6.1', 'Records Section Header & Theme', results, async () => {
      await scrollToY(page, 3800);
      const eyebrow = container.locator('text=/SELECTED PROOF/i').filter({ hasText: /REPEATABLE OUTCOMES/i });
      assert.ok(await eyebrow.count() > 0, 'Records eyebrow should exist');

      const heading = container.locator('h2').filter({ hasText: /THE RECORDS PEOPLE REPEAT\./i });
      assert.ok(await heading.count() > 0, 'Records heading "THE RECORDS PEOPLE REPEAT." should exist');

      const section = container.locator('section').filter({ hasText: /THE RECORDS PEOPLE REPEAT/i }).first();
      const bgColor = await section.evaluate(el => window.getComputedStyle(el).backgroundColor);
      assert.ok(
        bgColor.includes('239, 236, 225') || bgColor.includes('235, 231, 221') || bgColor.includes('239, 239, 239'),
        `Records section background should be cream/bone, got ${bgColor}`
      );
    });

    await runTest('T1.6.2', '5 Record Rail Cards Completeness', results, async () => {
      const sampleTitles = [
        'MIMIMI HARDTEKK',
        'ODNOGO ULTRAFUNK',
        'I WAS MADE FOR LOVIN YOU',
        'CANT FIGHT THIS FEELING'
      ];
      for (const t of sampleTitles) {
        const el = container.locator(`text=/${t}/i`);
        assert.ok(await el.count() > 0, `Record card "${t}" should exist`);
      }
    });

    await runTest('T1.6.3', 'Record Lane Tags & Styling', results, async () => {
      // Look for lane tags (HARDTEKK, BRAZILIAN FUNK)
      const hardtekkTags = container.locator('span[class*="text-trillex-signal"]').filter({ hasText: 'HARDTEKK' });
      assert.ok(await hardtekkTags.count() > 0, 'Signal orange HARDTEKK lane tag should exist on record cards');
    });

    await runTest('T1.6.4', 'Approved Proof Candidate Badges', results, async () => {
      const badges = container.locator('text=APPROVED PROOF CANDIDATE');
      const count = await badges.count();
      assert.ok(count >= 5, `Expected at least 5 APPROVED PROOF CANDIDATE badges, found ${count}`);
    });

    await runTest('T1.6.5', 'Desktop Pinning Configuration', results, async () => {
      // On desktop, the records section pin wrapper exists
      const pinContainer = container.locator('section').filter({ hasText: /THE RECORDS PEOPLE REPEAT/i }).locator('div').first();
      assert.ok(await pinContainer.count() > 0, 'Records rail pin container should exist');
    });

    // =========================================================================
    // SECTION 7: VIBRANT ORANGE 3-PILLAR WORK GRID (00:07) — 5 Tests
    // =========================================================================
    console.log('\n--- Group 7: Vibrant Orange 3-Pillar Work Grid (00:07) ---');

    await runTest('T1.7.1', 'Vibrant Signal Orange Background', results, async () => {
      await scrollToY(page, 4800);
      const workSection = container.locator('section').filter({ hasText: /MOVE FAST/i }).first();
      assert.ok(await workSection.count() > 0, 'Work section should exist');
      
      const bgColor = await workSection.evaluate(el => window.getComputedStyle(el).backgroundColor);
      // Signal orange: rgb(234, 120, 38), rgb(229, 138, 30), rgb(222, 138, 30)
      assert.ok(
        bgColor.includes('234, 120, 38') || bgColor.includes('229, 138, 30') || bgColor.includes('230, 126, 34') || bgColor.includes('222, 138, 30'),
        `Work section background should be vibrant signal orange, got ${bgColor}`
      );
    });

    await runTest('T1.7.2', 'Work Section Eyebrow', results, async () => {
      const eyebrow = container.locator('text=/WHAT THE PROOF MEANS FOR THE ARTIST/i');
      assert.ok(await eyebrow.count() > 0, 'Work section eyebrow should exist');
    });

    await runTest('T1.7.3', 'Work Section Main Headline', results, async () => {
      const heading = container.locator('h2').filter({ hasText: /MOVE FAST/i }).filter({ hasText: /BUILD/i });
      assert.ok(await heading.count() > 0, 'Work headline should exist');
    });

    await runTest('T1.7.4', '3 Pillar Titles & Indices', results, async () => {
      const expectedPillars = [
        { index: '01', title: 'SOUND ID CLAIMING' },
        { index: '02', title: 'RELEASE EXECUTION' },
        { index: '03', title: 'ARTIST COMMUNICATION' }
      ];
      for (const p of expectedPillars) {
        const titleEl = container.locator(`text="${p.title}"`);
        assert.ok(await titleEl.count() > 0, `Pillar title "${p.title}" should exist`);
        
        const idxEl = container.locator(`text="${p.index}"`);
        assert.ok(await idxEl.count() > 0, `Pillar index "${p.index}" should exist`);
      }
    });

    await runTest('T1.7.5', 'Pillar Grid Dividers & Stacking', results, async () => {
      const pillarGrid = container.locator('div.grid').filter({ hasText: 'SOUND ID CLAIMING' }).first();
      assert.ok(await pillarGrid.count() > 0, 'Pillar grid container should exist');
      
      const gridClass = await pillarGrid.getAttribute('class');
      assert.ok(gridClass.includes('sm:grid-cols-3') || gridClass.includes('grid-cols-3'),
        `Pillar grid should support 3 columns on desktop, got class: ${gridClass}`);
    });

    // =========================================================================
    // SECTION 8: CTA DEMO SUBMISSION & HASH NAVIGATION (00:08) — 5 Tests
    // =========================================================================
    console.log('\n--- Group 8: CTA Demo Submission & Hash Navigation (00:08) ---');

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
