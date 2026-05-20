import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: "#09090B",
        lime: "#FF1F3D",
        blue: "#B91C1C",
        surface: "#101014",
        card: "#FFFFFF"
      },
      boxShadow: {
        soft: "0 18px 45px rgba(5, 5, 8, 0.18)",
        lift: "0 30px 80px rgba(255, 31, 61, 0.22)",
        glow: "0 0 0 1px rgba(255,255,255,0.08), 0 24px 80px rgba(255,31,61,0.3)"
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
