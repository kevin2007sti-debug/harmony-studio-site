// Motion library #18: Zoom parallax. Plain JS, no dependencies (injects its own CSS).
// Seven photos sit in a loose collage around a centre photo. Scrolling pins the scene and
// zooms every photo outward at a different rate (×4 to ×9), so the centre photo grows to
// fill the screen while the others fly past the edges. About 2 screens of pinned scroll.
// Taken from "zoom-parallax": motion and layout only; framer-motion, Lenis smooth scroll and
// the demo photos were left out.
// Markup (up to 7 images, the first is the centre one):
//   <section class="zp" data-zoom-parallax><div class="zp-stage">
//     <div class="zp-layer"><figure><img src="…" alt="…"></figure></div> …×7
//   </div></section>
(function () {
  var css = '.zp{position:relative;height:300vh}' +
    '.zp-stage{position:sticky;top:0;height:100vh;height:100svh;overflow:hidden}' +
    '.zp-layer{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;will-change:transform}' +
    '.zp-layer figure{position:relative;margin:0;width:25vw;height:25vh}' +
    '.zp-layer img{width:100%;height:100%;object-fit:cover;display:block}' +
    '.zp-layer:nth-child(2) figure{top:-30vh;left:5vw;width:35vw;height:30vh}' +
    '.zp-layer:nth-child(3) figure{top:-10vh;left:-25vw;width:20vw;height:45vh}' +
    '.zp-layer:nth-child(4) figure{left:27.5vw;width:25vw;height:25vh}' +
    '.zp-layer:nth-child(5) figure{top:27.5vh;left:5vw;width:20vw;height:25vh}' +
    '.zp-layer:nth-child(6) figure{top:27.5vh;left:-22.5vw;width:30vw;height:25vh}' +
    '.zp-layer:nth-child(7) figure{top:22.5vh;left:25vw;width:15vw;height:15vh}' +
    '.zp.zp-static{height:auto}.zp.zp-static .zp-stage{position:relative}';
  var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var MAX = [4, 5, 6, 5, 6, 8, 9];

  document.querySelectorAll('[data-zoom-parallax]').forEach(function (root) {
    if (reduce) { root.classList.add('zp-static'); return; }
    var layers = root.querySelectorAll('.zp-layer'), raf = 0;
    function paint() {
      raf = 0;
      var r = root.getBoundingClientRect(), run = r.height - innerHeight;
      var p = run > 0 ? Math.min(1, Math.max(0, -r.top / run)) : 0;
      layers.forEach(function (l, i) { l.style.transform = 'scale(' + (1 + (MAX[i % 7] - 1) * p) + ')'; });
    }
    var go = function () { if (!raf) raf = requestAnimationFrame(paint); };
    addEventListener('scroll', go, { passive: true }); addEventListener('resize', go); paint();
  });
})();
