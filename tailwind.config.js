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
        soc: {
          bg: 'var(--soc-bg)',
          surface: 'var(--soc-surface)',
          surface2: 'var(--soc-surface2)',
          border: 'var(--soc-border)',
          text: 'var(--soc-text)',
          muted: 'var(--soc-muted)',
          accent: 'var(--soc-accent)',
          accentHover: 'var(--soc-accent-hover)',
          success: 'var(--soc-success)',
          warning: 'var(--soc-warning)',
          critical: 'var(--soc-critical)',
        }
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'Fira Code', 'Menlo', 'Monaco', 'Courier New', 'monospace'],
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        'soc-glow': '0 0 20px -5px rgba(108, 124, 255, 0.25)',
        'soc-glow-critical': '0 0 20px -5px rgba(255, 93, 108, 0.35)',
        'soc-glow-success': '0 0 20px -5px rgba(66, 211, 146, 0.3)',
        'window': '0 12px 36px -4px rgba(0, 0, 0, 0.45), 0 4px 12px -2px rgba(0, 0, 0, 0.2)',
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fade-in': 'fadeIn 0.2s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'scale(0.98)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        }
      }
    },
  },
  plugins: [],
}
