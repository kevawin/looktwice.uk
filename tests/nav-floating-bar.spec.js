// @ts-check
/**
 * looktwice.uk — Nav + floating action bar QA suite (D-18).
 *
 * Covers across 375 / 768 / 1440 px viewports:
 *   - Header: menu order Approach→Work, no Contact, no hamburger, scrolls away, gutter alignment
 *   - Floating bar gate: hidden over hero, visible past it, suppressed at #contact
 *   - CTA pill: text + href
 *   - Mobile (375): burger reveals stacked Approach-above-Work pills, X collapses
 *   - Desktop (1440): pill row visible, burger hidden
 *   - Focus management: open focuses first pill; Escape closes + returns focus to burger
 *   - Reduced motion: burger-line transition absent (0s / none) under reducedMotion:'reduce'
 *
 * Selectors come directly from Plans 01 + 02:
 *   .nav, .nav-links, .nav-link
 *   .floating-bar, .floating-bar--visible, .floating-bar--suppressed
 *   .floating-bar__cta, .floating-bar__burger, .floating-bar__burger-line
 *   .floating-bar__pills, .floating-bar__pills--open, .floating-bar__pill
 *   .hero, #contact, #approach, #work
 *
 * Desktop/mobile breakpoint (from 08-02-SUMMARY): 641px
 *   min-width:641px → pills always visible, burger hidden
 *   max-width:640px → burger, pills hidden until open
 */

const { test, expect, chromium } = require('@playwright/test');

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Scroll the page to a given Y offset and wait for the scroll to settle. */
async function scrollTo(page, y) {
  await page.evaluate((scrollY) => window.scrollTo(0, scrollY), y);
  await page.waitForTimeout(100);
}

/** Scroll an element into view and wait briefly. */
async function scrollIntoView(page, selector) {
  await page.evaluate((sel) => {
    document.querySelector(sel)?.scrollIntoView({ behavior: 'instant' });
  }, selector);
  await page.waitForTimeout(150);
}

/** Return the computed style property value for a selector. */
async function computedStyle(page, selector, prop) {
  return page.evaluate(
    ({ sel, property }) => {
      const el = document.querySelector(sel);
      if (!el) return null;
      return window.getComputedStyle(el).getPropertyValue(property);
    },
    { sel: selector, property: prop }
  );
}

/** Parse a CSS pixel value string such as "16px" → 16. */
function parsePx(val) {
  return parseFloat(val || '0');
}

// ---------------------------------------------------------------------------
// Guard helpers — skip tests that don't apply to this viewport
// ---------------------------------------------------------------------------

function isMobile(page) {
  return page.viewportSize()?.width <= 640;
}

function isDesktop(page) {
  return page.viewportSize()?.width >= 641;
}

// ---------------------------------------------------------------------------
// 1. Header — menu order, no Contact, no hamburger
// ---------------------------------------------------------------------------

