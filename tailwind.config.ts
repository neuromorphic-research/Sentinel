import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Surfaces
        base: "#0A0B0D",
        panel: "#101216",
        "panel-2": "#15181E",
        elevated: "#1A1E26",
        hairline: "#23272F",
        "hairline-strong": "#2E333D",

        // Text
        ink: "#E7EAF0",
        "ink-soft": "#A6ADBB",
        "ink-faint": "#6B7280",

        // Accent (neuromorphic electric cyan)
        accent: "#22D3EE",
        "accent-soft": "#0E7490",
        "accent-dim": "#155E75",

        // Status
        threat: "#F2495C",
        "threat-dim": "#7F1D24",
        safe: "#3BB273",
        "safe-dim": "#1C4A33",
        pending: "#F5A524",
        "pending-dim": "#7A4A0E",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      borderColor: {
        DEFAULT: "#23272F",
      },
      boxShadow: {
        panel: "0 1px 0 0 rgba(255,255,255,0.02) inset, 0 0 0 1px rgba(255,255,255,0.01)",
        glow: "0 0 24px -6px rgba(34,211,238,0.35)",
      },
      keyframes: {
        scan: {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(100%)" },
        },
        "pulse-ring": {
          "0%": { transform: "scale(0.8)", opacity: "0.7" },
          "100%": { transform: "scale(2.2)", opacity: "0" },
        },
        flicker: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.55" },
        },
        "fade-in": {
          from: { opacity: "0", transform: "translateY(4px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        scan: "scan 3s linear infinite",
        "pulse-ring": "pulse-ring 1.8s ease-out infinite",
        flicker: "flicker 2.5s ease-in-out infinite",
        "fade-in": "fade-in 0.4s ease-out both",
      },
    },
  },
  plugins: [],
};

export default config;
