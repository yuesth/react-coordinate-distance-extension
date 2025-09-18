/** @type {import('tailwindcss').Config} */

const path = require("path");

module.exports = {
  // content: [
  //   path.join(__dirname, "src/**/*.{html,js,ts,tsx,jsx}"),
  //   path.join(__dirname, "src/*.{html,js,ts,tsx,jsx}"),
  // ],
  // content: [
  //   "./src/**/*.{html,js,ts,tsx,jsx}",
  //   "./src/*.{html,js,ts,tsx,jsx}",
  //   "./public/**/*.html",
  //   "./src/index.html",
  // ],
  // content: ["./src/**/*./{js,jsx,ts,tsx}"],
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