test.describe('Header nav', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('nav-links has exactly 2 links: Approach then Work', async ({ page }) => {
    const links = page.locator('.nav-links .nav-link');
    await expect(links).toHaveCount(2);
    await expect(links.nth(0)).toHaveAttribute('href', '#approach');
    await expect(links.nth(1)).toHaveAttribute('href', '#work');
  });

  test('nav-links does not contain a #contact link', async ({ page }) => {
    const contactLink = page.locator('.nav-links a[href="#contact"]');
    await expect(contactLink).toHaveCount(0);
  });

  test('no .nav-hamburger element exists', async ({ page }) => {
    const hamburger = page.locator('.nav-hamburger');
    await expect(hamburger).toHaveCount(0);
  });

  test('no #nav-overlay element exists', async ({ page }) => {
    const overlay = page.locator('#nav-overlay');
    await expect(overlay).toHaveCount(0);
  });

  test('header scrolls away from the viewport after scrolling past the hero', async ({ page }) => {
    // The header is non-fixed (in-flow). After scrolling, it should leave the viewport.
    const heroHeight = await page.evaluate(() => {
      return document.querySelector('.hero')?.offsetHeight ?? window.innerHeight;
    });
    // Scroll well past the hero
    await scrollTo(page, heroHeight + 200);

    // .nav's bounding rect top should be negative (above viewport) — it is in-flow,
    // not fixed, so it scrolls off the top.
    const navBox = await page.locator('.nav').boundingBox();
    // navBox may be null if the element is scrolled completely off (that is fine too).
    if (navBox !== null) {
      expect(navBox.y).toBeLessThan(0);
    }
    // If navBox is null Playwright couldn't get its position — scrolled out of layout;
    // which also satisfies the test.
  });

  test('nav gutter padding-left uses the shared gutter expression (matches sections and footer, desktop only)', async ({ page }) => {
    // At mobile (<=640px) sections override padding-inline to 20px while the nav
    // stays at calc(var(--space-lg)*0.75) = 48px — this is intentional per the
    // Phase 8 mobile layout. The gutter alignment assertion is only meaningful at
    // desktop where both resolve to 48px.
    if (isMobile(page)) {
      test.skip();
      return;
    }

    // Sections use centered inner wrappers (max-width + margin:auto), not explicit
    // padding-inline. The shared horizontal gutter expression is
    // calc(var(--space-lg) * 0.75) = 48px — used by .nav, .footer, and all sections
    // at viewport > 640px.
    const navPaddingLeft = await computedStyle(page, '.nav', 'padding-left');
    const footerPaddingLeft = await computedStyle(page, '.footer', 'padding-left');
    const sectionPaddingLeft = await computedStyle(page, '#work', 'padding-left');

    const navPx = parsePx(navPaddingLeft);
    const footerPx = parsePx(footerPaddingLeft);
    const sectionPx = parsePx(sectionPaddingLeft);

    // Allow 1px tolerance for sub-pixel rounding.
    expect(Math.abs(navPx - footerPx)).toBeLessThanOrEqual(1);
    expect(Math.abs(navPx - sectionPx)).toBeLessThanOrEqual(1);
  });
});

// ---------------------------------------------------------------------------
// 2. Floating bar scroll gate (D-12, D-13)
// ---------------------------------------------------------------------------

test.describe('Floating bar scroll gate', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('bar is hidden at top of page (scrollY 0)', async ({ page }) => {
    await scrollTo(page, 0);
    const bar = page.locator('.floating-bar');
    // Bar should not have --visible class at top
    await expect(bar).not.toHaveClass(/floating-bar--visible/);
    // aria-hidden="true" means it is not exposed to the user
    await expect(bar).toHaveAttribute('aria-hidden', 'true');
  });

  test('bar is visible after scrolling past the hero', async ({ page }) => {
    const heroHeight = await page.evaluate(() => {
      return document.querySelector('.hero')?.offsetHeight ?? window.innerHeight;
    });
    await scrollTo(page, heroHeight + 50);

    const bar = page.locator('.floating-bar');
    await expect(bar).toHaveClass(/floating-bar--visible/);
    await expect(bar).toHaveAttribute('aria-hidden', 'false');
  });

  test('bar is suppressed when #contact is in view', async ({ page }) => {
    // Scroll to just past the hero to make bar visible first
    const heroHeight = await page.evaluate(() => {
      return document.querySelector('.hero')?.offsetHeight ?? window.innerHeight;
    });
    await scrollTo(page, heroHeight + 100);
    const bar = page.locator('.floating-bar');
    await expect(bar).toHaveClass(/floating-bar--visible/);

    // Now scroll #contact into view — IntersectionObserver fires (threshold 0.15)
    await scrollIntoView(page, '#contact');
    await page.waitForFunction(() => {
      return document.querySelector('.floating-bar')?.classList.contains('floating-bar--suppressed');
    }, { timeout: 3000 });
    await expect(bar).toHaveClass(/floating-bar--suppressed/);
  });
});

