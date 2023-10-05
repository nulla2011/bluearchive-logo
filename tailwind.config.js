/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{jsx,js,ts,tsx}'],
  theme: {
    extend: {},
  },
  plugins: [require('daisyui')],
  daisyui: {
    themes: [
      {
        mytheme: {
          primary: '#65ceff',
          secondary: '#2b2b2b',
          '--rounded-btn': '0.25rem',
        },
      },
    ],
  },
};
