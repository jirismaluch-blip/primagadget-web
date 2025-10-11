Verze 2.6.1 – DARK MODE + Blue Accent (#3b82f6)

Co se mění:
- Tailwind: darkMode:'class' + nové barvy (darkBg, darkCard, darkText, darkAccent)
- Globální styly: dark varianty pro body, card, btn, input
- Přidán přepínač tématu components/ThemeToggle.tsx (pamatuje se v localStorage)
- Upraven layout: import ThemeToggle + nové metadata

Instalace (update balíček):
1) Rozbal obsah ZIPu do kořene projektu verze 2.6 (přepiš soubory).
2) Spusť projekt: npm run dev (žádné nové dependency není třeba).
3) Otevři web a klikni na přepínač 🌙/☀️ vpravo dole.

Rollback: vrať původní soubory tailwind.config.js, app/globals.css, app/layout.tsx a smaž components/ThemeToggle.tsx
