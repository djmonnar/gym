import type { ReactNode } from "react";
import {
  ArrowLeft,
  Bell,
  BookOpen,
  Home,
  ListChecks,
  MessagesSquare,
  MapPin,
  Search,
  UserRound
} from "lucide-react";
import type { ScreenId } from "../types";

export const cn = (...classes: Array<string | false | null | undefined>) => classes.filter(Boolean).join(" ");

type ButtonProps = {
  children: ReactNode;
  onClick?: () => void;
  variant?: "primary" | "dark" | "ghost" | "line" | "danger";
  className?: string;
  disabled?: boolean;
};

export function Button({ children, onClick, variant = "primary", className, disabled }: ButtonProps) {
  const variants = {
    primary: "bg-lime text-brand shadow-soft hover:translate-y-[-1px]",
    dark: "bg-brand text-white shadow-soft ring-1 ring-white/10 hover:translate-y-[-1px]",
    ghost: "bg-zinc-100 text-brand ring-1 ring-zinc-200 hover:bg-white",
    line: "border border-blue/20 bg-white text-brand hover:border-blue",
    danger: "bg-red-500/10 text-red-600 ring-1 ring-red-500/20 hover:bg-red-500/15"
  };

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "inline-flex min-h-12 items-center justify-center gap-2 rounded-[18px] px-5 py-3 text-sm font-black transition active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-45",
        variants[variant],
        className
      )}
    >
      {children}
    </button>
  );
}

export function Card({ children, className }: { children: ReactNode; className?: string }) {
  return <section className={cn("rounded-[24px] bg-card p-5 shadow-soft ring-1 ring-black/5", className)}>{children}</section>;
}

export function Badge({ children, tone = "gray" }: { children: ReactNode; tone?: "lime" | "blue" | "gray" | "red" | "green" }) {
  const tones = {
    lime: "bg-lime text-brand shadow-[0_10px_28px_rgba(215,255,63,0.24)]",
    blue: "bg-blue text-white ring-1 ring-blue/30",
    gray: "bg-zinc-100 text-zinc-700",
    red: "bg-red-600 text-white",
    green: "bg-emerald-100 text-emerald-700"
  };

  return <span className={cn("inline-flex items-center rounded-full px-3 py-1 text-xs font-black", tones[tone])}>{children}</span>;
}

export function ScreenHeader({
  title,
  eyebrow,
  action,
  onBack
}: {
  title: string;
  eyebrow?: string;
  action?: ReactNode;
  onBack?: () => void;
}) {
  return (
    <header className="mb-6 flex items-start justify-between gap-4">
      <div className="min-w-0">
        {eyebrow ? <p className="mb-2 text-xs font-black uppercase text-blue">{eyebrow}</p> : null}
        <h1 className="text-[28px] font-black leading-[1.08] text-brand">{title}</h1>
      </div>
      <div className="flex shrink-0 items-center gap-2">
        {onBack ? (
          <button
            type="button"
            onClick={onBack}
            className="grid size-11 place-items-center rounded-full bg-brand text-white shadow-soft ring-1 ring-white/10"
            aria-label="이전 화면"
          >
            <ArrowLeft size={20} />
          </button>
        ) : null}
        {action}
      </div>
    </header>
  );
}

export function AppShell({
  children,
  active,
  navigate,
  showTabs = true,
  appMode = "customer"
}: {
  children: ReactNode;
  active: ScreenId;
  navigate: (screen: ScreenId) => void;
  showTabs?: boolean;
  appMode?: "customer" | "owner" | "trainer" | "hq";
}) {
  const modeLabel = {
    customer: "LIVE",
    owner: "사장님",
    trainer: "트레이너",
    hq: "본사"
  }[appMode];

  return (
    <main className="min-h-screen bg-surface text-brand">
      <div className="min-h-screen w-full bg-[linear-gradient(180deg,#FDFCF9_0%,#F7F6F2_62%,#EEF1EE_100%)]">
        <header className="sticky top-0 z-40 border-b border-white/10 bg-brand text-white shadow-soft">
          <div className="mx-auto flex w-full max-w-[760px] items-center justify-between px-4 py-3">
            <div className="flex min-w-0 items-center gap-3">
              <img src="brand/returnpass-icon-192.png" alt="리턴패스 로고" className="size-10 rounded-[14px] shadow-glow" />
              <div className="min-w-0">
                <p className="truncate text-sm font-black">리턴패스</p>
                <p className="mt-0.5 flex items-center gap-1 text-[11px] font-bold text-white/65">
                  <MapPin size={12} className="text-lime" />
                  진주 가좌동
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              {appMode === "customer" ? (
                <>
                  <button type="button" className="grid size-10 place-items-center rounded-full text-white/85 transition hover:bg-white/10" aria-label="알림">
                    <Bell size={20} />
                  </button>
                  <button type="button" className="grid size-10 place-items-center rounded-full text-white/85 transition hover:bg-white/10" aria-label="내 프로필">
                    <UserRound size={21} />
                  </button>
                </>
              ) : null}
              <Badge tone={appMode === "customer" || appMode === "trainer" ? "lime" : "blue"}>{modeLabel}</Badge>
            </div>
          </div>
        </header>
        <div key={active} className="mx-auto min-h-[calc(100vh-65px)] w-full max-w-[760px] px-4 py-5 pb-28 sm:px-6">
          {children}
        </div>
        {showTabs ? <BottomNav active={active} navigate={navigate} /> : null}
      </div>
    </main>
  );
}

