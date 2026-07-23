/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "Fira Code", "Menlo", "monospace"],
      },
      keyframes: {
        "cursor-blink": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0" },
        },
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "dot-pulse": {
          "0%, 100%": { opacity: "1", transform: "scale(1)" },
          "50%": { opacity: "0.6", transform: "scale(1.35)" },
        },
      },
      animation: {
        "cursor-blink": "cursor-blink 1.1s step-end infinite",
        "dot-pulse": "dot-pulse 2s ease-in-out infinite",
      },
      boxShadow: {
        "blue-glow": "0 0 0 1px rgba(59,130,246,0.15), 0 4px 24px rgba(59,130,246,0.12)",
        "btn-primary": "0 1px 3px rgba(0,0,0,0.4), 0 4px 16px rgba(59,130,246,0.25)",
      },
    },
  },
  plugins: [],
};