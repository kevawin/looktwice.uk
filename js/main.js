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
        setStatus("Something went wrong on my end. Try again, or email " + ['hello','looktwice.uk'].join('@') + " directly.", 'err');
        submit.disabled = false;
        submit.innerHTML = originalLabel;
        return;
      }
      submit.disabled = false;
      submit.innerHTML = originalLabel;
    });
  };

  // ---------- FOOTER ADDRESS (sets aria-label in correct reading order;
  //            kept out of static HTML to defeat tag-stripping scrapers,
  //            also marks span children aria-hidden so screen readers
  //            read the assembled label instead of the shuffled DOM order). ----------
  const initFooterAddress = () => {
    const a = document.querySelector('.footer__address');
    if (!a) return;
    const parts = Array.from(a.children)
      .filter((s) => s.dataset && s.dataset.o)
      .sort((x, y) => Number(x.dataset.o) - Number(y.dataset.o))
      .map((s) => s.textContent.trim());
    if (!parts.length) return;
    a.setAttribute('aria-label', parts.join(' '));
    Array.from(a.children).forEach((s) => s.setAttribute('aria-hidden', 'true'));
  };

  // ---------- FOOTER EMAIL LINK (scroll to contact + open message tab) ----------
  const initFooterEmail = () => {
    const a = document.querySelector('.footer__email');
    if (!a) return;
    a.addEventListener('click', () => {
      const msgTab = document.querySelector('[data-tab="message"]');
      if (msgTab) msgTab.click();
    });
  };

  // ---------- BOOT ----------
  initMobileNav();
  initTabs();
  initContactForm();
  initFooterAddress();
  initFooterEmail();

})();
