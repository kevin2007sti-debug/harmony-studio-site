// Motion library #13: Orbit arch. Plain JS, no dependencies.
// On load, photo cards fly in from scattered spots into a straight row, then close into
// a ring around the headline. Scrolling then opens the ring into a wide rainbow arch
// across the top while the first headline fades out and a second one fades in under the
// arch; scrolling further pans the cards along the arch. The arch also drifts a little
// with the mouse.
// Taken from "scroll-morph-hero": the motion only. Changes: it scrolls with the page
// (the source captured the mouse wheel inside its own box, which traps visitors), the
// stock photos, demo copy and the card's "View Details" back face are gone, framer-motion
// is replaced by a small per-frame easing loop.
//
// Markup:
//   <section class="oa" data-orbit-arch>
//     <div class="oa-stage">
//       <div class="oa-intro"><h1>…</h1><p>…</p></div>            (shown with the ring)
//       <div class="oa-after"><h2>…</h2><p>…</p></div>            (shown under the arch)
//       <div class="oa-cards" aria-hidden="true"><img src="…" alt=""> …</div>   (8–24 photos)
//     </div>
//   </section>
(function () {
  var css = '.oa{position:relative;height:300vh}' +
    '.oa-stage{position:sticky;top:0;height:100vh;height:100svh;overflow:hidden;display:grid;place-items:center}' +
    '.oa-intro,.oa-after{position:absolute;left:50%;transform:translateX(-50%);width:min(100% - 32px,40rem);text-align:center;z-index:1;pointer-events:none}' +
    '.oa-intro{top:50%;translate:0 -50%}.oa-after{top:12%;opacity:0}' +
    '.oa-cards{position:absolute;inset:0}' +
    '.oa-cards img{position:absolute;left:50%;top:50%;width:60px;height:85px;margin:-42.5px 0 0 -30px;object-fit:cover;border-radius:12px;' +
    'box-shadow:0 8px 20px rgba(0,0,0,.18);will-change:transform,opacity;opacity:0}' +
    '.oa.oa-static{height:auto}.oa.oa-static .oa-stage{position:relative}';
  var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var lerp = function (a, b, t) { return a + (b - a) * t; };
  var clamp = function (v) { return Math.min(1, Math.max(0, v)); };

  document.querySelectorAll('[data-orbit-arch]').forEach(function (root) {
    var stage = root.querySelector('.oa-stage');
    var intro = root.querySelector('.oa-intro'), after = root.querySelector('.oa-after');
    var cards = Array.prototype.slice.call(root.querySelectorAll('.oa-cards img'));
    var N = cards.length, phase = reduce ? 'arch' : 'scatter', mouse = 0, smoothMouse = 0;
    var morph = 0, pan = 0, spin = 0, flow = 0, lastT = 0;
    var prevU = cards.map(function () { return null; });
    var cur = cards.map(function () {
      return { x: (Math.random() - .5) * 1500, y: (Math.random() - .5) * 1000, r: (Math.random() - .5) * 180, s: .6, o: 0 };
    });
    if (reduce) root.classList.add('oa-static');

    function targets(W, H) {
      var mobile = W < 768;
      return cards.map(function (_, i) {
        if (phase === 'scatter') return cur[i];
        if (phase === 'line') return { x: i * 70 - N * 35 + 35, y: 0, r: 0, s: 1, o: 1 };
        var rr = Math.min(Math.min(W, H) * .35, 350), a = i / N * 2 * Math.PI + spin;
        var ring = { x: Math.cos(a) * rr, y: Math.sin(a) * rr, r: a * 180 / Math.PI + 90 };
        var R = Math.min(W, H * 1.5) * (mobile ? 1.4 : 1.1);
        var apex = H * (mobile ? .35 : .25), cy = apex + R - H / 2;
        // Harmony 30.10.2026: the cards flow along the arch without end; each one re-enters from the
        // far side while it is off screen (both ends of the spread lie outside the screen).
        var spread = mobile ? 100 : 130, step = spread / N;
        var u = (((i - flow - pan * N * .8) % N) + N) % N;
        var wrapped = prevU[i] !== null && Math.abs(u - prevU[i]) > N / 2; prevU[i] = u;
        var deg = -90 - spread / 2 + u * step, rad = deg * Math.PI / 180;
        var arch = { x: Math.cos(rad) * R + smoothMouse, y: Math.sin(rad) * R + cy, r: deg + 90, s: mobile ? 1.4 : 1.8 };
        var m = phase === 'arch' ? 1 : morph;
        return { x: lerp(ring.x, arch.x, m), y: lerp(ring.y, arch.y, m), r: lerp(ring.r, arch.r, m), s: lerp(1, arch.s, m), o: 1, snap: wrapped };
      });
    }

    // Harmony 29.10.2026: the loop only runs while the section is near the screen and layout is
    // measured on resize instead of every frame.
    var W = 0, H = 0, RUN = 0, active = false, raf = 0;
    function measure() { W = stage.clientWidth; H = stage.clientHeight; RUN = root.offsetHeight - H; }
    measure(); addEventListener('resize', function () { measure(); wake(); });
    function wake() { if (!raf && (active || reduce)) raf = requestAnimationFrame(frame); }
    function frame() {
      raf = 0;
      // same speed on 30, 60 and 120 Hz screens
      var now = performance.now(), dt = lastT ? Math.min(64, now - lastT) : 16.67, f = dt / 16.67; lastT = now;
      var ease = function (v) { return 1 - Math.pow(1 - v, f); };
      if (!reduce) {
        var y = -root.getBoundingClientRect().top, run = RUN;
        var p = run > 0 ? clamp(y / run) : 0;
        morph = lerp(morph, clamp(p / .25), ease(.08));            // first quarter: ring → arch
        pan = lerp(pan, clamp((p - .25) / .75), ease(.08));        // the rest: pan along the arch
        smoothMouse = lerp(smoothMouse, mouse, ease(.05));
        if (phase === 'ring') {                                    // moving even with no scroll at all
          if (morph < .6) spin += dt * .00022;
          if (morph > .85) flow += dt * .0007;
        }
      }
      var t = targets(W, H), k = reduce ? 1 : ease(.06);
      cards.forEach(function (img, i) {
        var c = cur[i], g = t[i];
        if (g.snap) { c.x = g.x; c.y = g.y; c.r = g.r; c.s = g.s; c.o = g.o; }
        else if (c !== g) {
          c.x = lerp(c.x, g.x, k); c.y = lerp(c.y, g.y, k); c.r = lerp(c.r, g.r, k); c.s = lerp(c.s, g.s, k); c.o = lerp(c.o, g.o, k);
        }
        img.style.transform = 'translate3d(' + c.x.toFixed(1) + 'px,' + c.y.toFixed(1) + 'px,0) rotate(' + c.r.toFixed(2) + 'deg) scale(' + c.s.toFixed(3) + ')';
        img.style.opacity = c.o.toFixed(3);
      });
      var m = reduce ? 1 : morph, ring = phase === 'ring' ? 1 : 0;
      intro.style.opacity = reduce ? 0 : ring * clamp(1 - m * 2);
      after.style.opacity = clamp((m - .8) / .2);
      after.style.translate = '0 ' + (1 - clamp((m - .8) / .2)) * 20 + 'px';
      if (!reduce && active) raf = requestAnimationFrame(frame);
    }

    stage.addEventListener('mousemove', function (e) {
      var r = stage.getBoundingClientRect(); mouse = ((e.clientX - r.left) / r.width * 2 - 1) * 60; wake();
    });
    addEventListener('scroll', function () { if (active) wake(); }, { passive: true });
    var started = false;
    new IntersectionObserver(function (es) {
      active = es[0].isIntersecting;
      if (active && !started && !reduce) {           // the fly-in plays when the visitor arrives, not on page load
        started = true;
        setTimeout(function () { phase = 'line'; wake(); }, 300);
        setTimeout(function () { phase = 'ring'; wake(); }, 1900);
      }
      wake();
    }, { rootMargin: '25% 0px' }).observe(root);
    frame();
  });
})();
