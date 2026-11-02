/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./components/**/*.{js,vue,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./plugins/**/*.{js,ts}",
    "./app.vue",
    "./error.vue"
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        brand: {
          50: '#f1f8f4',
          100: '#dcefe3',
          200: '#b8dfc7',
          300: '#88c6a1',
          400: '#52a978',
          500: '#2f8b5f',
          600: '#1f7a52',
          700: '#195f41',
          800: '#164c35',
          900: '#123d2b',
        }
      }
    },
  },
  plugins: [],
}
