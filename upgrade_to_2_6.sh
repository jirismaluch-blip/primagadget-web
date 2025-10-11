#!/bin/bash
# ----------------------------------------
# 🔄 Upgrade skript: z verze 2.5 → 2.6 (full package)
# ----------------------------------------

echo "🧩 Záloha aktuální verze (2.5)..."
mkdir -p backups
TIMESTAMP=$(date +%Y%m%d-%H%M%S)
tar -czf "backups/backup_v2_5_$TIMESTAMP.tar.gz" app components data public package.json 2>/dev/null || true
echo "✅ Záloha vytvořena: backups/backup_v2_5_$TIMESTAMP.tar.gz"

echo "📦 Kopíruji novou verzi 2.6..."
mkdir -p ../tmp_upgrade
cp -r . ../tmp_upgrade

echo "📂 Zachovávám složku uploads a data..."
mkdir -p public/uploads data
cp -r ../tmp_upgrade/public/uploads/* public/uploads/ 2>/dev/null || true
cp ../tmp_upgrade/data/products.json data/products.json 2>/dev/null || true

echo "📦 Instalace závislostí..."
npm install

echo "✅ Upgrade dokončen!"
echo "Spusť projekt příkazem: npm run dev"
