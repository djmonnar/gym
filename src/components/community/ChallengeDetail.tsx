import { Award, CalendarDays, Check, ChevronRight, Gift, Users } from "lucide-react";
import type { Challenge, Post, ScreenId } from "../../types";
import { Badge, Button, Card, ScreenHeader } from "../ui";
import { postTypeLabel } from "./communityMeta";

export function ChallengeDetailScreen({
  challenge,
  posts,
  joined,
  onToggleJoin,
  openPost,
  navigate
}: {
  challenge: Challenge;
  posts: Post[];
  joined: boolean;
  onToggleJoin: () => void;
  openPost: (post: Post) => void;
  navigate: (screen: ScreenId) => void;
}) {
  const progress = Math.min(100, Math.round((challenge.myCount / challenge.goalCount) * 100));
  const remaining = Math.max(0, challenge.goalCount - challenge.myCount);
  const relatedPosts = posts.filter((post) => post.challengeId === challenge.id).slice(0, 3);

  return (
    <div>
      <ScreenHeader title={challenge.title} eyebrow="CHALLENGE" onBack={() => navigate("challengeList")} />

      <div className="relative mb-4 min-h-[170px] overflow-hidden rounded-[24px] text-white shadow-glow">
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
        <div className="absolute inset-0 bg-gradient-to-r from-brand via-brand/75 to-brand/10" />
        <div className="relative p-5">
          <Badge tone={challenge.host === "hq" ? "lime" : "blue"}>{challenge.hostName}</Badge>
          <p className="mt-3 text-sm font-bold leading-6 text-white/80">{challenge.description}</p>
        </div>
      </div>

      <Card className="mb-4">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-black text-blue">내 진행률</p>
            <p className="mt-1 text-3xl font-black text-brand">
              {challenge.myCount}
              <span className="text-lg text-zinc-400"> / {challenge.goalCount}회</span>
            </p>
          </div>
          <p className="text-sm font-black text-brand">{progress}%</p>
        </div>
        <div className="mt-3 h-2.5 w-full overflow-hidden rounded-full bg-zinc-100">
          <div className="h-full rounded-full bg-lime transition-all" style={{ width: `${progress}%` }} />
        </div>
        <p className="mt-3 text-xs font-bold text-zinc-500">
          {remaining ? `${remaining}회 더 인증하면 배지를 받을 수 있어요.` : "목표를 달성했어요. 배지가 지급됩니다."}
        </p>
      </Card>

      <div className="mb-4 grid grid-cols-2 gap-3">
        <Card className="p-4">
          <Users size={20} className="text-blue" />
          <p className="mt-3 text-xs font-bold text-zinc-400">참여 인원</p>
          <p className="mt-1 text-lg font-black">{challenge.participantCount}명</p>
        </Card>
        <Card className="p-4">
          <Award size={20} className="text-blue" />
          <p className="mt-3 text-xs font-bold text-zinc-400">달성 배지</p>
          <p className="mt-1 text-lg font-black">{challenge.badgeName}</p>
        </Card>
      </div>

      <Card className="mb-4">
        <div className="flex items-center gap-2 text-sm font-black">
          <CalendarDays size={18} className="text-blue" />
          기간 {challenge.period.startAt} ~ {challenge.period.endAt}
        </div>
        <div className="mt-4 flex items-start gap-2 rounded-[16px] bg-zinc-50 p-3">
          <Gift size={18} className="mt-0.5 shrink-0 text-blue" />
          <div>
            <p className="text-xs font-bold text-zinc-400">리워드</p>
            <p className="mt-1 text-sm font-black text-brand">{challenge.reward}</p>
          </div>
        </div>
        <p className="mt-4 text-xs font-black text-zinc-400">참여 방법</p>
        <ul className="mt-2 space-y-2">
          {challenge.steps.map((step) => (
            <li key={step} className="flex items-start gap-2 text-sm font-semibold leading-6 text-zinc-700">
              <Check size={16} className="mt-1 shrink-0 text-blue" />
              <span>{step}</span>
            </li>
          ))}
        </ul>
      </Card>

      {relatedPosts.length ? (
        <section className="mb-4">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-lg font-black">참여 인증</h2>
            <Badge tone="gray">{relatedPosts.length}개</Badge>
          </div>
          <div className="space-y-2">
            {relatedPosts.map((post) => (
              <button
                key={post.id}
                type="button"
                onClick={() => openPost(post)}
                className="flex w-full items-center gap-3 rounded-[18px] bg-white p-3 text-left shadow-soft ring-1 ring-black/5"
              >
                <span className="grid size-9 shrink-0 place-items-center rounded-full bg-brand text-xs font-black text-lime">
                  {post.authorName.slice(0, 1)}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-black">{post.authorName}</p>
                  <p className="mt-1 truncate text-xs font-bold text-zinc-500">{post.text}</p>
                </div>
                <Badge tone="gray">{postTypeLabel[post.type]}</Badge>
              </button>
            ))}
          </div>
        </section>
      ) : null}

      <div className="grid grid-cols-2 gap-3">
        <Button variant={joined ? "ghost" : "primary"} onClick={onToggleJoin}>
          {joined ? "참여 취소" : "챌린지 참여"}
        </Button>
        <Button variant="dark" onClick={() => navigate("communityWrite")}>
          인증 남기기
          <ChevronRight size={17} />
        </Button>
      </div>
    </div>
  );
}