// ---------------------------------------------------------------------------
// 3. CTA pill — text and href (D-09)
// ---------------------------------------------------------------------------

test.describe('Floating bar CTA pill', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('CTA text is "Free 30-min chat"', async ({ page }) => {
    await expect(page.locator('.floating-bar__cta')).toHaveText('Free 30-min chat');
  });

  test('CTA href is "#contact"', async ({ page }) => {
    await expect(page.locator('.floating-bar__cta')).toHaveAttribute('href', '#contact');
  });
});

// ---------------------------------------------------------------------------
// 4. Mobile burger (375 only — D-08, D-10, D-15)
// ---------------------------------------------------------------------------

test.describe('Mobile burger', () => {
  // These tests only apply to the mobile-375 project
  test.beforeEach(async ({ page }) => {
    // Skip on desktop/tablet viewports
    if (isDesktop(page)) test.skip();
    // Scroll past hero so bar is visible
    await page.goto('/');
    const heroHeight = await page.evaluate(() => {
      return document.querySelector('.hero')?.offsetHeight ?? window.innerHeight;
    });
    await scrollTo(page, heroHeight + 100);
    // Ensure bar is visible before interacting
    await expect(page.locator('.floating-bar')).toHaveClass(/floating-bar--visible/);
  });

  test('burger is visible at 375px', async ({ page }) => {
    if (isDesktop(page)) return;
    await expect(page.locator('.floating-bar__burger')).toBeVisible();
  });

  test('burger has exactly two burger-line spans', async ({ page }) => {
    if (isDesktop(page)) return;
    const lines = page.locator('.floating-bar__burger-line');
    await expect(lines).toHaveCount(2);
  });

  test('pills are not visible before burger is tapped', async ({ page }) => {
    if (isDesktop(page)) return;
    // Pills should not have --open class (closed by default)
    await expect(page.locator('.floating-bar__pills')).not.toHaveClass(/floating-bar__pills--open/);
  });

  test('tapping burger sets aria-expanded true and opens pills', async ({ page }) => {
    if (isDesktop(page)) return;
    const burger = page.locator('.floating-bar__burger');
    await burger.click();
    await expect(burger).toHaveAttribute('aria-expanded', 'true');
    await expect(page.locator('.floating-bar__pills')).toHaveClass(/floating-bar__pills--open/);
  });

  test('opened pills: Approach is stacked above Work (Approach box top < Work box top)', async ({ page }) => {
    if (isDesktop(page)) return;
    await page.locator('.floating-bar__burger').click();
    // Wait for pills to be open
    await expect(page.locator('.floating-bar__pills')).toHaveClass(/floating-bar__pills--open/);

    const approachBox = await page.locator('.floating-bar__pill[href="#approach"]').boundingBox();
    const workBox = await page.locator('.floating-bar__pill[href="#work"]').boundingBox();

    expect(approachBox).not.toBeNull();
    expect(workBox).not.toBeNull();
    // Approach should be higher (smaller top value) than Work
    expect(approachBox.y).toBeLessThan(workBox.y);
  });

  test('tapping the X collapses the pills', async ({ page }) => {
    if (isDesktop(page)) return;
    const burger = page.locator('.floating-bar__burger');
    // Open then close
    await burger.click();
    await expect(burger).toHaveAttribute('aria-expanded', 'true');
    await burger.click();
    await expect(burger).toHaveAttribute('aria-expanded', 'false');
    await expect(page.locator('.floating-bar__pills')).not.toHaveClass(/floating-bar__pills--open/);
  });
});

// ---------------------------------------------------------------------------
// 5. Desktop pill row (1440 only — D-07)
// ---------------------------------------------------------------------------

