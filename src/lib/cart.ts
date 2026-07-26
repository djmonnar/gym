import type { CartItem, Product, SellerShipping, SellerType } from "../types";

/**
 * 장바구니는 판매자 단위로 나뉩니다.
 * 본사·입점업체·시설이 각각 따로 발송하므로 배송비도 판매자별로 따로 붙습니다.
 * 픽업으로 담은 상품은 배송이 없으므로 배송비 계산에서 제외합니다.
 */

export type CartLine = {
  item: CartItem;
  product: Product;
  lineTotal: number;
};

export type SellerGroup = {
  sellerId: string;
  sellerName: string;
  sellerType: SellerType;
  /** 배송으로 받는 상품 */
  deliveryLines: CartLine[];
  /** 시설에서 픽업하는 상품 */
  pickupLines: CartLine[];
  /** 배송 상품 금액 합계 */
  deliverySubtotal: number;
  /** 픽업 상품 금액 합계 */
  pickupSubtotal: number;
  subtotal: number;
  shippingFee: number;
  /** 무료배송까지 남은 금액. 조건이 없거나 이미 충족했으면 0 */
  freeShippingGap: number;
  total: number;
};

export type CartSummary = {
  groups: SellerGroup[];
  itemCount: number;
  productSubtotal: number;
  shippingTotal: number;
  grandTotal: number;
  hasPickup: boolean;
};

const DEFAULT_SHIPPING: Omit<SellerShipping, "sellerId" | "sellerName" | "sellerType"> = {
  shippingFee: 3000,
  freeShippingOver: null
};

export const findProduct = (products: Product[], productId: string) =>
  products.find((product) => product.id === productId);

/**
 * 상품이 지원하는 수령 방식인지 확인합니다.
 * `both`는 배송·픽업 모두, 그 외에는 지정된 방식만 허용합니다.
 */
export const supportsFulfillment = (product: Product, fulfillment: CartItem["fulfillment"]) =>
  product.fulfillment === "both" || product.fulfillment === fulfillment;

/** 상품의 기본 수령 방식. 픽업 전용 상품은 픽업으로 시작합니다. */
export const defaultFulfillment = (product: Product): CartItem["fulfillment"] =>
  product.fulfillment === "pickup" ? "pickup" : "delivery";

export const addToCart = (items: CartItem[], product: Product, fulfillment?: CartItem["fulfillment"]): CartItem[] => {
  const mode = fulfillment ?? defaultFulfillment(product);
  const existing = items.find((item) => item.productId === product.id && item.fulfillment === mode);

  if (existing) {
    return items.map((item) =>
      item.productId === product.id && item.fulfillment === mode ? { ...item, quantity: item.quantity + 1 } : item
    );
  }

  return [...items, { productId: product.id, quantity: 1, fulfillment: mode }];
};

export const setQuantity = (
  items: CartItem[],
  productId: string,
  fulfillment: CartItem["fulfillment"],
  quantity: number
): CartItem[] => {
  if (quantity <= 0) {
    return items.filter((item) => !(item.productId === productId && item.fulfillment === fulfillment));
  }

  return items.map((item) =>
    item.productId === productId && item.fulfillment === fulfillment ? { ...item, quantity } : item
  );
};

export const removeFromCart = (items: CartItem[], productId: string, fulfillment: CartItem["fulfillment"]): CartItem[] =>
  items.filter((item) => !(item.productId === productId && item.fulfillment === fulfillment));

export const countCartItems = (items: CartItem[]) => items.reduce((sum, item) => sum + item.quantity, 0);

/**
 * 장바구니를 판매자별로 묶고 배송비를 각각 계산합니다.
 * 배송 상품이 없는 판매자(전부 픽업)에는 배송비를 매기지 않습니다.
 */
export const summarizeCart = (
  items: CartItem[],
  products: Product[],
  policies: SellerShipping[]
): CartSummary => {
  const groupMap = new Map<string, SellerGroup>();

  for (const item of items) {
    const product = findProduct(products, item.productId);
    if (!product) continue;

    const line: CartLine = { item, product, lineTotal: product.price * item.quantity };

    let group = groupMap.get(product.sellerId);
    if (!group) {
      const policy = policies.find((candidate) => candidate.sellerId === product.sellerId);
      group = {
        sellerId: product.sellerId,
        sellerName: product.sellerName,
        sellerType: product.sellerType,
        deliveryLines: [],
        pickupLines: [],
        deliverySubtotal: 0,
        pickupSubtotal: 0,
        subtotal: 0,
        shippingFee: policy?.shippingFee ?? DEFAULT_SHIPPING.shippingFee,
        freeShippingGap: 0,
        total: 0
      };
      groupMap.set(product.sellerId, group);
    }

    if (item.fulfillment === "pickup") {
      group.pickupLines.push(line);
      group.pickupSubtotal += line.lineTotal;
    } else {
      group.deliveryLines.push(line);
      group.deliverySubtotal += line.lineTotal;
    }
  }

  const groups = [...groupMap.values()].map((group) => {
    const policy = policies.find((candidate) => candidate.sellerId === group.sellerId);
    const baseFee = policy?.shippingFee ?? DEFAULT_SHIPPING.shippingFee;
    const threshold = policy?.freeShippingOver ?? null;

    // 배송 상품이 없으면 배송비를 받지 않습니다.
    const hasDelivery = group.deliveryLines.length > 0;
    const qualifiesFree = threshold !== null && group.deliverySubtotal >= threshold;
    const shippingFee = hasDelivery && !qualifiesFree ? baseFee : 0;
    const freeShippingGap = hasDelivery && threshold !== null && !qualifiesFree ? threshold - group.deliverySubtotal : 0;
    const subtotal = group.deliverySubtotal + group.pickupSubtotal;

    return {
      ...group,
      subtotal,
      shippingFee,
      freeShippingGap,
      total: subtotal + shippingFee
    };
  });

  const productSubtotal = groups.reduce((sum, group) => sum + group.subtotal, 0);
  const shippingTotal = groups.reduce((sum, group) => sum + group.shippingFee, 0);

  return {
    groups,
    itemCount: countCartItems(items),
    productSubtotal,
    shippingTotal,
    grandTotal: productSubtotal + shippingTotal,
    hasPickup: groups.some((group) => group.pickupLines.length > 0)
  };
};
