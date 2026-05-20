import { useMemo, useState, type ReactNode } from "react";
import {
  AlertCircle,
  Bell,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronRight,
  CircleDollarSign,
  Clock,
  CreditCard,
  Headphones,
  History,
  LocateFixed,
  Map,
  Minus,
  MessageCircle,
  PackageCheck,
  Phone,
  Plus,
  QrCode,
  ReceiptText,
  ScanLine,
  Search,
  Settings,
  ShieldCheck,
  ShoppingBag,
  ShoppingCart,
  SlidersHorizontal,
  Star,
  Truck,
  UserRound,
  UsersRound,
  X
} from "lucide-react";
import { adminMembers, entryLogs, filters, gyms, paymentRecords, plans, shopProducts } from "./data/gympass";
import type { AdminMember, Gym, MemberStatus, PaymentRecord, Plan, ScreenId, ShopProduct } from "./types";
import { AppShell, Badge, Button, Card, Checklist, InfoRow, MapPlaceholder, ScreenHeader, Stat, cn } from "./components/ui";

const formatWon = (value: number) => `${value.toLocaleString("ko-KR")}원`;

export default function App() {
  const [screen, setScreen] = useState<ScreenId>("splash");
  const [selectedGym, setSelectedGym] = useState<Gym>(gyms[0]);
  const [selectedPlan, setSelectedPlan] = useState<Plan>(plans[0]);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState<string[]>(["24시", "주차 가능"]);
  const [viewMode, setViewMode] = useState<"list" | "map">("list");
  const [toast, setToast] = useState("");
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [adminStatus, setAdminStatus] = useState<MemberStatus>("이용중");
  const [qrResult, setQrResult] = useState<MemberStatus>("이용중");
  const [selectedProduct, setSelectedProduct] = useState<ShopProduct>(shopProducts[0]);
  const [cartQuantity, setCartQuantity] = useState(1);

  const showTabs = !["splash", "onboarding", "login", "location", "complete"].includes(screen);
  const appMode = screen.toString().startsWith("admin") ? "admin" : "customer";

  const navigate = (next: ScreenId) => setScreen(next);
  const selectGym = (gym: Gym) => {
    setSelectedGym(gym);
    navigate("detail");
  };
  const selectProduct = (product: ShopProduct) => {
    setSelectedProduct(product);
    navigate("shopDetail");
  };
  const notify = (message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(""), 2200);
  };

  const filteredGyms = useMemo(() => {
    if (!selectedFilters.length) return gyms;
    return gyms.filter((gym) => selectedFilters.some((filter) => gym.tags.includes(filter) || gym.hours.includes(filter)));
  }, [selectedFilters]);

  const screenNode = (() => {
    switch (screen) {
      case "splash":
        return <SplashScreen navigate={navigate} />;
      case "onboarding":
        return <OnboardingScreen navigate={navigate} />;
      case "login":
        return <LoginScreen navigate={navigate} />;
      case "location":
        return <LocationScreen navigate={navigate} />;
      case "home":
        return <HomeScreen navigate={navigate} selectGym={selectGym} />;
      case "search":
        return (
          <SearchScreen
            filters={selectedFilters}
            setFilters={setSelectedFilters}
            viewMode={viewMode}
            setViewMode={setViewMode}
            gyms={filteredGyms}
            selectGym={selectGym}
          />
        );
      case "detail":
        return <DetailScreen gym={selectedGym} navigate={navigate} />;
      case "plans":
        return <PlanScreen selectedPlan={selectedPlan} setSelectedPlan={setSelectedPlan} navigate={navigate} />;
      case "checkout":
        return (
          <CheckoutScreen
            gym={selectedGym}
            plan={selectedPlan}
            acceptedTerms={acceptedTerms}
            setAcceptedTerms={setAcceptedTerms}
            navigate={navigate}
            notify={notify}
          />
        );
      case "complete":
        return <CompleteScreen gym={selectedGym} navigate={navigate} />;
      case "pass":
        return <PassScreen gym={selectedGym} plan={selectedPlan} navigate={navigate} />;
      case "subscription":
        return <SubscriptionScreen plan={selectedPlan} openCancel={() => setShowCancelModal(true)} notify={notify} />;
      case "history":
        return <HistoryScreen navigate={navigate} />;
      case "support":
        return <SupportScreen />;
      case "my":
        return <MyPage navigate={navigate} selectedGym={selectedGym} selectedPlan={selectedPlan} notify={notify} />;
      case "shop":
        return <ShopScreen product={shopProducts[0]} navigate={navigate} selectProduct={selectProduct} cartQuantity={cartQuantity} />;
      case "shopDetail":
        return (
          <ShopDetailScreen
            product={selectedProduct}
            quantity={cartQuantity}
            setQuantity={setCartQuantity}
            navigate={navigate}
            notify={notify}
          />
        );
      case "cart":
        return (
          <CartScreen
            product={selectedProduct}
            quantity={cartQuantity}
            setQuantity={setCartQuantity}
            navigate={navigate}
            notify={notify}
          />
        );
      case "shopComplete":
        return <ShopCompleteScreen product={selectedProduct} quantity={cartQuantity} navigate={navigate} />;
      case "adminHome":
        return <AdminHome navigate={navigate} />;
      case "adminMembers":
        return <AdminMembers status={adminStatus} setStatus={setAdminStatus} />;
      case "adminQr":
        return <AdminQr result={qrResult} setResult={setQrResult} notify={notify} />;
      default:
        return null;
    }
  })();

  return (
    <AppShell active={screen} navigate={navigate} showTabs={showTabs} appMode={appMode}>
      {screenNode}
      {toast ? <Toast message={toast} /> : null}
      {showCancelModal ? <CancelModal onClose={() => setShowCancelModal(false)} notify={notify} /> : null}
    </AppShell>
  );
}

function SplashScreen({ navigate }: { navigate: (screen: ScreenId) => void }) {
  return (
    <div className="flex min-h-[640px] flex-col justify-between py-6">
      <div className="flex items-center justify-between">
        <Badge tone="lime">월구독 헬스장</Badge>
        <span className="text-xs font-bold text-gray-400">Prototype</span>
      </div>
      <div className="space-y-6">
        <img src="brand/gympass-icon.svg" alt="짐패스 로고" className="size-24 rounded-[28px] shadow-lift" />
        <div>
          <h1 className="text-5xl font-black leading-tight text-brand">짐패스</h1>
          <p className="mt-3 text-xl font-extrabold text-gray-700">헬스장, 이제 한 달씩 가볍게</p>
          <p className="mt-4 text-sm font-semibold leading-6 text-gray-500">
            1년권 부담 없이 내 주변 헬스장을 월 단위로 구독하고, 결제와 해지를 앱에서 투명하게 확인하세요.
          </p>
        </div>
      </div>
      <Button variant="dark" className="w-full" onClick={() => navigate("onboarding")}>
        시작하기
      </Button>
    </div>
  );
}

