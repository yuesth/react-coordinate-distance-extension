/** @type {import('tailwindcss').Config} */

const path = require("path");

module.exports = {
  content: [
    "./src/**/*.{html,js,ts,tsx,jsx}",
    "./src/*.{html,js,ts,tsx,jsx}",
    "./public/**/*.html",
    "./src/index.html",
    "./src/react/**/*.{ts,tsx}", // Add specific paths
    "./src/content/**/*.{ts,tsx}",
    "./src/background/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [require("@tailwindcss/forms")],
};
