// Motion library #05: Curved reel, plain-JS version for static HTML sites. No dependencies.
// Markup (images are listed once, the script builds the band):
//   <div data-curved-reel style="height:560px" data-reverse>   (data-reverse: stream left-to-right)
//     <img src="a.webp" alt=""> <img src="b.webp" alt=""> …
//     <div class="reel-content">…headline above the band…</div>
//   </div>
// Optional: data-speed="4" data-tile-height="26" data-aspect="1.7778" data-gap="6"
//           data-axis="56" data-curve="80" data-fade="12"
(function () {
  var SLICES = 16, CAMERA = 1.6, MAX_WIDTH = 55, seq = 0;

  function arc(bend) { return (CAMERA - 1 + Math.cos(bend)) / (2 * CAMERA * Math.sin(bend)); }
  function r4(n) { return +n.toFixed(4); }

  function measure(width, height, tile, aspect, gap, bend) {
    var h = Math.min((tile / 100) * height, ((MAX_WIDTH / 100) * width) / aspect);
    var radius = width * arc(bend);
    if (!(h > 0) || !(radius > 0)) return { columns: 2, sweep: 0, unit: 0, limit: 0 };
    var deg = function (rad) { return (rad * 180) / Math.PI; };
    var unit = deg(h / radius);
    var pitch = (aspect + gap / 100) * unit;
    var limit = deg(bend) + (aspect * unit) / 2;
    var columns = Math.min(60, Math.max(2, Math.ceil((2 * limit) / pitch)));
    var sweep = r4((columns * pitch) / 2);
    return { columns: columns, sweep: sweep, unit: r4(unit), limit: r4(Math.min(sweep, limit)) };
  }

  function init(root) {
    var num = function (k, d) { var v = parseFloat(root.getAttribute('data-' + k)); return isFinite(v) ? v : d; };
    var speed = num('speed', 4), tileH = num('tile-height', 26), aspect = num('aspect', 16 / 9),
        gap = num('gap', 6), axis = num('axis', 56), fade = num('fade', 12),
        bend = (Math.min(85, Math.max(5, num('curve', 80))) * Math.PI) / 180,
        reverse = root.hasAttribute('data-reverse');
    var srcs = Array.prototype.map.call(root.querySelectorAll(':scope > img'), function (img) {
      img.remove(); return img.currentSrc || img.src;
    });
    srcs.forEach(function (s) { new Image().src = s; });

    var id = 'cr' + (++seq), orbit = id + '-o', tileCls = id + '-t';
    var r = 100 * arc(bend), radius = r4(r) + 'cqw';
    var u = function (n) { return 'calc(' + r4(n) + ' * min(' + tileH + 'cqh, ' + r4(MAX_WIDTH / aspect) + 'cqw))'; };
    var turn = function (d) { return 'translateZ(' + radius + ') rotateY(' + r4(d) + 'deg) translateZ(-' + radius + ')'; };
    var share = aspect / SLICES;

    root.style.containerType = 'size';
    if (getComputedStyle(root).position === 'static') root.style.position = 'relative';
    root.style.overflow = 'hidden';
    var style = document.createElement('style');
    var band = document.createElement('div');
    band.setAttribute('aria-hidden', 'true');
    var mask = 'linear-gradient(90deg,transparent,#000 ' + fade + '%,#000 ' + (100 - fade) + '%,transparent)';
    band.style.cssText = 'position:absolute;inset:0;pointer-events:none;opacity:0;transition:opacity .5s;' +
      'perspective:' + r4(r * CAMERA) + 'cqw;perspective-origin:50% ' + axis + '%;-webkit-mask-image:' + mask + ';mask-image:' + mask;
    root.prepend(band);
    root.prepend(style);

    var current = null;
    function build(width, height) {
      var m = measure(width, height, tileH, aspect, gap, bend);
      if (current && current.columns === m.columns && current.sweep === m.sweep && current.unit === m.unit) return;
      current = m;
      var hide = r4(((m.sweep - m.limit) / (2 * m.sweep || 1)) * 100);
      var a = reverse ? m.sweep : -m.sweep, b = -a;
      style.textContent = '@keyframes ' + orbit + '{from{transform:' + turn(a) + '}to{transform:' + turn(b) + '}' +
        '0%,' + hide + '%,' + (100 - hide) + '%,100%{visibility:hidden}' +
        (hide + 0.001) + '%,' + (100 - hide - 0.001) + '%{visibility:visible}}' +
        '@media(prefers-reduced-motion:reduce){.' + tileCls + '{animation-play-state:paused}}';
      var duration = m.columns * speed;
      band.textContent = '';
      for (var t = 0; t < m.columns; t++) {
        (function (t) {
          var first = m.columns - 1 - t;
          var tile = document.createElement('div');
          tile.className = tileCls;
          tile.style.cssText = 'position:absolute;transform-style:preserve-3d;left:calc(50% - ' + u(aspect / 2) + ');top:calc(' + axis + '% - ' + u(0.5) + ');width:' + u(aspect) + ';height:' + u(1) +
            ';animation:' + orbit + ' ' + duration + 's linear ' + (-t * speed) + 's infinite';
          var imgs = [];
          for (var k = 0; k < SLICES; k++) {
            var s = document.createElement('div');
            s.style.cssText = 'position:absolute;top:0;overflow:hidden;left:' + u((aspect - share) / 2) + ';height:' + u(1) +
              ';width:' + (k === SLICES - 1 ? u(share) : 'calc(' + u(share) + ' + 1px)') + ';transform:' + turn((aspect / 2 - (k + 0.5) * share) * m.unit) +
              (k === 0 ? ';border-radius:8px 0 0 8px' : k === SLICES - 1 ? ';border-radius:0 8px 8px 0' : '');
            var img = document.createElement('img');
            img.alt = ''; img.draggable = false;
            img.style.cssText = 'position:absolute;top:0;max-width:none;object-fit:cover;left:' + u(-k * share) + ';width:' + u(aspect) + ';height:' + u(1);
            s.appendChild(img); tile.appendChild(s); imgs.push(img);
          }
          var show = function (n) { if (srcs.length) imgs.forEach(function (i) { i.src = srcs[n % srcs.length]; }); };
          show(first);
          tile.addEventListener('animationiteration', function (e) {
            show(Math.round(e.elapsedTime / duration) * m.columns + first);
          });
          band.appendChild(tile);
        })(t);
      }
      band.style.opacity = '1';
    }
    new ResizeObserver(function (entries) {
      var c = entries[0].contentRect; build(c.width, c.height);
    }).observe(root);
  }

  document.querySelectorAll('[data-curved-reel]').forEach(init);
})();
