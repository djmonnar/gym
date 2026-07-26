export type CustomerScreen =
  | "splash"
  | "onboarding"
  | "login"
  | "location"
  | "locationPermission"
  | "home"
  | "search"
  | "detail"
  | "facilityDetail"
  | "plans"
  | "planSelect"
  | "checkout"
  | "complete"
  | "paySuccess"
  | "pass"
  | "myPass"
  | "subscription"
  | "subscriptionManage"
  | "history"
  | "payHistory"
  | "support"
  | "my"
  | "mypage"
  | "pt"
  | "ptMatchIntro"
  | "ptMatchQuiz"
  | "ptMatchResult"
  | "trainerProfile"
  | "ptPlanSelect"
  | "ptCheckout"
  | "myPt"
  | "routine"
  | "aiRoutine"
  | "diet"
  | "aiDiet"
  | "contentHome"
  | "contentDetail"
  | "communityFeed"
  | "communityPost"
  | "communityWrite"
  | "challengeList"
  | "challengeDetail"
  | "shop"
  | "shopDetail"
  | "cart"
  | "shopComplete"
  | "orderSuccess";

export type AdminScreen =
  | "adminHome"
  | "adminMembers"
  | "adminQr"
  | "ownerHome"
  | "ownerMembers"
  | "ownerQr"
  | "ownerSales"
  | "ownerPickup"
  | "ownerFacility"
  | "trainerHome"
  | "hqAdminHome"
  | "hqAdminFacilities"
  | "hqAdminContent"
  | "hqAdminCommerce"
  | "hqAdminReports";

export type ScreenId = CustomerScreen | AdminScreen;

export type Role = "member" | "trainer" | "owner" | "vendor" | "hq";

export type FacilityCategory = "gym" | "yoga" | "pilates" | "crossfit" | "boxing";

export type Gym = {
  id: string;
  name: string;
  location: string;
  distance: string;
  monthlyPrice: number;
  hours: string;
  rating: number;
  image: string;
  tags: string[];
  facilities: string[];
  trainers: string[];
};

export type Facility = Gym & {
  category: FacilityCategory;
  images: string[];
  holidays: string[];
  amenities: string[];
  congestion: {
    level: "여유" | "보통" | "혼잡";
    updatedAt: string;
  };
  ownerUids: string[];
  status: "pending" | "active" | "paused";
  commissionRate: number;
};

export type Plan = {
  id: string;
  name: string;
  price: number;
  description: string;
  benefits: string[];
  recommended?: boolean;
};

export type PassInfo = {
  memberName: string;
  memberId: string;
  gymName: string;
  planName: string;
  expiresAt: string;
  nextBillingDate: string;
  remainingDays: string;
  maskedToken: string;
};

export type PaymentRecord = {
  id: string;
  date: string;
  title: string;
  amount: number;
  method: string;
  status: "결제 완료" | "환불 완료" | "결제 실패";
};

export type ShopProduct = {
  id: string;
  name: string;
  subtitle: string;
  price: number;
  originalPrice: number;
  image: string;
  badge: string;
  tags: string[];
  nutrition: Array<{
    label: string;
    value: string;
  }>;
  detailPoints: string[];
  shipping: string;
};

export type SellerType = "hq" | "vendor" | "facility";

export type FulfillmentType = "delivery" | "pickup" | "both";

export type Product = ShopProduct & {
  sellerType: SellerType;
  sellerId: string;
  sellerName: string;
  fulfillment: FulfillmentType;
  category: ProductCategory;
  stock: number;
  status: "active" | "soldOut" | "hidden";
  foodInfo?: {
    origin: string;
    expiry: string;
    nutrition: string;
  };
};

export type ProductCategory = "보충제·단백질" | "닭가슴살·도시락" | "소도구" | "의류" | "시설 픽업";

/** 입점 판매업체. 통신판매중개 고지에 사용합니다. */
export type Vendor = {
  id: string;
  bizName: string;
  bizNo: string;
  contact: string;
  commissionRate: number;
  status: "pending" | "active" | "paused";
};

/** 판매자별 배송 정책. 장바구니에서 판매자 단위로 배송비를 계산합니다. */
export type SellerShipping = {
  sellerId: string;
  sellerName: string;
  sellerType: SellerType;
  shippingFee: number;
  freeShippingOver: number | null;
};

export type CartItem = {
  productId: string;
  quantity: number;
  fulfillment: "delivery" | "pickup";
};

export type MemberStatus = "이용중" | "만료예정" | "해지예약" | "만료";

export type QrVerificationStatus = "입장 가능" | "만료된 QR" | "이미 사용된 QR" | "다른 지점 이용권" | "회원권 만료";

export type AdminMember = {
  id: string;
  name: string;
  phone: string;
  plan: string;
  expiresAt: string;
  status: MemberStatus;
  lastEntryAt: string;
};

export type AdminEntryLogStatus = "입장 승인" | "해지예약 상태 입장" | "입장 거절";

export type AdminEntryLog = {
  id: string;
  memberName: string;
  time: string;
  status: AdminEntryLogStatus;
  plan: string;
};

export type QrVerificationResult = {
  status: QrVerificationStatus;
  memberName: string;
  memberId: string;
  plan: string;
  remainingDays: string;
  branch: string;
  message: string;
};

export type PtTrainer = {
  id: string;
  name: string;
  specialty: string;
  price: number;
  rating: number;
  description: string;
  image: string;
  imagePosition: string;
};

export type TrainerGender = "여성" | "남성";

export type TrainerIntensity = "고강도" | "중강도" | "점진적";

