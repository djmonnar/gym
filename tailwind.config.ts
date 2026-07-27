import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // 웜 잉크: 다크 헤더·섹션 배경과 흰 배경 위 본문/제목 텍스트에 함께 씁니다.
        brand: "#241C1A",
        // 액센트(코럴)는 배경 밝기에 따라 두 단계로 씁니다.
        // lime: 흰 배경 위 채움(위에 흰 글자) / limeSoft: 다크 잉크 위 텍스트·아이콘
        lime: "#FF5A3C",
        limeSoft: "#FF8A6B",
        // 보조/인포 액센트(딥 코럴): 아이콘·강조 텍스트·핀
        blue: "#C7381F",
        // 부드러운 코럴/웜 틴트 (인포·안내 카드 배경)
        mist: "#FFF0EB",
        honey: "#FFF3E4",
        sand: "#F3E4DB",
        warm: "#FAF6F3",
        surface: "#17110F",
        card: "#FFFFFF"
      },
      boxShadow: {
        soft: "0 18px 45px rgba(45, 25, 18, 0.12)",
        lift: "0 28px 70px rgba(45, 25, 18, 0.18)",
        glow: "0 0 0 1px rgba(255,255,255,0.08), 0 24px 80px rgba(23,17,15,0.3)"
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
