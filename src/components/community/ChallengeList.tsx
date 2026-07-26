import { CalendarDays, Trophy } from "lucide-react";
import type { Challenge, ScreenId } from "../../types";
import { Badge, Card, ScreenHeader } from "../ui";
import { ChallengeBanner } from "./ChallengeBanner";

export function ChallengeListScreen({
  challenges,
  joinedIds,
  openChallenge,
  navigate
}: {
  challenges: Challenge[];
  joinedIds: string[];
  openChallenge: (challenge: Challenge) => void;
  navigate: (screen: ScreenId) => void;
}) {
  const totalDone = challenges.reduce((sum, challenge) => sum + challenge.myCount, 0);

  return (
    <div>
      <ScreenHeader title="이번 달 챌린지" eyebrow="CHALLENGE" onBack={() => navigate("communityFeed")} />

      <Card className="mb-5 bg-brand text-white">
        <div className="flex items-center gap-3">
          <div className="grid size-12 place-items-center rounded-[16px] bg-lime text-brand">
            <Trophy size={24} />
          </div>
          <div>
            <p className="text-xs font-bold text-white/65">이번 달 내 인증</p>
            <p className="mt-1 text-2xl font-black">{totalDone}회</p>
          </div>
        </div>
        <p className="mt-4 text-xs font-bold leading-6 text-white/70">
          출석과 루틴 달성으로 배지와 리턴샵 리워드를 모을 수 있어요. 참여 중인 챌린지는 {joinedIds.length}개입니다.
        </p>
      </Card>

      <div className="space-y-4">
        {challenges.map((challenge) => (
          <div key={challenge.id}>
            <ChallengeBanner challenge={challenge} onClick={() => openChallenge(challenge)} />
            <div className="mt-2 flex flex-wrap items-center gap-2 px-1">
              <Badge tone={challenge.host === "hq" ? "blue" : "gray"}>{challenge.hostName}</Badge>
              <span className="flex items-center gap-1 text-[11px] font-bold text-zinc-500">
                <CalendarDays size={13} />
                {challenge.period.startAt} ~ {challenge.period.endAt}
              </span>
              {joinedIds.includes(challenge.id) ? <Badge tone="lime">참여 중</Badge> : null}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
