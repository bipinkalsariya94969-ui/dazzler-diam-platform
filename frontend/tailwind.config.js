/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        obsidian: '#050505',
        diamond: {
          50: '#f9f7f4',
          100: '#f0ece4',
          200: '#e1d9cc',
          300: '#cbbea9',
          400: '#b39e82',
          500: '#9e8566',
          600: '#8a6f52',
          700: '#725a43',
          800: '#5d4939',
          900: '#4c3c30',
        },
        gold: {
          50: '#fdf9ed',
          100: '#f9f0cc',
          200: '#f4df94',
          300: '#edca57',
          400: '#e8b830',
          500: '#d89a18',
          600: '#b97613',
          700: '#935514',
          800: '#794417',
          900: '#663919',
        },
        platinum: {
          50: '#f8f9fa',
          100: '#f0f1f3',
          200: '#dde0e4',
          300: '#c3c8cf',
          400: '#9fa8b3',
          500: '#838e9a',
          600: '#6c7582',
          700: '#5a606c',
          800: '#4d525b',
          900: '#43464d',
        },
      },
      fontFamily: {
        cormorant: ['var(--font-cormorant)', 'serif'],
        montserrat: ['var(--font-montserrat)', 'sans-serif'],
        raleway: ['var(--font-raleway)', 'sans-serif'],
      },
      animation: {
        'fade-up': 'fadeUp 0.8s ease forwards',
        'fade-in': 'fadeIn 1s ease forwards',
        shimmer: 'shimmer 2s infinite',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
        float: 'float 6s ease-in-out infinite',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(232, 184, 48, 0.3)' },
          '50%': { boxShadow: '0 0 40px rgba(232, 184, 48, 0.7)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
      },
      backgroundImage: {
        'diamond-shimmer': 'linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)',
        'gold-gradient': 'linear-gradient(135deg, #f9f0cc 0%, #d89a18 50%, #f9f0cc 100%)',
        'dark-luxury': 'radial-gradient(ellipse at center, #1a1209 0%, #050505 70%)',
      },
    },
  },
  plugins: [],
}
