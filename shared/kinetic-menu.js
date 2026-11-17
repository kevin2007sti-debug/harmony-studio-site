// Motion library #08: Kinetic menu, plain-JS behaviour (styles in kinetic-menu.css).
// Markup:
//   <div class="km-root">
//     <button class="km-toggle" type="button" aria-expanded="false" aria-controls="site-menu">
//       <span class="km-toggle-text"><span>תפריט</span><span>סגירה</span></span>
//       <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M7.33 0h1.34v16H7.33zM0 7.33h16v1.34H0z" fill="currentColor"/></svg>
//     </button>
//     <div class="km" id="site-menu">
//       <div class="km-overlay"></div>
//       <nav class="km-panel" aria-label="תפריט ראשי">
//         <div class="km-layer"></div><div class="km-layer"></div><div class="km-layer"></div>
//         <ul class="km-list">
//           <li style="--i:0"><a class="km-link" href="#about"><span>אודות</span></a></li> …
//         </ul>
//       </nav>
//     </div>
//   </div>
// Behaviour: toggle opens/closes; Escape, the dimmed page and any link close it; focus
// moves to the first link on open and back to the toggle on close; Tab stays inside the
// open menu; the page behind does not scroll while it is open.
(function () {
  document.querySelectorAll('.km-root').forEach(function (root) {
    var btn = root.querySelector('.km-toggle');
    var menu = root.querySelector('.km');
    var links = Array.prototype.slice.call(menu.querySelectorAll('a'));
    menu.inert = true;

    function set(open) {
      menu.classList.toggle('is-open', open);
      root.classList.toggle('is-open', open);
      btn.setAttribute('aria-expanded', String(open));
      menu.inert = !open;
      document.documentElement.style.overflow = open ? 'hidden' : '';
      if (open) setTimeout(function () { if (links[0]) links[0].focus({ preventScroll: true }); }, 300);
      else btn.focus({ preventScroll: true });
    }
    btn.addEventListener('click', function () { set(btn.getAttribute('aria-expanded') !== 'true'); });
    menu.querySelector('.km-overlay').addEventListener('click', function () { set(false); });
    links.forEach(function (a) { a.addEventListener('click', function () { set(false); }); });
    document.addEventListener('keydown', function (e) {
      if (!menu.classList.contains('is-open')) return;
      if (e.key === 'Escape') { set(false); return; }
      if (e.key !== 'Tab') return;
      var stops = [btn].concat(links), i = stops.indexOf(document.activeElement);
      e.preventDefault();
      stops[(i + (e.shiftKey ? -1 : 1) + stops.length) % stops.length].focus();
    });
  });
})();
