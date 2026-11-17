// App shell for Harmony (Kevin, 29.10.2026: "app style with a bar at the bottom", the site was
// too long). The page is split into four screens (<div class="view" data-view>); a fixed bottom
// tab bar switches between them, with WhatsApp as the raised centre button. Any link to a
// section id (#workshops, #location…) opens the screen that holds it and scrolls to it, so
// the header menus and in-page buttons keep working; the back button follows the hash.
(function () {
  var root = document.documentElement;
  var WA = 'https://wa.me/972502817131';
  var L = {
    he: { nav: 'ניווט ראשי באפליקציה', home: 'בית', workshops: 'סדנאות', wa: 'וואטסאפ', gallery: 'גלריה', about: 'עלינו' },
    ar: { nav: 'التنقّل الرئيسي', home: 'الرئيسية', workshops: 'الورشات', wa: 'واتساب', gallery: 'المعرض', about: 'عنّا' },
    en: { nav: 'Main navigation', home: 'Home', workshops: 'Workshops', wa: 'WhatsApp', gallery: 'Gallery', about: 'About' }
  };
  var I = {
    home: '<path d="M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z"/>',
    workshops: '<path d="M12 21a9 9 0 1 1 9-9c0 2-1.6 3-3 3h-2a2 2 0 0 0-1.4 3.4c.6.6.4 1.6-.6 1.6z"/><circle cx="7.5" cy="11" r="1.2" fill="currentColor"/><circle cx="11" cy="7.5" r="1.2" fill="currentColor"/><circle cx="15.5" cy="8.5" r="1.2" fill="currentColor"/>',
    gallery: '<rect x="3" y="4" width="18" height="16" rx="3"/><circle cx="9" cy="10" r="2"/><path d="m21 16-5-5-9 9"/>',
    about: '<circle cx="9" cy="8" r="3.2"/><path d="M3 20c.6-3.3 3-5.2 6-5.2s5.4 1.9 6 5.2"/><circle cx="17" cy="9" r="2.4"/><path d="M16 14.6c2.6-.3 4.6 1.3 5 4.4"/>'
  };
  var WA_SVG = '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.2-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.7 11.8 11.8 0 0 0 4.5 4c1.7.7 2.3.8 3.2.6.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.2-1.2-.1-.1-.3-.2-.5-.3z"/></svg>';

  var css = ':root{--tabbar:68px}' +
    'body{padding-bottom:calc(var(--tabbar) + env(safe-area-inset-bottom,0px))}' +
    '.app-tabs{position:fixed;inset:auto 0 0 0;z-index:90;display:grid;grid-template-columns:repeat(5,1fr);align-items:end;height:calc(var(--tabbar) + env(safe-area-inset-bottom,0px));' +
    'padding:0 6px env(safe-area-inset-bottom,0px);background:var(--bg);' +
    'border-top:1px solid var(--line);color:var(--fg);box-shadow:0 -8px 24px -18px rgba(0,0,0,.35)}' +
    '@media (min-width:900px){.app-tabs{grid-template-columns:repeat(5,minmax(0,124px));justify-content:center}}' +
    '.app-tab{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:4px;height:var(--tabbar);min-width:44px;color:inherit;text-decoration:none;font:600 .74rem/1 inherit;opacity:.72;transition:opacity .2s,color .2s}' +
    '.app-tab svg{width:23px;height:23px;transition:transform .25s}' +
    '.app-tab--waze{opacity:1}.app-tab--waze svg{width:27px;height:27px}' +
    '.app-tab[aria-current=page]{opacity:1;color:var(--app-accent,currentColor)}.app-tab[aria-current=page] svg{transform:translateY(-2px)}' +
    '.app-tab:focus-visible{outline:2px solid currentColor;outline-offset:-4px;border-radius:12px}' +
    '.app-tab--wa{position:relative;justify-content:flex-end;padding-bottom:10px;opacity:1}' +
    '.app-tab--wa .app-wa{position:absolute;top:-22px;display:grid;place-items:center;width:58px;height:58px;border-radius:50%;background:#168f4f;color:#fff;border:4px solid var(--bg);box-shadow:0 8px 20px rgba(22,143,79,.45)}' +
    '.app-tab--wa .app-wa svg{width:28px;height:28px}' +
    // the floating WhatsApp lives in the bar now; the other floating buttons sit above it
    '.dm{display:none!important}' +
    'html .a11y-widget{bottom:calc(var(--tabbar) + 14px + env(safe-area-inset-bottom,0px))!important}' +
    '.ab{bottom:calc(var(--tabbar) + 16px + env(safe-area-inset-bottom,0px))!important}' +
    'html.km-open .app-tabs,body:has(.km.is-open) .app-tabs{visibility:hidden}';
  var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);

  // 29.10.2026 later: one continuous page again (screens were too short); each tab scrolls to
  // its part of the page and lights up while that part is on screen.
  var TARGET = { home: 'top', workshops: 'workshops', gallery: 'gallery', about: 'experiences' };
  var PARTS = { home: ['top', 'inside', 'vision', 'moments'], workshops: ['workshops'], gallery: ['gallery'], about: ['experiences', 'family', 'location', 'contact'] };

  var nav = document.createElement('nav');
  nav.className = 'app-tabs';
  function tab(v) { return '<a class="app-tab" href="#' + TARGET[v] + '" data-tab="' + v + '"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + I[v] + '</svg><span data-tl="' + v + '"></span></a>'; }
  nav.innerHTML = tab('home') + tab('workshops') +
    '<a class="app-tab app-tab--wa hm-wa" href="' + WA + '" target="_blank" rel="noopener"><span class="app-wa">' + WA_SVG + '</span><span data-tl="wa"></span></a>' +
    tab('gallery') +
    // Kevin 29.10.2026: Waze instead of "about" (harmony.js sets the destination)
    '<a class="app-tab app-tab--waze hm-waze" href="https://waze.com/ul?q=Mas%27ade&navigate=yes" target="_blank" rel="noopener"><svg viewBox="0 0 64 64" aria-hidden="true"><path d="M34 8.5c13.3 0 23 9.6 23 21.6 0 9.9-6.9 17.6-16.8 20.3H24.6c-4.6 0-7.8-2-9.3-5.3-3.4.2-6.6-1.2-8.6-4.1 3.6-.6 5.4-2.6 5.6-6.3.1-1.6.1-3.2.1-4.6C12.4 17.9 21.5 8.5 34 8.5z" fill="#fff" stroke="#000" stroke-width="3.6" stroke-linejoin="round"/><circle cx="28" cy="25.5" r="2.9"/><circle cx="42" cy="25.5" r="2.9"/><path d="M26.6 33.2c2.2 3.6 5 5.3 8.3 5.3s6.1-1.7 8.3-5.3" fill="none" stroke="#000" stroke-width="3.2" stroke-linecap="round"/><circle cx="24.6" cy="51.5" r="6.2"/><circle cx="45.4" cy="51.5" r="6.2"/></svg><span>Waze</span></a>';
  document.body.appendChild(nav);

  function label() {
    var l = L[(root.lang || 'he').slice(0, 2)] || L.he;
    nav.setAttribute('aria-label', l.nav);
    nav.querySelectorAll('[data-tl]').forEach(function (s) { s.textContent = l[s.getAttribute('data-tl')]; });
  }
  label();
  new MutationObserver(label).observe(root, { attributes: true, attributeFilter: ['lang'] });

  function mark(name) {
    nav.querySelectorAll('[data-tab]').forEach(function (t) {
      if (t.dataset.tab === name) t.setAttribute('aria-current', 'page'); else t.removeAttribute('aria-current');
    });
  }
  var owner = {};
  Object.keys(PARTS).forEach(function (k) { PARTS[k].forEach(function (id) { owner[id] = k; }); });
  var io = new IntersectionObserver(function (es) {
    es.forEach(function (e) { if (e.isIntersecting && owner[e.target.id]) mark(owner[e.target.id]); });
  }, { rootMargin: '-45% 0px -50% 0px' });
  Object.keys(owner).forEach(function (id) { var el = document.getElementById(id); if (el) io.observe(el); });
  nav.addEventListener('click', function (e) { var t = e.target.closest('[data-tab]'); if (t) mark(t.dataset.tab); });
  mark('home');
})();
