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
 * 상품 비주얼.
 *
 * 상품 사진은 정사각(신규)과 세로형(기존)이 섞여 있어 `object-contain`으로 담습니다.
 * 잘라내면 제품이 알아볼 수 없게 되므로 여백을 두고 전체를 보여줍니다.
 * 사진이 없는 항목은 카테고리 아이콘 타일로 대신하고, `product.image`만 채우면 교체됩니다.
 */
export function ProductVisual({ product, className }: { product: Product; className?: string }) {
  if (product.image) {
    return (
      <div className={cn("grid place-items-center overflow-hidden bg-warm", className)}>
        <img src={product.image} alt={product.name} className="size-full object-contain" />
      </div>
    );
  }

  // 사진이 없는 상품도 실제 사진 카드와 배경(웜)을 맞추고 코럴 톤 칩으로 담아
  // 그리드가 뒤섞여도 "준비 중"이 의도적으로 보이도록 합니다.
  return (
    <div
      role="img"
      aria-label={`${product.category} 상품 이미지 준비 중`}
      className={cn("grid place-items-center bg-warm", className)}
    >
      <span className="grid place-items-center rounded-2xl bg-white p-3 text-lime shadow-soft ring-1 ring-black/5">
        {categoryIcon[product.category]}
      </span>
    </div>
  );
}
