import { Coins } from "lucide-react";
import type { PointTransaction, ScreenId } from "../../types";
import { Button, Card, ScreenHeader, cn } from "../ui";

const formatP = (value: number) => `${value.toLocaleString("ko-KR")}P`;

export function PointsHistoryScreen({
  transactions,
  navigate
}: {
  transactions: PointTransaction[];
  navigate: (screen: ScreenId) => void;
}) {
  const balance = transactions.reduce((sum, item) => sum + item.amount, 0);

  return (
    <div>
      <ScreenHeader title="리턴 포인트" eyebrow="적립·사용 내역" onBack={() => navigate("mypage")} />

      <Card className="bg-brand text-white">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-bold text-white/60">사용 가능한 포인트</p>
            <p className="mt-2 text-3xl font-black text-limeSoft">{formatP(balance)}</p>
            <p className="mt-2 text-[11px] font-bold text-white/50">주문 금액의 1%가 적립되고, 리턴샵 결제에 바로 쓸 수 있어요.</p>
          </div>
          <div className="grid size-14 shrink-0 place-items-center rounded-[18px] bg-white/10 text-limeSoft ring-1 ring-white/15">
            <Coins size={26} />
          </div>
        </div>
      </Card>

      <Card className="mt-4 p-4">
        <p className="text-sm font-black">최근 내역</p>
        <div className="mt-2 divide-y divide-black/5">
          {transactions.map((item) => (
            <div key={item.id} className="flex items-center justify-between gap-3 py-3">
              <div className="min-w-0">
                <p className="truncate text-sm font-bold text-zinc-700">{item.label}</p>
                <p className="mt-0.5 text-[11px] font-bold text-zinc-400">{item.date}</p>
              </div>
              <span className={cn("shrink-0 text-sm font-black", item.amount >= 0 ? "text-blue" : "text-zinc-500")}>
                {item.amount >= 0 ? "+" : ""}
                {formatP(item.amount)}
              </span>
            </div>
          ))}
        </div>
      </Card>

      <Button variant="line" className="mt-5 w-full" onClick={() => navigate("shop")}>
        리턴샵에서 포인트 쓰기
      </Button>
    </div>
  );
}
