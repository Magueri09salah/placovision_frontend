/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#9E3E37',
          dark: '#842F2A',
          light: '#B85650',
          50: '#FDF5F4',
          100: '#FBEAE9',
          200: '#F5D0CE',
          300: '#EEB6B2',
          400: '#D67A74',
          500: '#9E3E37',
          600: '#842F2A',
          700: '#6B2622',
          800: '#521D1A',
          900: '#3A1412',
        },
        neutral: {
          50: '#F7F7F9',
          100: '#EFEFEF',
          200: '#E5E5E5',
          300: '#D4D4D4',
          400: '#A3A3A3',
          500: '#737373',
          600: '#525252',
          700: '#404040',
          800: '#262626',
          900: '#171717',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'card': '0 4px 6px -1px rgba(158, 62, 55, 0.1), 0 2px 4px -1px rgba(158, 62, 55, 0.06)',
        'card-hover': '0 10px 15px -3px rgba(158, 62, 55, 0.1), 0 4px 6px -2px rgba(158, 62, 55, 0.05)',
      }
    },
  },
  plugins: [],
}

