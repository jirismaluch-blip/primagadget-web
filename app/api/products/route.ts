import { NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'

const DATA_PATH = path.join(process.cwd(), 'data', 'products.json')

async function readProducts() {
  try {
    const data = await fs.readFile(DATA_PATH, 'utf-8')
    return JSON.parse(data)
  } catch {
    return []
  }
}

async function writeProducts(products: any[]) {
  await fs.mkdir(path.dirname(DATA_PATH), { recursive: true })
  await fs.writeFile(DATA_PATH, JSON.stringify(products, null, 2))
}

export async function GET() {
  const products = await readProducts()
  return NextResponse.json(products)
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => null)
  const { title, price, image } = body || {}

  if (!title || typeof price !== 'number' || !image?.main) {
    return NextResponse.json({ error: 'Chybí údaje o produktu.' }, { status: 400 })
  }

  const products = await readProducts()
  const id = Date.now().toString()

  const newProduct = { id, title, price, image }
  products.push(newProduct)

  await writeProducts(products)
  return NextResponse.json(newProduct)
}
