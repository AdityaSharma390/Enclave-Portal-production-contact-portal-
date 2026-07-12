/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f5f7fa',
          100: '#e4e8f0',
          200: '#c5cfe1',
          300: '#97abc9',
          400: '#6481ad',
          500: '#476391', // Classic steel-blue primary
          600: '#374e77',
          700: '#2f4063',
          800: '#283452',
          900: '#232d46',
          950: '#151b2a',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Outfit', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
