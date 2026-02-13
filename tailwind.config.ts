import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                "pastel-pink": "#FFD1DC",
                "pastel-mint": "#D1FFDC",
                "pastel-blue": "#D1E8FF",
                "pastel-yellow": "#FFF9D1",
                "soft-gray": "#F5F5F5",
                "text-primary": "#4A4A4A", // Softer than black
            },
            fontFamily: {
                // We'll install a custom font later, e.g., 'Inter'
            },
            boxShadow: {
                'soft': '0 10px 40px -10px rgba(0, 0, 0, 0.05)', // Keep decent base for white on white
                'soft-pink': '0 10px 40px -10px rgba(255, 209, 220, 0.6)', // Warmer pink glow
                'soft-mint': '0 10px 40px -10px rgba(209, 255, 220, 0.6)',
                'inner-light': 'inset 0 2px 4px 0 rgba(255, 255, 255, 0.5)',
            },
            borderRadius: {
                'xl': '1rem',
                '2xl': '1.5rem',
                '3xl': '2rem',
            }
        },
    },
    plugins: [],
};
export default config;
