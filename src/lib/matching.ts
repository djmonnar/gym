import type { MatchAnswers, Trainer } from "../types";

export const MATCH_WEIGHTS = {
  goal: 0.3,
  intensity: 0.2,
  tone: 0.15,
  teach: 0.1,
  diet: 0.1,
  time: 0.1,
  care: 0.05,
  sameFacility: 0.08,
  highRating: 0.05,
  newTrainer: 0.03,
  budgetFit: 0.02,
  budgetOver: -0.08,
  genderMismatch: -0.18
} as const;

export type TrainerMatch = {
  trainer: Trainer;
  score: number;
  matchRate: number;
  reasons: string[];
};

export type MatchType = {
  code: string;
  label: string;
};

const intensityMap: Record<MatchAnswers["intensity"], Trainer["tags"]["intensity"]> = {
  "몰아치는 고강도": "고강도",
  "꾸준한 중강도": "중강도",
  "천천히 점진적": "점진적"
};

const dietMap: Record<MatchAnswers["diet"], Trainer["tags"]["dietInvolve"]> = {
  "매일 체크해주길": "매일 체크",
  "주 1회 피드백": "주 1회 피드백",
  "운동만": "운동만"
};

const sessionsByFrequency: Record<MatchAnswers["freq"], number> = {
  "주 1회": 4,
  "주 2회": 8,
  "주 3회": 12
};

const budgetLimit: Record<MatchAnswers["budget"], number> = {
  "월 20만원 이하": 200000,
  "월 40만원 이하": 400000,
  "월 60만원 이하": 600000,
  "예산 무관": Number.POSITIVE_INFINITY
};

const isBeginnerTrainer = (trainer: Trainer) =>
  trainer.specialty.includes("초보자") || trainer.tags.specialties.some((tag) => tag.includes("입문"));

export function scoreTrainer(answers: MatchAnswers, trainer: Trainer, facilityId?: string): number {
  const matches = {
    goal: trainer.tags.specialties.includes(answers.goal),
    intensity: trainer.tags.intensity === intensityMap[answers.intensity],
    tone: trainer.tags.tone === answers.tone,
    teach: trainer.tags.teach === answers.teach,
    diet: trainer.tags.dietInvolve === dietMap[answers.diet],
    time: trainer.timeSlots.includes(answers.time),
    care: answers.care === "없음" || trainer.tags.careExp.includes(answers.care)
  };

  let score =
    Number(matches.goal) * MATCH_WEIGHTS.goal +
    Number(matches.intensity) * MATCH_WEIGHTS.intensity +
    Number(matches.tone) * MATCH_WEIGHTS.tone +
    Number(matches.teach) * MATCH_WEIGHTS.teach +
    Number(matches.diet) * MATCH_WEIGHTS.diet +
    Number(matches.time) * MATCH_WEIGHTS.time +
    Number(matches.care) * MATCH_WEIGHTS.care;

  if (facilityId && trainer.facilityIds.includes(facilityId)) score += MATCH_WEIGHTS.sameFacility;
  if (trainer.rating >= 4.5) score += MATCH_WEIGHTS.highRating;
  if (trainer.reviewCount < 60) score += MATCH_WEIGHTS.newTrainer;
  if (answers.genderPref !== "무관" && answers.genderPref !== trainer.gender) score += MATCH_WEIGHTS.genderMismatch;

  const estimatedMonthlyPrice = trainer.price * sessionsByFrequency[answers.freq];
  score += estimatedMonthlyPrice <= budgetLimit[answers.budget] ? MATCH_WEIGHTS.budgetFit : MATCH_WEIGHTS.budgetOver;

  return Math.min(0.99, Math.max(0, Number(score.toFixed(4))));
}

export function getMatchReasons(answers: MatchAnswers, trainer: Trainer, facilityId?: string): string[] {
  const reasons: string[] = [];

  if (trainer.tags.specialties.includes(answers.goal)) reasons.push(`${answers.goal} 전문 경험이 목표와 잘 맞아요`);
  if (answers.level === "입문" && isBeginnerTrainer(trainer)) reasons.push("운동 입문자를 차근차근 지도해요");
  if (trainer.tags.intensity === intensityMap[answers.intensity]) reasons.push(`${answers.intensity} 강도로 진행해요`);
  if (trainer.tags.tone === answers.tone) reasons.push(`${answers.tone} 코칭 스타일이 일치해요`);
  if (trainer.timeSlots.includes(answers.time)) reasons.push(`${answers.time} 시간대 예약이 가능해요`);
  if (answers.care !== "없음" && trainer.tags.careExp.includes(answers.care)) reasons.push(`${answers.care} 케어 경험이 있어요`);
  if (facilityId && trainer.facilityIds.includes(facilityId)) reasons.push("현재 구독 중인 시설에서 만날 수 있어요");
  if (trainer.rating >= 4.8) reasons.push(`평점 ${trainer.rating.toFixed(1)}의 검증된 코치예요`);

  const fallbacks = [
    `${trainer.career} 경력의 ${trainer.specialty} 코치예요`,
    `후기 ${trainer.reviewCount}개로 수업 경험을 확인할 수 있어요`,
    "월 단위 PT 구독으로 부담 없이 시작할 수 있어요"
  ];

  return [...reasons, ...fallbacks].slice(0, 3);
}

export function rankTrainers(answers: MatchAnswers, trainers: Trainer[], facilityId?: string): TrainerMatch[] {
  return trainers
    .filter((trainer) => trainer.status === "active")
    .map((trainer) => {
      const score = scoreTrainer(answers, trainer, facilityId);
      return {
        trainer,
        score,
        matchRate: Math.round(score * 100),
        reasons: getMatchReasons(answers, trainer, facilityId)
      };
    })
    .sort(
      (left, right) =>
        right.score - left.score ||
        Number(right.trainer.tags.specialties.includes(answers.goal)) -
          Number(left.trainer.tags.specialties.includes(answers.goal)) ||
        right.trainer.rating - left.trainer.rating
    );
}

export function getMatchType(answers: MatchAnswers): MatchType {
  const goalCode: Record<MatchAnswers["goal"], string> = {
    "체중감량": "L",
    "근력·벌크업": "G",
    "체형교정·자세": "P",
    "통증·재활": "R",
    "체력·컨디션": "E"
  };
  const intensityCode: Record<MatchAnswers["intensity"], string> = {
    "천천히 점진적": "P",
    "꾸준한 중강도": "M",
    "몰아치는 고강도": "H"
  };
  const toneCode: Record<MatchAnswers["tone"], string> = {
    "다정·응원형": "W",
    "담백·프로형": "P",
    "직설·푸시형": "D"
  };
  const dietCode: Record<MatchAnswers["diet"], string> = {
    "주 1회 피드백": "F",
    "매일 체크해주길": "D",
    "운동만": "A"
  };

  const code = `${goalCode[answers.goal]}${intensityCode[answers.intensity]}${toneCode[answers.tone]}${dietCode[answers.diet]}`;
  const label =
    answers.intensity === "천천히 점진적" && answers.tone === "다정·응원형"
      ? "천천히 확실하게 돌아오는 타입"
      : answers.intensity === "몰아치는 고강도"
        ? "목표를 빠르게 밀어붙이는 타입"
        : "꾸준한 기준으로 변화를 만드는 타입";

  return { code, label };
}
