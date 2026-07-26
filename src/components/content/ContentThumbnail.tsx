import type { Content } from "../../types";
import { cn } from "../ui";

export function ContentThumbnail({ content, className }: { content: Content; className?: string }) {
  return (
    <div
      role="img"
      aria-label={`${content.title} 썸네일`}
      className={cn("bg-no-repeat", className)}
      style={{
        backgroundImage: `url("${content.thumbnail}")`,
        backgroundPosition: content.thumbnailPosition,
        backgroundSize: "400% auto"
      }}
    />
  );
}
