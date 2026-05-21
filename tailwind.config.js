/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        lendzingo: {
          green: '#2282e4',
          'green-dark': '#1a6dc7',
          'green-light': '#edf0f3',
          ink: '#1f2526',
          muted: '#7c8591',
          bg: '#edf0f3',
          'footer-bg': '#1f2526',
        },
      },
      fontFamily: {
        serif: ['var(--font-serif)', 'Georgia', 'serif'],
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
