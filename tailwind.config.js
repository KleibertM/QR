/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        title: ["Quicksand", "sans-serif"],
        sans: ["Nunito", "sans-serif"],
      },
    },
  },
  plugins: [],
};
