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
   D-12: appears once the hero text/CTA block (.hero__text) has scrolled out of
         view, via IntersectionObserver. (Was scrollY > hero.offsetHeight, but on
         mobile the cutout images stack below the text and inflate the section
         height, so the bar appeared way down the page. Observing the text block
         fires when the hero "Let's talk" CTA leaves, on both viewports.)
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

  // ---- Visibility state ----
  // pastHero: the hero text/CTA block has scrolled out of view.
  // suppressed: the #contact section is in view (don't compete with its CTA).
  let pastHero   = false;
  let suppressed = false;

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

  const applyState = () => setBarHidden(!pastHero || suppressed);

  // ---- Hero gate: show the bar once the hero text/CTA block leaves the viewport ----
  // We observe `.hero__text` (the headline + "Let's talk" CTA block), NOT the whole
  // `#hero` section. On mobile the cutout images stack below the text, so the full
  // section is ~1.6 screens tall — gating on its height made the bar appear way down
  // the page. We also can't observe the CTA element directly: on mobile it sits below
  // the fold at load, so it would read as already-out and show the bar immediately.
  // The text block IS in view at the top on load, so "no longer intersecting" cleanly
  // means the hero CTA has scrolled away. IntersectionObserver is resize-/load-proof.
  const heroText = document.querySelector('.hero__text');
  if ('IntersectionObserver' in window && heroText) {
    new IntersectionObserver((entries) => {
      pastHero = !entries[0].isIntersecting;
      applyState();
    }, { threshold: 0 }).observe(heroText);
  } else {
    // Fallback for browsers without IntersectionObserver: scroll-position gate
    // against the hero text block's bottom.
    const hero = document.querySelector('.hero');
    const heroBottom = () => {
      const t = heroText || hero;
      if (!t) return window.innerHeight;
      return t.getBoundingClientRect().bottom + window.scrollY;
    };
    let bottom = heroBottom();
    const onScroll = () => { pastHero = window.scrollY > bottom; applyState(); };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', () => { bottom = heroBottom(); onScroll(); }, { passive: true });
    onScroll();
  }

  // ---- Contact-suppress IntersectionObserver ----
  const contact = document.querySelector('#contact');
  if (contact && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          suppressed = entry.isIntersecting;
          bar.classList.toggle('floating-bar--suppressed', suppressed);
          // setBarHidden (via applyState) collapses an open menu on every hide path
          // (CR-02 + the scroll-back-behind-hero path), so no separate close call here.
          applyState();
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
   Process accordion
   ============================================================ */

(function initProcessAccordion() {
  document.querySelectorAll('.process__toggle').forEach((btn) => {
    btn.addEventListener('click', () => {
      const expanded = btn.getAttribute('aria-expanded') === 'true';
      const panel = document.getElementById(btn.getAttribute('aria-controls'));
      const item = btn.closest('.process__item');

      btn.setAttribute('aria-expanded', String(!expanded));
      panel.classList.toggle('process__panel--open', !expanded);
      item.classList.toggle('process__item--open', !expanded);
    });
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
  const button = form && form.querySelector('.contact__submit');
  if (!form || !status || !button) return;

  // Minimum time the spinner shows on the simulated (local/preview) path so the
  // send → tick morph reads instead of flashing. On the live domain the real
  // fetch sets the pace.
  const SIMULATED_DELAY_MS = 500;

  // Real submissions go to Formspree ONLY on the live domain (looktwice.uk and
  // subdomains). Everywhere else — localhost and the *.pages.dev Cloudflare
  // previews — the submit is simulated so testing never burns the Formspree
  // free-tier quota. Tests opt back into the real path via window.__LT_FORCE_SUBMIT.
  function submitsForReal() {
    if (window.__LT_FORCE_SUBMIT === true) return true;
    return /(^|\.)looktwice\.uk$/i.test(window.location.hostname);
  }

  // Button has three visual states driven by classes: default (Send label),
  // is-sending (spinner), is-sent (mail-check tick). 'sent' stays disabled.
  function setButtonState(state) {
    button.classList.toggle('contact__submit--sending', state === 'sending');
    button.classList.toggle('contact__submit--sent',    state === 'sent');
    // Disabled while sending or once sent; re-enabled on error so they can retry.
    button.disabled = (state === 'sending' || state === 'sent');
  }

  function setFieldsDisabled(disabled) {
    form.querySelectorAll('.contact__input').forEach(function (el) { el.disabled = disabled; });
  }

  // Success resolves in place: lock + dim the form (keeping the typed words),
  // morph the button to the tick, and announce the message below it via the
  // aria-live region (textContent only — T-10-01). No reset, no scroll.
  function showSuccess() {
    setButtonState('sent');
    setFieldsDisabled(true);
    form.classList.add('contact__form--submitted');
    status.classList.add('contact__status--success');
    status.textContent = 'Thanks, I\'ll be in touch within one working day.';
  }

  // Error returns to a retryable state: spinner back to the Send label, button
  // and fields re-enabled, generic no-email message (D-02 + T-10-03).
  function showError(message) {
    setButtonState('default');
    setFieldsDisabled(false);
    status.classList.remove('contact__status--success');
    status.textContent = message;
  }

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
      status.classList.remove('contact__status--success');
      status.textContent = 'Please fill in all required fields.';
      return;
    }

    // Lock the button and start the spinner.
    status.textContent = '';
    status.classList.remove('contact__status--success');
    setButtonState('sending');

    // Off the live domain: simulate success after a short spinner, never hit Formspree.
    if (!submitsForReal()) {
      setTimeout(showSuccess, SIMULATED_DELAY_MS);
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
        showSuccess();
      } else {
        showError('Something went wrong sending your message. Please try again in a moment.');
      }
    } catch (_err) {
      showError('Could not send your message. Check your connection and try again.');
    }
  });
})();
