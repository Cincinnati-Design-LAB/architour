/** @type {import('tailwindcss').Config} */
const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Poppins', ...defaultTheme.fontFamily.sans],
      },
      colors: {
        primary: {
          500: '#799A05',
          600: '#698605',
        },
        // Gray
        secondary: {
          500: '#3D3935',
          600: '#2e2b28',
        },
      },
    },
  },
  plugins: [],
};
