/* Shared nav behaviour (all pages):
   - marks the current page link as active
   - shrinks the bar a little once you scroll
   - re-aligns #anchor links after images/fonts finish loading, so the target section is shown fully */
(function () {
  var nav = document.querySelector('nav');
  if (!nav) return;

  var page = (location.pathname.split('/').pop() || 'home.html').toLowerCase();
  if (page === 'index.html') page = 'home.html';
  nav.querySelectorAll('.nav-links a').forEach(function (a) {
    var target = (a.getAttribute('href') || '').split('#')[0].toLowerCase();
    var on = target === page;
    a.classList.toggle('active', on);
    if (on) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
  });

  function onScroll() { nav.classList.toggle('scrolled', window.scrollY > 20); }
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  if (location.hash.length > 1) {
    window.addEventListener('load', function () {
      var t = document.getElementById(decodeURIComponent(location.hash.slice(1)));
      if (t) t.scrollIntoView({ behavior: 'instant', block: 'start' });
    });
  }
})();
