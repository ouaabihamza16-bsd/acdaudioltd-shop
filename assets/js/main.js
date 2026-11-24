/* ACD Audio – mobile menu, smooth scroll and legal modals */
(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Current year in the footer */
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  /* Mobile menu */
  var menuButton = document.getElementById('menu-button');
  var mobileMenu = document.getElementById('mobile-menu');

  function setMenu(open) {
    if (!menuButton || !mobileMenu) return;
    menuButton.setAttribute('aria-expanded', open ? 'true' : 'false');
    mobileMenu.classList.toggle('hidden', !open);
    menuButton.querySelector('.menu-open').classList.toggle('hidden', open);
    menuButton.querySelector('.menu-close').classList.toggle('hidden', !open);
    menuButton.querySelector('.sr-only').textContent = open ? 'Close menu' : 'Open menu';
  }

  if (menuButton && mobileMenu) {
    menuButton.addEventListener('click', function () {
      setMenu(menuButton.getAttribute('aria-expanded') !== 'true');
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && menuButton.getAttribute('aria-expanded') === 'true') {
        setMenu(false);
        menuButton.focus();
      }
    });

    window.addEventListener('resize', function () {
      if (window.innerWidth >= 768) setMenu(false);
    });
  }

  /* Smooth scroll for in-page links */
  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener('click', function (e) {
      var id = link.getAttribute('href');
      if (id.length < 2) return;
      var target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      setMenu(false);
      target.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
      if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1');
      target.focus({ preventScroll: true });
      if (history.pushState) history.pushState(null, '', id);
    });
  });

  /* Legal modals (<dialog>, Esc closes natively) */
  var lastTrigger = null;

  document.querySelectorAll('[data-open-modal]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var dialog = document.getElementById(btn.getAttribute('data-open-modal'));
      if (!dialog) return;
      lastTrigger = btn;
      if (typeof dialog.showModal === 'function') {
        dialog.showModal();
      } else {
        dialog.setAttribute('open', '');
      }
      document.body.style.overflow = 'hidden';
      var closeBtn = dialog.querySelector('[data-close-modal]');
      if (closeBtn) closeBtn.focus();
    });
  });

  document.querySelectorAll('dialog.legal-modal').forEach(function (dialog) {
    function close() {
      if (typeof dialog.close === 'function') {
        dialog.close();
      } else {
        dialog.removeAttribute('open');
        onClosed();
      }
    }

    function onClosed() {
      document.body.style.overflow = '';
      if (lastTrigger) lastTrigger.focus();
    }

    dialog.querySelectorAll('[data-close-modal]').forEach(function (btn) {
      btn.addEventListener('click', close);
    });

    /* Click on the backdrop closes the dialog */
    dialog.addEventListener('click', function (e) {
      if (e.target === dialog) close();
    });

    dialog.addEventListener('close', onClosed);
  });
})();
