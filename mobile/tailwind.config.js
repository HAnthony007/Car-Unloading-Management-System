/** @type {import('tailwindcss').Config} */
module.exports = {
    // Ajouter toutes les sources utilisant className
    content: [
        "./app/**/*.{js,jsx,ts,tsx}",
        "./src/**/*.{js,jsx,ts,tsx}", // nécessaire pour login-form.tsx
    ],
    presets: [require("nativewind/preset")],
    theme: {
        extend: {
            colors: {
                // SMMC green-inspired palette
                primary: {
                    DEFAULT: "#16a34a", // emerald-600
                    foreground: "#ffffff",
                },
                secondary: {
                    DEFAULT: "#d1fae5", // emerald-100
                    foreground: "#065f46", // emerald-800
                },
                accent: {
                    DEFAULT: "#22c55e", // emerald-500
                    foreground: "#064e3b", // emerald-900
                },
            },
            // Optional rounded corners similar to web radius
            borderRadius: {
                xl: "0.75rem",
            },
        },
    },
    plugins: [],
};
