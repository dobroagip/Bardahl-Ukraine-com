/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/hooks/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/services/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/utils/**/*.{js,ts,jsx,tsx,mdx}",
  ],
 theme: {
    extend: {
      colors: {
        bardahl: {
          yellow: '#FFCC00',
          gold: '#FFD700',
          black: '#000000',
          carbon: '#1a1a1a',
          'dark-gray': '#2d2d2d',
          'metal-gray': '#4a4a4a',
          red: '#E31E24',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Montserrat', 'Inter', 'sans-serif'],
        mono: ['Orbitron', 'monospace'],
      },
      backgroundImage: {
        'bardahl-gradient': 'linear-gradient(135deg, #FFCC00 0%, #FFD700 100%)',
        'dark-gradient': 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
        'racing-gradient': 'linear-gradient(135deg, #000000 0%, #FFCC00 50%, #000000 100%)',
      },
      boxShadow: {
        'bardahl': '0 4px 20px rgba(255, 204, 0, 0.2)',
        'bardahl-lg': '0 8px 30px rgba(255, 204, 0, 0.3)',
        'bardahl-xl': '0 12px 40px rgba(255, 204, 0, 0.5)',
        'carbon': '0 4px 20px rgba(0, 0, 0, 0.3)',
      },
      borderRadius: {
        'bardahl': '12px',
        'bardahl-lg': '16px',
        'bardahl-xl': '24px',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'pulse-gold': 'pulse-gold 2s ease-in-out infinite',
        'fadeIn': 'fadeIn 0.2s ease-out forwards',
        'slideUp': 'slideUp 0.3s ease-out forwards',
        'slideDown': 'slideDown 0.2s ease-in forwards',
        'shake': 'shake 0.5s ease-in-out',
        'bounce-once': 'bounceOnce 0.6s ease-in-out',
      },
      keyframes: {
        'pulse-gold': {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.8', transform: 'scale(1.05)' },
        },
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        slideUp: {
          from: { opacity: '0', transform: 'translateY(50px) scale(0.95)' },
          to: { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
        slideDown: {
          from: { opacity: '1', transform: 'translateY(0) scale(1)' },
          to: { opacity: '0', transform: 'translateY(50px) scale(0.95)' },
        },
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '10%, 30%, 50%, 70%, 90%': { transform: 'translateX(-5px)' },
          '20%, 40%, 60%, 80%': { transform: 'translateX(5px)' },
        },
        bounceOnce: {
          '0%, 100%': { transform: 'translateY(0) scale(1)' },
          '50%': { transform: 'translateY(-20px) scale(1.1)' },
        },
      },
    },
  },
  plugins: [],
}