// Smooth layer for Harmony (Kevin 29.10.2026: "make the site smoother, GSAP"). Self-hosted
// GSAP 3.15 + ScrollTrigger + Lenis 1.1 (MIT). Loaded after the page script so the content
// already exists.
// - Lenis smooths wheel / trackpad scrolling on desktop; touch keeps the phone's own native
//   scrolling (the smoothest there is). Lenis is driven by the GSAP ticker so ScrollTrigger
//   and Lenis never disagree about where the page is.
// - In-page links (tab bar, menu, buttons) glide to their section.
// - Phones (touch) get none of this: the GSAP files are not even loaded there (see index.html).
// Visitors who prefer reduced motion get plain native scrolling and no reveal motion.
(function () {
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var root = document.documentElement;
  var fine = matchMedia('(pointer: fine)').matches;
  var useGsap = fine && window.gsap && window.ScrollTrigger;
  if (useGsap) gsap.registerPlugin(ScrollTrigger);

  var lenis = null;
  if (useGsap && !reduce && window.Lenis) {
    root.style.scrollBehavior = 'auto';          // Lenis does the easing; CSS smooth-scroll would fight it
    lenis = new Lenis({ lerp: 0.1, wheelMultiplier: 1, smoothWheel: true });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(function (t) { lenis.raf(t * 1000); });
    gsap.ticker.lagSmoothing(0);
    window.harmonyLenis = lenis;
    // the full-screen menu locks the page while open
    new MutationObserver(function () {
      var open = document.querySelector('.km.is-open');
      if (open) lenis.stop(); else lenis.start();
    }).observe(document.body, { subtree: true, attributes: true, attributeFilter: ['class'] });
  }

  // in-page links glide (and keep the address bar's hash)
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a[href^="#"]');
    if (!a) return;
    var id = a.getAttribute('href').slice(1), el = id && document.getElementById(id);
    if (!el) return;
    e.preventDefault();
    if (lenis) lenis.scrollTo(el, { duration: 1.1 });
    else el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
    history.replaceState(null, '', '#' + id);
  });

  // Section reveals stay as CSS transitions (opacity/transform run on the compositor, off the
  // main thread). Measured 29.10.2026: GSAP-driven reveals added ~30% style work while scrolling.
  if (useGsap) addEventListener('load', function () { ScrollTrigger.refresh(); });
})();
