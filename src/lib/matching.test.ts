import assert from "node:assert/strict";
import test from "node:test";
import { ptTrainers } from "../data/returnpass";
import type { MatchAnswers } from "../types";
import { getMatchType, rankTrainers, scoreTrainer } from "./matching";

const answers: MatchAnswers = {
  goal: "체중감량",
  level: "입문",
  intensity: "천천히 점진적",
  tone: "다정·응원형",
  teach: "핵심만",
  diet: "주 1회 피드백",
  time: "오전",
  genderPref: "무관",
  care: "무릎",
  freq: "주 1회",
  budget: "월 40만원 이하"
};

test("감량 입문 답변에는 김도윤 트레이너가 가장 먼저 추천된다", () => {
  const [topMatch, secondMatch] = rankTrainers(answers, ptTrainers, "muscle-factory");
  assert.equal(topMatch.trainer.id, "pt-kim");
  assert.equal(secondMatch.trainer.id, "pt-lee-hajun");
  assert.equal(topMatch.reasons.length, 3);
});

test("현재 구독 시설 소속 트레이너는 0.08 가산점을 받는다", () => {
  const trainer = ptTrainers.find((item) => item.id === "pt-lee");
  assert.ok(trainer);

  const withoutFacility = scoreTrainer(answers, trainer);
  const withFacility = scoreTrainer(answers, trainer, "balance-pilates");
  assert.equal(Number((withFacility - withoutFacility).toFixed(2)), 0.08);
});

test("추천 결과는 점수 내림차순으로 정렬된다", () => {
  const matches = rankTrainers(answers, ptTrainers, "muscle-factory");
  assert.ok(matches.every((match, index) => index === 0 || matches[index - 1].score >= match.score));
});

test("대표 답변의 운동 유형은 LPWF다", () => {
  assert.deepEqual(getMatchType(answers), {
    code: "LPWF",
    label: "천천히 확실하게 돌아오는 타입"
  });
});
