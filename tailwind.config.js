/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{astro,html,js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // "Obsidian Signal" dark glass palette.
        // NOTE: legacy token names kept ("paper" = dark surfaces, "ink" = light
        // foreground) so the entire component layer re-themes from one place.
        'paper': {
          DEFAULT: '#05060A',
          50: '#0B0D14',   // raised glass base
          100: '#05060A',  // page void
          200: '#0E1118',  // recessed panel
          300: '#161A26',  // elevated surface / hover
          400: '#232939',  // highest surface
        },
        'ink': {
          DEFAULT: '#EEF1F8',
          950: '#FFFFFF',
          900: '#EEF1F8',  // primary text
          800: '#D6DBE8',
          700: '#AEB5C8',
          600: '#8B92A8',
          500: '#6E7488',  // muted
          400: '#4E5468',
          300: '#343A4C',
        },
        // Accent — electric iris violet (legacy name kept)
        'vermilion': {
          DEFAULT: '#8B7CFF',
          50: '#191633',   // violet-tinted dark surface
          400: '#A99DFF',
          500: '#8B7CFF',
          600: '#6F5CF2',
          700: '#5643D8',
        },
        // Secondary accent — signal cyan (legacy name kept)
        'cobalt': {
          DEFAULT: '#5EE7F5',
          500: '#5EE7F5',
          700: '#0E7490',
        },
      },
      fontFamily: {
        // Display grotesque — tight, Framer-like headlines (Archivo variable)
        'poster': ['Archivo Variable', 'Archivo', 'Arial Black', 'sans-serif'],
        // Serif voice — italic accents, pull quotes
        'display': ['Fraunces Variable', 'Fraunces', 'Georgia', 'Times New Roman', 'serif'],
        'body': ['Instrument Sans Variable', 'Instrument Sans', 'system-ui', 'sans-serif'],
        'mono': ['Spline Sans Mono Variable', 'Spline Sans Mono', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      fontSize: {
        // Fluid display scale
        'display-xl': ['clamp(3.5rem, 11vw, 10rem)', { lineHeight: '0.95', letterSpacing: '-0.04em' }],
        'display-lg': ['clamp(2.75rem, 7.5vw, 6.5rem)', { lineHeight: '0.98', letterSpacing: '-0.035em' }],
        'display-md': ['clamp(2rem, 4.5vw, 3.75rem)', { lineHeight: '1.05', letterSpacing: '-0.025em' }],
        'label': ['0.6875rem', { lineHeight: '1.4', letterSpacing: '0.14em' }],
      },
      animation: {
        'spin-slow': 'spin 24s linear infinite',
        'shimmer': 'shimmer 2s infinite',
        'marquee-left': 'marquee-left 42s linear infinite',
        'marquee-right': 'marquee-right 42s linear infinite',
        'aurora-drift': 'aurora-drift 26s ease-in-out infinite alternate',
        'pulse-dot': 'pulse-dot 2.4s ease-in-out infinite',
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
        'aurora-drift': {
          '0%': { transform: 'translate3d(-4%, -2%, 0) scale(1)' },
          '100%': { transform: 'translate3d(4%, 3%, 0) scale(1.08)' },
        },
        'pulse-dot': {
          '0%, 100%': { opacity: '1', boxShadow: '0 0 0 0 rgba(74, 222, 128, 0.45)' },
          '50%': { opacity: '0.75', boxShadow: '0 0 0 5px rgba(74, 222, 128, 0)' },
        },
      },
      transitionTimingFunction: {
        'out-quart': 'cubic-bezier(0.25, 1, 0.5, 1)',
        'out-expo': 'cubic-bezier(0.16, 1, 0.3, 1)',
        'editorial': 'cubic-bezier(0.65, 0, 0.35, 1)',
      },
      boxShadow: {
        // Glass elevation + accent glows
        'plate': '0 1px 0 rgba(255, 255, 255, 0.04) inset, 0 16px 40px -20px rgba(0, 0, 0, 0.8)',
        'plate-lg': '0 1px 0 rgba(255, 255, 255, 0.06) inset, 0 40px 80px -32px rgba(0, 0, 0, 0.9)',
        'glow': '0 0 0 1px rgba(139, 124, 255, 0.25), 0 8px 40px -8px rgba(139, 124, 255, 0.35)',
        'glow-sm': '0 0 24px -6px rgba(139, 124, 255, 0.45)',
        'glow-cyan': '0 0 32px -8px rgba(94, 231, 245, 0.4)',
      },
      backdropBlur: {
        'glass': '20px',
      },
    },
  },
  plugins: [],
}