function OnboardingScreen({ navigate }: { navigate: (screen: ScreenId) => void }) {
  const points = [
    ["한 달씩", "오래 묶이지 않고 필요한 만큼만 이용"],
    ["바로 입장", "결제 후 QR 이용권으로 즉시 체크인"],
    ["투명한 관리", "결제 내역, 해지, 환불 안내를 한곳에서 확인"]
  ];

  return (
    <div className="space-y-6">
      <ScreenHeader title="운동 루틴을 더 가볍게 시작하세요" eyebrow="짐패스가 바꾸는 구독 경험" />
      <div className="overflow-hidden rounded-[30px] bg-brand p-5 text-white shadow-lift">
        <img src="images/gym-muscle-factory.png" alt="프리미엄 헬스장 내부" className="h-56 w-full rounded-[24px] object-cover" />
        <div className="mt-5">
          <Badge tone="lime">오늘 결제하면 바로 이용 가능</Badge>
          <h2 className="mt-3 text-2xl font-black">1년권 대신 한 달 구독</h2>
          <p className="mt-2 text-sm font-semibold leading-6 text-white/70">지역 헬스장을 비교하고, 원하는 구독권만 선택하세요.</p>
        </div>
      </div>
      <div className="space-y-3">
        {points.map(([title, body]) => (
          <Card key={title} className="flex items-center gap-4 p-4">
            <div className="grid size-10 place-items-center rounded-2xl bg-lime text-brand">
              <Check size={20} />
            </div>
            <div>
              <p className="font-black">{title}</p>
              <p className="text-sm font-semibold text-gray-500">{body}</p>
            </div>
          </Card>
        ))}
      </div>
      <Button className="w-full" onClick={() => navigate("login")}>
        다음
      </Button>
    </div>
  );
}

function LoginScreen({ navigate }: { navigate: (screen: ScreenId) => void }) {
  return (
    <div className="space-y-6">
      <ScreenHeader title="효승님 맞춤 헬스장을 찾아볼게요" eyebrow="로그인" />
      <Card className="space-y-4">
        <InfoRow label="휴대폰 번호" value="010 2345 9182" icon={<Phone size={17} />} />
        <InfoRow label="인증 상태" value="간편 인증 준비 완료" icon={<ShieldCheck size={17} />} />
        <Button variant="dark" className="w-full" onClick={() => navigate("location")}>
          3초 로그인 계속하기
        </Button>
        <button type="button" className="w-full text-center text-sm font-bold text-gray-500">
          사장님 계정으로 들어가기
        </button>
      </Card>
      <Card className="bg-blue text-white">
        <p className="text-sm font-bold text-white/75">로그인 후 가능한 기능</p>
        <p className="mt-2 text-xl font-black">QR 이용권, 결제 내역, 환불 문의까지 한 번에 관리</p>
      </Card>
    </div>
  );
}

function LocationScreen({ navigate }: { navigate: (screen: ScreenId) => void }) {
  return (
    <div className="flex min-h-[640px] flex-col justify-between">
      <div className="space-y-6">
        <ScreenHeader title="내 주변 헬스장을 빠르게 보여드릴게요" eyebrow="위치 권한 안내" />
        <Card className="space-y-5">
          <div className="grid h-56 place-items-center rounded-[26px] bg-[linear-gradient(135deg,#111827,#2563EB)] text-white">
            <div className="grid size-24 place-items-center rounded-full bg-white/15">
              <LocateFixed size={42} />
            </div>
          </div>
          <p className="text-sm font-semibold leading-6 text-gray-600">
            현재 위치는 헬스장 거리 계산과 주변 추천에만 사용됩니다. 결제나 구독 정보와는 별도로 안전하게 관리됩니다.
          </p>
          <InfoRow label="예상 위치" value="진주 가좌동" icon={<Map size={17} />} />
        </Card>
      </div>
      <div className="space-y-3">
        <Button className="w-full" onClick={() => navigate("home")}>
          위치 사용하고 시작하기
        </Button>
        <Button variant="ghost" className="w-full" onClick={() => navigate("home")}>
          나중에 설정하기
        </Button>
      </div>
    </div>
  );
}

function HomeScreen({ navigate, selectGym }: { navigate: (screen: ScreenId) => void; selectGym: (gym: Gym) => void }) {
  return (
    <div className="space-y-6">
      <header className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-bold text-blue">현재 위치 · 진주 가좌동</p>
          <h1 className="mt-1 text-[28px] font-black leading-tight">효승님, 오늘 운동 갈까요?</h1>
        </div>
        <button className="grid size-11 place-items-center rounded-full bg-white shadow-soft" type="button" aria-label="알림">
          <Bell size={20} />
        </button>
      </header>
      <section className="overflow-hidden rounded-[30px] bg-brand text-white shadow-lift">
        <div className="p-6">
          <Badge tone="lime">월 단위 자유 구독</Badge>
          <h2 className="mt-4 text-3xl font-black leading-tight">1년권 부담 없이, 한 달씩 구독</h2>
          <p className="mt-3 text-sm font-semibold leading-6 text-white/70">주변 헬스장 가격과 조건을 비교하고 오늘 바로 QR로 입장하세요.</p>
          <Button className="mt-5" onClick={() => navigate("search")}>
            내 주변 헬스장 보기
          </Button>
        </div>
        <img src="images/gym-fitness-lounge.png" alt="헬스장 추천 이미지" className="h-44 w-full object-cover" />
      </section>
      <button type="button" onClick={() => navigate("shop")} className="block w-full text-left">
        <Card className="overflow-hidden bg-white p-0">
          <div className="grid grid-cols-[1fr_128px] items-stretch">
            <div className="p-5">
              <Badge tone="blue">GYMSHOP</Badge>
              <h2 className="mt-3 text-2xl font-black leading-tight">운동 끝나고 바로 단백질 채우기</h2>
              <p className="mt-2 text-sm font-semibold leading-6 text-gray-500">구독 회원 전용 닭가슴살 특가와 장바구니 구매 흐름을 확인하세요.</p>
              <div className="mt-4 inline-flex items-center gap-2 text-sm font-black text-brand">
                상품 보러가기 <ChevronRight size={16} />
              </div>
            </div>
            <div className="relative bg-lime">
              <img src="images/gymshop-chicken-breast.png" alt="GYMSHOP 닭가슴살 상품" className="h-full min-h-44 w-full object-cover mix-blend-multiply" />
            </div>
          </div>
        </Card>
      </button>
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-black">추천 헬스장</h2>
        <button type="button" onClick={() => navigate("search")} className="text-sm font-black text-blue">
          전체 보기
        </button>
      </div>
      <div className="space-y-4">
        {gyms.map((gym) => (
          <GymCard key={gym.id} gym={gym} onClick={() => selectGym(gym)} />
        ))}
      </div>
    </div>
  );
}

