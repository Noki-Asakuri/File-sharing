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
                "toast-hide": {
                    "0%": { opacity: 1 },
                    "100%": { opacity: 0 },
                },
                "toast-slide-in-right": {
                    "0%": { transform: `translateX(calc(100% + 1rem))` },
                    "100%": { transform: "translateX(0)" },
                },
                spin: {
                    from: { transform: "rotate(0deg)" },
                    to: { transform: "rotate(360deg)" },
                },
            },
            animation: {
                fadeIn: "fadeIn 0.2s linear forwards",
                fadeOut: "fadeOut 0.2s linear forwards",
                "toast-hide": "toast-hide 100ms ease-in forwards",
                "toast-slide-in-right":
                    "toast-slide-in-right 150ms cubic-bezier(0.16, 1, 0.3, 1)",
                refetchSpin: "spin 0.5s linear infinite",
            },
        },
    },
    plugins: [require("tailwindcss-radix")()],
};
