/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{astro,html,js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // "Proof of Work" editorial palette — warm paper, warm ink, print accents
        'paper': {
          DEFAULT: '#F5F1E8',
          50: '#FAF7F0',
          100: '#F5F1E8',
          200: '#ECE5D6',
          300: '#DED4BF',
          400: '#C7BA9F',
        },
        'ink': {
          DEFAULT: '#171412',
          950: '#0F0D0B',
          900: '#171412',
          800: '#252019',
          700: '#3B342B',
          600: '#544A3E',
          500: '#6B6152',
          400: '#8D8371',
          300: '#B0A794',
        },
        'vermilion': {
          DEFAULT: '#D93A0D',
          50: '#FBEAE3',
          400: '#EF5D2E',
          500: '#D93A0D',
          600: '#BC300A',
          700: '#9A2708',
        },
        'cobalt': {
          DEFAULT: '#2C45C9',
          500: '#2C45C9',
          700: '#1F3092',
        },
      },
      fontFamily: {
        // Poster grotesque — giant cinematic headlines (Archivo variable, wdth axis)
        'poster': ['Archivo Variable', 'Archivo', 'Arial Black', 'sans-serif'],
        // Serif voice — italic accents, pull quotes, bio typesetting
        'display': ['Fraunces Variable', 'Fraunces', 'Georgia', 'Times New Roman', 'serif'],
        'body': ['Instrument Sans Variable', 'Instrument Sans', 'system-ui', 'sans-serif'],
        'mono': ['Spline Sans Mono Variable', 'Spline Sans Mono', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      fontSize: {
        // Fluid display scale for editorial headlines
        'display-xl': ['clamp(3.5rem, 11vw, 10rem)', { lineHeight: '0.92', letterSpacing: '-0.02em' }],
        'display-lg': ['clamp(2.75rem, 7.5vw, 6.5rem)', { lineHeight: '0.95', letterSpacing: '-0.02em' }],
        'display-md': ['clamp(2rem, 4.5vw, 3.75rem)', { lineHeight: '1.02', letterSpacing: '-0.01em' }],
        'label': ['0.6875rem', { lineHeight: '1.4', letterSpacing: '0.14em' }],
      },
      animation: {
        'spin-slow': 'spin 24s linear infinite',
        'shimmer': 'shimmer 2s infinite',
        'marquee-left': 'marquee-left 42s linear infinite',
        'marquee-right': 'marquee-right 42s linear infinite',
      },
      keyframes: {
        'shimmer': {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
        'marquee-left': {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        'marquee-right': {
          '0%': { transform: 'translateX(-50%)' },
          '100%': { transform: 'translateX(0)' },
        },
      },
      transitionTimingFunction: {
        'out-quart': 'cubic-bezier(0.25, 1, 0.5, 1)',
        'out-expo': 'cubic-bezier(0.16, 1, 0.3, 1)',
        'editorial': 'cubic-bezier(0.65, 0, 0.35, 1)',
      },
      boxShadow: {
        'plate': '0 1px 0 rgba(23, 20, 18, 0.08), 0 12px 32px -16px rgba(23, 20, 18, 0.22)',
        'plate-lg': '0 2px 0 rgba(23, 20, 18, 0.06), 0 32px 64px -24px rgba(23, 20, 18, 0.3)',
      },
    },
  },
  plugins: [],
}