export type TrainerTone = "직설·푸시형" | "담백·프로형" | "다정·응원형";

export type TrainerTeach = "원리까지 설명" | "핵심만" | "따라하기";

export type TrainerDietInvolve = "매일 체크" | "주 1회 피드백" | "운동만";

export type Trainer = PtTrainer & {
  uid: string;
  facilityIds: string[];
  gender: TrainerGender;
  career: string;
  certs: string[];
  intro: string;
  videoUrl: string;
  tags: {
    specialties: string[];
    intensity: TrainerIntensity;
    tone: TrainerTone;
    teach: TrainerTeach;
    dietInvolve: TrainerDietInvolve;
    careExp: string[];
  };
  timeSlots: string[];
  reviewCount: number;
  cases: Array<{
    title: string;
    summary: string;
  }>;
  payoutRate: number;
  status: "pending" | "active" | "paused";
};

export type MatchAnswers = {
  goal: "체중감량" | "근력·벌크업" | "체형교정·자세" | "통증·재활" | "체력·컨디션";
  level: "입문" | "6개월↓" | "1년↑" | "3년↑";
  intensity: "몰아치는 고강도" | "꾸준한 중강도" | "천천히 점진적";
  tone: TrainerTone;
  teach: TrainerTeach;
  diet: "매일 체크해주길" | "주 1회 피드백" | "운동만";
  time: "새벽" | "오전" | "오후" | "야간" | "주말";
  genderPref: TrainerGender | "무관";
  care: "무릎" | "허리" | "어깨" | "목" | "없음";
  freq: "주 1회" | "주 2회" | "주 3회";
  budget: "월 20만원 이하" | "월 40만원 이하" | "월 60만원 이하" | "예산 무관";
};

export type PtSubscriptionPlan = {
  id: "pt-4" | "pt-8" | "pt-12";
  name: string;
  sessions: number;
  frequency: "주 1회" | "주 2회" | "주 3회";
  discountRate: number;
  description: string;
  benefits: string[];
  recommended?: boolean;
};

export type RoutineDay = {
  day: string;
  focus: string;
  detail: string;
};

export type RoutinePlan = {
  memberName: string;
  goal: string;
  frequency: string;
  days: RoutineDay[];
};

export type DietRecommendation = {
  memberName: string;
  source: string;
  settings: Array<{
    label: string;
    value: string;
  }>;
  todayMenu: string;
  calories: string;
  protein: string;
  note: string;
};

export type ContentType = "video" | "article" | "mealPlan" | "program";

export type ContentAccess = "public" | "subscriber" | "pt";

export type ContentVideoChapter = {
  time: string;
  label: string;
};

export type ContentMealDay = {
  day: string;
  menu: string;
  kcal: string;
};

export type ContentProgramWeek = {
  week: number;
  title: string;
  detail: string;
};

export type Content = {
  id: string;
  type: ContentType;
  title: string;
  summary: string;
  thumbnail: string;
  thumbnailPosition: string;
  level: "입문" | "초급" | "중급" | "고급";
  bodyParts: string[];
  durationMin: number;
  access: ContentAccess;
  tags: string[];
  author: string;
  publishedAt: string;
  videoUrl?: string;
  body?: string;
  videoChapters?: ContentVideoChapter[];
  weeklyMeals?: ContentMealDay[];
  programWeeks?: ContentProgramWeek[];
};

export type AiDietMealItem = {
  food: string;
  qty: string;
  kcal: number;
};

export type AiDietPlan = {
  id: string;
  summary: {
    targetKcal: number;
    protein_g: number;
    carb_g: number;
    fat_g: number;
    note: string;
  };
  weeks: Array<{
    week: number;
    days: Array<{
      date: string;
      meals: Array<{
        type: "breakfast" | "lunch" | "dinner" | "snack";
        name: string;
        items: AiDietMealItem[];
        kcal: number;
        recipe: string;
      }>;
      totalKcal: number;
    }>;
  }>;
  groceryList: Array<{
    name: string;
    qty: string;
    shopProductId: string | null;
  }>;
  swaps: Array<{
    from: string;
    to: string;
    reason: string;
  }>;
};

export type AiRoutineExercise = {
  name: string;
  sets: number;
  reps: string;
  restSec: number;
  alternative: string;
  contentId?: string;
};

export type AiRoutine = {
  id: string;
  memberName: string;
  goal: string;
  frequency: number;
  weeks: Array<{
    week: number;
    days: Array<{
      day: string;
      focus: string;
      durationMin: number;
      exercises: AiRoutineExercise[];
    }>;
  }>;
  regeneratedCount: number;
  regenerateLimit: number;
};

export type AiVisualAssets = {
  image: string;
  dietPosition: string;
  routinePosition: string;
};

export type PostType = "proof" | "qna" | "notice" | "free";

export type Post = {
  id: string;
  uid: string;
  authorName: string;
  type: PostType;
  facilityId: string | null;
  challengeId: string | null;
  text: string;
  images: string[];
  likes: number;
  commentCount: number;
  status: "open" | "blinded" | "deleted";
  reportCount: number;
  createdAt: string;
  tags: string[];
};

export type Comment = {
  id: string;
  postId: string;
  uid: string;
  authorName: string;
  text: string;
  createdAt: string;
  isAuthor?: boolean;
};

export type Challenge = {
  id: string;
  host: "hq" | "facility";
  hostName: string;
  title: string;
  description: string;
  period: {
    startAt: string;
    endAt: string;
  };
  rule: string;
  reward: string;
  participantCount: number;
  badgeName: string;
  image: string;
  imagePosition: string;
  goalCount: number;
  myCount: number;
  steps: string[];
};