function SearchScreen({
  filters: activeFilters,
  setFilters,
  viewMode,
  setViewMode,
  gyms: visibleGyms,
  selectGym
}: {
  filters: string[];
  setFilters: (filters: string[]) => void;
  viewMode: "list" | "map";
  setViewMode: (mode: "list" | "map") => void;
  gyms: Gym[];
  selectGym: (gym: Gym) => void;
}) {
  const toggleFilter = (filter: string) => {
    setFilters(activeFilters.includes(filter) ? activeFilters.filter((item) => item !== filter) : [...activeFilters, filter]);
  };

  return (
    <div className="space-y-5">
      <ScreenHeader
        title="헬스장 검색"
        eyebrow="진주 가좌동 주변"
        action={
          <button className="grid size-11 place-items-center rounded-full bg-white shadow-soft" type="button" aria-label="상세 필터">
            <SlidersHorizontal size={20} />
          </button>
        }
      />
      <div className="flex items-center gap-3 rounded-[22px] bg-white px-4 py-3 shadow-soft">
        <Search size={20} className="text-gray-400" />
        <input className="min-w-0 flex-1 bg-transparent text-sm font-bold outline-none placeholder:text-gray-400" placeholder="헬스장명, 지역, 시설 검색" />
      </div>
      <div className="flex gap-2 overflow-x-auto pb-1">
        {filters.map((filter) => {
          const active = activeFilters.includes(filter);
          return (
            <button
              key={filter}
              type="button"
              onClick={() => toggleFilter(filter)}
              className={cn(
                "shrink-0 rounded-full border px-4 py-2 text-sm font-bold transition",
                active ? "border-brand bg-brand text-lime" : "border-gray-200 bg-white text-gray-600"
              )}
            >
              {filter}
            </button>
          );
        })}
      </div>
      <div className="grid grid-cols-2 rounded-[20px] bg-white p-1 shadow-soft">
        {(["list", "map"] as const).map((mode) => (
          <button
            key={mode}
            type="button"
            onClick={() => setViewMode(mode)}
            className={cn("rounded-[16px] py-3 text-sm font-black", viewMode === mode ? "bg-lime text-brand" : "text-gray-500")}
          >
            {mode === "list" ? "리스트 보기" : "지도 보기"}
          </button>
        ))}
      </div>
      {viewMode === "map" ? <MapPlaceholder /> : null}
      <div className="space-y-4">
        {visibleGyms.map((gym) => (
          <GymCard key={gym.id} gym={gym} onClick={() => selectGym(gym)} compact />
        ))}
      </div>
    </div>
  );
}

function DetailScreen({ gym, navigate }: { gym: Gym; navigate: (screen: ScreenId) => void }) {
  return (
    <div className="space-y-5">
      <ScreenHeader title={gym.name} eyebrow="헬스장 상세" onBack={() => navigate("home")} />
      <section className="overflow-hidden rounded-[30px] bg-white shadow-soft">
        <img src={gym.image} alt={`${gym.name} 이미지`} className="h-64 w-full object-cover" />
        <div className="p-5">
          <div className="flex flex-wrap gap-2">
            <Badge tone="lime">오늘 결제하면 바로 이용 가능</Badge>
            <Badge tone="blue">평점 {gym.rating}</Badge>
          </div>
          <h2 className="mt-4 text-3xl font-black">{formatWon(gym.monthlyPrice)} / 월</h2>
          <p className="mt-2 text-sm font-semibold text-gray-500">
            {gym.location} · {gym.distance}
          </p>
        </div>
      </section>
      <Card>
        <h3 className="mb-4 text-lg font-black">시설 정보</h3>
        <div className="space-y-3">
          <InfoRow label="운영시간" value={gym.hours} icon={<Clock size={17} />} />
          <InfoRow label="주차" value={gym.tags.includes("주차 가능") ? "가능" : "매장 문의"} />
          <InfoRow label="샤워실" value={gym.facilities.includes("샤워실") ? "제공" : "제공 여부 확인"} />
          <InfoRow label="락커" value={gym.facilities.includes("개인 락커") ? "개인 락커" : "공용 락커"} />
        </div>
      </Card>
      <Card>
        <h3 className="mb-4 text-lg font-black">포함 시설</h3>
        <Checklist items={gym.facilities} />
      </Card>
      <Card>
        <h3 className="mb-4 text-lg font-black">트레이너 소개</h3>
        <div className="space-y-3">
          {gym.trainers.map((trainer) => (
            <div key={trainer} className="flex items-center gap-3 rounded-[18px] bg-gray-50 p-3">
              <div className="grid size-10 place-items-center rounded-full bg-blue/10 text-blue">
                <UserRound size={19} />
              </div>
              <p className="text-sm font-bold text-gray-700">{trainer}</p>
            </div>
          ))}
        </div>
      </Card>
      <Card>
        <h3 className="mb-4 text-lg font-black">위치</h3>
        <MapPlaceholder />
      </Card>
      <div className="sticky bottom-2 z-10 rounded-[24px] bg-white/90 p-2 shadow-lift backdrop-blur">
        <Button className="w-full" onClick={() => navigate("plans")}>
          월 구독 시작하기
        </Button>
      </div>
    </div>
  );
}

function PlanScreen({
  selectedPlan,
  setSelectedPlan,
  navigate
}: {
  selectedPlan: Plan;
  setSelectedPlan: (plan: Plan) => void;
  navigate: (screen: ScreenId) => void;
}) {
  return (
    <div className="space-y-5">
      <ScreenHeader title="구독권 선택" eyebrow="원하는 만큼만 결제" onBack={() => navigate("detail")} />
      {plans.map((plan) => {
        const selected = selectedPlan.id === plan.id;
        return (
          <button key={plan.id} type="button" onClick={() => setSelectedPlan(plan)} className="block w-full text-left">
            <Card className={cn("border-2 transition", selected ? "border-lime shadow-lift" : "border-transparent")}>
              <div className="mb-4 flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-black">{plan.name}</h2>
                    {plan.recommended ? <Badge tone="blue">추천</Badge> : null}
                  </div>
                  <p className="mt-1 text-sm font-semibold text-gray-500">{plan.description}</p>
                </div>
                <div className={cn("grid size-9 place-items-center rounded-full", selected ? "bg-lime text-brand" : "bg-gray-100 text-gray-400")}>
                  <Check size={19} />
                </div>
              </div>
              <p className="mb-4 text-3xl font-black">{formatWon(plan.price)}</p>
              <Checklist items={plan.benefits} />
            </Card>
          </button>
        );
      })}
      <Button className="w-full" onClick={() => navigate("checkout")}>
        선택한 구독권 결제하기
      </Button>
    </div>
  );
}

