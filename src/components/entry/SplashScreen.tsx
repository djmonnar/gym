import { ArrowRight, MapPin } from "lucide-react";
import type { ScreenId } from "../../types";
import { BrandVisual, EntryButton, EntryHeadline, EntryLayout } from "./EntryLayout";

const highlights = [
  { label: "월 단위 구독", value: "헬스·요가·필라테스" },
  { label: "입장", value: "30초 동적 QR" },
  { label: "관리", value: "PT·AI 루틴·식단" }
];

export function SplashScreen({ navigate }: { navigate: (screen: ScreenId) => void }) {
  return (
    <EntryLayout
      topBar={
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <img src="brand/returnpass-icon-192.png" alt="리턴패스" className="size-9 rounded-[12px] ring-1 ring-white/15" />
            <span className="text-sm font-black text-white">리턴패스</span>
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 text-[11px] font-bold text-white/75 ring-1 ring-white/10">
            <MapPin size={12} className="text-limeSoft" />
            진주 가좌동
          </span>
        </div>
      }
      left={
        <div>
          <EntryHeadline
            eyebrow="통합 피트니스 구독"
            title={
              <>
                운동으로 돌아오는
                <br />
                <span className="text-limeSoft">가장 쉬운 패스</span>
              </>
            }
            description="헬스·요가·필라테스를 한 달씩 구독하고, QR 하나로 바로 입장하세요. 이번 달은 요가, 다음 달은 헬스도 됩니다."
          />

          <dl className="mt-9 grid gap-x-6 gap-y-4 border-t border-white/10 pt-6 sm:grid-cols-3">
            {highlights.map((item) => (
              <div key={item.label}>
                <dt className="text-[11px] font-bold text-white/45">{item.label}</dt>
                <dd className="mt-1.5 text-sm font-black leading-snug text-white">{item.value}</dd>
              </div>
            ))}
          </dl>

          <div className="mt-9 flex flex-col gap-3 sm:max-w-[420px]">
            <EntryButton onClick={() => navigate("onboarding")}>
              30초 둘러보기
              <ArrowRight size={17} />
            </EntryButton>
            <EntryButton variant="ghost" onClick={() => navigate("login")}>
              이미 계정이 있어요
            </EntryButton>
          </div>
        </div>
      }
      right={
        <BrandVisual
          badge="진주 가좌동 · QR 입장"
          caption="한 번의 구독으로, 여러 운동을"
          chips={["월구독", "동적 QR", "PT 매칭", "AI 코치"]}
        />
      }
    />
  );
}
