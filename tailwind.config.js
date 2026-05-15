/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#e6faf3',
          100: '#b3f0d9',
          200: '#80e6bf',
          300: '#4ddca5',
          400: '#26d08f',
          500: '#1D9E75',
          600: '#0f7a59',
          700: '#085a40',
          800: '#033d2b',
          900: '#011f16',
        },
      },
      fontFamily: {
        sans: ['DM Sans', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
    },
  },
  plugins: [],
}

