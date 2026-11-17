// Motion library #20: Floating dock. Plain JS, no dependencies (injects its own CSS).
// A row of round icon links, like the macOS dock: icons swell as the mouse nears them
// (40px → 80px within 150px, on a springy follow) and show their name in a small label.
// On phones it folds into one button that fans the icons out upward, one after another.
// Taken from aceternity "floating-dock": motion only; framer-motion, Tabler icons and the
// demo links were left out. Good for social / contact links (WhatsApp, phone, Instagram,
// Waze) in a footer or a fixed corner.
// Markup:
//   <nav class="fd" aria-label="קישורים מהירים">
//     <button class="fd-toggle" type="button" aria-expanded="false" aria-label="פתיחת קישורים">…icon…</button>
//     <ul class="fd-list">
//       <li><a class="fd-item" href="…" aria-label="וואטסאפ"><span class="fd-icon">…svg…</span><span class="fd-tip" aria-hidden="true">וואטסאפ</span></a></li> …
//     </ul>
//   </nav>
(function () {
  var css = '.fd{--fd-face:color-mix(in oklab,currentColor 6%,transparent);--fd-chip:color-mix(in oklab,currentColor 12%,transparent);position:relative;display:inline-block}' +
    '.fd-list{list-style:none;margin:0;display:flex;align-items:flex-end;gap:1rem;height:4rem;padding:0 1rem .75rem;border-radius:1rem;background:var(--fd-face)}' +
    '.fd-item{position:relative;display:flex;align-items:center;justify-content:center;width:40px;height:40px;border-radius:50%;background:var(--fd-chip);color:inherit;text-decoration:none}' +
    '.fd-item:focus-visible{outline:2px solid currentColor;outline-offset:3px}' +
    '.fd-icon{display:flex;width:20px;height:20px}.fd-icon svg{width:100%;height:100%}' +
    '.fd-tip{position:absolute;bottom:calc(100% + 8px);left:50%;padding:2px 8px;border-radius:6px;font-size:12px;white-space:nowrap;background:var(--card,#fff);' +
    'box-shadow:0 0 0 1px var(--fd-chip);opacity:0;transform:translate(-50%,10px);transition:opacity .2s,transform .2s;pointer-events:none}' +
    '.fd-item:is(:hover,:focus-visible) .fd-tip{opacity:1;transform:translate(-50%,0)}' +
    '.fd-toggle{display:none;width:44px;height:44px;border-radius:50%;border:0;background:var(--fd-chip);color:inherit;cursor:pointer;align-items:center;justify-content:center}' +
    '.fd-toggle:focus-visible{outline:2px solid currentColor;outline-offset:3px}' +
    '@media (max-width:767px){.fd-toggle{display:flex}.fd-list{position:absolute;bottom:100%;inset-inline:0;margin-bottom:.5rem;height:auto;flex-direction:column;align-items:center;gap:.5rem;padding:0;background:none;visibility:hidden}' +
    '.fd.is-open .fd-list{visibility:visible}.fd-list li{opacity:0;transform:translateY(10px);transition:opacity .2s,transform .2s}' +
    '.fd.is-open .fd-list li{opacity:1;transform:none}.fd-tip{display:none}}';
  var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  document.querySelectorAll('.fd').forEach(function (root) {
    var items = Array.prototype.slice.call(root.querySelectorAll('.fd-item')), list = root.querySelector('.fd-list');
    var btn = root.querySelector('.fd-toggle');
    // Phone: fan out bottom-up, fold back top-down.
    var lis = root.querySelectorAll('.fd-list li');
    btn.addEventListener('click', function () {
      var open = !root.classList.contains('is-open');
      root.classList.toggle('is-open', open); btn.setAttribute('aria-expanded', String(open));
      lis.forEach(function (li, i) { li.style.transitionDelay = (open ? (lis.length - 1 - i) : i) * 0.05 + 's'; });
    });
    // Desktop: magnify by distance, with a light spring.
    if (reduce) return;
    var mouse = Infinity, size = items.map(function () { return { v: 40, s: 0 }; }), raf = 0;
    list.addEventListener('mousemove', function (e) { mouse = e.clientX; wake(); });
    list.addEventListener('mouseleave', function () { mouse = Infinity; wake(); });
    function wake() { if (!raf) raf = requestAnimationFrame(step); }
    function step() {
      raf = 0; var moving = false;
      items.forEach(function (a, i) {
        var r = a.getBoundingClientRect(), d = Math.abs(mouse - (r.left + r.width / 2));
        var to = d >= 150 ? 40 : 40 + 40 * (1 - d / 150), z = size[i];
        z.s = (z.s + (to - z.v) * 0.25) * 0.6; z.v += z.s;
        if (Math.abs(to - z.v) > .2 || Math.abs(z.s) > .2) moving = true;
        a.style.width = a.style.height = z.v + 'px';
        a.firstElementChild.style.width = a.firstElementChild.style.height = z.v / 2 + 'px';
      });
      if (moving) wake();
    }
  });
})();
