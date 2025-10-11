'use client'
import { useState } from 'react'
import Image from 'next/image'
import ImageUploader from '@/components/ImageUploader'

export default function AddProduct() {
  const [title, setTitle] = useState('')
  const [price, setPrice] = useState('')
  const [image, setImage] = useState<{ main: string; thumb: string } | null>(null)
  const [message, setMessage] = useState('')

  async function handleSave() {
    if (!title || !price || !image) {
      setMessage('Vyplň název, cenu a nahraj obrázek.')
      return
    }
    const res = await fetch('/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, price: Number(price), image }),
    })
    if (res.ok) {
      setMessage('✅ Produkt uložen!')
      setTitle('')
      setPrice('')
      setImage(null)
    } else {
      const data = await res.json().catch(() => ({}))
      setMessage('❌ Chyba: ' + (data?.error || 'neznámá chyba'))
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <a href="/" className="text-sm underline">← Zpět na produkty</a>
        <h1 className="text-2xl font-bold">Nový produkt</h1>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-3">
          <label className="label">Název produktu</label>
          <input className="input" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Ovladač PS5 DualSense" />

          <label className="label">Cena (Kč)</label>
          <input className="input" type="number" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="1499" />

          <ImageUploader onUploaded={(v) => setImage(v)} label="Produktová fotka" />

          <button onClick={handleSave} className="btn mt-2">💾 Uložit produkt</button>
          {message && <p className="text-sm mt-2">{message}</p>}
        </div>

        <div className="space-y-3">
          <p className="text-sm text-gray-600">Náhled</p>
          {image ? (
            <div className="card">
              <div className="relative aspect-square mb-3">
                <Image src={image.thumb || image.main} alt="Náhled" fill className="object-contain rounded-xl" />
              </div>
              <h3 className="font-semibold">{title || 'Název produktu'}</h3>
              <p className="text-lg font-bold">{price ? Number(price).toLocaleString('cs-CZ') : '—'} Kč</p>
            </div>
          ) : (
            <div className="card text-gray-500 text-center">Nahraj obrázek pro náhled…</div>
          )}
        </div>
      </div>
    </div>
  )
}
