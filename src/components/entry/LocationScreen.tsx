import { ArrowLeft, LocateFixed, MapPin, ShieldCheck } from "lucide-react";
import type { Facility, ScreenId } from "../../types";
import { EntryButton, EntryHeadline, EntryLayout } from "./EntryLayout";

export function LocationScreen({
  navigate,
  facilities
}: {
  navigate: (screen: ScreenId) => void;
  facilities: Facility[];
}) {
  const nearby = facilities.slice(0, 3);

  return (
    <EntryLayout
      topBar={
        <button
          type="button"
          onClick={() => navigate("login")}
          className="inline-flex items-center gap-2 text-sm font-black text-white/60 transition hover:text-white"
        >
          <ArrowLeft size={17} />
          이전
        </button>
      }
      left={
        <div>
          <EntryHeadline
            eyebrow="위치 권한 안내"
            title={
              <>
                가까운 운동시설을
                <br />
                <span className="text-limeSoft">정확히 추천할게요</span>
              </>
            }
            description="위치는 거리 계산과 주변 시설 추천에만 사용합니다. 결제·구독권·QR 토큰 정보와는 분리해 관리합니다."
          />

          <div className="mt-8 flex items-start gap-2.5 rounded-[16px] bg-white/[0.06] p-4 ring-1 ring-white/15 sm:max-w-[460px]">
            <ShieldCheck size={17} className="mt-0.5 shrink-0 text-limeSoft" />
            <p className="text-xs font-semibold leading-5 text-white/70">
              더미 UI에서는 실제 위치를 저장하지 않습니다. 권한을 허용하지 않아도 지역을 직접 선택해 이용할 수 있어요.
            </p>
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:max-w-[420px]">
            <EntryButton onClick={() => navigate("home")}>
              <LocateFixed size={17} />위치 사용하고 시작하기
            </EntryButton>
            <EntryButton variant="ghost" onClick={() => navigate("home")}>
              나중에 설정할게요
            </EntryButton>
          </div>
        </div>
      }
      right={
        <div className="rounded-[28px] bg-white/[0.06] p-5 ring-1 ring-white/15 backdrop-blur-sm sm:p-6">
          <div className="flex items-center justify-between gap-3">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-lime px-3 py-1.5 text-[11px] font-black text-white">
              <MapPin size={12} />
              진주 가좌동
            </span>
            <span className="grid size-10 place-items-center rounded-full bg-white/10 text-limeSoft ring-1 ring-white/15">
              <LocateFixed size={18} />
            </span>
          </div>

          <p className="mt-5 text-[11px] font-black text-white/45">내 주변에서 바로 이용 가능한 시설</p>

          <ul className="mt-3 space-y-2">
            {nearby.map((facility) => (
              <li
                key={facility.id}
                className="flex items-center justify-between gap-3 rounded-[16px] bg-white/[0.07] p-3.5 ring-1 ring-white/10"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-black text-white">{facility.name}</p>
                  <p className="mt-1 truncate text-[11px] font-bold text-white/55">
                    {facility.distance} · 월 {facility.monthlyPrice.toLocaleString("ko-KR")}원
                  </p>
                </div>
                <span className="shrink-0 rounded-full bg-white/10 px-2.5 py-1 text-[11px] font-black text-white/80">
                  {facility.hours}
                </span>
              </li>
            ))}
          </ul>
        </div>
      }
    />
  );
}
