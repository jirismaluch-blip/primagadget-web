
/* Helpers */
const qs = (s, p=document)=>p.querySelector(s);
const qsa = (s, p=document)=>[...p.querySelectorAll(s)];
let currency = localStorage.getItem('currency') || 'EUR';
let language = localStorage.getItem('language') || 'cs';
let rates = { EUR:1, CZK:24.5, USD:1.08, GBP:0.85 };

const fmt = (val, curr) => {
  const locales = { CZK:'cs-CZ', EUR:'de-DE', USD:'en-US', GBP:'en-GB' };
  try { return new Intl.NumberFormat(locales[curr]||'en-US', { style:'currency', currency: curr }).format(val); }
  catch { return (curr==='EUR'?'€':'') + val.toFixed(2); }
};
const convert = (eur) => eur * (rates[currency] / rates['EUR']);

/* Exchange rates */
fetch('https://api.exchangerate.host/latest?base=EUR').then(r=>r.json()).then(d=>{
  if(d && d.rates){ rates = { EUR:1, CZK:d.rates.CZK||rates.CZK, USD:d.rates.USD||rates.USD, GBP:d.rates.GBP||rates.GBP }; renderProducts(); renderTop10(); updateCartBubble(); }
}).catch(()=>{});

/* Switchers */
function initSwitchers(){
  qsa('.language-switcher img').forEach(b=>{
    b.addEventListener('click', ()=>{
      language = b.dataset.lang; localStorage.setItem('language', language);
      qsa('.language-switcher img').forEach(x=> x.classList.toggle('active', x===b));
      if (window.loadLanguage) window.loadLanguage(language);
    });
    b.classList.toggle('active', b.dataset.lang===language);
  });
  qsa('.currency-switcher button').forEach(b=>{
    b.addEventListener('click', ()=>{
      currency = b.dataset.currency; localStorage.setItem('currency', currency);
      qsa('.currency-switcher button').forEach(x=> x.classList.toggle('active', x===b));
      renderProducts(); renderTop10(); updateCartBubble();
    });
    b.classList.toggle('active', b.dataset.currency===currency);
  });
}

/* Radio */
const STATIONS={dance:{name:"Remio Dance Radio – 24/7 LIVE",desc:"Energická taneční hudba pro produktivitu a nákupy 💃",src:"https://stream.dancewave.online:8080/dance.mp3",color:"#0078ff"},chill:{name:"Chill Zone Radio – 24/7 LIVE",desc:"Poklidná chillout hudba pro relax a soustředění 🌙",src:"https://streams.fluxfm.de/chillhop/mp3-320/streams.fluxfm.de/",color:"#8b5cf6"},relax:{name:"Relax Paradise – 24/7 LIVE",desc:"Klidná ambientní hudba pro odpočinek a rovnováhu 🧘‍♂️",src:"https://stream.radioparadise.com/ambient-320",color:"#22c55e"}};
let currentGenre = localStorage.getItem('selectedGenre') || 'dance', isPlaying=false;
function initRadio(){
  const audio=qs('#radioAudio'), player=qs('#radioPlayer'), gb=qs('#genreButtons'), btnPlay=qs('#btnPlay'), btnMute=qs('#btnMute');
  gb.innerHTML = Object.keys(STATIONS).map(g=>`<button class="genre-btn ${currentGenre===g?'active':''}" data-g="${g}">${g.toUpperCase()}</button>`).join('');
  gb.addEventListener('click',(e)=>{ const b=e.target.closest('button[data-g]'); if(!b) return;
    const wasPlaying = isPlaying; currentGenre=b.dataset.g; localStorage.setItem('selectedGenre', currentGenre);
    qsa('.genre-btn',gb).forEach(x=> x.classList.toggle('active', x===b)); setStation(audio, player, STATIONS[currentGenre]);
    if(wasPlaying){ audio.play(); isPlaying=true; player.classList.add('playing'); btnPlay.textContent='⏸'; }
  });
  setStation(audio, player, STATIONS[currentGenre]);
  btnPlay.addEventListener('click', ()=>{ if(!isPlaying){ audio.play(); isPlaying=true; player.classList.add('playing'); btnPlay.textContent='⏸'; } else { audio.pause(); isPlaying=false; player.classList.remove('playing'); btnPlay.textContent='▶'; }});
  btnMute.addEventListener('click', ()=>{ audio.muted=!audio.muted; btnMute.textContent = audio.muted ? '🔇' : '🔊'; });
}
function setStation(audio, player, st){ qs('.radio-header h3').textContent=st.name; qs('.radio-subtext').textContent=st.desc; audio.src=st.src; qs('.radio-player').style.borderColor=st.color; qsa('.bar').forEach(b=> b.style.background=st.color); }

