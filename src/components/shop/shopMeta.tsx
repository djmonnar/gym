import type { ReactNode } from "react";
import { Dumbbell, Package, Salad, Shirt, Store } from "lucide-react";
import type { Product, ProductCategory, SellerType } from "../../types";
import { cn } from "../ui";

export type ShopTab = "all" | ProductCategory;

export const shopTabs: Array<{ id: ShopTab; label: string }> = [
  { id: "all", label: "전체" },
  { id: "닭가슴살·도시락", label: "닭가슴살·도시락" },
  { id: "보충제·단백질", label: "보충제·단백질" },
  { id: "소도구", label: "소도구" },
  { id: "의류", label: "의류" },
  { id: "시설 픽업", label: "시설 픽업" }
];

export const sellerTypeLabel: Record<SellerType, string> = {
  hq: "본사 직판",
  vendor: "입점 판매",
  facility: "시설 판매"
};

export const sellerTypeTone: Record<SellerType, "lime" | "blue" | "green"> = {
  hq: "lime",
  vendor: "blue",
  facility: "green"
};

export const fulfillmentLabel = {
  delivery: "택배 배송",
  pickup: "시설 픽업",
  both: "배송·픽업"
} as const;

const categoryIcon: Record<ProductCategory, ReactNode> = {
  "닭가슴살·도시락": <Salad size={28} />,
  "보충제·단백질": <Package size={28} />,
  소도구: <Dumbbell size={28} />,
  의류: <Shirt size={28} />,
  "시설 픽업": <Store size={28} />
};

/**
 * 상품 사진이 아직 없는 항목은 카테고리 아이콘 타일로 대신합니다.
 * 사진이 준비되면 `product.image`만 채우면 됩니다.
 */
export function ProductVisual({ product, className }: { product: Product; className?: string }) {
  if (product.image) {
    return <img src={product.image} alt={product.name} className={cn("object-cover", className)} />;
  }

  return (
    <div
      role="img"
      aria-label={`${product.category} 상품 이미지 준비 중`}
      className={cn("grid place-items-center bg-zinc-100 text-zinc-400", className)}
    >
      {categoryIcon[product.category]}
    </div>
  );
}
