/* Accessibility toolbar — one component for every page of the site.
   Builds its own markup, labels itself from <html lang> (he / en) and follows a later change of that attribute (the home page's language switch).
   State is kept in localStorage under "ramota-a11y", so a choice made on one page applies on all of them.
   Keyboard: Tab to the button, Enter/Space opens, Escape closes and returns focus to the button. */
(function(){
  'use strict';
  if (document.getElementById('a11yWidget')) return;
  var html = document.documentElement;
  var STORE_KEY = 'harmony-a11y';
  var CLASS_TOGGLES = ['grayscale','contrast','invert','lightbg','links','font'];
  var FONT_STEP = 10, FONT_MIN = -2, FONT_MAX = 4;
  var defaults = { grayscale:false, contrast:false, invert:false, lightbg:false, links:false, font:false, fontStep:0 };
  var state = {}; for (var d in defaults) state[d] = defaults[d];

  var L = {
    he: { title:'כלי נגישות', inc:'הגדל טקסט', dec:'הקטן טקסט', grayscale:'גווני אפור', contrast:'ניגודיות גבוהה', invert:'ניגודיות הפוכה', lightbg:'רקע בהיר', links:'הדגשת קישורים', font:'פונט קריא', reset:'איפוס', stmt:'הצהרת נגישות', stmtHref:'accessibility.html' },
    en: { title:'Accessibility tools', inc:'Increase text', dec:'Decrease text', grayscale:'Grayscale', contrast:'High contrast', invert:'Invert contrast', lightbg:'Light background', links:'Highlight links', font:'Readable font', reset:'Reset', stmt:'Accessibility statement', stmtHref:'accessibility-en.html' }
    ,ar: { title:'أدوات الإتاحة', inc:'تكبير النص', dec:'تصغير النص', grayscale:'تدرّج رمادي', contrast:'تباين عالٍ', invert:'تباين معكوس', lightbg:'خلفية فاتحة', links:'تمييز الروابط', font:'خط مقروء', reset:'إعادة ضبط', stmt:'بيان الإتاحة', stmtHref:'accessibility.html' }
  };
  var ICON = {
    person:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="4.2" r="1.6" fill="currentColor" stroke="none"/><path d="M4 8.5c2.8 1 5.3 1.5 8 1.5s5.2-.5 8-1.5"/><path d="M12 10v4.2M12 14.2 9 21M12 14.2l3 6.8M8.4 12.8 5.8 16M15.6 12.8l2.6 3.2"/></svg>',
    head:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="4.5" r="1.6" fill="currentColor" stroke="none"/><path d="M4 8.5c2.8 1 5.3 1.5 8 1.5s5.2-.5 8-1.5M12 10v4.2M12 14.2 9 21M12 14.2l3 6.8M8.4 12.8 5.8 16M15.6 12.8l2.6 3.2"/></svg>',
    inc:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="M11 8v6M8 11h6M16.5 16.5 21 21"/></svg>',
    dec:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="M8 11h6M16.5 16.5 21 21"/></svg>',
    grayscale:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 3a9 9 0 0 1 0 18z" fill="currentColor" stroke="none"/></svg>',
    contrast:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 3v18a9 9 0 0 0 0-18z" fill="currentColor" stroke="none"/></svg>',
    invert:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 12a9 9 0 1 0 9-9M3 12l4-4M3 12l4 4"/></svg>',
    lightbg:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>',
    links:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 15 15 9M10 6l1-1a4 4 0 0 1 5.7 5.7l-1 1M14 18l-1 1A4 4 0 0 1 7.3 13.3l1-1"/></svg>',
    font:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 19 10 5l5 14M6.6 14.5h6.8M17 10v9M17 10.3c.6-.4 1.3-.6 2-.6 1.4 0 2.5.9 2.5 2.4v6.9"/></svg>',
    reset:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 12a9 9 0 1 0 3-6.7"/><path d="M3 4v5h5"/></svg>'
  };
  var ITEMS = ['inc','dec','grayscale','contrast','invert','lightbg','links','font','reset'];

  function lang(){ var l = (html.lang || 'he').toLowerCase(); return l.indexOf('en') === 0 ? 'en' : l.indexOf('ar') === 0 ? 'ar' : 'he'; }

  // ---- markup ----
  var widget = document.createElement('div');
  widget.className = 'a11y-widget'; widget.id = 'a11yWidget';
  var toggle = document.createElement('button');
  toggle.className = 'a11y-toggle'; toggle.id = 'a11yToggle'; toggle.type = 'button';
  toggle.setAttribute('aria-haspopup', 'true'); toggle.setAttribute('aria-expanded', 'false'); toggle.setAttribute('aria-controls', 'a11yPanel');
  toggle.innerHTML = ICON.person;
  var panel = document.createElement('div');
  panel.className = 'a11y-panel'; panel.id = 'a11yPanel'; panel.setAttribute('role', 'group'); panel.hidden = true;
  var head = document.createElement('div'); head.className = 'a11y-panel__head';
  var headText = document.createElement('span');
  head.innerHTML = ICON.head; head.appendChild(headText);
  panel.appendChild(head);
  var itemLabel = {};
  ITEMS.forEach(function(name){
    var b = document.createElement('button');
    b.type = 'button'; b.className = 'a11y-item' + (name === 'reset' ? ' a11y-item--reset' : ''); b.dataset.action = name;
    if (CLASS_TOGGLES.indexOf(name) !== -1) b.setAttribute('aria-pressed', 'false');
    var s = document.createElement('span'); itemLabel[name] = s;
    b.appendChild(s); b.insertAdjacentHTML('beforeend', ICON[name]);
    panel.appendChild(b);
  });
  var stmt = document.createElement('a');
  stmt.className = 'a11y-item a11y-item--link';
  var stmtText = document.createElement('span'); stmt.appendChild(stmtText);
  panel.appendChild(stmt);
  widget.appendChild(toggle); widget.appendChild(panel);

  function label(){
    var t = L[lang()];
    toggle.setAttribute('aria-label', t.title); panel.setAttribute('aria-label', t.title); headText.textContent = t.title;
    ITEMS.forEach(function(n){ itemLabel[n].textContent = t[n]; });
    stmtText.textContent = t.stmt; stmt.setAttribute('href', t.stmtHref);
  }

  // ---- state ----
  function load(){
    try {
      var saved = JSON.parse(localStorage.getItem(STORE_KEY) || 'null');
      if (saved) for (var k in state) if (k in saved) state[k] = saved[k];
    } catch(e){}
  }
  function save(){ try { localStorage.setItem(STORE_KEY, JSON.stringify(state)); } catch(e){} }
  function apply(){
    CLASS_TOGGLES.forEach(function(name){ html.classList.toggle('a11y-' + name, !!state[name]); });
    html.style.fontSize = state.fontStep ? (100 + state.fontStep * FONT_STEP) + '%' : '';
    panel.querySelectorAll('.a11y-item[data-action]').forEach(function(btn){
      var a = btn.dataset.action;
      if (CLASS_TOGGLES.indexOf(a) !== -1) btn.setAttribute('aria-pressed', String(!!state[a]));
    });
  }

  function openPanel(){ widget.classList.add('open'); toggle.setAttribute('aria-expanded', 'true'); panel.hidden = false; }
  function closePanel(){ widget.classList.remove('open'); toggle.setAttribute('aria-expanded', 'false'); panel.hidden = true; }
  toggle.addEventListener('click', function(){ if (widget.classList.contains('open')) closePanel(); else openPanel(); });
  document.addEventListener('click', function(e){ if (!widget.contains(e.target)) closePanel(); });
  document.addEventListener('keydown', function(e){
    if (e.key === 'Escape' && widget.classList.contains('open')){ closePanel(); toggle.focus(); }
  });
  panel.addEventListener('click', function(e){
    var btn = e.target.closest('.a11y-item[data-action]');
    if (!btn) return;
    var action = btn.dataset.action;
    if (action === 'inc') state.fontStep = Math.min(FONT_MAX, state.fontStep + 1);
    else if (action === 'dec') state.fontStep = Math.max(FONT_MIN, state.fontStep - 1);
    else if (action === 'reset'){ for (var k in defaults) state[k] = defaults[k]; }
    else if (CLASS_TOGGLES.indexOf(action) !== -1) state[action] = !state[action];
    apply(); save();
  });

  function mount(){
    document.body.appendChild(widget);
    label(); load(); apply();
    // the home page switches <html lang> without reloading
    new MutationObserver(label).observe(html, { attributes: true, attributeFilter: ['lang'] });
  }
  if (document.body) mount(); else document.addEventListener('DOMContentLoaded', mount);
  // apply a saved choice as early as possible on pages that load this script in <head>
  load(); apply();
})();
