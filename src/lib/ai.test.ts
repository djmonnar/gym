import assert from "node:assert/strict";
import test from "node:test";
import { aiDietPlan } from "../data/returnpass";
import {
  MIN_KCAL,
  checkDietGuardrails,
  checkRoutineGuardrails,
  isDietPlanSafe,
  type AiDietInput,
  type AiRoutineInput
} from "./ai";

const dietInput: AiDietInput = {
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
  sensitiveConsent: true
};

const routineInput: AiRoutineInput = {
  goal: "체중감량",
  frequency: 4,
  level: "입문",
  equipment: "헬스장",
  careAreas: [],
  sensitiveConsent: true
};

test("조건을 모두 충족하면 식단 생성을 막지 않는다", () => {
  assert.equal(checkDietGuardrails(dietInput), null);
});

test("10대는 식단 생성 대신 안내로 분기한다", () => {
  const block = checkDietGuardrails({ ...dietInput, ageGroup: "10대" });
  assert.equal(block?.kind, "minor");
});

test("임신·수유나 질환이 있으면 전문가 상담으로 분기한다", () => {
  const block = checkDietGuardrails({ ...dietInput, conditions: ["임신·수유", "당뇨"] });
  assert.equal(block?.kind, "consult");
  assert.deepEqual(block?.kind === "consult" ? block.conditions : [], ["임신·수유", "당뇨"]);
});

test("민감정보 동의가 없으면 생성하지 않는다", () => {
  const block = checkDietGuardrails({ ...dietInput, sensitiveConsent: false });
  assert.equal(block?.kind, "consent");

  const routineBlock = checkRoutineGuardrails({ ...routineInput, sensitiveConsent: false });
  assert.equal(routineBlock?.kind, "consent");
});

test("최소 칼로리 미만 플랜은 안전하지 않다고 판단한다", () => {
  assert.equal(isDietPlanSafe(aiDietPlan, "female"), true);

  const tooLow = {
    ...aiDietPlan,
    summary: { ...aiDietPlan.summary, targetKcal: MIN_KCAL.female - 100 }
  };
  assert.equal(isDietPlanSafe(tooLow, "female"), false);
});

test("남성 최소 칼로리 기준이 여성보다 높다", () => {
  assert.ok(MIN_KCAL.male > MIN_KCAL.female);
  const plan = { ...aiDietPlan, summary: { ...aiDietPlan.summary, targetKcal: 1500 } };
  assert.equal(isDietPlanSafe(plan, "female"), true);
  assert.equal(isDietPlanSafe(plan, "male"), false);
});
