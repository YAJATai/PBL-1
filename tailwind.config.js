/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#ecfdf5',
          100: '#d1fae5',
          200: '#a7f3d0',
          300: '#6ee7b7',
          400: '#34d399',
          500: '#10b981',
          600: '#059669',
          700: '#047857',
          800: '#065f46',
          900: '#064e3b',
          950: '#022c22',
        },
        ink: {
          50: '#f6f7f7',
          100: '#e3e6e5',
          200: '#c7cdcb',
          300: '#a3ada9',
          400: '#7a8783',
          500: '#5f6c68',
          600: '#4a5551',
          700: '#3d4643',
          800: '#333a38',
          900: '#1b211f',
          950: '#0f1412',
        },
        surface: {
          DEFAULT: '#ffffff',
          muted: '#f5f7f6',
          sunken: '#eef2f0',
        },
        status: {
          normal: '#10b981',
          attention: '#f59e0b',
          critical: '#e11d48',
          collected: '#3b82f6',
        },
      },
      fontFamily: {
        sans: [
          'Inter',
          'ui-sans-serif',
          'system-ui',
          '-apple-system',
          'Segoe UI',
          'Roboto',
          'Helvetica Neue',
          'Arial',
          'sans-serif',
        ],
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
      },
      borderRadius: {
        xl: '0.875rem',
        '2xl': '1.125rem',
      },
      boxShadow: {
        card: '0 1px 2px 0 rgb(16 24 20 / 0.04), 0 1px 3px 0 rgb(16 24 20 / 0.06)',
        raised: '0 4px 16px -4px rgb(16 24 20 / 0.12), 0 2px 6px -2px rgb(16 24 20 / 0.08)',
        overlay: '0 24px 60px -12px rgb(16 24 20 / 0.28)',
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
