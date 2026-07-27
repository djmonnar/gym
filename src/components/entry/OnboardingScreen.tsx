import { useState } from "react";
import { ArrowRight, Dumbbell, QrCode, Sparkles } from "lucide-react";
import type { ScreenId } from "../../types";
import { cn } from "../ui";
import { BrandVisual, EntryButton, EntryHeadline, EntryLayout } from "./EntryLayout";

const steps = [
  {
    eyebrow: "MONTHLY PASS",
    title: (
      <>
        헬스부터 요가까지,
        <br />
        <span className="text-lime">원하는 운동을 한 달씩</span>
      </>
    ),
    description: "가격과 거리, 운영시간을 비교하고 내 생활에 맞는 운동을 월 단위로 시작하세요.",
    caption: "종목을 바꿔도 구독은 그대로",
    chips: ["월구독", "종목 선택", "가까운 시설"],
    icon: <Dumbbell size={20} />
  },
  {
    eyebrow: "SECURE CHECK-IN",
    title: (
      <>
        결제하면
        <br />
        <span className="text-lime">QR 이용권이 바로 열려요</span>
      </>
    ),
    description: "30초마다 갱신되는 동적 QR로 빠르고 안전하게 입장할 수 있습니다.",
    caption: "30초마다 새로 발급되는 1회용 QR",
    chips: ["동적 QR", "캡처 방지", "1회용 토큰"],
    icon: <QrCode size={20} />
  },
  {
    eyebrow: "FITNESS CARE",
    title: (
      <>
        PT, 루틴, AI 식단까지
        <br />
        <span className="text-lime">한 번에</span>
      </>
    ),
    description: "운동 목표에 맞춰 트레이너 매칭, 주간 루틴, 맞춤 식단, 상품 주문까지 연결합니다.",
    caption: "나에게 맞는 선생님부터 식단까지",
    chips: ["PT 매칭", "AI 루틴", "AI 식단", "리턴샵"],
    icon: <Sparkles size={20} />
  }
];

export function OnboardingScreen({ navigate }: { navigate: (screen: ScreenId) => void }) {
  const [step, setStep] = useState(0);
  const current = steps[step];
  const isLast = step === steps.length - 1;

  return (
    <EntryLayout
      topBar={
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => navigate("location")}
            className="text-sm font-black text-white/60 transition hover:text-white"
          >
            건너뛰기
          </button>
          <div className="flex items-center gap-2" aria-label={`온보딩 ${step + 1} / ${steps.length}`}>
            {steps.map((item, index) => (
              <span
                key={item.eyebrow}
                className={cn("h-1.5 rounded-full transition-all", index === step ? "w-8 bg-lime" : "w-1.5 bg-white/25")}
              />
            ))}
          </div>
        </div>
      }
      left={
        <div>
          <EntryHeadline eyebrow={current.eyebrow} title={current.title} description={current.description} />

          <p className="mt-8 text-[11px] font-black text-white/40">
            STEP {step + 1} / {steps.length}
          </p>

          <div className="mt-4 flex flex-col gap-3 sm:max-w-[420px] sm:flex-row">
            <EntryButton
              variant="outline"
              className="sm:w-[38%]"
              onClick={() => (step === 0 ? navigate("splash") : setStep((value) => value - 1))}
            >
              이전
            </EntryButton>
            <EntryButton onClick={() => (isLast ? navigate("login") : setStep((value) => value + 1))}>
              {isLast ? "리턴패스 시작하기" : "다음"}
              <ArrowRight size={17} />
            </EntryButton>
          </div>
        </div>
      }
      right={<BrandVisual badge={current.eyebrow} caption={current.caption} chips={current.chips} />}
    />
  );
}
