(function(){
  const $=s=>document.querySelector(s);
  const $$=s=>Array.from(document.querySelectorAll(s));
  const root=document.documentElement;
  const getVar=n=>getComputedStyle(root).getPropertyValue(n).trim();
  const setVar=(n,v)=>root.style.setProperty(n,v);

  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  const parallaxItems=[...document.querySelectorAll('.card.parallax')];
  const clamp=(n,min,max)=>Math.max(min,Math.min(max,n));
  function updateParallax(){
    const vh=window.innerHeight;
    const strength=parseFloat(getVar('--parallax-strength'))||0.05;
    const max=parseFloat(getVar('--parallax-max'))||12;
    for(const el of parallaxItems){
      const r=el.getBoundingClientRect();
      const center=(r.top + r.height/2) - vh/2;
      const offset=clamp(center*strength, -max, max);
      el.style.setProperty('--parallax', offset+'px');
    }
  }
  const raf=()=>{ updateParallax(); requestAnimationFrame(raf) };
  requestAnimationFrame(raf);

  const cta=$('.floating-cta');
  let x=100, y=120, dx=parseFloat(getVar('--cta-speed-x'))||1.8, dy=parseFloat(getVar('--cta-speed-y'))||1.5;
  function bounce(){
    if(!cta) return;
    const pad=parseFloat(getVar('--cta-padding'))||12;
    const maxX=window.innerWidth - cta.offsetWidth - pad;
    const maxY=window.innerHeight - cta.offsetHeight - pad;
    x+=dx; y+=dy;
    if(x<pad){ x=pad; dx*=-1 } else if(x>maxX){ x=maxX; dx*=-1 }
    if(y<pad){ y=pad; dy*=-1 } else if(y>maxY){ y=maxY; dy*=-1 }
    cta.style.transform=`translate3d(${x}px,${y}px,0)`;
    requestAnimationFrame(bounce);
  }
  if (cta) {
    window.addEventListener('resize',()=>{
      const pad=parseFloat(getVar('--cta-padding'))||12;
      x=Math.min(x, window.innerWidth - cta.offsetWidth - pad);
      y=Math.min(y, window.innerHeight - cta.offsetHeight - pad);
    });
    requestAnimationFrame(bounce);
  }
})();