function CheckoutScreen({
  gym,
  plan,
  acceptedTerms,
  setAcceptedTerms,
  navigate,
  notify
}: {
  gym: Gym;
  plan: Plan;
  acceptedTerms: boolean;
  setAcceptedTerms: (value: boolean) => void;
  navigate: (screen: ScreenId) => void;
  notify: (message: string) => void;
}) {
  const pay = () => {
    if (!acceptedTerms) {
      notify("약관 동의가 필요합니다.");
      return;
    }
    navigate("complete");
  };

  return (
    <div className="space-y-5">
      <ScreenHeader title="결제 확인" eyebrow="실제 결제는 진행되지 않습니다" onBack={() => navigate("plans")} />
      <Card className="space-y-3">
        <InfoRow label="선택한 헬스장" value={gym.name} />
        <InfoRow label="선택한 구독권" value={plan.name} />
        <InfoRow label="결제 금액" value={formatWon(plan.price)} icon={<CircleDollarSign size={17} />} />
        <InfoRow label="다음 결제 예정일" value="2026.06.20" icon={<CalendarDays size={17} />} />
      </Card>
      <Card>
        <h2 className="mb-3 text-lg font-black">환불/해지 안내</h2>
        <p className="text-sm font-semibold leading-6 text-gray-600">
          구독 해지는 다음 결제일부터 적용되며, 이미 결제된 이용권은 현재 이용 종료일까지 사용할 수 있습니다. 환불 가능 여부는 이용 시작일과 입장 기록에 따라 앱에서 확인됩니다.
        </p>
      </Card>
      <Card className="space-y-4">
        <div className="flex items-center justify-between rounded-[20px] bg-gray-50 p-4">
          <div className="flex items-center gap-3">
            <CreditCard size={22} className="text-blue" />
            <div>
              <p className="font-black">카드 등록</p>
              <p className="text-xs font-bold text-gray-500">현대카드 1842 · 더미 결제 수단</p>
            </div>
          </div>
          <ChevronRight size={18} className="text-gray-400" />
        </div>
        <label className="flex cursor-pointer items-start gap-3 rounded-[20px] border border-gray-200 p-4">
          <input checked={acceptedTerms} onChange={(event) => setAcceptedTerms(event.target.checked)} type="checkbox" className="mt-1 size-5 accent-[#111827]" />
          <span className="text-sm font-bold leading-6 text-gray-700">정기결제, 환불 규정, 개인정보 처리 안내를 확인했습니다.</span>
        </label>
      </Card>
      <Button className="w-full" onClick={pay}>
        {formatWon(plan.price)} 결제하기
      </Button>
    </div>
  );
}

function CompleteScreen({ gym, navigate }: { gym: Gym; navigate: (screen: ScreenId) => void }) {
  return (
    <div className="flex min-h-[640px] flex-col items-center justify-center text-center">
      <div className="grid size-28 place-items-center rounded-full bg-lime text-brand shadow-lift">
        <CheckCircle2 size={58} strokeWidth={2.4} />
      </div>
      <h1 className="mt-7 text-3xl font-black">구독권이 발급되었습니다</h1>
      <p className="mt-3 text-sm font-semibold leading-6 text-gray-500">이제 QR 이용권을 직원에게 보여주고 바로 입장할 수 있어요.</p>
      <Card className="mt-8 w-full space-y-3 text-left">
        <InfoRow label="헬스장명" value={gym.name} />
        <InfoRow label="이용 시작일" value="2026.05.20" />
        <InfoRow label="이용 종료일" value="2026.06.19" />
      </Card>
      <Button className="mt-8 w-full" onClick={() => navigate("pass")}>
        내 이용권 확인하기
      </Button>
    </div>
  );
}

function PassScreen({ gym, plan, navigate }: { gym: Gym; plan: Plan; navigate: (screen: ScreenId) => void }) {
  return (
    <div className="space-y-5">
      <ScreenHeader title="내 이용권" eyebrow="현재 이용 중" />
      <Card className="overflow-hidden p-0">
        <img src={gym.image} alt={`${gym.name} 이용권`} className="h-36 w-full object-cover" />
        <div className="p-5">
          <Badge tone="green">이용중</Badge>
          <h2 className="mt-3 text-2xl font-black">{gym.name}</h2>
          <p className="mt-1 text-sm font-bold text-gray-500">{plan.name} · 2026.06.19까지</p>
        </div>
      </Card>
      <Card className="text-center">
        <div className="mx-auto grid size-52 place-items-center rounded-[26px] border-8 border-white bg-white shadow-inner">
          <div className="qr-pattern grid size-44 place-items-center rounded-[18px]">
            <QrCode size={84} className="text-brand" />
          </div>
        </div>
        <p className="mt-5 text-sm font-bold text-gray-600">헬스장 직원에게 이 QR 이용권을 보여주세요.</p>
      </Card>
      <Card className="grid grid-cols-2 gap-3">
        <InfoMini label="남은 이용 기간" value="30일" />
        <InfoMini label="이용 가능 지점" value="경상대점" />
      </Card>
      <div className="grid grid-cols-2 gap-3">
        <Button variant="line" onClick={() => navigate("subscription")}>
          구독 관리
        </Button>
        <Button variant="dark" onClick={() => navigate("history")}>
          결제 내역
        </Button>
      </div>
    </div>
  );
}

function SubscriptionScreen({ plan, openCancel, notify }: { plan: Plan; openCancel: () => void; notify: (message: string) => void }) {
  return (
    <div className="space-y-5">
      <ScreenHeader title="구독 관리" eyebrow="결제와 해지를 투명하게" />
      <Card className="bg-brand text-white">
        <div className="flex items-center justify-between">
          <Badge tone="lime">이용중</Badge>
          <p className="text-xs font-bold text-white/60">회원번호 M-1042</p>
        </div>
        <h2 className="mt-5 text-2xl font-black">{plan.name}</h2>
        <p className="mt-2 text-sm font-semibold text-white/70">해지해도 현재 이용 기간까지 사용 가능</p>
      </Card>
      <Card className="space-y-3">
        <InfoRow label="다음 결제일" value="2026.06.20" icon={<CalendarDays size={17} />} />
        <InfoRow label="결제 예정 금액" value={formatWon(plan.price)} />
        <InfoRow label="결제 수단" value="현대카드 1842" icon={<CreditCard size={17} />} />
      </Card>
      <div className="grid grid-cols-1 gap-3">
        <Button variant="line" onClick={() => notify("결제수단 변경 UI가 열렸습니다.")}>
          결제수단 변경
        </Button>
        <Button variant="danger" onClick={openCancel}>
          구독 해지 예약
        </Button>
      </div>
    </div>
  );
}

