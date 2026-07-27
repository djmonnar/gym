import { useMemo, useState } from "react";
import { Heart, MessageCircle, Plus, Trophy } from "lucide-react";
import type { Challenge, Facility, Post, ScreenId } from "../../types";
import { Badge, ScreenHeader, cn } from "../ui";
import { ChallengeBanner } from "./ChallengeBanner";
import { DEMO_MEMBER, feedTabs, postTypeLabel, postTypeTone, type FeedTab } from "./communityMeta";

type CommunityFeedProps = {
  posts: Post[];
  challenges: Challenge[];
  facilities: Facility[];
  likedIds: string[];
  openPost: (post: Post) => void;
  openChallenge: (challenge: Challenge) => void;
  toggleLike: (post: Post) => void;
  navigate: (screen: ScreenId) => void;
};

export function PostCard({
  post,
  facilityName,
  liked,
  onOpen,
  onLike
}: {
  post: Post;
  facilityName?: string;
  liked: boolean;
  onOpen: () => void;
  onLike: () => void;
}) {
  return (
    <article className="rounded-[20px] bg-white p-4 shadow-soft ring-1 ring-black/5">
      <button type="button" onClick={onOpen} className="w-full text-left">
        <div className="flex items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-2">
            <span className="grid size-9 shrink-0 place-items-center rounded-full bg-brand text-xs font-black text-limeSoft">
              {post.authorName.slice(0, 1)}
            </span>
            <div className="min-w-0">
              <p className="truncate text-sm font-black">{post.authorName}</p>
              <p className="mt-0.5 truncate text-[11px] font-bold text-zinc-400">
                {facilityName ? `${facilityName} · ` : ""}
                {post.createdAt}
              </p>
            </div>
          </div>
          <Badge tone={postTypeTone[post.type]}>{postTypeLabel[post.type]}</Badge>
        </div>

        <p className="mt-3 line-clamp-3 text-sm font-bold leading-6 text-zinc-700">{post.text}</p>

        {post.images.length ? (
          <img
            src={post.images[0]}
            alt=""
            className="mt-3 h-40 w-full rounded-[16px] object-cover"
          />
        ) : null}

        {post.tags.length ? (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {post.tags.map((tag) => (
              <span key={tag} className="rounded-full bg-zinc-100 px-2.5 py-1 text-[11px] font-black text-zinc-600">
                #{tag}
              </span>
            ))}
          </div>
        ) : null}
      </button>

      <div className="mt-3 flex items-center gap-4 border-t border-black/5 pt-3">
        <button
          type="button"
          onClick={onLike}
          className={cn("flex items-center gap-1.5 text-xs font-black transition", liked ? "text-brand" : "text-zinc-500")}
          aria-pressed={liked}
        >
          <Heart size={16} className={cn(liked && "fill-brand")} />
          {post.likes + (liked ? 1 : 0)}
        </button>
        <button type="button" onClick={onOpen} className="flex items-center gap-1.5 text-xs font-black text-zinc-500">
          <MessageCircle size={16} />
          {post.commentCount}
        </button>
      </div>
    </article>
  );
}

export function CommunityFeedScreen({
  posts,
  challenges,
  facilities,
  likedIds,
  openPost,
  openChallenge,
  toggleLike,
  navigate
}: CommunityFeedProps) {
  const [activeTab, setActiveTab] = useState<FeedTab>("all");
  const featuredChallenge = challenges[0];

  const facilityNameById = useMemo(
    () => new Map(facilities.map((facility) => [facility.id, facility.name])),
    [facilities]
  );

  const visiblePosts = useMemo(() => {
    if (activeTab === "facility") return posts.filter((post) => post.facilityId === DEMO_MEMBER.facilityId);
    if (activeTab === "challenge") return posts.filter((post) => post.challengeId);
    return posts;
  }, [activeTab, posts]);

  return (
    <div>
      <ScreenHeader
        title="함께 운동해요"
        eyebrow="RETURN COMMUNITY"
        action={
          <button
            type="button"
            onClick={() => navigate("communityWrite")}
            className="grid size-11 place-items-center rounded-full bg-brand text-limeSoft shadow-soft"
            aria-label="운동 인증 작성"
          >
            <Plus size={21} />
          </button>
        }
      />

      {featuredChallenge ? (
        <ChallengeBanner
          challenge={featuredChallenge}
          onClick={() => openChallenge(featuredChallenge)}
          className="mb-4"
        />
      ) : null}

      <button
        type="button"
        onClick={() => navigate("challengeList")}
        className="mb-6 flex w-full items-center justify-between gap-3 rounded-[18px] bg-white px-4 py-3 shadow-soft ring-1 ring-black/5"
      >
        <span className="flex items-center gap-2 text-sm font-black">
          <Trophy size={18} className="text-blue" />
          진행 중인 챌린지 {challenges.length}개
        </span>
        <span className="text-xs font-black text-brand">전체 보기</span>
      </button>

      <div className="mb-4 flex gap-2">
        {feedTabs.map((tab) => {
          const isActive = tab.id === activeTab;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "min-h-10 rounded-full px-4 text-xs font-black ring-1 transition",
                isActive ? "bg-brand text-limeSoft ring-brand" : "bg-white text-zinc-500 ring-black/5"
              )}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {visiblePosts.length ? (
        <div className="space-y-3">
          {visiblePosts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              facilityName={post.facilityId ? facilityNameById.get(post.facilityId) : undefined}
              liked={likedIds.includes(post.id)}
              onOpen={() => openPost(post)}
              onLike={() => toggleLike(post)}
            />
          ))}
        </div>
      ) : (
        <div className="rounded-[24px] bg-white p-8 text-center shadow-soft ring-1 ring-black/5">
          <p className="text-sm font-black text-brand">아직 게시물이 없어요</p>
          <p className="mt-2 text-xs font-bold text-zinc-500">첫 운동 인증을 남겨보세요.</p>
        </div>
      )}
    </div>
  );
}
