/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",

    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        blood: {
          50: '#FEF2F2',
          100: '#FEE2E2',
          200: '#FECACA',
          300: '#FCA5A5',
          400: '#F87171',
          500: '#E31E24', // Primary blood red
          600: '#C41E3A',
          700: '#A01D33',
          800: '#7F1D1D',
          900: '#5C1A1A',
        },
        navy: {
          50: '#F8FAFC',
          100: '#F1F5F9',
          200: '#E2E8F0',
          300: '#CBD5E1',
          400: '#94A3B8',
          500: '#2C3E50', // Primary navy blue
          600: '#1E293B',
          700: '#0F172A',
          800: '#0A0F1A',
          900: '#050810',
        },
        lightBlue: {
          50: '#F0F9FF',
          100: '#E8F4F8', // Primary light blue background
          200: '#BAE6FD',
          300: '#A8D5E2', // Soft blue for decorative elements
          400: '#38BDF8',
          500: '#0EA5E9',
          600: '#0284C7',
          700: '#0369A1',
          800: '#075985',
          900: '#0C4A6E',
        },
      },
      fontFamily: {
        sans: ['Philosopher', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

