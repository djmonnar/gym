import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: "#111827",
        lime: "#D7FF3F",
        blue: "#2563EB",
        surface: "#0F172A",
        card: "#FFFFFF"
      },
      boxShadow: {
        soft: "0 18px 45px rgba(17, 24, 39, 0.14)",
        lift: "0 28px 70px rgba(17, 24, 39, 0.2)",
        glow: "0 0 0 1px rgba(255,255,255,0.08), 0 24px 80px rgba(17,24,39,0.28)"
      },
      fontFamily: {
        sans: [
          "Pretendard Variable",
          "Pretendard",
          "-apple-system",
          "BlinkMacSystemFont",
          "system-ui",
          "sans-serif"
        ]
      }
    }
  },
  plugins: []
} satisfies Config;
