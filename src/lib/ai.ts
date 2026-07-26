import { aiDietPlan, aiRoutine } from "../data/returnpass";
import type { AiDietPlan, AiRoutine } from "../types";

/**
 * AI 식단·루틴 생성 인터페이스.
 *
 * 실제 Gemini 호출은 서버(Cloud Functions)에서만 수행합니다.
 * 클라이언트에는 API 키를 두지 않으며, 이 모듈은 화면이 호출할 계약만 정의합니다.
 * 현재는 더미 응답을 반환하고, 서버 연동 시 이 파일의 구현만 교체합니다.
 */

export type DietSex = "female" | "male";

export type AiDietInput = {
  sex: DietSex;
  ageGroup: "10대" | "20대" | "30대" | "40대" | "50대 이상";
  activity: "거의 없음" | "주 1~2회" | "주 3~4회" | "주 5회 이상";
  goal: "체중감량" | "체중유지" | "근육증가";
  mealsPerDay: 2 | 3;
  budget: "실속" | "보통" | "넉넉";
  cuisine: "한식" | "양식" | "도시락";
  canCook: boolean;
  allergies: string[];
  conditions: string[];
  sensitiveConsent: boolean;
};

export type AiRoutineInput = {
  goal: "체중감량" | "근력·벌크업" | "체형교정·자세" | "체력·컨디션";
  frequency: 2 | 3 | 4 | 5;
  level: "입문" | "초급" | "중급";
  equipment: "헬스장" | "홈트(맨몸)" | "홈트(덤벨·밴드)";
  careAreas: string[];
  sensitiveConsent: boolean;
};

/** 성별 최소 섭취 칼로리. 이 미만 플랜은 생성하지 않습니다. */
export const MIN_KCAL: Record<DietSex, number> = {
  female: 1400,
  male: 1600
};

/** 생성 대신 전문가 상담을 안내해야 하는 상태. */
export const CONSULT_CONDITIONS = ["임신·수유", "당뇨", "신장질환", "섭식장애 이력"];

/** 식단 기능을 제공하지 않는 연령대(성장기 칼로리 제한 리스크). */
export const RESTRICTED_AGE_GROUP = "10대";

export type GuardrailBlock =
  | { kind: "consult"; conditions: string[]; message: string }
  | { kind: "minor"; message: string }
  | { kind: "consent"; message: string };

/**
 * 생성 전 입력 검증. 차단 사유가 있으면 반환하고, 없으면 null.
 * 화면은 이 결과로 결과 화면 대신 안내 화면을 띄웁니다.
 */
export const checkDietGuardrails = (input: AiDietInput): GuardrailBlock | null => {
  if (input.ageGroup === RESTRICTED_AGE_GROUP) {
    return {
      kind: "minor",
      message: "성장기에는 칼로리를 제한하는 식단을 제공하지 않습니다. 보호자, 전문가와 상의해 주세요."
    };
  }

  const matched = input.conditions.filter((condition) => CONSULT_CONDITIONS.includes(condition));
  if (matched.length) {
    return {
      kind: "consult",
      conditions: matched,
      message: "입력하신 건강 상태는 개별 관리가 필요합니다. 자동 생성 대신 전문가 상담을 권해드립니다."
    };
  }

  if (!input.sensitiveConsent) {
    return {
      kind: "consent",
      message: "건강 정보(체중·질환·알레르기)는 민감정보로, 별도 동의가 있어야 식단을 생성할 수 있습니다."
    };
  }

  return null;
};

export const checkRoutineGuardrails = (input: AiRoutineInput): GuardrailBlock | null => {
  if (!input.sensitiveConsent) {
    return {
      kind: "consent",
      message: "불편한 부위 정보는 민감정보로, 별도 동의가 있어야 루틴을 생성할 수 있습니다."
    };
  }
  return null;
};

/**
 * 생성 결과 후처리 검증. 모델이 최소 칼로리 미만을 내놓으면 리젝합니다.
 * 서버 연동 시에는 리젝 후 재생성으로 이어집니다.
 */
export const isDietPlanSafe = (plan: AiDietPlan, sex: DietSex) => plan.summary.targetKcal >= MIN_KCAL[sex];

export const AI_DISCLAIMER = "의학적 진단·치료 목적이 아니며, 질환이 있는 경우 전문가와 상의하세요.";

const delay = (ms: number) => new Promise((resolve) => window.setTimeout(resolve, ms));

export interface AiPlanner {
  generateDiet(input: AiDietInput): Promise<AiDietPlan>;
  generateRoutine(input: AiRoutineInput): Promise<AiRoutine>;
}

/** 더미 플래너. PR-11에서 Functions 호출 구현으로 교체합니다. */
export class MockAiPlanner implements AiPlanner {
  async generateDiet(input: AiDietInput) {
    await delay(1200);
    const base = aiDietPlan;
    const targetKcal = Math.max(base.summary.targetKcal, MIN_KCAL[input.sex]);

    return {
      ...base,
      summary: {
        ...base.summary,
        targetKcal,
        note: `${input.goal} 목표와 ${input.activity} 활동량, ${input.cuisine} 선호를 반영한 예시 식단입니다.`
      }
    };
  }

  async generateRoutine(input: AiRoutineInput) {
    await delay(1200);
    const base = aiRoutine;

    return {
      ...base,
      goal: input.goal,
      frequency: input.frequency
    };
  }
}

export const aiPlanner: AiPlanner = new MockAiPlanner();
