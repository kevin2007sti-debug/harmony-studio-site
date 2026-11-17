// Motion library #15: Location card behaviour (styles in location-card.css).
// Opens/closes on click or Enter/Space (it is a real button), shows the address block,
// and tilts the card toward the pointer by up to 8°.
(function () {
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  document.querySelectorAll('.lc').forEach(function (root) {
    var card = root.querySelector('.lc-card'), more = root.querySelector('.lc-more');
    // Each line draws by its own length.
    card.querySelectorAll('.lc-map line').forEach(function (l, i) {
      l.setAttribute('pathLength', '1');
      l.style.transitionDelay = (0.2 + i * 0.08) + 's';
    });
    card.querySelectorAll('.lc-block').forEach(function (b, i) { b.style.transitionDelay = (0.5 + i * 0.06) + 's'; });
    card.addEventListener('click', function () {
      var open = card.getAttribute('aria-expanded') !== 'true';
      card.setAttribute('aria-expanded', String(open));
      if (more) more.hidden = !open;
    });
    if (reduce) return;
    card.addEventListener('pointermove', function (e) {
      if (e.pointerType !== 'mouse') return;
      var r = card.getBoundingClientRect();
      var x = Math.max(-1, Math.min(1, (e.clientX - r.left - r.width / 2) / 50));
      var y = Math.max(-1, Math.min(1, (e.clientY - r.top - r.height / 2) / 50));
      card.style.setProperty('--lc-ry', (x * 8) + 'deg');
      card.style.setProperty('--lc-rx', (-y * 8) + 'deg');
    });
    card.addEventListener('pointerleave', function () {
      card.style.setProperty('--lc-ry', '0deg'); card.style.setProperty('--lc-rx', '0deg');
    });
  });
})();
