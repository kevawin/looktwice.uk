/* Look Twice — site JS.
   Behaviours:
   - Floating action bar: slides in past the hero; suppressed while #contact is in view (D-12, D-13).
     setBarHidden(hidden) is the single authority for aria-hidden + inert + the --visible class.
     Both the scroll-gate (onScroll) and the #contact IntersectionObserver route through it so
     the two paths cannot set conflicting hidden/visible states (CR-01 + CR-02 fix).
   - Floating burger: mobile circular burger opens/closes nav pills; aria-expanded, Escape, focus return (D-15).
   - Word roller: hero H1 rotating word (untouched).
   Phase 8: nav scroll-state toggle and mobile hamburger overlay removed (D-03, D-04). */

/* ============================================================
   Floating bar — entrance + suppression + burger nav.
   D-12: appears once scrollY > hero.offsetHeight (threshold recomputed on resize).
   D-13: IntersectionObserver on #contact { threshold:0.15 } suppresses the bar
         while the visitor is reading or actioning the contact CTA.
   CR-01 fix: setBarHidden adds/removes `inert` on the bar root whenever the bar
              is hidden (pre-visible or suppressed) so keyboard users cannot reach
              invisible controls in either motion mode.
   CR-02 fix: the observer now syncs aria-hidden + inert via setBarHidden and calls
              closeMenu(false) when the burger is open, preventing a focus trap on
              an invisible pill.
   Both IIFEs merged into one so setBarHidden and closeMenu share scope.
   ============================================================ */

(function initFloatingBar() {
  const bar    = document.querySelector('.floating-bar');
  if (!bar) return;

  const burger = document.querySelector('.floating-bar__burger');
  const pills  = document.querySelector('.floating-bar__pills');

  // ---- Scroll-gate state ----
  const hero = document.querySelector('.hero');
  const getThreshold = () => (hero ? hero.offsetHeight : window.innerHeight);
  let threshold  = getThreshold();
  let pastHero   = false;
  let suppressed = false;

  window.addEventListener('resize', () => {
    threshold = getThreshold();
    // CR-01 (WR-01): re-apply the hidden/visible state against the new threshold.
    // Without this, a resize that crosses the threshold leaves inert/aria-hidden
    // stale until the next scroll event.
    onScroll();
  }, { passive: true });

  // ---- Single hidden/visible authority ----
  // When hidden === true:  aria-hidden="true", inert, remove --visible.
  // When hidden === false: aria-hidden="false", remove inert, add --visible.
  function setBarHidden(hidden) {
    if (hidden) {
      bar.setAttribute('aria-hidden', 'true');
      bar.setAttribute('inert', '');
      bar.classList.remove('floating-bar--visible');
      // If the mobile menu is open when the bar hides — scrolled back behind the
      // hero OR suppressed at #contact — collapse it. The open pills extend above
      // the bar, so the hide transform alone doesn't move them off-screen; without
      // this they linger, and the bar would also re-appear already-open.
      if (burger && burger.getAttribute('aria-expanded') === 'true') {
        closeMenu(false);
      }
    } else {
      bar.setAttribute('aria-hidden', 'false');
      bar.removeAttribute('inert');
      bar.classList.add('floating-bar--visible');
    }
  }

  // ---- Scroll-gate ----
  const onScroll = () => {
    pastHero = window.scrollY > threshold;
    setBarHidden(!pastHero || suppressed);
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // apply initial state

  // ---- Contact-suppress IntersectionObserver ----
  const contact = document.querySelector('#contact');
  if (contact && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          suppressed = entry.isIntersecting;
          // WR-02: recompute pastHero from the live scroll position rather than
          // trusting the cached flag. The observer and scroll listener fire order
          // is not guaranteed, so a stale pastHero could flash the wrong hidden
          // state for one frame. Reading scrollY here keeps both paths consistent.
          pastHero = window.scrollY > threshold;
          bar.classList.toggle('floating-bar--suppressed', suppressed);
          // setBarHidden now collapses an open menu on every hide path (CR-02 +
          // the scroll-back-behind-hero path), so no separate close call here.
          setBarHidden(!pastHero || suppressed);
        });
      },
      { threshold: 0.15 }
    );
    observer.observe(contact);
  }

  // ---- Burger nav (mobile) ----
  // Guard: if burger or pills are absent (e.g. in a stripped test env) skip wiring.
  if (!burger || !pills) return;

  // Disclosure pattern (not a modal menu): opening does NOT move focus into the
  // pills. Focus stays on the burger, so no focus ring appears on tap/click and
  // nothing is focused unless the user chooses to. Keyboard users Tab from the
  // burger straight into the now-visible pills (next in DOM order); Escape closes.
  function openMenu() {
    burger.setAttribute('aria-expanded', 'true');
    burger.setAttribute('aria-label', 'Close menu');
    pills.classList.add('floating-bar__pills--open');
  }

  // returnFocus (default true): when true, return focus to the burger after close.
  // Pass false on the suppression-driven close so focus is not forced onto the inert burger.
  function closeMenu(returnFocus) {
    if (returnFocus === undefined) returnFocus = true;
    burger.setAttribute('aria-expanded', 'false');
    burger.setAttribute('aria-label', 'Open menu');
    pills.classList.remove('floating-bar__pills--open');
    if (returnFocus) burger.focus();
  }

  burger.addEventListener('click', () => {
    if (burger.getAttribute('aria-expanded') === 'true') closeMenu();
    else openMenu();
  });

  // Pills only close the menu; the global initSmoothAnchors handler below does the
  // clean-URL scroll for every internal anchor (including these).
  pills.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => closeMenu());
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && burger.getAttribute('aria-expanded') === 'true') {
      closeMenu();
    }
  });
})();

