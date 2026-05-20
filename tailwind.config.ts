import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: "#111827",
        lime: "#D7FF3F",
        blue: "#2563EB",
        surface: "#F7F8FA",
        card: "#FFFFFF"
      },
      boxShadow: {
        soft: "0 18px 45px rgba(17, 24, 39, 0.09)",
        lift: "0 22px 60px rgba(17, 24, 39, 0.14)"
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
