'use client'
import { useEffect, useState } from 'react'

export default function ThemeToggle() {
  const [dark, setDark] = useState(false)

  useEffect(() => {
    const saved = typeof window !== 'undefined' ? localStorage.getItem('theme') : null
    if (saved === 'dark') setDark(true)
  }, [])

  useEffect(() => {
    const html = document.documentElement
    if (dark) {
      html.classList.add('dark')
      localStorage.setItem('theme', 'dark')
    } else {
      html.classList.remove('dark')
      localStorage.setItem('theme', 'light')
    }
  }, [dark])

  return (
    <button
      onClick={() => setDark(!dark)}
      aria-label="Přepnout téma"
      className="fixed bottom-4 right-4 rounded-full p-3 shadow-lg bg-black text-white dark:bg-white dark:text-black transition-colors"
      title={dark ? 'Světlý režim' : 'Tmavý režim'}
    >
      {dark ? '☀️' : '🌙'}
    </button>
  )
}
