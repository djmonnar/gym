import assert from "node:assert/strict";
import test from "node:test";
import { sellerShippingPolicies, shopProducts } from "../data/returnpass";
import type { CartItem } from "../types";
import { addToCart, defaultFulfillment, summarizeCart, supportsFulfillment } from "./cart";

const product = (id: string) => {
  const found = shopProducts.find((item) => item.id === id);
  assert.ok(found, `상품 ${id}가 있어야 한다`);
  return found;
};

const summarize = (items: CartItem[]) => summarizeCart(items, shopProducts, sellerShippingPolicies);

test("판매자가 다르면 장바구니 그룹이 분리된다", () => {
  const summary = summarize([
    { productId: "chicken-original", quantity: 1, fulfillment: "delivery" },
    { productId: "whey-protein-2kg", quantity: 1, fulfillment: "delivery" },
    { productId: "lifting-strap", quantity: 1, fulfillment: "delivery" }
  ]);

  assert.equal(summary.groups.length, 3);
  assert.deepEqual(
    summary.groups.map((group) => group.sellerId).sort(),
    ["returnlife-hq", "vendor-fitgear", "vendor-proteinlab"]
  );
});

test("배송비는 판매자별로 각각 붙는다", () => {
  const summary = summarize([
    { productId: "chicken-original", quantity: 1, fulfillment: "delivery" },
    { productId: "lifting-strap", quantity: 1, fulfillment: "delivery" }
  ]);

  const hq = summary.groups.find((group) => group.sellerId === "returnlife-hq");
  const fitgear = summary.groups.find((group) => group.sellerId === "vendor-fitgear");

  assert.equal(hq?.shippingFee, 3000);
  assert.equal(fitgear?.shippingFee, 3500);
  assert.equal(summary.shippingTotal, 6500);
});

test("같은 판매자 상품을 여러 개 담아도 배송비는 한 번만 붙는다", () => {
  const summary = summarize([
    { productId: "chicken-original", quantity: 2, fulfillment: "delivery" },
    { productId: "chicken-garlic", quantity: 1, fulfillment: "delivery" }
  ]);

  assert.equal(summary.groups.length, 1);
  assert.equal(summary.shippingTotal, 3000);
});

test("무료배송 임계값을 넘기면 해당 판매자 배송비가 사라진다", () => {
  const belowThreshold = summarize([{ productId: "chicken-original", quantity: 1, fulfillment: "delivery" }]);
  const hqBelow = belowThreshold.groups[0];
  assert.equal(hqBelow.shippingFee, 3000);
  assert.equal(hqBelow.freeShippingGap, 30000 - 3200);

  // 3,200원 × 10 = 32,000원 → 30,000원 조건 충족
  const aboveThreshold = summarize([{ productId: "chicken-original", quantity: 10, fulfillment: "delivery" }]);
  assert.equal(aboveThreshold.groups[0].shippingFee, 0);
  assert.equal(aboveThreshold.groups[0].freeShippingGap, 0);
});

test("무료배송 조건이 없는 판매자는 남은 금액을 안내하지 않는다", () => {
  const summary = summarize([{ productId: "lifting-strap", quantity: 5, fulfillment: "delivery" }]);
  assert.equal(summary.groups[0].shippingFee, 3500);
  assert.equal(summary.groups[0].freeShippingGap, 0);
});

test("픽업 상품만 담으면 배송비가 붙지 않는다", () => {
  const summary = summarize([
    { productId: "pickup-towel-set", quantity: 1, fulfillment: "pickup" },
    { productId: "pickup-protein-shake", quantity: 2, fulfillment: "pickup" }
  ]);

  assert.equal(summary.shippingTotal, 0);
  assert.equal(summary.hasPickup, true);
  assert.equal(summary.grandTotal, 9000 + 5500 * 2);
});

test("같은 판매자에서 배송과 픽업을 섞으면 배송분에만 배송비가 붙는다", () => {
  const summary = summarize([
    { productId: "chicken-original", quantity: 1, fulfillment: "delivery" },
    { productId: "shaker-bottle", quantity: 1, fulfillment: "pickup" }
  ]);

  const hq = summary.groups[0];
  assert.equal(hq.deliverySubtotal, 3200);
  assert.equal(hq.pickupSubtotal, 12000);
  assert.equal(hq.shippingFee, 3000);
  // 픽업 금액은 무료배송 판정에 넣지 않는다
  assert.equal(hq.freeShippingGap, 30000 - 3200);
  assert.equal(hq.total, 3200 + 12000 + 3000);
});

test("픽업 전용 상품은 배송으로 담을 수 없다", () => {
  const pickupOnly = product("pickup-towel-set");
  assert.equal(supportsFulfillment(pickupOnly, "pickup"), true);
  assert.equal(supportsFulfillment(pickupOnly, "delivery"), false);
  assert.equal(defaultFulfillment(pickupOnly), "pickup");

  const deliveryOnly = product("whey-protein-2kg");
  assert.equal(supportsFulfillment(deliveryOnly, "delivery"), true);
  assert.equal(supportsFulfillment(deliveryOnly, "pickup"), false);

  const both = product("chicken-original");
  assert.equal(supportsFulfillment(both, "delivery"), true);
  assert.equal(supportsFulfillment(both, "pickup"), true);
});

test("같은 상품이라도 수령 방식이 다르면 장바구니에서 따로 담긴다", () => {
  let items: CartItem[] = [];
  items = addToCart(items, product("chicken-original"), "delivery");
  items = addToCart(items, product("chicken-original"), "pickup");
  items = addToCart(items, product("chicken-original"), "delivery");

  assert.equal(items.length, 2);
  assert.equal(items.find((item) => item.fulfillment === "delivery")?.quantity, 2);
  assert.equal(items.find((item) => item.fulfillment === "pickup")?.quantity, 1);
});

test("장바구니 합계는 상품 금액과 배송비의 합이다", () => {
  const summary = summarize([
    { productId: "chicken-original", quantity: 2, fulfillment: "delivery" },
    { productId: "whey-protein-2kg", quantity: 1, fulfillment: "delivery" },
    { productId: "pickup-towel-set", quantity: 1, fulfillment: "pickup" }
  ]);

  assert.equal(summary.itemCount, 4);
  assert.equal(summary.productSubtotal, 3200 * 2 + 59000 + 9000);
  // 본사 6,400원 → 3,000원 / 프로틴랩 59,000원 ≥ 50,000원 → 무료 / 시설 픽업 0원
  assert.equal(summary.shippingTotal, 3000);
  assert.equal(summary.grandTotal, summary.productSubtotal + summary.shippingTotal);
});
