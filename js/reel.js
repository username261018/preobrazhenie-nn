(function () {
  var rm = matchMedia('(prefers-reduced-motion: reduce)');
  document.querySelectorAll('.reel').forEach(function (r) {
    var t = r.querySelector('.reel__track');
    var slides = Array.prototype.slice.call(t.children);
    var prev = r.querySelector('.reel__prev');
    var next = r.querySelector('.reel__next');
    var dotsBox = r.querySelector('.reel__dots');
    var ctl = r.querySelector('.reel__ctl');
    var label = r.getAttribute('data-label') || 'Слайд';
    var pos = [], dots = [], idx = -1, tick = 0;

    function build() {
      var max = t.scrollWidth - t.clientWidth;
      pos = [];
      slides.forEach(function (s) {
        var x = Math.min(s.offsetLeft, max);
        if (!pos.length || x - pos[pos.length - 1] > 2) pos.push(x);
      });
      if (max > 2 && pos[pos.length - 1] < max - 2) pos.push(max);
      dotsBox.textContent = '';
      dots = pos.map(function (_, i) {
        var b = document.createElement('button');
        b.type = 'button';
        b.className = 'reel__dot';
        b.setAttribute('aria-label', label + ' ' + (i + 1));
        b.addEventListener('click', function () { go(i); });
        dotsBox.appendChild(b);
        return b;
      });
      ctl.hidden = pos.length < 2;
      idx = -1;
      update();
    }
    function nearest() {
      var x = t.scrollLeft, best = 0;
      pos.forEach(function (p, i) { if (Math.abs(p - x) < Math.abs(pos[best] - x)) best = i; });
      return best;
    }
    function update() {
      tick = 0;
      var i = nearest();
      var x = t.scrollLeft, w = t.clientWidth;
      slides.forEach(function (s) {
        var vis = s.offsetLeft >= x - 2 && s.offsetLeft + s.offsetWidth <= x + w + 2;
        s.setAttribute('aria-hidden', vis ? 'false' : 'true');
        s.inert = !vis;
      });
      if (i === idx) return;
      idx = i;
      r.setAttribute('data-index', String(i));
      prev.disabled = i === 0;
      next.disabled = i === pos.length - 1;
      dots.forEach(function (d, k) { d.setAttribute('aria-current', k === i ? 'true' : 'false'); });
    }
    function go(i) {
      i = Math.max(0, Math.min(pos.length - 1, i));
      t.scrollTo({ left: pos[i], behavior: rm.matches ? 'auto' : 'smooth' });
    }
    prev.addEventListener('click', function () { go(idx - 1); });
    next.addEventListener('click', function () { go(idx + 1); });
    t.addEventListener('scroll', function () { if (!tick) tick = requestAnimationFrame(update); }, { passive: true });
    t.addEventListener('keydown', function (e) {
      var k = e.key, to = null;
      if (k === 'ArrowRight') to = idx + 1;
      else if (k === 'ArrowLeft') to = idx - 1;
      else if (k === 'Home') to = 0;
      else if (k === 'End') to = pos.length - 1;
      if (to !== null) { e.preventDefault(); go(to); }
    });
    var rt = 0;
    addEventListener('resize', function () { clearTimeout(rt); rt = setTimeout(build, 120); });
    build();
  });
})();
