'use client'
import { useEffect, useState } from 'react'
export default function ThemeToggle(){
  const [dark,setDark] = useState(true)
  useEffect(()=>{ const s=localStorage.getItem('theme'); if(s){ setDark(s==='dark') } else { localStorage.setItem('theme','dark'); setDark(true) } },[])
  useEffect(()=>{ const html=document.documentElement; if(dark){ html.classList.add('dark'); localStorage.setItem('theme','dark') } else { html.classList.remove('dark'); localStorage.setItem('theme','light') } },[dark])
  return <button onClick={()=>setDark(!dark)} className="fixed bottom-4 right-4 rounded-full p-3 shadow-lg bg-black text-white dark:bg-white dark:text-black">{dark?'☀️':'🌙'}</button>
}
