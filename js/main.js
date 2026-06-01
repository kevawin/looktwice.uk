/* Look Twice — site JS.
   Behaviours:
   - Sticky tab entrance toggle (slides in past hero, hides while contact in view)
   Phase 8: nav scroll-state toggle and mobile hamburger overlay removed (D-03, D-04). */

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

/* ============================================================
   Word roller — hero H1 rotating word
   ============================================================ */

(function initWordRoller() {
  const words = ['acquisition', 'display', 'social', 'events', 'new hires', 'CRM', 'PPC', 'partnerships'];

  // Per-letter type speed, per-dot speed, hold after dots, per-char delete
  // speed, blank gap before the next word. All in ms.
  const TYPE_MS = 80;
  const DOT_MS = 250;
  const HOLD_MS = 1600;
  const DEL_MS = 45;
  const PAUSE_MS = 350;
  const DOTS = 3;

  const roller = document.querySelector('.word-roller');
  if (!roller) return;

  // Reduced motion: rest on the first word, never start the loop.
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    roller.textContent = words[0];
    return;
  }

  let wordIdx = 0;

  function typeWord() {
    const word = words[wordIdx];
    let i = 0;
    roller.textContent = '';
    (function typeChar() {
      roller.textContent = word.slice(0, ++i);
      setTimeout(i < word.length ? typeChar : () => typeDots(word, 0), TYPE_MS);
    })();
  }

  function typeDots(word, d) {
    if (d < DOTS) {
      roller.textContent = word + '.'.repeat(d + 1);
      setTimeout(() => typeDots(word, d + 1), DOT_MS);
    } else {
      setTimeout(deleteAll, HOLD_MS);
    }
  }

  function deleteAll() {
    let txt = roller.textContent;
    (function delChar() {
      txt = txt.slice(0, -1);
      roller.textContent = txt;
      if (txt.length) {
        setTimeout(delChar, DEL_MS);
      } else {
        wordIdx = (wordIdx + 1) % words.length;
        setTimeout(typeWord, PAUSE_MS);
      }
    })();
  }

  // Wait for the font so the first letters use correct metrics (no reflow jump).
  document.fonts.ready.then(typeWord);
})();
