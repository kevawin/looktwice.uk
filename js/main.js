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
