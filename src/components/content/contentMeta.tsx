import type { ReactNode } from "react";
import { BookOpen, Dumbbell, PlayCircle, Utensils } from "lucide-react";
import type { Content, ContentAccess, ContentType } from "../../types";

export type ContentTab = "all" | ContentType;

export const contentTabs: Array<{ id: ContentTab; label: string }> = [
  { id: "all", label: "전체" },
  { id: "video", label: "영상" },
  { id: "article", label: "아티클" },
  { id: "mealPlan", label: "식단표" },
  { id: "program", label: "프로그램" }
];

export const contentTypeLabel: Record<ContentType, string> = {
  video: "영상",
  article: "아티클",
  mealPlan: "식단표",
  program: "프로그램"
};

export const contentTypeIcon: Record<ContentType, ReactNode> = {
  video: <PlayCircle size={16} />,
  article: <BookOpen size={16} />,
  mealPlan: <Utensils size={16} />,
  program: <Dumbbell size={16} />
};

export const contentAccessLabel: Record<ContentAccess, string> = {
  public: "무료 공개",
  subscriber: "구독 회원",
  pt: "PT 전용"
};

// 데모 회원의 접근 등급. public·subscriber 콘텐츠는 열람 가능, pt 콘텐츠는 잠금.
export const DEMO_MEMBER_ACCESS: ContentAccess = "subscriber";

const accessRank: Record<ContentAccess, number> = {
  public: 0,
  subscriber: 1,
  pt: 2
};

export const isContentLocked = (content: Content, memberAccess: ContentAccess = DEMO_MEMBER_ACCESS) =>
  accessRank[content.access] > accessRank[memberAccess];
