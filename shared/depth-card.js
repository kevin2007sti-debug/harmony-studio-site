// Motion library #23: Depth card. Plain JS, no dependencies (injects its own CSS).
// A card that tilts toward the mouse (up to ±12.5°) and lifts toward the visitor, built
// in layers at different depths (image at the back, title, text and button in front), so
// the layers slide against each other like a little diorama. Cards rise in one after
// another (tipped back 15°, slightly smaller) when they scroll into view.
// Taken from "animated-3d-card": the tilt, depth layers and entrance only; framer-motion,
// its gradient themes, spinning decorations and demo content were left out.
// Markup:
//   <div class="dc-row">
//     <article class="dc"><div class="dc-in">
//       <img class="dc-back" src="…" alt="…">
//       <div class="dc-front"><h3>…</h3><p>…</p><a href="…">…</a></div>
//     </div></article> …
//   </div>
(function () {
  var css = '.dc-row{display:grid;grid-template-columns:repeat(auto-fit,minmax(16rem,1fr));gap:1.5rem}' +
    '.dc{perspective:1200px}' +
    '.dc-in{position:relative;min-height:22rem;border-radius:18px;overflow:hidden;transform-style:preserve-3d;background:var(--card,#222);' +
    'transform:rotateX(var(--dc-x,0deg)) rotateY(var(--dc-y,0deg)) translateZ(var(--dc-z,0px));transition:transform .35s cubic-bezier(.2,.8,.2,1);' +
    'box-shadow:0 20px 40px -20px rgba(0,0,0,.35)}' +
    '.dc-back{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;transform:translateZ(-10px) scale(1.06)}' +
    '.dc-in::after{content:"";position:absolute;inset:0;background:linear-gradient(transparent 35%,rgba(0,0,0,.7));pointer-events:none}' +
    '.dc-front{position:absolute;inset:auto 0 0 0;z-index:1;padding:1.5rem;color:#fff;transform:translateZ(30px);display:grid;gap:.5rem}' +
    '.dc-front h3{margin:0;transform:translateZ(15px)}.dc-front p{margin:0;opacity:.85}' +
    '.dc-front a{color:inherit;font-weight:700;min-height:44px;display:inline-flex;align-items:center}' +
    '.dc-front a:focus-visible{outline:2px solid #fff;outline-offset:3px}' +
    '@media (prefers-reduced-motion:no-preference){.dc{opacity:0;transform:translateY(40px) rotateX(-15deg) scale(.95);transition:opacity .6s,transform .6s cubic-bezier(.2,.8,.2,1)}' +
    '.dc.is-in{opacity:1;transform:none}}';
  var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  var io = new IntersectionObserver(function (es) {
    es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); } });
  }, { threshold: .15 });
  document.querySelectorAll('.dc').forEach(function (card, i) {
    card.style.transitionDelay = (i % 4) * 0.1 + 's';
    io.observe(card);
    var inner = card.querySelector('.dc-in');
    card.addEventListener('pointermove', function (e) {
      if (e.pointerType !== 'mouse') return;
      var r = card.getBoundingClientRect();
      inner.style.setProperty('--dc-y', ((e.clientX - r.left) / r.width - .5) * 25 + 'deg');
      inner.style.setProperty('--dc-x', ((e.clientY - r.top) / r.height - .5) * -25 + 'deg');
      inner.style.setProperty('--dc-z', '30px');
    });
    card.addEventListener('pointerleave', function () {
      ['--dc-x', '--dc-y'].forEach(function (k) { inner.style.setProperty(k, '0deg'); });
      inner.style.setProperty('--dc-z', '0px');
    });
  });
})();
