/** @type {import('tailwindcss').Config} */

module.exports = {
    content: ["./src/**/*.{js,ts,jsx,tsx}"],
    theme: {
        extend: {
            keyframes: {
                fadeIn: {
                    "0%": { opacity: 0, transform: "translateY(-20px)" },
                    "100%": { opacity: 1, transform: "translateY(0)" },
                },

                fadeOut: {
                    "0%": { opacity: 1, transform: "translateY(0)" },
                    "100%": { opacity: 0, transform: "translateY(-20px)" },
                },
            },
            animation: {
                fadeIn: "fadeIn 0.2s linear forwards",
                fadeOut: "fadeOut 0.2s linear forwards",
            },
        },
    },
    plugins: [require("tailwindcss-radix")()],
};
