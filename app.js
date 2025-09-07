(function(){
  const $=s=>document.querySelector(s);
  const $$=s=>Array.from(document.querySelectorAll(s));
  const root=document.documentElement;
  const getVar=n=>getComputedStyle(root).getPropertyValue(n).trim();
  const setVar=(n,v)=>root.style.setProperty(n,v);

  // Year stamp
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Gentle parallax for cards (viewport relative, clamped)
  const parallaxItems=[...document.querySelectorAll('.card.parallax')];
  const clamp=(n,min,max)=>Math.max(min,Math.min(max,n));
  function updateParallax(){
    const vh=window.innerHeight;
    const strength=parseFloat(getVar('--parallax-strength'))||0.05;
    const max=parseFloat(getVar('--parallax-max'))||12;
    for(const el of parallaxItems){
      const r=el.getBoundingClientRect();
      const center=(r.top + r.height/2) - vh/2; // 0 at viewport center
      const offset=clamp(center*strength, -max, max);
      el.style.setProperty('--parallax', offset+'px');
    }
  }
  const raf=()=>{ updateParallax(); requestAnimationFrame(raf) };
  requestAnimationFrame(raf);

  // Floating CTA bounce within viewport bounds (never off-screen)
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

  /* ===== DESIGN TUNER ===== */
  const panel=$('#tuner');
  const toggle=$('#tuner-toggle');
  const close=$('#tuner-close');
  const minBtn=$('#tuner-min');
  let collapsed=false;
  if (toggle && panel){
    toggle.addEventListener('click',()=>{ panel.style.display = panel.style.display==='none'||!panel.style.display ? 'block' : 'none'; });
  }
  if (close) close.addEventListener('click',()=> panel.style.display='none');
  if (minBtn) minBtn.addEventListener('click',()=>{ collapsed=!collapsed; panel.style.maxHeight = collapsed? '44px':'78vh'; });

  // Seed ranges with current CSS vars
  const seedRange=(id, varName, fallback)=>{
    const el=$(id); if(!el) return;
    let v=parseFloat(getVar(varName));
    if(Number.isNaN(v)) v=fallback;
    el.value=v;
    el.addEventListener('input',()=> setVar(varName, id.includes('blur')? (el.value+'px') : el.value));
  };
  seedRange('#var-parallax-strength','--parallax-strength',0.05);
  seedRange('#var-parallax-max','--parallax-max',12);
  seedRange('#var-blob-opacity','--blob-opacity',0.75);
  seedRange('#var-blob-blur','--blob-blur',50);

  // Global color pickers
  const bindColor=(id, varName)=>{
    const el=$(id); if(!el) return;
    const current=getVar(varName);
    if(current) el.value = current.replace(/\s/g,'');
    el.addEventListener('input',()=> setVar(varName, el.value));
  };
  bindColor('#var-main','--main');
  bindColor('#var-accent','--accent');
  bindColor('#var-bg','--bg');
  bindColor('#var-surface','--surface');
  bindColor('#var-text','--text');
  bindColor('#var-muted','--muted');

  // Button theming per selector
  const btnApply=$('#btn-apply');
  const btnCopy=$('#btn-copy');
  const btnSel=$('#btn-selector');
  if (btnApply){
    btnApply.addEventListener('click',()=>{
      const sel=btnSel.value.trim(); if(!sel) return alert('Enter a valid target selector.');
      const nodes=$$(sel); if(!nodes.length) return alert('No elements matched for: '+sel);
      const from=$('#btn-from').value, to=$('#btn-to').value, text=$('#btn-text').value, border=$('#btn-border').value;
      nodes.forEach(n=>{
        n.style.setProperty('--btn-from', from);
        n.style.setProperty('--btn-to', to);
        n.style.setProperty('--btn-text', text);
        n.style.setProperty('--btn-border', border);
      });
      const t=nodes[0];
      $('#btn-snippet').value = `<${t.tagName.toLowerCase()} class="${t.className}" style="--btn-from:${from}; --btn-to:${to}; --btn-text:${text}; --btn-border:${border}">…</${t.tagName.toLowerCase()}>`;
    });
  }
  if (btnCopy){
    btnCopy.addEventListener('click',()=>{
      const v=$('#btn-snippet').value||'';
      if(!v) return;
      navigator.clipboard.writeText(v);
    });
  }

  // Card theming per selector
  const cardApply=$('#card-apply');
  const cardCopy=$('#card-copy');
  const cardSel=$('#card-selector');
  if (cardApply){
    cardApply.addEventListener('click',()=>{
      const sel=cardSel.value.trim(); if(!sel) return alert('Enter a valid target selector.');
      const nodes=$$(sel); if(!nodes.length) return alert('No elements matched for: '+sel);
      const bg=$('#card-bg').value, border=$('#card-border').value, text=$('#card-text').value, shadow=$('#card-shadow').value;
      nodes.forEach(n=>{
        n.style.setProperty('--card-bg', bg);
        n.style.setProperty('--card-border', border);
        n.style.setProperty('--card-text', text);
        n.style.setProperty('--card-shadow', shadow);
      });
      const t=nodes[0];
      $('#card-snippet').value = `<${t.tagName.toLowerCase()} class="${t.className}" style="--card-bg:${bg}; --card-border:${border}; --card-text:${text}; --card-shadow:${shadow}">…</${t.tagName.toLowerCase()}>`;
    });
  }
  if (cardCopy){
    cardCopy.addEventListener('click',()=>{
      const v=$('#card-snippet').value||'';
      if(!v) return;
      navigator.clipboard.writeText(v);
    });
  }

  // Export :root
  const exportBtn=$('#export-css');
  if (exportBtn){
    exportBtn.addEventListener('click',()=>{
      const vars=['--bg','--surface','--border','--text','--muted','--muted-dark','--main','--accent','--btn-radius','--btn-shadow-global','--btn-grad-from','--btn-grad-to','--btn-text-default','--blob-opacity','--blob-blur','--blob1-size','--blob2-size','--blob3-size','--blob1-speed','--blob2-speed','--blob3-speed','--parallax-strength','--parallax-max'];
      const lines=vars.map(v=>`  ${v}: ${getVar(v) || '/* unset */'};`).join('\n');
      const css=`:root{\n${lines}\n}`;
      $('#css-export').value = css;
      navigator.clipboard.writeText(css);
    });
  }
})();