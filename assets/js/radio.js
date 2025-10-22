(function mountRadio(){
  const mount = document.getElementById("radioMount");
  if (!mount) return;
  const el = document.createElement("div");
  el.className = 'radio-mount';
  el.innerHTML = `
    <div class="radio-card">
      <div class="radio-title">Chillhop Radio</div>
      <audio id="r3" controls preload="none"></audio>
      <div class="radio-controls">
          <button id="rPlay" class="r-btn r-play" aria-label="Přehrát" title="Přehrát">
          <!-- play icon -->
          <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false"><path d="M8 5v14l11-7z"/></svg>
        </button>
        <button id="rPause" class="r-btn r-pause" aria-label="Pauza" title="Pauza">
          <!-- pause icon -->
          <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false"><path d="M6 5h4v14H6zM14 5h4v14h-4z"/></svg>
        </button>
        <button id="rNext" class="r-btn r-next" aria-label="Další" title="Další">
          <!-- next icon -->
          <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false"><path d="M6 6v12l8.5-6L6 6zm9 0v12h2V6h-2z"/></svg>
        </button>
      </div>
      <div id="rStatus" class="radio-status">Status: čeká</div>
      <div id="rSpinner" class="radio-spinner" aria-hidden="true" title="Načítání streamu"></div>
    </div>`;
  mount.appendChild(el);
  const a3 = el.querySelector("#r3");
  const btnPlay = el.querySelector('#rPlay');
  const btnPause = el.querySelector('#rPause');
  const btnNext = el.querySelector('#rNext');
  const status = el.querySelector('#rStatus');

  // list of fallback streams (tried in order)
  const streams = [
    'https://streams.fluxfm.de/chillhop/mp3-320/streams.fluxfm.de/',
    'https://stream.radioparadise.com/ambient-320',
    'https://icecast.raveon.com/ambient-320'
  ];
  // restore last selected stream index from localStorage if present
  let streamIndex = parseInt(localStorage.getItem('radioStreamIndex') || '0', 10) || 0;
  // auto-fallback attempts counter
  let autoAttempts = 0;

  function setStatus(txt){ if(status) status.textContent = 'Status: ' + txt; }

  function loadStream(idx){
    if(!a3) return;
    a3.pause();
    a3.removeAttribute('src');
    // set crossOrigin to avoid some CORS issues for streams
    try{ a3.crossOrigin = 'anonymous'; }catch(e){}
    a3.src = streams[idx] || streams[0];
    a3.load();
    setStatus('načteno');
    // show spinner while loading
    showSpinner(true);
    // persist choice
    try{ localStorage.setItem('radioStreamIndex', ''+idx); }catch(e){}
  }

  function tryPlay(){
    if(!a3) return;
    a3.play().then(()=>{
      setStatus('hraje');
      showSpinner(false);
      // successful play -> reset autoAttempts
      autoAttempts = 0;
    }).catch(err=>{
      // show friendly message and keep controls usable
      setStatus('nelze přehrát (značka prohlížeče nebo blokace). Klikněte Přehrát znovu.');
      console.warn('Radio play error', err);
    });
  }

  // load initial stream
  loadStream(streamIndex);

  // try autoplay on load
  tryPlay();

  // if autoplay blocked, allow first user interaction to trigger play
  const interactionHandler = () => { tryPlay(); document.removeEventListener('click', interactionHandler); document.removeEventListener('keydown', interactionHandler); };
  document.addEventListener('click', interactionHandler);
  document.addEventListener('keydown', interactionHandler);

  btnPlay && btnPlay.addEventListener('click', ()=>{ tryPlay(); });
  btnPause && btnPause.addEventListener('click', ()=>{ if(a3){ a3.pause(); setStatus('pauza'); } });
  btnNext && btnNext.addEventListener('click', ()=>{
    streamIndex = (streamIndex + 1) % streams.length;
    loadStream(streamIndex);
    // try play after switching
    tryPlay();
  });

  if(a3){
    a3.addEventListener('playing', ()=> setStatus('hraje'));
    a3.addEventListener('pause', ()=> setStatus('pauza'));
    a3.addEventListener('waiting', ()=> setStatus('na čekání...'));
    a3.addEventListener('stalled', ()=>{
      setStatus('stalled / problém se streamem');
      // try fallback
      autoNextOnError('stalled');
    });
    a3.addEventListener('error', (e)=>{
      console.warn('Audio element error', e);
      setStatus('chyba při přehrávání — zkouším další stream...');
      showSpinner(false);
      // try fallback
      autoNextOnError('error');
    });
  }

  // spinner control
  const spinner = el.querySelector('#rSpinner');
  function showSpinner(yes){ if(!spinner) return; spinner.style.display = yes ? 'inline-block' : 'none'; spinner.setAttribute('aria-hidden', yes ? 'false' : 'true'); }
  // hide spinner initially
  showSpinner(false);

  // automatically try next fallback stream on error, up to streams.length attempts
  function autoNextOnError(source){
    autoAttempts++;
    if(autoAttempts > streams.length){
      setStatus('Všechny streamy selhaly. Zkuste to prosím znovu později.');
      return;
    }
    // pick next stream
    streamIndex = (streamIndex + 1) % streams.length;
    loadStream(streamIndex);
    // try play after switching
    // slight delay to allow load
    setTimeout(()=> tryPlay(), 500);
  }
})();