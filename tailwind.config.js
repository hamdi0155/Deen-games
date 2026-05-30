/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,jsx,ts,tsx}', './components/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        background: '#0f1117',
        surface: '#1a1d27',
        card: '#242836',
        gold: {
          DEFAULT: '#d4a843',
          light: '#f0c85a',
          dark: '#a8832f',
        },
        emerald: {
          DEFAULT: '#2ecc71',
          dark: '#27ae60',
        },
        muted: '#6b7280',
        danger: '#e74c3c',
      },
      fontFamily: {
        arabic: ['Amiri-Regular'],
        'arabic-bold': ['Amiri-Bold'],
      },
    },
  },
  plugins: [],
};
