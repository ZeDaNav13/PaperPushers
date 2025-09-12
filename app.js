// Year stamp
document.addEventListener('DOMContentLoaded', () => {
  const y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();
});

// Simple parallax on scroll
(function(){
  const els = Array.from(document.querySelectorAll('.parallax'));
  if (!els.length) return;
  const max = 12; // px
  const lerp = (a,b,t)=>a+(b-a)*t;
  let ticking = false;

  function update(){
    const wh = window.innerHeight;
    els.forEach(el=>{
      const rect = el.getBoundingClientRect();
      const mid = rect.top + rect.height/2;
      const t = Math.max(-1, Math.min(1, (mid - wh/2)/(wh/2)));
      const dy = lerp(max, -max, (t+1)/2);
      el.style.transform = `translate3d(0, ${dy.toFixed(1)}px, 0)`;
    });
    ticking = false;
  }

  function onScroll(){
    if (!ticking){ requestAnimationFrame(update); ticking = true; }
  }
  update();
  window.addEventListener('scroll', onScroll, {passive:true});
  window.addEventListener('resize', onScroll);
})();

// === Screensaver-style floating CTA with subtle color change on bounce ===
(function(){
  const el = document.querySelector('.floating-cta');
  if (!el) return;
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (reduce.matches) return;

  const style = getComputedStyle(document.documentElement);
  const MAIN = style.getPropertyValue('--main').trim();
  const SECONDARY = style.getPropertyValue('--secondary').trim();
  const PURPLE = style.getPropertyValue('--purple').trim();
  const MINT = style.getPropertyValue('--mint').trim();
  const palettes = [
    [MAIN, SECONDARY],
    [SECONDARY, PURPLE],
    [PURPLE, MINT],
    [MINT, MAIN]
  ];
  let paletteIndex = 0;
  function applyPalette(i){
    const [from, to] = palettes[i % palettes.length];
    el.style.background = `linear-gradient(135deg, ${from}, ${to})`;
    el.style.boxShadow = `0 16px 36px ${to}40`;
  }
  applyPalette(paletteIndex);

  let vx = 1.3, vy = 1.1;
  const speed = Math.max(0.9, Math.min(2.2, window.devicePixelRatio || 1));
  vx *= speed; vy *= speed;

  let x = 24, y = 24;
  function size(){ return {w: el.offsetWidth, h: el.offsetHeight}; }
  function bounds(){ return {w: window.innerWidth, h: window.innerHeight}; }

  function step(){
    const b = bounds();
    const s = size();
    x += vx; y += vy;
    let bounced = false;
    if (x <= 8 || x + s.w >= b.w - 8) { vx = -vx; x = Math.max(8, Math.min(x, b.w - s.w - 8)); bounced = true; }
    if (y <= 8 || y + s.h >= b.h - 8) { vy = -vy; y = Math.max(8, Math.min(y, b.h - s.h - 8)); bounced = true; }
    el.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    if (bounced) {
      paletteIndex++;
      applyPalette(paletteIndex);
      el.style.filter = 'saturate(1.12)';
      clearTimeout(step._ft);
      step._ft = setTimeout(()=>{ el.style.filter=''; }, 140);
    }
    raf = requestAnimationFrame(step);
  }

  let raf; const pause = ()=> cancelAnimationFrame(raf);
  const resume = ()=> { cancelAnimationFrame(raf); raf = requestAnimationFrame(step); };
  el.addEventListener('mouseenter', pause);
  el.addEventListener('mouseleave', resume);
  el.addEventListener('focusin', pause);
  el.addEventListener('focusout', resume);

  el.style.willChange = 'transform, background, filter';
  raf = requestAnimationFrame(step);
})();