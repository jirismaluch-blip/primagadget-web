# 🚀 Dropshipping verze 2.6 FULL

### Co obsahuje:
✅ Kompletní kód verze 2.6 (Next.js + Tailwind + Sharp)  
✅ Automatickou optimalizaci obrázků (WebP, 1000/400 px)  
✅ Admin panel `/admin/products/new`  
✅ Frontend výpis produktů `/`  
✅ API endpointy `/api/upload` a `/api/products`  
✅ Jednoduchou databázi `data/products.json`  
✅ Upgrade skript `upgrade_to_2_6.sh`  

### Instalace / upgrade:
1. Rozbal archiv do složky s projektem verze 2.5  
2. Otevři terminál a spusť:
   ```bash
   ./upgrade_to_2_6.sh
   ```
3. Po dokončení spusť:
   ```bash
   npm run dev
   ```
4. Otevři prohlížeč: [http://localhost:3000](http://localhost:3000)

---

### 📁 Struktura
```
/app               → logika webu a API
/components        → React komponenty
/data              → databáze produktů
/public/uploads    → uložené obrázky
upgrade_to_2_6.sh  → skript na upgrade
```
