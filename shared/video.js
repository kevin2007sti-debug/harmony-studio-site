// Studio videos: silent loops that only download once they scroll near the screen, play while
// visible, pause when off screen, and always carry a visible pause/play button (WCAG 2.2.2).
// Visitors who prefer reduced motion get the still poster and can press play themselves.
// Markup: <div class="hv-wrap"><video class="hv" muted playsinline loop preload="none"
//           poster="img/….webp" data-src="media/….mp4"></video></div>   (the button is added here)
(function () {
  var reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var L = {
    he: ['השהיית הסרטון', 'הפעלת הסרטון'],
    ar: ['إيقاف الفيديو', 'تشغيل الفيديو'],
    en: ['Pause video', 'Play video']
  };
  var PAUSE = '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="6" y="5" width="4" height="14" rx="1"/><rect x="14" y="5" width="4" height="14" rx="1"/></svg>';
  var PLAY = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5.5v13l11-6.5z"/></svg>';
  // the page positions each .hv-wrap itself (some are absolutely placed collage frames)
  var css = '.hv{display:block;width:100%;height:100%;object-fit:cover;background:#1d2419}' +
    '.hv-toggle{position:absolute;bottom:.7rem;inset-inline-end:.7rem;z-index:3;width:44px;height:44px;border:0;border-radius:50%;' +
    'display:grid;place-items:center;background:rgba(20,16,12,.62);color:#fff;cursor:pointer}' +
    '.hv-toggle svg{width:20px;height:20px;fill:currentColor}.hv-toggle:focus-visible{outline:3px solid #fff;outline-offset:2px}';
  var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);

  function lang() { var l = (document.documentElement.lang || 'he').slice(0, 2); return L[l] ? l : 'he'; }

  var all = [];
  document.querySelectorAll('video.hv').forEach(function (v) {
    var wrap = v.closest('.hv-wrap') || v.parentNode;
    var btn = document.createElement('button');
    btn.type = 'button'; btn.className = 'hv-toggle';
    wrap.appendChild(btn);
    var item = { v: v, btn: btn, userPaused: reduced, visible: false };
    all.push(item);

    function load() { if (!v.src && v.dataset.src) { v.src = v.dataset.src; } }
    item.sync = function () {
      var playing = !item.userPaused;
      btn.innerHTML = playing ? PAUSE : PLAY;
      btn.setAttribute('aria-label', L[lang()][playing ? 0 : 1]);
      if (playing && item.visible) { load(); var p = v.play(); if (p && p.catch) p.catch(function () {}); }
      else v.pause();
    };
    btn.addEventListener('click', function () { item.userPaused = !item.userPaused; item.sync(); });
    item.sync();
  });

  var io = new IntersectionObserver(function (es) {
    es.forEach(function (e) {
      all.forEach(function (it) { if (it.v === e.target) { it.visible = e.isIntersecting; it.sync(); } });
    });
  }, { rootMargin: '200px 0px' });
  all.forEach(function (it) { io.observe(it.v); });

  // relabel the buttons when the page language changes
  new MutationObserver(function () { all.forEach(function (it) { it.sync(); }); })
    .observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });
})();
