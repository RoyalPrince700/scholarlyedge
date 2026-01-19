/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fdf8f6',
          100: '#f2e8e5',
          200: '#eaddd7',
          300: '#e0cec7',
          400: '#d2bab0',
          500: '#8d6e63',
          600: '#795548',
          700: '#5d4037',
          800: '#4d3a33',
          900: '#352722',
        },
        cream: {
          50: '#fffdfa',
          100: '#fefaf0',
          200: '#fdf5e1',
          300: '#fcefc2',
          400: '#fbe9a3',
          500: '#fada84',
          600: '#e1c477',
          700: '#b8a061',
          800: '#8e7c4b',
          900: '#655835',
        },
        gray: {
          50: '#fafaf9',
          100: '#f5f5f4',
          200: '#e7e5e4',
          300: '#d6d3d1',
          400: '#a8a29e',
          500: '#78716c',
          600: '#57534e',
          700: '#44403c',
          800: '#292524',
          900: '#1c1917',
        }
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}