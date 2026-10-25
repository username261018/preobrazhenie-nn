(function () {
  var d = document.documentElement;
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) { d.classList.add('still'); return; }
  d.classList.add('anim');
  var st = document.querySelector('.stage');
  var bar = document.querySelector('.prog span');
  var tick = 0;
  function frame() {
    tick = 0;
    var th = parseFloat(getComputedStyle(d).getPropertyValue('--top-h')) || 100;
    var r = st.getBoundingClientRect();
    var len = Math.max(1, r.height - (innerHeight - th));
    var p = Math.min(1, Math.max(0, (th - r.top) / len));
    st.style.setProperty('--p', p.toFixed(4));
    bar.style.transform = 'scaleX(' + p.toFixed(4) + ')';
  }
  addEventListener('scroll', function () { if (!tick) tick = requestAnimationFrame(frame); }, { passive: true });
  addEventListener('resize', frame);
  frame();
  var items = document.querySelectorAll('.enter');
  if (!('IntersectionObserver' in window)) { items.forEach(function (e) { e.classList.add('is-in'); }); return; }
  var io = new IntersectionObserver(function (es) {
    es.forEach(function (e) {
      if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); }
    });
  }, { rootMargin: '0px 0px -8% 0px' });
  items.forEach(function (e) { io.observe(e); });
})();
