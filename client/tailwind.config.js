/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: "#4F46E5", // Indigo-600
                secondary: "#9333EA", // Purple-600
                background: "#0F172A", // Slate-900
                surface: "#1E293B", // Slate-800
                "surface-hover": "#334155", // Slate-700
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
            }
        },
    },
    plugins: [],
}
