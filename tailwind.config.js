module.exports = {
  darkMode: 'class',
  content: ["./app/**/*.{ts,tsx,js,jsx}", "./components/**/*.{ts,tsx,js,jsx}"],
  theme: {
    extend: {
      colors: { bg:"#05070b", card:"#0b0f17", text:"#e8eef8", brand:{ blue:"#3B82F6", neon:"#0EA3FF", green:"#22c55e", red:"#ff3b3b" } },
      boxShadow: { glow:"0 0 30px rgba(59,130,246,0.35)" },
      backgroundImage: { 'radial':'radial-gradient(1000px 600px at 10% 10%, rgba(59,130,246,0.18), transparent), radial-gradient(1000px 600px at 90% 10%, rgba(34,197,94,0.18), transparent)' }
    }
  },
  plugins: []
}
