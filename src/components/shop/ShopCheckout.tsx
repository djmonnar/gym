import { useState } from "react";
import { CircleDollarSign, Clock, CreditCard, MapPin, ShieldAlert, ShoppingCart, Store, Truck } from "lucide-react";
import type { CartItem, Facility, Product, ScreenId, SellerShipping } from "../../types";
import { summarizeCart } from "../../lib/cart";
import { Badge, Button, Card, ScreenHeader } from "../ui";
import { sellerTypeLabel, sellerTypeTone } from "./shopMeta";

const formatWon = (value: number) => `${value.toLocaleString("ko-KR")}원`;

// 데모 배송지. 실제 서비스라면 회원 주소록에서 불러옵니다.
const demoAddress = {
  name: "김예림",
  phone: "010-1234-5678",
  address: "경상남도 진주시 가좌동 리턴빌 302호"
};

export function ShopCheckoutScreen({
  items,
  products,
  policies,
  facilities,
  navigate,
  notify
}: {
  items: CartItem[];
  products: Product[];
  policies: SellerShipping[];
  facilities: Facility[];
  navigate: (screen: ScreenId) => void;
  notify: (message: string) => void;
}) {
  const [agreed, setAgreed] = useState(false);
  const summary = summarizeCart(items, products, policies);
  const deliveryGroups = summary.groups.filter((group) => group.deliveryLines.length > 0);
  const pickupGroups = summary.groups.filter((group) => group.pickupLines.length > 0);
  const hasVendor = summary.groups.some((group) => group.sellerType !== "hq");

  if (!summary.groups.length) {
    return (
      <div>
        <ScreenHeader title="주문서" eyebrow="리턴샵" onBack={() => navigate("shop")} />
        <Card className="py-14 text-center">
          <ShoppingCart size={34} className="mx-auto text-zinc-300" />
          <p className="mt-4 text-sm font-black text-brand">주문할 상품이 없어요</p>
          <Button className="mt-5 w-full" onClick={() => navigate("shop")}>
            리턴샵 둘러보기
          </Button>
        </Card>
      </div>
    );
  }

  const pay = () => {
    if (!agreed) {
      notify("주문 내용 확인 및 동의가 필요합니다.");
      return;
    }
    navigate("shopComplete");
  };

  return (
    <div className="space-y-4 pb-24">
      <ScreenHeader title="주문서" eyebrow="실제 결제는 진행되지 않습니다" onBack={() => navigate("cart")} />

      {deliveryGroups.length ? (
        <Card>
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Truck size={18} className="text-blue" />
              <p className="text-sm font-black">배송지</p>
            </div>
            <button
              type="button"
              onClick={() => notify("데모에서는 배송지 변경이 제공되지 않아요.")}
              className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-black text-zinc-600"
            >
              변경
            </button>
          </div>
          <div className="mt-3 rounded-[16px] bg-zinc-50 p-4">
            <p className="text-sm font-black text-brand">
              {demoAddress.name} <span className="ml-1 text-xs font-bold text-zinc-500">{demoAddress.phone}</span>
            </p>
            <p className="mt-1.5 text-xs font-bold leading-5 text-zinc-600">{demoAddress.address}</p>
          </div>
        </Card>
      ) : null}

      {pickupGroups.length ? (
        <Card>
          <div className="flex items-center gap-2">
            <Store size={18} className="text-blue" />
            <p className="text-sm font-black">시설 픽업 수령</p>
          </div>
          <div className="mt-3 space-y-3">
            {pickupGroups.map((group) => {
              const facility = facilities.find((item) => item.id === group.sellerId);
              return (
                <div key={group.sellerId} className="rounded-[16px] bg-zinc-50 p-4">
                  <p className="truncate text-sm font-black">{facility?.name ?? group.sellerName}</p>
                  <dl className="mt-2 space-y-1.5 text-xs font-bold text-zinc-500">
                    <div className="flex items-start gap-2">
                      <dt className="flex w-16 shrink-0 items-center gap-1">
                        <MapPin size={12} />
                        수령지
                      </dt>
                      <dd className="text-zinc-700">{facility ? `${facility.location} 인포데스크` : "시설 인포데스크"}</dd>
                    </div>
                    <div className="flex items-start gap-2">
                      <dt className="flex w-16 shrink-0 items-center gap-1">
                        <Clock size={12} />
                        운영시간
                      </dt>
                      <dd className="text-zinc-700">{facility?.hours ?? "지점 운영시간에 따름"}</dd>
                    </div>
                  </dl>
                </div>
              );
            })}
          </div>
        </Card>
      ) : null}

      <Card>
        <p className="text-sm font-black">주문 상품</p>
        <div className="mt-3 space-y-4">
          {summary.groups.map((group) => (
            <div key={group.sellerId} className="space-y-2">
              <div className="flex items-center gap-2">
                <Badge tone={sellerTypeTone[group.sellerType]}>{sellerTypeLabel[group.sellerType]}</Badge>
                <p className="truncate text-xs font-black text-zinc-500">{group.sellerName}</p>
              </div>
              {[...group.deliveryLines, ...group.pickupLines].map((line) => (
                <div
                  key={`${line.item.productId}-${line.item.fulfillment}`}
                  className="flex items-center justify-between gap-3 text-sm"
                >
                  <span className="min-w-0 flex-1 truncate font-bold text-zinc-700">
                    {line.product.name} <span className="text-zinc-400">× {line.item.quantity}</span>
                  </span>
                  <span className="shrink-0 font-black text-brand">{formatWon(line.lineTotal)}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <div className="flex items-center gap-2">
          <CreditCard size={18} className="text-blue" />
          <p className="text-sm font-black">결제 수단</p>
        </div>
        <div className="mt-3 flex items-center gap-3 rounded-[16px] bg-brand px-4 py-3 text-white">
          <Badge tone="lime">더미 결제</Badge>
          <p className="text-sm font-black">리턴페이 · 실제 결제는 진행되지 않습니다</p>
        </div>
      </Card>

      <Card>
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
            <span>
              <CircleDollarSign size={16} className="mr-1 inline align-[-2px] text-blue" />
              결제 예정 금액
            </span>
            <span>{formatWon(summary.grandTotal)}</span>
          </div>
        </div>
      </Card>

      <Card className="bg-mist">
        <label className="flex items-start gap-3">
          <input
            type="checkbox"
            checked={agreed}
            onChange={(event) => setAgreed(event.target.checked)}
            className="mt-0.5 size-5 shrink-0 accent-brand"
          />
          <span className="text-xs font-bold leading-5 text-zinc-600">
            주문 내용을 확인했으며 결제 진행에 동의합니다.
            {hasVendor ? (
              <span className="mt-1 flex items-start gap-1.5 text-[11px] font-semibold text-zinc-500">
                <ShieldAlert size={13} className="mt-0.5 shrink-0" />
                입점·시설 판매 상품이 포함되어 있어 리턴패스는 통신판매중개자이며 거래 당사자가 아닙니다.
              </span>
            ) : null}
          </span>
        </label>
      </Card>

      <div className="sticky bottom-2 z-10 rounded-[24px] bg-white/90 p-2 shadow-lift backdrop-blur">
        <Button className="w-full" onClick={pay} disabled={!agreed}>
          {formatWon(summary.grandTotal)} 결제하기
        </Button>
      </div>
    </div>
  );
}
