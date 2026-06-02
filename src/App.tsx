import { useEffect, useMemo, useState, type ReactNode } from "react";
import {
  Activity,
  AlertCircle,
  Bell,
  Brain,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronRight,
  CircleDollarSign,
  Clock,
  CreditCard,
  Dumbbell,
  Headphones,
  History,
  KeyRound,
  LocateFixed,
  LockKeyhole,
  Map,
  Minus,
  MessageCircle,
  PackageCheck,
  Phone,
  Plus,
  QrCode,
  ReceiptText,
  RefreshCw,
  ScanLine,
  Search,
  Settings,
  ShieldCheck,
  ShoppingBag,
  ShoppingCart,
  SlidersHorizontal,
  Sparkles,
  Star,
  Truck,
  UserCheck,
  UserRound,
  UsersRound,
  Utensils,
  X
} from "lucide-react";
import { adminMembers, dietRecommendation, entryLogs, filters, gyms, paymentRecords, plans, ptTrainers, qrVerificationResults, shopProducts, weeklyRoutine } from "./data/gympass";
import type { AdminMember, Gym, MemberStatus, PaymentRecord, Plan, QrVerificationStatus, ScreenId, ShopProduct } from "./types";
import { AppShell, Badge, Button, Card, Checklist, InfoRow, MapPlaceholder, ScreenHeader, Stat, cn } from "./components/ui";

const formatWon = (value: number) => `${value.toLocaleString("ko-KR")}원`;
const screenIds: ScreenId[] = [
  "splash",
  "onboarding",
  "login",
  "location",
  "home",
  "search",
  "detail",
  "plans",
  "checkout",
  "complete",
  "pass",
  "subscription",
  "history",
  "support",
  "my",
  "pt",
  "routine",
  "diet",
  "shop",
  "shopDetail",
  "cart",
  "shopComplete",
  "adminHome",
  "adminMembers",
  "adminQr"
];

const getInitialScreen = (): ScreenId => {
  const requested = new URLSearchParams(window.location.search).get("screen");
  return requested && screenIds.includes(requested as ScreenId) ? (requested as ScreenId) : "splash";
};

