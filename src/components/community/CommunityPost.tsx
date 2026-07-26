import { useEffect, useMemo, useState } from "react";
import { Heart, MessageCircle, Send, ShieldAlert, Trophy } from "lucide-react";
import type { Challenge, Comment, Facility, Post, ScreenId } from "../../types";
import { Badge, Button, Card, ScreenHeader, cn } from "../ui";
import { DEMO_MEMBER, postTypeLabel, postTypeTone } from "./communityMeta";

type CommunityPostProps = {
  post: Post;
  facilities: Facility[];
  challenges: Challenge[];
  liked: boolean;
  loadComments: (postId: string) => Promise<Comment[]>;
  onToggleLike: () => void;
  openChallenge: (challenge: Challenge) => void;
  navigate: (screen: ScreenId) => void;
  notify: (message: string) => void;
};

export function CommunityPostScreen({
  post,
  facilities,
  challenges,
  liked,
  loadComments,
  onToggleLike,
  openChallenge,
  navigate,
  notify
}: CommunityPostProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [draft, setDraft] = useState("");

  useEffect(() => {
    let mounted = true;
    loadComments(post.id).then((next) => {
      if (mounted) setComments(next);
    });
    return () => {
      mounted = false;
    };
  }, [loadComments, post.id]);

  const facility = useMemo(
    () => facilities.find((item) => item.id === post.facilityId),
    [facilities, post.facilityId]
  );
  const challenge = useMemo(
    () => challenges.find((item) => item.id === post.challengeId),
    [challenges, post.challengeId]
  );

  const submitComment = () => {
    const text = draft.trim();
    if (!text) return;
    setComments((current) => [
      ...current,
      {
        id: `comment-local-${current.length + 1}`,
        postId: post.id,
        uid: DEMO_MEMBER.uid,
        authorName: DEMO_MEMBER.name,
        text,
        createdAt: "방금 전"
      }
    ]);
    setDraft("");
    notify("댓글을 남겼어요");
  };

  return (
    <div>
      <ScreenHeader title="게시물" eyebrow="COMMUNITY" onBack={() => navigate("communityFeed")} />

      <Card className="mb-4">
        <div className="flex items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-2">
            <span className="grid size-11 shrink-0 place-items-center rounded-full bg-brand text-sm font-black text-lime">
              {post.authorName.slice(0, 1)}
            </span>
            <div className="min-w-0">
              <p className="truncate text-sm font-black">{post.authorName}</p>
              <p className="mt-0.5 truncate text-[11px] font-bold text-zinc-400">
                {facility ? `${facility.name} · ` : ""}
                {post.createdAt}
              </p>
            </div>
          </div>
          <Badge tone={postTypeTone[post.type]}>{postTypeLabel[post.type]}</Badge>
        </div>

        <p className="mt-4 text-[15px] font-semibold leading-7 text-zinc-700">{post.text}</p>

        {post.images.length ? (
          <img src={post.images[0]} alt="" className="mt-4 h-52 w-full rounded-[18px] object-cover" />
        ) : null}

        {post.tags.length ? (
          <div className="mt-4 flex flex-wrap gap-1.5">
            {post.tags.map((tag) => (
              <span key={tag} className="rounded-full bg-zinc-100 px-2.5 py-1 text-[11px] font-black text-zinc-600">
                #{tag}
              </span>
            ))}
          </div>
        ) : null}

        <div className="mt-4 flex items-center gap-4 border-t border-black/5 pt-4">
          <button
            type="button"
            onClick={onToggleLike}
            className={cn("flex items-center gap-1.5 text-sm font-black transition", liked ? "text-brand" : "text-zinc-500")}
            aria-pressed={liked}
          >
            <Heart size={18} className={cn(liked && "fill-brand")} />
            좋아요 {post.likes + (liked ? 1 : 0)}
          </button>
          <span className="flex items-center gap-1.5 text-sm font-black text-zinc-500">
            <MessageCircle size={18} />
            댓글 {comments.length}
          </span>
        </div>
      </Card>

      {challenge ? (
        <button
          type="button"
          onClick={() => openChallenge(challenge)}
          className="mb-4 flex w-full items-center gap-3 rounded-[18px] bg-brand px-4 py-3 text-left text-white shadow-soft"
        >
          <Trophy size={20} className="shrink-0 text-lime" />
          <div className="min-w-0 flex-1">
            <p className="text-[11px] font-bold text-white/60">참여 챌린지</p>
            <p className="truncate text-sm font-black">{challenge.title}</p>
          </div>
          <span className="text-xs font-black text-lime">보기</span>
        </button>
      ) : null}

      <section className="mb-4">
        <h2 className="mb-3 text-lg font-black">댓글 {comments.length}</h2>
        {comments.length ? (
          <div className="space-y-2">
            {comments.map((comment) => (
              <div key={comment.id} className="rounded-[18px] bg-white p-4 shadow-soft ring-1 ring-black/5">
                <div className="flex items-center gap-2">
                  <span className="grid size-8 shrink-0 place-items-center rounded-full bg-zinc-100 text-[11px] font-black text-brand">
                    {comment.authorName.slice(0, 1)}
                  </span>
                  <p className="truncate text-xs font-black">{comment.authorName}</p>
                  {comment.isAuthor ? <Badge tone="lime">작성자</Badge> : null}
                  <span className="ml-auto shrink-0 text-[11px] font-bold text-zinc-400">{comment.createdAt}</span>
                </div>
                <p className="mt-2 text-sm font-semibold leading-6 text-zinc-700">{comment.text}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="rounded-[18px] bg-white p-6 text-center text-sm font-bold text-zinc-400 shadow-soft ring-1 ring-black/5">
            첫 댓글을 남겨보세요.
          </p>
        )}
      </section>

      <Card className="mb-4">
        <label className="text-xs font-black text-zinc-400" htmlFor="comment-input">
          댓글 남기기
        </label>
        <div className="mt-2 flex items-end gap-2">
          <textarea
            id="comment-input"
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            rows={2}
            placeholder="응원과 질문을 남겨보세요"
            className="min-h-12 w-full resize-none rounded-[16px] bg-zinc-50 p-3 text-sm font-semibold leading-6 text-brand placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue/30"
          />
          <Button onClick={submitComment} disabled={!draft.trim()} className="shrink-0">
            <Send size={17} />
          </Button>
        </div>
      </Card>

      <button
        type="button"
        onClick={() => notify("신고가 접수되었습니다. 본사에서 검토합니다")}
        className="flex w-full items-center justify-center gap-2 rounded-[18px] px-5 py-3 text-xs font-black text-zinc-400 transition hover:bg-zinc-100"
      >
        <ShieldAlert size={16} />
        게시물 신고
      </button>
    </div>
  );
}