test.describe('Desktop pill row', () => {
  test.beforeEach(async ({ page }) => {
    if (isMobile(page)) test.skip();
    await page.goto('/');
    const heroHeight = await page.evaluate(() => {
      return document.querySelector('.hero')?.offsetHeight ?? window.innerHeight;
    });
    await scrollTo(page, heroHeight + 100);
    await expect(page.locator('.floating-bar')).toHaveClass(/floating-bar--visible/);
  });

  test('burger is hidden on desktop', async ({ page }) => {
    if (isMobile(page)) return;
    const burger = page.locator('.floating-bar__burger');
    // display:none at 641px+ means not visible
    await expect(burger).not.toBeVisible();
  });

  test('both pills are visible as a row on desktop', async ({ page }) => {
    if (isMobile(page)) return;
    const approachPill = page.locator('.floating-bar__pill[href="#approach"]');
    const workPill = page.locator('.floating-bar__pill[href="#work"]');
    await expect(approachPill).toBeVisible();
    await expect(workPill).toBeVisible();
  });

  test('CTA is to the left of the pill cluster on desktop', async ({ page }) => {
    if (isMobile(page)) return;
    const ctaBox = await page.locator('.floating-bar__cta').boundingBox();
    const approachBox = await page.locator('.floating-bar__pill[href="#approach"]').boundingBox();
    expect(ctaBox).not.toBeNull();
    expect(approachBox).not.toBeNull();
    // CTA anchored bottom-left; pill cluster bottom-right → CTA left < pill left
    expect(ctaBox.x).toBeLessThan(approachBox.x);
  });

  test('Approach pill is to the left of Work pill on desktop (left-to-right row)', async ({ page }) => {
    if (isMobile(page)) return;
    const approachBox = await page.locator('.floating-bar__pill[href="#approach"]').boundingBox();
    const workBox = await page.locator('.floating-bar__pill[href="#work"]').boundingBox();
    expect(approachBox).not.toBeNull();
    expect(workBox).not.toBeNull();
    // Row layout: Approach left, Work right
    expect(approachBox.x).toBeLessThan(workBox.x);
    // Both roughly on the same row (tops within 10px)
    expect(Math.abs(approachBox.y - workBox.y)).toBeLessThan(10);
  });
});

// ---------------------------------------------------------------------------
// 6. Focus management + keyboard (375 only — D-15)
// ---------------------------------------------------------------------------

test.describe('Focus management (mobile)', () => {
  test.beforeEach(async ({ page }) => {
    if (isDesktop(page)) test.skip();
    await page.goto('/');
    const heroHeight = await page.evaluate(() => {
      return document.querySelector('.hero')?.offsetHeight ?? window.innerHeight;
    });
    await scrollTo(page, heroHeight + 100);
    await expect(page.locator('.floating-bar')).toHaveClass(/floating-bar--visible/);
  });

  test('opening the menu focuses the first pill (Approach)', async ({ page }) => {
    if (isDesktop(page)) return;
    await page.locator('.floating-bar__burger').click();
    await expect(page.locator('.floating-bar__pills')).toHaveClass(/floating-bar__pills--open/);
    // Active element should be the first pill link
    const activeHref = await page.evaluate(() => document.activeElement?.getAttribute('href'));
    expect(activeHref).toBe('#approach');
  });

  test('Escape closes the menu and returns focus to the burger', async ({ page }) => {
    if (isDesktop(page)) return;
    const burger = page.locator('.floating-bar__burger');
    await burger.click();
    await expect(burger).toHaveAttribute('aria-expanded', 'true');

    await page.keyboard.press('Escape');

    await expect(burger).toHaveAttribute('aria-expanded', 'false');
    await expect(page.locator('.floating-bar__pills')).not.toHaveClass(/floating-bar__pills--open/);

    // Focus should have returned to the burger
    const activeEl = await page.evaluate(() => {
      const el = document.activeElement;
      return el ? el.className : null;
    });
    expect(activeEl).toContain('floating-bar__burger');
  });

  test('tab order: CTA is reachable before burger via keyboard', async ({ page }) => {
    if (isDesktop(page)) return;
    // Tab from body — first focusable in the bar is the CTA, then the burger
    await page.evaluate(() => document.body.focus());
    // Tab until we hit the CTA or the burger
    const ctaHref = await page.evaluate(() =>
      document.querySelector('.floating-bar__cta')?.getAttribute('href')
    );
    const burgerClass = await page.evaluate(() =>
      document.querySelector('.floating-bar__burger')?.className
    );

    // Build a set of interactive elements in DOM order and check CTA comes before burger
    const order = await page.evaluate(() => {
      const allFocusable = Array.from(
        document.querySelectorAll('a[href], button, [tabindex]')
      ).filter((el) => {
        const style = window.getComputedStyle(el);
        return style.display !== 'none' && style.visibility !== 'hidden';
      });
      return allFocusable.map((el) => ({
        tag: el.tagName,
        cls: el.className,
        href: el.getAttribute('href'),
      }));
    });

    const ctaIndex = order.findIndex((el) => el.href === '#contact' && el.cls.includes('floating-bar__cta'));
    const burgerIndex = order.findIndex((el) => el.cls.includes('floating-bar__burger'));

    expect(ctaIndex).toBeGreaterThanOrEqual(0);
    expect(burgerIndex).toBeGreaterThanOrEqual(0);
    expect(ctaIndex).toBeLessThan(burgerIndex);
  });
});