export default function App() {
  const [screen, setScreen] = useState<ScreenId>(getInitialScreen);
  const [selectedGym, setSelectedGym] = useState<Gym>(gyms[0]);
  const [selectedPlan, setSelectedPlan] = useState<Plan>(plans[0]);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState<string[]>(["24시", "주차 가능"]);
  const [viewMode, setViewMode] = useState<"list" | "map">("list");
  const [toast, setToast] = useState("");
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [adminStatus, setAdminStatus] = useState<MemberStatus>("이용중");
  const [qrResult, setQrResult] = useState<QrVerificationStatus>("입장 가능");
  const [selectedProduct, setSelectedProduct] = useState<ShopProduct>(shopProducts[0]);
  const [cartQuantity, setCartQuantity] = useState(1);

  const showTabs = !["splash", "onboarding", "login", "location", "complete"].includes(screen);
  const appMode = screen.toString().startsWith("admin") ? "admin" : "customer";

  const navigate = (next: ScreenId) => {
    setScreen(next);
    window.scrollTo(0, 0);
  };
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
      case "pt":
        return <PtScreen navigate={navigate} notify={notify} />;
      case "routine":
        return <RoutineScreen notify={notify} />;
      case "diet":
        return <DietScreen navigate={navigate} />;
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
    <div className="relative flex min-h-[640px] flex-col justify-between overflow-hidden rounded-[34px] bg-black text-white shadow-glow">
      <img src="images/gympass-onboarding-hero.png" alt="짐패스 앱 프리뷰" className="absolute inset-0 h-full w-full object-cover object-[50%_44%] opacity-86" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.22)_0%,rgba(0,0,0,0.34)_42%,rgba(0,0,0,0.96)_100%)]" />
      <div className="relative p-5">
        <div className="flex items-center justify-between">
          <img src="brand/gympass-icon.svg" alt="짐패스 로고" className="size-12 rounded-[18px] shadow-lift ring-1 ring-white/15" />
          <Badge tone="lime">MONTHLY PASS</Badge>
        </div>
      </div>
      <div className="relative p-5">
        <div className="rounded-[30px] bg-white/10 p-5 shadow-lift ring-1 ring-white/15 backdrop-blur-md">
          <Badge tone="blue">진주 가좌동 · QR 입장</Badge>
          <h1 className="mt-4 text-[52px] font-black leading-[0.98] text-white">짐패스</h1>
          <p className="mt-4 text-[25px] font-black leading-[1.14] text-white">헬스장, 이제<br />한 달씩 가볍게</p>
          <p className="mt-4 text-sm font-semibold leading-6 text-white/72">
            주변 GYM을 비교하고 결제하면 QR 이용권이 바로 열립니다.
          </p>
          <div className="mt-5 grid grid-cols-3 gap-2">
            {["월구독", "즉시입장", "투명결제"].map((item) => (
              <div key={item} className="rounded-2xl bg-black/45 px-2 py-3 text-center text-xs font-black text-white ring-1 ring-white/10">
                {item}
              </div>
            ))}
          </div>
          <Button className="mt-5 w-full" onClick={() => navigate("onboarding")}>
            30초 둘러보기
          </Button>
        </div>
      </div>
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
    <div className="flex min-h-[640px] flex-col justify-between space-y-6">
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <Badge tone="blue">STEP 1</Badge>
          <div className="flex gap-1.5">
            <span className="h-2 w-8 rounded-full bg-lime" />
            <span className="size-2 rounded-full bg-zinc-300" />
            <span className="size-2 rounded-full bg-zinc-300" />
          </div>
        </div>
        <div className="overflow-hidden rounded-[32px] bg-zinc-950 text-white shadow-glow">
          <img src="images/gympass-onboarding-hero.png" alt="짐패스 월구독 화면" className="h-80 w-full object-cover object-[50%_38%]" />
          <div className="p-5">
            <Badge tone="lime">오늘 결제 · 오늘 입장</Badge>
            <h1 className="mt-4 text-[34px] font-black leading-[1.08]">긴 계약 없이<br />필요한 만큼만</h1>
            <p className="mt-3 text-sm font-semibold leading-6 text-white/72">근처 헬스장을 비교하고, 월 구독권을 고르고, QR로 바로 입장하세요.</p>
          </div>
        </div>
        <div className="grid gap-3">
          {points.map(([title, body]) => (
            <Card key={title} className="flex items-center gap-4 p-4">
              <div className="grid size-10 shrink-0 place-items-center rounded-2xl bg-lime text-brand shadow-[0_12px_30px_rgba(255,31,61,0.25)]">
                <Check size={20} />
              </div>
              <div>
                <p className="font-black leading-5">{title}</p>
                <p className="mt-1 text-sm font-semibold leading-5 text-gray-500">{body}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>
      <Button className="w-full" onClick={() => navigate("login")}>
        다음으로
      </Button>
    </div>
  );
}

function LoginScreen({ navigate }: { navigate: (screen: ScreenId) => void }) {
  return (
    <div className="flex min-h-[640px] flex-col justify-between">
      <div className="space-y-5">
        <div className="relative overflow-hidden rounded-[32px] bg-black p-5 text-white shadow-glow">
          <img src="images/gympass-onboarding-hero.png" alt="짐패스 로그인 이미지" className="absolute inset-0 h-full w-full object-cover object-[50%_34%] opacity-34" />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.46),rgba(0,0,0,0.95))]" />
          <div className="relative min-h-72">
            <Badge tone="lime">간편 로그인</Badge>
            <h1 className="mt-5 max-w-[292px] text-[29px] font-black leading-[1.18]">김예림님에게 맞는<br />헬스장을 찾을게요</h1>
            <p className="mt-3 text-sm font-semibold leading-6 text-white/72">휴대폰 인증만 끝내면 구독권과 결제 내역을 한곳에서 관리할 수 있습니다.</p>
          </div>
        </div>
        <Card className="space-y-4">
          <div className="rounded-[22px] bg-zinc-50 p-4">
            <div className="flex items-center gap-3">
              <div className="grid size-12 place-items-center rounded-2xl bg-brand text-white">
                <UserRound size={22} />
              </div>
              <div>
                <p className="text-sm font-bold text-gray-500">테스트 계정</p>
                <p className="text-lg font-black">김예림 · 010 2345 9182</p>
              </div>
            </div>
          </div>
          <InfoRow label="인증 방식" value="휴대폰 간편 인증" icon={<Phone size={17} />} />
          <InfoRow label="보안 상태" value="결제 정보 분리 저장" icon={<ShieldCheck size={17} />} />
        </Card>
        <Card className="bg-zinc-950 text-white">
          <p className="text-sm font-bold text-white/62">로그인 후 가능한 기능</p>
          <p className="mt-2 text-xl font-black leading-snug">QR 이용권, 결제 내역, 환불 문의까지 한 번에 관리</p>
        </Card>
      </div>
      <div className="space-y-3">
        <Button className="w-full" onClick={() => navigate("location")}>
          3초 로그인 계속하기
        </Button>
        <Button variant="ghost" className="w-full" onClick={() => navigate("adminHome")}>
          사장님 계정으로 보기
        </Button>
      </div>
    </div>
  );
}

