(function () {
  'use strict';

  // The language comes from the page address (/fr, /en) and is set in <html lang> by the server-rendered HTML.
  var root = document.documentElement;
  var LABELS = {
    fr: { open: 'Ouvrir le menu', close: 'Fermer le menu' },
    en: { open: 'Open menu', close: 'Close menu' }
  };
  var menuToggle = document.querySelector('.menu-toggle');
  var siteMenu = document.getElementById('site-menu');
  var current = root.getAttribute('data-lang') === 'en' ? 'en' : 'fr';

  function menuIsOpen() {
    return !!(siteMenu && siteMenu.classList.contains('active'));
  }

  function updateMenuLabel() {
    if (menuToggle) {
      menuToggle.setAttribute('aria-label', menuIsOpen() ? LABELS[current].close : LABELS[current].open);
    }
  }

  function setMenu(open, returnFocus) {
    if (!menuToggle || !siteMenu) { return; }
    siteMenu.classList.toggle('active', open);
    menuToggle.classList.toggle('active', open);
    menuToggle.setAttribute('aria-expanded', String(open));
    updateMenuLabel();
    if (!open && returnFocus) { menuToggle.focus(); }
  }

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

  /* ---- release schedule, reveal on click ---- */
  var ready = false;
  var SCHEDULE = window.UPYPS_SCHEDULE || {};

  function pad(n) { return (n < 10 ? '0' : '') + n; }
  function today() {
    var m = /[?&]preview=(\d{4}-\d{2}-\d{2})/.exec(location.search);
    if (m) { return m[1]; }
    var d = new Date();
    return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate());
  }
  function holdsOn() { return !/[?&]holds=off/.test(location.search); }
  function isLive(id, day) {
    var s = SCHEDULE[id];
    if (!s) { return false; }
    if (s.hold && holdsOn()) { return false; }
    if (s.from && day < s.from) { return false; }
    if (s.to && day > s.to) { return false; }
    return true;
  }
  function shown(el) { return !el.hidden && getComputedStyle(el).display !== 'none'; }

  function applySchedule() {
    var day = today();
    Array.prototype.forEach.call(document.querySelectorAll('[data-item]'), function (el) {
      el.hidden = !isLive(el.getAttribute('data-item'), day);
    });
    var any = false;
    Array.prototype.forEach.call(document.querySelectorAll('[data-group]'), function (g) {
      var has = Array.prototype.some.call(g.querySelectorAll('[data-item]'), function (c) { return !c.hidden; });
      g.hidden = !has;
      any = any || has;
    });
    var empty = document.getElementById('res-empty');
    if (empty) { empty.hidden = any; }
    var spotSection = document.getElementById('thisweek');
    if (spotSection) {
      var first = null;
      Array.prototype.forEach.call(spotSection.querySelectorAll('[data-spot]'), function (c) {
        var live = !first && isLive(c.getAttribute('data-spot'), day);
        c.hidden = !live;
        if (live) { first = c; }
      });
      spotSection.hidden = !first;
    }
  }

  function offLoad(slot) {
    slot.textContent = '';
    var p = document.createElement('p');
    p.className = 'rnote';
    p.textContent = current === 'fr'
      ? "Ce contenu n'a pas pu être chargé (un bloqueur de publicités peut en être la cause). Utilisez le lien texte ci-dessus."
      : 'This content could not load (an ad blocker may be the cause). Use the text link above.';
    slot.appendChild(p);
  }

  function render(btn) {
    var holder = btn.closest('[data-item],[data-spot]');
    var slot = holder && holder.querySelector('.rslot');
    if (!slot) { return; }
    slot.textContent = '';
    if (btn.getAttribute('data-kind') === 'img') {
      var a = document.createElement('a');
      a.href = btn.getAttribute('data-href-' + current) || btn.getAttribute('data-href-en');
      a.target = '_blank';
      a.rel = 'noopener noreferrer sponsored';
      var im = document.createElement('img');
      im.src = btn.getAttribute('data-src-' + current) || btn.getAttribute('data-src-en');
      im.width = +btn.getAttribute('data-w');
      im.height = +btn.getAttribute('data-h');
      im.alt = btn.getAttribute('data-alt-' + current) || '';
      im.addEventListener('error', function () { offLoad(slot); });
      a.appendChild(im);
      slot.appendChild(a);
    } else {
      var f = document.createElement('iframe');
      f.src = btn.getAttribute('data-src');
      f.width = btn.getAttribute('data-w');
      f.height = btn.getAttribute('data-h');
      f.title = btn.getAttribute('data-title-' + current) || '';
      f.setAttribute('loading', 'lazy');
      f.setAttribute('sandbox', 'allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox allow-forms');
      f.setAttribute('scrolling', btn.getAttribute('data-variant') === 'ticker' ? 'no' : 'auto');
      slot.appendChild(f);
    }
  }

  document.addEventListener('click', function (event) {
    var btn = event.target.closest && event.target.closest('button.reveal');
    if (!btn) { return; }
    var open = btn.getAttribute('aria-expanded') === 'true';
    if (open) {
      var holder = btn.closest('[data-item],[data-spot]');
      var slot = holder && holder.querySelector('.rslot');
      if (slot) { slot.textContent = ''; }
      if (holder) { holder.classList.remove('open-wide'); }
      btn.setAttribute('aria-expanded', 'false');
    } else {
      btn.setAttribute('aria-expanded', 'true');
      var h2 = btn.closest('[data-item]');
      if (h2 && btn.getAttribute('data-kind') === 'frame' && btn.getAttribute('data-variant') !== 'box') { h2.classList.add('open-wide'); }
      render(btn);
    }
  });

  function onLang() {
    if (!ready) { return; }
    Array.prototype.forEach.call(document.querySelectorAll('button.reveal[aria-expanded="true"][data-kind="img"]'), render);
  }

  applySchedule();
  ready = true;

  // Resources page: static HFM images display immediately (a privacy notice is shown); interactive tools still wait for a click.
  if (document.getElementById('res-empty')) {
    Array.prototype.forEach.call(document.querySelectorAll('.res-group button.reveal[data-kind="img"]'), function (btn) {
      var item = btn.closest('[data-item]');
      var group = btn.closest('.res-group');
      if (item && !item.hidden && group && !group.hidden) {
        btn.setAttribute('aria-expanded', 'true');
        render(btn);
      }
    });
  }
}());
