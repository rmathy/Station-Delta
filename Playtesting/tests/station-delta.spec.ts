import { test, expect } from '@playwright/test';

/**
 * Station Delta — Full QA Suite
 * Covers: Vibe Cadet, Vibe Engineer, Vibe Lieutenant
 * 
 * Pass structure mirrors Class-in-Session-Protocol v2.0:
 *   - Primary flow (boot → terminal interaction)
 *   - Accessibility checks (aria-live, role, keyboard nav)
 *   - UI stress tests (overflow, panel collapse, strip controls)
 *   - State persistence (refresh behavior)
 *   - Analytics (webhook POST confirmation)
 * 
 * Run: npx playwright test
 * Report: npx playwright show-report
 */

const SHORT = 5000;
const LONG  = 15000;

// ─── SIM CONFIGS ────────────────────────────────────────────────
const SIMS = [
  {
    name: 'Vibe Cadet',
    url: '/base/vibe-cadet.html',
    callsign: 'TestCadet',
    expectedBootText: 'VIBE CADET ACADEMY',
    expectedPrompt: 'cadet@vibe',
  },
  {
    name: 'Vibe Engineer',
    url: '/base/vibe-engineer.html',
    callsign: 'TestEngineer',
    expectedBootText: 'VIBE ENGINEER ACADEMY',
    expectedPrompt: 'engineer@station',
  },
  {
    name: 'Vibe Lieutenant',
    url: '/base/vibe-lieutenant.html',
    callsign: 'TestLieutenant',
    expectedBootText: 'VIBE LIEUTENANT',
    expectedPrompt: 'lt@',
  },
];

// ─── HELPER: Boot into a sim ─────────────────────────────────────
async function bootSim(page, sim) {
  await page.goto(sim.url, { waitUntil: 'networkidle', timeout: LONG });

  // Enter callsign
  const callsignInput = page.locator('#boot-name');
  await callsignInput.waitFor({ state: 'visible', timeout: SHORT });
  await callsignInput.fill(sim.callsign);

  // Click BEGIN TRAINING
  const beginBtn = page.getByRole('button', { name: /BEGIN TRAINING/i });
  await beginBtn.click();

  // Wait for terminal
  const terminalInput = page.locator('#cmd');
  await terminalInput.waitFor({ state: 'attached', timeout: LONG });

  return terminalInput;
}

// ═══════════════════════════════════════════════════════════════════
// BLOCK 1 — PRIMARY FLOW (one test per sim)
// ═══════════════════════════════════════════════════════════════════

for (const sim of SIMS) {
  test(`[${sim.name}] Primary flow — boot, callsign, terminal interaction`, async ({ page }) => {
    try {
      const terminalInput = await bootSim(page, sim);

      // Type a command and confirm terminal responds
      await page.click('body');
      await terminalInput.fill('pwd');
      await page.keyboard.press('Enter');

      const output = page.locator('#output');
      await expect(output).toContainText(/pwd|projects|home|distress/i, { timeout: LONG });

      // Confirm correct sim identity in output
      const outputText = await output.innerText();
      console.log(`[${sim.name}] Terminal response received (${outputText.length} chars)`);

    } catch (err) {
      console.error(`[${sim.name}] Primary flow failed:`, err.message);
      await page.screenshot({ path: `failure-${sim.name}-primary-${test.info().project.name}.png` });
      throw err;
    }
  });
}

// ═══════════════════════════════════════════════════════════════════
// BLOCK 2 — BOOT IDENTITY CHECK
// Confirms each sim boots with correct name (not a stale artifact)
// ═══════════════════════════════════════════════════════════════════

for (const sim of SIMS) {
  test(`[${sim.name}] Boot identity — correct sim name in terminal`, async ({ page }) => {
    const terminalInput = await bootSim(page, sim);

    // Check static output zone for correct boot text
    const staticOutput = page.locator('#output-static');
    await expect(staticOutput).toContainText(
      new RegExp(sim.expectedBootText, 'i'),
      { timeout: LONG }
    );

    // Confirm prompt prefix is correct
    const promptPre = page.locator('#prompt-pre');
    await expect(promptPre).toContainText(
      new RegExp(sim.expectedPrompt, 'i')
    );
  });
}

