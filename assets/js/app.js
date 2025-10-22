const ding = document.getElementById("ding");
const cash = document.getElementById("cash");
const cartFab = document.getElementById("cartFab");
const cartCountEl = document.getElementById("cartCount");
let cartCount = parseInt(localStorage.getItem("cartCount") || "0", 10);
cartCountEl.textContent = cartCount;
// Theme
const themeToggle = document.getElementById("themeToggle");
const icon = themeToggle.querySelector(".icon");
if (localStorage.getItem("theme") === "light") { document.body.classList.add("light-theme"); icon.textContent = "☀"; }
themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("light-theme");
  const isLight = document.body.classList.contains("light-theme");
  icon.textContent = isLight ? "☀" : "☾";
  localStorage.setItem("theme", isLight ? "light" : "dark");
});
// Visitors block removed from HTML — no-op here to avoid console errors
// Lang / Currency handling with simple conversion
(() => {
  const langImgs = document.querySelectorAll(".language-switcher img");
  const currBtns = document.querySelectorAll(".currency-switcher button");

  // simple hard-coded rates relative to EUR
  const rates = { EUR: 1, USD: 1.08, GBP: 0.86, CZK: 25.0 };
  const symbols = { EUR: '€', USD: '$', GBP: '£', CZK: 'Kč' };

  const setLang = (l)=> { localStorage.setItem("language", l); /* optional: apply lang changes */ };

  function getCurrentCurrency(){
    // support both keys (legacy 'currency' and newer 'site_currency')
    return localStorage.getItem('site_currency') || localStorage.getItem('currency') || 'EUR';
  }

  function formatPrice(eurPrice, curr){
    const rate = rates[curr] || 1;
    const price = eurPrice * rate;
    try{
      if(curr === 'CZK'){
        return new Intl.NumberFormat('cs-CZ', { style: 'currency', currency: 'CZK', maximumFractionDigits: 0 }).format(price);
      }
      // for other currencies use standard formatting
      return new Intl.NumberFormat(undefined, { style: 'currency', currency: curr, maximumFractionDigits: 2 }).format(price);
    }catch(e){
      // fallback
      if (curr === 'CZK') return Math.round(price) + ' ' + symbols.CZK;
      const symbol = symbols[curr] || '';
      return symbol + price.toFixed(2);
    }
  }

  function updateActiveCurrencyButtons(){
    const curr = getCurrentCurrency();
    document.querySelectorAll('.currency-switcher button').forEach(b => {
      b.classList.toggle('active', b.dataset.currency === curr);
    });
  }

  function updatePrices(){
    const curr = getCurrentCurrency();
    document.querySelectorAll('.product-card').forEach(card => {
      const base = parseFloat(card.dataset.basePrice || card.getAttribute('data-base-price') || '0');
      const priceEl = card.querySelector('.product-price');
      if(priceEl){ priceEl.textContent = formatPrice(base, curr); }
    });
  }

  function setCurrency(c){
    // persist both keys for compatibility
    localStorage.setItem('currency', c);
    localStorage.setItem('site_currency', c);
    updateActiveCurrencyButtons(); updatePrices();
  }
  // expose for external scripts
  window.setCurrency = setCurrency;

  langImgs.forEach(img => img.addEventListener("click", () => setLang(img.dataset.lang)));
  currBtns.forEach(btn => btn.addEventListener("click", () => setCurrency(btn.dataset.currency)));

  // initialize UI
  updateActiveCurrencyButtons();
  // prices will be updated after product cards are rendered below
  window.updatePrices = updatePrices;
})();
// Data
const top3 = [
  {name:"Samsung Galaxy S25 Ultra", desc:"6.9” Dynamic AMOLED 2X, Snapdragon, 12/512GB", price:967.31, currency:"€", img:"assets/img/products/galaxy-s25-ultra.png"},
  {name:"Samsung Galaxy Fold5", desc:"Prémiový skládací smartphone", price:1029.05, currency:"€", img:"assets/img/products/galaxy-fold5.png"},
  {name:"Odyssey OLED TV", desc:"OLED panel, vysoký kontrast a tenké rámečky", price:1289.9, currency:"€", img:"assets/img/products/odyssey-oled-tv.png"},
];
const top10 = [
  {name:"PlayStation 5 DualSense Edge", price:239, currency:"€", img:"assets/img/products/ps5.png"},
  {name:"Sony WH-1000XM5", price:369, currency:"€", img:"assets/img/products/sony-wh1000xm5.png"},
  {name:"Apple Watch Ultra 2", price:879, currency:"€", img:"assets/img/products/apple-watch-ultra2.png"},
  {name:"DJI Mini 4 Pro", price:999, currency:"€", img:"assets/img/products/dji-mini4-pro.png"},
  {name:"ASUS ROG Strix G16", price:1999, currency:"€", img:"assets/img/products/asus-rog-g16.png"},
  {name:"GoPro HERO12 Black", price:449, currency:"€", img:"assets/img/products/gopro-hero12.png"},
  {name:"Bose Revolve+ II", price:299, currency:"€", img:"assets/img/products/bose-revolve.png"},
  {name:"Samsung QLED 65''", price:1299, currency:"€", img:"assets/img/products/samsung-qled65.png"},
  {name:"iPhone 16 Pro Max 1TB", price:1599, currency:"€", img:"assets/img/products/iphone16-pro-max.png"},
  {name:"Galaxy Buds 3 Pro", price:249, currency:"€", img:"assets/img/products/galaxy-buds3pro.png"},
];
function renderProductCard(p){
  const card = document.createElement("div");
  card.className = "product-card";
  // store base EUR price for currency conversions
  card.dataset.basePrice = p.price;
  card.innerHTML = `
    <div class="stock-badge">SKLADEM</div>
    <img src="${p.img}" alt="${p.name}">
    <h3>${p.name}</h3>
    <p>${p.desc || ""}</p>
    <div class="product-price">${p.currency}${p.price.toFixed(2)}</div>
    <div class="buy-section">
      <select class="qty">
        ${Array.from({length:10},(_,i)=>`<option value="${i+1}">${i+1} ks</option>`).join("")}
      </select>
      <button class="buy">Přidat do košíku</button>
    </div>
  `;
  const qty = card.querySelector(".qty");
  const btn = card.querySelector(".buy");
  btn.addEventListener("click", () => {
    cartCount += parseInt(qty.value,10);
    localStorage.setItem("cartCount", cartCount);
    cartCountEl.textContent = cartCount;
    try { ding.currentTime = 0; ding.play(); } catch(e){}
    openCheckout({product:p, qty: parseInt(qty.value,10)});
  });
  return card;
}
document.getElementById("top3").append(...top3.map(renderProductCard));
document.getElementById("top10Grid").append(...top10.map(renderProductCard));
// refresh displayed prices to selected currency
if(window.updatePrices) window.updatePrices();
window.playCash = () => { try{ cash.currentTime=0; cash.play(); }catch(e){} };