function HistoryScreen({ navigate }: { navigate: (screen: ScreenId) => void }) {
  return (
    <div className="space-y-5">
      <ScreenHeader title="결제 내역" eyebrow="구독 결제를 쉽게 확인" />
      <Card className="bg-blue text-white">
        <p className="text-sm font-bold text-white/75">이번 달 결제</p>
        <p className="mt-2 text-3xl font-black">39,000원</p>
        <p className="mt-2 text-sm font-semibold text-white/70">영수증, 환불 상태, 실패 내역까지 날짜별로 정리됩니다.</p>
      </Card>
      <div className="space-y-3">
        {paymentRecords.map((record) => (
          <PaymentItem key={record.id} record={record} navigate={navigate} />
        ))}
      </div>
    </div>
  );
}

function SupportScreen() {
  const faqs = ["구독 해지는 언제 적용되나요?", "입장 기록이 있으면 환불이 가능한가요?", "카드 결제 실패 시 이용권은 어떻게 되나요?"];

  return (
    <div className="space-y-5">
      <ScreenHeader title="고객센터/환불 안내" eyebrow="구독과 결제를 투명하게" />
      <Card className="bg-brand text-white">
        <Headphones size={30} className="text-lime" />
        <h2 className="mt-4 text-2xl font-black">구독/결제/환불은 앱에서 투명하게 확인할 수 있습니다</h2>
        <p className="mt-2 text-sm font-semibold leading-6 text-white/70">문의 전 결제 내역과 구독 상태를 먼저 확인하면 더 빠르게 처리됩니다.</p>
      </Card>
      <div className="space-y-3">
        {faqs.map((faq) => (
          <Card key={faq} className="flex items-center justify-between p-4">
            <p className="text-sm font-black">{faq}</p>
            <ChevronRight size={18} className="text-gray-400" />
          </Card>
        ))}
      </div>
      <Card>
        <h2 className="mb-3 text-lg font-black">환불 규정 안내</h2>
        <p className="text-sm font-semibold leading-6 text-gray-600">
          이용 시작 전에는 전액 환불을 요청할 수 있습니다. 이용권 발급 후 입장 기록이 있거나 기간이 경과한 경우에는 남은 기간과 매장 정책을 기준으로 환불 가능 금액을 안내합니다.
        </p>
      </Card>
      <div className="grid grid-cols-2 gap-3">
        <Button variant="line">
          <MessageCircle size={18} />
          카카오톡 문의
        </Button>
        <Button variant="dark">
          <Phone size={18} />
          전화 문의
        </Button>
      </div>
    </div>
  );
}

function MyPage({
  navigate,
  selectedGym,
  selectedPlan,
  notify
}: {
  navigate: (screen: ScreenId) => void;
  selectedGym: Gym;
  selectedPlan: Plan;
  notify: (message: string) => void;
}) {
  return (
    <div className="space-y-5">
      <ScreenHeader title="마이페이지" eyebrow="계정과 구독 관리" />
      <Card className="flex items-center gap-4">
        <div className="grid size-16 place-items-center rounded-[22px] bg-lime text-brand">
          <UserRound size={30} />
        </div>
        <div>
          <h2 className="text-xl font-black">김효승</h2>
          <p className="text-sm font-bold text-gray-500">진주 가좌동 · 일반 회원</p>
        </div>
      </Card>
      <Card>
        <div className="flex items-start justify-between gap-4">
          <div>
            <Badge tone="green">현재 구독</Badge>
            <h2 className="mt-3 text-xl font-black">{selectedGym.name}</h2>
            <p className="mt-1 text-sm font-bold text-gray-500">{selectedPlan.name} · 2026.06.19까지</p>
          </div>
          <QrCode size={32} className="text-blue" />
        </div>
      </Card>
      <MenuButton icon={<ShoppingBag size={20} />} label="GYMSHOP 상품 구매" onClick={() => navigate("shop")} />
      <MenuButton icon={<History size={20} />} label="결제 내역 바로가기" onClick={() => navigate("history")} />
      <MenuButton icon={<Headphones size={20} />} label="환불/문의 바로가기" onClick={() => navigate("support")} />
      <MenuButton icon={<Bell size={20} />} label="알림 설정" onClick={() => notify("알림 설정이 켜졌습니다.")} />
      <MenuButton icon={<ShieldCheck size={20} />} label="약관 및 개인정보처리방침" onClick={() => notify("약관 화면 placeholder입니다.")} />
      <Button variant="dark" className="w-full" onClick={() => navigate("adminHome")}>
        사장님 관리자 화면 보기
      </Button>
    </div>
  );
}

function ShopScreen({
  product,
  navigate,
  selectProduct,
  cartQuantity
}: {
  product: ShopProduct;
  navigate: (screen: ScreenId) => void;
  selectProduct: (product: ShopProduct) => void;
  cartQuantity: number;
}) {
  return (
    <div className="space-y-5">
      <ScreenHeader
        title="GYMSHOP"
        eyebrow="짐패스 회원 전용 상품"
        action={
          <button
            className="relative grid size-11 place-items-center rounded-full bg-white shadow-soft"
            type="button"
            onClick={() => navigate("cart")}
            aria-label="장바구니"
          >
            <ShoppingCart size={20} />
            {cartQuantity > 0 ? (
              <span className="absolute -right-1 -top-1 grid size-5 place-items-center rounded-full bg-lime text-[10px] font-black text-brand">
                {cartQuantity}
              </span>
            ) : null}
          </button>
        }
      />
      <Card className="overflow-hidden bg-brand p-0 text-white">
        <div className="p-5">
          <Badge tone="lime">단백질 루틴 패널</Badge>
          <h2 className="mt-4 text-3xl font-black leading-tight">헬스장 구독 다음은 식단까지 가볍게</h2>
          <p className="mt-3 text-sm font-semibold leading-6 text-white/70">
            운동 이용권과 함께 구매하기 좋은 단백질 상품을 실제 커머스처럼 탐색하고 장바구니에 담아보세요.
          </p>
        </div>
        <img src={product.image} alt={product.name} className="h-56 w-full object-cover" />
      </Card>
      <div className="grid grid-cols-3 gap-3">
        <InfoMini label="오늘 혜택" value="18%" />
        <InfoMini label="배송" value="내일" />
        <InfoMini label="평점" value="4.9" />
      </div>
      <button type="button" onClick={() => selectProduct(product)} className="block w-full text-left">
        <Card className="overflow-hidden p-0">
          <div className="grid grid-cols-[120px_1fr] gap-4 p-4">
            <img src={product.image} alt={product.name} className="h-32 w-full rounded-[22px] object-cover" />
            <div className="min-w-0">
              <Badge tone="lime">{product.badge}</Badge>
              <h3 className="mt-3 text-lg font-black leading-tight">{product.name}</h3>
              <p className="mt-1 line-clamp-2 text-sm font-semibold text-gray-500">{product.subtitle}</p>
              <div className="mt-3 flex items-end gap-2">
                <p className="text-2xl font-black">{formatWon(product.price)}</p>
                <p className="pb-1 text-sm font-bold text-gray-400 line-through">{formatWon(product.originalPrice)}</p>
              </div>
            </div>
          </div>
        </Card>
      </button>
      <Card className="bg-blue text-white">
        <PackageCheck size={28} className="text-white" />
        <h2 className="mt-3 text-xl font-black">장바구니와 구매 화면까지 포함</h2>
        <p className="mt-2 text-sm font-semibold leading-6 text-white/75">실제 결제 연동 없이도 상품 상세, 수량 변경, 주문 확인, 구매 완료 UX를 볼 수 있습니다.</p>
      </Card>
    </div>
  );
}

