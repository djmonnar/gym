import type { AdminMember, Gym, PaymentRecord, Plan, ShopProduct } from "../types";

export const gyms: Gym[] = [
  {
    id: "muscle-factory",
    name: "머슬팩토리 경상대점",
    location: "경남 진주시 가좌길 18",
    distance: "0.8km",
    monthlyPrice: 39000,
    hours: "24시",
    rating: 4.8,
    image: "/images/gym-muscle-factory.png",
    tags: ["주차 가능", "샤워실", "락커"],
    facilities: ["24시간 무인 입장", "프리웨이트 존", "샤워실", "개인 락커", "무료 주차 2시간"],
    trainers: ["김도윤 트레이너 · 체형 교정", "박서연 트레이너 · 여성 근력"]
  },
  {
    id: "fitness-lounge",
    name: "진주 피트니스 라운지",
    location: "경남 진주시 진주대로 501",
    distance: "1.4km",
    monthlyPrice: 45000,
    hours: "06:00 - 24:00",
    rating: 4.7,
    image: "/images/gym-fitness-lounge.png",
    tags: ["PT 가능", "샤워실", "스트레칭"],
    facilities: ["PT 상담 가능", "유산소 라운지", "여성 파우더룸", "무료 운동복", "수건 제공"],
    trainers: ["이하준 트레이너 · 감량 프로그램", "정민지 트레이너 · 초보자 루틴"]
  },
  {
    id: "body-lab",
    name: "가좌동 바디랩",
    location: "경남 진주시 가호로 12",
    distance: "2.1km",
    monthlyPrice: 34900,
    hours: "05:30 - 23:30",
    rating: 4.6,
    image: "/images/gym-body-lab.png",
    tags: ["첫 달 할인", "월 4만원 이하", "주차 가능"],
    facilities: ["첫 달 할인 적용", "스쿼트랙 4대", "인바디 측정", "샤워실", "무료 주차"],
    trainers: ["윤태민 트레이너 · 웨이트 입문", "한유진 트레이너 · 자세 분석"]
  }
];

export const filters = ["24시", "주차 가능", "PT 가능", "여성전용", "샤워실", "첫 달 할인", "월 4만원 이하"];

export const plans: Plan[] = [
  {
    id: "basic",
    name: "1개월 베이직",
    price: 39000,
    description: "가장 부담 없는 월 단위 기본 이용권",
    benefits: ["한 달 자유 입장", "QR 체크인", "해지 예약 가능", "결제 내역 자동 기록"]
  },
  {
    id: "trial",
    name: "첫 달 체험권",
    price: 29900,
    description: "처음 이용하는 회원을 위한 가벼운 시작",
    benefits: ["첫 달 할인", "시설 전체 이용", "만료 전 알림", "앱 고객센터 지원"],
    recommended: true
  },
  {
    id: "premium",
    name: "프리미엄 패스",
    price: 59000,
    description: "운동 루틴을 더 넓게 쓰는 프리미엄 구독",
    benefits: ["동일 브랜드 지점 이용", "락커 우선 배정", "월 1회 인바디 리포트", "PT 상담 쿠폰"]
  }
];

export const paymentRecords: PaymentRecord[] = [
  {
    id: "pay-001",
    date: "2026.05.20",
    title: "머슬팩토리 경상대점 · 1개월 베이직",
    amount: 39000,
    method: "현대카드 1842",
    status: "결제 완료"
  },
  {
    id: "pay-002",
    date: "2026.04.20",
    title: "머슬팩토리 경상대점 · 1개월 베이직",
    amount: 39000,
    method: "현대카드 1842",
    status: "결제 완료"
  },
  {
    id: "pay-003",
    date: "2026.03.28",
    title: "진주 피트니스 라운지 · 첫 달 체험권",
    amount: 29900,
    method: "카카오페이",
    status: "환불 완료"
  },
  {
    id: "pay-004",
    date: "2026.03.20",
    title: "가좌동 바디랩 · 1개월 베이직",
    amount: 34900,
    method: "국민카드 9091",
    status: "결제 실패"
  }
];

export const adminMembers: AdminMember[] = [
  { id: "M-1042", name: "김효승", phone: "010-23**-91**", plan: "1개월 베이직", expiresAt: "2026.06.19", status: "이용중" },
  { id: "M-1041", name: "이지원", phone: "010-77**-44**", plan: "프리미엄 패스", expiresAt: "2026.05.24", status: "만료예정" },
  { id: "M-1039", name: "박서준", phone: "010-54**-28**", plan: "1개월 베이직", expiresAt: "2026.06.02", status: "해지예약" },
  { id: "M-1028", name: "최나은", phone: "010-19**-63**", plan: "첫 달 체험권", expiresAt: "2026.05.01", status: "만료" }
];

export const entryLogs = [
  "김효승님 16:22 입장",
  "정민지님 15:48 입장",
  "이지원님 14:10 입장",
  "박서준님 12:35 입장"
];

export const shopProducts: ShopProduct[] = [
  {
    id: "chicken-original",
    name: "GYMSHOP 수비드 닭가슴살 오리지널",
    subtitle: "운동 끝나고 바로 먹는 촉촉한 단백질 루틴",
    price: 3200,
    originalPrice: 3900,
    image: "/images/gymshop-chicken-breast.png",
    badge: "회원 전용 18% 할인",
    tags: ["단백질 24g", "저지방", "전자레인지 1분", "냉장 배송"],
    nutrition: [
      { label: "중량", value: "120g" },
      { label: "단백질", value: "24g" },
      { label: "열량", value: "138kcal" },
      { label: "보관", value: "냉장" }
    ],
    detailPoints: [
      "수비드 방식으로 퍽퍽함을 줄이고 촉촉한 식감을 살렸습니다.",
      "운동 전후 부담 없이 먹기 좋은 오리지널 시즈닝입니다.",
      "짐패스 구독 회원은 매장 픽업 또는 냉장 배송을 선택할 수 있습니다."
    ],
    shipping: "오늘 18시 전 주문 시 내일 도착 예정"
  }
];
