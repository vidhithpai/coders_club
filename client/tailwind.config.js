/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: "#3b82f6", // Blue-500
                "primary-glow": "rgba(59, 130, 246, 0.5)",
                secondary: "#a855f7", // Purple-500
                background: "#0F172A", // Slate-900
                surface: "#1E293B", // Slate-800
                "surface-hover": "#334155", // Slate-700
                "main": "#f8fafc",
                "muted": "#94a3b8",
                "border-color": "#334155",
                "success-color": "#22c55e",
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
            }
        },
    },
    plugins: [],
}
