/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
      colors: {
        // Purple Cyberpunk Palette
        primary: {
          DEFAULT: '#B794F4',
          light: '#D6BCFA',
          dark: '#A855F7',
          50: '#FAF5FF',
          100: '#F3E8FF',
          500: '#B794F4',
          600: '#A855F7',
          700: '#9333EA',
        },
        // Background colors
        dark: {
          DEFAULT: '#121317',
          card: '#1A1B23',
          border: '#2D2D3A',
        },
        // Slate for text
        slate: {
          300: '#CBD5E1',
          400: '#94A3B8',
          500: '#64748B',
          600: '#475569',
          700: '#334155',
          800: '#1E293B',
          900: '#0F172A',
        },
      },
      backgroundColor: {
        'primary-10': 'rgba(183, 148, 244, 0.1)',
        'primary-20': 'rgba(183, 148, 244, 0.2)',
        'dark': '#121317',
        'dark-card': '#1A1B23',
      },
      borderColor: {
        'primary-30': 'rgba(183, 148, 244, 0.3)',
        'primary-50': 'rgba(183, 148, 244, 0.5)',
        'slate-border': 'rgba(45, 45, 58, 0.5)',
      },
      boxShadow: {
        'card': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'card-hover': '0 10px 40px rgba(183, 148, 244, 0.15)',
        'glow': '0 0 20px rgba(183, 148, 244, 0.2)',
      },
      backdropBlur: {
        'xs': '2px',
      },
      transitionTimingFunction: {
        'bounce-soft': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
      },
    },
  },
  plugins: [
    function({ addUtilities }) {
      const newUtilities = {
        '.bg-clip-text': {
          '-webkit-background-clip': 'text',
          'background-clip': 'text',
        },
        '.text-fill-transparent': {
          '-webkit-text-fill-color': 'transparent',
        },
      }
      addUtilities(newUtilities)
    },
  ],
}
