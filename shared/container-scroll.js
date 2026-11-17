// Motion library #17: Container scroll. Plain JS, no dependencies (injects its own CSS).
// A big framed "screen" (photo, video, product shot) lies tipped back 20° under its
// headline; as the section scrolls up it rises to face the visitor, settling flat while
// the headline drifts up. On phones it also grows from 70% to 90%.
// Taken from aceternity "container-scroll-animation": motion only; framer-motion, the
// demo headline and screenshot were left out.
// Markup:
//   <section class="cs" data-container-scroll>
//     <div class="cs-title">…headline…</div>
//     <div class="cs-frame"><div class="cs-screen"><img src="…" alt="…"></div></div>
//   </section>
(function () {
  var css = '.cs{--cs-bezel:#222;--cs-rim:#6c6c6c;position:relative;padding-block:clamp(2.5rem,8vw,10rem);perspective:1000px;overflow-x:clip}' +
    '.cs-title{max-width:64rem;margin-inline:auto;text-align:center;will-change:transform}' +
    '.cs-frame{max-width:64rem;margin:-3rem auto 0;height:clamp(22rem,55vw,40rem);padding:clamp(.5rem,1.5vw,1.5rem);border:4px solid var(--cs-rim);' +
    'border-radius:30px;background:var(--cs-bezel);transform-origin:50% 0;will-change:transform;' +
    'box-shadow:0 9px 20px #0000004a,0 37px 37px #00000042,0 84px 50px #00000026,0 149px 60px #0000000a}' +
    '.cs-screen{height:100%;overflow:hidden;border-radius:18px;background:#eee}' +
    '.cs-screen>img,.cs-screen>video{width:100%;height:100%;object-fit:cover;display:block}';
  var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  document.querySelectorAll('[data-container-scroll]').forEach(function (root) {
    var title = root.querySelector('.cs-title'), frame = root.querySelector('.cs-frame'), raf = 0;
    // Harmony 29.10.2026: with GSAP on the page the same motion runs on ScrollTrigger with a
    // short scrub, so the screen eases after the scroll instead of jumping with every wheel step.
    // GSAP only where there is a mouse/trackpad (Lenis runs there too); phones keep the light native path
    if (window.gsap && window.ScrollTrigger && matchMedia('(pointer: fine)').matches) {
      gsap.registerPlugin(ScrollTrigger);
      var mm = gsap.matchMedia();
      mm.add({ mobile: '(max-width: 768px)', desk: '(min-width: 769px)' }, function (c) {
        var mob = c.conditions.mobile;
        var st = { trigger: root, start: 'top bottom', end: function () { return '+=' + (root.offsetHeight + innerHeight) * 0.625; }, scrub: 0.6, invalidateOnRefresh: true };
        gsap.fromTo(frame, { rotationX: 20, scale: mob ? 0.7 : 1.05 }, { rotationX: 0, scale: mob ? 0.9 : 1, ease: 'none', scrollTrigger: st });
        gsap.fromTo(title, { y: 0 }, { y: -100, ease: 'none', scrollTrigger: st });
      });
      return;
    }
    function paint() {
      raf = 0;
      var r = root.getBoundingClientRect(), vh = innerHeight;
      // 0 when the section's top meets the bottom of the screen, 1 when its bottom meets the top.
      var p = Math.min(1, Math.max(0, (vh - r.top) / (r.height + vh)));
      p = Math.min(1, p * 1.6);                               // finish settling by ~60% of the pass
      var mobile = innerWidth <= 768, s = mobile ? .7 + .2 * p : 1.05 - .05 * p;
      frame.style.transform = 'rotateX(' + (20 - 20 * p) + 'deg) scale(' + s + ')';
      title.style.transform = 'translateY(' + (-100 * p) + 'px)';
    }
    var go = function () { if (!raf) raf = requestAnimationFrame(paint); };
    addEventListener('scroll', go, { passive: true }); addEventListener('resize', go); paint();
  });
})();
