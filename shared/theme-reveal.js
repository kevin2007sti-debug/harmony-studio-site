// Motion library #14: Theme reveal (light/dark switch). Plain JS, no dependencies.
// MANDATORY ON EVERY SITE (see CLAUDE-MD\50-RULES-FROM-CHAT.md, 2026-10-13).
//
// The button's sun folds into a moon (rays retract, a shadow slides across), and the new
// theme spreads over the page as an organic, wobbly blob that grows from a different
// part of the screen each time (corners, edges or centre, never the same zone twice in
// a row), until it covers everything.
// Taken from "theme-toggle" (000h by Cojeev, MIT): the reveal maths and timing are ported
// as-is; its React/motion/Radix/cva stack, morphing button body and Google-hosted fonts
// were left out. Browsers without View Transitions, and visitors who prefer less motion,
// get an instant switch.
//
// Setup:
// 1. In <head>, BEFORE any stylesheet paints, add the no-flash snippet (also in README):
//    <script>try{var t=localStorage.getItem('site-theme');document.documentElement.dataset.theme=t||'light'}catch(e){document.documentElement.dataset.theme='light'}</script>
// 2. Theme the site with tokens under :root[data-theme="light"] / :root[data-theme="dark"].
// 3. Link theme-reveal.css, add the button, load this file:
//    <button class="tr-toggle" type="button" role="switch" aria-checked="false" aria-label="מצב כהה">
//      <svg viewBox="0 0 24 24" aria-hidden="true"> (see preview.html for the icon markup) </svg>
//      <span class="tr-label" data-light="בהיר" data-dark="כהה"></span>
//    </button>
// Without a saved choice the site always opens LIGHT, even on a device set to dark.
(function () {
  var KEY = 'site-theme', root = document.documentElement;
  var zones = [[.07, .07], [.93, .07], [.93, .93], [.07, .93], [.06, .5], [.94, .5], [.5, .06], [.5, .94], [.5, .5]];
  var lastZone = -1, running = null;
  var reduced = matchMedia('(prefers-reduced-motion: reduce)');

  function saved() { try { return localStorage.getItem(KEY); } catch (e) { return null; } }
  function current() { return root.dataset.theme === 'dark' ? 'dark' : 'light'; }

  function syncButtons() {
    var dark = current() === 'dark';
    document.querySelectorAll('.tr-toggle').forEach(function (b) {
      b.setAttribute('aria-checked', String(dark));
      var l = b.querySelector('.tr-label');
      if (l) l.textContent = dark ? (l.dataset.dark || 'Dark') : (l.dataset.light || 'Light');
    });
  }

  // A varied origin: one of nine zones, never the previous one, with a little jitter.
  function origin() {
    var w = root.clientWidth, h = root.clientHeight;
    var z = Math.floor(Math.random() * (lastZone >= 0 ? 8 : 9));
    if (lastZone >= 0 && z >= lastZone) z++;
    lastZone = z;
    var j = function () { return (Math.random() - .5) * .07; };
    return { x: Math.max(12, Math.min(w - 12, w * (zones[z][0] + j()))), y: Math.max(12, Math.min(h - 12, h * (zones[z][1] + j()))) };
  }

  // Twelve smooth lobes, growing past every corner (ported from the source).
  function blob(p, o, w, h, phase) {
    var reach = Math.hypot(Math.max(o.x, w - o.x), Math.max(o.y, h - o.y)) / .72, pts = [];
    for (var i = 0; i < 12; i++) {
      var a = i * Math.PI / 6;
      var r = reach * p * (1 + .12 * Math.sin(a * 3 + p * .65 + phase) + .065 * Math.cos(a * 5 - p * .35 - phase * .7));
      pts.push([o.x + Math.cos(a) * r, o.y + Math.sin(a) * r]);
    }
    var f = function (n) { return n.toFixed(2); }, d = 'M' + f(pts[0][0]) + ' ' + f(pts[0][1]);
    for (var k = 0; k < 12; k++) {
      var b = pts[(k + 11) % 12], s = pts[k], e = pts[(k + 1) % 12], a2 = pts[(k + 2) % 12];
      d += 'C' + f(s[0] + (e[0] - b[0]) / 6) + ' ' + f(s[1] + (e[1] - b[1]) / 6) + ' ' + f(e[0] - (a2[0] - s[0]) / 6) + ' ' + f(e[1] - (a2[1] - s[1]) / 6) + ' ' + f(e[0]) + ' ' + f(e[1]);
    }
    return d + 'Z';
  }

  // cubic-bezier(.42,0,.18,1), solved numerically.
  function ease(t) {
    var lo = 0, hi = 1, x1 = .42, x2 = .18, y1 = 0, y2 = 1;
    for (var i = 0; i < 20; i++) {
      var m = (lo + hi) / 2, x = 3 * (1 - m) * (1 - m) * m * x1 + 3 * (1 - m) * m * m * x2 + m * m * m;
      if (x < t) lo = m; else hi = m;
    }
    var u = (lo + hi) / 2;
    return 3 * (1 - u) * (1 - u) * u * y1 + 3 * (1 - u) * u * u * y2 + u * u * u;
  }

  function apply(mode, animate) {
    if (running) { running(); running = null; }
    if (mode === current()) return;
    var commit = function () { root.dataset.theme = mode; syncButtons(); };
    if (!animate || reduced.matches || document.hidden || !document.startViewTransition ||
        !CSS.supports('clip-path', 'path("M0 0L1 0L1 1Z")')) { commit(); return; }

    var w = root.clientWidth, h = root.clientHeight, o = origin();
    var phase = Math.random() * Math.PI * 2, dur = 1200 + Math.random() * 180, done = false, raf = 0;
    root.style.setProperty('--tr-clip', 'path("' + blob(0, o, w, h, phase) + '")');
    root.setAttribute('data-theme-reveal', '');
    var vt = document.startViewTransition(commit);
    var finish = function () {
      if (done) return; done = true; cancelAnimationFrame(raf);
      try { vt.skipTransition(); } catch (e) {}
      root.removeAttribute('data-theme-reveal'); root.style.removeProperty('--tr-clip');
      removeEventListener('scroll', finish, true); removeEventListener('resize', finish);
    };
    running = finish;
    addEventListener('scroll', finish, { capture: true, passive: true });
    addEventListener('resize', finish, { passive: true });
    vt.ready.then(function () {
      var t0 = performance.now();
      (function step(now) {
        if (done) return;
        var k = Math.min(1, (now - t0) / dur);
        root.style.setProperty('--tr-clip', 'path("' + blob(ease(k), o, w, h, phase) + '")');
        if (k < 1) raf = requestAnimationFrame(step); else finish();
      })(t0);
    }, finish);
    vt.finished.then(finish, finish);
  }

  document.addEventListener('click', function (e) {
    var b = e.target.closest && e.target.closest('.tr-toggle');
    if (!b) return;
    var next = current() === 'dark' ? 'light' : 'dark';
    try { localStorage.setItem(KEY, next); } catch (err) {}
    apply(next, true);
  });
  // Default is LIGHT (Kevin 2026-10-23 / 26 / 27): never the device setting, and never a theme a
  // host page or extension writes onto <html>. Only the visitor's own toggle (saved above before
  // apply runs) may change it.
  function want() { return saved() === 'dark' ? 'dark' : 'light'; }
  root.dataset.theme = want();
  new MutationObserver(function () {
    if (root.dataset.theme !== want()) { root.dataset.theme = want(); syncButtons(); }
  }).observe(root, { attributes: true, attributeFilter: ['data-theme'] });
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', syncButtons); else syncButtons();
})();
