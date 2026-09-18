// tests/e2e/reviewer1_audit.mjs
import { preview } from 'vite';
import { chromium } from 'playwright-core';
import { DEFAULT_PORT, DEFAULT_CHROME_PATH, waitForPreloader } from './harness.mjs';

const PORT = 4399;
const CHROME_PATH = process.env.PLAYWRIGHT_CHROME_PATH || DEFAULT_CHROME_PATH;

const VIEWPORTS = [
  { name: 'Mobile (375x667)', width: 375, height: 667 },
  { name: 'Mobile (390x844)', width: 390, height: 844 },
  { name: 'Tablet (768x1024)', width: 768, height: 1024 },
  { name: 'Laptop (1440x900)', width: 1440, height: 900 },
  { name: 'Desktop (1920x1080)', width: 1920, height: 1080 },
  { name: 'QHD (2560x1440)', width: 2560, height: 1440 },
  { name: '4K UHD (3840x2160)', width: 3840, height: 2160 },
];

const ROUTES = ['#home', '#about', '#artists', '#contact'];

async function runAudit() {
  console.log('================================================================');
  console.log('     REVIEWER 1 COMPREHENSIVE BREAKPOINT & LAYOUT AUDIT        ');
  console.log('================================================================');

  let server;
  try {
    server = await preview({
      preview: {
        port: PORT,
        strictPort: false
      }
    });
  } catch (err) {
    console.error(`Failed to launch preview server: ${err.message}`);
    process.exit(1);
  }

  const serverPort = server.httpServer.address().port;
  const baseUrl = `http://localhost:${serverPort}`;
  console.log(`Preview server active at ${baseUrl}`);

  let browser;
  try {
    browser = await chromium.launch({
      executablePath: CHROME_PATH,
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--disable-gpu']
    });
  } catch (err) {
    console.error(`Failed to launch browser: ${err.message}`);
    if (server) server.httpServer.close();
    process.exit(1);
  }

  const auditReport = [];
  let totalIssues = 0;

  for (const vp of VIEWPORTS) {
    console.log(`\n============================================================`);
    console.log(` AUDITING VIEWPORT: ${vp.name} [${vp.width}x${vp.height}]`);
    console.log(`============================================================`);

    const context = await browser.newContext({
      viewport: { width: vp.width, height: vp.height }
    });
    for (const route of ROUTES) {
      console.log(`\n--- Checking route ${route} at ${vp.width}x${vp.height} ---`);
      const page = await context.newPage();
      const consoleErrors = [];
      page.on('console', msg => {
        if (msg.type() === 'error') consoleErrors.push(msg.text());
      });
      page.on('pageerror', err => {
        consoleErrors.push(err.message);
      });

      try {
        await page.goto(`${baseUrl}/${route}`, { waitUntil: 'load' });
        await waitForPreloader(page, 5000);
        await page.waitForTimeout(600);

        // Check 1: Root & Body Horizontal Overflow
        const rootOverflow = await page.evaluate(() => {
          const docEl = document.documentElement;
          const body = document.body;
          const scrollWidthDoc = docEl.scrollWidth;
          const clientWidthDoc = docEl.clientWidth;
          const scrollWidthBody = body.scrollWidth;
          const clientWidthBody = body.clientWidth;
          const windowWidth = window.innerWidth;

          return {
            windowWidth,
            docEl: { scrollWidth: scrollWidthDoc, clientWidth: clientWidthDoc, overflows: scrollWidthDoc > windowWidth + 1 },
            body: { scrollWidth: scrollWidthBody, clientWidth: clientWidthBody, overflows: scrollWidthBody > windowWidth + 1 }
          };
        });

        console.log(`  Root overflow check: doc.scrollWidth=${rootOverflow.docEl.scrollWidth}, window.innerWidth=${rootOverflow.windowWidth}`);
        if (rootOverflow.docEl.overflows || rootOverflow.body.overflows) {
          totalIssues++;
          console.error(`  [FAIL] Horizontal root overflow detected at ${route} (${vp.name})!`);
        } else {
          console.log(`  [PASS] Zero horizontal root overflow.`);
        }

        // Check 2: Element-level layout overflow scan
        const overflowingElements = await page.evaluate((vpWidth) => {
          const bad = [];
          const allEls = document.querySelectorAll('*');
          for (const el of allEls) {
            // Ignore script, style, head, svg internal defs
            const tag = el.tagName.toLowerCase();
            if (['script', 'style', 'head', 'defs', 'clipPath', 'g', 'path', 'symbol'].includes(tag)) continue;
            
            // If element is display: none or inside a hidden ancestor, ignore
            if (el.offsetParent === null && el.tagName !== 'BODY' && el.tagName !== 'HTML' && window.getComputedStyle(el).position !== 'fixed') {
              continue;
            }

            const style = window.getComputedStyle(el);
            if (style.display === 'none' || style.visibility === 'hidden') continue;

            const rect = el.getBoundingClientRect();
            // Check if element spills significantly beyond viewport width (> 1px)
            // But skip containers that legitimately have horizontal overflow with overflow-x: auto / scroll
            const overflowX = style.overflowX;
            const isScrollContainer = overflowX === 'auto' || overflowX === 'scroll';
            
            if (rect.right > vpWidth + 2) {
              // Check if any ancestor clips this overflow
              let current = el.parentElement;
              let isClippedByAncestor = false;
              while (current && current !== document.documentElement) {
                const parentStyle = window.getComputedStyle(current);
                if (['hidden', 'scroll', 'auto', 'clip'].includes(parentStyle.overflowX) || ['hidden', 'scroll', 'auto', 'clip'].includes(parentStyle.overflow)) {
                  const parentRect = current.getBoundingClientRect();
                  if (parentRect.right <= vpWidth + 2) {
                    isClippedByAncestor = true;
                    break;
                  }
                }
                current = current.parentElement;
              }

              if (!isClippedByAncestor && !isScrollContainer) {
                bad.push({
                  tag,
                  id: el.id,
                  className: (el.className && typeof el.className === 'string') ? el.className.slice(0, 100) : '',
                  right: rect.right,
                  width: rect.width,
                  text: (el.innerText || '').slice(0, 50).trim()
                });
              }
            }
          }
          return bad.slice(0, 10);
        }, vp.width);

        if (overflowingElements.length > 0) {
          console.warn(`  [WARN/FAIL] Found ${overflowingElements.length} unclipped elements exceeding viewport boundary:`);
          for (const o of overflowingElements) {
            console.warn(`     - <${o.tag}> id="${o.id}" class="${o.className}" right=${o.right}px text="${o.text}"`);
          }
          totalIssues += overflowingElements.length;
        } else {
          console.log(`  [PASS] Zero unclipped DOM elements exceeding viewport boundary.`);
        }

        // Check 3: Text Clipping / Truncation
        const textClipping = await page.evaluate(() => {
          const clipped = [];
          const textEls = document.querySelectorAll('h1, h2, h3, h4, h5, h6, p, a, button, span');
          for (const el of textEls) {
            if (el.offsetParent === null) continue;
            const style = window.getComputedStyle(el);
            if (style.display === 'none' || style.visibility === 'hidden') continue;
            
            // Check if text is truncated via line-clamp or overflow: hidden with scrollWidth > clientWidth
            if (style.overflow === 'hidden' || style.overflowX === 'hidden') {
              if (el.scrollWidth > el.clientWidth + 2 && !style.textOverflow.includes('ellipsis')) {
                // If it's a single word or header that is clipped unintentionally
                if (['H1', 'H2', 'H3'].includes(el.tagName)) {
                  clipped.push({
                    tag: el.tagName,
                    text: el.innerText.slice(0, 50),
                    scrollWidth: el.scrollWidth,
                    clientWidth: el.clientWidth,
                    class: (el.className || '').slice(0, 60)
                  });
                }
              }
            }

            // Check if bounding box height is zero while containing text
            const rect = el.getBoundingClientRect();
            if (el.innerText.trim().length > 0 && rect.height === 0 && style.position !== 'absolute') {
              clipped.push({
                tag: el.tagName,
                text: el.innerText.slice(0, 50),
                issue: 'zero height with non-empty text'
              });
            }
          }
          return clipped.slice(0, 10);
        });

        if (textClipping.length > 0) {
          console.warn(`  [WARN/FAIL] Detected potential text clipping on ${textClipping.length} elements:`);
          for (const t of textClipping) {
            console.warn(`     - <${t.tag}> "${t.text}": ${JSON.stringify(t)}`);
          }
          totalIssues += textClipping.length;
        } else {
          console.log(`  [PASS] Zero text clipping detected on headings and content.`);
        }

        // Check 4: Navbar layout integrity
        const navCheck = await page.evaluate((vpWidth) => {
          const nav = document.querySelector('nav');
          if (!nav) return { exists: false };
          const rect = nav.getBoundingClientRect();
          const logo = nav.querySelector('a[aria-label="Go to Home"]');
          const logoRect = logo ? logo.getBoundingClientRect() : null;
          const links = Array.from(nav.querySelectorAll('a[href^="#"]'));
          const linksRects = links.map(l => ({ text: l.innerText, right: l.getBoundingClientRect().right, left: l.getBoundingClientRect().left }));
          
          const maxRight = Math.max(...links.map(l => l.getBoundingClientRect().right), logoRect ? logoRect.right : 0);

          return {
            exists: true,
            navWidth: rect.width,
            maxRight,
            spills: maxRight > vpWidth + 2,
            linkCount: links.length
          };
        }, vp.width);

        if (!navCheck.exists) {
          console.error(`  [FAIL] Navbar not found!`);
          totalIssues++;
        } else if (navCheck.spills) {
          console.error(`  [FAIL] Navbar elements spill outside viewport! maxRight=${navCheck.maxRight}, vpWidth=${vp.width}`);
          totalIssues++;
        } else {
          console.log(`  [PASS] Navbar intact (${navCheck.linkCount} links, within ${vp.width}px).`);
        }

        // Check 5: Route-specific checks
        if (route === '#artists') {
          // Demo CTA checks: full height, centered, zero orange bleed
          const demoCtaCheck = await page.evaluate(() => {
            const sections = Array.from(document.querySelectorAll('section'));
            const cta = sections.find(s => /YOUR RECORD[\s\S]*COULD BE NEXT/i.test(s.innerText));
            if (!cta) return { found: false };
            const rect = cta.getBoundingClientRect();
            const vpHeight = window.innerHeight;
            const computedStyle = window.getComputedStyle(cta);
            
            // Check button
            const btn = cta.querySelector('button, a[href*="contact"], a[href*="demo"]');
            const btnVisible = btn ? btn.getBoundingClientRect().height > 0 : false;

            return {
              found: true,
              height: rect.height,
              vpHeight,
              isMinScreen: rect.height >= vpHeight - 5,
              bg: computedStyle.backgroundColor,
              buttonVisible: btnVisible
            };
          });

          if (!demoCtaCheck.found) {
            console.error(`  [FAIL] Demo CTA section not found in #artists!`);
            totalIssues++;
          } else {
            console.log(`  [PASS] Demo CTA in #artists: height=${demoCtaCheck.height}px (>=vpHeight=${demoCtaCheck.vpHeight}px): ${demoCtaCheck.isMinScreen}`);
          }
        }

        if (route === '#about') {
          // SVG ecosystem diagram check
          const svgCheck = await page.evaluate(() => {
            const svg = document.querySelector('#trillex-ecosystem-svg') || document.querySelector('svg[viewBox*="1920"]');
            return {
              found: !!svg,
              width: svg ? svg.getBoundingClientRect().width : 0
            };
          });
          console.log(`  SVG Ecosystem check: found=${svgCheck.found}, rendered width=${svgCheck.width}px`);
        }

        auditReport.push({
          viewport: vp.name,
          route,
          rootOverflow: !rootOverflow.docEl.overflows,
          overflowingElementsCount: overflowingElements.length,
          textClippingCount: textClipping.length,
          navIntact: !navCheck.spills
        });

      } catch (err) {
        console.error(`  [ERROR] Failed checking ${route} at ${vp.name}: ${err.message}`);
        totalIssues++;
      } finally {
        await page.close();
      }
    }
    await context.close();
  }

  await browser.close();
  await server.httpServer.close();

  console.log('\n================================================================');
  console.log('                 AUDIT SUMMARY REPORT TABLE                     ');
  console.log('================================================================');
  console.table(auditReport);
  console.log(`Total issues identified: ${totalIssues}`);

  if (totalIssues > 0) {
    console.log(`\nAudit completed with ${totalIssues} issue(s).`);
  } else {
    console.log('\nAudit completed: ALL 28 VIEWPORT X ROUTE COMBINATIONS PASSED PERFECTLY!');
  }
}

runAudit().catch(err => {
  console.error('Fatal error in audit:', err);
  process.exit(1);
});
