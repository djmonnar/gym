import { useState } from "react";
import { Check, Info, Minus, Plus, ShieldAlert, Store, Truck } from "lucide-react";
import type { CartItem, Facility, Product, ScreenId, Vendor } from "../../types";
import { defaultFulfillment, supportsFulfillment } from "../../lib/cart";
import { Badge, Button, Card, ScreenHeader, cn } from "../ui";
import { ProductVisual, sellerTypeLabel, sellerTypeTone } from "./shopMeta";

const formatWon = (value: number) => `${value.toLocaleString("ko-KR")}원`;

/**
 * 통신판매중개 고지.
 * 입점업체·시설이 파는 상품은 리턴패스가 거래 당사자가 아니라는 사실을 상품 페이지에 표시해야 합니다.
 */
export function BrokerageNotice({ product, vendor }: { product: Product; vendor?: Vendor }) {
  if (product.sellerType === "hq") return null;

  return (
    <Card className="bg-zinc-50">
      <div className="flex items-start gap-2">
        <ShieldAlert size={17} className="mt-0.5 shrink-0 text-zinc-500" />
        <div>
          <p className="text-xs font-black text-brand">통신판매중개 고지</p>
          <p className="mt-2 text-xs font-semibold leading-5 text-zinc-600">
            이 상품은 <span className="font-black">{product.sellerName}</span>이(가) 판매하는 상품으로, 리턴패스는
            통신판매중개자이며 통신판매의 당사자가 아닙니다. 상품·거래 정보와 거래에 대한 책임은 판매자에게 있습니다.
          </p>
          {vendor ? (
            <dl className="mt-3 space-y-1 text-[11px] font-bold text-zinc-500">
              <div className="flex gap-2">
                <dt className="w-16 shrink-0">상호</dt>
                <dd>{vendor.bizName}</dd>
              </div>
              <div className="flex gap-2">
                <dt className="w-16 shrink-0">사업자번호</dt>
                <dd>{vendor.bizNo}</dd>
              </div>
              <div className="flex gap-2">
                <dt className="w-16 shrink-0">문의</dt>
                <dd>{vendor.contact}</dd>
              </div>
            </dl>
          ) : null}
        </div>
      </div>
    </Card>
  );
}