function ShopDetailScreen({
  product,
  quantity,
  setQuantity,
  navigate,
  notify
}: {
  product: ShopProduct;
  quantity: number;
  setQuantity: (quantity: number) => void;
  navigate: (screen: ScreenId) => void;
  notify: (message: string) => void;
}) {
  return (
    <div className="space-y-5">
      <ScreenHeader title="상품 상세" eyebrow="GYMSHOP" onBack={() => navigate("shop")} />
      <Card className="overflow-hidden p-0">
        <img src={product.image} alt={product.name} className="h-80 w-full object-cover" />
        <div className="p-5">
          <Badge tone="lime">{product.badge}</Badge>
          <h1 className="mt-4 text-3xl font-black leading-tight">{product.name}</h1>
          <p className="mt-2 text-sm font-semibold leading-6 text-gray-500">{product.subtitle}</p>
          <div className="mt-4 flex items-end gap-2">
            <p className="text-4xl font-black">{formatWon(product.price)}</p>
            <p className="pb-1 text-base font-bold text-gray-400 line-through">{formatWon(product.originalPrice)}</p>
          </div>
        </div>
      </Card>
      <Card>
        <h2 className="mb-4 text-lg font-black">영양 정보</h2>
        <div className="grid grid-cols-4 gap-2">
          {product.nutrition.map((item) => (
            <div key={item.label} className="rounded-[18px] bg-gray-50 p-3 text-center">
              <p className="text-[11px] font-bold text-gray-500">{item.label}</p>
              <p className="mt-1 text-sm font-black">{item.value}</p>
            </div>
          ))}
        </div>
      </Card>
      <Card>
        <h2 className="mb-4 text-lg font-black">상품 포인트</h2>
        <Checklist items={product.detailPoints} />
        <div className="mt-4 flex flex-wrap gap-2">
          {product.tags.map((tag) => (
            <Badge key={tag} tone={tag.includes("단백질") ? "blue" : "gray"}>
              {tag}
            </Badge>
          ))}
        </div>
      </Card>
      <Card className="space-y-3">
        <InfoRow label="배송 안내" value={product.shipping} icon={<Truck size={17} />} />
        <InfoRow label="회원 혜택" value="짐패스 구독자 무료 픽업" icon={<ShoppingBag size={17} />} />
      </Card>
      <div className="sticky bottom-2 z-10 rounded-[24px] bg-white/90 p-2 shadow-lift backdrop-blur">
        <div className="mb-2 flex items-center justify-between rounded-[18px] bg-gray-50 px-3 py-2">
          <span className="text-sm font-black">수량</span>
          <QuantityStepper quantity={quantity} setQuantity={setQuantity} />
        </div>
        <div className="grid grid-cols-[1fr_1.25fr] gap-2">
          <Button
            variant="line"
            onClick={() => {
              notify("장바구니에 담았습니다.");
              navigate("cart");
            }}
          >
            <ShoppingCart size={18} />
            담기
          </Button>
          <Button onClick={() => navigate("cart")}>{formatWon(product.price * quantity)} 구매하기</Button>
        </div>
      </div>
    </div>
  );
}

function CartScreen({
  product,
  quantity,
  setQuantity,
  navigate,
  notify
}: {
  product: ShopProduct;
  quantity: number;
  setQuantity: (quantity: number) => void;
  navigate: (screen: ScreenId) => void;
  notify: (message: string) => void;
}) {
  const subtotal = product.price * quantity;
  const shippingFee = subtotal >= 10000 ? 0 : 2500;
  const total = subtotal + shippingFee;

  return (
    <div className="space-y-5">
      <ScreenHeader title="장바구니" eyebrow="GYMSHOP" onBack={() => navigate("shopDetail")} />
      <Card className="p-4">
        <div className="grid grid-cols-[96px_1fr] gap-4">
          <img src={product.image} alt={product.name} className="h-28 w-full rounded-[20px] object-cover" />
          <div>
            <Badge tone="lime">냉장 배송</Badge>
            <h2 className="mt-2 text-lg font-black leading-tight">{product.name}</h2>
            <p className="mt-1 text-sm font-bold text-gray-500">{product.subtitle}</p>
            <div className="mt-3 flex items-center justify-between">
              <p className="text-xl font-black">{formatWon(product.price)}</p>
              <QuantityStepper quantity={quantity} setQuantity={setQuantity} />
            </div>
          </div>
        </div>
      </Card>
      <Card className="space-y-3">
        <InfoRow label="상품 금액" value={formatWon(subtotal)} icon={<ReceiptText size={17} />} />
        <InfoRow label="배송비" value={shippingFee === 0 ? "무료" : formatWon(shippingFee)} icon={<Truck size={17} />} />
        <InfoRow label="결제 수단" value="현대카드 1842" icon={<CreditCard size={17} />} />
      </Card>
      <Card className="bg-brand text-white">
        <p className="text-sm font-bold text-white/65">총 결제 금액</p>
        <p className="mt-2 text-4xl font-black">{formatWon(total)}</p>
        <p className="mt-3 text-sm font-semibold leading-6 text-white/70">실제 결제는 진행되지 않으며 구매 완료 화면으로 이동합니다.</p>
      </Card>
      <Button
        className="w-full"
        onClick={() => {
          notify("주문이 접수되었습니다.");
          navigate("shopComplete");
        }}
      >
        <ShoppingBag size={18} />
        {formatWon(total)} 구매하기
      </Button>
    </div>
  );
}

