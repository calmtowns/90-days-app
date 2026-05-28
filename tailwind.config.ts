import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./features/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        beige: {
          50: "#FAFAF7",
          100: "#F5F0E8",
          200: "#EDE4D4",
          300: "#DDD0B8",
          400: "#C9B896",
          500: "#B5A07A",
        },
        brown: {
          300: "#C4A882",
          400: "#A88B5E",
          500: "#8B6F47",
          600: "#7A5F3A",
          700: "#5C4428",
        },
        dark: {
          50: "#2E2A22",
          100: "#242018",
          200: "#1A1814",
          300: "#141210",
          400: "#0F0E0B",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      borderRadius: {
        "2xl": "16px",
        "3xl": "24px",
        "4xl": "32px",
      },
      boxShadow: {
        "warm-sm": "0 2px 8px rgba(139, 111, 71, 0.08)",
        "warm-md": "0 4px 16px rgba(139, 111, 71, 0.12)",
        "warm-lg": "0 8px 32px rgba(139, 111, 71, 0.16)",
        "warm-xl": "0 16px 48px rgba(139, 111, 71, 0.20)",
        "glass": "0 4px 24px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,0.6)",
      },
      animation: {
        "float": "float 3s ease-in-out infinite",
        "pulse-warm": "pulseWarm 2s ease-in-out infinite",
        "bounce-gentle": "bounceGentle 1s ease-in-out infinite",
        "shimmer": "shimmer 2s linear infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-8px)" },
        },
        pulseWarm: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.7" },
        },
        bounceGentle: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-4px)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
