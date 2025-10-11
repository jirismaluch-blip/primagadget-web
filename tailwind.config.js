/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        darkBg: '#0d0d0d',
        darkCard: '#1a1a1a',
        darkText: '#e5e5e5',
        darkAccent: '#3b82f6'
      }
    }
  },
  plugins: []
}
