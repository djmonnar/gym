import { useState } from "react";
import { ArrowLeftRight, Check, ChevronRight, Flame, ShoppingCart, Sparkles } from "lucide-react";
import type { AiDietPlan, Product, ScreenId } from "../../types";
import {
  CONSULT_CONDITIONS,
  aiPlanner,
  checkDietGuardrails,
  isDietPlanSafe,
  type AiDietInput,
  type GuardrailBlock
} from "../../lib/ai";
import { Badge, Button, Card, ScreenHeader, cn } from "../ui";
import { AiDisclaimer, AiLoading, ChoiceGroup, GuardrailNotice, RegenerateBar, SensitiveConsent, TagGroup } from "./AiShared";

const ALLERGY_OPTIONS = ["우유", "달걀", "견과류", "갑각류", "밀", "콩"];
const CONDITION_OPTIONS = [...CONSULT_CONDITIONS, "없음"];

const defaultInput: AiDietInput = {
  sex: "female",
  ageGroup: "30대",
  activity: "주 3~4회",
  goal: "체중감량",
  mealsPerDay: 3,
  budget: "보통",
  cuisine: "한식",
  canCook: true,
  allergies: [],
  conditions: [],
  sensitiveConsent: false
};

type Stage = "input" | "loading" | "result" | "blocked";

const mealTypeLabel: Record<string, string> = {
  breakfast: "아침",
  lunch: "점심",
  dinner: "저녁",
  snack: "간식"
};

