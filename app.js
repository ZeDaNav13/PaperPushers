
// === Screensaver-style floating CTA ===
(function(){
  const el = document.querySelector('.floating-cta');
  if (!el) return;
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (reduce.matches) return;

  let vx = 1.2, vy = 1.0; // px per frame baseline; scaled by DPR
  const speed = Math.max(0.8, Math.min(2.2, window.devicePixelRatio || 1));
  vx *= speed; vy *= speed;

  let x = 24, y = 24; // start
  function size(){ return {w: el.offsetWidth, h: el.offsetHeight}; }
  function bounds(){ return {w: window.innerWidth, h: window.innerHeight}; }

  function step(){
    const b = bounds();
    const s = size();
    x += vx; y += vy;
    if (x <= 8 || x + s.w >= b.w - 8) { vx = -vx; x = Math.max(8, Math.min(x, b.w - s.w - 8)); flash(); }
    if (y <= 8 || y + s.h >= b.h - 8) { vy = -vy; y = Math.max(8, Math.min(y, b.h - s.h - 8)); flash(); }
    el.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    raf = requestAnimationFrame(step);
  }

  function flash(){
    el.style.filter = 'hue-rotate(15deg) saturate(1.15)';
    clearTimeout(flash.t);
    flash.t = setTimeout(()=>{ el.style.filter=''; },120);
  }

  // Pause on hover/focus
  let raf; const pause = ()=> cancelAnimationFrame(raf);
  const resume = ()=> { cancelAnimationFrame(raf); raf = requestAnimationFrame(step); };
  el.addEventListener('mouseenter', pause);
  el.addEventListener('mouseleave', resume);
  el.addEventListener('focusin', pause);
  el.addEventListener('focusout', resume);

  // Recalculate on resize
  window.addEventListener('resize', ()=>{});

  // Kick off
  el.style.willChange = 'transform';
  raf = requestAnimationFrame(step);
})();
