import Image from "next/image";

async function getProducts() {
  // When running locally, NEXT_PUBLIC_BASE_URL may be undefined; fall back to relative
  const res = await fetch(process.env.NEXT_PUBLIC_BASE_URL ? `${process.env.NEXT_PUBLIC_BASE_URL}/api/products` : `${process.env.NEXT_PUBLIC_BASE_PATH || ""}/api/products`, { next: { revalidate: 5 } });
  return res.json();
}

export default async function HomePage() {
  const products = await getProducts();

  return (
    <main>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Produkty</h1>
        <a href="/admin/products/new" className="btn">➕ Přidat produkt</a>
      </div>

      {(!products || products.length === 0) ? (
        <div className="card text-gray-600">Zatím žádné produkty. Přejdi do „Přidat produkt“ a nahraj první (třeba ovladač PS5).</div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {products.map((p: any) => (
            <div key={p.id} className="card hover:shadow-lg transition">
              <div className="relative aspect-square mb-3">
                <Image
                  src={p.image?.thumb || p.image?.main || "/placeholder.png"}
                  alt={p.title || "Produkt"}
                  fill
                  className="object-contain rounded-xl"
                />
              </div>
              <h3 className="font-semibold line-clamp-2">{p.title}</h3>
              <p className="text-lg font-bold mt-1">{typeof p.price === "number" ? p.price.toLocaleString("cs-CZ") : p.price} Kč</p>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
