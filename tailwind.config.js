/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        paper: {
          DEFAULT: '#f5f0dc',
          dark: '#ebe5cf',
        },
        brand: {
          50: '#e7fcf9',
          100: '#c9f7f0',
          200: '#8ff0e4',
          300: '#4fe3d4',
          400: '#12c6b8',
          500: '#00a89c',
          600: '#00938a',
          700: '#007a73',
          800: '#065f52',
          900: '#064e3b',
          950: '#04382b',
        },
        ink: {
          50: '#fafaf9',
          100: '#e7e5e4',
          200: '#d6d3d1',
          300: '#a8a29e',
          400: '#78716c',
          500: '#6b6763',
          600: '#4a4744',
          700: '#292524',
          800: '#171512',
          900: '#0d1117',
          950: '#000000',
        },
        surface: {
          DEFAULT: '#ffffff',
          muted: '#f1f0ea',
          sunken: '#ebe5cf',
        },
        status: {
          normal: '#00c853',
          attention: '#ffb800',
          critical: '#ff3b3b',
          collected: '#00c2c8',
        },
        neon: {
          teal: '#00c2c8',
          green: '#00c853',
          gold: '#ffb800',
          yellow: '#fff000',
          magenta: '#ff80ff',
          magentaDeep: '#f0f',
        },
        tone: {
          danger: '#ffe5e5',
          success: '#e5f9ed',
          teal: '#d5f7f8',
          yellow: '#fffcd5',
          magenta: '#ffe5ff',
        },
      },
      fontFamily: {
        sans: ['"Space Grotesk"', 'ui-sans-serif', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
        display: ['"Archivo Black"', '"Space Grotesk"', 'ui-sans-serif', 'sans-serif'],
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
      },
      borderRadius: {
        DEFAULT: '0.375rem',
        lg: '0.375rem',
        xl: '0.5rem',
        '2xl': '0.625rem',
      },
      boxShadow: {
        card: '3px 3px 0 0 #0d1117',
        raised: '5px 5px 0 0 #0d1117',
        overlay: '8px 8px 0 0 #0d1117',
        brutal: '4px 4px 0 0 #000000',
        'brutal-sm': '2px 2px 0 0 #000000',
      },
      keyframes: {
        'fade-in': {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        'scale-in': {
          from: { opacity: '0', transform: 'translateY(6px) scale(0.98)' },
          to: { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
        'slide-up': {
          from: { opacity: '0', transform: 'translateY(12px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-in-right': {
          from: { opacity: '0', transform: 'translateX(24px)' },
          to: { opacity: '1', transform: 'translateX(0)' },
        },
        'pulse-ring': {
          '0%': { transform: 'scale(0.85)', opacity: '0.7' },
          '80%, 100%': { transform: 'scale(1.6)', opacity: '0' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.2s ease-out',
        'scale-in': 'scale-in 0.2s ease-out',
        'slide-up': 'slide-up 0.28s ease-out',
        'slide-in-right': 'slide-in-right 0.28s ease-out',
        'pulse-ring': 'pulse-ring 1.6s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
  plugins: [],
}