function ShopCompleteScreen({
  product,
  quantity,
  navigate
}: {
  product: ShopProduct;
  quantity: number;
  navigate: (screen: ScreenId) => void;
}) {
  return (
    <div className="flex min-h-[640px] flex-col justify-center space-y-6 text-center">
      <div className="mx-auto grid size-28 place-items-center rounded-full bg-lime text-brand shadow-lift">
        <PackageCheck size={58} strokeWidth={2.4} />
      </div>
      <div>
        <Badge tone="blue">GYMSHOP 주문 완료</Badge>
        <h1 className="mt-4 text-3xl font-black">구매가 완료되었습니다</h1>
        <p className="mt-3 text-sm font-semibold leading-6 text-gray-500">운동 루틴에 맞춰 내일 냉장 배송 예정입니다.</p>
      </div>
      <Card className="space-y-3 text-left">
        <InfoRow label="주문 상품" value={product.name} />
        <InfoRow label="수량" value={`${quantity}개`} />
        <InfoRow label="배송 상태" value="주문 접수" icon={<Truck size={17} />} />
      </Card>
      <div className="grid grid-cols-2 gap-3">
        <Button variant="line" onClick={() => navigate("shop")}>
          쇼핑 계속
        </Button>
        <Button variant="dark" onClick={() => navigate("home")}>
          홈으로
        </Button>
      </div>
    </div>
  );
}

function QuantityStepper({ quantity, setQuantity }: { quantity: number; setQuantity: (quantity: number) => void }) {
  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={() => setQuantity(Math.max(1, quantity - 1))}
        className="grid size-9 place-items-center rounded-full bg-white text-brand shadow-soft"
        aria-label="수량 줄이기"
      >
        <Minus size={16} />
      </button>
      <span className="min-w-7 text-center text-sm font-black">{quantity}</span>
      <button
        type="button"
        onClick={() => setQuantity(Math.min(20, quantity + 1))}
        className="grid size-9 place-items-center rounded-full bg-brand text-lime shadow-soft"
        aria-label="수량 늘리기"
      >
        <Plus size={16} />
      </button>
    </div>
  );
}

