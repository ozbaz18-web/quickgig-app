/** @type {import('tailwindcss').Config} */
module.exports = {
  // v4 סורק קבצים אוטומטית, אבל אפשר להשאיר content אם בא לך:
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: { DEFAULT: "#FF7A00" },
      },
      borderRadius: { xl: "12px", "2xl": "16px" },
      boxShadow: { soft: "0 6px 20px rgba(0,0,0,.06)" },
    },
  },
  plugins: [require("@tailwindcss/forms")],

};
