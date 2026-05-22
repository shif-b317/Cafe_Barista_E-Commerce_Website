/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'oat-milk': '#F7F1E6',
        'peony-blush': '#E8C5C0',
        'canyon-clay': '#C26D53',
        'eucalyptus-mist': '#A3AE9A',
        'coastal-haze': '#8FA1B2',
        'forest-floor': '#4E5A46',
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'serif'],
        sans: ['"Inter"', 'sans-serif'],
        cute: ['"Comfortaa"', 'cursive'],
        handwritten: ['"Sacramento"', 'cursive'],
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(78, 90, 70, 0.08)',
        'premium': '0 10px 30px -5px rgba(78, 90, 70, 0.12)',
      }
    },
  },
  plugins: [],
}
