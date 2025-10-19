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
// Visitors
(() => {
  const onlineEl = document.getElementById("onlineCount");
  const buyerEl  = document.getElementById("buyerCount");
  let online = Math.floor(Math.random()*4)+2;
  let buyers = parseInt(localStorage.getItem("buyerCount") || "248", 10);
  const update = () => { onlineEl.textContent = online; buyerEl.textContent = buyers; };
  update();
  setInterval(()=>{ online = Math.max(1, online + (Math.random()<0.5?-1:1)); update(); }, 4000);
  if (Math.random() > 0.75) { buyers++; localStorage.setItem("buyerCount", buyers); update(); }
})();
// Lang/Currency stubs
(() => {
  const langImgs = document.querySelectorAll(".language-switcher img");
  const currBtns = document.querySelectorAll(".currency-switcher button");
  const setLang = (l)=> localStorage.setItem("language", l);
  const setCurr = (c)=> localStorage.setItem("currency", c);
  langImgs.forEach(img => img.addEventListener("click", () => setLang(img.dataset.lang)));
  currBtns.forEach(btn => btn.addEventListener("click", () => setCurr(btn.dataset.currency)));
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
  card.innerHTML = `
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
window.playCash = () => { try{ cash.currentTime=0; cash.play(); }catch(e){} };
