// @ts-check
/**
 * looktwice.uk — Contact form E2E spec.
 *
 * Covers:
 *   1. Happy path  — valid submission, Formspree returns 200, form hides, success text shows.
 *   2. Validation  — required field empty, Formspree NOT called, status shows validation message,
 *                    focus lands on first invalid field.
 *   3. Honeypot    — _gotcha populated, Formspree NOT called, form silently swallows the submit.
 *   4. Error state — Formspree returns 500, status shows retry copy with NO email or mailto.
 *   Plus: zero mailto links anywhere on the page (D-02 guard).
 *
 * All Formspree traffic is intercepted by page.route() — no real POST reaches Kris's inbox
 * (T-10-02b mitigation). Tests run against a single viewport; form logic is viewport-agnostic.
 *
 * Selectors from Plan 10-01:
 *   #contact-form, #contact-status
 *   input[name="name"], input[name="email"], textarea[name="message"]
 *   input[name="_gotcha"], button.contact__submit
 */

const { test, expect } = require('@playwright/test');

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Scroll the contact form into view so the button is clickable. */
async function scrollToForm(page) {
  await page.evaluate(() => {
    document.querySelector('#contact-form')?.scrollIntoView({ behavior: 'instant' });
  });
  await page.waitForTimeout(100);
}

/** Fill the three visible required fields with valid dummy data. */
async function fillValidFields(page) {
  await page.fill('input[name="name"]',        'Test User');
  await page.fill('input[name="email"]',       'test@example.com');
  await page.fill('textarea[name="message"]',  'This is a test message about my situation.');
}

/** Intercept all Formspree POST calls and fulfill with `response`. */
function stubFormspree(page, response) {
  return page.route('**/formspree.io/**', (route) => {
    route.fulfill(response);
  });
}

// ---------------------------------------------------------------------------
// Test suite
// ---------------------------------------------------------------------------

test.describe('Contact form', () => {

  // -------------------------------------------------------------------------
  // 1. Happy path
  // -------------------------------------------------------------------------
  test('happy path: submit hides form and shows success text', async ({ page }) => {
    await stubFormspree(page, {
      status:      200,
      contentType: 'application/json',
      body:        '{"ok":true}',
    });

    await page.goto('/');
    await scrollToForm(page);

    await fillValidFields(page);
    await page.click('button.contact__submit');

    // Form becomes hidden
    await expect(page.locator('#contact-form')).toHaveAttribute('hidden', /.*/);

    // Status region has non-empty success text (wait for it)
    await expect(page.locator('#contact-status')).not.toBeEmpty();

    // Page did not navigate away
    expect(page.url()).toMatch(/\/$/);
  });

  // -------------------------------------------------------------------------
  // 2. Required-field validation
  // -------------------------------------------------------------------------
  test('validation: empty required field blocks Formspree and shows message', async ({ page }) => {
    let formspreeHit = 0;
    await page.route('**/formspree.io/**', (route) => {
      formspreeHit++;
      route.fulfill({ status: 200, contentType: 'application/json', body: '{"ok":true}' });
    });

    await page.goto('/');
    await scrollToForm(page);

    // Leave name empty; fill the other two fields
    await page.fill('input[name="email"]',      'test@example.com');
    await page.fill('textarea[name="message"]', 'Some message here.');

    await page.click('button.contact__submit');

    // Formspree must NOT have been called
    expect(formspreeHit).toBe(0);

    // Validation message in status region (wait for it)
    await expect(page.locator('#contact-status')).not.toBeEmpty();

    // Focus is on the first invalid field (the empty name input)
    const focusedName = await page.evaluate(() => document.activeElement?.getAttribute('name'));
    expect(focusedName).toBe('name');
  });

  // -------------------------------------------------------------------------
  // 3. Honeypot
  // -------------------------------------------------------------------------
  test('honeypot: populated _gotcha field silently prevents Formspree call', async ({ page }) => {
    let formspreeHit = 0;
    await page.route('**/formspree.io/**', (route) => {
      formspreeHit++;
      route.fulfill({ status: 200, contentType: 'application/json', body: '{"ok":true}' });
    });

    await page.goto('/');
    await scrollToForm(page);

    // Fill visible fields
    await fillValidFields(page);

    // Populate the honeypot field via evaluate (field is display:none)
    await page.evaluate(() => {
      const trap = document.querySelector('input[name="_gotcha"]');
      if (trap) trap.value = 'bot-bait';
    });

    await page.click('button.contact__submit');

    // Formspree must NOT have been called
    expect(formspreeHit).toBe(0);
  });

  // -------------------------------------------------------------------------
  // CSP guard: honeypot must be hidden via stylesheet, not an inline style.
  // Inline style="display:none" is blocked by style-src 'self' and the trap
  // becomes visible. This locks the fix.
  // -------------------------------------------------------------------------
  test('honeypot is hidden and uses no inline style (CSP-safe)', async ({ page }) => {
    await page.goto('/');
    const trap = page.locator('input[name="_gotcha"]');
    await expect(trap).toBeHidden();
    expect(await trap.getAttribute('style')).toBeNull();
  });

  // -------------------------------------------------------------------------
  // 4. Error state — 500 from Formspree
  // -------------------------------------------------------------------------
  test('error state: 500 from Formspree shows retry copy with no email address or mailto', async ({ page }) => {
    await stubFormspree(page, {
      status:      500,
      contentType: 'application/json',
      body:        '{}',
    });

    await page.goto('/');
    await scrollToForm(page);

    await fillValidFields(page);
    await page.click('button.contact__submit');

    // Wait for status copy to appear
    await expect(page.locator('#contact-status')).not.toBeEmpty();

    const statusText = await page.locator('#contact-status').textContent();

    // D-02 guard: no @ symbol (email address) in error copy
    expect(statusText).not.toMatch(/@/);

    // D-02 guard: no "mailto" string in error copy (case-insensitive)
    expect(statusText).not.toMatch(/mailto/i);
  });

  // -------------------------------------------------------------------------
  // D-02 global guard: zero mailto links anywhere on the page
  // -------------------------------------------------------------------------
  test('D-02 global guard: page has zero mailto links', async ({ page }) => {
    await page.goto('/');
    const count = await page.locator('a[href^="mailto:"]').count();
    expect(count).toBe(0);
  });

  // -------------------------------------------------------------------------
  // D-02 source guard: Kris's inbox must not leak in page source (e.g. JSON-LD)
  // -------------------------------------------------------------------------
  test('D-02 source guard: no email address in page source', async ({ page }) => {
    const res = await page.goto('/');
    const html = await res.text();
    expect(html).not.toMatch(/hello@looktwice\.uk/i);
    expect(html).not.toMatch(/"email"\s*:/);
  });

});
