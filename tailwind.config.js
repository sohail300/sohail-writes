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
        'neo-white': '#ffffff',
        'neo-black': '#000000',
        'neo-yellow': '#ffeb3b',
        'neo-pink': '#ff006e',
        'neo-blue': '#00b4d8',
        'neo-green': '#90ee90',
        'neo-orange': '#ff6b35',
        'neo-gray': '#e5e5e5',
        'neo-gray-dark': '#9e9e9e',
      },
      boxShadow: {
        'neo': '6px 6px 0px #000',
        'neo-sm': '4px 4px 0px #000',
        'neo-lg': '8px 8px 0px #000',
      },
    },
  },
  plugins: [],
}