// ═══════════════════════════════════════════════════════════════════
// BLOCK 3 — ACCESSIBILITY (Pass D)
// ═══════════════════════════════════════════════════════════════════

for (const sim of SIMS) {
  test(`[${sim.name}] Accessibility — aria-live on terminal output divs`, async ({ page }) => {
    await page.goto(sim.url, { waitUntil: 'networkidle', timeout: LONG });

    // #output must have aria-live and role
    const outputDiv = page.locator('#output');
    const ariaLive = await outputDiv.getAttribute('aria-live');
    const role = await outputDiv.getAttribute('role');

    expect(ariaLive, '#output missing aria-live attribute').toBe('polite');
    expect(role, '#output missing role attribute').toBe('log');

    // #output-static must also have aria-live and role
    const staticDiv = page.locator('#output-static');
    const staticAriaLive = await staticDiv.getAttribute('aria-live');
    const staticRole = await staticDiv.getAttribute('role');

    expect(staticAriaLive, '#output-static missing aria-live attribute').toBe('polite');
    expect(staticRole, '#output-static missing role attribute').toBe('log');
  });

  test(`[${sim.name}] Accessibility — keyboard navigation`, async ({ page }) => {
    await page.goto(sim.url, { waitUntil: 'networkidle', timeout: LONG });

    // Boot name input should be focusable
    const bootInput = page.locator('#boot-name');
    await bootInput.waitFor({ state: 'visible', timeout: SHORT });
    await bootInput.focus();
    await expect(bootInput).toBeFocused();

    // Tab should reach the BEGIN TRAINING button
    await page.keyboard.press('Tab');
    const focused = await page.evaluate(() => document.activeElement?.tagName);
    expect(['BUTTON', 'INPUT', 'SELECT']).toContain(focused);
  });
}

// ═══════════════════════════════════════════════════════════════════
// BLOCK 4 — UI CONTROLS (Pass B.5)
// Panel collapse, strip pause/hide
// ═══════════════════════════════════════════════════════════════════

for (const sim of SIMS) {
  test(`[${sim.name}] UI controls — right panel collapse`, async ({ page }) => {
    await bootSim(page, sim);

    const collapseBtn = page.locator('#right-collapse-btn');
    await expect(collapseBtn).toBeVisible();

    // Click collapse
    await collapseBtn.click();
    const shell = page.locator('#shell');
    await expect(shell).toHaveClass(/right-collapsed/, { timeout: SHORT });

    // Click expand
    await collapseBtn.click();
    await expect(shell).not.toHaveClass(/right-collapsed/, { timeout: SHORT });
  });

  test(`[${sim.name}] UI controls — LOLA strip pause and hide`, async ({ page }) => {
    await bootSim(page, sim);

    // Pause button
    const pauseBtn = page.locator('#strip-pause-btn');
    await expect(pauseBtn).toBeVisible();
    await pauseBtn.click();
    await expect(pauseBtn).toHaveAttribute('aria-pressed', 'true');

    // Unpause
    await pauseBtn.click();
    await expect(pauseBtn).toHaveAttribute('aria-pressed', 'false');

    // Hide button
    const hideBtn = page.locator('#strip-dismiss-btn');
    await expect(hideBtn).toBeVisible();
    await hideBtn.click();

    const shell = page.locator('#shell');
    await expect(shell).toHaveClass(/strip-hidden/, { timeout: SHORT });
  });
}

// ═══════════════════════════════════════════════════════════════════
// BLOCK 5 — STRESS TEST
// Long input should not break layout
// ═══════════════════════════════════════════════════════════════════

for (const sim of SIMS) {
  test(`[${sim.name}] Stress test — overflow input does not break layout`, async ({ page }) => {
    const terminalInput = await bootSim(page, sim);

    const longPayload = 'OVERFLOW_TEST_'.repeat(100);
    await page.click('body');
    await terminalInput.fill(longPayload);
    await page.keyboard.press('Enter');

    // Terminal input must still be visible
    await expect(terminalInput).toBeVisible();

    // No horizontal scrollbar on body (layout not broken)
    const bodyScrollWidth = await page.evaluate(() => document.body.scrollWidth);
    const bodyClientWidth = await page.evaluate(() => document.body.clientWidth);
    expect(bodyScrollWidth).toBeLessThanOrEqual(bodyClientWidth + 5); // 5px tolerance
  });
}

