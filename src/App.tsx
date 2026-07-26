import { useEffect, useMemo, useState, type ReactNode } from "react";
import {
  Activity,
  AlertCircle,
  Bell,
  Brain,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronDown,
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
  MapPin,
  Minus,
  MessageCircle,
  MessagesSquare,
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
  Target,
  Trophy,
  Truck,
  UserCheck,
  UserRound,
  UsersRound,
  Utensils,
  X,
  Zap
} from "lucide-react";
import { signInDemoMember } from "./lib/auth";
import { getMatchType, rankTrainers, type TrainerMatch } from "./lib/matching";
import { prototypeData, returnPassRepository } from "./lib/repo";
import type {
  AdminMember,
  Content,
  Facility,
  FacilityCategory,
  MatchAnswers,
  MemberStatus,
  PaymentRecord,
  Plan,
  PtSubscriptionPlan,
  QrVerificationStatus,
  Role,
  ScreenId,
  ShopProduct,
  Trainer
} from "./types";

const {
  activePass,
  adminMembers,
  aiVisualAssets,
  challenges,
  communityPosts,
  contents,
  dietRecommendation,
  entryLogs,
  facilityCategories,
  facilities: prototypeFacilities,
  filters,
  paymentRecords,
  plans,
  ptSubscriptionPlans,
  ptTrainers,
  qrVerificationResults,
  shopProducts,
  weeklyRoutine
} = prototypeData;
import { AppShell, Badge, Button, Card, Checklist, InfoRow, MapPlaceholder, ScreenHeader, Stat, cn } from "./components/ui";
import { ContentHomeScreen } from "./components/content/ContentHome";
import { ContentDetailScreen } from "./components/content/ContentDetail";
import { ContentThumbnail } from "./components/content/ContentThumbnail";
import { contentTypeLabel, isContentLocked } from "./components/content/contentMeta";

const formatWon = (value: number) => `${value.toLocaleString("ko-KR")}원`;

function SpriteVisual({
  image,
  position,
  backgroundSize,
  label,
  className
}: {
  image: string;
  position: string;
  backgroundSize: string;
  label: string;
  className?: string;
}) {
  return (
    <div
      role="img"
      aria-label={label}
      className={cn("bg-no-repeat", className)}
      style={{
        backgroundImage: `url("${image}")`,
        backgroundPosition: position,
        backgroundSize
      }}
    />
  );
}

const defaultMatchAnswers: MatchAnswers = {
  goal: "체중감량",
  level: "입문",
  intensity: "천천히 점진적",
  tone: "다정·응원형",
  teach: "핵심만",
  diet: "주 1회 피드백",
  time: "오전",
  genderPref: "무관",
  care: "무릎",
  freq: "주 1회",
  budget: "월 40만원 이하"
};

const getPtPlanPrice = (trainer: Trainer, plan: PtSubscriptionPlan) =>
  Math.round(trainer.price * plan.sessions * (1 - plan.discountRate));

const screenIds: ScreenId[] = [
  "splash",
  "onboarding",
  "login",
  "location",
  "locationPermission",
  "home",
  "search",
  "detail",
  "facilityDetail",
  "plans",
  "planSelect",
  "checkout",
  "complete",
  "paySuccess",
  "pass",
  "myPass",
  "subscription",
  "subscriptionManage",
  "history",
  "payHistory",
  "support",
  "my",
  "mypage",
  "pt",
  "ptMatchIntro",
  "ptMatchQuiz",
  "ptMatchResult",
  "trainerProfile",
  "ptPlanSelect",
  "ptCheckout",
  "myPt",
  "routine",
  "aiRoutine",
  "diet",
  "aiDiet",
  "contentHome",
  "contentDetail",
  "communityFeed",
  "communityPost",
  "communityWrite",
  "challengeList",
  "challengeDetail",
  "shop",
  "shopDetail",
  "cart",
  "shopComplete",
  "orderSuccess",
  "adminHome",
  "adminMembers",
  "adminQr",
  "ownerHome",
  "ownerMembers",
  "ownerQr",
  "ownerSales",
  "ownerPickup",
  "ownerFacility",
  "trainerHome",
  "hqAdminHome",
  "hqAdminFacilities",
  "hqAdminContent",
  "hqAdminCommerce",
  "hqAdminReports"
];

const getInitialScreen = (): ScreenId => {
  const params = new URLSearchParams(window.location.search);
  const requested = params.get("screen");
  if (requested && screenIds.includes(requested as ScreenId)) return requested as ScreenId;
  if (params.get("admin") === "1") return "hqAdminHome";

  const role = params.get("role") as Role | null;
  const roleEntry: Partial<Record<Role, ScreenId>> = {
    owner: "ownerHome",
    trainer: "trainerHome",
    hq: "hqAdminHome"
  };

  return (role && roleEntry[role]) || "splash";
};

