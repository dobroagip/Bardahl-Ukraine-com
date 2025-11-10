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
      backgroundImage: {
        'bardahl-gradient': 'linear-gradient(135deg, #FFCC00 0%, #FFD700 100%)',
        'dark-gradient': 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
        'racing-gradient': 'linear-gradient(135deg, #000000 0%, #FFCC00 50%, #000000 100%)',
        'carbon-fiber': 'linear-gradient(45deg, #1a1a1a 25%, #2d2d2d 25%, #2d2d2d 50%, #1a1a1a 50%, #1a1a1a 75%, #2d2d2d 75%)',
        'metal-texture': 'linear-gradient(135deg, #4a4a4a 0%, #2d2d2d 50%, #1a1a1a 100%)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Montserrat', 'sans-serif'],
        racing: ['Orbitron', 'monospace'],
      },
      animation: {
        'shine': 'shine 2s ease-in-out infinite',
        'pulse-gold': 'pulse-gold 2s ease-in-out infinite',
        'slide-in': 'slide-in 0.3s ease-out',
        'fade-in': 'fade-in 0.5s ease-out',
      },
      keyframes: {
        shine: {
          '0%': { 'background-position': '-200% 0' },
          '100%': { 'background-position': '200% 0' },
        },
        'pulse-gold': {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.7 },
        },
        'slide-in': {
          '0%': { transform: 'translateY(-10px)', opacity: 0 },
          '100%': { transform: 'translateY(0)', opacity: 1 },
        },
        'fade-in': {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
      },
      boxShadow: {
        'bardahl': '0 4px 20px rgba(255, 204, 0, 0.3)',
        'bardahl-lg': '0 10px 40px rgba(255, 204, 0, 0.4)',
        'carbon': '0 4px 20px rgba(26, 26, 26, 0.8)',
        'racing': '0 0 20px rgba(255, 204, 0, 0.5)',
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      borderRadius: {
        'bardahl': '0.75rem',
        'bardahl-lg': '1rem',
      },
      gradientColorStops: {
        'bardahl-start': '#FFCC00',
        'bardahl-end': '#FFD700',
      },
    },
  },
  plugins: [
    function({ addUtilities }) {
      addUtilities({
        '.text-bardahl-glow': {
          'text-shadow': '0 0 10px rgba(255, 204, 0, 0.7), 0 0 20px rgba(255, 204, 0, 0.5)',
        },
        '.border-bardahl': {
          'border-image': 'linear-gradient(135deg, #FFCC00, #FFD700) 1',
        },
        '.bg-carbon-fiber': {
          'background-size': '10px 10px',
          'background-image': 'linear-gradient(45deg, #1a1a1a 25%, transparent 25%, transparent 50%, #1a1a1a 50%, #1a1a1a 75%, transparent 75%, transparent)',
        },
      })
    },
  ],
}