/* Clock */
function initClock(){ function tick(){ const n=new Date(), h=String(n.getHours()).padStart(2,'0'), m=String(n.getMinutes()).padStart(2,'0'), s=String(n.getSeconds()).padStart(2,'0'); qs('#digital-clock').textContent=`${h}:${m}:${s}`; qs('#date-display').textContent=n.toLocaleDateString('cs-CZ',{day:'numeric',month:'long',year:'numeric'}) } tick(); setInterval(tick,1000); }

/* Products + cart */
const PRODUCTS_BIG=[{name:"Samsung Galaxy S25 Ultra",desc:"6.9” Dynamic AMOLED 2X, Snapdragon 8 Gen 3, 12 GB / 512 GB",priceEUR:967.31,img:"assets/galaxy-s25-ultra.svg"},{name:"Samsung Galaxy Fold5",desc:"Prémiový skládací smartphone s ohybným displejem",priceEUR:1029.05,img:"assets/galaxy-2-fld5.svg"},{name:"Odyssey OLED TV",desc:"OLED panel, vysoký kontrast a tenké rámečky",priceEUR:1289.90,img:"assets/odyssey-oled-tv.svg"}];
const TOP10=[{name:"PlayStation 5 DualSense Edge",priceEUR:239,img:"assets/ps5.svg"},{name:"Sony WH-1000XM5",priceEUR:369,img:"assets/earbuds.svg"},{name:"Apple Watch Ultra 2",priceEUR:879,img:"assets/hub.svg"},{name:"DJI Mini 4 Pro",priceEUR:999,img:"assets/earbuds.svg"},{name:"ASUS ROG Strix G16",priceEUR:1999,img:"assets/hub.svg"},{name:"GoPro HERO12 Black",priceEUR:449,img:"assets/earbuds.svg"},{name:"Bose Revolve+ II",priceEUR:299,img:"assets/hub.svg"},{name:"Samsung QLED 65''",priceEUR:1299,img:"assets/odyssey-oled-tv.svg"},{name:"iPhone 16 Pro Max 1TB",priceEUR:1599,img:"assets/galaxy-s25-ultra.svg"},{name:"Galaxy Buds 3 Pro",priceEUR:249,img:"assets/earbuds.svg"}];
let cart = JSON.parse(localStorage.getItem('cart')||'{"count":0,"totalEUR":0}');
function updateCartBubble(){ qs('#cartCount').textContent = cart.count; qs('#cartTotal').textContent = fmt(cart.totalEUR * (rates[currency]/rates['EUR']), currency); }
function addToCart(priceEUR, qty){ cart.count += qty; cart.totalEUR += priceEUR * qty; localStorage.setItem('cart', JSON.stringify(cart)); updateCartBubble(); const b=qs('#cartBubble'); b.style.transform='scale(1.08)'; setTimeout(()=>b.style.transform='',140); }
function renderProducts(){ const grid=qs('.product-grid.big'); grid.innerHTML=''; PRODUCTS_BIG.forEach(p=>{ const el=document.createElement('article'); el.className='product-card'; const base=p.priceEUR; el.innerHTML=`<div class="product-image"><img src="${p.img}" alt="${p.name}" loading="lazy"></div><h3 class="product-title">${p.name}</h3><p class="product-desc">${p.desc}</p><div class="product-footer"><div class="price" data-base="${base}">${fmt(base * (rates[currency]/rates['EUR']), currency)}</div><div class="actions"><select class="quantity-select">${Array.from({length:10},(_,i)=>`<option value="${i+1}">${i+1} ks</option>`).join('')}</select><button class="buy-btn">🛒 Koupit</button></div></div>`; grid.appendChild(el); const qty=qs('.quantity-select',el), priceEl=qs('.price',el); qty.addEventListener('change',()=>{ const q=parseInt(qty.value,10); const baseEUR=parseFloat(priceEl.dataset.base); priceEl.textContent=fmt(baseEUR*q*(rates[currency]/rates['EUR']), currency); }); qs('.buy-btn',el).addEventListener('click',()=>{ const q=parseInt(qty.value,10); addToCart(parseFloat(priceEl.dataset.base), q); }); }); }
function renderTop10(){ const grid=qs('#top10Grid'); grid.innerHTML=''; TOP10.forEach(p=>{ const el=document.createElement('div'); el.className='small-product-box'; el.innerHTML=`<img src="${p.img}" alt="${p.name}" class="small-img" loading="lazy"><div class="small-info"><h4>${p.name}</h4><p class="small-price">${fmt(p.priceEUR*(rates[currency]/rates['EUR']), currency)}</p></div>`; grid.appendChild(el); }); }

