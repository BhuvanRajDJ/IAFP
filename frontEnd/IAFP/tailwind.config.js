/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        "primary": "#4F46E5",
        "background-light": "#f6f6f8",
        "background-dark": "#101322",
        "input-dark": "#232948",
        "text-muted": "#929bc9",
      },
      fontFamily: {
        "display": ["Lexend", "sans-serif"]
      },
      borderRadius: {
        "xl": "0.75rem",
      },
    },
  },
  plugins: [],
}
