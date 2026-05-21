/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#0a0a0a',
        ink2: '#141414',
        ink3: '#1c1c1c',
        line: '#232323',
        accent: '#5DCAA5',
        accent2: '#1D9E75',
        accent3: '#0F6E56',
        accentbg: '#042C20',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