function BottomNav({ active, navigate }: { active: ScreenId; navigate: (screen: ScreenId) => void }) {
  const items: Array<{ label: string; screen: ScreenId; icon: ReactNode; activeScreens: ScreenId[] }> = [
    { label: "홈", screen: "home", icon: <Home size={20} />, activeScreens: ["home"] },
    { label: "검색", screen: "search", icon: <Search size={20} />, activeScreens: ["search", "detail", "facilityDetail"] },
    {
      label: "콘텐츠",
      screen: "contentHome",
      icon: <BookOpen size={20} />,
      activeScreens: ["contentHome", "contentDetail", "routine", "aiRoutine", "diet", "aiDiet"]
    },
    {
      label: "커뮤니티",
      screen: "communityFeed",
      icon: <MessagesSquare size={20} />,
      activeScreens: ["communityFeed", "communityPost", "communityWrite", "challengeList", "challengeDetail"]
    },
    { label: "마이", screen: "mypage", icon: <UserRound size={20} />, activeScreens: ["my", "mypage"] }
  ];

  return (
    <nav className="fixed bottom-0 left-1/2 z-50 grid w-full max-w-[760px] -translate-x-1/2 grid-cols-5 border-x border-t border-black/10 bg-white px-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-2 shadow-[0_-12px_34px_rgba(18,55,42,0.1)]">
      {items.map((item) => {
        const isActive = item.activeScreens.includes(active);
        return (
          <button
            key={item.label}
            type="button"
            onClick={() => navigate(item.screen)}
            className={cn(
              "flex h-[58px] flex-col items-center justify-center gap-1 rounded-[16px] text-[10px] font-black transition",
              isActive ? "text-brand" : "text-zinc-500 hover:bg-zinc-100 hover:text-brand"
            )}
          >
            <span className={cn("grid size-8 place-items-center rounded-[12px]", isActive && "bg-lime")}>{item.icon}</span>
            {item.label}
          </button>
        );
      })}
    </nav>
  );
}

export function Stat({ label, value, tone = "dark" }: { label: string; value: string; tone?: "dark" | "blue" | "lime" }) {
  const toneClass = tone === "lime" ? "bg-lime text-brand" : tone === "blue" ? "bg-blue text-white" : "bg-brand text-white";

  return (
    <div className={cn("min-w-0 rounded-[22px] p-3", toneClass)}>
      <p className="text-xs font-bold opacity-80">{label}</p>
      <p className="mt-2 text-sm font-black leading-tight">{value}</p>
    </div>
  );
}

export function InfoRow({ label, value, icon }: { label: string; value: string; icon?: ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-[18px] bg-gray-50 px-4 py-3">
      <div className="flex items-center gap-2 text-sm font-bold text-gray-600">
        {icon}
        {label}
      </div>
      <p className="text-right text-sm font-black leading-5 text-brand">{value}</p>
    </div>
  );
}

export function MapPlaceholder() {
  return (
    <div className="relative h-40 overflow-hidden rounded-[24px] bg-gray-100">
      <div className="absolute inset-0 bg-[linear-gradient(135deg,#e5e7eb_25%,transparent_25%),linear-gradient(225deg,#e5e7eb_25%,transparent_25%),linear-gradient(45deg,#e5e7eb_25%,transparent_25%),linear-gradient(315deg,#e5e7eb_25%,#f8fafc_25%)] bg-[length:28px_28px] bg-[position:14px_0,14px_0,0_0,0_0]" />
      <div className="absolute left-1/2 top-1/2 grid size-12 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-blue text-white shadow-soft">
        <MapPin size={23} />
      </div>
    </div>
  );
}

export function Checklist({ items }: { items: string[] }) {
  return (
    <ul className="space-y-2.5">
      {items.map((item) => (
        <li key={item} className="flex items-start gap-2 text-sm font-semibold leading-6 text-gray-700">
          <ListChecks className="mt-0.5 shrink-0 text-blue" size={17} />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}
