// tests/e2e/runner.mjs
import { preview } from 'vite';
import { chromium } from 'playwright-core';
import { DEFAULT_PORT, DEFAULT_CHROME_PATH } from './harness.mjs';
import { runTier1 } from './tier1-feature-coverage.test.mjs';
import { runTier2 } from './tier2-boundary-corners.test.mjs';
import { runTier3 } from './tier3-combinations.test.mjs';
import { runTier4 } from './tier4-real-world.test.mjs';
import { runTier5 } from './tier5-adversarial-stress.test.mjs';

const PORT = parseInt(process.env.TEST_PORT || `${DEFAULT_PORT}`, 10);
const CHROME_PATH = process.env.PLAYWRIGHT_CHROME_PATH || DEFAULT_CHROME_PATH;

// CLI argument parsing for filtering tiers: e.g. node tests/e2e/runner.mjs --tier=1
const tierArg = process.argv.find(arg => arg.startsWith('--tier='));
const targetTier = tierArg ? parseInt(tierArg.split('=')[1], 10) : null;
const includeAdversarial = process.argv.includes('--all') || process.argv.includes('--include-adversarial') || targetTier === 5;

async function main() {
  console.log('===============================================================');
  console.log('       TRILLEX ARTISTS EXPERIENCE 4-TIER E2E TEST RUNNER       ');
  console.log('===============================================================');
  console.log(`[Config] Target Port: ${PORT}`);
  console.log(`[Config] Chromium Executable: ${CHROME_PATH}`);
  if (targetTier) {
    console.log(`[Config] Filtered to Tier: ${targetTier}`);
  }

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
    passed: 0,
    failed: 0,
    errors: []
  };

  const startTime = Date.now();

  try {
    if (!targetTier || targetTier === 1) {
      await runTier1(browser, baseUrl, results);
    }
    if (!targetTier || targetTier === 2) {
      await runTier2(browser, baseUrl, results);
    }
    if (!targetTier || targetTier === 3) {
      await runTier3(browser, baseUrl, results);
    }
    if (!targetTier || targetTier === 4) {
      await runTier4(browser, baseUrl, results);
    }
    if (includeAdversarial || targetTier === 5) {
      await runTier5(browser, baseUrl, results);
    }
  } catch (fatalErr) {
    console.error('\n[Runner] Unexpected fatal error during test execution:', fatalErr);
    results.failed++;
    results.errors.push({ id: 'FATAL', name: 'Suite Execution', error: fatalErr.message });
  } finally {
    console.log('\n[Teardown] Closing Chromium browser...');
    await browser.close().catch(() => {});
    console.log('[Teardown] Stopping Vite preview server...');
    server.httpServer.close();
  }

  const durationSec = ((Date.now() - startTime) / 1000).toFixed(2);
  const total = results.passed + results.failed;

  console.log('\n===============================================================');
  console.log('                     TEST EXECUTION SUMMARY                    ');
  console.log('===============================================================');
  console.log(` Total Tests Executed : ${total}`);
  console.log(` Tests Passed         : \x1b[32m${results.passed}\x1b[0m`);
  console.log(` Tests Failed         : ${results.failed > 0 ? `\x1b[31m${results.failed}\x1b[0m` : '0'}`);
  console.log(` Execution Time       : ${durationSec}s`);
  console.log('===============================================================');

  if (results.failed > 0) {
    console.log('\n--- FAILURE DETAILS ---');
    results.errors.forEach((e, idx) => {
      console.log(`\n${idx + 1}) [${e.id}] ${e.name}`);
      console.log(`   Error: ${e.error}`);
    });
    console.log('\nResult: FAILED');
    process.exit(1);
  } else {
    console.log('\nResult: ALL TESTS PASSED');
    process.exit(0);
  }
}

main().catch(err => {
  console.error('[Runner] Unhandled top-level exception:', err);
  process.exit(1);
});
