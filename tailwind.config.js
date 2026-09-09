/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./index.tsx",
    "./App.tsx",
    "./components/**/*.{ts,tsx}",
    "./utils/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        trillex: {
          orange: "#FF7F50",
          black: "#050505",
          white: "#EAEAEA",
        },
      },
      fontFamily: {
        sans: ["Space Grotesque", "sans-serif"],
        display: ["Space Grotesque", "sans-serif"],
        slab: ["Space Grotesque", "sans-serif"],
        mono: ["Space Grotesque", "sans-serif"],
        momo: ["Outfit", "sans-serif"],
        zalando: ['"Zalando Sans Expanded"', "Archivo", "sans-serif"],
      },
      // Replaces tailwindcss-animate (animate-in fade-in zoom-in-*) which only
      // shipped via the CDN Play runtime — not available in build-time CSS
      keyframes: {
        "enter-fade": { from: { opacity: "0" }, to: { opacity: "1" } },
        "enter-zoom": {
          from: { opacity: "0", transform: "scale(0.75)" },
          to: { opacity: "1", transform: "scale(1)" },
        },
        "enter-slide-top": {
          from: { opacity: "0", transform: "translateY(-0.5rem)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        in: "enter-fade 0.5s ease-out both",
      },
    },
  },
  plugins: [
    function ({ addUtilities }) {
      addUtilities({
        ".fade-in": { animationName: "enter-fade" },
        ".zoom-in-75": { animationName: "enter-zoom" },
        ".zoom-in-95": {
          animationName: "enter-zoom",
          "--tw-enter-scale": "0.95",
        },
        ".slide-in-from-top-2": { animationName: "enter-slide-top" },
        ".fill-mode-forwards": { animationFillMode: "forwards" },
      });
    },
  ],
};