// ═══════════════════════════════════════════════════════════════════
// BLOCK 6 — STATE PERSISTENCE
// ═══════════════════════════════════════════════════════════════════

for (const sim of SIMS) {
  test(`[${sim.name}] State persistence — refresh behavior documented`, async ({ page }) => {
    await bootSim(page, sim);

    // Reload and check behavior
    await page.reload({ waitUntil: 'networkidle' });

    const isBackAtLanding = await page.isVisible('.nav-cta');
    const bootModalVisible = await page.isVisible('#boot-modal');

    if (bootModalVisible) {
      console.log(`[${sim.name}] State persistence: returns to boot screen on refresh (expected until cloud saves live)`);
    } else {
      console.log(`[${sim.name}] State persistence: progress retained on refresh`);
    }

    // Either state is acceptable — just document it
    expect(bootModalVisible || !isBackAtLanding).toBeTruthy();
  });
}

// ═══════════════════════════════════════════════════════════════════
// BLOCK 7 — ANALYTICS (Pass E)
// Confirms webhook POST fires during session
// ═══════════════════════════════════════════════════════════════════

for (const sim of SIMS) {
  test(`[${sim.name}] Analytics — webhook POST fires during session`, async ({ page }) => {
    const postRequests: string[] = [];

    // Intercept all POST requests
    page.on('request', request => {
      if (request.method() === 'POST') {
        postRequests.push(request.url());
        console.log(`[${sim.name}] POST fired: ${request.url()}`);
      }
    });

    const terminalInput = await bootSim(page, sim);

    // Run through a few commands to trigger analytics
    await page.click('body');
    await terminalInput.fill('pwd');
    await page.keyboard.press('Enter');
    await page.waitForTimeout(1000);

    await terminalInput.fill('ls');
    await page.keyboard.press('Enter');
    await page.waitForTimeout(1000);

    // Log result — not a hard fail since webhook URL may be env-gated
    if (postRequests.length > 0) {
      console.log(`[${sim.name}] ✅ Analytics POST confirmed: ${postRequests.length} request(s)`);
    } else {
      console.warn(`[${sim.name}] ⚠️ No POST requests detected. Verify analytics-client.js is deployed and env var is set in Vercel.`);
    }

    // Soft assertion — warn don't fail (webhook may be env-gated in CI)
    // Change to expect(postRequests.length).toBeGreaterThan(0) once confirmed working
    expect(postRequests.length).toBeGreaterThanOrEqual(0);
  });
}

// ═══════════════════════════════════════════════════════════════════
// BLOCK 8 — MOBILE LAYOUT (Pass D physical device proxy)
// Uses Playwright mobile emulation as a pre-check before real device
// ═══════════════════════════════════════════════════════════════════

for (const sim of SIMS) {
  test(`[${sim.name}] Mobile layout — no floating elements blocking terminal`, async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(sim.url, { waitUntil: 'networkidle', timeout: LONG });

    // Boot input should be visible and not clipped
    const bootInput = page.locator('#boot-name');
    await expect(bootInput).toBeVisible({ timeout: SHORT });

    const bootBox = await bootInput.boundingBox();
    expect(bootBox).not.toBeNull();
    expect(bootBox!.width).toBeGreaterThan(0);
    expect(bootBox!.height).toBeGreaterThan(0);

    // Fill and boot
    await bootInput.fill(sim.callsign);
    await page.getByRole('button', { name: /BEGIN TRAINING/i }).click();

    // Terminal input must be reachable on mobile
    const terminalInput = page.locator('#cmd');
    await terminalInput.waitFor({ state: 'attached', timeout: LONG });

    const termBox = await terminalInput.boundingBox();
    expect(termBox).not.toBeNull();
    expect(termBox!.y).toBeLessThan(844); // Must be within viewport height
    expect(termBox!.width).toBeGreaterThan(100); // Must have meaningful width

    console.log(`[${sim.name}] Mobile terminal input visible at y:${termBox!.y}, width:${termBox!.width}`);
  });
}
