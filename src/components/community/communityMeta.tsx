import type { PostType } from "../../types";

export type FeedTab = "all" | "facility" | "challenge";

export const feedTabs: Array<{ id: FeedTab; label: string }> = [
  { id: "all", label: "전체" },
  { id: "facility", label: "내 시설" },
  { id: "challenge", label: "챌린지" }
];

export const postTypeLabel: Record<PostType, string> = {
  proof: "운동 인증",
  qna: "Q&A",
  notice: "지점 공지",
  free: "자유"
};

export const postTypeTone: Record<PostType, "lime" | "blue" | "gray" | "green"> = {
  proof: "lime",
  qna: "blue",
  notice: "green",
  free: "gray"
};

// 데모 회원. 내 시설 필터와 작성자 표시에 사용합니다.
export const DEMO_MEMBER = {
  uid: "member-1042",
  name: "김예림",
  facilityId: "muscle-factory"
};
