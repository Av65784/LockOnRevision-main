/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#1f2933",
        paper: "#f7f4ea",
        moss: "#2e7d59",
        mint: "#b8efd4",
        coral: "#ef7d62",
        marigold: "#f6c65b",
        sky: "#62a8db",
      },
      boxShadow: {
        soft: "0 18px 50px rgba(31, 41, 51, 0.11)",
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
