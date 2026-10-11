(function () {
  const root = document.documentElement;
  const buttons = Array.from(document.querySelectorAll('[data-lang-toggle]'));

  function applyLanguage(lang) {
    if (lang !== 'fr' && lang !== 'en') {
      lang = 'fr';
    }

    root.setAttribute('data-lang', lang);
    root.setAttribute('lang', lang);

    buttons.forEach((button) => {
      const isActive = button.getAttribute('data-lang-toggle') === lang;
      button.setAttribute('aria-pressed', String(isActive));
    });

    try {
      localStorage.setItem('upyps-lang', lang);
    } catch (error) {
      // no-op
    }
  }

  const storedLang = (() => {
    try {
      return localStorage.getItem('upyps-lang');
    } catch (error) {
      return null;
    }
  })();

  const browserLang = (navigator.language || '').toLowerCase();
  const initialLang = storedLang === 'fr' || storedLang === 'en'
    ? storedLang
    : (browserLang.indexOf('en') === 0 ? 'en' : 'fr');

  applyLanguage(initialLang);

  buttons.forEach((button) => {
    button.addEventListener('click', function () {
      applyLanguage(button.getAttribute('data-lang-toggle'));
    });
  });
}());
