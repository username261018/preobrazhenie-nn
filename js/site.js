(function () {
  var d = document.documentElement;
  d.classList.add('js');
  var top = document.getElementById('top');
  var hd = top.querySelector('.hd');
  function th() { d.style.setProperty('--top-h', Math.round(hd.offsetTop + hd.offsetHeight) + 'px'); }
  th();
  addEventListener('resize', th);
  if (window.ResizeObserver) new ResizeObserver(th).observe(hd);
  var btn = top.querySelector('.menu-btn');
  var menu = document.getElementById('menu');
  function set(open) {
    btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    btn.setAttribute('aria-label', open ? 'Закрыть меню' : 'Открыть меню');
    menu.hidden = !open;
  }
  btn.addEventListener('click', function () { set(btn.getAttribute('aria-expanded') !== 'true'); });
  menu.addEventListener('click', function (e) { if (e.target.closest('a')) set(false); });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && btn.getAttribute('aria-expanded') === 'true') { set(false); btn.focus(); }
  });
  var wide = matchMedia('(min-width: 1100px)');
  function onWide() { if (wide.matches) set(false); }
  if (wide.addEventListener) wide.addEventListener('change', onWide); else wide.addListener(onWide);
})();
