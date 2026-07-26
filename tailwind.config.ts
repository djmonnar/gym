import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: "#12372A",
        lime: "#D7FF3F",
        blue: "#2F6F5E",
        sand: "#E8DCC4",
        warm: "#F7F6F2",
        surface: "#0B2A20",
        card: "#FFFFFF"
      },
      boxShadow: {
        soft: "0 18px 45px rgba(18, 55, 42, 0.14)",
        lift: "0 28px 70px rgba(18, 55, 42, 0.2)",
        glow: "0 0 0 1px rgba(255,255,255,0.08), 0 24px 80px rgba(11,42,32,0.3)"
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
