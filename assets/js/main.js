
const rates = {CZK:1, EUR:0.039, USD:0.043};
let currency = localStorage.getItem('currency') || 'CZK';
const fmt = (value) => new Intl.NumberFormat(undefined,{style:'currency',currency}).format(value*(rates[currency]||1));
function applyCurrency(){
  document.querySelectorAll('[data-price]').forEach(el => {
    const czk = parseFloat(el.getAttribute('data-price'));
    el.textContent = fmt(czk);
  });
  document.getElementById('curLabel').textContent = currency;
  const flag = document.getElementById('flag');
  flag.className = 'flag ' + (currency==='CZK'?'cz':currency==='EUR'?'eu':'us');
}
document.addEventListener('DOMContentLoaded',()=>{
  const select = document.getElementById('currency');
  select.value = currency;
  select.addEventListener('change', e=>{currency=e.target.value;localStorage.setItem('currency',currency);applyCurrency();});
  applyCurrency();
  if('serviceWorker' in navigator){navigator.serviceWorker.register('/sw.js').catch(()=>{});}
});
