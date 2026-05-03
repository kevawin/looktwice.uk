/* Look Twice — Phase 1 JS.
   Behaviours: nav scroll-state toggle (NAV-01, JS-02), mobile hamburger overlay open/close (NAV-04, NAV-05).
   Phase 2 will append: scroll-reveal IntersectionObserver.
   Phase 4 will append: sticky tab entrance toggle. */

// Nav scroll-state toggle (NAV-01, JS-02, JS-06).
// { passive: true } keeps scroll on the compositor thread — mandatory for scroll listeners.
const nav = document.querySelector('.nav');
if (nav) {
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 0);
  }, { passive: true });
}

// Mobile hamburger overlay open/close (NAV-04, NAV-05).
const hamburger = document.querySelector('.nav-hamburger');
const overlay = document.querySelector('.nav-overlay');
const closeBtn = document.querySelector('.nav-overlay-close');

function openOverlay() {
  overlay.classList.add('open');
  hamburger.setAttribute('aria-expanded', 'true');
  overlay.setAttribute('aria-hidden', 'false');
}

function closeOverlay() {
  overlay.classList.remove('open');
  hamburger.setAttribute('aria-expanded', 'false');
  overlay.setAttribute('aria-hidden', 'true');
  hamburger.focus();
}

if (hamburger && overlay && closeBtn) {
  hamburger.addEventListener('click', () => {
    if (overlay.classList.contains('open')) closeOverlay();
    else openOverlay();
  });

  closeBtn.addEventListener('click', closeOverlay);

  // Close overlay on link click so the anchor scrolls with overlay gone.
  overlay.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', closeOverlay);
  });

  // Escape closes the overlay and returns focus to the hamburger button (a11y best practice).
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && overlay.classList.contains('open')) {
      closeOverlay();
    }
  });
}

// ============================================================
// Generic .reveal IntersectionObserver (Phase 2 — D-14, D-15).
// One observer rules all .reveal elements site-wide. Phase 3 and
// Phase 4 add .reveal + data-reveal-index to their elements; no
// new JS needed.
// Stagger formula: delay = index × step, where step defaults to
// 80ms but can be overridden per element via data-reveal-step
// (e.g. Phase 3 services use data-reveal-step="100").
// One-shot: observer.unobserve(el) after first reveal (D-15).
// ============================================================

(function initReveal() {
  const revealEls = document.querySelectorAll('.reveal');
  if (revealEls.length === 0) return;

  // Set per-element transition-delay from data-reveal-index × data-reveal-step.
  // Done here once at boot — cheaper than reading the dataset on every intersect.
  revealEls.forEach((el) => {
    const i = parseInt(el.dataset.revealIndex || '0', 10);
    const step = parseInt(el.dataset.revealStep || '80', 10);
    el.style.transitionDelay = `${i * step}ms`;
  });

  // Graceful fallback for browsers without IntersectionObserver (very rare in 2026,
  // but covers older WebViews). Reveal everything immediately so content is never hidden.
  if (!('IntersectionObserver' in window)) {
    revealEls.forEach((el) => el.classList.add('visible'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          obs.unobserve(entry.target); // one-shot per D-15
        }
      });
    },
    {
      threshold: 0.2,        // D-13: fires when 20% of the element is in view
      rootMargin: '0px 0px -10% 0px', // small bottom inset so reveal fires comfortably inside the viewport
    }
  );

  revealEls.forEach((el) => observer.observe(el));
})();

// ============================================================
// Sticky tab entrance toggle (Phase 4 — TAB-01, TAB-02, JS-03).
// Hidden on load. Slides in once scrollY > hero height.
// One scroll listener handles both pill + 4px variants.
// { passive: true } per JS-06.
// ============================================================

(function initStickyTab() {
  const tabs = document.querySelectorAll('.sticky-tab');
  if (tabs.length === 0) return;

  const hero = document.querySelector('.hero');
  // Fallback: if hero is missing, threshold = 100vh per HOMEPAGE-SPEC §Sticky Tab
  // ("Hidden on page load. Appears after user scrolls 100vh").
  const getThreshold = () => (hero ? hero.offsetHeight : window.innerHeight);

  let threshold = getThreshold();

  // Recompute threshold on resize — hero height changes on viewport rotation / resize.
  // No debounce: this runs once per resize event, which is rare and cheap.
  window.addEventListener('resize', () => {
    threshold = getThreshold();
  }, { passive: true });

  const onScroll = () => {
    const past = window.scrollY > threshold;
    tabs.forEach((tab) => tab.classList.toggle('sticky-tab--visible', past));
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // run once on boot in case page loads with scrollY > threshold (refresh mid-page)
})();

// ============================================================
// Hero supporting cutout fallback (Phase 5 — refactor of Phase 2 inline onerror).
// If /images/hero-supporting.webp 404s, toggle .hero__cutout--missing on the
// parent so the Midnight token-block fallback shows through. Identical
// behaviour to the previous inline onerror; moved to JS so a strict CSP
// without 'unsafe-inline' on script-src does not block it.
// ============================================================

(function initSupportingCutoutFallback() {
  const wrapper = document.querySelector('[data-fallback="hero-supporting"]');
  if (!wrapper) return;
  const img = wrapper.querySelector('img');
  if (!img) return;

  const markMissing = () => {
    wrapper.classList.add('hero__cutout--missing');
    img.remove();
  };

  // If the image already failed before this listener attached (cached error),
  // the .complete + naturalWidth=0 pattern catches it on boot.
  if (img.complete && img.naturalWidth === 0) {
    markMissing();
    return;
  }

  img.addEventListener('error', markMissing, { once: true });
})();
