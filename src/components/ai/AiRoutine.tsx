import { useState } from "react";
import { Check, Clock, PlayCircle, Repeat, Sparkles, Timer } from "lucide-react";
import type { AiRoutine, Content, ScreenId } from "../../types";
import { aiPlanner, checkRoutineGuardrails, type AiRoutineInput, type GuardrailBlock } from "../../lib/ai";
import { Badge, Button, Card, ScreenHeader, cn } from "../ui";
import { AiDisclaimer, AiLoading, ChoiceGroup, GuardrailNotice, RegenerateBar, SensitiveConsent, TagGroup } from "./AiShared";

const CARE_OPTIONS = ["무릎", "허리", "어깨", "목", "없음"];

const defaultInput: AiRoutineInput = {
  goal: "체중감량",
  frequency: 4,
  level: "입문",
  equipment: "헬스장",
  careAreas: [],
  sensitiveConsent: false
};

type Stage = "input" | "loading" | "result" | "blocked";

function RoutineResult({
  routine,
  contents,
  openContent
}: {
  routine: AiRoutine;
  contents: Content[];
  openContent: (content: Content) => void;
}) {
  const [activeWeek, setActiveWeek] = useState(0);
  const week = routine.weeks[activeWeek];

  return (
    <div className="space-y-4">
      <Card className="bg-brand text-white">
        <Badge tone="lime">
          <Sparkles size={13} className="mr-1" />
          AI 생성 결과
        </Badge>
        <h2 className="mt-4 text-2xl font-black leading-snug">
          {routine.goal} 목표 · 주 {routine.frequency}회 루틴
        </h2>
        <p className="mt-3 text-xs font-bold leading-6 text-white/70">
          {routine.weeks.length}주 프로그램으로 구성했어요. 장비가 없으면 대체 종목으로 바꿔서 진행하세요.
        </p>
      </Card>

      <div className="scrollbar-none flex gap-2 overflow-x-auto pb-1">
        {routine.weeks.map((item, index) => (
          <button
            key={item.week}
            type="button"
            onClick={() => setActiveWeek(index)}
            className={cn(
              "min-h-10 shrink-0 rounded-full px-4 text-xs font-black ring-1 transition",
              index === activeWeek ? "bg-brand text-limeSoft ring-brand" : "bg-white text-zinc-600 ring-black/5"
            )}
          >
            {item.week}주차
          </button>
        ))}
      </div>

      {week?.days.map((day) => (
        <Card key={day.day}>
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="grid size-9 place-items-center rounded-full bg-brand text-xs font-black text-limeSoft">{day.day}</span>
              <p className="text-sm font-black">{day.focus}</p>
            </div>
            <span className="flex items-center gap-1 text-xs font-black text-blue">
              <Clock size={14} />
              {day.durationMin}분
            </span>
          </div>

          <div className="mt-3 space-y-2">
            {day.exercises.map((exercise) => {
              const linked = contents.find((content) => content.id === exercise.contentId);
              return (
                <div key={exercise.name} className="rounded-[16px] bg-zinc-50 p-3">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-black text-brand">{exercise.name}</p>
                    <span className="shrink-0 text-xs font-black text-zinc-500">
                      {exercise.sets}세트 · {exercise.reps}
                    </span>
                  </div>
                  <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] font-bold text-zinc-500">
                    <span className="flex items-center gap-1">
                      <Timer size={12} />
                      휴식 {exercise.restSec}초
                    </span>
                    <span className="flex items-center gap-1">
                      <Repeat size={12} />
                      대체: {exercise.alternative}
                    </span>
                  </div>
                  {linked ? (
                    <button
                      type="button"
                      onClick={() => openContent(linked)}
                      className="mt-2 flex items-center gap-1.5 text-xs font-black text-brand"
                    >
                      <PlayCircle size={15} />
                      자세 영상 보기
                    </button>
                  ) : null}
                </div>
              );
            })}
          </div>
        </Card>
      ))}
    </div>
  );
}