// ---------------------------------------------------------------------------
// 7. Burger line → X: transition present by default, absent under reducedMotion
// ---------------------------------------------------------------------------

test.describe('Burger line transition (reduced-motion)', () => {
  // These tests run only on mobile where the burger is visible
  test('burger-line transition-duration is non-zero by default (mobile-375)', async ({ browser }) => {
    // Explicitly create a page at 375 width with no reduced-motion preference
    const ctx = await browser.newContext({
      viewport: { width: 375, height: 812 },
    });
    const page = await ctx.newPage();
    await page.goto('/');
    const heroHeight = await page.evaluate(() => {
      return document.querySelector('.hero')?.offsetHeight ?? window.innerHeight;
    });
    await scrollTo(page, heroHeight + 100);
    await expect(page.locator('.floating-bar')).toHaveClass(/floating-bar--visible/);

    // Open the menu so the CSS transition is triggered
    await page.locator('.floating-bar__burger').click();

    const transitionDuration = await page.evaluate(() => {
      const line = document.querySelector('.floating-bar__burger-line');
      if (!line) return null;
      return window.getComputedStyle(line).transitionDuration;
    });

    // Should be something other than "0s" or empty — indicates rotate transition is wired
    expect(transitionDuration).toBeTruthy();
    expect(transitionDuration).not.toBe('0s');

    await ctx.close();
  });

  test('burger-line transition-duration is 0s under reducedMotion:reduce (mobile-375)', async ({ browser }) => {
    // Create context with reduced-motion preference
    const ctx = await browser.newContext({
      viewport: { width: 375, height: 812 },
      reducedMotion: 'reduce',
    });
    const page = await ctx.newPage();
    await page.goto('/');
    const heroHeight = await page.evaluate(() => {
      return document.querySelector('.hero')?.offsetHeight ?? window.innerHeight;
    });
    await scrollTo(page, heroHeight + 100);
    await expect(page.locator('.floating-bar')).toHaveClass(/floating-bar--visible/);

    await page.locator('.floating-bar__burger').click();

    const transitionDuration = await page.evaluate(() => {
      const line = document.querySelector('.floating-bar__burger-line');
      if (!line) return null;
      return window.getComputedStyle(line).transitionDuration;
    });

    // Under reduced-motion the rotate animation should be stripped → 0s or none
    // CSS "all 0s" or individual property "0s" both satisfy this.
    const durationParsed = parseFloat(transitionDuration || '0');
    expect(durationParsed).toBe(0);

    await ctx.close();
  });
});
