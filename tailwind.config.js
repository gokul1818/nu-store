/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
   
    extend: {
      colors: {
        primary: "#000000",
        success: "#22c55e",
        error: "#ef4444",
        v: "#FF7B0C",
        white: "#ffffff",
      },
    },
  },
  plugins: [],
};
