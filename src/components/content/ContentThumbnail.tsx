import type { Content } from "../../types";
import { cn } from "../ui";

/**
 * 콘텐츠 썸네일.
 *
 * 개별 정사각 이미지를 object-cover로 담아 어떤 컨테이너에서도 가운데를 일관되게 보여줍니다.
 * (예전 스프라이트 + background-position 방식은 컨테이너 종횡비에 따라 피사체가 잘렸습니다.)
 * 인물 얼굴·상체가 남도록 세로 기준점을 살짝 위(35%)에 둡니다.
 */
export function ContentThumbnail({ content, className }: { content: Content; className?: string }) {
  return (
    <div className={cn("overflow-hidden bg-zinc-100", className)}>
      <img
        src={content.thumbnail}
        alt={`${content.title} 썸네일`}
        loading="lazy"
        className="h-full w-full object-cover object-[center_35%]"
      />
    </div>
  );
}
