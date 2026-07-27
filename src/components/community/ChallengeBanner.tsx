import { Trophy } from "lucide-react";
import type { Challenge } from "../../types";
import { Badge, cn } from "../ui";

export function ChallengeBanner({
  challenge,
  onClick,
  className
}: {
  challenge: Challenge;
  onClick: () => void;
  className?: string;
}) {
  const progress = Math.min(100, Math.round((challenge.myCount / challenge.goalCount) * 100));

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn("relative block min-h-[190px] w-full overflow-hidden rounded-[24px] text-left text-white shadow-glow", className)}
    >
      <div
        role="img"
        aria-label={`${challenge.title} 챌린지 배너`}
        className="absolute inset-0 h-full w-full bg-no-repeat"
        style={{
          backgroundImage: `url("${challenge.image}")`,
          backgroundPosition: challenge.imagePosition,
          backgroundSize: "auto 300%"
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-brand via-brand/80 to-brand/10" />
      <div className="relative flex h-full flex-col justify-between gap-4 p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <Badge tone="lime">진행 중</Badge>
            <h2 className="mt-3 text-xl font-black">{challenge.title}</h2>
            <p className="mt-2 text-xs font-bold text-white/65">
              {challenge.participantCount}명 참여 · {challenge.reward}
            </p>
          </div>
          <Trophy size={32} className="shrink-0 text-limeSoft" />
        </div>
        <div>
          <div className="flex items-center justify-between text-xs font-black">
            <span className="text-white/75">내 진행</span>
            <span className="text-limeSoft">
              {challenge.myCount} / {challenge.goalCount}회
            </span>
          </div>
          <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-white/25">
            <div className="h-full rounded-full bg-lime transition-all" style={{ width: `${progress}%` }} />
          </div>
        </div>
      </div>
    </button>
  );
}
