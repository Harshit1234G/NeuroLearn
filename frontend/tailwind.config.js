/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      keyframes: {
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-700px 0' },
          '100%': { backgroundPosition: '700px 0' },
        },
      },
      animation: {
        fadeInUp: 'fadeInUp 500ms ease-out',
        shimmer: 'shimmer 1.5s infinite linear',
      },
      boxShadow: {
        soft: '0 8px 30px rgba(0,0,0,0.06)'
      },
      backgroundImage: {
        'radial-glow': 'radial-gradient(800px 400px at 50% -20%, rgba(59,130,246,0.25), transparent)',
        'grid': 'linear-gradient(to right, rgba(0,0,0,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(0,0,0,0.05) 1px, transparent 1px)'
      },
      backgroundSize: {
        grid: '24px 24px'
      }
    },
  },
  plugins: [],
}


