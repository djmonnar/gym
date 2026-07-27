import { useMemo, useState } from "react";
import { ShoppingCart, Store, Truck } from "lucide-react";
import type { Product, ScreenId } from "../../types";
import { Badge, Card, ScreenHeader, cn } from "../ui";
import { ProductVisual, sellerTypeLabel, sellerTypeTone, shopTabs, type ShopTab } from "./shopMeta";

const formatWon = (value: number) => `${value.toLocaleString("ko-KR")}원`;

export function ShopScreen({
  products,
  cartCount,
  selectProduct,
  navigate
}: {
  products: Product[];
  cartCount: number;
  selectProduct: (product: Product) => void;
  navigate: (screen: ScreenId) => void;
}) {
  const [activeTab, setActiveTab] = useState<ShopTab>("all");

  const visible = useMemo(
    () => (activeTab === "all" ? products : products.filter((product) => product.category === activeTab)),
    [activeTab, products]
  );

  return (
    <div>
      <ScreenHeader
        title="리턴샵"
        eyebrow="리턴패스 회원 전용 상품"
        action={
          <button
            type="button"
            onClick={() => navigate("cart")}
            className="relative grid size-11 place-items-center rounded-full bg-white shadow-soft"
            aria-label="장바구니"
          >
            <ShoppingCart size={20} />
            {cartCount > 0 ? (
              <span className="absolute -right-1 -top-1 grid size-6 place-items-center rounded-full bg-brand text-[11px] font-black text-limeSoft">
                {cartCount}
              </span>
            ) : null}
          </button>
        }
      />

      <div className="scrollbar-none -mx-1 mb-5 flex gap-2 overflow-x-auto px-1 pb-1">
        {shopTabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "min-h-10 shrink-0 rounded-full px-4 text-xs font-black ring-1 transition",
              tab.id === activeTab ? "bg-brand text-limeSoft ring-brand" : "bg-white text-zinc-600 ring-black/5"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm font-black">
          {activeTab === "all" ? "전체 상품" : activeTab}
        </p>
        <Badge tone="gray">{visible.length}개</Badge>
      </div>

      {visible.length ? (
        <div className="grid grid-cols-2 gap-3">
          {visible.map((product) => (
            <button
              key={product.id}
              type="button"
              onClick={() => selectProduct(product)}
              className="overflow-hidden rounded-[20px] bg-white text-left shadow-soft ring-1 ring-black/5 transition active:scale-[0.99]"
            >
              <div className="relative">
                <ProductVisual product={product} className="aspect-square w-full" />
                <span className="absolute left-2 top-2">
                  <Badge tone={sellerTypeTone[product.sellerType]}>{sellerTypeLabel[product.sellerType]}</Badge>
                </span>
                {product.status === "soldOut" ? (
                  <div className="absolute inset-0 grid place-items-center bg-white/70">
                    <span className="rounded-full bg-brand px-3 py-1 text-xs font-black text-white">품절</span>
                  </div>
                ) : null}
              </div>
              <div className="p-3">
                <p className="line-clamp-2 min-h-[38px] text-sm font-black leading-tight">{product.name}</p>
                <p className="mt-1 truncate text-[11px] font-bold text-zinc-400">{product.sellerName}</p>
                <div className="mt-2 flex items-baseline gap-1.5">
                  {product.originalPrice > product.price ? (
                    <span className="text-sm font-black text-lime">
                      {Math.round((1 - product.price / product.originalPrice) * 100)}%
                    </span>
                  ) : null}
                  <span className="text-base font-black text-brand">{formatWon(product.price)}</span>
                </div>
                {product.originalPrice > product.price ? (
                  <p className="text-[11px] font-bold text-zinc-400 line-through">{formatWon(product.originalPrice)}</p>
                ) : null}
                <p className="mt-1 flex items-center gap-1 text-[11px] font-bold text-zinc-500">
                  {product.fulfillment === "pickup" ? (
                    <>
                      <Store size={12} />
                      픽업 전용
                    </>
                  ) : product.fulfillment === "both" ? (
                    <>
                      <Truck size={12} />
                      배송·픽업
                    </>
                  ) : (
                    <>
                      <Truck size={12} />
                      택배 배송
                    </>
                  )}
                </p>
              </div>
            </button>
          ))}
        </div>
      ) : (
        <Card className="py-10 text-center">
          <p className="text-sm font-black text-brand">이 분류에는 아직 상품이 없어요</p>
          <p className="mt-2 text-xs font-bold text-zinc-500">다른 분류를 확인해 보세요.</p>
        </Card>
      )}
    </div>
  );
}
