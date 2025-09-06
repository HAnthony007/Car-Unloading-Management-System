/** @type {import('tailwindcss').Config} */
module.exports = {
  // Ajouter toutes les sources utilisant className
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}", // nécessaire pour login-form.tsx
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {},
  },
  plugins: [],
}