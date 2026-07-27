import type { ReactNode } from "react";
import { AlertCircle, Info, Loader2, RefreshCw, ShieldCheck, Stethoscope } from "lucide-react";
import type { ScreenId } from "../../types";
import { AI_DISCLAIMER, type GuardrailBlock } from "../../lib/ai";
import { Badge, Button, Card, cn } from "../ui";

/** 결과 화면 하단에 항상 붙는 고지 문구. */
export function AiDisclaimer() {
  return (
    <p className="flex items-start gap-2 rounded-[16px] bg-zinc-100 p-4 text-xs font-bold leading-5 text-zinc-500">
      <Info size={15} className="mt-0.5 shrink-0" />
      {AI_DISCLAIMER}
    </p>
  );
}

/** 민감정보 별도 동의 체크박스. */
export function SensitiveConsent({ checked, onChange }: { checked: boolean; onChange: (next: boolean) => void }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      aria-pressed={checked}
      className="flex w-full items-start gap-3 rounded-[16px] bg-zinc-50 p-4 text-left"
    >
      <span
        className={cn(
          "mt-0.5 grid size-5 shrink-0 place-items-center rounded-md ring-1 transition",
          checked ? "bg-brand text-limeSoft ring-brand" : "bg-white ring-zinc-300"
        )}
      >
        {checked ? <ShieldCheck size={13} /> : null}
      </span>
      <span>
        <span className="text-sm font-black text-brand">건강 정보 수집·이용 동의 (필수)</span>
        <span className="mt-1 block text-xs font-bold leading-5 text-zinc-500">
          체중·질환·알레르기 등 건강 정보는 민감정보입니다. 식단·루틴 생성에만 사용하고 별도로 보관을 최소화합니다.
        </span>
      </span>
    </button>
  );
}

export function AiLoading({ label }: { label: string }) {
  return (
    <Card className="grid place-items-center gap-4 py-16 text-center">
      <Loader2 size={36} className="animate-spin text-blue" />
      <div>
        <p className="text-sm font-black text-brand">{label}</p>
        <p className="mt-2 text-xs font-bold text-zinc-500">잠시만 기다려 주세요.</p>
      </div>
    </Card>
  );
}

/** 가드레일에 걸렸을 때 결과 대신 보여주는 안내 화면. */
export function GuardrailNotice({
  block,
  onReset,
  navigate
}: {
  block: GuardrailBlock;
  onReset: () => void;
  navigate: (screen: ScreenId) => void;
}) {
  const isConsult = block.kind === "consult";

  return (
    <div className="space-y-4">
      <Card className="bg-brand text-white">
        <div className="grid size-14 place-items-center rounded-[18px] bg-lime text-white">
          {isConsult ? <Stethoscope size={26} /> : <AlertCircle size={26} />}
        </div>
        <h2 className="mt-5 text-2xl font-black leading-snug">
          {isConsult ? "전문가 상담을 권해드려요" : block.kind === "minor" ? "지금은 제공하지 않는 기능이에요" : "동의가 필요해요"}
        </h2>
        <p className="mt-3 text-sm font-bold leading-6 text-white/70">{block.message}</p>
        {isConsult ? (
          <div className="mt-4 flex flex-wrap gap-2">
            {block.conditions.map((condition) => (
              <Badge key={condition} tone="lime">
                {condition}
              </Badge>
            ))}
          </div>
        ) : null}
      </Card>

      {isConsult ? (
        <Card>
          <p className="text-sm font-black">이렇게 도와드릴 수 있어요</p>
          <ul className="mt-3 space-y-2 text-sm font-semibold leading-6 text-zinc-700">
            <li>· 담당 트레이너와 상담해 개별 관리 계획을 세워보세요.</li>
            <li>· 리턴라이프 콘텐츠에서 안전한 기초 운동부터 시작할 수 있어요.</li>
            <li>· 질환 관리는 반드시 의료 전문가와 상의해 주세요.</li>
          </ul>
          <div className="mt-5 grid grid-cols-2 gap-3">
            <Button variant="line" onClick={() => navigate("contentHome")}>
              콘텐츠 보기
            </Button>
            <Button onClick={() => navigate("ptMatchIntro")}>PT 매칭</Button>
          </div>
        </Card>
      ) : null}

      <Button variant="ghost" className="w-full" onClick={onReset}>
        <RefreshCw size={17} />
        입력 다시 하기
      </Button>
      <AiDisclaimer />
    </div>
  );
}

/** 남은 재생성 횟수 표시 + 재생성 버튼. */
export function RegenerateBar({
  used,
  limit,
  onRegenerate,
  onReset
}: {
  used: number;
  limit: number;
  onRegenerate: () => void;
  onReset: () => void;
}) {
  const remaining = Math.max(0, limit - used);

  return (
    <Card>
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-bold text-zinc-400">이번 달 재생성</p>
          <p className="mt-1 text-sm font-black text-brand">
            {remaining}회 남음
            <span className="ml-1 text-zinc-400">
              ({used}/{limit} 사용)
            </span>
          </p>
        </div>
        <Badge tone={remaining ? "gray" : "red"}>{remaining ? "가능" : "소진"}</Badge>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-3">
        <Button variant="line" onClick={onReset}>
          조건 변경
        </Button>
        <Button onClick={onRegenerate} disabled={!remaining}>
          <RefreshCw size={17} />
          다시 생성
        </Button>
      </div>
    </Card>
  );
}

/** 입력 폼에서 반복 사용하는 선택지 그룹. */
export function ChoiceGroup<T extends string | number>({
  label,
  options,
  value,
  onChange,
  columns = 2
}: {
  label: string;
  options: Array<{ value: T; label: string }>;
  value: T;
  onChange: (next: T) => void;
  columns?: 2 | 3;
}) {
  return (
    <div>
      <p className="text-xs font-black text-zinc-400">{label}</p>
      <div className={cn("mt-2 grid gap-2", columns === 3 ? "grid-cols-3" : "grid-cols-2")}>
        {options.map((option) => (
          <button
            key={String(option.value)}
            type="button"
            onClick={() => onChange(option.value)}
            className={cn(
              "min-h-11 rounded-[14px] px-3 text-xs font-black ring-1 transition",
              option.value === value ? "bg-brand text-limeSoft ring-brand" : "bg-white text-zinc-600 ring-black/5"
            )}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}

/** 다중 선택 태그. */
export function TagGroup({
  label,
  options,
  values,
  onToggle,
  hint
}: {
  label: string;
  options: string[];
  values: string[];
  onToggle: (option: string) => void;
  hint?: ReactNode;
}) {
  return (
    <div>
      <p className="text-xs font-black text-zinc-400">{label}</p>
      {hint ? <p className="mt-1 text-[11px] font-bold text-zinc-400">{hint}</p> : null}
      <div className="mt-2 flex flex-wrap gap-2">
        {options.map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => onToggle(option)}
            className={cn(
              "min-h-10 rounded-full px-4 text-xs font-black ring-1 transition",
              values.includes(option) ? "bg-brand text-limeSoft ring-brand" : "bg-white text-zinc-600 ring-black/5"
            )}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
}
