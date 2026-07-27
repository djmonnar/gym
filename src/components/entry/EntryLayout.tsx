import type { ReactNode } from "react";
import { cn } from "../ui";

/**
 * 진입 흐름(스플래시·온보딩·로그인·위치) 공용 레이아웃.
 *
 * 데스크톱: 좌측 카피·CTA / 우측 브랜드 비주얼 2단
 * 모바일: 비주얼을 위로 올린 세로 스택
 *
 * 사진을 쓰지 않고 딥그린 배경과 라임 타이포그래피로 분위기를 만듭니다.
 */
export function EntryLayout({
  left,
  right,
  topBar
}: {
  left: ReactNode;
  right: ReactNode;
  topBar?: ReactNode;
}) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[radial-gradient(120%_90%_at_82%_8%,#1B4A37_0%,#12372A_46%,#0B2A20_100%)] text-white">
      {/* 라임 글로우 두 개로 단조로운 배경에 깊이를 줍니다. */}
      <div className="pointer-events-none absolute -right-24 -top-32 size-[420px] rounded-full bg-limeSoft/15 blur-[110px]" />
      <div className="pointer-events-none absolute -bottom-40 -left-28 size-[380px] rounded-full bg-blue/25 blur-[120px]" />

      <div className="relative mx-auto flex min-h-screen w-full max-w-[1180px] flex-col px-5 py-6 sm:px-8 lg:px-10">
        {topBar ? <div className="mb-6 shrink-0">{topBar}</div> : null}

        {/*
          모바일은 카피·CTA를 먼저 보여주고 비주얼을 아래에 둡니다.
          비주얼을 위로 올리면 CTA가 화면 밖으로 밀립니다.
        */}
        <div className="flex flex-1 flex-col justify-center gap-10 lg:grid lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-14">
          <div className="flex flex-col justify-center">{left}</div>
          <div>{right}</div>
        </div>
      </div>
    </div>
  );
}

/** 진입 화면 공용 헤드라인 블록. */
export function EntryHeadline({
  eyebrow,
  title,
  description,
  className
}: {
  eyebrow?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      {eyebrow ? (
        <p className="mb-5 inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-1.5 text-[11px] font-black uppercase tracking-wide text-limeSoft ring-1 ring-white/15 backdrop-blur">
          {eyebrow}
        </p>
      ) : null}
      <h1 className="text-[34px] font-black leading-[1.1] tracking-[-0.02em] text-white sm:text-[42px] lg:text-[52px]">
        {title}
      </h1>
      {description ? (
        <p className="mt-5 max-w-[460px] text-sm font-semibold leading-7 text-white/70 sm:text-base">{description}</p>
      ) : null}
    </div>
  );
}

/**
 * 우측 브랜드 비주얼 패널.
 * 사진 대신 로고 마크와 동심원(‘돌아온다’ 모티프)으로 구성합니다.
 */
export function BrandVisual({
  badge,
  caption,
  chips = [],
  className
}: {
  badge?: ReactNode;
  caption?: ReactNode;
  chips?: string[];
  className?: string;
}) {
  return (
    <div
      className={cn(
        "relative aspect-[4/3] w-full overflow-hidden rounded-[28px] bg-white/[0.06] ring-1 ring-white/15 backdrop-blur-sm sm:aspect-[16/10] lg:aspect-[4/3]",
        className
      )}
    >
      {/* 동심원 모티프 */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <div className="size-[420px] rounded-full ring-1 ring-limeSoft/10" />
        <div className="absolute left-1/2 top-1/2 size-[310px] -translate-x-1/2 -translate-y-1/2 rounded-full ring-1 ring-limeSoft/20" />
        <div className="absolute left-1/2 top-1/2 size-[200px] -translate-x-1/2 -translate-y-1/2 rounded-full ring-1 ring-limeSoft/30" />
      </div>

      <div className="relative flex h-full flex-col justify-between p-6 sm:p-7">
        <div className="flex items-start justify-between gap-3">
          {badge ? (
            <span className="inline-flex items-center rounded-full bg-lime px-3 py-1.5 text-[11px] font-black text-brand">
              {badge}
            </span>
          ) : (
            <span />
          )}
          <img
            src="brand/returnpass-icon-192.png"
            alt=""
            aria-hidden="true"
            className="size-11 rounded-[14px] shadow-lift ring-1 ring-white/15"
          />
        </div>

        <div className="grid place-items-center py-2">
          <span className="text-[64px] font-black leading-none tracking-[-0.04em] text-limeSoft/90 sm:text-[76px]">R</span>
        </div>

        <div>
          {caption ? <p className="text-sm font-black leading-6 text-white">{caption}</p> : null}
          {chips.length ? (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {chips.map((chip) => (
                <span
                  key={chip}
                  className="rounded-full bg-white/10 px-3 py-1.5 text-[11px] font-black text-white/85 ring-1 ring-white/10"
                >
                  {chip}
                </span>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

/** 진입 화면 기본 버튼(라임 채움 / 외곽선 / 텍스트). */
export function EntryButton({
  children,
  onClick,
  variant = "primary",
  disabled,
  className
}: {
  children: ReactNode;
  onClick?: () => void;
  variant?: "primary" | "outline" | "ghost" | "kakao";
  disabled?: boolean;
  className?: string;
}) {
  const variants = {
    primary: "bg-lime text-brand shadow-soft hover:brightness-105",
    outline: "bg-white/10 text-white ring-1 ring-white/20 backdrop-blur hover:bg-white/15",
    ghost: "text-white/70 hover:bg-white/10 hover:text-white",
    kakao: "bg-[#FEE500] text-[#191919] hover:brightness-105"
  };

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "inline-flex min-h-[52px] w-full items-center justify-center gap-2 rounded-[16px] px-6 text-sm font-black transition active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-45",
        variants[variant],
        className
      )}
    >
      {children}
    </button>
  );
}
