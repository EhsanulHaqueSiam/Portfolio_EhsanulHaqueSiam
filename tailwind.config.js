/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{astro,html,js,ts,jsx,tsx,mdx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Semantic theme tokens (shadcn-style, HSL triplets set in index.css;
        // light + dark values swap on the html.dark class).
        background: 'hsl(var(--background) / <alpha-value>)',
        foreground: 'hsl(var(--foreground) / <alpha-value>)',
        card: 'hsl(var(--card) / <alpha-value>)',
        'card-foreground': 'hsl(var(--card-foreground) / <alpha-value>)',
        primary: 'hsl(var(--primary) / <alpha-value>)',
        'primary-foreground': 'hsl(var(--primary-foreground) / <alpha-value>)',
        secondary: 'hsl(var(--secondary) / <alpha-value>)',
        'secondary-foreground': 'hsl(var(--secondary-foreground) / <alpha-value>)',
        muted: 'hsl(var(--muted) / <alpha-value>)',
        'muted-foreground': 'hsl(var(--muted-foreground) / <alpha-value>)',
        accent: 'hsl(var(--accent) / <alpha-value>)',
        'accent-foreground': 'hsl(var(--accent-foreground) / <alpha-value>)',
        border: 'hsl(var(--border) / <alpha-value>)',
        input: 'hsl(var(--input) / <alpha-value>)',
        ring: 'hsl(var(--ring) / <alpha-value>)',

        // Legacy tokens kept so the Resume print overlay (intentionally
        // paper-light) keeps compiling unchanged.
        'paper': {
          DEFAULT: '#F7F3EB',
          50: '#FDFBF7',
          100: '#F7F3EB',
          200: '#EFE9DC',
          300: '#E5DCC9',
          400: '#D6C9AE',
        },
        'ink': {
          DEFAULT: '#191713',
          950: '#0D0C0A',
          900: '#191713',
          800: '#2A2723',
          700: '#3B372F',
          600: '#575145',
          500: '#6E6759',
          400: '#8C8371',
          300: '#B3A995',
        },
        'vermilion': {
          DEFAULT: '#E34F27',
          50: '#FCEDE7',
          400: '#EE6B41',
          500: '#E34F27',
          600: '#C93E1B',
          700: '#A33217',
        },
        'cobalt': {
          DEFAULT: '#1D4ED8',
          500: '#1D4ED8',
          700: '#1E3A8A',
        },
      },
      fontFamily: {
        sans: ['Geist Variable', 'Geist', 'system-ui', 'sans-serif'],
        mono: ['Geist Mono Variable', 'Geist Mono', 'ui-monospace', 'SFMono-Regular', 'monospace'],
        script: ['Pacifico', 'ui-rounded', 'cursive'],
        body: ['Geist Variable', 'Geist', 'system-ui', 'sans-serif'],
      },
      animation: {
        marquee: 'marquee var(--duration, 40s) linear infinite',
        'marquee-vertical': 'marquee-vertical var(--duration, 40s) linear infinite',
        'button-shine': 'button-shine var(--speed, 4.5s) ease-in-out infinite',
        'shimmer-slide': 'shimmer-slide var(--speed, 3s) ease-in-out infinite alternate',
        'spin-around': 'spin-around calc(var(--speed, 3s) * 2) infinite linear',
        'border-beam': 'border-beam calc(var(--duration, 6) * 1s) infinite linear',
        rainbow: 'rainbow var(--speed, 2s) infinite linear',
        wiggle: 'wiggle 0.8s ease-out 1',
        'spin-grow': 'spin-grow 0.5s cubic-bezier(0.22, 1, 0.36, 1)',
        'sound-wave': 'sound-wave ease-in-out infinite alternate',
        meteor: 'meteor 6s cubic-bezier(0.20, 0.1, 0.30, 1) infinite',
        'pulse-dot': 'pulse-dot 2.4s ease-in-out infinite',
      },
      keyframes: {
        marquee: {
          from: { transform: 'translateX(0)' },
          to: { transform: 'translateX(calc(-100% - var(--gap, 1rem)))' },
        },
        'marquee-vertical': {
          from: { transform: 'translateY(0)' },
          to: { transform: 'translateY(calc(-100% - var(--gap, 1rem)))' },
        },
        'button-shine': {
          '0%': { transform: 'translateX(-150%) skewX(-20deg)' },
          '30%, 100%': { transform: 'translateX(350%) skewX(-20deg)' },
        },
        'shimmer-slide': {
          to: { transform: 'translate(calc(100cqw - 100%), 0)' },
        },
        'spin-around': {
          '0%': { transform: 'translateZ(0) rotate(0)' },
          '15%, 35%': { transform: 'translateZ(0) rotate(90deg)' },
          '65%, 85%': { transform: 'translateZ(0) rotate(270deg)' },
          '100%': { transform: 'translateZ(0) rotate(360deg)' },
        },
        'border-beam': {
          '100%': { 'offset-distance': '100%' },
        },
        rainbow: {
          '0%': { 'background-position': '0%' },
          '100%': { 'background-position': '200%' },
        },
        wiggle: {
          '0%': { transform: 'rotate(-15deg)' },
          '20%': { transform: 'rotate(15deg)' },
          '40%': { transform: 'rotate(-10deg)' },
          '60%': { transform: 'rotate(10deg)' },
          '80%': { transform: 'rotate(-5deg)' },
          '100%': { transform: 'rotate(0deg)' },
        },
        'spin-grow': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        'sound-wave': {
          '0%': { transform: 'scaleY(0.3)' },
          '100%': { transform: 'scaleY(1)' },
        },
        meteor: {
          '0%': { transform: 'rotate(var(--angle)) translateX(0)', opacity: '0.1' },
          '70%': { opacity: '1' },
          '100%': { transform: 'rotate(var(--angle)) translateX(-500px)', opacity: '0.1' },
        },
        'pulse-dot': {
          '0%, 100%': { opacity: '1', boxShadow: '0 0 0 0 rgba(74, 222, 128, 0.45)' },
          '50%': { opacity: '0.75', boxShadow: '0 0 0 5px rgba(74, 222, 128, 0)' },
        },
      },
      transitionTimingFunction: {
        'out-quart': 'cubic-bezier(0.25, 1, 0.5, 1)',
        'out-expo': 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
    },
  },
  plugins: [],
}
