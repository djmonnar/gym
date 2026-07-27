import { CheckCircle2, Clock, MapPin, Store, Truck } from "lucide-react";
import type { CartItem, Facility, Product, ScreenId, SellerShipping } from "../../types";
import { summarizeCart } from "../../lib/cart";
import { Badge, Button, Card, ScreenHeader } from "../ui";
import { sellerTypeLabel, sellerTypeTone } from "./shopMeta";

const formatWon = (value: number) => `${value.toLocaleString("ko-KR")}원`;

export function OrderCompleteScreen({
  items,
  products,
  policies,
  facilities,
  paidAmount,
  onDone,
  navigate
}: {
  items: CartItem[];
  products: Product[];
  policies: SellerShipping[];
  facilities: Facility[];
  paidAmount: number | null;
  onDone: () => void;
  navigate: (screen: ScreenId) => void;
}) {
  const summary = summarizeCart(items, products, policies);
  const paid = paidAmount ?? summary.grandTotal;
  const pickupGroups = summary.groups.filter((group) => group.pickupLines.length > 0);
  const deliveryGroups = summary.groups.filter((group) => group.deliveryLines.length > 0);

  return (
    <div>
      <ScreenHeader title="주문이 접수되었어요" eyebrow="ORDER COMPLETE" />

      <Card className="bg-brand text-white">
        <CheckCircle2 size={40} className="text-limeSoft" />
        <h2 className="mt-4 text-2xl font-black leading-snug">주문이 정상 접수되었습니다</h2>
        <p className="mt-3 text-sm font-bold leading-6 text-white/70">
          결제 금액 {formatWon(paid)} · 상품 {summary.itemCount}개
        </p>
        <p className="mt-2 text-xs font-bold leading-6 text-white/60">
          판매자가 여러 곳인 주문은 판매자별로 따로 발송되며 도착 시점이 다를 수 있습니다.
        </p>
      </Card>

      {pickupGroups.length ? (
        <Card className="mt-4">
          <div className="flex items-center gap-2">
            <Store size={18} className="text-blue" />
            <p className="text-sm font-black">픽업 안내</p>
          </div>
          <div className="mt-3 space-y-3">
            {pickupGroups.map((group) => {
              const facility = facilities.find((item) => item.id === group.sellerId);
              return (
                <div key={group.sellerId} className="rounded-[16px] bg-zinc-50 p-4">
                  <div className="flex items-center gap-2">
                    <Badge tone={sellerTypeTone[group.sellerType]}>{sellerTypeLabel[group.sellerType]}</Badge>
                    <p className="truncate text-sm font-black">{facility?.name ?? group.sellerName}</p>
                  </div>
                  <ul className="mt-3 space-y-1 text-xs font-bold text-zinc-600">
                    {group.pickupLines.map((line) => (
                      <li key={line.item.productId}>
                        · {line.product.name} × {line.item.quantity}
                      </li>
                    ))}
                  </ul>
                  <dl className="mt-3 space-y-1.5 text-xs font-bold text-zinc-500">
                    <div className="flex items-start gap-2">
                      <dt className="flex w-20 shrink-0 items-center gap-1">
                        <MapPin size={12} />
                        수령 장소
                      </dt>
                      <dd className="text-zinc-700">{facility ? `${facility.location} 인포데스크` : "시설 인포데스크"}</dd>
                    </div>
                    <div className="flex items-start gap-2">
                      <dt className="flex w-20 shrink-0 items-center gap-1">
                        <Clock size={12} />
                        운영시간
                      </dt>
                      <dd className="text-zinc-700">{facility?.hours ?? "지점 운영시간에 따름"}</dd>
                    </div>
                  </dl>
                  <p className="mt-3 text-[11px] font-bold text-blue">
                    인포데스크에서 리턴패스 QR을 보여주면 바로 받을 수 있어요.
                  </p>
                </div>
              );
            })}
          </div>
        </Card>
      ) : null}

      {deliveryGroups.length ? (
        <Card className="mt-4">
          <div className="flex items-center gap-2">
            <Truck size={18} className="text-blue" />
            <p className="text-sm font-black">배송 안내</p>
          </div>
          <div className="mt-3 space-y-2">
            {deliveryGroups.map((group) => (
              <div key={group.sellerId} className="rounded-[16px] bg-zinc-50 p-3">
                <div className="flex items-center justify-between gap-3">
                  <p className="truncate text-sm font-black">{group.sellerName}</p>
                  <span className="shrink-0 text-xs font-black text-zinc-500">
                    {group.shippingFee ? formatWon(group.shippingFee) : "배송비 무료"}
                  </span>
                </div>
                <p className="mt-1 text-[11px] font-bold text-zinc-500">{group.deliveryLines[0]?.product.shipping}</p>
              </div>
            ))}
          </div>
        </Card>
      ) : null}

      <Button
        variant="line"
        className="mt-5 w-full"
        onClick={() => {
          onDone();
          navigate("orderHistory");
        }}
      >
        주문 내역 보기
      </Button>
      <div className="mt-3 grid grid-cols-2 gap-3">
        <Button
          variant="line"
          onClick={() => {
            onDone();
            navigate("shop");
          }}
        >
          쇼핑 계속하기
        </Button>
        <Button
          onClick={() => {
            onDone();
            navigate("home");
          }}
        >
          홈으로
        </Button>
      </div>
    </div>
  );
}
