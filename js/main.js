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
