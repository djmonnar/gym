import type { ReactNode } from "react";
import {
  ArrowLeft,
  CreditCard,
  Home,
  ListChecks,
  MapPin,
  QrCode,
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
  appMode?: "customer" | "admin";
}) {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_50%_-10%,rgba(215,255,63,0.2),transparent_34%),radial-gradient(circle_at_12%_86%,rgba(232,220,196,0.18),transparent_34%),#0B2A20] px-3 py-5 text-brand">
      <div className="relative mx-auto flex min-h-[calc(100vh-2.5rem)] w-full max-w-[430px] flex-col overflow-hidden rounded-[38px] border border-white/10 bg-surface shadow-glow ring-8 ring-black/25">
        <div className="flex items-center justify-between border-b border-white/10 bg-brand/90 px-5 py-3 text-white backdrop-blur-xl">
          <div className="flex items-center gap-2">
            <img src="brand/returnpass-icon.svg" alt="리턴패스 로고" className="size-9 rounded-2xl shadow-glow" />
            <div>
              <p className="text-sm font-black">리턴패스</p>
              <p className="text-[11px] font-bold text-white/55">운동으로 돌아오는 패스</p>
            </div>
          </div>
          <Badge tone={appMode === "admin" ? "blue" : "lime"}>{appMode === "admin" ? "사장님" : "LIVE"}</Badge>
        </div>
        <div key={active} className="scrollbar-none flex-1 overflow-y-auto bg-[linear-gradient(180deg,#FDFCF9_0%,#F7F6F2_62%,#E8ECE9_100%)] px-5 py-6 pb-32">
          {children}
        </div>
        {showTabs ? <BottomNav active={active} navigate={navigate} /> : null}
      </div>
    </main>
  );
}

function BottomNav({ active, navigate }: { active: ScreenId; navigate: (screen: ScreenId) => void }) {
  const items: Array<{ label: string; screen: ScreenId; icon: ReactNode }> = [
    { label: "홈", screen: "home", icon: <Home size={20} /> },
    { label: "검색", screen: "search", icon: <Search size={20} /> },
    { label: "이용권", screen: "pass", icon: <QrCode size={20} /> },
    { label: "구독", screen: "subscription", icon: <CreditCard size={20} /> },
    { label: "마이", screen: "my", icon: <UserRound size={20} /> }
  ];

  return (
    <nav className="fixed bottom-6 left-1/2 z-50 grid w-[calc(100%-2rem)] max-w-[390px] -translate-x-1/2 grid-cols-5 rounded-[28px] border border-black/10 bg-white px-2 py-2 shadow-[0_22px_70px_rgba(18,55,42,0.24),0_0_0_1px_rgba(255,255,255,0.95)]">
      {items.map((item) => {
        const isActive = active === item.screen;
        return (
          <button
            key={item.label}
            type="button"
            onClick={() => navigate(item.screen)}
            className={cn(
              "flex h-[58px] flex-col items-center justify-center gap-1 rounded-[21px] text-[10px] font-black transition",
              isActive ? "bg-brand text-lime shadow-[0_14px_36px_rgba(18,55,42,0.22)]" : "text-zinc-500 hover:bg-zinc-100 hover:text-brand"
            )}
          >
            {item.icon}
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
