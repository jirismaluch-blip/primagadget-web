import { NextResponse } from 'next/server'
import sharp from 'sharp'
import { promises as fs } from 'fs'
import path from 'path'

export const runtime = 'nodejs'

const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads')

async function ensureDir(dir: string) {
  await fs.mkdir(dir, { recursive: true })
}

function sanitizeFilename(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9._-]/g, '-')
}

export async function POST(req: Request) {
  try {
    const form = await req.formData()
    const file = form.get('image') as File | null

    if (!file) return NextResponse.json({ error: 'Soubor „image” chybí.' }, { status: 400 })

    const allowed = ['image/jpeg', 'image/png', 'image/webp']
    if (!allowed.includes(file.type)) {
      return NextResponse.json({ error: 'Povolené formáty: JPG, PNG, WEBP.' }, { status: 400 })
    }

    const buffer = Buffer.from(await file.arrayBuffer())

    const now = new Date()
    const folder = path.join(
      UPLOAD_DIR,
      `${now.getFullYear()}`,
      `${String(now.getMonth() + 1).padStart(2, '0')}`,
      `${String(now.getDate()).padStart(2, '0')}`
    )
    await ensureDir(folder)

    const base = sanitizeFilename(file.name.replace(/\.(jpg|jpeg|png|webp)$/i, '')) || 'image'
    const mainName = `${base}-1000.webp`
    const thumbName = `${base}-400.webp`

    const mainPath = path.join(folder, mainName)
    const thumbPath = path.join(folder, thumbName)

    await sharp(buffer)
      .rotate()
      .resize({ width: 1000, height: 1000, fit: 'inside', withoutEnlargement: true })
      .webp({ quality: 80 })
      .toFile(mainPath)

    await sharp(buffer)
      .rotate()
      .resize({ width: 400, height: 400, fit: 'inside', withoutEnlargement: true })
      .webp({ quality: 80 })
      .toFile(thumbPath)

    const publicMain = mainPath.split('public').pop()!.replaceAll(path.sep, '/')
    const publicThumb = thumbPath.split('public').pop()!.replaceAll(path.sep, '/')

    return NextResponse.json({ ok: true, main: publicMain, thumb: publicThumb })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'Upload selhal.' }, { status: 500 })
  }
}
