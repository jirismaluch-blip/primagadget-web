'use client'
import { useState } from 'react'

export default function ImageUploader({
  onUploaded,
  label = 'Nahrát obrázek',
}: {
  onUploaded?: (data: { main: string; thumb: string }) => void
  label?: string
}) {
  const [preview, setPreview] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<{ main: string; thumb: string } | null>(null)

  async function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setError(null)
    setResult(null)

    const reader = new FileReader()
    reader.onload = () => setPreview(reader.result as string)
    reader.readAsDataURL(file)

    const form = new FormData()
    form.append('image', file)

    setLoading(true)
    try {
      const res = await fetch('/api/upload', { method: 'POST', body: form })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error || 'Chyba')
      setResult({ main: data.main, thumb: data.thumb })
      onUploaded?.({ main: data.main, thumb: data.thumb })
    } catch (err: any) {
      setError(err.message || 'Upload se nezdařil.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-3">
      <label className="label">{label}</label>
      <input
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleChange}
        className="input cursor-pointer"
      />

      {preview && (
        <img src={preview} alt="Náhled" className="mt-2 max-h-48 rounded-xl border" />
      )}

      {loading && <p>Nahrávám a optimalizuju…</p>}
      {error && <p className="text-red-600">{error}</p>}

      {result && (
        <div className="space-y-1">
          <p className="text-sm">Hlavní (1000px): <code>{result.main}</code></p>
          <p className="text-sm">Náhled (400px): <code>{result.thumb}</code></p>
        </div>
      )}
    </div>
  )
}