/* ============================================================
   Smooth in-page anchors — clean URL navigation.
   Intercepts clicks on every internal anchor link (<a href="#section">) so the
   #hash is not written to the URL. scrollIntoView honours CSS scroll-behavior
   (smooth, suppressed under prefers-reduced-motion), so motion is unchanged.
   - Only <a> whose href starts with "#" are touched (the logo wordmark href="/"
     and the SVG <use href="#logo"> symbol reference are not anchors → ignored).
   - Links with no matching target (e.g. the #privacy placeholder, a future page)
     fall through to default behaviour.
   ============================================================ */

(function initSmoothAnchors() {
  document.addEventListener('click', (e) => {
    const link = e.target.closest('a[href^="#"]');
    if (!link) return;
    const id = link.getAttribute('href');
    if (!id || id.length < 2) return; // ignore bare "#"
    const target = document.querySelector(id);
    if (!target) return; // no in-page target → leave default behaviour
    e.preventDefault();
    target.scrollIntoView();
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

(function initContactForm() {
  const form   = document.querySelector('#contact-form');
  const status = document.querySelector('#contact-status');
  if (!form || !status) return;

  form.addEventListener('submit', async function (e) {
    e.preventDefault();

    // The _gotcha field stays empty for real people; a filled value means an
    // automated submit, so drop it silently. Guard for null in case a browser
    // extension has removed the field.
    const trap = form.querySelector('[name="_gotcha"]');
    if (trap && trap.value) return;

    // Required-field validation — focus first invalid field, announce via aria-live (D-09)
    const invalid = form.querySelector(':invalid');
    if (invalid) {
      invalid.focus();
      status.textContent = 'Please fill in all required fields.';
      return;
    }

    const data = new FormData(form);

    try {
      const res = await fetch(form.action, {
        method: 'POST',
        body: data,
        headers: { 'Accept': 'application/json' }
      });

      if (res.ok) {
        form.reset();
        // Success announced via aria-live region (D-09); textContent only (T-10-01).
        // Set the text + success styling now so screen readers announce immediately,
        // then swap the form for the message: fade the form out, fade the text in.
        status.textContent = 'Thanks, I\'ll be in touch within one working day.';
        var wrap = status.closest('.contact__status-wrap');
        if (wrap) wrap.classList.add('contact__status-wrap--success');

        var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (reduce) {
          form.hidden = true;
          if (wrap) wrap.classList.add('contact__status-wrap--visible');
        } else {
          var done = false;
          var finish = function () {
            if (done) return;
            done = true;
            form.hidden = true;
            if (wrap) wrap.classList.add('contact__status-wrap--visible');
          };
          form.addEventListener('transitionend', function onDone(ev) {
            if (ev.propertyName !== 'opacity') return;
            form.removeEventListener('transitionend', onDone);
            finish();
          });
          // Fallback if transitionend never fires (no transition support, etc.)
          setTimeout(finish, 400);
          form.classList.add('contact__form--leaving');
        }
      } else {
        // Generic retry copy — no email address in any error state (D-02 + T-10-03)
        status.textContent = 'Something went wrong sending your message. Please try again in a moment.';
      }
    } catch (_err) {
      // Network error — no email address in fallback copy (D-02 + T-10-03)
      status.textContent = 'Could not send your message. Check your connection and try again.';
    }
  });
})();
