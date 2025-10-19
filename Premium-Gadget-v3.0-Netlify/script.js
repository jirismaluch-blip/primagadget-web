
// Theme toggle
const themeToggle = document.getElementById("themeToggle");
if (themeToggle) {
  const icon = themeToggle.querySelector(".icon");
  if (localStorage.getItem("theme") === "light") {
    document.body.classList.add("light-theme");
    if (icon) icon.textContent = "☀";
  }
  themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("light-theme");
    const isLight = document.body.classList.contains("light-theme");
    if (icon) icon.textContent = isLight ? "☀" : "☾";
    localStorage.setItem("theme", isLight ? "light" : "dark");
  });
}

// Visitor stats
document.addEventListener("DOMContentLoaded", () => {
  const onlineEl = document.getElementById("onlineCount");
  const buyerEl = document.getElementById("buyerCount");
  let onlineCount = Math.floor(Math.random()*5)+2;
  let buyerCount = localStorage.getItem("buyerCount") ? parseInt(localStorage.getItem("buyerCount")) : 250;
  const update = ()=>{ if(onlineEl) onlineEl.textContent=onlineCount; if(buyerEl) buyerEl.textContent=buyerCount; };
  setInterval(()=>{ onlineCount = Math.max(1, onlineCount + (Math.random()<0.5?-1:1)); update(); }, 4000);
  if (Math.random()>0.7){ buyerCount++; localStorage.setItem("buyerCount", buyerCount); }
  update();
});

// Cart + sounds
const addSound = new Audio("sounds/add-to-cart.wav");
const paySound = new Audio("sounds/payment-complete.wav");
const cartCountEl = document.getElementById("cartCount");
let cartCount = 0;
function addToCart(name, qty){ cartCount += qty; cartCountEl.textContent = cartCount; addSound.currentTime=0; addSound.play().catch(()=>{}); }
document.querySelectorAll(".buy-btn").forEach(btn=>{
  btn.addEventListener("click",(e)=>{
    const card = e.target.closest(".product-card");
    const qtySel = card.querySelector(".qty");
    const qty = qtySel ? parseInt(qtySel.value) || 1 : 1;
    const name = e.target.dataset.name || "Produkt";
    addToCart(name, qty);
  });
});
window.completePayment = function(){ paySound.currentTime = 0; paySound.play().catch(()=>{}); alert("Platba dokončena ✅"); };

// Radio widget + draggable
(function(){
  const widget = document.getElementById("radioWidget");
  const audio = document.getElementById("radioAudio");
  const playBtn = document.getElementById("playPause");
  const muteBtn = document.getElementById("muteBtn");
  const bars = document.querySelectorAll(".visualizer .bar");
  const last = localStorage.getItem("selectedGenreSrc");
  let isPlaying=false;
  if (last) audio.src = last;

  document.querySelectorAll(".genre-btn").forEach(b=>{
    b.addEventListener("click",()=>{
      const src = b.dataset.src;
      audio.src = src;
      localStorage.setItem("selectedGenreSrc", src);
      if (isPlaying) audio.play().catch(()=>{});
    });
  });

  function animateBars(active){
    bars.forEach((bar,i)=>{
      if(!active){ bar.style.height="6px"; return; }
      const h = 6 + (Math.sin(Date.now()/(120+i*35)) + 1)*8;
      bar.style.height = h + "px";
    });
  }
  setInterval(()=>animateBars(isPlaying), 120);

  playBtn.addEventListener("click",()=>{
    if(!audio.src) return;
    if (!isPlaying){ audio.play().catch(()=>{}); playBtn.textContent="⏸"; isPlaying=true; }
    else { audio.pause(); playBtn.textContent="▶"; isPlaying=false; }
  });
  muteBtn.addEventListener("click",()=>{ audio.muted=!audio.muted; muteBtn.textContent = audio.muted ? "🔇" : "🔈"; });

  // draggable
  let drag=false,sx=0,sy=0,sl=0,st=0;
  widget.addEventListener("mousedown",(e)=>{ drag=true; sx=e.clientX; sy=e.clientY; const r=widget.getBoundingClientRect(); sl=r.left; st=r.top; widget.style.transition="none"; });
  document.addEventListener("mousemove",(e)=>{ if(!drag) return; const dx=e.clientX-sx, dy=e.clientY-sy; widget.style.left=(sl+dx)+"px"; widget.style.top=(st+dy)+"px"; widget.style.bottom="auto"; widget.style.right="auto"; });
  document.addEventListener("mouseup",()=>{ drag=false; widget.style.transition=""; });
})();

// Chat bubble draggable
(function(){
  const bubble = document.getElementById("chatBubble");
  let drag=false,sx=0,sy=0,sl=0,st=0;
  bubble.addEventListener("mousedown",(e)=>{ drag=true; sx=e.clientX; sy=e.clientY; const r=bubble.getBoundingClientRect(); sl=r.left; st=r.top; bubble.style.transition="none"; });
  document.addEventListener("mousemove",(e)=>{ if(!drag) return; const dx=e.clientX-sx, dy=e.clientY-sy; bubble.style.left=(sl+dx)+"px"; bubble.style.top=(st+dy)+"px"; bubble.style.bottom="auto"; bubble.style.right="auto"; });
  document.addEventListener("mouseup",()=>{ drag=false; bubble.style.transition=""; });
})();

// Clock
(function(){
  const c = document.getElementById("digital-clock");
  const d = document.getElementById("date-display");
  function updateClock(){
    const now = new Date();
    const hh = String(now.getHours()).padStart(2,"0");
    const mm = String(now.getMinutes()).padStart(2,"0");
    const ss = String(now.getSeconds()).padStart(2,"0");
    if (c) c.textContent = `${hh}:${mm}:${ss}`;
    if (d) d.textContent = now.toLocaleDateString("cs-CZ", { weekday:"long", year:"numeric", month:"long", day:"numeric" });
  }
  updateClock(); setInterval(updateClock, 1000);
})();
