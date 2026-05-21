/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Brand palette: deep forest green, warm golden sunlight,
        // dusk lavender, cream. Tuned for both day + dusk scene lighting.
        moss: {
          50: '#f1f8f1',
          100: '#dfeede',
          200: '#bcdbba',
          300: '#8fc28d',
          400: '#5fa55c',
          500: '#3f8a3c',
          600: '#2e6e2c',
          700: '#255824',
          800: '#1d461d',
          900: '#0f2a10',
        },
        sun: {
          200: '#ffe9a8',
          400: '#ffc857',
          500: '#f5b13a',
          600: '#d18d1a',
        },
        dusk: {
          400: '#9b8cc4',
          600: '#5b4b8a',
          800: '#2a214a',
          900: '#160f2b',
        },
        cream: '#fdf7ec',
      },
      fontFamily: {
        // Display: Fraunces (warm modern serif). Body: Inter.
        display: ['"Fraunces"', 'ui-serif', 'Georgia', 'serif'],
        sans: ['"Inter"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
