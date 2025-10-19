(function mountRadio(){
  const mount = document.getElementById("radioMount");
  if (!mount) return;
  const el = document.createElement("div");
  el.style.cssText = "display:flex; gap:12px; align-items:center; justify-content:center; flex-wrap:wrap;";
  el.innerHTML = `
    <div style="background:linear-gradient(135deg,#0d0d1a,#1a1a2e); color:white; border:2px solid #0078ff; border-radius:16px; padding:16px; width:320px; text-align:center;">
      <div style="font-weight:700; margin-bottom:6px;">Remio Dance Radio – 24/7</div>
      <audio id="r1" controls preload="none" src="https://stream.dancewave.online:8080/dance.mp3"></audio>
    </div>
    <div style="background:linear-gradient(135deg,#0d0d1a,#1a1a2e); color:white; border:2px solid #8b5cf6; border-radius:16px; padding:16px; width:320px; text-align:center;">
      <div style="font-weight:700; margin-bottom:6px;">Chill Zone Radio</div>
      <audio id="r2" controls preload="none" src="https://streams.fluxfm.de/chillhop/mp3-320/streams.fluxfm.de/"></audio>
    </div>
    <div style="background:linear-gradient(135deg,#0d0d1a,#1a1a2e); color:white; border:2px solid #22c55e; border-radius:16px; padding:16px; width:320px; text-align:center;">
      <div style="font-weight:700; margin-bottom:6px;">Relax Paradise</div>
      <audio id="r3" controls preload="none" src="https://stream.radioparadise.com/ambient-320"></audio>
    </div>`;
  mount.appendChild(el);
  const a1 = el.querySelector("#r1");
  const a2 = el.querySelector("#r2");
  const a3 = el.querySelector("#r3");
  [a1,a2,a3].forEach(a => a.addEventListener("play", () => {
    [a1,a2,a3].forEach(b => { if (b!==a) b.pause(); });
  }));
})();