/* Draggable bubbles */
function makeDraggable(el,key){ let pos=JSON.parse(localStorage.getItem(key)||'null'); if(pos){ el.style.right='auto'; el.style.bottom='auto'; el.style.left=pos.x+'px'; el.style.top=pos.y+'px'; } let d=false,sx=0,sy=0; el.addEventListener('mousedown',e=>{ d=true; sx=e.clientX-el.offsetLeft; sy=e.clientY-el.offsetTop;}); window.addEventListener('mousemove',e=>{ if(!d) return; el.style.left=(e.clientX-sx)+'px'; el.style.top=(e.clientY-sy)+'px';}); window.addEventListener('mouseup',()=>{ if(!d) return; d=false; localStorage.setItem(key, JSON.stringify({x:el.offsetLeft,y:el.offsetTop}));}); }

/* Chat */
function initChat(){ const toggle=qs('#chatBubble'), box=qs('#chatBox'), close=qs('#chatClose'), msgs=qs('#chatMsgs'), input=qs('#chatInput'); function write(t,cls='a'){ const d=document.createElement('div'); d.className='msg '+cls; d.textContent=t; msgs.appendChild(d); msgs.scrollTop=msgs.scrollHeight; } toggle.addEventListener('click',()=>box.classList.toggle('hidden')); close.addEventListener('click',()=>box.classList.add('hidden')); qs('#chatSend').addEventListener('click',()=>{ const t=input.value.trim(); if(!t) return; write(t,'u'); input.value=''; setTimeout(()=> write(route(t),'a'), 200); }); input.addEventListener('keydown',e=>{ if(e.key==='Enter') qs('#chatSend').click(); }); const greetings={cs:["Dobrý den! 👋 Jsem Prime Assistant. Jak vám dnes můžu pomoct?","Ahoj! 😊 Potřebujete poradit s výběrem nebo objednávkou?","Zdravím! 🙌 Rád pomůžu s čímkoli ohledně našich produktů."],en:["Hello! 👋 I'm Prime Assistant. How can I help you today?","Hi there! 😊 Need help choosing or ordering?","Welcome! 🙌 I'm here to make shopping easy for you."],de:["Hallo! 👋 Ich bin Prime Assistant. Wie kann ich Ihnen heute helfen?","Guten Tag! 😊 Brauchen Sie Hilfe bei der Auswahl oder Bestellung?","Willkommen! 🙌 Ich helfe Ihnen gerne beim Einkaufen."],fr:["Bonjour ! 👋 Je suis Prime Assistant. Comment puis-je vous aider aujourd’hui ?","Salut ! 😊 Besoin d’aide pour choisir ou commander ?","Bienvenue ! 🙌 Je suis là pour rendre vos achats plus simples."]}; setTimeout(()=>{ const arr=greetings[language]||greetings.en; write(arr[Math.floor(Math.random()*arr.length)],'a'); },2200); function route(q){ const s=q.toLowerCase(); if(/kontakt|telefon|email|e-mail|podpora|support/.test(s)) return "📞 Napiš na info@primegadget.cz nebo volej +420 606 123 987. Jsme tu 9:00–18:00."; if(/doprava|shipping|delivery/.test(s)) return "Doprava v EU 2–7 pracovních dní (EU sklad 2–4 dny)."; if(/reklamac|fault|warranty|záruk|broken/.test(s)) return "Záruka 24 měsíců v EU. Reklamace řešíme přes logistické centrum partnera."; if(/vracen|return/.test(s)) return "Vrácení do 14 dnů – pošleme štítek."; if(/sleva|coupon|discount|promo/.test(s)) return "Napiš název produktu – ověříme kupón/akci."; return "Upřesni prosím dotaz, případně napiš e‑mail: info@primegadget.cz"; } }

/* Translate loader */
async function loadLanguage(lang){ try{ const r=await fetch(`lang/${lang}.json`); if(!r.ok) throw 0; const t=await r.json(); document.querySelectorAll('[data-translate]').forEach(el=>{ const k=el.getAttribute('data-translate'); if(t[k]) el.textContent=t[k]; }); }catch(e){ console.warn('Missing lang',lang); } }

/* Clock init, Radio, Products, etc. */
document.addEventListener('DOMContentLoaded',()=>{
  initSwitchers();
  initRadio();
  initClock();
  renderProducts();
  renderTop10();
  updateCartBubble();
  makeDraggable(qs('#cartBubble'),'cartBubblePos');
  makeDraggable(qs('#chatBubble'),'chatBubblePos');
});
