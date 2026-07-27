import { PackageCheck, Store, Truck } from "lucide-react";
import type { OrderRecord, ScreenId } from "../../types";
import { Badge, Button, Card, ScreenHeader } from "../ui";

const formatWon = (value: number) => `${value.toLocaleString("ko-KR")}원`;

const statusTone: Record<OrderRecord["status"], "lime" | "blue" | "green" | "gray"> = {
  "결제 완료": "blue",
  "배송 준비": "blue",
  "배송 중": "lime",
  "배송 완료": "green",
  "픽업 대기": "lime",
  "수령 완료": "green"
};

const fulfillmentMeta = {
  delivery: { icon: Truck, label: "택배 배송" },
  pickup: { icon: Store, label: "시설 픽업" },
  mixed: { icon: PackageCheck, label: "배송 · 픽업" }
} as const;

export function OrderHistoryScreen({
  orders,
  navigate
}: {
  orders: OrderRecord[];
  navigate: (screen: ScreenId) => void;
}) {
  if (!orders.length) {
    return (
      <div>
        <ScreenHeader title="주문 내역" eyebrow="리턴샵" onBack={() => navigate("mypage")} />
        <Card className="py-14 text-center">
          <PackageCheck size={34} className="mx-auto text-zinc-300" />
          <p className="mt-4 text-sm font-black text-brand">아직 주문 내역이 없어요</p>
          <Button className="mt-5 w-full" onClick={() => navigate("shop")}>
            리턴샵 둘러보기
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div>
      <ScreenHeader title="주문 내역" eyebrow={`총 ${orders.length}건`} onBack={() => navigate("mypage")} />

      <div className="space-y-4">
        {orders.map((order) => {
          const meta = fulfillmentMeta[order.fulfillment];
          const Icon = meta.icon;
          return (
            <Card key={order.id} className="p-4">
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-xs font-bold text-zinc-400">{order.orderedAt}</p>
                  <p className="truncate text-xs font-bold text-zinc-500">{order.id}</p>
                </div>
                <Badge tone={statusTone[order.status]}>{order.status}</Badge>
              </div>

              <div className="mt-3 space-y-1.5 border-t border-black/5 pt-3">
                {order.lines.map((line) => (
                  <div key={line.name} className="flex items-center justify-between gap-3 text-sm">
                    <span className="min-w-0 flex-1 truncate font-bold text-zinc-700">
                      {line.name} <span className="text-zinc-400">× {line.quantity}</span>
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-3 flex items-center justify-between border-t border-black/5 pt-3">
                <span className="flex items-center gap-1.5 text-xs font-bold text-blue">
                  <Icon size={14} />
                  {meta.label}
                </span>
                <span className="text-base font-black text-brand">{formatWon(order.total)}</span>
              </div>
            </Card>
          );
        })}
      </div>

      <Button variant="line" className="mt-5 w-full" onClick={() => navigate("shop")}>
        리턴샵 더 둘러보기
      </Button>
    </div>
  );
}
