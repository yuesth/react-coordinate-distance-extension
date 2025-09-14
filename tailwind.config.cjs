/** @type {import('tailwindcss').Config} */

const path = require("path");

module.exports = {
  // content: [
  //   path.join(__dirname, "src/**/*.{html,js,ts,tsx,jsx}"),
  //   path.join(__dirname, "src/*.{html,js,ts,tsx,jsx}"),
  // ],
    content: [
    "./src/**/*.{html,js,ts,tsx,jsx}",
    "./src/*.{html,js,ts,tsx,jsx}",
    "./public/**/*.html",
    "./src/index.html",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
