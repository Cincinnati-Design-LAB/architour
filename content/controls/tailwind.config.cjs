/** @type {import('tailwindcss').Config} */
const { theme, plugins } = require('../../tailwind.config.cjs');

module.exports = {
  content: ['./**/*.html'],
  theme,
  plugins,
};
