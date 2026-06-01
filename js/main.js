/* Look Twice — site JS.
   Behaviours:
   - Floating action bar: slides in past the hero; suppressed while #contact is in view (D-12, D-13).
   - Floating burger: mobile circular burger opens/closes nav pills; aria-expanded, Escape, focus return (D-15).
   - Word roller: hero H1 rotating word (untouched).
   Phase 8: nav scroll-state toggle and mobile hamburger overlay removed (D-03, D-04). */

/* ============================================================
   Floating bar — entrance + suppression while contact section is in view.
   D-12: appears once scrollY > hero.offsetHeight (threshold recomputed on resize).
   D-13: IntersectionObserver on #contact { threshold:0.15 } suppresses the bar
         while the visitor is reading or actioning the contact CTA.
   ============================================================ */

(function initFloatingBar() {
  const bar = document.querySelector('.floating-bar');
  if (!bar) return;

  const hero = document.querySelector('.hero');
  const getThreshold = () => (hero ? hero.offsetHeight : window.innerHeight);
  let threshold = getThreshold();

  window.addEventListener('resize', () => {
    threshold = getThreshold();
  }, { passive: true });

  const onScroll = () => {
    const past = window.scrollY > threshold;
    bar.classList.toggle('floating-bar--visible', past);
    bar.setAttribute('aria-hidden', past ? 'false' : 'true');
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  const contact = document.querySelector('#contact');
  if (contact && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          bar.classList.toggle('floating-bar--suppressed', entry.isIntersecting);
        });
      },
      { threshold: 0.15 }
    );
    observer.observe(contact);
  }
})();

/* ============================================================
   Floating burger — mobile nav pill open/close.
   D-15: aria-expanded toggle; open moves focus to first pill; Escape closes
         and returns focus to the burger; pill click closes and returns focus.
   Desktop: burger is display:none; pills are always visible via CSS regardless
            of .floating-bar__pills--open — desktop nav is unaffected by this block.
   ============================================================ */

(function initFloatingBurger() {
  const bar    = document.querySelector('.floating-bar');
  const burger = document.querySelector('.floating-bar__burger');
  const pills  = document.querySelector('.floating-bar__pills');
  if (!bar || !burger || !pills) return;

  function openMenu() {
    burger.setAttribute('aria-expanded', 'true');
    burger.setAttribute('aria-label', 'Close menu');
    pills.classList.add('floating-bar__pills--open');
    const firstPill = pills.querySelector('a');
    if (firstPill) firstPill.focus();
  }

  function closeMenu() {
    burger.setAttribute('aria-expanded', 'false');
    burger.setAttribute('aria-label', 'Open menu');
    pills.classList.remove('floating-bar__pills--open');
    burger.focus();
  }

  burger.addEventListener('click', () => {
    if (burger.getAttribute('aria-expanded') === 'true') closeMenu();
    else openMenu();
  });

  pills.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', closeMenu);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && burger.getAttribute('aria-expanded') === 'true') {
      closeMenu();
    }
  });
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
