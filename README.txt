Dropshipping v2.6

Funkce:
- Upload obrázků s automatickou optimalizací (Sharp → WebP, 1000/400 px)
- Admin: /admin/products/new (přidání produktu: název, cena, fotka)
- API: /api/upload, /api/products (GET/POST)
- Frontend: výpis produktů na /

Rychlý start:
1) npm i
2) npm run dev
3) Otevři http://localhost:3000/
4) Přidej první produkt na /admin/products/new

Poznámky:
- Obrázky se ukládají do public/uploads/YYYY/MM/DD/
- Produkty do data/products.json
- Tailwind je nakonfigurován (app/globals.css)
