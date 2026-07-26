import { Minus, Package, Plus, ShieldAlert, ShoppingCart, Store, Truck, X } from "lucide-react";
import type { CartItem, Product, ScreenId, SellerShipping } from "../../types";
import { summarizeCart } from "../../lib/cart";
import { Badge, Button, Card, ScreenHeader } from "../ui";
import { ProductVisual, sellerTypeLabel, sellerTypeTone } from "./shopMeta";

const formatWon = (value: number) => `${value.toLocaleString("ko-KR")}원`;

export function CartScreen({
  items,
  products,
  policies,
  onSetQuantity,
  onRemove,
  navigate
}: {
  items: CartItem[];
  products: Product[];
  policies: SellerShipping[];
  onSetQuantity: (productId: string, fulfillment: CartItem["fulfillment"], quantity: number) => void;
  onRemove: (productId: string, fulfillment: CartItem["fulfillment"]) => void;
  navigate: (screen: ScreenId) => void;
}) {
  const summary = summarizeCart(items, products, policies);
  const hasVendor = summary.groups.some((group) => group.sellerType !== "hq");

  if (!summary.groups.length) {
    return (
      <div>
        <ScreenHeader title="장바구니" eyebrow="리턴샵" onBack={() => navigate("shop")} />
        <Card className="py-14 text-center">
          <ShoppingCart size={34} className="mx-auto text-zinc-300" />
          <p className="mt-4 text-sm font-black text-brand">장바구니가 비어 있어요</p>
          <p className="mt-2 text-xs font-bold text-zinc-500">리턴샵에서 필요한 상품을 담아보세요.</p>
          <Button className="mt-5 w-full" onClick={() => navigate("shop")}>
            리턴샵 둘러보기
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div>
      <ScreenHeader title="장바구니" eyebrow="리턴샵" onBack={() => navigate("shop")} />

      <p className="mb-4 flex items-start gap-2 rounded-[16px] bg-zinc-100 p-4 text-xs font-bold leading-5 text-zinc-500">
        <Package size={15} className="mt-0.5 shrink-0" />
        판매자가 다르면 발송과 배송비가 각각 따로 계산됩니다.
      </p>

      <div className="space-y-4">
        {summary.groups.map((group) => (
          <Card key={group.sellerId} className="p-4">
            <div className="flex items-center justify-between gap-3">
              <div className="flex min-w-0 items-center gap-2">
                <Badge tone={sellerTypeTone[group.sellerType]}>{sellerTypeLabel[group.sellerType]}</Badge>
                <p className="truncate text-sm font-black">{group.sellerName}</p>
              </div>
            </div>

            <div className="mt-3 space-y-3">
              {[...group.deliveryLines, ...group.pickupLines].map((line) => (
                <div key={`${line.item.productId}-${line.item.fulfillment}`} className="flex gap-3">
                  <ProductVisual product={line.product} className="size-[68px] shrink-0 rounded-[14px]" />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <p className="line-clamp-2 text-sm font-black leading-tight">{line.product.name}</p>
                      <button
                        type="button"
                        onClick={() => onRemove(line.item.productId, line.item.fulfillment)}
                        className="grid size-7 shrink-0 place-items-center rounded-full text-zinc-400 transition hover:bg-zinc-100"
                        aria-label={`${line.product.name} 삭제`}
                      >
                        <X size={15} />
                      </button>
                    </div>
                    <p className="mt-1 flex items-center gap-1 text-[11px] font-bold text-blue">
                      {line.item.fulfillment === "pickup" ? (
                        <>
                          <Store size={12} />
                          시설 픽업
                        </>
                      ) : (
                        <>
                          <Truck size={12} />
                          택배 배송
                        </>
                      )}
                    </p>
                    <div className="mt-2 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() =>
                            onSetQuantity(line.item.productId, line.item.fulfillment, line.item.quantity - 1)
                          }
                          className="grid size-8 place-items-center rounded-full bg-zinc-50 ring-1 ring-black/5"
                          aria-label="수량 줄이기"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="w-6 text-center text-sm font-black">{line.item.quantity}</span>
                        <button
                          type="button"
                          onClick={() =>
                            onSetQuantity(line.item.productId, line.item.fulfillment, line.item.quantity + 1)
                          }
                          className="grid size-8 place-items-center rounded-full bg-zinc-50 ring-1 ring-black/5"
                          aria-label="수량 늘리기"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                      <p className="text-sm font-black text-brand">{formatWon(line.lineTotal)}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 space-y-1.5 border-t border-black/5 pt-3 text-xs font-bold">
              <div className="flex items-center justify-between text-zinc-500">
                <span>상품 금액</span>
                <span>{formatWon(group.subtotal)}</span>
              </div>
              <div className="flex items-center justify-between text-zinc-500">
                <span>배송비</span>
                <span>{group.shippingFee ? formatWon(group.shippingFee) : "무료"}</span>
              </div>
              {group.freeShippingGap > 0 ? (
                <p className="text-[11px] font-bold text-blue">
                  {formatWon(group.freeShippingGap)} 더 담으면 이 판매자 배송비가 무료예요
                </p>
              ) : null}
              <div className="flex items-center justify-between pt-1 text-sm font-black text-brand">
                <span>판매자 합계</span>
                <span>{formatWon(group.total)}</span>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Card className="mt-4">
        <div className="space-y-2 text-sm font-bold">
          <div className="flex items-center justify-between text-zinc-500">
            <span>상품 금액 ({summary.itemCount}개)</span>
            <span>{formatWon(summary.productSubtotal)}</span>
          </div>
          <div className="flex items-center justify-between text-zinc-500">
            <span>배송비 합계</span>
            <span>{summary.shippingTotal ? formatWon(summary.shippingTotal) : "무료"}</span>
          </div>
          <div className="flex items-center justify-between border-t border-black/5 pt-3 text-lg font-black text-brand">
            <span>결제 예정 금액</span>
            <span>{formatWon(summary.grandTotal)}</span>
          </div>
        </div>
      </Card>

      {hasVendor ? (
        <Card className="mt-4 bg-zinc-50">
          <div className="flex items-start gap-2">
            <ShieldAlert size={16} className="mt-0.5 shrink-0 text-zinc-500" />
            <p className="text-xs font-semibold leading-5 text-zinc-600">
              입점 판매업체와 시설이 판매하는 상품이 포함되어 있습니다. 리턴패스는 통신판매중개자이며 통신판매의 당사자가
              아닙니다. 해당 상품의 거래 책임은 각 판매자에게 있습니다.
            </p>
          </div>
        </Card>
      ) : null}

      <Button className="mt-5 w-full" onClick={() => navigate("shopComplete")}>
        {formatWon(summary.grandTotal)} 결제하기
      </Button>
    </div>
  );
}
