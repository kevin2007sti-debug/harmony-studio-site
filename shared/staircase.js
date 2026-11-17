// Motion library #31: Staircase carousel, plain-JS port of staircase.tsx (no dependencies, no per-frame JS).
// Portrait photos on a staircase: the chosen one sits level at full size with its title beside it, earlier
// ones a storey up, later ones a storey down, all a little smaller. Moving slides the strip on a spring
// (a CSS linear() easing) while the photos ease to their new step and the title pops out/in.
// Buttons, dots, arrow keys, Home/End and swipe. On phones the title sits under the photo.
// Markup (images listed once; data-title is the visible title, alt the description):
//   <div data-staircase data-height="80svh" data-slide-width="clamp(150px,22vw,260px)" data-radius="14">
//     <img src="…" alt="…" data-title="…"> …
//   </div>
// Labels follow <html lang> (he / en) and the page's "langchange" event.
(function () {
  var CSS =
    '.stc-root{position:relative;isolation:isolate;overflow:hidden;display:grid;place-items:center;width:100%;' +
    'user-select:none;-webkit-user-select:none;touch-action:pan-y;outline:none;-webkit-tap-highlight-color:transparent}' +
    '.stc-root:focus-visible{box-shadow:inset 0 0 0 2px currentColor}' +
    '.stc-stage{position:relative}.stc-strip{display:flex;width:max-content}' +
    '.stc-slide{flex-shrink:0;display:block;margin:0;padding:0;border:0;aspect-ratio:3/4;overflow:hidden;cursor:pointer;will-change:transform;' +
    'background:color-mix(in oklab,currentColor 10%,transparent);-webkit-tap-highlight-color:transparent}' +
    '.stc-slide:focus-visible{outline:2px solid currentColor;outline-offset:4px}' +
    '.stc-slide>img{width:100%;height:100%;max-width:none;display:block;object-fit:cover;pointer-events:none}' +
    '.stc-titles{position:absolute;left:100%;top:0;bottom:0;margin-left:14px;z-index:-1;pointer-events:none}' +
    '.stc-title{position:absolute;left:0;top:0;bottom:0;display:flex;align-items:center;white-space:nowrap;transform-origin:0 50%}' +
    '@media (max-width:640px){.stc-titles{left:0;right:0;top:100%;bottom:auto;height:28px;margin:8px 0 0;z-index:1}' +
    '.stc-title{left:-40vw;right:-40vw;justify-content:center;transform-origin:50% 50%;font-size:16px}}' +
    '@keyframes stc-in{from{opacity:0;transform:scale(.5);filter:blur(2px)}to{opacity:1;transform:scale(1);filter:blur(0)}}' +
    '@keyframes stc-out{from{opacity:1;transform:scale(1);filter:blur(0)}to{opacity:0;transform:scale(.5);filter:blur(2px)}}' +
    '.stc-controls{position:absolute;bottom:16px;left:50%;transform:translateX(-50%);z-index:1;display:flex;align-items:center;gap:12px;padding:0 6px;' +
    'border-radius:999px;background:color-mix(in oklab,currentColor 8%,transparent);border:1px solid color-mix(in oklab,currentColor 14%,transparent)}' +
    '.stc-btn{display:grid;place-items:center;width:44px;height:44px;margin:0;padding:0;border:0;border-radius:999px;background:none;color:inherit;cursor:pointer;transition:opacity .2s,transform .2s}' +
    '.stc-btn svg{width:24px;height:24px}.stc-btn:disabled{opacity:.3;cursor:default}.stc-btn:not(:disabled):active{transform:scale(.88)}' +
    '.stc-btn:focus-visible,.stc-dot:focus-visible{outline:2px solid currentColor;outline-offset:2px}' +
    '.stc-dots{min-width:110px;display:flex;justify-content:center;align-items:center;gap:2px}' +
    // dots: a 24px target (WCAG 2.5.8) around the small visible pill
    '.stc-dot{position:relative;width:24px;height:24px;margin:0;padding:0;border:0;border-radius:999px;background:none;color:inherit;cursor:pointer;transition:width .3s}' +
    '.stc-dot::before{content:"";position:absolute;inset:8px;border-radius:999px;background:currentColor;opacity:.3;transition:opacity .3s}' +
    '.stc-dot[aria-current]{width:44px}.stc-dot[aria-current]::before{opacity:1}' +
    '.stc-sr{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}' +
    '@media (prefers-reduced-motion:reduce){.stc-strip,.stc-slide{transition:none!important}.stc-title{animation:none!important}.stc-title[data-out]{display:none}.stc-dot,.stc-btn{transition:none}}';
  var st = document.createElement('style'); st.textContent = CSS; document.head.appendChild(st);

  var L = {
    he: { region: 'גלריית תמונות', prev: 'התמונה הקודמת', next: 'התמונה הבאה', slide: function (i, n, t) { return i + ' מתוך ' + n + ': ' + t; } },
    ar: { region: 'معرض صور', prev: 'الصورة السابقة', next: 'الصورة التالية', slide: function (i, n, t) { return i + ' من ' + n + ': ' + t; } },
    en: { region: 'Photo carousel', prev: 'Previous photo', next: 'Next photo', slide: function (i, n, t) { return i + ' of ' + n + ': ' + t; } }
  };
  function springAt(t, bounce, duration) {
    var z = 1 - Math.min(Math.max(bounce, 0), 0.9), w = (2 * Math.PI) / Math.max(duration, 0.05);
    if (z >= 1) return 1 - Math.exp(-w * t) * (1 + w * t);
    var wd = w * Math.sqrt(1 - z * z);
    return 1 - Math.exp(-z * w * t) * (Math.cos(wd * t) + ((z * w) / wd) * Math.sin(wd * t));
  }
  function spring(bounce, duration) {
    var z = 1 - Math.min(Math.max(bounce, 0), 0.9), w = (2 * Math.PI) / Math.max(duration, 0.05), T = Math.log(1000) / (z * w), pts = [];
    for (var k = 0; k <= 48; k++) pts.push(+(k === 48 ? 1 : springAt((k / 48) * T, bounce, duration)).toFixed(4));
    return { easing: 'linear(' + pts.join(', ') + ')', ms: Math.round(T * 1000) };
  }
  function chev(d) {
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="' +
      (d < 0 ? 'm15 18-6-6 6-6' : 'm9 18 6-6-6-6') + '"/></svg>';
  }

  document.querySelectorAll('[data-staircase]').forEach(function (root) {
    var items = [].map.call(root.querySelectorAll(':scope > img'), function (img) {
      return { src: img.getAttribute('src'), srcset: img.getAttribute('srcset'), alt: img.alt, el: img, get title() { return img.dataset.title || img.alt; } };
    });
    var n = items.length; if (!n) return;
    var width = root.dataset.slideWidth || 'clamp(140px,22vw,260px)', radius = root.dataset.radius || '0';
    var strip = spring(0.1, 0.8), pop = spring(0.2, 0.8), active = Math.max(0, Math.min(+(root.dataset.start || 0), items.length - 1)), swipe = { id: -1, x: 0, done: false };
    root.textContent = '';
    root.classList.add('stc-root'); root.setAttribute('dir', 'ltr'); root.setAttribute('role', 'region');
    root.setAttribute('aria-roledescription', 'carousel'); root.tabIndex = 0;
    root.style.height = root.dataset.height || '80svh';
    var stage = document.createElement('div'); stage.className = 'stc-stage'; stage.style.width = width; stage.style.setProperty('--stc-w', width);
    var track = document.createElement('div'); track.className = 'stc-strip'; track.style.transition = 'transform ' + strip.ms + 'ms ' + strip.easing;
    var slides = items.map(function (it, i) {
      var b = document.createElement('button'); b.type = 'button'; b.className = 'stc-slide';
      b.style.width = width; b.style.borderRadius = radius + 'px'; b.style.transition = 'transform 600ms ease-in-out';
      var im = document.createElement('img'); im.src = it.src; if (it.srcset) { im.srcset = it.srcset; im.sizes = '260px'; }
      im.alt = it.alt; im.draggable = false; im.decoding = 'async'; im.loading = 'lazy'; im.width = 300; im.height = 400;
      b.appendChild(im);
      b.addEventListener('click', function () { if (!swipe.done) go(i); });
      track.appendChild(b); return b;
    });
    var titles = document.createElement('div'); titles.className = 'stc-titles'; titles.setAttribute('aria-hidden', 'true');
    stage.append(track, titles);
    var ctr = document.createElement('div'); ctr.className = 'stc-controls';
    var prev = document.createElement('button'), next = document.createElement('button'), dots = document.createElement('div');
    prev.type = next.type = 'button'; prev.className = next.className = 'stc-btn'; prev.innerHTML = chev(-1); next.innerHTML = chev(1);
    dots.className = 'stc-dots';
    var dotEls = items.map(function (it, i) {
      var d = document.createElement('button'); d.type = 'button'; d.className = 'stc-dot';
      d.addEventListener('click', function () { go(i); }); dots.appendChild(d); return d;
    });
    prev.addEventListener('click', function () { go(active - 1); });
    next.addEventListener('click', function () { go(active + 1); });
    ctr.append(prev, dots, next);
    ctr.addEventListener('pointerdown', function (e) { e.stopPropagation(); });
    var live = document.createElement('div'); live.className = 'stc-sr'; live.setAttribute('aria-live', 'polite'); live.setAttribute('aria-atomic', 'true');
    root.append(stage, ctr, live);

    function lab() { return L[(document.documentElement.lang || 'he').slice(0, 2)] || L.he; }
    function showTitle() {
      [].slice.call(titles.children).forEach(function (t) {
        t.setAttribute('data-out', ''); t.style.animation = 'stc-out ' + pop.ms + 'ms ' + pop.easing + ' both';
        setTimeout(function () { t.remove(); }, pop.ms);
      });
      var t = document.createElement('div'); t.className = 'stc-title'; t.textContent = items[active].title;
      t.style.animation = 'stc-in ' + pop.ms + 'ms ' + pop.easing + ' both'; titles.appendChild(t);
    }
    function paint(announce) {
      var l = lab();
      root.setAttribute('aria-label', l.region); prev.setAttribute('aria-label', l.prev); next.setAttribute('aria-label', l.next);
      prev.disabled = active <= 0; next.disabled = active >= n - 1;
      track.style.transform = 'translateX(calc(' + -active + ' * var(--stc-w)))';
      slides.forEach(function (b, i) {
        var s = i < active ? -1 : i > active ? 1 : 0;
        b.style.transform = 'translateY(' + s * 100 + '%) scale(' + (s ? 0.8 : 1) + ')';
        b.setAttribute('aria-label', l.slide(i + 1, n, items[i].title));
        if (s) b.removeAttribute('aria-current'); else b.setAttribute('aria-current', 'true');
        b.tabIndex = s ? -1 : 0;
      });
      dotEls.forEach(function (d, i) {
        d.setAttribute('aria-label', l.slide(i + 1, n, items[i].title));
        if (i === active) d.setAttribute('aria-current', 'true'); else d.removeAttribute('aria-current');
      });
      if (announce) live.textContent = l.slide(active + 1, n, items[active].title);
    }
    function go(i) {
      var to = Math.min(Math.max(Math.round(i), 0), n - 1);
      if (to === active) return;
      active = to; showTitle(); paint(true);
    }
    root.addEventListener('keydown', function (e) {
      var to = -1;
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') to = active + 1;
      else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') to = active - 1;
      else if (e.key === 'Home') to = 0;
      else if (e.key === 'End') to = n - 1;
      else return;
      e.preventDefault(); go(to);
    });
    root.addEventListener('pointerdown', function (e) { swipe = { id: e.pointerId, x: e.clientX, done: false }; });
    root.addEventListener('pointermove', function (e) {
      if (swipe.id !== e.pointerId || swipe.done) return;
      var dx = e.clientX - swipe.x;
      if (Math.abs(dx) > 40) { swipe.done = true; go(active + (dx < 0 ? 1 : -1)); }
    });
    function end() { swipe.id = -1; setTimeout(function () { swipe.done = false; }, 0); }
    root.addEventListener('pointerup', end); root.addEventListener('pointercancel', end);
    document.addEventListener('langchange', function () { paint(false); showTitle(); });
    showTitle(); paint(false);
  });
})();