function DietResult({
  plan,
  products,
  onAddToCart,
  navigate
}: {
  plan: AiDietPlan;
  products: Product[];
  onAddToCart: (product: Product) => void;
  navigate: (screen: ScreenId) => void;
}) {
  const [activeWeek, setActiveWeek] = useState(0);
  const week = plan.weeks[activeWeek];
  const matchedGrocery = plan.groceryList.filter((item) => item.shopProductId);

  return (
    <div className="space-y-4">
      <Card className="bg-brand text-white">
        <Badge tone="lime">
          <Sparkles size={13} className="mr-1" />
          AI 생성 결과
        </Badge>
        <div className="mt-4 flex items-end gap-2">
          <p className="text-4xl font-black leading-none">{plan.summary.targetKcal.toLocaleString("ko-KR")}</p>
          <p className="pb-1 text-sm font-black text-lime">kcal / 일</p>
        </div>
        <div className="mt-4 grid grid-cols-3 gap-2">
          {[
            { label: "단백질", value: `${plan.summary.protein_g}g` },
            { label: "탄수화물", value: `${plan.summary.carb_g}g` },
            { label: "지방", value: `${plan.summary.fat_g}g` }
          ].map((macro) => (
            <div key={macro.label} className="rounded-[14px] bg-white/10 p-3 text-center ring-1 ring-white/10">
              <p className="text-[11px] font-bold text-white/60">{macro.label}</p>
              <p className="mt-1 text-sm font-black">{macro.value}</p>
            </div>
          ))}
        </div>
        <p className="mt-4 text-xs font-bold leading-6 text-white/70">{plan.summary.note}</p>
      </Card>

      <div className="scrollbar-none flex gap-2 overflow-x-auto pb-1">
        {plan.weeks.map((item, index) => (
          <button
            key={item.week}
            type="button"
            onClick={() => setActiveWeek(index)}
            className={cn(
              "min-h-10 shrink-0 rounded-full px-4 text-xs font-black ring-1 transition",
              index === activeWeek ? "bg-brand text-lime ring-brand" : "bg-white text-zinc-600 ring-black/5"
            )}
          >
            {item.week}주차
          </button>
        ))}
      </div>

      {week?.days.map((day) => (
        <Card key={day.date}>
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm font-black">{day.date}</p>
            <span className="flex items-center gap-1 text-xs font-black text-blue">
              <Flame size={14} />
              {day.totalKcal.toLocaleString("ko-KR")}kcal
            </span>
          </div>
          <div className="mt-3 divide-y divide-black/5">
            {day.meals.map((meal) => (
              <div key={meal.type} className="py-3">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <Badge tone="gray">{mealTypeLabel[meal.type] ?? meal.type}</Badge>
                    <p className="text-sm font-black">{meal.name}</p>
                  </div>
                  <span className="shrink-0 text-xs font-black text-zinc-400">{meal.kcal}kcal</span>
                </div>
                <ul className="mt-2 space-y-1">
                  {meal.items.map((item) => (
                    <li key={item.food} className="flex items-center justify-between gap-3 text-xs font-bold text-zinc-500">
                      <span>
                        {item.food} · {item.qty}
                      </span>
                      <span className="shrink-0">{item.kcal}kcal</span>
                    </li>
                  ))}
                </ul>
                <p className="mt-2 text-xs font-semibold leading-5 text-zinc-500">{meal.recipe}</p>
              </div>
            ))}
          </div>
        </Card>
      ))}

      <Card>
        <div className="flex items-center gap-2">
          <ShoppingCart size={18} className="text-blue" />
          <p className="text-sm font-black">장보기 목록</p>
        </div>
        <ul className="mt-3 space-y-2">
          {plan.groceryList.map((item) => {
            const product = products.find((candidate) => candidate.id === item.shopProductId);
            return (
              <li key={item.name} className="flex items-center gap-3 rounded-[14px] bg-zinc-50 p-3">
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-black text-brand">{item.name}</p>
                  <p className="mt-0.5 text-xs font-bold text-zinc-500">{item.qty}</p>
                </div>
                {product ? (
                  <Button className="shrink-0 px-4" onClick={() => onAddToCart(product)}>
                    담기
                  </Button>
                ) : (
                  <Badge tone="gray">직접 구매</Badge>
                )}
              </li>
            );
          })}
        </ul>
        {matchedGrocery.length ? (
          <Button variant="line" className="mt-4 w-full" onClick={() => navigate("shop")}>
            리턴샵에서 더 보기
            <ChevronRight size={17} />
          </Button>
        ) : null}
      </Card>

      <Card>
        <div className="flex items-center gap-2">
          <ArrowLeftRight size={18} className="text-blue" />
          <p className="text-sm font-black">대체 제안</p>
        </div>
        <ul className="mt-3 space-y-2">
          {plan.swaps.map((swap) => (
            <li key={`${swap.from}-${swap.to}`} className="rounded-[14px] bg-zinc-50 p-3">
              <p className="text-sm font-black text-brand">
                {swap.from} → {swap.to}
              </p>
              <p className="mt-1 text-xs font-bold text-zinc-500">{swap.reason}</p>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}

export function AiDietScreen({
  products,
  onAddToCart,
  navigate,
  notify
}: {
  products: Product[];
  onAddToCart: (product: Product) => void;
  navigate: (screen: ScreenId) => void;
  notify: (message: string) => void;
}) {
  const [stage, setStage] = useState<Stage>("input");
  const [input, setInput] = useState<AiDietInput>(defaultInput);
  const [plan, setPlan] = useState<AiDietPlan | null>(null);
  const [block, setBlock] = useState<GuardrailBlock | null>(null);
  const [used, setUsed] = useState(0);
  const limit = 3;

  const patch = (next: Partial<AiDietInput>) => setInput((current) => ({ ...current, ...next }));

  const toggleIn = (key: "allergies" | "conditions", option: string) => {
    setInput((current) => {
      if (key === "conditions" && option === "없음") return { ...current, conditions: [] };
      const list = current[key];
      return {
        ...current,
        [key]: list.includes(option) ? list.filter((item) => item !== option) : [...list, option]
      };
    });
  };

  const generate = async () => {
    const guard = checkDietGuardrails(input);
    if (guard) {
      setBlock(guard);
      setStage("blocked");
      return;
    }

    setStage("loading");
    const result = await aiPlanner.generateDiet(input);

    // 후처리 검증: 최소 칼로리 미만이면 결과를 쓰지 않습니다.
    if (!isDietPlanSafe(result, input.sex)) {
      notify("안전 기준에 맞지 않아 다시 생성했어요");
      setStage("input");
      return;
    }

    setPlan(result);
    setUsed((count) => count + 1);
    setStage("result");
  };

  const reset = () => {
    setStage("input");
    setBlock(null);
  };

  return (
    <div>
      <ScreenHeader
        title="AI 맞춤 식단"
        eyebrow="AI DIET"
        onBack={stage === "input" ? undefined : reset}
      />

      {stage === "input" ? (
        <div className="space-y-4">
          <Card className="space-y-5">
            <ChoiceGroup
              label="성별"
              value={input.sex}
              onChange={(value) => patch({ sex: value })}
              options={[
                { value: "female", label: "여성" },
                { value: "male", label: "남성" }
              ]}
            />
            <ChoiceGroup
              label="연령대"
              columns={3}
              value={input.ageGroup}
              onChange={(value) => patch({ ageGroup: value })}
              options={["10대", "20대", "30대", "40대", "50대 이상"].map((item) => ({ value: item as AiDietInput["ageGroup"], label: item }))}
            />
            <ChoiceGroup
              label="목표"
              columns={3}
              value={input.goal}
              onChange={(value) => patch({ goal: value })}
              options={["체중감량", "체중유지", "근육증가"].map((item) => ({ value: item as AiDietInput["goal"], label: item }))}
            />
            <ChoiceGroup
              label="운동 빈도"
              value={input.activity}
              onChange={(value) => patch({ activity: value })}
              options={["거의 없음", "주 1~2회", "주 3~4회", "주 5회 이상"].map((item) => ({ value: item as AiDietInput["activity"], label: item }))}
            />
            <ChoiceGroup
              label="하루 식사 횟수"
              value={input.mealsPerDay}
              onChange={(value) => patch({ mealsPerDay: value })}
              options={[
                { value: 2 as const, label: "2끼" },
                { value: 3 as const, label: "3끼" }
              ]}
            />
            <ChoiceGroup
              label="선호 식단"
              columns={3}
              value={input.cuisine}
              onChange={(value) => patch({ cuisine: value })}
              options={["한식", "양식", "도시락"].map((item) => ({ value: item as AiDietInput["cuisine"], label: item }))}
            />
            <ChoiceGroup
              label="예산대"
              columns={3}
              value={input.budget}
              onChange={(value) => patch({ budget: value })}
              options={["실속", "보통", "넉넉"].map((item) => ({ value: item as AiDietInput["budget"], label: item }))}
            />
            <ChoiceGroup
              label="직접 조리"
              value={input.canCook ? "yes" : "no"}
              onChange={(value) => patch({ canCook: value === "yes" })}
              options={[
                { value: "yes", label: "가능해요" },
                { value: "no", label: "어려워요" }
              ]}
            />
          </Card>

          <Card className="space-y-5">
            <TagGroup
              label="알레르기·못 먹는 것"
              options={ALLERGY_OPTIONS}
              values={input.allergies}
              onToggle={(option) => toggleIn("allergies", option)}
            />
            <TagGroup
              label="건강 상태"
              hint="해당 항목이 있으면 자동 생성 대신 전문가 상담을 안내합니다."
              options={CONDITION_OPTIONS}
              values={input.conditions.length ? input.conditions : ["없음"]}
              onToggle={(option) => toggleIn("conditions", option)}
            />
          </Card>

          <Card>
            <SensitiveConsent checked={input.sensitiveConsent} onChange={(next) => patch({ sensitiveConsent: next })} />
          </Card>

          <Button className="w-full" onClick={generate}>
            <Sparkles size={18} />한 달 식단 생성하기
          </Button>
          <AiDisclaimer />
        </div>
      ) : null}

      {stage === "loading" ? <AiLoading label="한 달 식단을 짜고 있어요" /> : null}

      {stage === "blocked" && block ? <GuardrailNotice block={block} onReset={reset} navigate={navigate} /> : null}

      {stage === "result" && plan ? (
        <div className="space-y-4">
          <DietResult
            plan={plan}
            products={products}
            onAddToCart={(product) => {
              onAddToCart(product);
              notify(`${product.name}을(를) 장바구니에 담았어요`);
            }}
            navigate={navigate}
          />
          <RegenerateBar used={used} limit={limit} onRegenerate={generate} onReset={reset} />
          <Button variant="dark" className="w-full" onClick={() => notify("내 식단으로 저장했어요")}>
            <Check size={18} />내 식단으로 저장
          </Button>
          <AiDisclaimer />
        </div>
      ) : null}
    </div>
  );
}