function LocationScreen({ navigate }: { navigate: (screen: ScreenId) => void }) {
  return (
    <div className="flex min-h-[640px] flex-col justify-between">
      <div className="space-y-6">
        <ScreenHeader title="주변 헬스장을 바로 비교할게요" eyebrow="위치 권한 안내" />
        <Card className="overflow-hidden p-0">
          <div className="relative h-80 bg-zinc-950 text-white">
            <img src="images/gympass-onboarding-hero.png" alt="위치 기반 헬스장 추천" className="absolute inset-0 h-full w-full object-cover object-[63%_42%] opacity-55" />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.1),rgba(0,0,0,0.92))]" />
            <div className="relative flex h-full flex-col justify-between p-5">
              <div className="flex items-center justify-between">
                <Badge tone="lime">진주 가좌동</Badge>
                <div className="grid size-12 place-items-center rounded-full bg-white/12 ring-1 ring-white/20 backdrop-blur">
                  <LocateFixed size={24} />
                </div>
              </div>
              <div className="space-y-3">
                {gyms.slice(0, 2).map((gym) => (
                  <div key={gym.id} className="rounded-[22px] bg-white/12 p-3 ring-1 ring-white/15 backdrop-blur">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="font-black">{gym.name}</p>
                        <p className="mt-1 text-xs font-bold text-white/65">{gym.distance} · 월 {gym.monthlyPrice.toLocaleString("ko-KR")}원</p>
                      </div>
                      <Badge tone="red">{gym.hours}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="space-y-4 p-5">
            <p className="text-sm font-semibold leading-6 text-gray-600">
              현재 위치는 헬스장 거리 계산과 주변 추천에만 사용됩니다. 결제나 구독 정보와는 별도로 안전하게 관리됩니다.
            </p>
            <InfoRow label="예상 위치" value="진주 가좌동" icon={<Map size={17} />} />
          </div>
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
    <div className="space-y-7">
      <section className="relative min-h-[500px] overflow-hidden rounded-[34px] bg-black text-white shadow-glow">
        <img src="images/gympass-qr-entry.png" alt="짐패스 QR 입장 히어로" className="absolute inset-0 h-full w-full object-cover object-[62%_center] opacity-95" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.42)_0%,rgba(0,0,0,0.18)_34%,rgba(0,0,0,0.94)_100%)]" />
        <div className="relative flex min-h-[500px] flex-col justify-between p-5">
          <div>
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-black uppercase text-lime">진주 가좌동 · READY</p>
                <h1 className="mt-3 max-w-[250px] text-[31px] font-black leading-[1.14]">김예림님,<br />오늘 운동 갈까요?</h1>
              </div>
              <button className="grid size-11 place-items-center rounded-full bg-white/12 text-white shadow-soft ring-1 ring-white/20 backdrop-blur" type="button" aria-label="알림">
                <Bell size={20} />
              </button>
            </div>
            <div className="mt-5 h-32 overflow-hidden rounded-[26px] shadow-soft ring-1 ring-white/15">
              <img src="images/gympass-share-art.png" alt="짐패스 QR 체크인 앱 이미지" className="h-full w-full object-cover object-[72%_center]" />
            </div>
          </div>
          <div className="space-y-4">
            <div className="rounded-[28px] bg-white/10 p-4 shadow-lift ring-1 ring-white/15 backdrop-blur-md">
              <div className="flex flex-wrap items-center gap-2">
                <Badge tone="lime">이용중</Badge>
                <span className="rounded-full bg-white/12 px-3 py-1 text-xs font-black text-white/80">D-30</span>
              </div>
              <div className="mt-4 grid grid-cols-[1fr_92px] items-end gap-4">
                <div>
                  <h2 className="text-[30px] font-black leading-[1.02]">머슬팩토리<br />오늘 입장 가능</h2>
                  <p className="mt-3 text-xs font-bold leading-5 text-white/70">다음 결제 2026.06.20 · 현대카드 1842</p>
                </div>
                <button
                  type="button"
                  onClick={() => navigate("pass")}
                  className="grid h-24 place-items-center rounded-[24px] bg-lime text-brand text-center shadow-soft"
                  aria-label="QR 이용권 열기"
                >
                  <QrCode size={34} />
                  <span className="text-[11px] font-black">QR PASS</span>
                </button>
              </div>
            </div>
            <div className="rounded-[28px] bg-white p-4 text-brand shadow-soft">
              <Badge tone="blue">NO CONTRACT · MONTHLY</Badge>
              <h2 className="mt-3 text-[28px] font-black leading-[1.04]">1년권 말고<br />한 달씩 가볍게</h2>
              <p className="mt-3 text-sm font-bold leading-6 text-gray-600">가격, 거리, 운영시간을 비교하고 결제 즉시 QR로 입장하세요.</p>
              <Button className="mt-4 w-full" onClick={() => navigate("search")}>
                내 주변 헬스장 보기
              </Button>
            </div>
          </div>
        </div>
      </section>
      <button type="button" onClick={() => navigate("shop")} className="block w-full text-left">
        <Card className="overflow-hidden bg-white p-0">
          <div className="grid grid-cols-[1fr_138px] items-stretch">
            <div className="p-5">
              <Badge tone="blue">GYMSHOP</Badge>
              <h2 className="mt-4 text-[25px] font-black leading-[1.08]">운동 끝나고<br />바로 단백질</h2>
              <p className="mt-3 text-sm font-semibold leading-6 text-gray-500">구독 회원 전용 상품을 장바구니에 담고 구매 흐름까지 확인하세요.</p>
              <div className="mt-4 inline-flex items-center gap-2 text-sm font-black text-blue">
                상품 보러가기 <ChevronRight size={16} />
              </div>
            </div>
            <div className="relative bg-zinc-100">
              <img src="images/gymshop-chicken-breast.png" alt="GYMSHOP 닭가슴살 상품" className="h-full min-h-48 w-full object-cover" />
            </div>
          </div>
        </Card>
      </button>
      <div className="grid grid-cols-3 gap-3">
        <QuickFeature icon={<Dumbbell size={20} />} label="PT" body="상담" onClick={() => navigate("pt")} />
        <QuickFeature icon={<Activity size={20} />} label="루틴" body="주 4회" onClick={() => navigate("routine")} />
        <QuickFeature icon={<Utensils size={20} />} label="AI 식단" body="520kcal" onClick={() => navigate("diet")} />
      </div>
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
      <Card className="bg-zinc-950 text-white">
        <div className="flex items-start justify-between gap-4">
          <div>
            <Badge tone="lime">월구독 핵심 정보</Badge>
            <h2 className="mt-4 text-2xl font-black leading-tight">가격, 다음 결제일, QR 입장을 홈에서 바로 확인</h2>
            <p className="mt-3 text-sm font-semibold leading-6 text-white/70">
              장기 약정 없이 한 달 단위로 결제하고, 해지 예약과 환불 안내는 구독 관리에서 확인할 수 있습니다.
            </p>
          </div>
          <ReceiptText className="shrink-0 text-lime" size={30} />
        </div>
      </Card>
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
                active ? "border-brand bg-lime text-brand" : "border-gray-200 bg-white text-gray-600"
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
      <div className="flex items-center justify-between rounded-[22px] bg-zinc-950 px-4 py-3 text-white shadow-soft">
        <div>
          <p className="text-xs font-black text-red-300">검색 결과 {visibleGyms.length}개</p>
          <p className="mt-1 text-sm font-bold text-white/70">모든 카드에 월 가격이 바로 표시됩니다.</p>
        </div>
        <Badge tone="lime">가격순 비교</Badge>
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
  const [remaining, setRemaining] = useState(30);
  const [tokenSeed, setTokenSeed] = useState(8214);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setRemaining((current) => {
        if (current <= 1) {
          setTokenSeed((seed) => seed + 1);
          return 30;
        }

        return current - 1;
      });
    }, 1000);

    return () => window.clearInterval(timer);
  }, []);

  const token = `TMP-GP-${tokenSeed}-${remaining.toString().padStart(2, "0")}`;
  const progress = `${(remaining / 30) * 100}%`;

  return (
    <div className="space-y-5">
      <ScreenHeader title="내 이용권" eyebrow="동적 QR 토큰" />
      <Card className="overflow-hidden bg-brand p-0 text-white">
        <img src={gym.image} alt={`${gym.name} 이용권`} className="h-32 w-full object-cover opacity-80" />
        <div className="p-5">
          <div className="flex items-center justify-between gap-3">
            <Badge tone="lime">이용중</Badge>
            <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-black text-white/70">{plan.name}</span>
          </div>
          <h2 className="mt-4 text-2xl font-black">{gym.name}</h2>
          <p className="mt-1 text-sm font-bold text-white/62">2026.06.19까지 · 서버 검증용 임시 토큰 사용</p>
        </div>
      </Card>

      <Card className="text-center">
        <div className="mx-auto flex size-52 flex-col items-center justify-center rounded-[30px] border-8 border-white bg-[linear-gradient(145deg,#111827,#0F172A)] shadow-inner ring-1 ring-brand/10">
          <div className="qr-pattern grid size-36 place-items-center rounded-[20px] bg-white">
            <QrCode size={82} className="text-brand" />
          </div>
          <p className="mt-3 rounded-full bg-lime px-3 py-1 text-[11px] font-black text-brand">{token}</p>
        </div>
        <div className="mt-5 flex items-center justify-center gap-2 text-brand">
          <Clock size={18} />
          <p className="text-3xl font-black">{remaining}초</p>
        </div>
        <div className="mt-3 h-2 overflow-hidden rounded-full bg-gray-100">
          <div className="h-full rounded-full bg-lime transition-all" style={{ width: progress }} />
        </div>
        <p className="mt-3 text-sm font-black text-brand">30초마다 새 QR이 생성됩니다</p>
        <p className="mt-1 text-xs font-bold leading-5 text-gray-500">QR 안에는 회원권 ID가 아니라 서버 검증용 임시 토큰이 들어갑니다.</p>
      </Card>

      <Card className="space-y-3 border border-blue/10 bg-[#EEF4FF]">
        <div className="flex items-start gap-3">
          <LockKeyhole className="mt-0.5 shrink-0 text-blue" size={22} />
          <div>
            <h3 className="font-black text-brand">캡처한 QR은 사용할 수 없습니다</h3>
            <p className="mt-1 text-sm font-bold leading-6 text-gray-600">관리자 스캔 시 토큰 발급 시간과 사용 여부를 함께 검증합니다.</p>
          </div>
        </div>
        <InfoRow label="토큰 정책" value="1회 스캔 후 폐기" icon={<KeyRound size={17} />} />
        <InfoRow label="갱신 주기" value="30초" icon={<RefreshCw size={17} />} />
      </Card>

      <Card className="grid grid-cols-2 gap-3">
        <InfoMini label="남은 이용 기간" value="24일" />
        <InfoMini label="이용 가능 지점" value="경상대점" />
      </Card>
      <div className="grid grid-cols-2 gap-3">
        <Button variant="line" onClick={() => navigate("subscription")}>구독 관리</Button>
        <Button variant="dark" onClick={() => navigate("history")}>결제 내역</Button>
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
      <Card>
        <h2 className="mb-3 text-lg font-black">해지/환불 요약</h2>
        <Checklist
          items={[
            "다음 결제일 전 해지 예약 시 2026.06.20 결제가 중단됩니다.",
            "QR 입장 전 결제 건은 고객센터에서 전액 환불 요청이 가능합니다.",
            "입장 기록이 있으면 남은 기간과 매장 정책을 기준으로 환불 금액을 안내합니다."
          ]}
        />
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
      <Card className="bg-zinc-950 text-white">
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
          <h2 className="text-xl font-black">김예림</h2>
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
      <MenuButton icon={<Dumbbell size={20} />} label="PT 상담 신청" onClick={() => navigate("pt")} />
      <MenuButton icon={<Activity size={20} />} label="운동 루틴 보기" onClick={() => navigate("routine")} />
      <MenuButton icon={<Utensils size={20} />} label="AI 식단 맞춤" onClick={() => navigate("diet")} />
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

function QuickFeature({ icon, label, body, onClick }: { icon: ReactNode; label: string; body: string; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} className="rounded-[22px] bg-white p-4 text-left shadow-soft">
      <span className="grid size-10 place-items-center rounded-2xl bg-brand text-lime">{icon}</span>
      <p className="mt-3 text-base font-black">{label}</p>
      <p className="mt-1 text-xs font-bold text-gray-500">{body}</p>
    </button>
  );
}