function AdminHome({ navigate }: { navigate: (screen: ScreenId) => void }) {
  return (
    <div className="space-y-5">
      <ScreenHeader title="머슬팩토리 경상대점 관리자" eyebrow="오늘 매장 현황" />
      <div className="grid grid-cols-2 gap-3">
        <Stat label="오늘 입장 회원 수" value="38명" tone="lime" />
        <Stat label="현재 구독자 수" value="214명" />
        <Stat label="이번 달 결제액" value="812만원" tone="blue" />
        <Stat label="만료 예정 회원" value="17명" />
      </div>
      <Button className="w-full" onClick={() => navigate("adminQr")}>
        <ScanLine size={18} />
        QR 확인
      </Button>
      <Button variant="line" className="w-full" onClick={() => navigate("adminMembers")}>
        <UsersRound size={18} />
        회원 목록 보기
      </Button>
      <Card>
        <h2 className="mb-4 text-lg font-black">최근 입장 기록</h2>
        <div className="space-y-3">
          {entryLogs.map((log) => (
            <div key={log} className="flex items-center gap-3 rounded-[18px] bg-gray-50 p-3">
              <CheckCircle2 size={19} className="text-emerald-600" />
              <p className="text-sm font-bold text-gray-700">{log}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

function AdminMembers({ status, setStatus }: { status: MemberStatus; setStatus: (status: MemberStatus) => void }) {
  const statuses: MemberStatus[] = ["이용중", "만료예정", "해지예약", "만료"];
  const members = adminMembers.filter((member) => member.status === status);

  return (
    <div className="space-y-5">
      <ScreenHeader title="회원 목록" eyebrow="구독 상태별 관리" />
      <div className="flex items-center gap-3 rounded-[22px] bg-white px-4 py-3 shadow-soft">
        <Search size={20} className="text-gray-400" />
        <input className="min-w-0 flex-1 bg-transparent text-sm font-bold outline-none placeholder:text-gray-400" placeholder="회원명 또는 회원번호 검색" />
      </div>
      <div className="flex gap-2 overflow-x-auto pb-1">
        {statuses.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => setStatus(item)}
            className={cn("shrink-0 rounded-full px-4 py-2 text-sm font-bold", status === item ? "bg-brand text-lime" : "bg-white text-gray-600")}
          >
            {item}
          </button>
        ))}
      </div>
      <div className="space-y-3">
        {members.map((member) => (
          <MemberItem key={member.id} member={member} />
        ))}
      </div>
    </div>
  );
}

function AdminQr({ result, setResult, notify }: { result: MemberStatus; setResult: (status: MemberStatus) => void; notify: (message: string) => void }) {
  const statuses: MemberStatus[] = ["이용중", "만료", "해지예약", "만료예정"];

  return (
    <div className="space-y-5">
      <ScreenHeader title="QR 확인" eyebrow="회원 이용권 검증" />
      <Card className="text-center">
        <div className="grid h-64 place-items-center rounded-[28px] border-2 border-dashed border-gray-300 bg-gray-50">
          <div>
            <ScanLine className="mx-auto text-blue" size={58} />
            <p className="mt-4 font-black">QR 스캔 영역</p>
            <p className="mt-1 text-sm font-semibold text-gray-500">카메라 연동 전 placeholder</p>
          </div>
        </div>
      </Card>
      <Card className="space-y-3">
        <label className="text-sm font-black">수동 회원번호 입력</label>
        <input className="w-full rounded-[18px] border border-gray-200 bg-white px-4 py-3 text-sm font-bold outline-none focus:border-blue" defaultValue="M-1042" />
        <Button className="w-full" onClick={() => notify("회원번호 확인 결과를 갱신했습니다.")}>
          확인하기
        </Button>
      </Card>
      <div className="flex gap-2 overflow-x-auto pb-1">
        {statuses.map((status) => (
          <button
            key={status}
            type="button"
            onClick={() => setResult(status)}
            className={cn("shrink-0 rounded-full px-4 py-2 text-sm font-bold", result === status ? "bg-brand text-lime" : "bg-white text-gray-600")}
          >
            {status}
          </button>
        ))}
      </div>
      <QrResultCard status={result} />
    </div>
  );
}

function GymCard({ gym, onClick, compact = false }: { gym: Gym; onClick: () => void; compact?: boolean }) {
  return (
    <button type="button" onClick={onClick} className="block w-full text-left">
      <Card className="overflow-hidden p-0 transition hover:translate-y-[-2px]">
        <img src={gym.image} alt={`${gym.name} 사진`} className={cn("w-full object-cover", compact ? "h-36" : "h-44")} />
        <div className="p-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="text-lg font-black">{gym.name}</h3>
              <p className="mt-1 text-sm font-bold text-gray-500">
                {gym.distance} · {gym.hours}
              </p>
            </div>
            <div className="flex items-center gap-1 text-sm font-black text-blue">
              <Star size={16} fill="currentColor" />
              {gym.rating}
            </div>
          </div>
          <p className="mt-3 text-2xl font-black">{formatWon(gym.monthlyPrice)} <span className="text-sm font-bold text-gray-500">/ 월</span></p>
          <div className="mt-3 flex flex-wrap gap-2">
            {gym.tags.map((tag) => (
              <Badge key={tag} tone={tag.includes("할인") ? "lime" : "gray"}>
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      </Card>
    </button>
  );
}

function InfoMini({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[18px] bg-gray-50 p-4">
      <p className="text-xs font-bold text-gray-500">{label}</p>
      <p className="mt-2 text-xl font-black">{value}</p>
    </div>
  );
}

function PaymentItem({ record, navigate }: { record: PaymentRecord; navigate: (screen: ScreenId) => void }) {
  const tone: "green" | "blue" | "red" = record.status === "결제 완료" ? "green" : record.status === "환불 완료" ? "blue" : "red";

  return (
    <Card className="p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-bold text-gray-400">{record.date}</p>
          <h3 className="mt-1 text-sm font-black leading-5">{record.title}</h3>
          <p className="mt-1 text-xs font-bold text-gray-500">{record.method}</p>
        </div>
        <Badge tone={tone}>{record.status}</Badge>
      </div>
      <p className="mt-3 text-xl font-black">{formatWon(record.amount)}</p>
      <div className="mt-4 grid grid-cols-2 gap-2">
        <Button variant="line" className="min-h-10 rounded-[14px] px-3 py-2 text-xs">
          <ReceiptText size={15} />
          영수증 보기
        </Button>
        <Button variant="ghost" className="min-h-10 rounded-[14px] px-3 py-2 text-xs" onClick={() => navigate("support")}>
          환불 문의
        </Button>
      </div>
    </Card>
  );
}

function MenuButton({ icon, label, onClick }: { icon: ReactNode; label: string; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} className="flex w-full items-center justify-between rounded-[22px] bg-white p-4 text-left shadow-soft">
      <span className="flex items-center gap-3 text-sm font-black">
        <span className="grid size-10 place-items-center rounded-2xl bg-gray-100 text-blue">{icon}</span>
        {label}
      </span>
      <ChevronRight size={18} className="text-gray-400" />
    </button>
  );
}

function MemberItem({ member }: { member: AdminMember }) {
  const tone: "green" | "blue" | "lime" | "red" =
    member.status === "이용중" ? "green" : member.status === "만료예정" ? "blue" : member.status === "해지예약" ? "lime" : "red";

  return (
    <Card className="p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-black">{member.name}</h3>
          <p className="mt-1 text-sm font-bold text-gray-500">
            {member.id} · {member.phone}
          </p>
        </div>
        <Badge tone={tone}>{member.status}</Badge>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
        <InfoMini label="구독권" value={member.plan} />
        <InfoMini label="만료일" value={member.expiresAt} />
      </div>
    </Card>
  );
}

function QrResultCard({ status }: { status: MemberStatus }) {
  const config = {
    이용중: { title: "유효한 이용권", body: "오늘 입장 가능한 정상 구독권입니다.", className: "bg-emerald-500 text-white", icon: <CheckCircle2 size={34} /> },
    만료: { title: "만료된 이용권", body: "이용 기간이 종료되어 입장이 제한됩니다.", className: "bg-rose-500 text-white", icon: <AlertCircle size={34} /> },
    해지예약: { title: "해지 예약 상태", body: "현재 기간까지는 이용 가능하며 다음 결제는 진행되지 않습니다.", className: "bg-lime text-brand", icon: <Settings size={34} /> },
    만료예정: { title: "만료 예정 이용권", body: "곧 만료되지만 오늘은 입장 가능합니다.", className: "bg-blue text-white", icon: <Clock size={34} /> }
  } satisfies Record<MemberStatus, { title: string; body: string; className: string; icon: ReactNode }>;

  const item = config[status];

  return (
    <Card className={cn("p-5", item.className)}>
      <div className="flex items-start gap-4">
        <div className="grid size-14 place-items-center rounded-[20px] bg-white/20">{item.icon}</div>
        <div>
          <h2 className="text-2xl font-black">{item.title}</h2>
          <p className="mt-2 text-sm font-bold leading-6 opacity-80">{item.body}</p>
        </div>
      </div>
    </Card>
  );
}

function Toast({ message }: { message: string }) {
  return (
    <div className="fixed left-1/2 top-5 z-50 w-[min(360px,calc(100vw-2rem))] -translate-x-1/2 rounded-[18px] bg-brand px-5 py-4 text-sm font-bold text-white shadow-lift">
      {message}
    </div>
  );
}

function CancelModal({ onClose, notify }: { onClose: () => void; notify: (message: string) => void }) {
  return (
    <div className="fixed inset-0 z-40 grid place-items-center bg-brand/45 px-5 backdrop-blur-sm">
      <div className="w-full max-w-[380px] rounded-[28px] bg-white p-5 shadow-lift">
        <div className="mb-4 flex items-start justify-between gap-4">
          <div>
            <Badge tone="red">해지 예약</Badge>
            <h2 className="mt-3 text-2xl font-black">정말 해지 예약할까요?</h2>
          </div>
          <button type="button" onClick={onClose} className="grid size-10 place-items-center rounded-full bg-gray-100" aria-label="닫기">
            <X size={20} />
          </button>
        </div>
        <p className="text-sm font-semibold leading-6 text-gray-600">
          해지해도 현재 이용 기간인 2026.06.19까지는 QR 이용권을 사용할 수 있습니다. 다음 결제일에는 자동 결제가 진행되지 않습니다.
        </p>
        <div className="mt-5 grid grid-cols-2 gap-3">
          <Button variant="line" onClick={onClose}>
            계속 이용
          </Button>
          <Button
            variant="danger"
            onClick={() => {
              notify("해지 예약이 완료되었습니다.");
              onClose();
            }}
          >
            해지 예약
          </Button>
        </div>
      </div>
    </div>
  );
}
