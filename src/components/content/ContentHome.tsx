import { useMemo, useState } from "react";
import { Bookmark, Check, ChevronRight, Clock, LockKeyhole, Search, Sparkles } from "lucide-react";
import type { Content } from "../../types";
import { Badge, ScreenHeader, cn } from "../ui";
import { ContentThumbnail } from "./ContentThumbnail";
import {
  contentAccessLabel,
  contentTabs,
  contentTypeIcon,
  contentTypeLabel,
  isContentLocked,
  type ContentTab
} from "./contentMeta";

type ContentHomeProps = {
  contents: Content[];
  openContent: (content: Content) => void;
  savedIds: string[];
  completedIds: string[];
};

function MetaLine({ content }: { content: Content }) {
  return (
    <span className="flex items-center gap-1.5">
      <span className="inline-flex items-center gap-1 text-blue">
        {contentTypeIcon[content.type]}
        {contentTypeLabel[content.type]}
      </span>
      <span className="text-zinc-300">·</span>
      {content.level}
      <span className="text-zinc-300">·</span>
      <Clock size={13} />
      {content.durationMin}분
    </span>
  );
}

function ContentRow({
  content,
  onClick,
  saved,
  completed
}: {
  content: Content;
  onClick: () => void;
  saved: boolean;
  completed: boolean;
}) {
  const locked = isContentLocked(content);

  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center gap-3 rounded-[20px] bg-white p-3 text-left shadow-soft ring-1 ring-black/5 transition active:scale-[0.99]"
    >
      <div className="relative shrink-0">
        <ContentThumbnail content={content} className="size-[76px] rounded-[16px]" />
        {locked ? (
          <span className="absolute inset-0 grid place-items-center rounded-[16px] bg-brand/55 text-limeSoft">
            <LockKeyhole size={20} />
          </span>
        ) : null}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1.5">
          <p className="truncate text-sm font-black">{content.title}</p>
          {completed ? <Check size={14} className="shrink-0 text-blue" /> : null}
          {saved ? <Bookmark size={14} className="shrink-0 fill-brand text-brand" /> : null}
        </div>
        <p className="mt-2 flex flex-wrap items-center gap-x-1.5 gap-y-1 text-[11px] font-bold text-zinc-500">
          <MetaLine content={content} />
        </p>
        <div className="mt-2">
          <Badge tone={locked ? "blue" : content.access === "public" ? "green" : "gray"}>
            {contentAccessLabel[content.access]}
          </Badge>
        </div>
      </div>
      <ChevronRight size={18} className="ml-auto shrink-0 text-zinc-400" />
    </button>
  );
}

export function ContentHomeScreen({ contents, openContent, savedIds, completedIds }: ContentHomeProps) {
  const [activeTab, setActiveTab] = useState<ContentTab>("all");
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const keyword = query.trim().toLowerCase();
    return contents.filter((content) => {
      const matchesTab = activeTab === "all" || content.type === activeTab;
      const matchesQuery =
        !keyword ||
        [content.title, content.summary, ...content.tags, ...content.bodyParts].some((token) =>
          token.toLowerCase().includes(keyword)
        );
      return matchesTab && matchesQuery;
    });
  }, [activeTab, contents, query]);

  const [featured, ...rest] = filtered;

  return (
    <div>
      <ScreenHeader title="오늘의 콘텐츠" eyebrow="RETURNLIFE CONTENT" />

      <label className="mb-4 flex min-h-12 items-center gap-3 rounded-[18px] bg-white px-4 shadow-soft ring-1 ring-black/5">
        <Search size={20} className="shrink-0 text-brand" />
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="제목·태그로 콘텐츠 검색"
          className="w-full bg-transparent text-sm font-bold text-brand placeholder:text-zinc-400 focus:outline-none"
        />
      </label>

      <div className="scrollbar-none -mx-1 mb-5 flex gap-2 overflow-x-auto px-1 pb-1">
        {contentTabs.map((tab) => {
          const isActive = tab.id === activeTab;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "min-h-10 shrink-0 rounded-full px-4 text-xs font-black ring-1 transition",
                isActive ? "bg-brand text-limeSoft ring-brand" : "bg-white text-zinc-600 ring-black/5"
              )}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {featured ? (
        <>
          <button
            type="button"
            onClick={() => openContent(featured)}
            className="group relative mb-6 block w-full overflow-hidden rounded-[24px] text-left shadow-soft"
          >
            <ContentThumbnail content={featured} className="h-52 w-full transition duration-300 group-hover:scale-[1.02]" />
            <div className="absolute inset-0 bg-gradient-to-t from-brand via-brand/40 to-transparent" />
            {isContentLocked(featured) ? (
              <span className="absolute right-4 top-4 grid size-10 place-items-center rounded-full bg-brand/70 text-limeSoft ring-1 ring-white/20">
                <LockKeyhole size={18} />
              </span>
            ) : null}
            <div className="absolute inset-x-0 bottom-0 p-5 text-white">
              <div className="flex items-center gap-2">
                <Badge tone="lime">
                  <Sparkles size={13} className="mr-1" />
                  추천 콘텐츠
                </Badge>
                <Badge tone="blue">{contentTypeLabel[featured.type]}</Badge>
              </div>
              <h2 className="mt-3 text-xl font-black leading-tight">{featured.title}</h2>
              <p className="mt-2 text-xs font-bold text-white/75">
                {featured.level} · {featured.durationMin}분 · {contentAccessLabel[featured.access]} · {featured.author}
              </p>
            </div>
          </button>

          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-lg font-black">
              {activeTab === "all" ? "김예림님 추천 콘텐츠" : `${contentTabs.find((tab) => tab.id === activeTab)?.label} 콘텐츠`}
            </h2>
            <Badge tone="gray">{filtered.length}개</Badge>
          </div>

          {rest.length ? (
            <div className="space-y-3">
              {rest.map((content) => (
                <ContentRow
                  key={content.id}
                  content={content}
                  onClick={() => openContent(content)}
                  saved={savedIds.includes(content.id)}
                  completed={completedIds.includes(content.id)}
                />
              ))}
            </div>
          ) : (
            <p className="rounded-[20px] bg-white p-6 text-center text-sm font-bold text-zinc-400 shadow-soft ring-1 ring-black/5">
              이 조건에 맞는 다른 콘텐츠가 없어요.
            </p>
          )}
        </>
      ) : (
        <div className="rounded-[24px] bg-white p-8 text-center shadow-soft ring-1 ring-black/5">
          <p className="text-sm font-black text-brand">검색 결과가 없어요</p>
          <p className="mt-2 text-xs font-bold text-zinc-500">다른 키워드나 탭으로 콘텐츠를 찾아보세요.</p>
        </div>
      )}
    </div>
  );
}
