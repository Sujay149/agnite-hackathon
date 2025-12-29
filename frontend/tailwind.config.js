/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        industrial: {
          50: '#f5f7fa',
          100: '#ebeef3',
          200: '#d2dae5',
          300: '#aab9cd',
          400: '#7c93b0',
          500: '#5a7396',
          600: '#475b7d',
          700: '#3a4a65',
          800: '#323f55',
          900: '#2d3748',
        },
        safety: {
          green: '#10b981',
          yellow: '#f59e0b',
          red: '#ef4444',
          blue: '#3b82f6',
        }
      },
    },
  },
  plugins: [],
}