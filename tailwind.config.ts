import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: '1.25rem',
        sm: '1.5rem',
        lg: '2rem',
        xl: '2.5rem',
      },
      screens: {
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1200px',
        '2xl': '1320px',
      },
    },
    extend: {
      colors: {
        moss: 'rgb(var(--moss) / <alpha-value>)',
        leaf: 'rgb(var(--leaf) / <alpha-value>)',
        forest: 'rgb(var(--forest) / <alpha-value>)',
        bark: 'rgb(var(--bark) / <alpha-value>)',
        soil: 'rgb(var(--soil) / <alpha-value>)',
        cream: 'rgb(var(--cream) / <alpha-value>)',
        stone: 'rgb(var(--stone) / <alpha-value>)',
        bloom: 'rgb(var(--bloom) / <alpha-value>)',
        ink: 'rgb(var(--ink) / <alpha-value>)',
        mist: 'rgb(var(--mist) / <alpha-value>)',
      },
      fontFamily: {
        display: ['"Fraunces"', 'ui-serif', 'Georgia', 'serif'],
        sans: ['"Inter"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        xs: 'var(--radius-xs)',
        sm: 'var(--radius-sm)',
        md: 'var(--radius-md)',
        lg: 'var(--radius-lg)',
        xl: 'var(--radius-xl)',
      },
      boxShadow: {
        soft: 'var(--shadow-soft)',
        lift: 'var(--shadow-lift)',
      },
      fontSize: {
        'display-xl': ['clamp(2.75rem, 6vw + 1rem, 5.25rem)', { lineHeight: '1.02', letterSpacing: '-0.02em' }],
        'display-lg': ['clamp(2.25rem, 4vw + 1rem, 3.75rem)', { lineHeight: '1.05', letterSpacing: '-0.02em' }],
        'display-md': ['clamp(1.75rem, 2.5vw + 1rem, 2.5rem)', { lineHeight: '1.1', letterSpacing: '-0.015em' }],
        eyebrow: ['0.8125rem', { lineHeight: '1.2', letterSpacing: '0.14em' }],
      },
      transitionTimingFunction: {
        'out-soft': 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
    },
  },
  plugins: [],
};

export default config;
