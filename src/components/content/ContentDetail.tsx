import { useMemo, useState } from "react";
import {
  Bookmark,
  BookmarkCheck,
  CalendarDays,
  Check,
  ChevronRight,
  Clock,
  ListChecks,
  LockKeyhole,
  Pause,
  Play,
  Sparkles,
  UserCheck,
  Utensils
} from "lucide-react";
import type { Content, ScreenId } from "../../types";
import { Badge, Button, Card, ScreenHeader, cn } from "../ui";
import { ContentThumbnail } from "./ContentThumbnail";
import { contentAccessLabel, contentTypeLabel, isContentLocked } from "./contentMeta";

type ContentDetailProps = {
  content: Content;
  saved: boolean;
  completed: boolean;
  onToggleSave: () => void;
  onToggleComplete: () => void;
  navigate: (screen: ScreenId) => void;
  notify: (message: string) => void;
};

function MetaBadges({ content }: { content: Content }) {
  return (
    <div className="flex flex-wrap gap-2">
      <Badge tone="lime">{content.level}</Badge>
      <Badge tone="gray">{content.durationMin}분</Badge>
      <Badge tone="gray">{content.bodyParts.join(" · ")}</Badge>
      <Badge tone={isContentLocked(content) ? "blue" : content.access === "public" ? "green" : "gray"}>
        {contentAccessLabel[content.access]}
      </Badge>
    </div>
  );
}

function VideoBody({ content }: { content: Content }) {
  const chapters = content.videoChapters ?? [];
  const [playing, setPlaying] = useState(false);
  const [activeChapter, setActiveChapter] = useState(0);
  const progress = chapters.length ? Math.round(((activeChapter + (playing ? 1 : 0)) / chapters.length) * 100) : playing ? 40 : 0;

  return (
    <div className="space-y-4">
      <div className="relative overflow-hidden rounded-[24px] shadow-soft">
        <ContentThumbnail content={content} className="h-56 w-full" />
        <div className="absolute inset-0 bg-brand/35" />
        <button
          type="button"
          onClick={() => setPlaying((value) => !value)}
          className="absolute inset-0 grid place-items-center"
          aria-label={playing ? "일시정지" : "재생"}
        >
          <span className="grid size-16 place-items-center rounded-full bg-lime text-brand shadow-lift transition active:scale-95">
            {playing ? <Pause size={28} /> : <Play size={28} className="ml-1" />}
          </span>
        </button>
        <div className="absolute inset-x-0 bottom-0 space-y-2 bg-gradient-to-t from-brand/90 to-transparent p-4 text-white">
          <div className="flex items-center justify-between text-xs font-black">
            <span>{playing ? "재생 중" : "미리보기"}</span>
            <span>{progress}%</span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/25">
            <div className="h-full rounded-full bg-lime transition-all duration-300" style={{ width: `${progress}%` }} />
          </div>
        </div>
      </div>

      {chapters.length ? (
        <Card>
          <p className="mb-3 text-sm font-black">챕터</p>
          <ul className="space-y-1">
            {chapters.map((chapter, index) => {
              const isActive = index === activeChapter;
              return (
                <li key={chapter.time}>
                  <button
                    type="button"
                    onClick={() => {
                      setActiveChapter(index);
                      setPlaying(true);
                    }}
                    className={cn(
                      "flex w-full items-center gap-3 rounded-[14px] px-3 py-2.5 text-left text-sm font-bold transition",
                      isActive ? "bg-brand text-white" : "hover:bg-zinc-50"
                    )}
                  >
                    <span className={cn("font-black tabular-nums", isActive ? "text-lime" : "text-blue")}>{chapter.time}</span>
                    <span className="min-w-0 flex-1 truncate">{chapter.label}</span>
                    {isActive ? <Play size={15} className="shrink-0 text-lime" /> : null}
                  </button>
                </li>
              );
            })}
          </ul>
        </Card>
      ) : null}
    </div>
  );
}

function ArticleBody({ content }: { content: Content }) {
  const paragraphs = (content.body ?? content.summary).split("\n\n").filter(Boolean);

  return (
    <Card>
      <div className="flex items-center gap-2 text-xs font-black text-blue">
        <Clock size={15} />
        예상 읽기 시간 {content.durationMin}분
      </div>
      <div className="mt-4 space-y-4">
        {paragraphs.map((paragraph, index) => (
          <p key={index} className="text-[15px] font-semibold leading-7 text-zinc-700">
            {paragraph}
          </p>
        ))}
      </div>
    </Card>
  );
}

function MealPlanBody({ content, navigate }: { content: Content; navigate: (screen: ScreenId) => void }) {
  const meals = content.weeklyMeals ?? [];

  return (
    <div className="space-y-4">
      <Card>
        <div className="flex items-center gap-2">
          <div className="grid size-10 place-items-center rounded-[14px] bg-lime text-brand">
            <Utensils size={20} />
          </div>
          <div>
            <p className="text-sm font-black">주간 식단 요약</p>
            <p className="text-xs font-bold text-zinc-500">{content.summary}</p>
          </div>
        </div>
        <ul className="mt-4 divide-y divide-black/5">
          {meals.map((meal) => (
            <li key={meal.day} className="flex items-start gap-3 py-3">
              <span className="grid size-9 shrink-0 place-items-center rounded-full bg-brand text-xs font-black text-lime">
                {meal.day}
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-bold leading-6 text-zinc-700">{meal.menu}</p>
                <p className="mt-1 text-xs font-black text-blue">{meal.kcal}</p>
              </div>
            </li>
          ))}
        </ul>
      </Card>
      <Card className="bg-brand text-white">
        <p className="text-sm font-black">내 몸에 맞게 조정하고 싶다면?</p>
        <p className="mt-2 text-xs font-bold leading-6 text-white/70">
          목표 칼로리와 알레르기, 선호 식재료를 반영한 AI 맞춤 식단으로 이어서 받아보세요.
        </p>
        <Button className="mt-4 w-full" onClick={() => navigate("aiDiet")}>
          AI 맞춤 식단 보기
          <ChevronRight size={18} />
        </Button>
      </Card>
    </div>
  );
}

