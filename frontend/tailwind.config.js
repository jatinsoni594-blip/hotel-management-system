/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        hotel: {
          navy: '#0f172a',
          gold: '#d97706',
          goldLight: '#fef3c7',
          blue: '#1e3a8a',
          accent: '#2563eb'
        }
      }
    },
  },
  plugins: [],
}
