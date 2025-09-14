// Year stamp
document.addEventListener('DOMContentLoaded', () => {
  const y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();
});

// Simple parallax on scroll
(function(){
  
  const rm = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (rm.matches) { document.documentElement.classList.add('reduced-motion'); return; }
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


// Contact form handler (client-side demo)
(function(){
  const form = document.getElementById('contact-form');
  if (!form) return;

  const statusEl = document.getElementById('form-status');
  const submitBtn = form.querySelector('button[type="submit"], .btn[type="submit"]');

  function setStatus(msg, kind){
    if (!statusEl) return;
    statusEl.textContent = msg || '';
    statusEl.classList.remove('error','success');
    if (kind) statusEl.classList.add(kind);
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    // Honeypot check
    const hp = form.querySelector('input[name="website"]');
    if (hp && hp.value.trim() !== ''){
      setStatus('Thanks!', 'success');
      form.reset();
      return;
    }
    // Gather data
    const data = Object.fromEntries(new FormData(form).entries());
    // Very light client validation
    if (!data.name || !data.email || !data.message){
      setStatus('Please fill in name, email, and a short message.', 'error');
      return;
    }
    setStatus('Sending…');
    submitBtn && (submitBtn.disabled = true);
    try {
      // Placeholder demo: simulate network
      await new Promise(r => setTimeout(r, 800));
      // TODO: replace with real endpoint:
      // await fetch('/api/contact', {method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(data)})
      setStatus('Got it — we’ll reach out within 24 hours.', 'success');
      form.reset();
    } catch (err){
      setStatus('Something went wrong. Please try again.', 'error');
    } finally {
      submitBtn && (submitBtn.disabled = false);
    }
  });
})();
