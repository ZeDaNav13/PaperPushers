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