function ProgramBody({
  content,
  navigate,
  onAddRoutine
}: {
  content: Content;
  navigate: (screen: ScreenId) => void;
  onAddRoutine: () => void;
}) {
  const weeks = content.programWeeks ?? [];

  return (
    <div className="space-y-4">
      <Card>
        <div className="flex items-center gap-2">
          <div className="grid size-10 place-items-center rounded-[14px] bg-lime text-brand">
            <CalendarDays size={20} />
          </div>
          <div>
            <p className="text-sm font-black">주차별 구성</p>
            <p className="text-xs font-bold text-zinc-500">{weeks.length}주 · 회당 약 {content.durationMin}분</p>
          </div>
        </div>
        <ol className="mt-4 space-y-3">
          {weeks.map((week) => (
            <li key={week.week} className="flex gap-3 rounded-[16px] bg-zinc-50 p-3">
              <span className="grid size-9 shrink-0 place-items-center rounded-full bg-brand text-xs font-black text-lime">
                {week.week}주
              </span>
              <div className="min-w-0">
                <p className="text-sm font-black text-brand">{week.title}</p>
                <p className="mt-1 text-xs font-bold leading-5 text-zinc-600">{week.detail}</p>
              </div>
            </li>
          ))}
        </ol>
      </Card>
      <Card className="bg-brand text-white">
        <p className="text-sm font-black">이 프로그램을 내 루틴으로</p>
        <p className="mt-2 text-xs font-bold leading-6 text-white/70">
          주차별 구성을 내 운동 루틴에 추가하면 홈에서 오늘 할 운동으로 이어집니다.
        </p>
        <Button
          className="mt-4 w-full"
          onClick={() => {
            onAddRoutine();
            navigate("aiRoutine");
          }}
        >
          내 루틴에 추가
          <ChevronRight size={18} />
        </Button>
      </Card>
    </div>
  );
}

function LockedView({ content, navigate }: { content: Content; navigate: (screen: ScreenId) => void }) {
  return (
    <div className="space-y-4">
      <div className="relative overflow-hidden rounded-[24px] shadow-soft">
        <ContentThumbnail content={content} className="h-56 w-full scale-105 blur-[3px]" />
        <div className="absolute inset-0 grid place-items-center bg-brand/60 text-center text-white">
          <div className="px-6">
            <span className="mx-auto grid size-14 place-items-center rounded-full bg-lime text-brand">
              <LockKeyhole size={26} />
            </span>
            <p className="mt-3 text-sm font-black">PT 회원 전용 콘텐츠</p>
            <p className="mt-1 text-xs font-bold text-white/75">담당 트레이너와 함께 진행하는 콘텐츠예요.</p>
          </div>
        </div>
      </div>

      <Card>
        <MetaBadges content={content} />
        <p className="mt-4 text-sm font-bold leading-6 text-zinc-600">{content.summary}</p>
      </Card>

      <Card className="bg-brand text-white">
        <Badge tone="lime">
          <Sparkles size={13} className="mr-1" />
          PT 매칭
        </Badge>
        <p className="mt-4 text-lg font-black leading-snug">나에게 맞는 트레이너를 찾고 전용 콘텐츠를 열어보세요</p>
        <p className="mt-2 text-xs font-bold leading-6 text-white/70">
          10문항 진단으로 목표·성향에 맞는 트레이너 Top 3를 추천해 드려요.
        </p>
        <Button className="mt-4 w-full" onClick={() => navigate("ptMatchIntro")}>
          <UserCheck size={18} />
          PT 매칭 시작
        </Button>
      </Card>
    </div>
  );
}

export function ContentDetailScreen({
  content,
  saved,
  completed,
  onToggleSave,
  onToggleComplete,
  navigate,
  notify
}: ContentDetailProps) {
  const locked = isContentLocked(content);
  const eyebrow = useMemo(() => contentTypeLabel[content.type], [content.type]);

  return (
    <div>
      <ScreenHeader title={content.title} eyebrow={eyebrow} onBack={() => navigate("contentHome")} />

      {locked ? (
        <LockedView content={content} navigate={navigate} />
      ) : (
        <div className="space-y-4">
          {content.type === "video" ? <VideoBody content={content} /> : null}
          {content.type === "article" ? <ArticleBody content={content} /> : null}
          {content.type === "mealPlan" ? <MealPlanBody content={content} navigate={navigate} /> : null}
          {content.type === "program" ? (
            <ProgramBody content={content} navigate={navigate} onAddRoutine={() => notify("내 루틴에 추가했어요")} />
          ) : null}

          <Card>
            <MetaBadges content={content} />
            <p className="mt-4 text-sm font-bold leading-6 text-zinc-600">{content.summary}</p>
            <p className="mt-3 text-xs font-bold text-zinc-400">{content.author} · {content.publishedAt}</p>
          </Card>

          <div className="grid grid-cols-2 gap-3">
            <Button variant={saved ? "dark" : "line"} onClick={onToggleSave}>
              {saved ? <BookmarkCheck size={18} /> : <Bookmark size={18} />}
              {saved ? "저장됨" : "저장하기"}
            </Button>
            <Button variant={completed ? "primary" : "ghost"} onClick={onToggleComplete}>
              {completed ? <Check size={18} /> : <ListChecks size={18} />}
              {completed ? "완료함" : "완료 체크"}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
