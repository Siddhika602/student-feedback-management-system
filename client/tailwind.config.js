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
        obsidian: {
          DEFAULT: '#07070B',
          deep: '#040407',
          surface: '#0D0D14',
          card: '#12121D',
          hover: '#181827',
          border: 'rgba(255, 255, 255, 0.08)',
          'border-violet': 'rgba(139, 92, 246, 0.22)',
        },
        violet: {
          accent: '#8B5CF6',
          neon: '#B9A0FF',
          dark: '#5B21B6',
          muted: '#4C1D95',
        },
        cyan: {
          neon: '#22D3EE',
        },
        emerald: {
          neon: '#34D399',
        },
        text: {
          primary: '#F5F3FF',
          secondary: '#A1A1B5',
          muted: '#6E6E85',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        heading: ['Plus Jakarta Sans', 'Inter', 'sans-serif'],
      },
      boxShadow: {
        'glass-card': '0 16px 40px -10px rgba(0, 0, 0, 0.65), inset 0 1px 1px 0 rgba(255, 255, 255, 0.08)',
        'glass-card-hover': '0 20px 50px -10px rgba(139, 92, 246, 0.25), inset 0 1px 1px 0 rgba(185, 160, 255, 0.22)',
        'violet-glow': '0 0 25px -4px rgba(139, 92, 246, 0.45)',
        'cyan-glow': '0 0 25px -4px rgba(34, 211, 238, 0.45)',
        'emerald-glow': '0 0 25px -4px rgba(52, 211, 153, 0.45)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 4s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' },
        }
      }
    },
  },
  plugins: [],
}