export function AiRoutineScreen({
  contents,
  openContent,
  navigate,
  notify
}: {
  contents: Content[];
  openContent: (content: Content) => void;
  navigate: (screen: ScreenId) => void;
  notify: (message: string) => void;
}) {
  const [stage, setStage] = useState<Stage>("input");
  const [input, setInput] = useState<AiRoutineInput>(defaultInput);
  const [routine, setRoutine] = useState<AiRoutine | null>(null);
  const [block, setBlock] = useState<GuardrailBlock | null>(null);
  const [used, setUsed] = useState(0);
  const limit = 3;

  const patch = (next: Partial<AiRoutineInput>) => setInput((current) => ({ ...current, ...next }));

  const toggleCare = (option: string) => {
    setInput((current) => {
      if (option === "없음") return { ...current, careAreas: [] };
      return {
        ...current,
        careAreas: current.careAreas.includes(option)
          ? current.careAreas.filter((item) => item !== option)
          : [...current.careAreas, option]
      };
    });
  };

  const generate = async () => {
    const guard = checkRoutineGuardrails(input);
    if (guard) {
      setBlock(guard);
      setStage("blocked");
      return;
    }

    setStage("loading");
    const result = await aiPlanner.generateRoutine(input);
    setRoutine(result);
    setUsed((count) => count + 1);
    setStage("result");
  };

  const reset = () => {
    setStage("input");
    setBlock(null);
  };

  return (
    <div>
      <ScreenHeader title="AI 운동 루틴" eyebrow="AI ROUTINE" onBack={stage === "input" ? undefined : reset} />

      {stage === "input" ? (
        <div className="space-y-4">
          <Card className="space-y-5">
            <ChoiceGroup
              label="목표"
              value={input.goal}
              onChange={(value) => patch({ goal: value })}
              options={["체중감량", "근력·벌크업", "체형교정·자세", "체력·컨디션"].map((item) => ({
                value: item as AiRoutineInput["goal"],
                label: item
              }))}
            />
            <ChoiceGroup
              label="주 몇 회"
              columns={3}
              value={input.frequency}
              onChange={(value) => patch({ frequency: value })}
              options={[2, 3, 4, 5].map((item) => ({ value: item as AiRoutineInput["frequency"], label: `주 ${item}회` }))}
            />
            <ChoiceGroup
              label="운동 경험"
              columns={3}
              value={input.level}
              onChange={(value) => patch({ level: value })}
              options={["입문", "초급", "중급"].map((item) => ({ value: item as AiRoutineInput["level"], label: item }))}
            />
            <ChoiceGroup
              label="사용 장비"
              columns={3}
              value={input.equipment}
              onChange={(value) => patch({ equipment: value })}
              options={["헬스장", "홈트(맨몸)", "홈트(덤벨·밴드)"].map((item) => ({
                value: item as AiRoutineInput["equipment"],
                label: item
              }))}
            />
            <TagGroup
              label="불편한 부위"
              hint="선택한 부위에 부담이 적은 종목으로 구성합니다."
              options={CARE_OPTIONS}
              values={input.careAreas.length ? input.careAreas : ["없음"]}
              onToggle={toggleCare}
            />
          </Card>

          <Card>
            <SensitiveConsent checked={input.sensitiveConsent} onChange={(next) => patch({ sensitiveConsent: next })} />
          </Card>

          <Button className="w-full" onClick={generate}>
            <Sparkles size={18} />
            운동 루틴 생성하기
          </Button>
          <AiDisclaimer />
        </div>
      ) : null}

      {stage === "loading" ? <AiLoading label="운동 루틴을 짜고 있어요" /> : null}

      {stage === "blocked" && block ? <GuardrailNotice block={block} onReset={reset} navigate={navigate} /> : null}

      {stage === "result" && routine ? (
        <div className="space-y-4">
          <RoutineResult routine={routine} contents={contents} openContent={openContent} />
          <RegenerateBar used={used} limit={limit} onRegenerate={generate} onReset={reset} />
          <Button variant="dark" className="w-full" onClick={() => notify("내 루틴으로 저장했어요")}>
            <Check size={18} />내 루틴으로 저장
          </Button>
          <AiDisclaimer />
        </div>
      ) : null}
    </div>
  );
}