export default function App() {
  const [screen, setScreen] = useState<ScreenId>(getInitialScreen);
  const [facilities, setFacilities] = useState<Facility[]>(prototypeFacilities);
  const [selectedGym, setSelectedGym] = useState<Facility>(prototypeFacilities[0]);
  const [selectedPlan, setSelectedPlan] = useState<Plan>(plans[0]);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<FacilityCategory | "all">("all");
  const [viewMode, setViewMode] = useState<"list" | "map">("list");
  const [toast, setToast] = useState("");
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [adminStatus, setAdminStatus] = useState<MemberStatus>("이용중");
  const [qrResult, setQrResult] = useState<QrVerificationStatus>("입장 가능");
  const [selectedProduct, setSelectedProduct] = useState<ShopProduct>(shopProducts[0]);
  const [cartQuantity, setCartQuantity] = useState(1);
  const [authPending, setAuthPending] = useState(false);
  const [matchAnswers, setMatchAnswers] = useState<MatchAnswers>(defaultMatchAnswers);
  const [selectedTrainer, setSelectedTrainer] = useState<Trainer>(ptTrainers[0]);
  const [selectedPtPlan, setSelectedPtPlan] = useState<PtSubscriptionPlan>(ptSubscriptionPlans[1]);
  const [ptTermsAccepted, setPtTermsAccepted] = useState(false);
  const [selectedContent, setSelectedContent] = useState<Content>(contents[0]);
  const [savedContentIds, setSavedContentIds] = useState<string[]>([]);
  const [completedContentIds, setCompletedContentIds] = useState<string[]>([]);

  const appMode =
    screen.startsWith("admin") || screen.startsWith("owner")
      ? "owner"
      : screen.startsWith("trainer")
        ? "trainer"
        : screen.startsWith("hqAdmin")
          ? "hq"
          : "customer";
  const showTabs =
    appMode === "customer" && !["splash", "onboarding", "login", "location", "locationPermission", "complete", "paySuccess"].includes(screen);

  useEffect(() => {
    const handlePopState = () => setScreen(getInitialScreen());
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  useEffect(() => {
    let mounted = true;

    returnPassRepository.listFacilities().then((nextFacilities) => {
      if (!mounted || !nextFacilities.length) return;
      setFacilities(nextFacilities);
      setSelectedGym((current) => nextFacilities.find((facility) => facility.id === current.id) ?? nextFacilities[0]);
    });

    return () => {
      mounted = false;
    };
  }, []);

  const navigate = (next: ScreenId) => {
    setScreen(next);
    const url = new URL(window.location.href);
    url.searchParams.set("screen", next);
    window.history.pushState({ screen: next }, "", url);
    window.scrollTo(0, 0);
  };
  const selectGym = (gym: Facility) => {
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
  const openContent = (content: Content) => {
    setSelectedContent(content);
    navigate("contentDetail");
  };
  const toggleSavedContent = (content: Content) => {
    const exists = savedContentIds.includes(content.id);
    setSavedContentIds(exists ? savedContentIds.filter((id) => id !== content.id) : [...savedContentIds, content.id]);
    notify(exists ? "저장을 해제했어요" : "콘텐츠를 저장했어요");
  };
  const toggleCompletedContent = (content: Content) => {
    if (isContentLocked(content)) return;
    const exists = completedContentIds.includes(content.id);
    setCompletedContentIds(exists ? completedContentIds.filter((id) => id !== content.id) : [...completedContentIds, content.id]);
    notify(exists ? "완료를 해제했어요" : "완료로 표시했어요");
  };
  const handleDemoLogin = async () => {
    setAuthPending(true);

    try {
      const session = await signInDemoMember();
      notify(session.isFirebaseSession ? "Firebase 체험 계정으로 연결되었습니다" : "로컬 체험 모드로 시작합니다");
    } catch (error) {
      console.warn("Firebase 체험 로그인에 실패했습니다.", error);
      notify("Firebase 인증을 확인해주세요. 체험 모드로 시작합니다");
    } finally {
      setAuthPending(false);
      navigate("location");
    }
  };

  const filteredGyms = useMemo(() => {
    return facilities.filter((gym) => {
      const matchesCategory = selectedCategory === "all" || gym.category === selectedCategory;
      const matchesFilters =
        !selectedFilters.length || selectedFilters.every((filter) => gym.tags.includes(filter) || gym.hours.includes(filter) || gym.amenities.includes(filter));
      return matchesCategory && matchesFilters;
    });
  }, [selectedCategory, selectedFilters]);
  const trainerMatches = useMemo(
    () => rankTrainers(matchAnswers, ptTrainers, selectedGym.id),
    [matchAnswers, selectedGym.id]
  );
  const selectedTrainerMatch = trainerMatches.find((match) => match.trainer.id === selectedTrainer.id) ?? trainerMatches[0];

  const screenNode = (() => {
    switch (screen) {
      case "splash":
        return <SplashScreen navigate={navigate} />;
      case "onboarding":
        return <OnboardingScreen navigate={navigate} />;
      case "login":
        return <LoginScreen navigate={navigate} onDemoLogin={handleDemoLogin} authPending={authPending} />;
      case "location":
      case "locationPermission":
        return <LocationScreen navigate={navigate} facilities={facilities} />;
      case "home":
        return <HomeScreen navigate={navigate} selectGym={selectGym} setCategory={setSelectedCategory} facilities={facilities} openContent={openContent} />;
      case "search":
        return (
          <SearchScreen
            filters={selectedFilters}
            setFilters={setSelectedFilters}
            viewMode={viewMode}
            setViewMode={setViewMode}
            gyms={filteredGyms}
            selectGym={selectGym}
            category={selectedCategory}
            setCategory={setSelectedCategory}
          />
        );
      case "detail":
      case "facilityDetail":
        return <DetailScreen gym={selectedGym} navigate={navigate} />;
      case "plans":
      case "planSelect":
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
      case "paySuccess":
        return <CompleteScreen gym={selectedGym} plan={selectedPlan} navigate={navigate} />;
      case "pass":
      case "myPass":
        return <PassScreen gym={selectedGym} plan={selectedPlan} navigate={navigate} />;
      case "subscription":
      case "subscriptionManage":
        return <SubscriptionScreen plan={selectedPlan} openCancel={() => setShowCancelModal(true)} notify={notify} />;
      case "history":
      case "payHistory":
        return <HistoryScreen navigate={navigate} />;
      case "support":
        return <SupportScreen />;
      case "my":
      case "mypage":
        return <MyPage navigate={navigate} selectedGym={selectedGym} selectedPlan={selectedPlan} notify={notify} />;
      case "pt":
      case "ptMatchIntro":
        return <PtMatchIntroScreen navigate={navigate} />;
      case "ptMatchQuiz":
        return <PtMatchQuizScreen answers={matchAnswers} setAnswers={setMatchAnswers} navigate={navigate} />;
      case "ptMatchResult":
        return (
          <PtMatchResultScreen
            answers={matchAnswers}
            matches={trainerMatches.slice(0, 3)}
            selectTrainer={(trainer) => {
              setSelectedTrainer(trainer);
              navigate("trainerProfile");
            }}
            navigate={navigate}
          />
        );
      case "trainerProfile":
        return <TrainerProfileScreen match={selectedTrainerMatch} navigate={navigate} />;
      case "ptPlanSelect":
        return (
          <PtPlanSelectScreen
            trainer={selectedTrainer}
            selectedPlan={selectedPtPlan}
            setSelectedPlan={setSelectedPtPlan}
            navigate={navigate}
          />
        );
      case "ptCheckout":
        return (
          <PtCheckoutScreen
            trainer={selectedTrainer}
            plan={selectedPtPlan}
            facility={selectedGym}
            accepted={ptTermsAccepted}
            setAccepted={setPtTermsAccepted}
            navigate={navigate}
            notify={notify}
          />
        );
      case "myPt":
        return <MyPtScreen trainer={selectedTrainer} plan={selectedPtPlan} navigate={navigate} notify={notify} />;
      case "routine":
      case "aiRoutine":
        return <RoutineScreen notify={notify} />;
      case "diet":
      case "aiDiet":
        return <DietScreen navigate={navigate} />;
      case "contentHome":
        return (
          <ContentHomeScreen
            contents={contents}
            openContent={openContent}
            savedIds={savedContentIds}
            completedIds={completedContentIds}
          />
        );
      case "contentDetail":
        return (
          <ContentDetailScreen
            content={selectedContent}
            saved={savedContentIds.includes(selectedContent.id)}
            completed={completedContentIds.includes(selectedContent.id)}
            onToggleSave={() => toggleSavedContent(selectedContent)}
            onToggleComplete={() => toggleCompletedContent(selectedContent)}
            navigate={navigate}
            notify={notify}
          />
        );
      case "communityFeed":
        return <CommunityFeedScreen navigate={navigate} />;
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
      case "orderSuccess":
        return <ShopCompleteScreen product={selectedProduct} quantity={cartQuantity} navigate={navigate} />;
      case "adminHome":
      case "ownerHome":
        return <AdminHome navigate={navigate} notify={notify} />;
      case "adminMembers":
      case "ownerMembers":
        return <AdminMembers status={adminStatus} setStatus={setAdminStatus} navigate={navigate} notify={notify} />;
      case "adminQr":
      case "ownerQr":
        return <AdminQr result={qrResult} setResult={setQrResult} navigate={navigate} notify={notify} />;
      default:
        return <RoutePreviewScreen screen={screen} navigate={navigate} />;
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

const routePreviewCopy: Partial<
  Record<ScreenId, { eyebrow: string; title: string; description: string; actionLabel: string; actionScreen: ScreenId }>
> = {
  ptMatchIntro: {
    eyebrow: "PT MATCH",
    title: "나와 맞는 선생님 찾기",
    description: "운동 목표와 코칭 성향을 바탕으로 리턴패스 트레이너를 추천합니다.",
    actionLabel: "30초 진단 시작",
    actionScreen: "ptMatchQuiz"
  },
  ptMatchQuiz: {
    eyebrow: "1 / 10",
    title: "지금 가장 원하는 변화는?",
    description: "체중 감량, 근력 향상, 체형 교정 등 가장 중요한 목표부터 선택합니다.",
    actionLabel: "추천 결과 보기",
    actionScreen: "ptMatchResult"
  },
  ptMatchResult: {
    eyebrow: "MATCH RESULT",
    title: "김예림님과 잘 맞는 Top 3",
    description: "목표, 코칭 말투, 가능한 시간과 시설을 함께 반영한 추천 결과입니다.",
    actionLabel: "추천 트레이너 보기",
    actionScreen: "trainerProfile"
  },
  trainerProfile: {
    eyebrow: "TRAINER",
    title: "김도윤 트레이너",
    description: "감량과 운동 입문자를 위한 단계별 코칭을 제공하는 머슬팩토리 소속 트레이너입니다.",
    actionLabel: "PT 구독권 보기",
    actionScreen: "ptPlanSelect"
  },
  ptPlanSelect: {
    eyebrow: "PT SUBSCRIPTION",
    title: "내 일정에 맞는 PT 구독",
    description: "주 1회부터 주 3회까지 월 단위로 시작하고 남은 세션을 한눈에 관리합니다.",
    actionLabel: "PT 결제 확인",
    actionScreen: "ptCheckout"
  },
  ptCheckout: {
    eyebrow: "PT CHECKOUT",
    title: "PT 구독 결제 확인",
    description: "트레이너, 시설, 월 세션 수와 취소 정책을 확인한 뒤 구독을 시작합니다.",
    actionLabel: "내 PT 확인",
    actionScreen: "myPt"
  },
  myPt: {
    eyebrow: "MY PT",
    title: "다음 수업과 남은 세션",
    description: "예약 일정과 트레이너 피드백, 이번 달 남은 PT 세션을 모아봅니다.",
    actionLabel: "홈으로",
    actionScreen: "home"
  },
  communityPost: {
    eyebrow: "COMMUNITY",
    title: "오늘의 운동 인증",
    description: "내 시설 회원들의 운동 기록과 댓글을 한곳에서 확인합니다.",
    actionLabel: "피드로 돌아가기",
    actionScreen: "communityFeed"
  },
  communityWrite: {
    eyebrow: "WRITE",
    title: "운동 인증 남기기",
    description: "사진과 오늘의 루틴, 이용 시설 태그를 더해 가볍게 기록합니다.",
    actionLabel: "작성 완료",
    actionScreen: "communityFeed"
  },
  challengeList: {
    eyebrow: "CHALLENGE",
    title: "이번 달 챌린지",
    description: "출석과 루틴 달성으로 배지와 리턴샵 리워드를 모읍니다.",
    actionLabel: "대표 챌린지 보기",
    actionScreen: "challengeDetail"
  },
  challengeDetail: {
    eyebrow: "4 WEEKS",
    title: "4주 12회 출석 챌린지",
    description: "내 QR 입장 기록이 자동으로 반영되고 달성 현황을 바로 확인할 수 있습니다.",
    actionLabel: "커뮤니티로",
    actionScreen: "communityFeed"
  },
  ownerSales: {
    eyebrow: "OWNER SALES",
    title: "매출·정산",
    description: "시설 구독과 PT, 픽업 상품 매출을 정산 주기별로 확인합니다.",
    actionLabel: "사장님 홈",
    actionScreen: "ownerHome"
  },
  ownerPickup: {
    eyebrow: "PICKUP",
    title: "픽업 주문 관리",
    description: "인포데스크 수령 예정 주문과 준비 상태를 빠르게 처리합니다.",
    actionLabel: "사장님 홈",
    actionScreen: "ownerHome"
  },
  ownerFacility: {
    eyebrow: "FACILITY",
    title: "시설 운영 정보",
    description: "운영시간, 휴관일, 편의시설과 현재 혼잡도를 관리합니다.",
    actionLabel: "사장님 홈",
    actionScreen: "ownerHome"
  },
  trainerHome: {
    eyebrow: "TRAINER CONSOLE",
    title: "오늘의 PT 일정",
    description: "내 회원과 남은 세션, 수업 일정, 피드백 요청을 한눈에 확인합니다.",
    actionLabel: "회원 앱 홈",
    actionScreen: "home"
  },
  hqAdminHome: {
    eyebrow: "RETURNLIFE HQ",
    title: "리턴라이프 본사 대시보드",
    description: "시설 입점, 콘텐츠, 커머스, 신고와 핵심 운영 지표를 관리합니다.",
    actionLabel: "시설 심사 보기",
    actionScreen: "hqAdminFacilities"
  },
  hqAdminFacilities: {
    eyebrow: "HQ FACILITIES",
    title: "시설 입점 심사",
    description: "신규 시설의 계약과 운영 정보를 검토하고 활성 상태를 관리합니다.",
    actionLabel: "본사 홈",
    actionScreen: "hqAdminHome"
  },
  hqAdminContent: {
    eyebrow: "HQ CONTENT",
    title: "콘텐츠 발행 관리",
    description: "리턴라이프 영상과 아티클, 식단표의 검수와 발행 일정을 관리합니다.",
    actionLabel: "본사 홈",
    actionScreen: "hqAdminHome"
  },
  hqAdminCommerce: {
    eyebrow: "HQ COMMERCE",
    title: "상품·벤더 관리",
    description: "리턴샵 상품과 판매 주체, 주문 및 정산 상태를 확인합니다.",
    actionLabel: "본사 홈",
    actionScreen: "hqAdminHome"
  },
  hqAdminReports: {
    eyebrow: "HQ SAFETY",
    title: "신고 처리",
    description: "커뮤니티 신고와 자동 블라인드 항목을 우선순위별로 검토합니다.",
    actionLabel: "본사 홈",
    actionScreen: "hqAdminHome"
  }
};

function CommunityFeedScreen({ navigate }: { navigate: (screen: ScreenId) => void }) {
  const challenge = challenges[0];

  return (
    <div>
      <ScreenHeader
        title="함께 운동해요"
        eyebrow="RETURN COMMUNITY"
        action={
          <button type="button" onClick={() => navigate("communityWrite")} className="grid size-11 place-items-center rounded-full bg-brand text-lime shadow-soft" aria-label="운동 인증 작성">
            <Plus size={21} />
          </button>
        }
      />

      <button type="button" onClick={() => navigate("challengeDetail")} className="relative mb-6 min-h-[190px] w-full overflow-hidden rounded-[24px] text-left text-white shadow-glow">
        <SpriteVisual
          image={challenge.image}
          position={challenge.imagePosition}
          backgroundSize="auto 300%"
          label={`${challenge.title} 챌린지 배너`}
          className="absolute inset-0 h-full w-full"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-brand via-brand/80 to-brand/10" />
        <div className="relative flex items-start justify-between gap-4 p-5">
          <div>
            <Badge tone="lime">진행 중</Badge>
            <h2 className="mt-3 text-xl font-black">{challenge.title}</h2>
            <p className="mt-2 text-xs font-bold text-white/65">{challenge.participantCount}명 참여 · {challenge.reward}</p>
          </div>
          <Trophy size={32} className="shrink-0 text-lime" />
        </div>
      </button>

      <div className="mb-4 flex gap-2">
        {["전체", "내 시설", "챌린지"].map((tab, index) => (
          <button key={tab} type="button" className={cn("min-h-10 rounded-full px-4 text-xs font-black", index === 0 ? "bg-brand text-lime" : "bg-white text-zinc-500 ring-1 ring-black/5")}>
            {tab}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {communityPosts.slice(0, 4).map((post) => (
          <button key={post.id} type="button" onClick={() => navigate("communityPost")} className="w-full rounded-[20px] bg-white p-4 text-left shadow-soft ring-1 ring-black/5">
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-black">{post.authorName}</p>
              <Badge tone="gray">{post.type === "proof" ? "운동 인증" : post.type === "qna" ? "Q&A" : "커뮤니티"}</Badge>
            </div>
            <p className="mt-3 line-clamp-2 text-sm font-bold leading-6 text-zinc-600">{post.text}</p>
            <p className="mt-3 text-xs font-bold text-zinc-400">좋아요 {post.likes} · 댓글 {post.commentCount}</p>
          </button>
        ))}
      </div>
    </div>
  );
}

function RoutePreviewScreen({ screen, navigate }: { screen: ScreenId; navigate: (screen: ScreenId) => void }) {
  const copy = routePreviewCopy[screen] ?? {
    eyebrow: "RETURNPASS",
    title: "리턴패스 연결 화면",
    description: "시설 구독과 운동 관리를 하나의 흐름으로 연결합니다.",
    actionLabel: "홈으로",
    actionScreen: "home" as ScreenId
  };

  return (
    <div>
      <ScreenHeader title={copy.title} eyebrow={copy.eyebrow} />
      <Card className="bg-brand text-white">
        <div className="grid size-14 place-items-center rounded-[18px] bg-lime text-brand">
          {screen.startsWith("hqAdmin") || screen.startsWith("owner") ? <ShieldCheck size={27} /> : screen.startsWith("community") || screen.startsWith("challenge") ? <MessagesSquare size={27} /> : <Sparkles size={27} />}
        </div>
        <p className="mt-5 text-sm font-bold leading-6 text-white/72">{copy.description}</p>
        <Button className="mt-6 w-full" onClick={() => navigate(copy.actionScreen)}>
          {copy.actionLabel}
          <ChevronRight size={18} />
        </Button>
      </Card>
      <div className="mt-4 grid grid-cols-2 gap-3">
        <Stat label="데이터 소스" value="더미 리포지토리" tone="blue" />
        <Stat label="현재 상태" value="화면 연결 완료" tone="lime" />
      </div>
    </div>
  );
}

function SplashScreen({ navigate }: { navigate: (screen: ScreenId) => void }) {
  return (
    <div className="relative flex min-h-[640px] flex-col justify-between overflow-hidden rounded-[34px] bg-brand text-white shadow-glow">
      <img src="images/returnpass-onboarding-hero.png" alt="리턴패스 앱 프리뷰" className="absolute inset-0 h-full w-full object-cover object-[50%_44%] opacity-60" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(18,55,42,0.28)_0%,rgba(18,55,42,0.56)_42%,rgba(11,42,32,0.98)_100%)]" />
      <div className="relative p-5">
        <div className="flex items-center justify-between">
          <img src="brand/returnpass-icon-192.png" alt="리턴패스 로고" className="size-12 rounded-[18px] shadow-lift ring-1 ring-white/15" />
          <Badge tone="lime">통합 피트니스 구독</Badge>
        </div>
      </div>
      <div className="relative space-y-6 p-5">
        <div>
          <Badge tone="blue">진주 가좌동 · QR 입장</Badge>
          <h1 className="mt-5 text-[52px] font-black leading-none text-white">리턴패스</h1>
          <p className="mt-4 max-w-[320px] text-[27px] font-black leading-[1.12] text-white">운동으로 돌아오는 가장 쉬운 패스</p>
          <p className="mt-4 max-w-[310px] text-sm font-semibold leading-6 text-white/76">
            헬스·요가·필라테스를 한 달씩 구독하고 QR로 바로 입장하세요
          </p>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {["월구독", "동적 QR", "AI 루틴"].map((item) => (
            <div key={item} className="rounded-2xl bg-white/10 px-2 py-3 text-center text-xs font-black text-white ring-1 ring-white/10 backdrop-blur">
              {item}
            </div>
          ))}
        </div>
        <div className="space-y-3">
          <Button className="w-full" onClick={() => navigate("onboarding")}>
            30초 둘러보기
          </Button>
          <button type="button" onClick={() => navigate("login")} className="w-full rounded-[18px] px-5 py-3 text-sm font-black text-white/78 transition hover:bg-white/10">
            이미 계정이 있어요
          </button>
        </div>
      </div>
    </div>
  );
}

function OnboardingScreen({ navigate }: { navigate: (screen: ScreenId) => void }) {
  const [step, setStep] = useState(0);
  const steps = [
    {
      eyebrow: "MONTHLY PASS",
      title: "헬스부터 요가까지, 원하는 운동을 한 달씩",
      description: "가격과 거리, 운영시간을 비교하고 내 생활에 맞는 운동을 월 단위로 시작하세요.",
      tags: ["월구독", "종목 선택", "가까운 시설"],
      icon: <Dumbbell size={34} />,
      image: "images/returnpass-onboarding-hero.png"
    },
    {
      eyebrow: "SECURE CHECK-IN",
      title: "결제하면 QR 이용권이 바로 열립니다",
      description: "30초마다 갱신되는 동적 QR로 빠르고 안전하게 입장할 수 있습니다.",
      tags: ["동적 QR", "캡처 방지", "1회용 토큰"],
      icon: <QrCode size={34} />,
      image: "images/returnpass-qr-entry.png"
    },
    {
      eyebrow: "FITNESS CARE",
      title: "PT, 루틴, AI 식단까지 한 번에",
      description: "운동 목표에 맞춰 PT 상담, 주간 루틴, 맞춤 식단, 상품 주문까지 연결합니다.",
      tags: ["PT 신청", "운동 루틴", "AI 식단", "리턴샵"],
      icon: <Sparkles size={34} />,
      image: "images/returnpass-share-art.png"
    }
  ];
  const current = steps[step];
  const isLast = step === steps.length - 1;

  return (
    <div className="flex min-h-[640px] flex-col justify-between">
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <button type="button" onClick={() => navigate("location")} className="text-sm font-black text-gray-500">
            건너뛰기
          </button>
          <div className="flex gap-2" aria-label="온보딩 진행 상태">
            {steps.map((item, index) => (
              <span key={item.title} className={cn("h-2 rounded-full transition-all", index === step ? "w-9 bg-lime" : "w-2 bg-zinc-300")} />
            ))}
          </div>
        </div>
        <Card className="overflow-hidden bg-brand p-0 text-white">
          <div className="relative h-72">
            <img src={current.image} alt={current.title} className="absolute inset-0 h-full w-full object-cover object-[54%_40%] opacity-68" />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(18,55,42,0.06),rgba(11,42,32,0.94))]" />
            <div className="relative flex h-full flex-col justify-between p-5">
              <div className="flex items-center justify-between">
                <Badge tone="lime">{current.eyebrow}</Badge>
                <div className="grid size-14 place-items-center rounded-[20px] bg-white/12 text-lime ring-1 ring-white/15">
                  {current.icon}
                </div>
              </div>
              <div>
                <h1 className="text-[33px] font-black leading-[1.08]">{current.title}</h1>
                <p className="mt-3 text-sm font-semibold leading-6 text-white/72">{current.description}</p>
              </div>
            </div>
          </div>
          <div className="p-5">
            <p className="text-xs font-black text-white/48">STEP {step + 1} / {steps.length}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {current.tags.map((tag) => (
                <Badge key={tag} tone={tag.includes("QR") || tag.includes("AI") ? "blue" : "lime"}>{tag}</Badge>
              ))}
            </div>
          </div>
        </Card>
        <Card className="bg-white">
          <div className="grid grid-cols-3 gap-3">
            <InfoMini label="월구독" value="1개월" />
            <InfoMini label="입장" value="QR" />
            <InfoMini label="관리" value="통합" />
          </div>
        </Card>
      </div>
      <div className="grid grid-cols-[0.85fr_1.15fr] gap-3">
        <Button variant="line" onClick={() => (step === 0 ? navigate("splash") : setStep((currentStep) => currentStep - 1))}>
          이전
        </Button>
        <Button onClick={() => (isLast ? navigate("login") : setStep((currentStep) => currentStep + 1))}>
          {isLast ? "리턴패스 시작하기" : "다음"}
        </Button>
      </div>
    </div>
  );
}

function LoginScreen({
  navigate,
  onDemoLogin,
  authPending
}: {
  navigate: (screen: ScreenId) => void;
  onDemoLogin: () => Promise<void>;
  authPending: boolean;
}) {
  return (
    <div className="flex min-h-[640px] flex-col justify-between">
      <div className="space-y-5">
        <div className="relative overflow-hidden rounded-[32px] bg-black p-5 text-white shadow-glow">
          <img src="images/returnpass-onboarding-hero.png" alt="리턴패스 로그인 이미지" className="absolute inset-0 h-full w-full object-cover object-[50%_34%] opacity-34" />
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
        <Button className="w-full" onClick={onDemoLogin} disabled={authPending}>
          {authPending ? "Firebase 계정 연결 중..." : "김예림님으로 체험하기"}
        </Button>
        <button type="button" onClick={() => navigate("location")} className="flex min-h-12 w-full items-center justify-center rounded-[18px] bg-[#FEE500] px-5 py-3 text-sm font-black text-[#191919] shadow-soft transition active:scale-[0.98]">
          카카오로 계속하기
        </button>
        <Button variant="line" className="w-full" onClick={() => navigate("location")}>
          휴대폰 번호로 시작하기
        </Button>
        <Button variant="ghost" className="w-full" onClick={() => navigate("adminHome")}>
          사장님 계정 보기
        </Button>
      </div>
    </div>
  );
}

function LocationScreen({
  navigate,
  facilities
}: {
  navigate: (screen: ScreenId) => void;
  facilities: Facility[];
}) {
  return (
    <div className="flex min-h-[640px] flex-col justify-between">
      <div className="space-y-6">
        <ScreenHeader title="가까운 헬스장을 정확히 추천할게요" eyebrow="위치 권한 안내" />
        <Card className="overflow-hidden p-0">
          <div className="relative h-80 bg-zinc-950 text-white">
            <img src="images/returnpass-onboarding-hero.png" alt="위치 기반 운동 시설 추천" className="absolute inset-0 h-full w-full object-cover object-[63%_42%] opacity-55" />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.1),rgba(0,0,0,0.92))]" />
            <div className="relative flex h-full flex-col justify-between p-5">
              <div className="flex items-center justify-between">
                <Badge tone="lime">진주 가좌동</Badge>
                <div className="grid size-12 place-items-center rounded-full bg-white/12 ring-1 ring-white/20 backdrop-blur">
                  <LocateFixed size={24} />
                </div>
              </div>
              <div className="space-y-3">
                {facilities.slice(0, 2).map((gym) => (
                  <div key={gym.id} className="rounded-[22px] bg-white/12 p-3 ring-1 ring-white/15 backdrop-blur">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="font-black">{gym.name}</p>
                        <p className="mt-1 text-xs font-bold text-white/65">{gym.distance} · 월 {gym.monthlyPrice.toLocaleString("ko-KR")}원</p>
                      </div>
                      <Badge tone="blue">{gym.hours}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="space-y-4 p-5">
            <div className="rounded-[22px] bg-[#EEF4FF] p-4 ring-1 ring-blue/10">
              <Badge tone="blue">거리 계산 전용</Badge>
              <p className="mt-3 text-lg font-black leading-6 text-brand">거리 계산과 주변 헬스장 추천에만 사용됩니다</p>
              <p className="mt-2 text-sm font-semibold leading-6 text-gray-600">결제, 구독권, QR 토큰 정보와는 별도로 관리하며 더미 UI에서는 실제 위치를 저장하지 않습니다.</p>
            </div>
            <InfoRow label="예상 위치" value="진주 가좌동" icon={<Map size={17} />} />
            <InfoRow label="사용 목적" value="거리 계산 · 주변 추천" icon={<LocateFixed size={17} />} />
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

function HomeScreen({
  navigate,
  selectGym,
  setCategory,
  facilities,
  openContent
}: {
  navigate: (screen: ScreenId) => void;
  selectGym: (gym: Facility) => void;
  setCategory: (category: FacilityCategory | "all") => void;
  facilities: Facility[];
  openContent: (content: Content) => void;
}) {
  const todayRoutine = weeklyRoutine.days[1] ?? weeklyRoutine.days[0];
  const todayContents = contents.filter((content) => content.access !== "pt").slice(0, 3);
  const categoryIcons: Record<FacilityCategory, ReactNode> = {
    gym: <Dumbbell size={22} />,
    pilates: <Activity size={22} />,
    yoga: <Sparkles size={22} />,
    boxing: <ShieldCheck size={22} />,
    crossfit: <Zap size={22} />
  };
  const categoryOrder: FacilityCategory[] = ["gym", "pilates", "yoga", "boxing", "crossfit"];
  const categoryItems = categoryOrder.map((category) => ({
    category,
    label: facilityCategories.find((item) => item.id === category)?.label ?? category,
    icon: categoryIcons[category]
  }));

  const openCategory = (category: FacilityCategory) => {
    setCategory(category);
    navigate("search");
  };

  return (
    <div>
      <button
        type="button"
        onClick={() => navigate("search")}
        className="flex min-h-14 w-full items-center gap-3 rounded-[18px] bg-white px-4 text-left shadow-soft ring-1 ring-black/5"
      >
        <Search size={22} className="shrink-0 text-brand" />
        <span className="flex-1 text-sm font-bold text-zinc-400">어떤 운동을 찾으세요?</span>
        <SlidersHorizontal size={19} className="text-zinc-400" />
      </button>

      <section className="mt-5">
        <div className="grid grid-cols-6 gap-2">
          {categoryItems.slice(0, 3).map((item, index) => (
            <button
              key={item.category}
              type="button"
              onClick={() => openCategory(item.category)}
              className={cn(
                "col-span-2 flex min-h-[82px] flex-col items-center justify-center gap-2 rounded-[16px] text-[11px] font-black shadow-soft ring-1 ring-black/5",
                index === 0 ? "bg-lime" : "bg-white"
              )}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
          <button type="button" onClick={() => navigate("ptMatchIntro")} className="col-span-2 flex min-h-[82px] flex-col items-center justify-center gap-2 rounded-[16px] bg-white text-[11px] font-black shadow-soft ring-1 ring-black/5">
            <UserCheck size={22} />
            PT
          </button>
          {categoryItems.slice(3).map((item) => (
            <button key={item.category} type="button" onClick={() => openCategory(item.category)} className="col-span-2 flex min-h-[82px] flex-col items-center justify-center gap-2 rounded-[16px] bg-white text-[11px] font-black shadow-soft ring-1 ring-black/5">
              {item.icon}
              {item.label}
            </button>
          ))}
        </div>
      </section>

      <button type="button" onClick={() => navigate("myPass")} className="mt-5 flex w-full items-center gap-4 rounded-[18px] bg-brand px-4 py-4 text-left text-white shadow-soft">
        <Badge tone="lime">이용중</Badge>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-black">{activePass.planName}</p>
          <p className="mt-1 truncate text-xs font-bold text-white/60">{activePass.gymName}</p>
        </div>
        <div className="flex items-center gap-2 text-sm font-black text-lime">
          <QrCode size={22} />
          QR 입장
          <ChevronRight size={17} />
        </div>
      </button>

      <button type="button" onClick={() => navigate("search")} className="mt-5 grid w-full grid-cols-[1fr_128px] overflow-hidden rounded-[18px] bg-white text-left shadow-soft ring-1 ring-black/5">
        <div className="p-5">
          <Badge tone="lime">월 단위 구독</Badge>
          <h1 className="mt-3 text-[23px] font-black leading-[1.18]">헬스부터 요가까지,<br />원하는 운동을 한 달씩</h1>
          <p className="mt-3 text-xs font-bold leading-5 text-zinc-500">가격과 거리, 운영시간을 비교하고 가볍게 시작하세요.</p>
        </div>
        <img src="images/returnpass-onboarding-hero.png" alt="" className="h-full min-h-[170px] w-full object-cover" />
      </button>

      <section className="mt-8">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-black text-blue">진주 가좌동 기준</p>
            <h2 className="mt-1 text-[25px] font-black">내 주변 운동시설</h2>
          </div>
          <button type="button" onClick={() => navigate("search")} className="flex items-center gap-1 text-sm font-black text-brand">
            지도 보기
            <MapPin size={17} />
          </button>
        </div>
        <div className="scrollbar-none mt-4 flex gap-2 overflow-x-auto pb-1">
          {["가까운 순", "월 가격", "24시간", "주차"].map((filter, index) => (
            <button key={filter} type="button" onClick={() => navigate("search")} className={cn("flex shrink-0 items-center gap-1 rounded-full px-4 py-2.5 text-xs font-black ring-1", index === 0 ? "bg-brand text-white ring-brand" : "bg-white text-zinc-600 ring-black/5")}>
              {filter}
              {index < 2 ? <ChevronDown size={14} /> : null}
            </button>
          ))}
        </div>
        <div className="mt-2 divide-y divide-black/5">
          {facilities.slice(0, 5).map((gym) => (
            <GymCard key={gym.id} gym={gym} onClick={() => selectGym(gym)} />
          ))}
        </div>
        <Button variant="line" className="mt-4 w-full" onClick={() => navigate("search")}>
          운동시설 전체 보기
          <ChevronRight size={17} />
        </Button>
      </section>

      <section className="mt-8 grid grid-cols-2 gap-3">
        <button type="button" onClick={() => navigate("aiRoutine")} className="rounded-[18px] bg-brand p-4 text-left text-white shadow-soft">
          <Activity size={22} className="text-lime" />
          <p className="mt-4 text-xs font-bold text-white/60">오늘의 루틴</p>
          <p className="mt-1 text-lg font-black">{todayRoutine.focus} · 45분</p>
        </button>
        <button type="button" onClick={() => navigate("aiDiet")} className="rounded-[18px] bg-white p-4 text-left shadow-soft ring-1 ring-black/5">
          <Utensils size={22} className="text-blue" />
          <p className="mt-4 text-xs font-bold text-zinc-400">오늘의 식단</p>
          <p className="mt-1 text-lg font-black">{dietRecommendation.calories}</p>
        </button>
      </section>

      <section className="mt-8">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-black text-blue">RETURNLIFE CONTENT</p>
            <h2 className="mt-1 text-[25px] font-black">오늘 볼 콘텐츠</h2>
          </div>
          <button type="button" onClick={() => navigate("contentHome")} className="flex items-center gap-1 text-sm font-black text-brand">
            전체 보기
            <ChevronRight size={17} />
          </button>
        </div>
        <div className="scrollbar-none mt-4 flex gap-3 overflow-x-auto pb-1">
          {todayContents.map((content) => (
            <button
              key={content.id}
              type="button"
              onClick={() => openContent(content)}
              className="w-[220px] shrink-0 overflow-hidden rounded-[20px] bg-white text-left shadow-soft ring-1 ring-black/5 transition active:scale-[0.99]"
            >
              <div className="relative">
                <ContentThumbnail content={content} className="h-28 w-full" />
                <span className="absolute left-3 top-3">
                  <Badge tone="lime">{contentTypeLabel[content.type]}</Badge>
                </span>
              </div>
              <div className="p-4">
                <p className="truncate text-sm font-black">{content.title}</p>
                <p className="mt-2 text-xs font-bold text-zinc-500">{content.level} · {content.durationMin}분</p>
              </div>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}

function SearchScreen({
  filters: activeFilters,
  setFilters,
  viewMode,
  setViewMode,
  gyms: visibleGyms,
  selectGym,
  category,
  setCategory
}: {
  filters: string[];
  setFilters: (filters: string[]) => void;
  viewMode: "list" | "map";
  setViewMode: (mode: "list" | "map") => void;
  gyms: Facility[];
  selectGym: (gym: Facility) => void;
  category: FacilityCategory | "all";
  setCategory: (category: FacilityCategory | "all") => void;
}) {
  const [query, setQuery] = useState("");
  const [sortMode, setSortMode] = useState<"distance" | "price">("distance");
  const toggleFilter = (filter: string) => {
    setFilters(activeFilters.includes(filter) ? activeFilters.filter((item) => item !== filter) : [...activeFilters, filter]);
  };
  const results = [...visibleGyms]
    .filter((gym) => `${gym.name} ${gym.location} ${gym.tags.join(" ")}`.toLowerCase().includes(query.trim().toLowerCase()))
    .sort((a, b) => (sortMode === "price" ? a.monthlyPrice - b.monthlyPrice : Number.parseFloat(a.distance) - Number.parseFloat(b.distance)));

  return (
    <div>
      <ScreenHeader
        title="운동시설 찾기"
        eyebrow="진주 가좌동"
        action={
          <button className="grid size-11 place-items-center rounded-full bg-white shadow-soft" type="button" aria-label="상세 필터">
            <SlidersHorizontal size={20} />
          </button>
        }
      />
      <div className="flex min-h-14 items-center gap-3 rounded-[18px] bg-white px-4 shadow-soft ring-1 ring-black/5">
        <Search size={20} className="text-gray-400" />
        <input value={query} onChange={(event) => setQuery(event.target.value)} className="min-w-0 flex-1 bg-transparent text-sm font-bold outline-none placeholder:text-gray-400" placeholder="시설명, 지역, 운동 종목 검색" />
      </div>

      <div className="scrollbar-none mt-4 flex gap-2 overflow-x-auto pb-1">
        <button type="button" onClick={() => setCategory("all")} className={cn("shrink-0 rounded-full px-4 py-2.5 text-xs font-black ring-1", category === "all" ? "bg-brand text-white ring-brand" : "bg-white text-zinc-600 ring-black/5")}>
          전체
        </button>
        {facilityCategories.map((item) => (
          <button key={item.id} type="button" onClick={() => setCategory(item.id)} className={cn("shrink-0 rounded-full px-4 py-2.5 text-xs font-black ring-1", category === item.id ? "bg-brand text-white ring-brand" : "bg-white text-zinc-600 ring-black/5")}>
            {item.label}
          </button>
        ))}
      </div>

      <div className="scrollbar-none mt-3 flex gap-2 overflow-x-auto pb-1">
        <button type="button" onClick={() => setSortMode("distance")} className={cn("flex shrink-0 items-center gap-1 rounded-full px-4 py-2.5 text-xs font-black ring-1", sortMode === "distance" ? "bg-lime text-brand ring-lime" : "bg-white text-zinc-600 ring-black/5")}>
          가까운 순
          <ChevronDown size={14} />
        </button>
        <button type="button" onClick={() => setSortMode("price")} className={cn("flex shrink-0 items-center gap-1 rounded-full px-4 py-2.5 text-xs font-black ring-1", sortMode === "price" ? "bg-lime text-brand ring-lime" : "bg-white text-zinc-600 ring-black/5")}>
          월 가격
          <ChevronDown size={14} />
        </button>
        {filters.filter((filter) => ["24시", "주차 가능", "여성전용", "샤워실"].includes(filter)).map((filter) => {
          const active = activeFilters.includes(filter);
          return (
            <button
              key={filter}
              type="button"
              onClick={() => toggleFilter(filter)}
              className={cn(
                "shrink-0 rounded-full px-4 py-2.5 text-xs font-black ring-1 transition",
                active ? "bg-lime text-brand ring-lime" : "bg-white text-gray-600 ring-black/5"
              )}
            >
              {filter}
            </button>
          );
        })}
      </div>

      <div className="mt-5 flex items-center justify-between gap-4">
        <div>
          <p className="text-xs font-bold text-zinc-400">검색 결과</p>
          <p className="mt-1 text-xl font-black">{results.length}개의 운동시설</p>
        </div>
        <div className="grid grid-cols-2 rounded-[14px] bg-white p-1 shadow-soft ring-1 ring-black/5">
        {(["list", "map"] as const).map((mode) => (
          <button
            key={mode}
            type="button"
            onClick={() => setViewMode(mode)}
              className={cn("rounded-[11px] px-3 py-2 text-xs font-black", viewMode === mode ? "bg-brand text-lime" : "text-gray-500")}
          >
              {mode === "list" ? "목록" : "지도"}
          </button>
        ))}
        </div>
      </div>

      {viewMode === "map" ? <div className="mt-4"><MapPlaceholder /></div> : null}
      <div className="mt-3 divide-y divide-black/5">
        {results.map((gym) => (
          <GymCard key={gym.id} gym={gym} onClick={() => selectGym(gym)} compact />
        ))}
      </div>
      {!results.length ? (
        <div className="mt-5 rounded-[18px] bg-white px-5 py-10 text-center shadow-soft ring-1 ring-black/5">
          <Search size={28} className="mx-auto text-zinc-300" />
          <p className="mt-3 text-sm font-black">조건에 맞는 운동시설이 없습니다</p>
          <button type="button" onClick={() => { setCategory("all"); setFilters([]); setQuery(""); }} className="mt-3 text-xs font-black text-blue">
            필터 초기화
          </button>
        </div>
      ) : null}
    </div>
  );
}

function DetailScreen({ gym, navigate }: { gym: Facility; navigate: (screen: ScreenId) => void }) {
  return (
    <div className="space-y-5">
      <ScreenHeader title={gym.name} eyebrow="헬스장 상세" onBack={() => navigate("home")} />
      <section className="overflow-hidden rounded-[30px] bg-white shadow-soft">
        <div className="relative h-72">
          <img src={gym.image} alt={`${gym.name} 이미지`} className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(18,55,42,0.05),rgba(11,42,32,0.88))]" />
          <div className="relative flex h-full flex-col justify-between p-5 text-white">
            <div className="flex flex-wrap gap-2">
              <Badge tone="lime">오늘 결제하면 바로 이용 가능</Badge>
              <Badge tone="blue">평점 {gym.rating}</Badge>
            </div>
            <div>
              <h2 className="text-[31px] font-black leading-tight">{gym.name}</h2>
              <p className="mt-2 text-sm font-bold text-white/72">{gym.distance} · {gym.hours} · {gym.location}</p>
            </div>
          </div>
        </div>
        <div className="p-5">
          <p className="text-sm font-bold text-gray-500">월 구독 시작가</p>
          <h3 className="mt-1 text-4xl font-black">{formatWon(gym.monthlyPrice)}</h3>
          <div className="mt-4 grid grid-cols-3 gap-3">
            <InfoMini label="거리" value={gym.distance} />
            <InfoMini label="운영" value={gym.hours} />
            <InfoMini label="평점" value={`${gym.rating}`} />
          </div>
        </div>
      </section>
      <Card className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-black">시설 정보</h3>
          <Badge tone="gray">구독 포함</Badge>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {gym.facilities.slice(0, 5).map((facility) => (
            <div key={facility} className="flex min-h-16 items-center gap-3 rounded-[18px] bg-gray-50 p-3">
              <CheckCircle2 className="shrink-0 text-blue" size={18} />
              <p className="text-sm font-black leading-5 text-gray-700">{facility}</p>
            </div>
          ))}
        </div>
      </Card>
      <Card>
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-black">트레이너 미리보기</h3>
          <button type="button" onClick={() => navigate("pt")} className="text-sm font-black text-blue">
            PT 보기
          </button>
        </div>
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
      <Card className="space-y-3 border border-blue/10 bg-[#EEF4FF]">
        <div className="flex items-start gap-3">
          <ShieldCheck className="mt-0.5 shrink-0 text-blue" size={22} />
          <div>
            <h3 className="font-black text-brand">구독 전 확인 사항</h3>
            <p className="mt-1 text-sm font-semibold leading-6 text-gray-600">결제 전에 이용 방식과 환불 기준을 확인해 주세요.</p>
          </div>
        </div>
        <InfoRow label="입장 방식" value="QR 이용권으로 입장" icon={<QrCode size={17} />} />
        <InfoRow label="해지 후 이용" value="현재 이용 기간까지 사용 가능" icon={<CalendarDays size={17} />} />
        <InfoRow label="환불 기준" value="입장 기록과 이용 기간 기준 안내" icon={<ReceiptText size={17} />} />
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
      <Card className="bg-brand text-white">
        <Badge tone="lime">QR PASS INCLUDED</Badge>
        <h2 className="mt-4 text-2xl font-black leading-tight">선택한 구독권은 결제 완료 즉시 QR 이용권으로 바뀝니다</h2>
        <p className="mt-3 text-sm font-semibold leading-6 text-white/70">모든 구독권은 QR 입장, 해지 예약, 결제 내역 기록을 기본으로 포함합니다.</p>
      </Card>
      {plans.map((plan) => {
        const selected = selectedPlan.id === plan.id;
        const benefitItems = Array.from(new Set([...plan.benefits, "QR 입장 포함", "해지 예약 가능", "결제 내역 자동 기록"]));
        return (
          <button key={plan.id} type="button" onClick={() => setSelectedPlan(plan)} className="block w-full text-left">
            <Card className={cn("border-2 transition", selected ? "border-lime bg-white shadow-lift ring-lime/30" : "border-transparent")}>
              <div className="mb-4 flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-black">{plan.name}</h2>
                    {plan.recommended ? <Badge tone="lime">첫 시작 추천</Badge> : null}
                  </div>
                  <p className="mt-1 text-sm font-semibold text-gray-500">{plan.description}</p>
                </div>
                <div className={cn("grid size-9 place-items-center rounded-full", selected ? "bg-lime text-brand" : "bg-gray-100 text-gray-400")}>
                  <Check size={19} />
                </div>
              </div>
              <div className="mb-4 flex items-end justify-between gap-4">
                <p className="text-3xl font-black">{formatWon(plan.price)}</p>
                <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-black text-gray-600">월 단위</span>
              </div>
              <Checklist items={benefitItems} />
            </Card>
          </button>
        );
      })}
      <div className="sticky bottom-2 z-10 rounded-[24px] bg-white/90 p-2 shadow-lift backdrop-blur">
        <Button className="w-full" onClick={() => navigate("checkout")}>
          선택한 구독권 결제하기
        </Button>
      </div>
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
  gym: Facility;
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
      <Card className="bg-brand text-white">
        <div className="flex items-start justify-between gap-4">
          <div>
            <Badge tone="lime">더미 결제</Badge>
            <h2 className="mt-4 text-3xl font-black">{formatWon(plan.price)}</h2>
            <p className="mt-2 text-sm font-semibold text-white/70">실제 결제는 진행되지 않는 더미 결제입니다</p>
          </div>
          <CreditCard className="shrink-0 text-lime" size={32} />
        </div>
      </Card>
      <Card className="space-y-3">
        <h2 className="text-lg font-black">결제 요약</h2>
        <InfoRow label="헬스장명" value={gym.name} />
        <InfoRow label="구독권명" value={plan.name} />
        <InfoRow label="결제 금액" value={formatWon(plan.price)} icon={<CircleDollarSign size={17} />} />
        <InfoRow label="다음 결제 예정일" value="2026.06.20" icon={<CalendarDays size={17} />} />
        <InfoRow label="이용 시작일" value="2026.05.20" />
        <InfoRow label="이용 종료일" value="2026.06.19" />
      </Card>
      <Card className="space-y-3 border border-blue/10 bg-[#EEF4FF]">
        <div className="flex items-start gap-3">
          <QrCode className="mt-0.5 shrink-0 text-blue" size={22} />
          <div>
            <h2 className="font-black text-brand">QR 발급 예정</h2>
            <p className="mt-1 text-sm font-bold leading-6 text-gray-600">결제 완료 즉시 동적 QR 이용권이 발급됩니다</p>
          </div>
        </div>
        <InfoRow label="갱신" value="QR은 30초마다 갱신됩니다" icon={<RefreshCw size={17} />} />
        <InfoRow label="보안" value="캡처한 QR은 사용할 수 없습니다" icon={<ShieldCheck size={17} />} />
      </Card>
      <Card>
        <h2 className="mb-4 text-lg font-black">환불/해지 요약</h2>
        <Checklist
          items={[
            "해지 예약 후에도 현재 이용 종료일까지 사용할 수 있습니다.",
            "환불 가능 여부는 입장 기록과 이용 기간을 기준으로 안내됩니다.",
            "다음 결제 예정일 전 해지하면 다음 달 자동 결제가 중단됩니다."
          ]}
        />
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
          <input checked={acceptedTerms} onChange={(event) => setAcceptedTerms(event.target.checked)} type="checkbox" className="mt-1 size-5 accent-[#12372A]" />
          <span className="text-sm font-bold leading-6 text-gray-700">정기결제, 환불 규정, 개인정보 처리 안내를 확인했습니다.</span>
        </label>
      </Card>
      <Button className="w-full" onClick={pay}>
        {formatWon(plan.price)} 결제하기
      </Button>
    </div>
  );
}

function CompleteScreen({ gym, plan, navigate }: { gym: Facility; plan: Plan; navigate: (screen: ScreenId) => void }) {
  return (
    <div className="flex min-h-[640px] flex-col justify-center space-y-6 text-center">
      <div className="mx-auto grid size-28 place-items-center rounded-full bg-lime text-brand shadow-lift">
        <CheckCircle2 size={58} strokeWidth={2.4} />
      </div>
      <div>
        <Badge tone="blue">결제 완료</Badge>
        <h1 className="mt-4 text-3xl font-black">구독권이 발급되었습니다</h1>
        <p className="mt-3 text-sm font-semibold leading-6 text-gray-500">이제 QR 이용권을 직원에게 보여주고 바로 입장할 수 있어요.</p>
      </div>
      <Card className="w-full space-y-3 text-left">
        <InfoRow label="헬스장명" value={gym.name} />
        <InfoRow label="구독권" value={plan.name} />
        <InfoRow label="이용 시작일" value="2026.05.20" />
        <InfoRow label="이용 종료일" value="2026.06.19" />
      </Card>
      <Card className="overflow-hidden bg-brand p-0 text-white">
        <div className="p-5">
          <Badge tone="lime">QR 이용권 미리보기</Badge>
          <div className="mt-5 grid grid-cols-[92px_1fr] items-center gap-4 text-left">
            <div className="qr-pattern grid size-24 place-items-center rounded-[22px] bg-white">
              <QrCode className="text-brand" size={54} />
            </div>
            <div>
              <p className="text-sm font-black">{activePass.maskedToken}</p>
              <p className="mt-2 text-xs font-semibold leading-5 text-white/65">30초마다 새 QR 생성 · 1회 스캔 후 폐기</p>
            </div>
          </div>
        </div>
      </Card>
      <Card className="space-y-3 text-left">
        <h2 className="text-lg font-black">QR 보안 안내</h2>
        <InfoRow label="갱신 주기" value="30초마다 새 QR 생성" icon={<RefreshCw size={17} />} />
        <InfoRow label="사용 정책" value="1회 스캔 후 폐기" icon={<KeyRound size={17} />} />
      </Card>
      <div className="grid grid-cols-1 gap-3">
        <Button className="w-full" onClick={() => navigate("pass")}>
          내 QR 이용권 확인하기
        </Button>
        <Button variant="line" className="w-full" onClick={() => navigate("home")}>
          홈으로 이동
        </Button>
      </div>
    </div>
  );
}

function PassScreen({ gym, navigate }: { gym: Facility; plan: Plan; navigate: (screen: ScreenId) => void }) {
  const [remaining, setRemaining] = useState(30);
  const [issueNumber, setIssueNumber] = useState(8214);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setRemaining((current) => {
        if (current <= 1) {
          setIssueNumber((seed) => seed + 1);
          return 30;
        }

        return current - 1;
      });
    }, 1000);

    return () => window.clearInterval(timer);
  }, []);

  const seconds = remaining.toString().padStart(2, "0");
  const progress = `${(remaining / 30) * 100}%`;
  const refreshMessage = issueNumber > 8214 && remaining > 28 ? "새 QR이 발급되었습니다" : "현재 QR이 활성화되어 있습니다";

  return (
    <div className="space-y-5">
      <ScreenHeader title="내 이용권" eyebrow="동적 QR 토큰" />
      <Card className="overflow-hidden bg-brand p-0 text-white">
        <img src={gym.image} alt={`${gym.name} 이용권`} className="h-32 w-full object-cover opacity-80" />
        <div className="p-5">
          <div className="flex items-center justify-between gap-3">
            <Badge tone="lime">이용중</Badge>
            <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-black text-white/70">{activePass.planName}</span>
          </div>
          <h2 className="mt-4 text-2xl font-black">{activePass.gymName}</h2>
          <p className="mt-1 text-sm font-bold text-white/62">{activePass.expiresAt}까지 · 서버 검증용 임시 토큰 사용</p>
        </div>
      </Card>

      <Card className="space-y-5 text-center">
        <div className="flex items-center justify-between gap-3 text-left">
          <Badge tone="lime">동적 QR 이용권</Badge>
          <span className="rounded-full bg-[#EEF4FF] px-3 py-1 text-[11px] font-black text-blue">{refreshMessage}</span>
        </div>
        <div className="mx-auto flex size-56 flex-col items-center justify-center rounded-[32px] border-8 border-white bg-[linear-gradient(145deg,#12372A,#0B2A20)] shadow-inner ring-1 ring-brand/10">
          <div className="qr-pattern grid size-40 place-items-center rounded-[22px] bg-white">
            <QrCode size={90} className="text-brand" />
          </div>
          <p className="mt-3 rounded-full bg-lime px-3 py-1 text-[11px] font-black text-brand">
            checkin_token: {activePass.maskedToken}
          </p>
          <p className="mt-2 text-[10px] font-black text-white/50">발급 회차 #{issueNumber}</p>
        </div>
        <div className="flex items-center justify-center gap-2 text-brand">
          <Clock size={18} />
          <p className="text-3xl font-black">남은 시간 00:{seconds}</p>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-gray-100">
          <div className="h-full rounded-full bg-lime transition-all" style={{ width: progress }} />
        </div>
        <div className="grid grid-cols-2 gap-3 text-left">
          <InfoMini label="회원명" value={activePass.memberName} />
          <InfoMini label="회원번호" value={activePass.memberId} />
          <InfoMini label="이용권" value={activePass.planName} />
          <InfoMini label="이용 지점" value={activePass.gymName} />
          <InfoMini label="남은 기간" value={activePass.remainingDays} />
          <InfoMini label="다음 결제일" value={activePass.nextBillingDate} />
        </div>
      </Card>

      <Card className="space-y-3 border border-blue/10 bg-[#EEF4FF]">
        <div className="flex items-start gap-3">
          <LockKeyhole className="mt-0.5 shrink-0 text-blue" size={22} />
          <div>
            <h3 className="font-black text-brand">QR 보안 안내</h3>
            <p className="mt-1 text-sm font-bold leading-6 text-gray-600">QR에는 회원권 ID가 아닌 서버 검증용 임시 토큰만 포함됩니다</p>
          </div>
        </div>
        <InfoRow label="갱신 주기" value="30초마다 새 QR이 생성됩니다" icon={<RefreshCw size={17} />} />
        <InfoRow label="캡처 방지" value="캡처한 QR은 사용할 수 없습니다" icon={<ShieldCheck size={17} />} />
        <InfoRow label="토큰 정책" value="QR은 1회 스캔 후 즉시 폐기됩니다" icon={<KeyRound size={17} />} />
      </Card>

      <Card className="space-y-3">
        <div className="flex items-start gap-3">
          <AlertCircle className="mt-0.5 shrink-0 text-rose-500" size={22} />
          <div>
            <h3 className="font-black text-brand">부정사용 방지 안내</h3>
            <ul className="mt-3 space-y-2 text-sm font-bold leading-6 text-gray-600">
              <li>화면 캡처본은 입장에 사용할 수 없습니다.</li>
              <li>직원 스캔 시 서버에서 실시간으로 유효성을 확인합니다.</li>
              <li>이미 사용된 QR은 다시 사용할 수 없습니다.</li>
            </ul>
          </div>
        </div>
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
  selectedGym: Facility;
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
      <MenuButton icon={<Dumbbell size={20} />} label="PT 매칭 시작" onClick={() => navigate("ptMatchIntro")} />
      <MenuButton icon={<Activity size={20} />} label="운동 루틴 보기" onClick={() => navigate("routine")} />
      <MenuButton icon={<Utensils size={20} />} label="AI 식단 맞춤" onClick={() => navigate("diet")} />
      <MenuButton icon={<ShoppingBag size={20} />} label="리턴샵 상품 구매" onClick={() => navigate("shop")} />
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

const ptQuizQuestions: Array<{
  key: keyof MatchAnswers;
  eyebrow: string;
  title: string;
  description: string;
  options: string[];
}> = [
  {
    key: "goal",
    eyebrow: "운동 목표",
    title: "지금 가장 원하는 변화는?",
    description: "가장 우선하고 싶은 목표 하나를 골라주세요.",
    options: ["체중감량", "근력·벌크업", "체형교정·자세", "통증·재활", "체력·컨디션"]
  },
  {
    key: "level",
    eyebrow: "운동 경험",
    title: "운동을 얼마나 해보셨나요?",
    description: "처음 배우는 단계부터 숙련자까지 수업 난이도에 반영해요.",
    options: ["입문", "6개월↓", "1년↑", "3년↑"]
  },
  {
    key: "intensity",
    eyebrow: "운동 강도",
    title: "어떤 강도가 가장 잘 맞나요?",
    description: "지치지 않고 이어갈 수 있는 리듬을 선택하세요.",
    options: ["몰아치는 고강도", "꾸준한 중강도", "천천히 점진적"]
  },
  {
    key: "tone",
    eyebrow: "코칭 말투",
    title: "선생님이 어떻게 말해주면 좋나요?",
    description: "수업에서 동기부여를 받는 방식을 알려주세요.",
    options: ["직설·푸시형", "담백·프로형", "다정·응원형"]
  },
  {
    key: "teach",
    eyebrow: "설명 방식",
    title: "운동 설명은 어느 정도가 좋나요?",
    description: "배우는 방식이 맞아야 혼자 운동할 때도 오래 남아요.",
    options: ["원리까지 설명", "핵심만", "따라하기"]
  },
  {
    key: "diet",
    eyebrow: "식단 관리",
    title: "식단 피드백도 필요하신가요?",
    description: "원하는 관리 범위에 맞춰 트레이너를 추천해요.",
    options: ["매일 체크해주길", "주 1회 피드백", "운동만"]
  },
  {
    key: "time",
    eyebrow: "가능 시간",
    title: "주로 언제 운동할 수 있나요?",
    description: "실제로 예약 가능한 시간대가 겹치는지 확인해요.",
    options: ["새벽", "오전", "오후", "야간", "주말"]
  },
  {
    key: "genderPref",
    eyebrow: "선생님 성별",
    title: "선호하는 선생님 성별이 있나요?",
    description: "선택하지 않아도 추천 품질에는 문제가 없어요.",
    options: ["여성", "남성", "무관"]
  },
  {
    key: "care",
    eyebrow: "케어 부위",
    title: "운동할 때 불편한 부위가 있나요?",
    description: "관련 지도 경험이 있는 트레이너를 우선 반영해요.",
    options: ["무릎", "허리", "어깨", "목", "없음"]
  }
];

function TrainerPortrait({
  trainer,
  className
}: {
  trainer: Trainer;
  className?: string;
}) {
  return (
    <div
      role="img"
      aria-label={`${trainer.name} 일러스트`}
      className={cn("bg-cover bg-no-repeat", className)}
      style={{
        backgroundImage: `url("${trainer.image}")`,
        backgroundPosition: trainer.imagePosition,
        backgroundSize: "400% 200%"
      }}
    />
  );
}

function PtMatchIntroScreen({ navigate }: { navigate: (screen: ScreenId) => void }) {
  return (
    <div>
      <ScreenHeader title="나와 맞는 선생님 찾기" eyebrow="RETURN PT MATCH" />

      <section className="relative overflow-hidden rounded-[24px] bg-brand p-5 text-white shadow-glow">
        <div className="relative z-10 max-w-[62%]">
          <Badge tone="lime">30초 진단</Badge>
          <h1 className="mt-4 text-[27px] font-black leading-[1.18]">시설보다 먼저,<br />나와 맞는 사람부터</h1>
          <p className="mt-3 text-sm font-bold leading-6 text-white/68">목표와 성향, 가능한 시간을 분석해 추천 이유가 분명한 트레이너를 찾아드려요.</p>
        </div>
        <TrainerPortrait trainer={ptTrainers[0]} className="absolute -bottom-5 -right-9 h-[250px] w-[190px]" />
      </section>

      <section className="mt-6">
        <p className="text-xs font-black text-blue">매칭에 반영되는 것</p>
        <div className="mt-3 grid grid-cols-3 gap-2">
          {[
            { icon: <Target size={20} />, label: "운동 목표" },
            { icon: <MessageCircle size={20} />, label: "코칭 성향" },
            { icon: <Clock size={20} />, label: "가능 시간" }
          ].map((item) => (
            <div key={item.label} className="flex min-h-[96px] flex-col items-center justify-center gap-3 rounded-[18px] bg-white text-xs font-black shadow-soft ring-1 ring-black/5">
              <span className="text-brand">{item.icon}</span>
              {item.label}
            </div>
          ))}
        </div>
      </section>

      <section className="mt-7 space-y-3">
        {[
          ["01", "10문항 진단", "한 화면에서 하나씩 가볍게 선택"],
          ["02", "매칭률과 추천 근거", "Top 3와 잘 맞는 이유를 함께 확인"],
          ["03", "월 단위 PT 구독", "주 1회부터 부담 없이 시작"]
        ].map(([number, title, body]) => (
          <div key={number} className="flex items-center gap-4 rounded-[18px] bg-white p-4 shadow-soft ring-1 ring-black/5">
            <span className="grid size-10 shrink-0 place-items-center rounded-full bg-lime text-xs font-black text-brand">{number}</span>
            <div>
              <p className="text-sm font-black">{title}</p>
              <p className="mt-1 text-xs font-bold text-zinc-500">{body}</p>
            </div>
          </div>
        ))}
      </section>

      <Button className="mt-7 w-full" onClick={() => navigate("ptMatchQuiz")}>
        30초 진단 시작
        <ChevronRight size={18} />
      </Button>
      <p className="mt-3 text-center text-xs font-bold text-zinc-400">답변은 추천 계산에만 사용되며 언제든 다시 진단할 수 있어요.</p>
    </div>
  );
}

function PtMatchQuizScreen({
  answers,
  setAnswers,
  navigate
}: {
  answers: MatchAnswers;
  setAnswers: (answers: MatchAnswers) => void;
  navigate: (screen: ScreenId) => void;
}) {
  const [step, setStep] = useState(0);
  const isScheduleStep = step === 9;
  const question = ptQuizQuestions[Math.min(step, 8)];
  const progress = ((step + 1) / 10) * 100;

  const goBack = () => {
    if (step === 0) {
      navigate("ptMatchIntro");
      return;
    }
    setStep((current) => current - 1);
  };

  const goNext = () => {
    if (step === 9) {
      navigate("ptMatchResult");
      return;
    }
    setStep((current) => current + 1);
  };

  return (
    <div className="flex min-h-[650px] flex-col">
      <div className="flex items-center justify-between">
        <button type="button" onClick={goBack} className="grid size-11 place-items-center rounded-full bg-white shadow-soft ring-1 ring-black/5" aria-label="이전 문항">
          <ChevronRight size={21} className="rotate-180" />
        </button>
        <p className="text-xs font-black text-zinc-500">{step + 1} / 10</p>
        <button type="button" onClick={() => navigate("ptMatchIntro")} className="min-h-11 px-2 text-xs font-black text-zinc-400">나가기</button>
      </div>

      <div className="mt-5 h-2 overflow-hidden rounded-full bg-black/5">
        <div className="h-full rounded-full bg-lime transition-all duration-300" style={{ width: `${progress}%` }} />
      </div>

      <div className="mt-8 flex-1">
        <p className="text-xs font-black text-blue">{isScheduleStep ? "횟수와 예산" : question.eyebrow}</p>
        <h1 className="mt-2 text-[27px] font-black leading-[1.2]">
          {isScheduleStep ? "주 몇 회, 어느 정도 예산이 좋나요?" : question.title}
        </h1>
        <p className="mt-3 text-sm font-bold leading-6 text-zinc-500">
          {isScheduleStep ? "월 예상 금액이 맞는 트레이너를 우선 추천해요." : question.description}
        </p>

        {isScheduleStep ? (
          <div className="mt-7 space-y-7">
            <div>
              <p className="mb-3 text-sm font-black">운동 빈도</p>
              <div className="grid grid-cols-3 gap-2">
                {(["주 1회", "주 2회", "주 3회"] as MatchAnswers["freq"][]).map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => setAnswers({ ...answers, freq: option })}
                    className={cn(
                      "min-h-14 rounded-[16px] text-sm font-black ring-1 transition",
                      answers.freq === option ? "bg-brand text-lime ring-brand" : "bg-white text-zinc-600 ring-black/5"
                    )}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="mb-3 text-sm font-black">월 예산</p>
              <div className="grid grid-cols-2 gap-2">
                {(["월 20만원 이하", "월 40만원 이하", "월 60만원 이하", "예산 무관"] as MatchAnswers["budget"][]).map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => setAnswers({ ...answers, budget: option })}
                    className={cn(
                      "min-h-14 rounded-[16px] px-2 text-sm font-black ring-1 transition",
                      answers.budget === option ? "bg-brand text-lime ring-brand" : "bg-white text-zinc-600 ring-black/5"
                    )}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="mt-7 space-y-2.5">
            {question.options.map((option) => {
              const selected = answers[question.key] === option;
              return (
                <button
                  key={option}
                  type="button"
                  onClick={() => setAnswers({ ...answers, [question.key]: option } as MatchAnswers)}
                  className={cn(
                    "flex min-h-16 w-full items-center justify-between rounded-[18px] px-4 text-left text-sm font-black ring-1 transition",
                    selected ? "bg-brand text-white ring-brand" : "bg-white text-zinc-700 ring-black/5"
                  )}
                >
                  {option}
                  <span className={cn("grid size-7 place-items-center rounded-full", selected ? "bg-lime text-brand" : "bg-zinc-100 text-transparent")}>
                    <Check size={16} strokeWidth={3} />
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      <Button className="mt-7 w-full" onClick={goNext}>
        {step === 9 ? "내 매칭 결과 보기" : "다음"}
        <ChevronRight size={18} />
      </Button>
    </div>
  );
}

function PtMatchResultScreen({
  answers,
  matches,
  selectTrainer,
  navigate
}: {
  answers: MatchAnswers;
  matches: TrainerMatch[];
  selectTrainer: (trainer: Trainer) => void;
  navigate: (screen: ScreenId) => void;
}) {
  const matchType = getMatchType(answers);

  return (
    <div>
      <ScreenHeader title="김예림님의 PT 매칭" eyebrow="MATCH COMPLETE" onBack={() => navigate("ptMatchIntro")} />

      <section className="rounded-[24px] bg-brand p-5 text-white shadow-glow">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-black text-lime">MY EXERCISE TYPE</p>
            <p className="mt-2 text-[34px] font-black tracking-normal">{matchType.code}</p>
          </div>
          <div className="grid size-14 place-items-center rounded-[18px] bg-lime text-brand">
            <Brain size={28} />
          </div>
        </div>
        <h1 className="mt-5 text-xl font-black">{matchType.label}</h1>
        <p className="mt-2 text-sm font-bold leading-6 text-white/65">{answers.goal}을 목표로 {answers.intensity} 강도와 {answers.tone} 코칭을 선호해요.</p>
      </section>

      <div className="mt-8 flex items-end justify-between gap-4">
        <div>
          <p className="text-xs font-black text-blue">추천 Top 3</p>
          <h2 className="mt-1 text-[24px] font-black">잘 맞는 선생님을 찾았어요</h2>
        </div>
        <button type="button" onClick={() => navigate("ptMatchQuiz")} className="shrink-0 text-xs font-black text-zinc-500">다시 진단</button>
      </div>

      <div className="mt-4 space-y-4">
        {matches.map((match, index) => (
          <article key={match.trainer.id} className="overflow-hidden rounded-[20px] bg-white shadow-soft ring-1 ring-black/5">
            <div className="grid grid-cols-[116px_1fr]">
              <TrainerPortrait trainer={match.trainer} className="min-h-[150px] w-full" />
              <div className="min-w-0 p-4">
                <div className="flex items-start justify-between gap-2">
                  <Badge tone={index === 0 ? "lime" : "gray"}>{index + 1}순위</Badge>
                  <span className="text-lg font-black text-blue">{match.matchRate}%</span>
                </div>
                <h3 className="mt-3 truncate text-lg font-black">{match.trainer.name}</h3>
                <p className="mt-1 text-xs font-bold text-zinc-500">{match.trainer.specialty}</p>
                <p className="mt-3 text-sm font-black">{formatWon(match.trainer.price)} <span className="text-xs text-zinc-400">/ 1회</span></p>
              </div>
            </div>
            <div className="space-y-2 border-t border-black/5 px-4 py-4">
              {match.reasons.map((reason) => (
                <p key={reason} className="flex items-start gap-2 text-xs font-bold leading-5 text-zinc-600">
                  <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-blue" />
                  {reason}
                </p>
              ))}
              <Button className="mt-3 w-full" onClick={() => selectTrainer(match.trainer)}>
                프로필 보기
                <ChevronRight size={17} />
              </Button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

function TrainerProfileScreen({
  match,
  navigate
}: {
  match: TrainerMatch;
  navigate: (screen: ScreenId) => void;
}) {
  const trainer = match.trainer;

  return (
    <div>
      <ScreenHeader title="트레이너 프로필" eyebrow={`${match.matchRate}% MATCH`} onBack={() => navigate("ptMatchResult")} />
      <section className="overflow-hidden rounded-[24px] bg-brand text-white shadow-glow">
        <TrainerPortrait trainer={trainer} className="h-[290px] w-full" />
        <div className="p-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h1 className="text-[25px] font-black">{trainer.name}</h1>
              <p className="mt-1 text-sm font-bold text-white/65">{trainer.specialty} · 경력 {trainer.career}</p>
            </div>
            <Badge tone="lime">{match.matchRate}% 일치</Badge>
          </div>
          <p className="mt-4 text-sm font-bold leading-6 text-white/78">{trainer.intro}</p>
          <div className="mt-4 flex items-center gap-2 text-sm font-black text-lime">
            <Star size={17} fill="currentColor" />
            {trainer.rating.toFixed(1)}
            <span className="text-xs text-white/50">후기 {trainer.reviewCount}개</span>
          </div>
        </div>
      </section>

      <section className="mt-6">
        <h2 className="text-lg font-black">김예림님께 추천한 이유</h2>
        <div className="mt-3 space-y-2">
          {match.reasons.map((reason) => (
            <div key={reason} className="flex items-center gap-3 rounded-[16px] bg-[#EEF4FF] p-4 text-sm font-bold text-brand">
              <CheckCircle2 size={18} className="shrink-0 text-blue" />
              {reason}
            </div>
          ))}
        </div>
      </section>

      <section className="mt-7">
        <h2 className="text-lg font-black">강점 태그</h2>
        <div className="mt-3 flex flex-wrap gap-2">
          {[...trainer.tags.specialties, trainer.tags.intensity, trainer.tags.tone].map((tag) => (
            <Badge key={tag} tone="gray">{tag}</Badge>
          ))}
        </div>
      </section>

      <section className="mt-7 grid grid-cols-2 gap-3">
        <Card>
          <p className="text-xs font-bold text-zinc-400">소속 시설</p>
          <p className="mt-2 text-sm font-black">{trainer.facilityIds.includes("muscle-factory") ? "머슬팩토리 경상대점" : "리턴패스 제휴 시설"}</p>
        </Card>
        <Card>
          <p className="text-xs font-bold text-zinc-400">가능 시간</p>
          <p className="mt-2 text-sm font-black">{trainer.timeSlots.join(" · ")}</p>
        </Card>
      </section>

      <section className="mt-7">
        <h2 className="text-lg font-black">회원 변화 사례</h2>
        <div className="mt-3 space-y-3">
          {trainer.cases.map((item) => (
            <div key={item.title} className="rounded-[18px] bg-white p-4 shadow-soft ring-1 ring-black/5">
              <p className="text-sm font-black">{item.title}</p>
              <p className="mt-2 text-xs font-bold leading-5 text-zinc-500">{item.summary}</p>
            </div>
          ))}
        </div>
      </section>

      <Card className="mt-7 bg-zinc-950 text-white">
        <p className="text-xs font-bold text-white/50">보유 자격</p>
        <p className="mt-2 text-sm font-black leading-6">{trainer.certs.join(" · ")}</p>
      </Card>

      <Button className="mt-7 w-full" onClick={() => navigate("ptPlanSelect")}>
        PT 구독권 보기
        <ChevronRight size={18} />
      </Button>
    </div>
  );
}

function PtPlanSelectScreen({
  trainer,
  selectedPlan,
  setSelectedPlan,
  navigate
}: {
  trainer: Trainer;
  selectedPlan: PtSubscriptionPlan;
  setSelectedPlan: (plan: PtSubscriptionPlan) => void;
  navigate: (screen: ScreenId) => void;
}) {
  return (
    <div>
      <ScreenHeader title="PT 구독권 선택" eyebrow={trainer.name} onBack={() => navigate("trainerProfile")} />

      <div className="flex items-center gap-4 rounded-[18px] bg-brand p-4 text-white shadow-soft">
        <TrainerPortrait trainer={trainer} className="size-20 shrink-0 rounded-[16px]" />
        <div className="min-w-0">
          <p className="truncate text-lg font-black">{trainer.name}</p>
          <p className="mt-1 text-xs font-bold text-white/60">{trainer.specialty}</p>
          <p className="mt-2 text-sm font-black text-lime">1회 {formatWon(trainer.price)}</p>
        </div>
      </div>

      <div className="mt-6 space-y-3">
        {ptSubscriptionPlans.map((plan) => {
          const selected = selectedPlan.id === plan.id;
          const price = getPtPlanPrice(trainer, plan);
          return (
            <button
              key={plan.id}
              type="button"
              onClick={() => setSelectedPlan(plan)}
              className={cn(
                "w-full rounded-[20px] p-5 text-left ring-1 transition",
                selected ? "bg-brand text-white ring-brand shadow-glow" : "bg-white text-brand ring-black/5 shadow-soft"
              )}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-lg font-black">{plan.name}</p>
                    {plan.recommended ? <Badge tone="lime">가장 인기</Badge> : null}
                  </div>
                  <p className={cn("mt-1 text-xs font-bold", selected ? "text-white/60" : "text-zinc-500")}>{plan.frequency} · 월 {plan.sessions}회</p>
                </div>
                <span className={cn("grid size-7 place-items-center rounded-full", selected ? "bg-lime text-brand" : "bg-zinc-100 text-transparent")}>
                  <Check size={16} strokeWidth={3} />
                </span>
              </div>
              <p className="mt-4 text-[24px] font-black">{formatWon(price)} <span className={cn("text-xs", selected ? "text-white/50" : "text-zinc-400")}>/ 월</span></p>
              {plan.discountRate > 0 ? <p className="mt-1 text-xs font-black text-lime">회당 {formatWon(Math.round(price / plan.sessions))} · {Math.round(plan.discountRate * 100)}% 구독 할인</p> : null}
              <p className={cn("mt-3 text-xs font-bold leading-5", selected ? "text-white/65" : "text-zinc-500")}>{plan.description}</p>
              <div className="mt-4 space-y-2">
                {plan.benefits.map((benefit) => (
                  <p key={benefit} className="flex items-center gap-2 text-xs font-bold">
                    <Check size={14} className={selected ? "text-lime" : "text-blue"} />
                    {benefit}
                  </p>
                ))}
              </div>
            </button>
          );
        })}
      </div>

      <Card className="mt-5 bg-[#FFF8E8]">
        <p className="text-sm font-black">세션 이용 정책</p>
        <p className="mt-2 text-xs font-bold leading-5 text-zinc-600">미사용 세션은 최대 2회까지 다음 달로 이월됩니다. 수업 24시간 전까지 취소하면 차감되지 않아요.</p>
      </Card>

      <Button className="mt-6 w-full" onClick={() => navigate("ptCheckout")}>
        {selectedPlan.name} 선택
        <ChevronRight size={18} />
      </Button>
    </div>
  );
}

function PtCheckoutScreen({
  trainer,
  plan,
  facility,
  accepted,
  setAccepted,
  navigate,
  notify
}: {
  trainer: Trainer;
  plan: PtSubscriptionPlan;
  facility: Facility;
  accepted: boolean;
  setAccepted: (accepted: boolean) => void;
  navigate: (screen: ScreenId) => void;
  notify: (message: string) => void;
}) {
  const price = getPtPlanPrice(trainer, plan);

  const completeCheckout = () => {
    notify("PT 구독이 체험 상태로 시작되었습니다");
    navigate("myPt");
  };

  return (
    <div>
      <ScreenHeader title="PT 구독 확인" eyebrow="DUMMY CHECKOUT" onBack={() => navigate("ptPlanSelect")} />

      <Card>
        <div className="flex items-center gap-4">
          <TrainerPortrait trainer={trainer} className="size-20 shrink-0 rounded-[16px]" />
          <div className="min-w-0">
            <p className="truncate text-lg font-black">{trainer.name}</p>
            <p className="mt-1 text-xs font-bold text-zinc-500">{facility.name}</p>
            <div className="mt-2">
              <Badge tone="blue">{plan.frequency} · 월 {plan.sessions}회</Badge>
            </div>
          </div>
        </div>
        <div className="mt-5 border-t border-black/5 pt-4">
          <InfoRow label="구독권" value={plan.name} />
          <InfoRow label="첫 결제 금액" value={formatWon(price)} />
          <InfoRow label="다음 결제 예정일" value="2026.08.27" />
          <InfoRow label="세션 유효 기간" value="결제일로부터 1개월" />
        </div>
      </Card>

      <Card className="mt-4 bg-[#EEF4FF]">
        <div className="flex items-start gap-3">
          <CalendarDays size={21} className="mt-0.5 shrink-0 text-blue" />
          <div>
            <p className="text-sm font-black">예약과 취소</p>
            <p className="mt-2 text-xs font-bold leading-5 text-zinc-600">첫 결제 후 트레이너와 가능한 시간을 조율합니다. 24시간 이내 취소 또는 노쇼는 세션 1회가 차감됩니다.</p>
          </div>
        </div>
      </Card>

      <label className="mt-5 flex cursor-pointer items-start gap-3 rounded-[18px] bg-white p-4 shadow-soft ring-1 ring-black/5">
        <input type="checkbox" checked={accepted} onChange={(event) => setAccepted(event.target.checked)} className="mt-1 size-5 accent-[#12372A]" />
        <span>
          <span className="text-sm font-black">PT 구독 및 취소 정책에 동의합니다</span>
          <span className="mt-1 block text-xs font-bold leading-5 text-zinc-500">월 자동결제, 세션 이월, 노쇼 및 중도해지 안내를 확인했습니다.</span>
        </span>
      </label>

      <Card className="mt-4 bg-zinc-950 text-white">
        <div className="flex items-center justify-between gap-3">
          <span className="text-sm font-bold text-white/60">이번 달 결제</span>
          <strong className="text-[24px] font-black text-lime">{formatWon(price)}</strong>
        </div>
        <p className="mt-3 text-xs font-bold text-white/45">실제 결제는 진행되지 않는 더미 PT 구독입니다.</p>
      </Card>

      <Button className="mt-6 w-full" disabled={!accepted} onClick={completeCheckout}>
        {formatWon(price)} 결제하고 시작하기
      </Button>
    </div>
  );
}

function MyPtScreen({
  trainer,
  plan,
  navigate,
  notify
}: {
  trainer: Trainer;
  plan: PtSubscriptionPlan;
  navigate: (screen: ScreenId) => void;
  notify: (message: string) => void;
}) {
  return (
    <div>
      <ScreenHeader title="내 PT" eyebrow="ACTIVE SUBSCRIPTION" />

      <section className="rounded-[24px] bg-brand p-5 text-white shadow-glow">
        <div className="flex items-start justify-between gap-4">
          <div>
            <Badge tone="lime">이용중</Badge>
            <h1 className="mt-4 text-[24px] font-black">{plan.name}</h1>
            <p className="mt-1 text-sm font-bold text-white/60">{trainer.name} · {plan.frequency}</p>
          </div>
          <TrainerPortrait trainer={trainer} className="size-24 shrink-0 rounded-[18px] ring-1 ring-white/15" />
        </div>
        <div className="mt-6 grid grid-cols-2 gap-3">
          <div className="rounded-[16px] bg-white/10 p-4">
            <p className="text-xs font-bold text-white/50">남은 세션</p>
            <p className="mt-2 text-2xl font-black text-lime">{plan.sessions}회</p>
          </div>
          <div className="rounded-[16px] bg-white/10 p-4">
            <p className="text-xs font-bold text-white/50">다음 결제일</p>
            <p className="mt-2 text-lg font-black">08.27</p>
          </div>
        </div>
      </section>

      <section className="mt-6">
        <h2 className="text-lg font-black">다음 수업</h2>
        <Card className="mt-3">
          <div className="flex items-center gap-4">
            <div className="grid size-14 shrink-0 place-items-center rounded-[16px] bg-lime text-brand">
              <CalendarDays size={24} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-black">7월 29일 수요일 · 오후 7:30</p>
              <p className="mt-1 text-xs font-bold text-zinc-500">머슬팩토리 경상대점 · 하체 기초</p>
            </div>
          </div>
          <Button variant="line" className="mt-4 w-full" onClick={() => notify("일정 변경 요청이 전달되었습니다")}>일정 변경 요청</Button>
        </Card>
      </section>

      <section className="mt-6">
        <h2 className="text-lg font-black">트레이너 피드백</h2>
        <Card className="mt-3 bg-[#EEF4FF]">
          <p className="text-xs font-black text-blue">{trainer.name}</p>
          <p className="mt-2 text-sm font-bold leading-6 text-brand">첫 수업에서는 스쿼트 자세와 무릎 정렬을 확인할게요. 편한 운동화와 물만 준비해 주세요.</p>
        </Card>
      </section>

      <div className="mt-6 grid grid-cols-2 gap-3">
        <Button variant="line" onClick={() => notify("트레이너 채팅은 다음 연동 단계에서 열립니다")}>
          <MessageCircle size={17} />
          채팅
        </Button>
        <Button onClick={() => navigate("home")}>홈으로</Button>
      </div>
    </div>
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
      <Card className="overflow-hidden bg-brand p-0 text-white">
        <SpriteVisual
          image={aiVisualAssets.image}
          position={aiVisualAssets.routinePosition}
          backgroundSize="200% auto"
          label="AI 운동 루틴 추천"
          className="h-52 w-full"
        />
        <div className="flex items-start justify-between gap-4 p-5">
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
        <SpriteVisual
          image={aiVisualAssets.image}
          position={aiVisualAssets.dietPosition}
          backgroundSize="200% auto"
          label="AI 맞춤 식단 추천"
          className="h-52 w-full"
        />
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
        title="리턴샵"
        eyebrow="리턴패스 회원 전용 상품"
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
      <ScreenHeader title="상품 상세" eyebrow="리턴샵" onBack={() => navigate("shop")} />
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
        <InfoRow label="회원 혜택" value="리턴패스 구독자 무료 픽업" icon={<ShoppingBag size={17} />} />
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
      <ScreenHeader title="장바구니" eyebrow="리턴샵" onBack={() => navigate("shopDetail")} />
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
        <Badge tone="blue">리턴샵 주문 완료</Badge>
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

function AdminHome({ navigate, notify }: { navigate: (screen: ScreenId) => void; notify: (message: string) => void }) {
  const operationAlerts = [
    { label: "QR 확인 필요", value: "2건", icon: <ScanLine size={18} />, action: () => navigate("adminQr") },
    { label: "환불 문의", value: "1건", icon: <Headphones size={18} />, action: () => notify("환불 문의 목록을 확인했습니다.") },
    { label: "결제 실패 회원", value: "4명", icon: <AlertCircle size={18} />, action: () => notify("결제 실패 회원 필터가 열렸습니다.") },
    { label: "PT 상담 대기", value: "3건", icon: <Dumbbell size={18} />, action: () => notify("PT 신청 관리 화면 placeholder입니다.") },
    { label: "상품 주문 접수", value: "6건", icon: <ShoppingBag size={18} />, action: () => notify("상품 주문 관리 화면 placeholder입니다.") }
  ];
  const quickMenus = [
    { label: "QR 확인", body: "스캔", icon: <ScanLine size={20} />, action: () => navigate("adminQr") },
    { label: "회원 목록", body: "구독자", icon: <UsersRound size={20} />, action: () => navigate("adminMembers") },
    { label: "PT 신청 관리", body: "3건", icon: <Dumbbell size={20} />, action: () => notify("PT 신청 관리 화면 placeholder입니다.") },
    { label: "상품 주문 관리", body: "6건", icon: <ShoppingBag size={20} />, action: () => notify("상품 주문 관리 화면 placeholder입니다.") },
    { label: "환불 문의", body: "1건", icon: <Headphones size={20} />, action: () => notify("환불 문의 목록을 확인했습니다.") },
    { label: "정산 요약", body: "예정", icon: <ReceiptText size={20} />, action: () => notify("정산 요약 카드로 이동했습니다.") }
  ];

  return (
    <div className="space-y-5">
      <ScreenHeader title="머슬팩토리 경상대점 관리자" eyebrow="오늘 매장 현황" />
      <Card className="bg-brand text-white">
        <div className="flex items-start justify-between gap-4">
          <div>
            <Badge tone="lime">2026.06.02 화요일</Badge>
            <h2 className="mt-4 text-3xl font-black leading-tight">오늘 운영 현황</h2>
            <p className="mt-2 text-sm font-semibold text-white/65">입장, 구독, 결제, 문의를 한 화면에서 확인합니다.</p>
          </div>
          <Settings className="shrink-0 text-lime" size={30} />
        </div>
        <div className="mt-5 grid grid-cols-2 gap-3">
          <AdminMetric label="오늘 입장 회원 수" value="38명" tone="lime" />
          <AdminMetric label="현재 구독자 수" value="214명" />
          <AdminMetric label="이번 달 결제액" value="8,120,000원" tone="blue" />
          <AdminMetric label="만료 예정 회원" value="17명" />
        </div>
      </Card>

      <Card>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-black">운영 알림</h2>
          <Badge tone="blue">오늘 처리</Badge>
        </div>
        <div className="space-y-3">
          {operationAlerts.map((item) => (
            <button key={item.label} type="button" onClick={item.action} className="flex w-full items-center justify-between rounded-[18px] bg-gray-50 p-3 text-left transition hover:bg-[#EEF4FF]">
              <span className="flex items-center gap-3">
                <span className="grid size-10 place-items-center rounded-2xl bg-white text-blue shadow-soft">{item.icon}</span>
                <span className="text-sm font-black text-gray-700">{item.label}</span>
              </span>
              <span className="rounded-full bg-brand px-3 py-1 text-xs font-black text-lime">{item.value}</span>
            </button>
          ))}
        </div>
      </Card>

      <div>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-xl font-black">관리자 빠른 메뉴</h2>
          <span className="text-xs font-black text-gray-400">운영 바로가기</span>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {quickMenus.map((menu) => (
            <QuickFeature key={menu.label} icon={menu.icon} label={menu.label} body={menu.body} onClick={menu.action} />
          ))}
        </div>
      </div>

      <Card>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-black">최근 입장 기록</h2>
          <button type="button" onClick={() => navigate("adminQr")} className="text-sm font-black text-blue">
            QR 확인
          </button>
        </div>
        <div className="space-y-3">
          {entryLogs.map((log) => (
            <AdminEntryLogItem key={log.id} log={log} />
          ))}
        </div>
      </Card>

      <Card className="space-y-3">
        <h2 className="text-lg font-black">정산 요약</h2>
        <InfoRow label="이번 달 결제액" value="8,120,000원" icon={<CircleDollarSign size={17} />} />
        <InfoRow label="플랫폼 수수료 예상" value="812,000원" icon={<ReceiptText size={17} />} />
        <InfoRow label="정산 예정액" value="7,308,000원" icon={<CreditCard size={17} />} />
        <InfoRow label="다음 정산 예정일" value="2026.06.30" icon={<CalendarDays size={17} />} />
      </Card>
    </div>
  );
}

function AdminMembers({
  status,
  setStatus,
  navigate,
  notify
}: {
  status: MemberStatus;
  setStatus: (status: MemberStatus) => void;
  navigate: (screen: ScreenId) => void;
  notify: (message: string) => void;
}) {
  const statuses: MemberStatus[] = ["이용중", "만료예정", "해지예약", "만료"];
  const members = adminMembers.filter((member) => member.status === status);

  return (
    <div className="space-y-5">
      <ScreenHeader title="회원 목록" eyebrow="구독 상태별 관리" onBack={() => navigate("adminHome")} />
      <div className="flex items-center gap-3 rounded-[22px] bg-white px-4 py-3 shadow-soft">
        <Search size={20} className="text-gray-400" />
        <input className="min-w-0 flex-1 bg-transparent text-sm font-bold outline-none placeholder:text-gray-400" placeholder="회원명 또는 회원번호 검색" />
      </div>
      <div className="grid grid-cols-4 gap-2">
        {statuses.map((item) => {
          const count = adminMembers.filter((member) => member.status === item).length;
          return (
            <button
              key={item}
              type="button"
              onClick={() => setStatus(item)}
              className={cn("rounded-[18px] px-2 py-3 text-center text-xs font-black", status === item ? "bg-brand text-lime" : "bg-white text-gray-600 shadow-soft")}
            >
              <span className="block">{item}</span>
              <span className="mt-1 block opacity-70">{count}명</span>
            </button>
          );
        })}
      </div>
      <Card className="bg-brand text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-black text-lime">{status}</p>
            <h2 className="mt-2 text-2xl font-black">{members.length}명</h2>
          </div>
          <UsersRound className="text-lime" size={30} />
        </div>
      </Card>
      <div className="space-y-3">
        {members.map((member) => (
          <MemberItem
            key={member.id}
            member={member}
            onQr={() => navigate("adminQr")}
            onDetail={() => notify(`${member.name} 상세 정보 placeholder입니다.`)}
          />
        ))}
      </div>
    </div>
  );
}

function AdminQr({
  result,
  setResult,
  navigate,
  notify
}: {
  result: QrVerificationStatus;
  setResult: (status: QrVerificationStatus) => void;
  navigate: (screen: ScreenId) => void;
  notify: (message: string) => void;
}) {
  const statuses: QrVerificationStatus[] = ["입장 가능", "만료된 QR", "이미 사용된 QR", "다른 지점 이용권", "회원권 만료"];
  const selectedResult = qrVerificationResults.find((item) => item.status === result) ?? qrVerificationResults[0];

  return (
    <div className="space-y-5">
      <ScreenHeader title="QR 확인" eyebrow="서버 토큰 검증" onBack={() => navigate("adminHome")} />
      <Card className="overflow-hidden bg-brand p-0 text-white">
        <div className="p-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <Badge tone="lime">QR 스캔 모드</Badge>
              <h2 className="mt-4 text-3xl font-black leading-tight">카메라 연결 전 더미 스캔</h2>
              <p className="mt-3 text-sm font-semibold leading-6 text-white/70">실제 카메라 연동 전, 토큰 상태별 검증 결과를 미리 확인합니다.</p>
            </div>
            <div className="grid size-16 place-items-center rounded-[24px] bg-white/12 text-lime ring-1 ring-white/15">
              <ScanLine size={34} />
            </div>
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
      <QrResultCard result={selectedResult} notify={notify} />
    </div>
  );
}
function GymCard({ gym, onClick, compact = false }: { gym: Facility; onClick: () => void; compact?: boolean }) {
  const categoryLabel = facilityCategories.find((item) => item.id === gym.category)?.label ?? "운동시설";

  return (
    <button type="button" onClick={onClick} className="flex w-full gap-3 py-4 text-left transition hover:bg-white/70 sm:gap-4">
      <img
        src={gym.image}
        alt={`${gym.name} 사진`}
        className={cn("h-[112px] w-[116px] shrink-0 rounded-[14px] object-cover shadow-soft sm:h-[126px] sm:w-[160px]", compact && "h-[104px] w-[108px] sm:h-[118px] sm:w-[148px]")}
      />
      <div className="min-w-0 flex-1 py-0.5">
        <div className="flex items-start gap-2">
          <div className="min-w-0 flex-1">
            <h3 className="truncate text-[16px] font-black sm:text-lg">{gym.name}</h3>
            <p className="mt-1 text-xs font-bold text-zinc-500">{categoryLabel} · {gym.distance}</p>
          </div>
          <ChevronRight size={18} className="mt-1 shrink-0 text-zinc-400" />
        </div>
        <div className="mt-2 flex items-center gap-2 text-xs font-bold">
          <span className="flex items-center gap-1 text-brand">
            <Star size={14} className="text-amber-500" fill="currentColor" />
            {gym.rating}
          </span>
          <span className="text-zinc-300">|</span>
          <span className="truncate text-zinc-500">{gym.hours}</span>
        </div>
        <div className="mt-2 flex min-w-0 gap-1.5 overflow-hidden">
          {gym.tags.slice(0, 2).map((tag) => (
            <span key={tag} className="shrink-0 rounded-[7px] bg-white px-2 py-1 text-[10px] font-bold text-zinc-600 ring-1 ring-black/5">
              {tag}
            </span>
          ))}
        </div>
        <p className="mt-2 text-right text-lg font-black text-[#5B8C12] sm:text-xl">
          <span className="mr-1 text-xs font-bold">월</span>
          {formatWon(gym.monthlyPrice)}
        </p>
      </div>
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

function AdminMetric({ label, value, tone = "dark" }: { label: string; value: string; tone?: "dark" | "blue" | "lime" }) {
  const className = tone === "lime" ? "bg-lime text-brand" : tone === "blue" ? "bg-blue text-white" : "bg-white/12 text-white";

  return (
    <div className={cn("rounded-[20px] p-4 ring-1 ring-white/10", className)}>
      <p className="text-[11px] font-black opacity-75">{label}</p>
      <p className="mt-2 text-2xl font-black leading-tight">{value}</p>
    </div>
  );
}

function AdminEntryLogItem({ log }: { log: (typeof entryLogs)[number] }) {
  const tone: "green" | "lime" | "red" = log.status === "입장 승인" ? "green" : log.status === "해지예약 상태 입장" ? "lime" : "red";
  const icon = log.status === "입장 거절" ? <AlertCircle size={19} /> : <CheckCircle2 size={19} />;

  return (
    <div className="rounded-[18px] bg-gray-50 p-3">
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-start gap-3">
          <div className={cn("grid size-10 shrink-0 place-items-center rounded-2xl", log.status === "입장 거절" ? "bg-rose-100 text-rose-600" : "bg-emerald-100 text-emerald-700")}>
            {icon}
          </div>
          <div>
            <p className="font-black leading-5">{log.memberName}</p>
            <p className="mt-1 text-xs font-bold text-gray-500">{log.time} · {log.plan}</p>
          </div>
        </div>
        <Badge tone={tone}>{log.status}</Badge>
      </div>
    </div>
  );
}

function MemberItem({ member, onQr, onDetail }: { member: AdminMember; onQr: () => void; onDetail: () => void }) {
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
        <InfoMini label="최근 입장" value={member.lastEntryAt} />
        <InfoMini label="회원번호" value={member.id} />
      </div>
      <div className="mt-4 grid grid-cols-2 gap-2">
        <Button variant="line" className="min-h-10 rounded-[14px] px-3 py-2 text-xs" onClick={onDetail}>
          상세 보기
        </Button>
        <Button variant="dark" className="min-h-10 rounded-[14px] px-3 py-2 text-xs" onClick={onQr}>
          QR 확인
        </Button>
      </div>
    </Card>
  );
}

function QrResultCard({ result, notify }: { result: (typeof qrVerificationResults)[number]; notify: (message: string) => void }) {
  const config = {
    "입장 가능": { className: "bg-emerald-500 text-white", icon: <UserCheck size={34} />, label: "입장 가능" },
    "만료된 QR": { className: "bg-amber-500 text-white", icon: <Clock size={34} />, label: "만료된 QR" },
    "이미 사용된 QR": { className: "bg-zinc-950 text-white", icon: <RefreshCw size={34} />, label: "이미 사용된 QR" },
    "다른 지점 이용권": { className: "bg-blue text-white", icon: <Map size={34} />, label: "다른 지점 이용권" },
    "회원권 만료": { className: "bg-rose-500 text-white", icon: <AlertCircle size={34} />, label: "회원권 만료" }
  } satisfies Record<QrVerificationStatus, { className: string; icon: ReactNode; label: string }>;

  const item = config[result.status];
  const canEnter = result.status === "입장 가능";

  return (
    <Card className={cn("p-5", item.className)}>
      <div className="space-y-5">
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
        <div className="grid grid-cols-2 gap-2">
          <Button className="min-h-11 rounded-[14px] px-3 py-2 text-xs" variant={canEnter ? "primary" : "line"} onClick={() => notify(canEnter ? "입장 승인 처리되었습니다." : "재스캔을 요청했습니다.")}>
            {canEnter ? "입장 승인" : "재스캔"}
          </Button>
          <Button className="min-h-11 rounded-[14px] px-3 py-2 text-xs" variant={canEnter ? "line" : "dark"} onClick={() => notify(canEnter ? "다음 회원을 스캔하세요." : "고객센터 연결 안내를 표시했습니다.")}>
            {canEnter ? "재스캔" : "고객센터 연결"}
          </Button>
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








