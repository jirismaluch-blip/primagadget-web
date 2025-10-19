
async function loadLanguage(langCode){ try{ const response=await fetch(`lang/${langCode}.json`); if(!response.ok) throw new Error('not found'); const translations=await response.json(); document.querySelectorAll('[data-translate]').forEach(el=>{ const key=el.getAttribute('data-translate'); if(translations[key]) el.textContent=translations[key]; }); }catch(e){ console.error('translate error', e);} }
const currentLang = localStorage.getItem('language') || 'cs';
loadLanguage(currentLang);
