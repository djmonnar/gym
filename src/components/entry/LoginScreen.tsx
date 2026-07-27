import { ArrowLeft, Phone, ShieldCheck, UserRound } from "lucide-react";
import type { ScreenId } from "../../types";
import { BrandVisual, EntryButton, EntryHeadline, EntryLayout } from "./EntryLayout";

export function LoginScreen({
  navigate,
  onDemoLogin,
  authPending
}: {
  navigate: (screen: ScreenId) => void;
  onDemoLogin: () => Promise<void>;
  authPending: boolean;
}) {
  return (
    <EntryLayout
      topBar={
        <button
          type="button"
          onClick={() => navigate("splash")}
          className="inline-flex items-center gap-2 text-sm font-black text-white/60 transition hover:text-white"
        >
          <ArrowLeft size={17} />
          처음으로
        </button>
      }
      left={
        <div>
          <EntryHeadline
            eyebrow="간편 로그인"
            title={
              <>
                지금 시작하고
                <br />
                <span className="text-limeSoft">가까운 시설부터 찾아요</span>
              </>
            }
            description="휴대폰 인증만 끝내면 구독권, QR 이용권, 결제 내역을 한곳에서 관리할 수 있습니다."
          />

          <div className="mt-8 flex flex-col gap-3 sm:max-w-[420px]">
            <EntryButton onClick={onDemoLogin} disabled={authPending}>
              {authPending ? "체험 계정 연결 중..." : "김예림님으로 체험하기"}
            </EntryButton>
            <EntryButton variant="kakao" onClick={() => navigate("location")}>
              카카오로 계속하기
            </EntryButton>
            <EntryButton variant="outline" onClick={() => navigate("location")}>
              휴대폰 번호로 시작하기
            </EntryButton>
            <EntryButton variant="ghost" onClick={() => navigate("adminHome")}>
              사장님 계정으로 보기
            </EntryButton>
          </div>

          <p className="mt-6 max-w-[420px] text-[11px] font-semibold leading-5 text-white/40">
            로그인하면 이용약관과 개인정보 처리방침에 동의하는 것으로 봅니다. 건강 정보는 별도 동의 후에만 수집합니다.
          </p>
        </div>
      }
      right={
        <div className="space-y-3">
          <BrandVisual badge="테스트 계정" caption="로그인하면 이런 걸 할 수 있어요" chips={["QR 이용권", "결제 내역", "PT 관리", "AI 코치"]} />

          <div className="rounded-[20px] bg-white/[0.06] p-4 ring-1 ring-white/15 backdrop-blur-sm">
            <div className="flex items-center gap-3">
              <span className="grid size-11 shrink-0 place-items-center rounded-[14px] bg-lime text-white">
                <UserRound size={20} />
              </span>
              <div className="min-w-0">
                <p className="text-[11px] font-bold text-white/50">체험 계정</p>
                <p className="mt-0.5 truncate text-sm font-black text-white">김예림 · 010 2345 9182</p>
              </div>
            </div>
            <dl className="mt-4 space-y-2 border-t border-white/10 pt-3 text-xs font-bold">
              <div className="flex items-center justify-between gap-3">
                <dt className="flex items-center gap-1.5 text-white/50">
                  <Phone size={13} />
                  인증 방식
                </dt>
                <dd className="text-white">휴대폰 간편 인증</dd>
              </div>
              <div className="flex items-center justify-between gap-3">
                <dt className="flex items-center gap-1.5 text-white/50">
                  <ShieldCheck size={13} />
                  보안
                </dt>
                <dd className="text-white">결제 정보 분리 저장</dd>
              </div>
            </dl>
          </div>
        </div>
      }
    />
  );
}
