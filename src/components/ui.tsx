import type { ReactNode } from "react";
import {
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
    dark: "bg-brand text-white shadow-soft hover:translate-y-[-1px]",
    ghost: "bg-white text-brand hover:bg-gray-50",
    line: "border border-gray-200 bg-white text-brand hover:border-brand",
    danger: "bg-rose-50 text-rose-700 hover:bg-rose-100"
  };

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "inline-flex min-h-12 items-center justify-center gap-2 rounded-[18px] px-5 py-3 text-sm font-bold transition active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-45",
        variants[variant],
        className
      )}
    >
      {children}
    </button>
  );
}

export function Card({ children, className }: { children: ReactNode; className?: string }) {
  return <section className={cn("rounded-[24px] bg-card p-5 shadow-soft", className)}>{children}</section>;
}

export function Badge({ children, tone = "gray" }: { children: ReactNode; tone?: "lime" | "blue" | "gray" | "red" | "green" }) {
  const tones = {
    lime: "bg-lime text-brand",
    blue: "bg-blue/10 text-blue",
    gray: "bg-gray-100 text-gray-700",
    red: "bg-rose-100 text-rose-700",
    green: "bg-emerald-100 text-emerald-700"
  };

  return <span className={cn("inline-flex items-center rounded-full px-3 py-1 text-xs font-bold", tones[tone])}>{children}</span>;
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
    <header className="mb-5 flex items-start justify-between gap-4">
      <div className="min-w-0">
        {eyebrow ? <p className="mb-1 text-sm font-bold text-blue">{eyebrow}</p> : null}
        <h1 className="text-[28px] font-black leading-tight text-brand">{title}</h1>
      </div>
      <div className="flex shrink-0 items-center gap-2">
        {onBack ? (
          <button
            type="button"
            onClick={onBack}
            className="grid size-11 place-items-center rounded-full bg-white text-brand shadow-soft"
            aria-label="이전 화면"
          >
            ←
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
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,#ffffff_0,#F7F8FA_38%,#eef2f7_100%)] px-4 py-6 text-brand">
      <div className="relative mx-auto flex min-h-[calc(100vh-3rem)] w-full max-w-[430px] flex-col overflow-hidden rounded-[34px] border border-white/70 bg-surface shadow-lift ring-8 ring-white/55">
        <div className="flex items-center justify-between border-b border-white/60 bg-white/85 px-5 py-3 backdrop-blur">
          <div className="flex items-center gap-2">
            <img src="brand/gympass-icon.svg" alt="짐패스 로고" className="size-8 rounded-2xl shadow-soft" />
            <div>
              <p className="text-sm font-black">짐패스</p>
              <p className="text-[11px] font-semibold text-gray-500">헬스장, 이제 한 달씩 가볍게</p>
            </div>
          </div>
          <Badge tone={appMode === "admin" ? "blue" : "lime"}>{appMode === "admin" ? "사장님" : "PWA"}</Badge>
        </div>
        <div className="scrollbar-none flex-1 overflow-y-auto px-5 py-5 pb-28">{children}</div>
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
    { label: "구독관리", screen: "subscription", icon: <CreditCard size={20} /> },
    { label: "마이", screen: "my", icon: <UserRound size={20} /> }
  ];

  return (
    <nav className="absolute bottom-0 left-1/2 z-20 grid w-full max-w-[430px] -translate-x-1/2 grid-cols-5 border-t border-gray-100 bg-white/95 px-3 pb-3 pt-2 backdrop-blur">
      {items.map((item) => {
        const isActive = active === item.screen;
        return (
          <button
            key={item.label}
            type="button"
            onClick={() => navigate(item.screen)}
            className={cn(
              "flex h-[58px] flex-col items-center justify-center gap-1 rounded-[18px] text-[11px] font-bold transition",
              isActive ? "bg-brand text-lime" : "text-gray-500 hover:bg-gray-50 hover:text-brand"
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
    <div className={cn("rounded-[22px] p-4", toneClass)}>
      <p className="text-xs font-bold opacity-80">{label}</p>
      <p className="mt-2 text-2xl font-black">{value}</p>
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
      <p className="text-right text-sm font-black text-brand">{value}</p>
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
    <ul className="space-y-2">
      {items.map((item) => (
        <li key={item} className="flex items-center gap-2 text-sm font-semibold text-gray-700">
          <ListChecks className="text-blue" size={17} />
          {item}
        </li>
      ))}
    </ul>
  );
}
