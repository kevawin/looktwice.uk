/* Look Twice — site JS.
   Behaviours:
   - Nav scroll-state toggle (transparent → Linen on first scroll)
   - Mobile hamburger overlay open/close + Escape + focus return
   - Sticky tab entrance toggle (slides in past hero, hides while contact in view)
   Phase 6: reveal observer + supporting cutout fallback removed. */

/* ============================================================
   Nav scroll-state toggle
   ============================================================ */

if ('scrollRestoration' in history) history.scrollRestoration = 'manual';

const nav = document.querySelector('.nav');
if (nav) {
  const toggleScrolled = () => nav.classList.toggle('scrolled', window.scrollY > 0);
  toggleScrolled();
  window.addEventListener('scroll', toggleScrolled, { passive: true });
}

/* ============================================================
   Mobile hamburger overlay
   ============================================================ */

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

  overlay.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', closeOverlay);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && overlay.classList.contains('open')) {
      closeOverlay();
    }
  });
}

/* ============================================================
   Sticky tab — entrance + suppression while contact section is in view.
   D-6.11: contact has its own CTA; the sticky tab would be redundant noise
   while the visitor is reading or actioning that CTA. IntersectionObserver
   on #contact toggles a .sticky-tab--suppressed class.
   ============================================================ */

(function initStickyTab() {
  const tabs = document.querySelectorAll('.sticky-tab');
  if (tabs.length === 0) return;

  const hero = document.querySelector('.hero');
  const getThreshold = () => (hero ? hero.offsetHeight : window.innerHeight);
  let threshold = getThreshold();

  window.addEventListener('resize', () => {
    threshold = getThreshold();
  }, { passive: true });

  const onScroll = () => {
    const past = window.scrollY > threshold;
    tabs.forEach((tab) => tab.classList.toggle('sticky-tab--visible', past));
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  const contact = document.querySelector('#contact');
  if (contact && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          tabs.forEach((tab) => tab.classList.toggle('sticky-tab--suppressed', entry.isIntersecting));
        });
      },
      { threshold: 0.15 }
    );
    observer.observe(contact);
  }
})();
