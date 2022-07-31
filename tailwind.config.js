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
                spin: {
                    from: { transform: "rotate(0deg)" },
                    to: { transform: "rotate(360deg)" },
                },
                "rainbow-animation": {
                    "0%, 100%": {
                        "background-position": "0 0",
                    },

                    "50%": {
                        "background-position": "100% 0",
                    },
                },
            },
            animation: {
                fadeIn: "fadeIn 0.2s linear forwards",
                fadeOut: "fadeOut 0.2s linear forwards",
                refetchSpin: "spin 0.5s linear infinite",
                rainbow: "rainbow-animation 6s ease-in-out infinite",
            },
            screens: {
                dashboard: { max: "1380px" },
            },
            backgroundImage: {
                "rainbow-text":
                    "linear-gradient(to right,#6666ff, #0099ff, #00ff00, #ff3399, #6666ff)",
            },
            backgroundSize: {
                "rainbow-text": "400% 100%",
            },
        },
    },
    plugins: [require("tailwindcss-radix")()],
};
