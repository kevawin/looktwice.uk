/* Look Twice — main.js
 * Tabs, mobile nav, logo marquee, contact form (Formspree on live domain).
 * Plain ES2018+, no framework. Runs on DOMContentLoaded via defer.
 */

(function () {
  'use strict';

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ---------- MOBILE NAV TOGGLE ----------
  const initMobileNav = () => {
    const toggle = document.getElementById('nav-toggle');
    const menu = document.getElementById('nav-menu');
    if (!toggle || !menu) return;

    const close = () => {
      toggle.setAttribute('aria-expanded', 'false');
      toggle.setAttribute('aria-label', 'Open menu');
      menu.classList.remove('nav__menu--open');
    };
    const open = () => {
      toggle.setAttribute('aria-expanded', 'true');
      toggle.setAttribute('aria-label', 'Close menu');
      menu.classList.add('nav__menu--open');
    };

    toggle.addEventListener('click', () => {
      const isOpen = toggle.getAttribute('aria-expanded') === 'true';
      isOpen ? close() : open();
    });

    menu.addEventListener('click', (e) => {
      if (e.target.tagName === 'A') close();
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') close();
    });
  };

  // ---------- TABS (contact section) ----------
  const initTabs = () => {
    const tabs = Array.from(document.querySelectorAll('[role="tab"]'));
    const panels = Array.from(document.querySelectorAll('[role="tabpanel"]'));
    if (!tabs.length || !panels.length) return;

    const activate = (key) => {
      tabs.forEach((t) => {
        const active = t.dataset.tab === key;
        t.setAttribute('aria-selected', active ? 'true' : 'false');
        t.setAttribute('tabindex', active ? '0' : '-1');
      });
      panels.forEach((p) => {
        const show = p.dataset.panel === key;
        if (show) p.removeAttribute('hidden');
        else p.setAttribute('hidden', '');
      });
    };

    tabs.forEach((tab, idx) => {
      tab.addEventListener('click', () => activate(tab.dataset.tab));
      tab.addEventListener('keydown', (e) => {
        if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft' && e.key !== 'Home' && e.key !== 'End') return;
        e.preventDefault();
        let next = idx;
        if (e.key === 'ArrowRight') next = (idx + 1) % tabs.length;
        if (e.key === 'ArrowLeft')  next = (idx - 1 + tabs.length) % tabs.length;
        if (e.key === 'Home')       next = 0;
        if (e.key === 'End')        next = tabs.length - 1;
        tabs[next].focus();
        activate(tabs[next].dataset.tab);
      });
    });
  };

  // ---------- LOGO MARQUEE ----------
  const LOGOS = [
    { file: 'lego.svg', name: 'LEGO' },
    { file: 'asda.svg', name: 'Asda' },
    { file: 'havas.svg', name: 'Havas' },
    { file: 'sanofi.svg', name: 'Sanofi' },
    { file: 'odeon.svg', name: 'Odeon' },
    { file: 'mediacom.svg', name: 'MediaCom' },
    { file: 'mbna.svg', name: 'MBNA' },
    { file: 'lundbeck.svg', name: 'Lundbeck' },
    { file: 'ucb.svg', name: 'UCB' },
    { file: 'madame-tussauds.svg', name: 'Madame Tussauds' },
    { file: 'bruntwood.svg', name: 'Bruntwood' },
    { file: 'cosatto.svg', name: 'Cosatto' },
    { file: 'russell-hobbs.svg', name: 'Russell Hobbs' },
    { file: 'lta.svg', name: 'LTA' },
  ];

  const initMarquee = () => {
    const scroller = document.getElementById('marquee-scroller');
    const track = document.getElementById('marquee-track');
    if (!scroller || !track) return;

    const makeCell = (logo, labelled) => {
      const cell = document.createElement('div');
      cell.className = 'marquee__cell';
      const img = document.createElement('img');
      img.src = `images/logos/${logo.file}`;
      img.alt = labelled ? logo.name : '';
      img.loading = 'lazy';
      img.decoding = 'async';
      cell.appendChild(img);
      return cell;
    };

    // First pass labelled (for screen readers), second pass duplicated unlabelled (for visual loop only).
    LOGOS.forEach((logo) => track.appendChild(makeCell(logo, true)));
    LOGOS.forEach((logo) => track.appendChild(makeCell(logo, false)));

    if (prefersReducedMotion) return; // static, scrollable manually only

    let halfWidth = 0;
    const measure = () => { halfWidth = track.scrollWidth / 2; };
    measure();
    track.querySelectorAll('img').forEach((img) => {
      if (!img.complete) img.addEventListener('load', measure, { once: true });
    });
    window.addEventListener('resize', measure);

    const SPEED = 0.4; // px per ms
    let last = performance.now();
    let paused = false;
    let dragging = false;
    let dragStartX = 0;
    let dragStartScroll = 0;
    let lastInteract = 0;

    const normalize = () => {
      if (halfWidth <= 0) return;
      if (scroller.scrollLeft >= halfWidth) scroller.scrollLeft -= halfWidth;
      else if (scroller.scrollLeft < 0) scroller.scrollLeft += halfWidth;
    };

    const tick = (now) => {
      const dt = now - last; last = now;
      if (!paused && !dragging) {
        scroller.scrollLeft += SPEED * dt;
        normalize();
      }
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);

    scroller.addEventListener('pointerenter', () => { paused = true; });
    scroller.addEventListener('pointerleave', () => { if (!dragging) paused = false; });
    scroller.addEventListener('focusin', () => { paused = true; });
    scroller.addEventListener('focusout', () => { paused = false; });

    scroller.addEventListener('pointerdown', (e) => {
      dragging = true;
      dragStartX = e.clientX;
      dragStartScroll = scroller.scrollLeft;
      scroller.setPointerCapture(e.pointerId);
      scroller.classList.add('dragging');
    });
    scroller.addEventListener('pointermove', (e) => {
      if (!dragging) return;
      scroller.scrollLeft = dragStartScroll - (e.clientX - dragStartX);
      normalize();
    });
    const endDrag = (e) => {
      if (!dragging) return;
      dragging = false;
      scroller.classList.remove('dragging');
      try { scroller.releasePointerCapture(e.pointerId); } catch (_) {}
      lastInteract = performance.now();
      setTimeout(() => {
        if (performance.now() - lastInteract >= 800) paused = false;
      }, 900);
    };
    scroller.addEventListener('pointerup', endDrag);
    scroller.addEventListener('pointercancel', endDrag);

    // Keyboard scroll for accessibility
    scroller.addEventListener('keydown', (e) => {
      const step = 200;
      if (e.key === 'ArrowRight') { scroller.scrollLeft += step; normalize(); e.preventDefault(); }
      else if (e.key === 'ArrowLeft')  { scroller.scrollLeft -= step; normalize(); e.preventDefault(); }
    });
  };

  // ---------- CONTACT FORM (Formspree) ----------
  const FORMSPREE_ENDPOINT = 'https://formspree.io/f/xbdbnrkr';

  const isLiveDomain = () => /(^|\.)looktwice\.uk$/i.test(window.location.hostname);

  const initContactForm = () => {
    const form = document.getElementById('contact-form');
    const status = document.getElementById('cf-status');
    const submit = document.getElementById('cf-submit');
    if (!form || !status || !submit) return;

    const setStatus = (msg, kind) => {
      status.textContent = msg;
      status.className = `form__status form__full form__status--${kind}`;
      status.hidden = false;
    };

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const data = new FormData(form);
      const name = (data.get('name') || '').toString().trim();
      const email = (data.get('email') || '').toString().trim();
      const situation = (data.get('situation') || '').toString().trim();

      if (!name || !email || !situation) {
        setStatus('Please fill in all three fields so I can come back to you.', 'err');
        return;
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        setStatus('That email address looks off — mind double-checking it?', 'err');
        return;
      }

      submit.disabled = true;
      const originalLabel = submit.innerHTML;
      submit.innerHTML = 'Sending…';

      const liveSubmit = isLiveDomain() || window.__LT_FORCE_SUBMIT === true;

      try {
        if (liveSubmit) {
          const res = await fetch(FORMSPREE_ENDPOINT, {
            method: 'POST',
            headers: { 'Accept': 'application/json' },
            body: data,
          });
          if (!res.ok) throw new Error(`HTTP ${res.status}`);
        } else {
          // Preview-mode simulation — no real POST, to protect Formspree quota.
          await new Promise((r) => setTimeout(r, 500));
        }
        setStatus("Got it — I'll be in touch within a working day to set up a chat.", 'ok');
        form.reset();
      } catch (err) {
        setStatus("Something went wrong on my end. Try again, or email hello@looktwice.uk directly.", 'err');
        submit.disabled = false;
        submit.innerHTML = originalLabel;
        return;
      }
      submit.disabled = false;
      submit.innerHTML = originalLabel;
    });
  };

  // ---------- BOOT ----------
  initMobileNav();
  initTabs();
  initMarquee();
  initContactForm();

})();
