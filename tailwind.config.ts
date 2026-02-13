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
                "cream-50": "#FFFDF9",
                "pastel-pink": "#FFD1DC",
                "mint-green": "#D1FFDC",
                "lavender": "#E0BBE4",
                "charcoal-muted": "#4A4A4A",
                "text-primary": "#4A4A4A",
            },
            fontFamily: {
                sans: ['var(--font-nunito)', 'system-ui', 'sans-serif'],
            },
            boxShadow: {
                'soft': '0 10px 40px -10px rgba(0, 0, 0, 0.05)',
                'soft-pink': '0 10px 40px -10px rgba(255, 209, 220, 0.6)',
                'pink-glow': '0 15px 45px -10px rgba(255, 143, 171, 0.3)',
                'lavender-glow': '0 15px 45px -10px rgba(224, 187, 228, 0.4)',
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
