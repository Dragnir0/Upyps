(function () {
  'use strict';

  var root = document.documentElement;
  var STORE = 'upyps-lang';
  var LABELS = {
    fr: { open: 'Ouvrir le menu', close: 'Fermer le menu' },
    en: { open: 'Open menu', close: 'Close menu' }
  };
  var menuToggle = document.querySelector('.menu-toggle');
  var siteMenu = document.getElementById('site-menu');
  var langButtons = Array.prototype.slice.call(document.querySelectorAll('[data-lang-toggle]'));
  var current = 'fr';

  function readStored() {
    try { return localStorage.getItem(STORE); } catch (e) { return null; }
  }

  function writeStored(value) {
    try { localStorage.setItem(STORE, value); } catch (e) { /* storage unavailable: ignore */ }
  }

  function detectLanguage() {
    var stored = readStored();
    if (stored === 'fr' || stored === 'en') { return stored; }
    var nav = (navigator.language || '').toLowerCase();
    return nav.indexOf('en') === 0 ? 'en' : 'fr';
  }

  function menuIsOpen() {
    return !!(siteMenu && siteMenu.classList.contains('active'));
  }

  function updateMenuLabel() {
    if (menuToggle) {
      menuToggle.setAttribute('aria-label', menuIsOpen() ? LABELS[current].close : LABELS[current].open);
    }
  }

  function applyLanguage(lang, persist) {
    current = (lang === 'en') ? 'en' : 'fr';
    root.setAttribute('data-lang', current);
    root.setAttribute('lang', current);

    langButtons.forEach(function (button) {
      button.setAttribute('aria-pressed', String(button.getAttribute('data-lang-toggle') === current));
    });

    Array.prototype.forEach.call(document.querySelectorAll('[data-aria-fr]'), function (el) {
      var label = el.getAttribute('data-aria-' + current);
      if (label) { el.setAttribute('aria-label', label); }
    });

    var title = document.querySelector('title[data-' + current + ']');
    if (title) { document.title = title.getAttribute('data-' + current); }

    var desc = document.querySelector('meta[name="description"][data-' + current + ']');
    if (desc) { desc.setAttribute('content', desc.getAttribute('data-' + current)); }

    updateMenuLabel();
    if (persist) { writeStored(current); }
  }

  function setMenu(open, returnFocus) {
    if (!menuToggle || !siteMenu) { return; }
    siteMenu.classList.toggle('active', open);
    menuToggle.classList.toggle('active', open);
    menuToggle.setAttribute('aria-expanded', String(open));
    updateMenuLabel();
    if (!open && returnFocus) { menuToggle.focus(); }
  }

  applyLanguage(detectLanguage(), false);

  langButtons.forEach(function (button) {
    button.addEventListener('click', function () {
      applyLanguage(button.getAttribute('data-lang-toggle'), true);
    });
  });

  if (menuToggle && siteMenu) {
    menuToggle.addEventListener('click', function () { setMenu(!menuIsOpen(), false); });

    siteMenu.addEventListener('click', function (event) {
      if (event.target.closest && event.target.closest('a')) { setMenu(false, false); }
    });

    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && menuIsOpen()) { setMenu(false, true); }
    });

    document.addEventListener('click', function (event) {
      if (menuIsOpen() && !siteMenu.contains(event.target) && !menuToggle.contains(event.target)) {
        setMenu(false, false);
      }
    });
  }
}());
