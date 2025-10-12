'use client'
import { useEffect, useRef, useState } from 'react'
type Msg = { role: 'user'|'assistant'; content: string; ts: number }
const FAQ: Record<string,string>={doprava:'Doprava v EU 2–7 dnů. EU sklad 2–4 dny.',reklamace:'Záruka 24 měsíců v EU. Reklamace řeší logistický partner.',vraceni:'Vrácení do 14 dnů. Pošleme štítek.',zaruka:'2 roky záruky v EU.',sleva:'Napište produkt – ověříme kupón.'}
function rule(q:string){const s=q.toLowerCase(); if(/doprava|shipping|delivery/.test(s))return FAQ.doprava; if(/reklamac|fault|broken/.test(s))return FAQ.reklamace; if(/vracen|return/.test(s))return FAQ.vraceni; if(/zaruk|warranty/.test(s))return FAQ.zaruka; if(/sleva|coupon|discount/.test(s))return FAQ.sleva; return 'Upřesněte prosím dotaz, případně zanechte e‑mail.'}
export default function ChatWidget(){ const [open,setOpen]=useState(false),[input,setInput]=useState(''),[useAi,setUseAi]=useState(false),[loading,setLoading]=useState(false)
  const [msgs,setMsgs]=useState<Msg[]>(()=>{ if(typeof window==='undefined') return []; try{return JSON.parse(localStorage.getItem('pg_chat')||'[]')}catch{return []} })
  const boxRef=useRef<HTMLDivElement>(null)
  useEffect(()=>{ localStorage.setItem('pg_chat',JSON.stringify(msgs)); if(boxRef.current){boxRef.current.scrollTop=boxRef.current.scrollHeight} },[msgs,open])
  async function send(){ const t=input.trim(); if(!t) return; const next=[...msgs,{role:'user',content:t,ts:Date.now()}] as Msg[]; setMsgs(next); setInput(''); setLoading(true)
    try{ let reply=''; if(useAi){ const r=await fetch('/api/chat',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({messages:next.slice(-10)})}); const d=await r.json(); reply=d?.reply||rule(t)} else reply=rule(t); setMsgs(m=>[...m,{role:'assistant',content:reply,ts:Date.now()}])}
    catch{ setMsgs(m=>[...m,{role:'assistant',content:'Výpadek. Napište na support@primegadget.cz.',ts:Date.now()}])} finally{setLoading(false)}}
  return (<>
    <button onClick={()=>setOpen(!open)} className="fixed bottom-4 right-4 rounded-full px-4 py-3 shadow-glow bg-black text-white dark:bg-brand-blue">{open?'✖︎':'💬 Chat with us'}</button>
    {open&&(<div className="fixed bottom-20 right-4 w-80 max-w-[92vw] rounded-2xl border bg-white shadow-2xl dark:bg-card dark:border-gray-700">
      <div className="flex items-center justify-between px-4 py-3 border-b dark:border-gray-700"><div className="font-semibold">Prime Assistant</div>
        <label className="flex items-center gap-2 text-xs"><input type="checkbox" checked={useAi} onChange={e=>setUseAi(e.target.checked)}/>AI</label></div>
      <div ref={boxRef} className="max-h-80 overflow-auto px-3 py-2 space-y-2">{msgs.length===0&&<div className="text-xs text-gray-500 dark:text-text/70">Zeptej se na dopravu, reklamaci, vrácení nebo slevu.</div>}{msgs.map((m,i)=>(<div key={i} className={m.role==='user'?'text-right':'text-left'}><div className={`inline-block rounded-xl px-3 py-2 text-sm ${m.role==='user'?'bg-black text-white dark:bg-brand-blue':'bg-gray-100 dark:bg-[#222] dark:text-text'}`}>{m.content}</div></div>))}{loading&&<div className="text-xs text-gray-500">Píšu odpověď…</div>}</div>
      <div className="flex gap-2 p-3 border-t dark:border-gray-700"><input className="flex-1 rounded border px-3 py-2 text-sm dark:bg-[#1a1a1a] dark:border-gray-700 dark:text-text" placeholder="Napište zprávu…" value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>{if(e.key==='Enter') send()}}/><button onClick={send} className="rounded-lg px-3 py-2 text-sm bg-black text-white dark:bg-brand-blue">Odeslat</button></div>
    </div>)}
  </>)
}
