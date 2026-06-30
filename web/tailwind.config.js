/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        pitch: { DEFAULT: "#0B6E2E", deep: "#063D1A" },
        night: { DEFAULT: "#0A0F14", panel: "#101820", soft: "#16212B" },
        flood: "#F5F7F5",
        gold: "#FFC83D",
        neon: "#2BE0A8",
        danger: "#E23B3B",
        good: "#22C55E",
      },
      fontFamily: {
        display: ['"Noto Sans Georgian"', '"Anton"', "system-ui", "sans-serif"],
        body: ['"Noto Sans Georgian"', "system-ui", "sans-serif"],
      },
      boxShadow: {
        glow: "0 0 24px rgba(43,224,168,0.35)",
        gold: "0 0 28px rgba(255,200,61,0.45)",
        card: "0 12px 40px rgba(0,0,0,0.45)",
      },
      backgroundImage: {
        "pitch-stripes":
          "repeating-linear-gradient(90deg, rgba(255,255,255,0.04) 0 28px, rgba(255,255,255,0) 28px 56px)",
      },
      keyframes: {
        floodflicker: {
          "0%,100%": { opacity: "1" },
          "92%": { opacity: "1" },
          "94%": { opacity: "0.55" },
          "96%": { opacity: "1" },
        },
        ballspin: { to: { transform: "rotate(360deg)" } },
        pop: { "0%": { transform: "scale(0.6)", opacity: "0" }, "100%": { transform: "scale(1)", opacity: "1" } },
        shake: {
          "0%,100%": { transform: "translateX(0)" },
          "25%": { transform: "translateX(-6px)" },
          "75%": { transform: "translateX(6px)" },
        },
      },
      animation: {
        floodflicker: "floodflicker 6s infinite",
        ballspin: "ballspin 1.1s linear infinite",
        pop: "pop 0.25s ease-out",
        shake: "shake 0.35s ease-in-out",
      },
    },
  },
  plugins: [],
};