export function ShopDetailScreen({
  product,
  vendors,
  facilities,
  onAddToCart,
  navigate,
  notify
}: {
  product: Product;
  vendors: Vendor[];
  facilities: Facility[];
  onAddToCart: (product: Product, fulfillment: CartItem["fulfillment"], quantity: number) => void;
  navigate: (screen: ScreenId) => void;
  notify: (message: string) => void;
}) {
  const [fulfillment, setFulfillment] = useState<CartItem["fulfillment"]>(defaultFulfillment(product));
  const [quantity, setQuantity] = useState(1);

  const vendor = vendors.find((item) => item.id === product.sellerId);
  const pickupFacility = facilities.find((item) => item.id === product.sellerId);
  const discount = Math.round((1 - product.price / product.originalPrice) * 100);

  const options: Array<{ value: CartItem["fulfillment"]; label: string; hint: string; icon: typeof Truck }> = [
    { value: "delivery", label: "택배 배송", hint: product.shipping, icon: Truck },
    {
      value: "pickup",
      label: "시설 픽업",
      hint: pickupFacility ? `${pickupFacility.name} 인포데스크` : "구독 중인 시설 인포데스크",
      icon: Store
    }
  ];

  return (
    <div>
      <ScreenHeader title={product.name} eyebrow="리턴샵" onBack={() => navigate("shop")} />

      <ProductVisual product={product} className="h-[320px] w-full rounded-[24px] shadow-soft sm:h-[380px]" />

      <Card className="mt-4">
        <div className="flex flex-wrap items-center gap-2">
          <Badge tone={sellerTypeTone[product.sellerType]}>{sellerTypeLabel[product.sellerType]}</Badge>
          <Badge tone="gray">{product.category}</Badge>
          {product.badge ? <Badge tone="lime">{product.badge}</Badge> : null}
        </div>
        <p className="mt-3 text-xs font-bold text-zinc-400">{product.sellerName}</p>
        <p className="mt-2 text-sm font-bold leading-6 text-zinc-600">{product.subtitle}</p>
        <div className="mt-4 flex items-end gap-2">
          <p className="text-2xl font-black text-brand">{formatWon(product.price)}</p>
          <p className="pb-0.5 text-sm font-bold text-zinc-400 line-through">{formatWon(product.originalPrice)}</p>
          {discount > 0 ? <p className="pb-0.5 text-sm font-black text-blue">{discount}%</p> : null}
        </div>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {product.tags.map((tag) => (
            <span key={tag} className="rounded-full bg-zinc-100 px-2.5 py-1 text-[11px] font-black text-zinc-600">
              {tag}
            </span>
          ))}
        </div>
      </Card>

      <Card className="mt-4">
        <p className="text-xs font-black text-zinc-400">수령 방법</p>
        <div className="mt-3 space-y-2">
          {options.map((option) => {
            const allowed = supportsFulfillment(product, option.value);
            const isActive = fulfillment === option.value;
            const Icon = option.icon;

            return (
              <button
                key={option.value}
                type="button"
                disabled={!allowed}
                onClick={() => setFulfillment(option.value)}
                className={cn(
                  "flex w-full items-center gap-3 rounded-[16px] px-4 py-3 text-left ring-1 transition",
                  isActive && allowed ? "bg-brand text-white ring-brand" : "bg-white text-zinc-600 ring-black/5",
                  !allowed && "cursor-not-allowed opacity-40"
                )}
              >
                <Icon size={18} className={cn("shrink-0", isActive && allowed ? "text-limeSoft" : "text-blue")} />
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-black">{option.label}</span>
                  <span className={cn("mt-0.5 block text-[11px] font-bold", isActive && allowed ? "text-white/70" : "text-zinc-400")}>
                    {allowed ? option.hint : "이 상품은 지원하지 않아요"}
                  </span>
                </span>
                {isActive && allowed ? <Check size={17} className="shrink-0 text-limeSoft" /> : null}
              </button>
            );
          })}
        </div>

        <div className="mt-4 flex items-center justify-between gap-4 rounded-[16px] bg-zinc-50 p-3">
          <p className="text-sm font-black">수량</p>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setQuantity((value) => Math.max(1, value - 1))}
              className="grid size-9 place-items-center rounded-full bg-white shadow-soft ring-1 ring-black/5"
              aria-label="수량 줄이기"
            >
              <Minus size={16} />
            </button>
            <span className="w-8 text-center text-sm font-black">{quantity}</span>
            <button
              type="button"
              onClick={() => setQuantity((value) => Math.min(product.stock, value + 1))}
              className="grid size-9 place-items-center rounded-full bg-white shadow-soft ring-1 ring-black/5"
              aria-label="수량 늘리기"
            >
              <Plus size={16} />
            </button>
          </div>
        </div>
      </Card>

      <Card className="mt-4">
        <p className="text-sm font-black">상품 정보</p>
        <div className="mt-3 grid grid-cols-2 gap-2">
          {product.nutrition.map((item) => (
            <div key={item.label} className="rounded-[14px] bg-zinc-50 p-3">
              <p className="text-[11px] font-bold text-zinc-400">{item.label}</p>
              <p className="mt-1 text-sm font-black text-brand">{item.value}</p>
            </div>
          ))}
        </div>
        <ul className="mt-4 space-y-2">
          {product.detailPoints.map((point) => (
            <li key={point} className="flex items-start gap-2 text-sm font-semibold leading-6 text-zinc-700">
              <Check size={16} className="mt-1 shrink-0 text-blue" />
              <span>{point}</span>
            </li>
          ))}
        </ul>
      </Card>

      {product.foodInfo ? (
        <Card className="mt-4">
          <div className="flex items-center gap-2">
            <Info size={17} className="text-blue" />
            <p className="text-sm font-black">식품 표시사항</p>
          </div>
          <dl className="mt-3 space-y-2 text-sm">
            <div className="flex gap-3">
              <dt className="w-20 shrink-0 font-bold text-zinc-400">원산지</dt>
              <dd className="font-bold text-zinc-700">{product.foodInfo.origin}</dd>
            </div>
            <div className="flex gap-3">
              <dt className="w-20 shrink-0 font-bold text-zinc-400">유통기한</dt>
              <dd className="font-bold text-zinc-700">{product.foodInfo.expiry}</dd>
            </div>
            <div className="flex gap-3">
              <dt className="w-20 shrink-0 font-bold text-zinc-400">영양성분</dt>
              <dd className="font-bold text-zinc-700">{product.foodInfo.nutrition}</dd>
            </div>
          </dl>
        </Card>
      ) : null}

      <div className="mt-4">
        <BrokerageNotice product={product} vendor={vendor} />
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3">
        <Button
          variant="line"
          onClick={() => {
            onAddToCart(product, fulfillment, quantity);
            notify("장바구니에 담았어요");
          }}
        >
          장바구니
        </Button>
        <Button
          onClick={() => {
            onAddToCart(product, fulfillment, quantity);
            navigate("cart");
          }}
        >
          바로 주문
        </Button>
      </div>
    </div>
  );
}