function PtScreen({ navigate, notify }: { navigate: (screen: ScreenId) => void; notify: (message: string) => void }) {
  return (
    <div className="space-y-5">
      <ScreenHeader title="PT 신청" eyebrow="구독 회원 전용 코칭" onBack={() => navigate("my")} />
      <Card className="bg-brand text-white">
        <Badge tone="lime">TRAINER MATCH</Badge>
        <h2 className="mt-4 text-3xl font-black leading-tight">내 목표에 맞는 트레이너를 고르세요</h2>
        <p className="mt-3 text-sm font-semibold leading-6 text-white/70">상담 신청은 더미 UI이며 실제 예약/결제는 연결되지 않습니다.</p>
      </Card>
      <div className="space-y-3">
        {ptTrainers.map((trainer) => (
          <Card key={trainer.id} className="p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-xl font-black">{trainer.name}</h3>
                <p className="mt-1 text-sm font-bold text-blue">{trainer.specialty}</p>
              </div>
              <Badge tone="lime">★ {trainer.rating}</Badge>
            </div>
            <p className="mt-3 text-sm font-semibold leading-6 text-gray-600">{trainer.description}</p>
            <div className="mt-4 flex items-center justify-between gap-3 rounded-[18px] bg-gray-50 p-3">
              <div>
                <p className="text-xs font-bold text-gray-500">1회 상담/수업</p>
                <p className="text-xl font-black">{formatWon(trainer.price)}</p>
              </div>
              <Button className="min-h-11 px-4" onClick={() => notify(`${trainer.name} 상담 신청이 접수되었습니다.`)}>
                상담 신청
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

function RoutineScreen({ notify }: { notify: (message: string) => void }) {
  return (
    <div className="space-y-5">
      <ScreenHeader title="운동 루틴" eyebrow="AI 루틴 플래너" />
      <Card className="bg-brand text-white">
        <div className="flex items-start justify-between gap-4">
          <div>
            <Badge tone="lime">{weeklyRoutine.memberName}님의 주간 루틴</Badge>
            <h2 className="mt-4 text-3xl font-black leading-tight">목표는 {weeklyRoutine.goal}, 빈도는 {weeklyRoutine.frequency}</h2>
          </div>
          <Activity className="shrink-0 text-lime" size={34} />
        </div>
      </Card>
      <div className="space-y-3">
        {weeklyRoutine.days.map((day) => (
          <Card key={day.day} className="flex items-center gap-4 p-4">
            <div className="grid size-14 shrink-0 place-items-center rounded-[20px] bg-lime text-xl font-black text-brand">{day.day}</div>
            <div>
              <h3 className="text-lg font-black">{day.focus}</h3>
              <p className="mt-1 text-sm font-semibold leading-6 text-gray-600">{day.detail}</p>
            </div>
          </Card>
        ))}
      </div>
      <Button className="w-full" onClick={() => notify("AI가 감량 목표에 맞춰 루틴을 다시 계산했습니다.")}>
        <RefreshCw size={18} />
        AI로 루틴 다시 짜기
      </Button>
    </div>
  );
}

function DietScreen({ navigate }: { navigate: (screen: ScreenId) => void }) {
  return (
    <div className="space-y-5">
      <ScreenHeader title="AI 식단 맞춤" eyebrow="본사 식단표 기반" />
      <Card className="bg-brand text-white">
        <div className="flex items-start justify-between gap-4">
          <div>
            <Badge tone="lime">{dietRecommendation.source}</Badge>
            <h2 className="mt-4 text-3xl font-black leading-tight">{dietRecommendation.memberName}님 감량 식단</h2>
            <p className="mt-3 text-sm font-semibold leading-6 text-white/70">{dietRecommendation.note}</p>
          </div>
          <Brain className="shrink-0 text-lime" size={34} />
        </div>
      </Card>
      <Card>
        <h3 className="mb-4 text-lg font-black">맞춤 설정</h3>
        <div className="grid grid-cols-2 gap-3">
          {dietRecommendation.settings.map((item) => (
            <InfoMini key={item.label} label={item.label} value={item.value} />
          ))}
        </div>
      </Card>
      <Card className="overflow-hidden p-0">
        <div className="bg-[#EEF4FF] p-5">
          <Badge tone="blue">오늘 추천</Badge>
          <h2 className="mt-4 text-2xl font-black leading-tight">{dietRecommendation.todayMenu}</h2>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <InfoMini label="열량" value={dietRecommendation.calories} />
            <InfoMini label="단백질" value={dietRecommendation.protein} />
          </div>
        </div>
        <div className="p-5">
          <Button className="w-full" onClick={() => navigate("shop")}>
            <ShoppingBag size={18} />
            상품 주문으로 연결
          </Button>
        </div>
      </Card>
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
      <Card className="overflow-hidden bg-zinc-950 p-0 text-white">
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
      <Card className="bg-zinc-950 text-white">
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
      <Card>
        <h2 className="mb-4 text-lg font-black">오늘 처리할 일</h2>
        <div className="space-y-3">
          <InfoRow label="QR 확인 필요" value="2건" icon={<ScanLine size={17} />} />
          <InfoRow label="환불 문의" value="1건" icon={<Headphones size={17} />} />
          <InfoRow label="결제 실패 회원" value="4명" icon={<AlertCircle size={17} />} />
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

function AdminQr({ result, setResult, notify }: { result: QrVerificationStatus; setResult: (status: QrVerificationStatus) => void; notify: (message: string) => void }) {
  const statuses: QrVerificationStatus[] = ["입장 가능", "만료된 QR", "이미 사용된 QR", "다른 지점 이용권", "회원권 만료"];
  const selectedResult = qrVerificationResults.find((item) => item.status === result) ?? qrVerificationResults[0];

  return (
    <div className="space-y-5">
      <ScreenHeader title="QR 확인" eyebrow="서버 토큰 검증" />
      <Card className="text-center">
        <div className="grid h-64 place-items-center rounded-[28px] border-2 border-dashed border-blue/25 bg-[#EEF4FF]">
          <div>
            <ScanLine className="mx-auto text-blue" size={58} />
            <p className="mt-4 font-black">QR 스캔 영역</p>
            <p className="mt-1 text-sm font-semibold text-gray-500">카메라 연동 전 placeholder · 더미 검증 상태 선택</p>
          </div>
        </div>
      </Card>
      <Card className="space-y-3">
        <label className="text-sm font-black">수동 토큰 입력</label>
        <input className="w-full rounded-[18px] border border-gray-200 bg-white px-4 py-3 text-sm font-bold outline-none focus:border-blue" defaultValue="TMP-GP-8214-24" />
        <Button className="w-full" onClick={() => notify(`${selectedResult.status} 상태로 검증 결과를 갱신했습니다.`)}>
          서버 토큰 확인
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
      <QrResultCard result={selectedResult} />
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

function QrResultCard({ result }: { result: (typeof qrVerificationResults)[number] }) {
  const config = {
    "입장 가능": { className: "bg-emerald-500 text-white", icon: <UserCheck size={34} />, label: "입장 가능" },
    "만료된 QR": { className: "bg-amber-500 text-white", icon: <Clock size={34} />, label: "만료된 QR" },
    "이미 사용된 QR": { className: "bg-zinc-950 text-white", icon: <RefreshCw size={34} />, label: "이미 사용된 QR" },
    "다른 지점 이용권": { className: "bg-blue text-white", icon: <Map size={34} />, label: "다른 지점 이용권" },
    "회원권 만료": { className: "bg-rose-500 text-white", icon: <AlertCircle size={34} />, label: "회원권 만료" }
  } satisfies Record<QrVerificationStatus, { className: string; icon: ReactNode; label: string }>;

  const item = config[result.status];

  return (
    <Card className={cn("p-5", item.className)}>
      <div className="flex items-start gap-4">
        <div className="grid size-14 shrink-0 place-items-center rounded-[20px] bg-white/20">{item.icon}</div>
        <div className="min-w-0 flex-1">
          <Badge tone={result.status === "입장 가능" ? "lime" : "gray"}>{item.label}</Badge>
          <h2 className="mt-3 text-2xl font-black">{result.memberName}</h2>
          <p className="mt-2 text-sm font-bold leading-6 opacity-85">{result.message}</p>
          <div className="mt-5 grid grid-cols-2 gap-2 text-left text-sm">
            <StatusInfo label="회원번호" value={result.memberId} />
            <StatusInfo label="이용권" value={result.plan} />
            <StatusInfo label="남은 기간" value={result.remainingDays} />
            <StatusInfo label="지점" value={result.branch} />
          </div>
        </div>
      </div>
    </Card>
  );
}

function StatusInfo({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[16px] bg-white/14 p-3">
      <p className="text-[11px] font-bold opacity-70">{label}</p>
      <p className="mt-1 font-black leading-5">{value}</p>
    </div>
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








