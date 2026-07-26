import { useState } from "react";
import { ImagePlus, Trophy } from "lucide-react";
import type { Challenge, Facility, Post, PostType, ScreenId } from "../../types";
import { Badge, Button, Card, ScreenHeader, cn } from "../ui";
import { DEMO_MEMBER, postTypeLabel } from "./communityMeta";

const writableTypes: PostType[] = ["proof", "qna", "free"];

export function CommunityWriteScreen({
  facilities,
  challenges,
  onSubmit,
  navigate
}: {
  facilities: Facility[];
  challenges: Challenge[];
  onSubmit: (post: Post) => void;
  navigate: (screen: ScreenId) => void;
}) {
  const [type, setType] = useState<PostType>("proof");
  const [text, setText] = useState("");
  const [facilityId, setFacilityId] = useState<string | null>(DEMO_MEMBER.facilityId);
  const [challengeId, setChallengeId] = useState<string | null>(null);

  const canSubmit = text.trim().length > 0;

  const submit = () => {
    if (!canSubmit) return;
    onSubmit({
      id: `post-local-${Date.now()}`,
      uid: DEMO_MEMBER.uid,
      authorName: DEMO_MEMBER.name,
      type,
      facilityId,
      challengeId,
      text: text.trim(),
      images: [],
      likes: 0,
      commentCount: 0,
      status: "open",
      reportCount: 0,
      createdAt: "방금 전",
      tags: type === "proof" ? ["운동인증"] : type === "qna" ? ["질문"] : []
    });
  };

  return (
    <div>
      <ScreenHeader title="운동 인증 남기기" eyebrow="WRITE" onBack={() => navigate("communityFeed")} />

      <Card className="mb-4">
        <p className="text-xs font-black text-zinc-400">글 종류</p>
        <div className="mt-3 flex gap-2">
          {writableTypes.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setType(item)}
              className={cn(
                "min-h-10 flex-1 rounded-full px-3 text-xs font-black ring-1 transition",
                item === type ? "bg-brand text-lime ring-brand" : "bg-white text-zinc-500 ring-black/5"
              )}
            >
              {postTypeLabel[item]}
            </button>
          ))}
        </div>
      </Card>

      <Card className="mb-4">
        <label className="text-xs font-black text-zinc-400" htmlFor="post-text">
          내용
        </label>
        <textarea
          id="post-text"
          value={text}
          onChange={(event) => setText(event.target.value)}
          rows={5}
          placeholder={
            type === "proof"
              ? "오늘 어떤 운동을 하셨나요?"
              : type === "qna"
                ? "궁금한 점을 적어주세요."
                : "자유롭게 이야기를 남겨보세요."
          }
          className="mt-2 w-full resize-none rounded-[16px] bg-zinc-50 p-4 text-sm font-semibold leading-7 text-brand placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue/30"
        />
        <div className="mt-3 flex items-center justify-between gap-3">
          <span className="flex items-center gap-1.5 text-xs font-bold text-zinc-400">
            <ImagePlus size={16} />
            사진 첨부는 준비 중입니다
          </span>
          <span className="text-xs font-black text-zinc-400">{text.trim().length}자</span>
        </div>
      </Card>

      <Card className="mb-4">
        <p className="text-xs font-black text-zinc-400">이용 시설 태그</p>
        <div className="scrollbar-none mt-3 flex gap-2 overflow-x-auto pb-1">
          <button
            type="button"
            onClick={() => setFacilityId(null)}
            className={cn(
              "min-h-10 shrink-0 rounded-full px-4 text-xs font-black ring-1 transition",
              facilityId === null ? "bg-brand text-lime ring-brand" : "bg-white text-zinc-500 ring-black/5"
            )}
          >
            선택 안 함
          </button>
          {facilities.map((facility) => (
            <button
              key={facility.id}
              type="button"
              onClick={() => setFacilityId(facility.id)}
              className={cn(
                "min-h-10 shrink-0 rounded-full px-4 text-xs font-black ring-1 transition",
                facilityId === facility.id ? "bg-brand text-lime ring-brand" : "bg-white text-zinc-500 ring-black/5"
              )}
            >
              {facility.name}
            </button>
          ))}
        </div>
      </Card>

      <Card className="mb-5">
        <p className="flex items-center gap-1.5 text-xs font-black text-zinc-400">
          <Trophy size={15} />
          챌린지 연결
        </p>
        <div className="mt-3 space-y-2">
          <button
            type="button"
            onClick={() => setChallengeId(null)}
            className={cn(
              "flex w-full items-center justify-between gap-3 rounded-[16px] px-4 py-3 text-left text-sm font-black ring-1 transition",
              challengeId === null ? "bg-brand text-white ring-brand" : "bg-white text-zinc-600 ring-black/5"
            )}
          >
            연결 안 함
          </button>
          {challenges.map((challenge) => (
            <button
              key={challenge.id}
              type="button"
              onClick={() => setChallengeId(challenge.id)}
              className={cn(
                "flex w-full items-center justify-between gap-3 rounded-[16px] px-4 py-3 text-left text-sm font-black ring-1 transition",
                challengeId === challenge.id ? "bg-brand text-white ring-brand" : "bg-white text-zinc-600 ring-black/5"
              )}
            >
              <span className="min-w-0 truncate">{challenge.title}</span>
              <Badge tone={challengeId === challenge.id ? "lime" : "gray"}>{challenge.myCount}/{challenge.goalCount}</Badge>
            </button>
          ))}
        </div>
      </Card>

      <div className="grid grid-cols-[0.8fr_1.2fr] gap-3">
        <Button variant="line" onClick={() => navigate("communityFeed")}>
          취소
        </Button>
        <Button onClick={submit} disabled={!canSubmit}>
          작성 완료
        </Button>
      </div>
    </div>
  );
}
