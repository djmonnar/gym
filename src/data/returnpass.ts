import type {
  AdminEntryLog,
  AdminMember,
  AiDietPlan,
  AiRoutine,
  AiVisualAssets,
  Challenge,
  Comment,
  Content,
  DietRecommendation,
  Facility,
  PassInfo,
  PaymentRecord,
  Plan,
  Post,
  Product,
  PtSubscriptionPlan,
  QrVerificationResult,
  RoutinePlan,
  SellerShipping,
  Trainer,
  Vendor
} from "../types";

export const facilities: Facility[] = [
  {
    id: "muscle-factory",
    category: "gym",
    name: "머슬팩토리 경상대점",
    location: "경남 진주시 가좌길 18",
    distance: "0.8km",
    monthlyPrice: 39000,
    hours: "24시",
    rating: 4.8,
    image: "images/gym-muscle-factory.png",
    images: ["images/gym-muscle-factory.png"],
    tags: ["주차 가능", "샤워실", "락커"],
    facilities: ["24시간 무인 입장", "프리웨이트 존", "샤워실", "개인 락커", "무료 주차 2시간"],
    trainers: ["김도윤 트레이너 · 체형 교정", "박서연 트레이너 · 여성 근력"],
    holidays: [],
    amenities: ["와이파이", "정수기", "운동복 대여"],
    congestion: { level: "보통", updatedAt: "2026.07.27 00:20" },
    ownerUids: ["owner-muscle-factory"],
    status: "active",
    commissionRate: 0.1
  },
  {
    id: "fitness-lounge",
    category: "gym",
    name: "진주 피트니스 라운지",
    location: "경남 진주시 진주대로 501",
    distance: "1.4km",
    monthlyPrice: 45000,
    hours: "06:00 - 24:00",
    rating: 4.7,
    image: "images/gym-fitness-lounge.png",
    images: ["images/gym-fitness-lounge.png"],
    tags: ["PT 가능", "샤워실", "스트레칭"],
    facilities: ["PT 상담 가능", "유산소 라운지", "여성 파우더룸", "무료 운동복", "수건 제공"],
    trainers: ["이하준 트레이너 · 감량 프로그램", "정민지 트레이너 · 초보자 루틴"],
    holidays: ["매월 둘째 일요일"],
    amenities: ["와이파이", "운동복 대여", "수건 제공"],
    congestion: { level: "여유", updatedAt: "2026.07.27 00:18" },
    ownerUids: ["owner-fitness-lounge"],
    status: "active",
    commissionRate: 0.12
  },
  {
    id: "body-lab",
    category: "gym",
    name: "가좌동 바디랩",
    location: "경남 진주시 가호로 12",
    distance: "2.1km",
    monthlyPrice: 34900,
    hours: "05:30 - 23:30",
    rating: 4.6,
    image: "images/gym-body-lab.png",
    images: ["images/gym-body-lab.png"],
    tags: ["첫 달 할인", "월 4만원 이하", "주차 가능"],
    facilities: ["첫 달 할인 적용", "스쿼트랙 4대", "인바디 측정", "샤워실", "무료 주차"],
    trainers: ["윤태민 트레이너 · 웨이트 입문", "한유진 트레이너 · 자세 분석"],
    holidays: ["설·추석 당일"],
    amenities: ["정수기", "인바디", "무료 주차"],
    congestion: { level: "혼잡", updatedAt: "2026.07.27 00:16" },
    ownerUids: ["owner-body-lab"],
    status: "active",
    commissionRate: 0.1
  },
  {
    id: "return-yoga",
    category: "yoga",
    name: "리턴 요가 스튜디오",
    location: "경남 진주시 에나로 77",
    distance: "1.2km",
    monthlyPrice: 69000,
    hours: "07:00 - 22:00",
    rating: 4.9,
    image: "images/facility-return-yoga.png",
    images: ["images/facility-return-yoga.png"],
    tags: ["소도구 제공", "샤워실", "초보자 클래스"],
    facilities: ["정규 요가 클래스", "초보자 기초반", "개인 샤워실", "요가 매트 제공", "예약제 운영"],
    trainers: ["서지안 강사 · 하타 요가", "문하린 강사 · 릴랙스 플로우"],
    holidays: ["매주 일요일"],
    amenities: ["요가 매트", "볼스터", "탈의실"],
    congestion: { level: "여유", updatedAt: "2026.07.27 00:14" },
    ownerUids: ["owner-return-yoga"],
    status: "active",
    commissionRate: 0.12
  },
  {
    id: "balance-pilates",
    category: "pilates",
    name: "밸런스 리포머 필라테스",
    location: "경남 진주시 진양호로 225",
    distance: "1.8km",
    monthlyPrice: 109000,
    hours: "06:30 - 22:30",
    rating: 4.8,
    image: "images/facility-balance-pilates.png",
    images: ["images/facility-balance-pilates.png"],
    tags: ["리포머 6대", "소그룹", "체형 측정"],
    facilities: ["6:1 리포머 수업", "체형 측정", "개인 락커", "샤워실", "주차 1시간"],
    trainers: ["이서현 강사 · 여성 체형교정", "고유나 강사 · 산전·산후"],
    holidays: ["매월 마지막 일요일"],
    amenities: ["개인 락커", "수건 제공", "주차"],
    congestion: { level: "보통", updatedAt: "2026.07.27 00:12" },
    ownerUids: ["owner-balance-pilates"],
    status: "active",
    commissionRate: 0.15
  },
  {
    id: "breath-pilates",
    category: "pilates",
    name: "숨 프라이빗 필라테스",
    location: "경남 진주시 가좌안골길 9",
    distance: "2.4km",
    monthlyPrice: 149000,
    hours: "08:00 - 21:30",
    rating: 4.9,
    image: "images/facility-breath-pilates.png",
    images: ["images/facility-breath-pilates.png"],
    tags: ["1:2 레슨", "재활 전문", "캐딜락"],
    facilities: ["1:2 세미 프라이빗", "캐딜락", "체어", "통증 케어 상담", "예약제 운영"],
    trainers: ["정소민 강사 · 통증 케어", "박채원 강사 · 자세 재교육"],
    holidays: ["매주 월요일"],
    amenities: ["상담실", "탈의실", "소도구"],
    congestion: { level: "여유", updatedAt: "2026.07.27 00:10" },
    ownerUids: ["owner-breath-pilates"],
    status: "active",
    commissionRate: 0.15
  }
];

export const gyms = facilities.filter((facility) => facility.category === "gym");

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

export const activePass: PassInfo = {
  memberName: "김예림",
  memberId: "M-1042",
  gymName: "머슬팩토리 경상대점",
  planName: "1개월 베이직",
  expiresAt: "2026.06.19",
  nextBillingDate: "2026.06.20",
  remainingDays: "24일",
  maskedToken: "gp_live_****_7K2M"
};

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
  { id: "M-1042", name: "김예림", phone: "010-23**-91**", plan: "1개월 베이직", expiresAt: "2026.06.19", status: "이용중", lastEntryAt: "16:22" },
  { id: "M-1041", name: "이지원", phone: "010-77**-44**", plan: "프리미엄 패스", expiresAt: "2026.05.24", status: "만료예정", lastEntryAt: "15:48" },
  { id: "M-1039", name: "박서준", phone: "010-54**-28**", plan: "1개월 베이직", expiresAt: "2026.06.02", status: "해지예약", lastEntryAt: "14:10" },
  { id: "M-1028", name: "최나은", phone: "010-19**-63**", plan: "첫 달 체험권", expiresAt: "2026.05.01", status: "만료", lastEntryAt: "12:35" }
];

export const qrVerificationResults: QrVerificationResult[] = [
  {
    status: "입장 가능",
    memberName: "김예림",
    memberId: "M-1042",
    plan: "1개월 베이직",
    remainingDays: "24일",
    branch: "머슬팩토리 경상대점",
    message: "정상 토큰입니다. 1회 스캔 후 즉시 폐기됩니다."
  },
  {
    status: "만료된 QR",
    memberName: "김예림",
    memberId: "M-1042",
    plan: "1개월 베이직",
    remainingDays: "24일",
    branch: "머슬팩토리 경상대점",
    message: "30초 유효 시간이 지난 QR입니다. 회원 앱에서 새 QR을 요청해야 합니다."
  },
  {
    status: "이미 사용된 QR",
    memberName: "김예림",
    memberId: "M-1042",
    plan: "1개월 베이직",
    remainingDays: "24일",
    branch: "머슬팩토리 경상대점",
    message: "이미 입장 처리된 토큰입니다. 캡처본 또는 재사용 시도로 볼 수 있습니다."
  },
  {
    status: "다른 지점 이용권",
    memberName: "이지원",
    memberId: "M-1041",
    plan: "프리미엄 패스",
    remainingDays: "11일",
    branch: "진주 피트니스 라운지",
    message: "이용권 지점이 현재 매장과 다릅니다. 제휴 지점 권한을 확인하세요."
  },
  {
    status: "회원권 만료",
    memberName: "최나은",
    memberId: "M-1028",
    plan: "첫 달 체험권",
    remainingDays: "0일",
    branch: "머슬팩토리 경상대점",
    message: "회원권 기간이 종료되어 입장할 수 없습니다. 재구독 안내가 필요합니다."
  }
];

export const entryLogs: AdminEntryLog[] = [
  { id: "entry-001", memberName: "김예림", time: "16:22", status: "입장 승인", plan: "1개월 베이직" },
  { id: "entry-002", memberName: "이지원", time: "15:48", status: "입장 승인", plan: "프리미엄 패스" },
  { id: "entry-003", memberName: "박서준", time: "14:10", status: "해지예약 상태 입장", plan: "1개월 베이직" },
  { id: "entry-004", memberName: "최나은", time: "12:35", status: "입장 거절", plan: "회원권 만료" }
];

export const ptTrainers: Trainer[] = [
  {
    id: "pt-kim",
    uid: "trainer-kim-doyun",
    facilityIds: ["muscle-factory"],
    name: "김도윤 트레이너",
    gender: "남성",
    career: "8년",
    certs: ["생활스포츠지도사 2급", "NSCA-CPT"],
    specialty: "감량·초보자 전문",
    price: 55000,
    rating: 4.9,
    description: "처음 운동하는 회원을 위한 기초 자세와 감량 루틴을 설계합니다.",
    image: "images/returnpass-trainer-portraits-v1.png",
    imagePosition: "0% 0%",
    intro: "운동이 낯선 회원도 부담 없이 시작하도록 작은 성공부터 쌓습니다.",
    videoUrl: "",
    tags: {
      specialties: ["체중감량", "웨이트 입문", "생활 습관"],
      intensity: "점진적",
      tone: "다정·응원형",
      teach: "원리까지 설명",
      dietInvolve: "주 1회 피드백",
      careExp: ["무릎", "허리"]
    },
    timeSlots: ["오전", "오후", "주말"],
    reviewCount: 128,
    cases: [
      { title: "12주 감량", summary: "운동 입문 회원의 체력과 생활 습관을 함께 개선" },
      { title: "무릎 부담 감소", summary: "하체 정렬과 둔근 활성 중심의 단계별 프로그램" }
    ],
    payoutRate: 0.7,
    status: "active"
  },
  {
    id: "pt-lee",
    uid: "trainer-lee-seohyun",
    facilityIds: ["balance-pilates", "fitness-lounge"],
    name: "이서현 트레이너",
    gender: "여성",
    career: "7년",
    certs: ["재활필라테스 지도자", "생활스포츠지도사 2급"],
    specialty: "여성 체형교정",
    price: 60000,
    rating: 4.8,
    description: "골반, 어깨 라인, 코어 안정성을 중심으로 체형 교정을 돕습니다.",
    image: "images/returnpass-trainer-portraits-v1.png",
    imagePosition: "33.333% 0%",
    intro: "일상 자세를 세밀하게 보고 몸이 편해지는 움직임을 알려드립니다.",
    videoUrl: "",
    tags: {
      specialties: ["체형교정·자세", "코어", "여성 운동"],
      intensity: "중강도",
      tone: "담백·프로형",
      teach: "원리까지 설명",
      dietInvolve: "운동만",
      careExp: ["목", "어깨", "허리"]
    },
    timeSlots: ["새벽", "오전", "야간"],
    reviewCount: 94,
    cases: [
      { title: "라운드숄더 개선", summary: "호흡과 견갑 안정화 중심의 10주 프로그램" },
      { title: "골반 밸런스", summary: "보행과 코어 패턴을 함께 교정한 사례" }
    ],
    payoutRate: 0.72,
    status: "active"
  },
  {
    id: "pt-park",
    uid: "trainer-park-minjae",
    facilityIds: ["muscle-factory", "body-lab"],
    name: "박민재 트레이너",
    gender: "남성",
    career: "10년",
    certs: ["NSCA-CSCS", "보디빌딩 지도자"],
    specialty: "근력·바디프로필",
    price: 65000,
    rating: 4.9,
    description: "근력 향상과 바디프로필 준비를 위한 주기화 프로그램을 제공합니다.",
    image: "images/returnpass-trainer-portraits-v1.png",
    imagePosition: "66.666% 0%",
    intro: "기록으로 확인되는 훈련과 명확한 피드백을 중요하게 생각합니다.",
    videoUrl: "",
    tags: {
      specialties: ["근력·벌크업", "바디프로필", "파워리프팅"],
      intensity: "고강도",
      tone: "직설·푸시형",
      teach: "핵심만",
      dietInvolve: "매일 체크",
      careExp: ["어깨"]
    },
    timeSlots: ["오후", "야간", "주말"],
    reviewCount: 176,
    cases: [
      { title: "첫 바디프로필", summary: "16주 근력 유지형 감량 프로그램" },
      { title: "3대 중량 향상", summary: "스쿼트와 데드리프트 기술 교정 사례" }
    ],
    payoutRate: 0.75,
    status: "active"
  },
  {
    id: "pt-jung",
    uid: "trainer-jung-somin",
    facilityIds: ["breath-pilates"],
    name: "정소민 트레이너",
    gender: "여성",
    career: "9년",
    certs: ["물리치료사", "재활필라테스 지도자"],
    specialty: "통증·재활 운동",
    price: 70000,
    rating: 4.9,
    description: "허리와 어깨 불편을 고려한 저강도 재활 운동을 설계합니다.",
    image: "images/returnpass-trainer-portraits-v1.png",
    imagePosition: "100% 0%",
    intro: "통증을 참는 운동보다 안전하게 다시 움직이는 과정을 안내합니다.",
    videoUrl: "",
    tags: {
      specialties: ["통증·재활", "자세 재교육", "호흡"],
      intensity: "점진적",
      tone: "담백·프로형",
      teach: "원리까지 설명",
      dietInvolve: "운동만",
      careExp: ["무릎", "허리", "어깨", "목"]
    },
    timeSlots: ["오전", "오후"],
    reviewCount: 83,
    cases: [{ title: "허리 불편 완화", summary: "호흡과 골반 안정화 중심의 단계별 복귀 프로그램" }],
    payoutRate: 0.74,
    status: "active"
  },
  {
    id: "pt-seo",
    uid: "trainer-seo-jian",
    facilityIds: ["return-yoga"],
    name: "서지안 트레이너",
    gender: "여성",
    career: "6년",
    certs: ["RYT 500", "요가 테라피 지도자"],
    specialty: "유연성·컨디션 회복",
    price: 50000,
    rating: 4.8,
    description: "호흡과 유연성을 통해 일상 피로와 긴장을 낮추는 수업을 진행합니다.",
    image: "images/returnpass-trainer-portraits-v1.png",
    imagePosition: "0% 100%",
    intro: "잘하는 동작보다 오늘 몸에 맞는 움직임을 찾는 시간을 만듭니다.",
    videoUrl: "",
    tags: {
      specialties: ["체력·컨디션", "유연성", "요가"],
      intensity: "점진적",
      tone: "다정·응원형",
      teach: "따라하기",
      dietInvolve: "운동만",
      careExp: ["목", "어깨"]
    },
    timeSlots: ["새벽", "오전", "주말"],
    reviewCount: 72,
    cases: [{ title: "아침 루틴 정착", summary: "주 2회 수업과 10분 홈 루틴을 연결" }],
    payoutRate: 0.7,
    status: "active"
  },
  {
    id: "pt-yoon",
    uid: "trainer-yoon-taemin",
    facilityIds: ["body-lab"],
    name: "윤태민 트레이너",
    gender: "남성",
    career: "5년",
    certs: ["생활스포츠지도사 2급", "FMS Level 1"],
    specialty: "웨이트 입문·체력",
    price: 48000,
    rating: 4.7,
    description: "기구 사용법부터 차근차근 배우는 입문 프로그램을 제공합니다.",
    image: "images/returnpass-trainer-portraits-v1.png",
    imagePosition: "33.333% 100%",
    intro: "헬스장에 들어오는 순간부터 혼자 운동할 수 있을 때까지 함께합니다.",
    videoUrl: "",
    tags: {
      specialties: ["웨이트 입문", "체력·컨디션", "기초 근력"],
      intensity: "중강도",
      tone: "다정·응원형",
      teach: "핵심만",
      dietInvolve: "주 1회 피드백",
      careExp: ["없음"]
    },
    timeSlots: ["오후", "야간"],
    reviewCount: 51,
    cases: [{ title: "운동 입문 8주", summary: "기구 사용과 전신 루틴 독립까지 연결" }],
    payoutRate: 0.68,
    status: "active"
  },
  {
    id: "pt-go",
    uid: "trainer-go-yuna",
    facilityIds: ["balance-pilates"],
    name: "고유나 트레이너",
    gender: "여성",
    career: "8년",
    certs: ["산전산후 필라테스", "Balanced Body Comprehensive"],
    specialty: "산전·산후 코어",
    price: 68000,
    rating: 4.9,
    description: "생애주기에 맞춘 코어 회복과 안전한 움직임을 지도합니다.",
    image: "images/returnpass-trainer-portraits-v1.png",
    imagePosition: "66.666% 100%",
    intro: "몸의 변화를 존중하면서 일상으로 편안하게 돌아오도록 돕습니다.",
    videoUrl: "",
    tags: {
      specialties: ["체형교정·자세", "코어", "산전·산후"],
      intensity: "점진적",
      tone: "다정·응원형",
      teach: "원리까지 설명",
      dietInvolve: "운동만",
      careExp: ["허리", "골반"]
    },
    timeSlots: ["오전", "오후", "주말"],
    reviewCount: 109,
    cases: [{ title: "산후 코어 회복", summary: "호흡과 골반저근 중심의 12주 프로그램" }],
    payoutRate: 0.74,
    status: "active"
  },
  {
    id: "pt-lee-hajun",
    uid: "trainer-lee-hajun",
    facilityIds: ["fitness-lounge"],
    name: "이하준 트레이너",
    gender: "남성",
    career: "7년",
    certs: ["NASM-CPT", "스포츠영양 코치"],
    specialty: "감량·식단 피드백",
    price: 58000,
    rating: 4.8,
    description: "지속 가능한 감량을 위해 운동과 식단 피드백을 함께 제공합니다.",
    image: "images/returnpass-trainer-portraits-v1.png",
    imagePosition: "100% 100%",
    intro: "완벽한 식단보다 오래 유지할 수 있는 선택을 같이 찾습니다.",
    videoUrl: "",
    tags: {
      specialties: ["체중감량", "식단 코칭", "유산소"],
      intensity: "중강도",
      tone: "담백·프로형",
      teach: "핵심만",
      dietInvolve: "매일 체크",
      careExp: ["무릎"]
    },
    timeSlots: ["새벽", "야간", "주말"],
    reviewCount: 117,
    cases: [{ title: "직장인 감량", summary: "주 2회 운동과 외식 대응 식단 피드백" }],
    payoutRate: 0.72,
    status: "active"
  }
];

export const ptSubscriptionPlans: PtSubscriptionPlan[] = [
  {
    id: "pt-4",
    name: "PT 라이트 4",
    sessions: 4,
    frequency: "주 1회",
    discountRate: 0,
    description: "운동 습관을 가볍게 시작하는 월 4회 구독",
    benefits: ["월 4회 1:1 세션", "미사용 2회까지 이월", "주간 피드백", "24시간 전 취소 무료"]
  },
  {
    id: "pt-8",
    name: "PT 밸런스 8",
    sessions: 8,
    frequency: "주 2회",
    discountRate: 0.05,
    description: "변화를 꾸준히 만드는 가장 균형 잡힌 구독",
    benefits: ["월 8회 1:1 세션", "미사용 2회까지 이월", "운동·식단 피드백", "우선 일정 예약"],
    recommended: true
  },
  {
    id: "pt-12",
    name: "PT 인텐시브 12",
    sessions: 12,
    frequency: "주 3회",
    discountRate: 0.1,
    description: "단기간 목표에 집중하는 월 12회 구독",
    benefits: ["월 12회 1:1 세션", "미사용 2회까지 이월", "매일 습관 체크", "AI 루틴 연동"]
  }
];

export const weeklyRoutine: RoutinePlan = {
  memberName: "김예림",
  goal: "감량",
  frequency: "주 4회",
  days: [
    { day: "월", focus: "하체", detail: "스쿼트, 레그프레스, 힙브릿지 중심" },
    { day: "수", focus: "등/이두", detail: "랫풀다운, 시티드로우, 덤벨컬" },
    { day: "금", focus: "가슴/삼두", detail: "체스트프레스, 푸시업, 케이블 푸시다운" },
    { day: "토", focus: "유산소", detail: "인터벌 러닝 25분과 코어 10분" }
  ]
};

export const dietRecommendation: DietRecommendation = {
  memberName: "김예림",
  source: "본사 식단표 기반 맞춤 식단",
  settings: [
    { label: "목표", value: "감량" },
    { label: "운동량", value: "주 4회" },
    { label: "제외 음식", value: "새우" },
    { label: "예산", value: "주 7만원" }
  ],
  todayMenu: "닭가슴살 현미볼 + 미역국",
  calories: "약 520kcal",
  protein: "단백질 42g",
  note: "운동일 저녁 기준으로 탄수화물은 낮추고 단백질은 충분히 맞춘 추천입니다."
};

export const shopProducts: Product[] = [
  {
    id: "chicken-original",
    sellerType: "hq",
    sellerId: "returnlife-hq",
    sellerName: "리턴라이프 본사",
    fulfillment: "both",
    category: "닭가슴살·도시락",
    stock: 240,
    status: "active",
    name: "리턴샵 수비드 닭가슴살 오리지널",
    subtitle: "운동 끝나고 바로 먹는 촉촉한 단백질 루틴",
    price: 3200,
    originalPrice: 3900,
    image: "images/returnshop-chicken-breast.png",
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
      "리턴패스 구독 회원은 매장 픽업 또는 냉장 배송을 선택할 수 있습니다."
    ],
    shipping: "오늘 18시 전 주문 시 내일 도착 예정",
    foodInfo: {
      origin: "닭고기(국내산)",
      expiry: "제조일로부터 냉장 14일",
      nutrition: "120g 기준 138kcal, 단백질 24g"
    }
  },
  {
    id: "chicken-garlic",
    sellerType: "hq",
    sellerId: "returnlife-hq",
    sellerName: "리턴라이프 본사",
    fulfillment: "both",
    category: "닭가슴살·도시락",
    stock: 180,
    status: "active",
    name: "리턴샵 수비드 닭가슴살 갈릭",
    subtitle: "마늘 향을 살린 담백한 단백질 도시락",
    price: 3400,
    originalPrice: 4100,
    image: "images/returnshop-chicken-breast.png",
    badge: "회원 전용 17% 할인",
    tags: ["단백질 23g", "저지방", "전자레인지 1분", "냉장 배송"],
    nutrition: [
      { label: "중량", value: "120g" },
      { label: "단백질", value: "23g" },
      { label: "열량", value: "142kcal" },
      { label: "보관", value: "냉장" }
    ],
    detailPoints: [
      "구운 마늘을 더해 밋밋함 없이 먹을 수 있습니다.",
      "오리지널과 번갈아 먹기 좋은 두 번째 맛입니다.",
      "냉장 배송과 시설 픽업을 모두 지원합니다."
    ],
    shipping: "오늘 18시 전 주문 시 내일 도착 예정",
    foodInfo: {
      origin: "닭고기(국내산), 마늘(국내산)",
      expiry: "제조일로부터 냉장 14일",
      nutrition: "120g 기준 142kcal, 단백질 23g"
    }
  },
  {
    id: "whey-protein-2kg",
    sellerType: "vendor",
    sellerId: "vendor-proteinlab",
    sellerName: "프로틴랩",
    fulfillment: "delivery",
    category: "보충제·단백질",
    stock: 64,
    status: "active",
    name: "프로틴랩 WPI 아이솔레이트 2kg",
    subtitle: "유당 부담을 줄인 분리유청 단백질",
    price: 59000,
    originalPrice: 72000,
    image: "",
    badge: "입점사 단독",
    tags: ["1회 25g", "유당 저감", "초코맛"],
    nutrition: [
      { label: "1회 제공량", value: "30g" },
      { label: "단백질", value: "25g" },
      { label: "열량", value: "118kcal" },
      { label: "보관", value: "실온" }
    ],
    detailPoints: [
      "분리유청(WPI) 공정으로 유당과 지방을 낮췄습니다.",
      "물이나 우유 200ml에 한 스쿱을 섞어 드세요.",
      "입점 판매업체가 직접 배송합니다."
    ],
    shipping: "평일 15시 전 주문 시 당일 출고",
    foodInfo: {
      origin: "유청단백분말(미국산)",
      expiry: "제조일로부터 24개월",
      nutrition: "30g 기준 118kcal, 단백질 25g"
    }
  },
  {
    id: "bcaa-drink",
    sellerType: "vendor",
    sellerId: "vendor-proteinlab",
    sellerName: "프로틴랩",
    fulfillment: "delivery",
    category: "보충제·단백질",
    stock: 120,
    status: "active",
    name: "프로틴랩 BCAA 드링크 20병",
    subtitle: "운동 중 가볍게 마시는 아미노산 음료",
    price: 24000,
    originalPrice: 30000,
    image: "",
    badge: "20% 할인",
    tags: ["무설탕", "레몬맛", "500ml"],
    nutrition: [
      { label: "용량", value: "500ml" },
      { label: "BCAA", value: "3,000mg" },
      { label: "열량", value: "10kcal" },
      { label: "보관", value: "실온" }
    ],
    detailPoints: [
      "운동 중 나눠 마시기 좋은 무설탕 아미노산 음료입니다.",
      "레몬 향으로 끝맛이 텁텁하지 않습니다.",
      "20병 묶음으로 배송됩니다."
    ],
    shipping: "평일 15시 전 주문 시 당일 출고",
    foodInfo: {
      origin: "정제수, L-류신(중국산)",
      expiry: "제조일로부터 12개월",
      nutrition: "500ml 기준 10kcal, BCAA 3,000mg"
    }
  },
  {
    id: "shaker-bottle",
    sellerType: "hq",
    sellerId: "returnlife-hq",
    sellerName: "리턴라이프 본사",
    fulfillment: "both",
    category: "소도구",
    stock: 310,
    status: "active",
    name: "리턴패스 셰이커 보틀 600ml",
    subtitle: "새지 않는 잠금 뚜껑과 분리 세척 구조",
    price: 12000,
    originalPrice: 15000,
    image: "",
    badge: "브랜드 굿즈",
    tags: ["600ml", "식약처 인증 소재", "분리 세척"],
    nutrition: [
      { label: "용량", value: "600ml" },
      { label: "소재", value: "트라이탄" },
      { label: "무게", value: "150g" },
      { label: "세척", value: "분리형" }
    ],
    detailPoints: [
      "잠금 뚜껑으로 가방 안에서 새지 않습니다.",
      "믹싱 볼이 들어 있어 단백질이 잘 풀립니다.",
      "시설 인포데스크 픽업이 가능합니다."
    ],
    shipping: "오늘 18시 전 주문 시 내일 도착 예정"
  },
  {
    id: "resistance-band",
    sellerType: "hq",
    sellerId: "returnlife-hq",
    sellerName: "리턴라이프 본사",
    fulfillment: "delivery",
    category: "소도구",
    stock: 150,
    status: "active",
    name: "리턴패스 저항 밴드 3종 세트",
    subtitle: "홈트 루틴에 바로 쓰는 강도별 밴드",
    price: 18000,
    originalPrice: 23000,
    image: "",
    badge: "AI 루틴 연계",
    tags: ["약·중·강", "라텍스 프리", "파우치 포함"],
    nutrition: [
      { label: "구성", value: "밴드 3개" },
      { label: "강도", value: "약·중·강" },
      { label: "소재", value: "TPE" },
      { label: "보관", value: "파우치" }
    ],
    detailPoints: [
      "AI 루틴의 홈트 대체 종목에 바로 사용할 수 있습니다.",
      "라텍스 프리 소재로 냄새가 적습니다.",
      "휴대용 파우치가 함께 들어 있습니다."
    ],
    shipping: "오늘 18시 전 주문 시 내일 도착 예정"
  },
  {
    id: "lifting-strap",
    sellerType: "vendor",
    sellerId: "vendor-fitgear",
    sellerName: "피트기어",
    fulfillment: "delivery",
    category: "소도구",
    stock: 88,
    status: "active",
    name: "피트기어 리프팅 스트랩",
    subtitle: "악력이 먼저 풀릴 때 잡아주는 보조 스트랩",
    price: 15000,
    originalPrice: 19000,
    image: "",
    badge: "입점사 단독",
    tags: ["면 소재", "논슬립", "1쌍"],
    nutrition: [
      { label: "구성", value: "1쌍" },
      { label: "길이", value: "50cm" },
      { label: "소재", value: "면·고무" },
      { label: "세탁", value: "손세탁" }
    ],
    detailPoints: [
      "데드리프트, 로우에서 악력 부담을 덜어줍니다.",
      "논슬립 처리로 바에서 밀리지 않습니다.",
      "입점 판매업체가 직접 배송합니다."
    ],
    shipping: "평일 14시 전 주문 시 당일 출고"
  },
  {
    id: "training-tee",
    sellerType: "vendor",
    sellerId: "vendor-fitgear",
    sellerName: "피트기어",
    fulfillment: "delivery",
    category: "의류",
    stock: 45,
    status: "active",
    name: "피트기어 드라이 트레이닝 티",
    subtitle: "땀이 빨리 마르는 기능성 반팔",
    price: 26000,
    originalPrice: 32000,
    image: "",
    badge: "신상품",
    tags: ["흡습속건", "무봉제 어깨", "S~XL"],
    nutrition: [
      { label: "소재", value: "폴리 92%" },
      { label: "핏", value: "레귤러" },
      { label: "사이즈", value: "S~XL" },
      { label: "세탁", value: "찬물 세탁" }
    ],
    detailPoints: [
      "흡습속건 원단으로 운동 중 달라붙지 않습니다.",
      "어깨 무봉제 처리로 쓸림이 적습니다.",
      "입점 판매업체가 직접 배송합니다."
    ],
    shipping: "평일 14시 전 주문 시 당일 출고"
  },
  {
    id: "pickup-towel-set",
    sellerType: "facility",
    sellerId: "muscle-factory",
    sellerName: "머슬팩토리 경상대점",
    fulfillment: "pickup",
    category: "시설 픽업",
    stock: 40,
    status: "active",
    name: "머슬팩토리 운동 타월 2매",
    subtitle: "인포데스크에서 바로 받는 지점 판매 상품",
    price: 9000,
    originalPrice: 12000,
    image: "",
    badge: "지점 픽업 전용",
    tags: ["40×80cm", "면 100%", "지점 수령"],
    nutrition: [
      { label: "구성", value: "2매" },
      { label: "크기", value: "40×80cm" },
      { label: "소재", value: "면 100%" },
      { label: "수령", value: "인포데스크" }
    ],
    detailPoints: [
      "배송비 없이 운동 가는 길에 받아 갈 수 있습니다.",
      "지점 인포데스크에서 QR 확인 후 수령합니다.",
      "재고는 지점에서 직접 관리합니다."
    ],
    shipping: "주문 후 2시간 뒤부터 인포데스크 수령 가능"
  },
  {
    id: "pickup-protein-shake",
    sellerType: "facility",
    sellerId: "fitness-lounge",
    sellerName: "진주 피트니스 라운지",
    fulfillment: "pickup",
    category: "시설 픽업",
    stock: 60,
    status: "active",
    name: "라운지 단백질 셰이크",
    subtitle: "운동 직후 바로 받아 마시는 지점 셰이크",
    price: 5500,
    originalPrice: 7000,
    image: "",
    badge: "지점 픽업 전용",
    tags: ["단백질 20g", "당일 제조", "지점 수령"],
    nutrition: [
      { label: "용량", value: "400ml" },
      { label: "단백질", value: "20g" },
      { label: "열량", value: "180kcal" },
      { label: "수령", value: "인포데스크" }
    ],
    detailPoints: [
      "지점에서 당일 제조해 냉장 보관합니다.",
      "운동 직후 인포데스크에서 바로 받을 수 있습니다.",
      "배송은 제공하지 않는 픽업 전용 상품입니다."
    ],
    shipping: "주문 후 30분 뒤부터 인포데스크 수령 가능",
    foodInfo: {
      origin: "우유(국내산), 유청단백분말(미국산)",
      expiry: "제조 당일 내 섭취",
      nutrition: "400ml 기준 180kcal, 단백질 20g"
    }
  }
];

export const vendors: Vendor[] = [
  {
    id: "vendor-proteinlab",
    bizName: "주식회사 프로틴랩",
    bizNo: "214-88-01923",
    contact: "1600-0000",
    commissionRate: 0.12,
    status: "active"
  },
  {
    id: "vendor-fitgear",
    bizName: "피트기어 컴퍼니",
    bizNo: "132-81-55417",
    contact: "1600-1111",
    commissionRate: 0.15,
    status: "active"
  }
];

/** 판매자별 배송 정책. 픽업 전용 판매자는 배송비가 없습니다. */
export const sellerShippingPolicies: SellerShipping[] = [
  {
    sellerId: "returnlife-hq",
    sellerName: "리턴라이프 본사",
    sellerType: "hq",
    shippingFee: 3000,
    freeShippingOver: 30000
  },
  {
    sellerId: "vendor-proteinlab",
    sellerName: "프로틴랩",
    sellerType: "vendor",
    shippingFee: 3500,
    freeShippingOver: 50000
  },
  {
    sellerId: "vendor-fitgear",
    sellerName: "피트기어",
    sellerType: "vendor",
    shippingFee: 3500,
    freeShippingOver: null
  },
  {
    sellerId: "muscle-factory",
    sellerName: "머슬팩토리 경상대점",
    sellerType: "facility",
    shippingFee: 0,
    freeShippingOver: null
  },
  {
    sellerId: "fitness-lounge",
    sellerName: "진주 피트니스 라운지",
    sellerType: "facility",
    shippingFee: 0,
    freeShippingOver: null
  }
];

export const facilityCategories = [
  { id: "gym", label: "헬스" },
  { id: "yoga", label: "요가" },
  { id: "pilates", label: "필라테스" },
  { id: "crossfit", label: "크로스핏" },
  { id: "boxing", label: "복싱" }
] as const;

const contentThumbnailSprite = "images/returnpass-content-thumbnails-v1.webp";
const contentThumbnail = (thumbnailPosition: string) => ({
  thumbnail: contentThumbnailSprite,
  thumbnailPosition
});

export const contents: Content[] = [
  {
    id: "content-001",
    type: "video",
    title: "운동 전 8분 전신 워밍업",
    summary: "관절을 부드럽게 열고 체온을 올리는 입문 워밍업입니다.",
    ...contentThumbnail("0% 0%"),
    level: "입문",
    bodyParts: ["전신"],
    durationMin: 8,
    access: "public",
    tags: ["워밍업", "입문"],
    author: "리턴라이프 코칭팀",
    publishedAt: "2026.07.20",
    videoUrl: "https://example.com/content-001",
    videoChapters: [
      { time: "00:00", label: "오늘의 워밍업 목표" },
      { time: "01:10", label: "목·어깨 관절 풀기" },
      { time: "03:40", label: "고관절·하체 가동성" },
      { time: "06:20", label: "가볍게 심박 올리기" }
    ]
  },
  {
    id: "content-002",
    type: "video",
    title: "퇴근 후 어깨 긴장 풀기",
    summary: "굳은 목과 어깨를 편안하게 만드는 12분 회복 루틴입니다.",
    ...contentThumbnail("33.333% 0%"),
    level: "초급",
    bodyParts: ["목", "어깨"],
    durationMin: 12,
    access: "public",
    tags: ["스트레칭", "회복"],
    author: "서지안 트레이너",
    publishedAt: "2026.07.18",
    videoUrl: "https://example.com/content-002",
    videoChapters: [
      { time: "00:00", label: "굳은 목 인지하기" },
      { time: "02:30", label: "승모근 이완 스트레칭" },
      { time: "06:00", label: "가슴 열기 & 자세 정렬" },
      { time: "09:30", label: "마무리 호흡 정리" }
    ]
  },
  {
    id: "content-003",
    type: "video",
    title: "스쿼트 기본 자세 체크",
    summary: "발 위치부터 무릎 방향까지 스쿼트의 핵심을 확인합니다.",
    ...contentThumbnail("66.666% 0%"),
    level: "입문",
    bodyParts: ["하체"],
    durationMin: 10,
    access: "subscriber",
    tags: ["스쿼트", "웨이트 입문"],
    author: "김도윤 트레이너",
    publishedAt: "2026.07.16",
    videoUrl: "https://example.com/content-003",
    videoChapters: [
      { time: "00:00", label: "발 너비와 발끝 방향" },
      { time: "02:20", label: "무릎-발끝 정렬" },
      { time: "05:10", label: "골반 접기와 상체 각도" },
      { time: "08:00", label: "흔한 실수 교정" }
    ]
  },
  {
    id: "content-004",
    type: "video",
    title: "코어를 깨우는 필라테스",
    summary: "호흡과 골반 중립을 연결하는 기초 코어 수업입니다.",
    ...contentThumbnail("100% 0%"),
    level: "초급",
    bodyParts: ["코어"],
    durationMin: 18,
    access: "subscriber",
    tags: ["필라테스", "코어"],
    author: "이서현 트레이너",
    publishedAt: "2026.07.14",
    videoUrl: "https://example.com/content-004",
    videoChapters: [
      { time: "00:00", label: "호흡과 골반 중립 찾기" },
      { time: "03:30", label: "코어 활성화 기본 동작" },
      { time: "09:00", label: "골반 안정성 강화" },
      { time: "14:20", label: "이완과 정리 운동" }
    ]
  },
  {
    id: "content-005",
    type: "article",
    title: "한 달 운동을 오래 이어가는 법",
    summary: "의지보다 일정과 환경을 설계하는 현실적인 습관 가이드입니다.",
    ...contentThumbnail("0% 50%"),
    level: "입문",
    bodyParts: ["전신"],
    durationMin: 5,
    access: "public",
    tags: ["습관", "동기"],
    author: "리턴라이프 편집팀",
    publishedAt: "2026.07.12",
    body: "운동을 다시 시작할 때 가장 흔한 실패는 의지가 약해서가 아니라 처음부터 목표를 너무 크게 잡기 때문입니다. 주 5회 헬스장 방문 같은 목표는 한 주만 어긋나도 무너지기 쉽습니다.\n\n먼저 반복 가능한 최소 단위를 정하세요. 하루 10분, 주 2회처럼 바쁜 날에도 지킬 수 있는 크기여야 합니다. 작아 보여도 꾸준히 반복되면 자동화되는 습관의 뼈대가 됩니다.\n\n다음은 환경 설계입니다. 운동 가방을 현관에 두고, 캘린더에 시간을 미리 막아두고, 같은 시간대에 운동하도록 신호를 만드세요. 의지력보다 일정과 환경이 행동을 결정합니다.\n\n마지막으로 완벽하지 않아도 기록을 이어가세요. 한 번 빠졌다고 포기하지 말고 다음 날 다시 최소 단위를 실행하면 됩니다. 리턴패스의 완료 체크로 오늘의 실행을 가볍게 남겨보세요."
  },
  {
    id: "content-006",
    type: "article",
    title: "운동 다음 날 근육통 구분하기",
    summary: "일반적인 근육통과 휴식이 필요한 신호를 구분해 봅니다.",
    ...contentThumbnail("33.333% 50%"),
    level: "초급",
    bodyParts: ["전신"],
    durationMin: 6,
    access: "subscriber",
    tags: ["회복", "안전"],
    author: "리턴라이프 코칭팀",
    publishedAt: "2026.07.10",
    body: "운동 다음 날 찾아오는 뻐근함은 대부분 지연성 근육통(DOMS)입니다. 익숙하지 않은 자극을 준 근육이 회복하며 강해지는 자연스러운 과정으로, 보통 24~72시간 안에 서서히 가라앉습니다.\n\n이런 근육통은 근육 부위 전반에 은근하게 퍼지고, 움직이면 오히려 조금 풀리는 특징이 있습니다. 가벼운 스트레칭, 충분한 수분과 단백질, 그리고 하루 이틀의 저강도 활동이 회복을 돕습니다.\n\n반면 주의해야 할 신호도 있습니다. 관절 안쪽의 날카로운 통증, 한쪽만 심하게 붓거나 멍이 드는 경우, 며칠이 지나도 심해지는 통증은 단순 근육통이 아닐 수 있습니다.\n\n이럴 때는 운동을 멈추고 휴식하며, 증상이 지속되면 전문가와 상담하세요. 통증을 참고 밀어붙이는 것보다 회복 신호를 존중하는 편이 결국 더 빠른 성장을 만듭니다."
  },
  {
    id: "content-007",
    type: "article",
    title: "내 목표에 맞는 PT 횟수",
    summary: "주 1회부터 주 3회까지 목표와 예산에 따른 선택 기준입니다.",
    ...contentThumbnail("66.666% 50%"),
    level: "입문",
    bodyParts: ["전신"],
    durationMin: 7,
    access: "subscriber",
    tags: ["PT", "목표 설정"],
    author: "리턴라이프 PT팀",
    publishedAt: "2026.07.08",
    body: "PT 횟수를 정할 때 흔히 '많을수록 좋다'고 생각하지만, 실제로는 목표와 생활 패턴에 맞추는 편이 훨씬 효율적입니다.\n\n주 1회는 자세 점검과 방향 설정에 적합합니다. 스스로 운동하는 습관이 어느 정도 잡힌 사람이 폼을 교정받고 다음 2주 계획을 받아 가는 데 좋습니다.\n\n주 2회는 가장 균형 잡힌 선택입니다. 트레이너와 함께하는 날과 혼자 운동하는 날이 번갈아 배치되어 학습과 실행이 함께 굴러갑니다. 감량이나 체형 교정 목표에 특히 잘 맞습니다.\n\n주 3회는 재활, 대회 준비처럼 집중 관리가 필요한 시기에 적합합니다. 다만 회복과 예산 부담이 커지므로 기간을 정해 운영하는 편이 좋습니다.\n\n핵심은 수업 횟수 자체가 아니라 수업 사이에 개인 운동을 실행할 수 있는지입니다. 내 일정을 먼저 보고 PT 매칭에서 빈도를 조정해 보세요."
  },
  {
    id: "content-008",
    type: "mealPlan",
    title: "감량을 위한 1주 한식 식단표",
    summary: "외식과 집밥을 함께 고려한 단백질 중심 주간 식단입니다.",
    ...contentThumbnail("100% 50%"),
    level: "초급",
    bodyParts: ["영양"],
    durationMin: 4,
    access: "subscriber",
    tags: ["감량", "한식", "식단표"],
    author: "리턴라이프 영양팀",
    publishedAt: "2026.07.06",
    weeklyMeals: [
      { day: "월", menu: "현미밥·두부된장국·나물 / 닭가슴살 비빔밥", kcal: "약 1,500kcal" },
      { day: "화", menu: "귀리죽·달걀 / 고등어구이 정식", kcal: "약 1,550kcal" },
      { day: "수", menu: "그릭요거트·오트밀 / 소고기 미역국 백반", kcal: "약 1,480kcal" },
      { day: "목", menu: "통밀토스트·달걀 / 닭가슴살 샐러드", kcal: "약 1,450kcal" },
      { day: "금", menu: "현미밥·순두부찌개 / 제육 채소볶음", kcal: "약 1,600kcal" },
      { day: "주말", menu: "자유식 1끼 + 단백질 위주 2끼", kcal: "약 1,700kcal" }
    ]
  },
  {
    id: "content-009",
    type: "mealPlan",
    title: "운동일 단백질 식단표",
    summary: "운동 전후 식사 시간을 고려한 하루 단백질 배분 예시입니다.",
    ...contentThumbnail("0% 100%"),
    level: "초급",
    bodyParts: ["영양"],
    durationMin: 4,
    access: "pt",
    tags: ["단백질", "운동일"],
    author: "리턴라이프 영양팀",
    publishedAt: "2026.07.04",
    weeklyMeals: [
      { day: "아침", menu: "달걀 3개·통밀토스트·바나나", kcal: "약 450kcal" },
      { day: "운동 전", menu: "바나나·아메리카노 (1시간 전)", kcal: "약 120kcal" },
      { day: "운동 후", menu: "유청 단백질·현미밥 소량", kcal: "약 320kcal" },
      { day: "점심", menu: "닭가슴살 현미볼·채소", kcal: "약 550kcal" },
      { day: "저녁", menu: "연어구이·고구마·샐러드", kcal: "약 560kcal" }
    ]
  },
  {
    id: "content-010",
    type: "program",
    title: "다시 시작하는 4주 운동",
    summary: "주 3회 전신 운동으로 기초 체력을 회복하는 입문 프로그램입니다.",
    ...contentThumbnail("33.333% 100%"),
    level: "입문",
    bodyParts: ["전신"],
    durationMin: 45,
    access: "subscriber",
    tags: ["4주", "전신", "입문"],
    author: "리턴라이프 코칭팀",
    publishedAt: "2026.07.02",
    programWeeks: [
      { week: 1, title: "적응 주간", detail: "맨몸 스쿼트·힙힌지·플랭크로 기본 동작 익히기 (주 3회)" },
      { week: 2, title: "볼륨 늘리기", detail: "세트 수를 늘리고 밴드·덤벨 저강도 부하 추가" },
      { week: 3, title: "강도 올리기", detail: "런지·푸시업·로우로 전신 복합 운동 확장" },
      { week: 4, title: "정착 주간", detail: "루틴을 몸에 익히고 다음 4주 목표 점검" }
    ]
  },
  {
    id: "content-011",
    type: "program",
    title: "4주 유연성 리턴 프로그램",
    summary: "짧은 요가와 스트레칭으로 움직임 범위를 회복합니다.",
    ...contentThumbnail("66.666% 100%"),
    level: "초급",
    bodyParts: ["전신", "고관절"],
    durationMin: 25,
    access: "subscriber",
    tags: ["4주", "요가", "유연성"],
    author: "서지안 트레이너",
    publishedAt: "2026.06.30",
    programWeeks: [
      { week: 1, title: "가동성 진단", detail: "고관절·햄스트링 상태 확인과 기본 스트레칭 루틴" },
      { week: 2, title: "하체 유연성", detail: "런지·비둘기 자세로 고관절 가동 범위 넓히기" },
      { week: 3, title: "척추·어깨", detail: "고양이-소 자세와 흉추 회전으로 상체 이완" },
      { week: 4, title: "전신 흐름", detail: "짧은 요가 플로우로 움직임을 부드럽게 연결" }
    ]
  },
  {
    id: "content-012",
    type: "program",
    title: "PT 회원용 코어 재교육",
    summary: "담당 트레이너 피드백과 함께 진행하는 4주 코어 프로그램입니다.",
    ...contentThumbnail("100% 100%"),
    level: "중급",
    bodyParts: ["코어", "허리"],
    durationMin: 30,
    access: "pt",
    tags: ["PT 전용", "코어", "자세"],
    author: "정소민 트레이너",
    publishedAt: "2026.06.28",
    programWeeks: [
      { week: 1, title: "코어 재인지", detail: "담당 트레이너와 복압·호흡을 다시 익히는 평가 주간" },
      { week: 2, title: "안정성 강화", detail: "데드버그·버드독으로 허리 부담 없는 코어 강화" },
      { week: 3, title: "기능 연결", detail: "코어와 하체를 연결하는 복합 동작으로 확장" },
      { week: 4, title: "실전 적용", detail: "일상 동작과 운동에 코어 사용을 적용하고 피드백" }
    ]
  }
];

export const aiDietPlan: AiDietPlan = {
  id: "diet-kimyerim-202607",
  summary: {
    targetKcal: 1800,
    protein_g: 125,
    carb_g: 190,
    fat_g: 55,
    note: "주 4회 운동과 감량 목표를 반영한 성인용 예시 식단입니다."
  },
  weeks: [1, 2, 3, 4].map((week) => ({
    week,
    days: [
      {
        date: `W${week}-D1`,
        meals: [
          {
            type: "breakfast",
            name: "그릭요거트 오트볼",
            items: [
              { food: "무가당 그릭요거트", qty: "150g", kcal: 120 },
              { food: "오트밀", qty: "40g", kcal: 150 }
            ],
            kcal: 270,
            recipe: "재료를 섞고 제철 과일을 곁들입니다."
          },
          {
            type: "lunch",
            name: "닭가슴살 현미볼",
            items: [
              { food: "현미밥", qty: "150g", kcal: 230 },
              { food: "닭가슴살", qty: "120g", kcal: 138 }
            ],
            kcal: 520,
            recipe: "채소와 닭가슴살을 데운 뒤 현미밥에 올립니다."
          },
          {
            type: "dinner",
            name: "두부 버섯 전골",
            items: [
              { food: "두부", qty: "180g", kcal: 160 },
              { food: "모둠 버섯", qty: "150g", kcal: 60 }
            ],
            kcal: 430,
            recipe: "저염 육수에 두부와 버섯을 넣고 끓입니다."
          }
        ],
        totalKcal: 1780
      }
    ]
  })),
  groceryList: [
    { name: "닭가슴살", qty: "840g", shopProductId: "chicken-original" },
    { name: "현미밥", qty: "7팩", shopProductId: null },
    { name: "두부", qty: "4모", shopProductId: null }
  ],
  swaps: [
    { from: "새우", to: "닭가슴살", reason: "제외 음식 설정 반영" },
    { from: "흰쌀밥", to: "현미밥", reason: "포만감과 식이섬유 보완" }
  ]
};

export const aiRoutine: AiRoutine = {
  id: "routine-kimyerim-202607",
  memberName: "김예림",
  goal: "감량",
  frequency: 4,
  weeks: [1, 2, 3, 4].map((week) => ({
    week,
    days: [
      {
        day: "월",
        focus: "하체",
        durationMin: 45,
        exercises: [
          { name: "스쿼트", sets: 4, reps: "10회", restSec: 90, alternative: "레그프레스", contentId: "content-003" },
          { name: "힙브릿지", sets: 3, reps: "15회", restSec: 60, alternative: "케이블 풀스루" }
        ]
      },
      {
        day: "수",
        focus: "등·이두",
        durationMin: 45,
        exercises: [
          { name: "랫풀다운", sets: 4, reps: "10회", restSec: 75, alternative: "밴드 풀다운" },
          { name: "시티드 로우", sets: 3, reps: "12회", restSec: 75, alternative: "원암 덤벨 로우" }
        ]
      }
    ]
  })),
  regeneratedCount: 1,
  regenerateLimit: 3
};

export const aiVisualAssets: AiVisualAssets = {
  image: "images/returnpass-ai-coach-visuals-v1.webp",
  dietPosition: "0% 50%",
  routinePosition: "100% 50%"
};

export const communityPosts: Post[] = [
  { id: "post-001", uid: "member-1042", authorName: "김예림", type: "proof", facilityId: "muscle-factory", challengeId: "challenge-001", text: "오늘도 등 운동 완료했어요.", images: [], likes: 24, commentCount: 5, status: "open", reportCount: 0, createdAt: "2026.07.26 21:10", tags: ["운동인증", "등운동"] },
  { id: "post-002", uid: "member-1041", authorName: "이지원", type: "proof", facilityId: "return-yoga", challengeId: "challenge-001", text: "아침 요가로 하루를 시작했습니다.", images: ["images/facility-return-yoga.png"], likes: 31, commentCount: 4, status: "open", reportCount: 0, createdAt: "2026.07.26 08:20", tags: ["요가", "아침운동"] },
  { id: "post-003", uid: "owner-muscle-factory", authorName: "머슬팩토리", type: "notice", facilityId: "muscle-factory", challengeId: null, text: "이번 주 일요일 샤워실 점검이 있습니다.", images: [], likes: 8, commentCount: 1, status: "open", reportCount: 0, createdAt: "2026.07.25 17:00", tags: ["지점공지"] },
  { id: "post-004", uid: "member-1039", authorName: "박서준", type: "qna", facilityId: "body-lab", challengeId: null, text: "스쿼트할 때 발목이 들리는데 어떤 스트레칭이 좋을까요?", images: [], likes: 7, commentCount: 3, status: "open", reportCount: 0, createdAt: "2026.07.25 14:32", tags: ["질문", "스쿼트"] },
  { id: "post-005", uid: "member-1028", authorName: "최나은", type: "proof", facilityId: "balance-pilates", challengeId: "challenge-002", text: "리포머 10회 출석 달성!", images: ["images/facility-balance-pilates.png"], likes: 42, commentCount: 9, status: "open", reportCount: 0, createdAt: "2026.07.24 20:18", tags: ["필라테스", "출석"] },
  { id: "post-006", uid: "member-1027", authorName: "한소희", type: "free", facilityId: "fitness-lounge", challengeId: null, text: "저녁 8시 이후에는 유산소 존이 비교적 여유로워요.", images: [], likes: 16, commentCount: 2, status: "open", reportCount: 0, createdAt: "2026.07.24 19:40", tags: ["혼잡도"] },
  { id: "post-007", uid: "member-1026", authorName: "오민준", type: "proof", facilityId: "muscle-factory", challengeId: "challenge-001", text: "이번 주 세 번째 출석입니다.", images: [], likes: 19, commentCount: 2, status: "open", reportCount: 0, createdAt: "2026.07.23 22:01", tags: ["운동인증"] },
  { id: "post-008", uid: "owner-return-yoga", authorName: "리턴 요가", type: "notice", facilityId: "return-yoga", challengeId: null, text: "토요일 오전 릴랙스 플로우 클래스가 추가되었습니다.", images: ["images/facility-return-yoga.png"], likes: 21, commentCount: 6, status: "open", reportCount: 0, createdAt: "2026.07.23 12:10", tags: ["클래스", "지점공지"] },
  { id: "post-009", uid: "member-1025", authorName: "강지우", type: "qna", facilityId: "balance-pilates", challengeId: null, text: "필라테스 초보도 그룹 수업을 바로 들어도 될까요?", images: [], likes: 10, commentCount: 4, status: "open", reportCount: 0, createdAt: "2026.07.22 10:25", tags: ["질문", "입문"] },
  { id: "post-010", uid: "member-1024", authorName: "서민재", type: "proof", facilityId: "body-lab", challengeId: "challenge-003", text: "점심시간 20분 걷기 완료.", images: [], likes: 13, commentCount: 1, status: "open", reportCount: 0, createdAt: "2026.07.21 13:15", tags: ["걷기", "챌린지"] },
  { id: "post-011", uid: "member-1023", authorName: "윤하늘", type: "free", facilityId: "breath-pilates", challengeId: null, text: "프라이빗 수업 후 허리 움직임이 훨씬 편해졌어요.", images: ["images/facility-breath-pilates.png"], likes: 35, commentCount: 7, status: "open", reportCount: 0, createdAt: "2026.07.20 18:48", tags: ["후기", "재활"] },
  { id: "post-012", uid: "member-1022", authorName: "김태호", type: "free", facilityId: null, challengeId: null, text: "한 달 구독으로 여러 운동을 비교해보는 중입니다.", images: [], likes: 12, commentCount: 5, status: "open", reportCount: 0, createdAt: "2026.07.19 16:30", tags: ["월구독"] },
  { id: "post-013", uid: "member-1021", authorName: "문지은", type: "proof", facilityId: "return-yoga", challengeId: "challenge-002", text: "유연성 루틴 2주차 완료했습니다.", images: [], likes: 27, commentCount: 3, status: "open", reportCount: 0, createdAt: "2026.07.18 09:05", tags: ["유연성", "요가"] },
  { id: "post-014", uid: "member-1020", authorName: "배현우", type: "qna", facilityId: "muscle-factory", challengeId: null, text: "운동 전 식사는 몇 시간 전에 하는 게 좋나요?", images: [], likes: 9, commentCount: 8, status: "open", reportCount: 0, createdAt: "2026.07.17 11:44", tags: ["질문", "식단"] },
  { id: "post-015", uid: "member-1019", authorName: "신예린", type: "free", facilityId: null, challengeId: null, text: "이번 달은 헬스 대신 요가를 시작했어요.", images: [], likes: 18, commentCount: 4, status: "open", reportCount: 0, createdAt: "2026.07.16 20:12", tags: ["운동전환", "요가"] }
];

export const challenges: Challenge[] = [
  {
    id: "challenge-001",
    host: "hq",
    hostName: "리턴라이프 본사",
    title: "4주 12회 출석",
    description: "종목과 시설에 관계없이 4주 동안 12회 운동을 인증합니다.",
    period: { startAt: "2026.07.01", endAt: "2026.07.31" },
    rule: "시설 QR 입장 또는 운동 인증 1일 1회",
    reward: "리턴샵 5,000원 쿠폰",
    participantCount: 184,
    badgeName: "꾸준한 리턴",
    image: "images/returnpass-challenge-banners-v1.webp",
    imagePosition: "50% 0%",
    goalCount: 12,
    myCount: 7,
    steps: [
      "시설에 QR로 입장하면 자동으로 1회가 기록됩니다.",
      "홈 트레이닝은 운동 인증 게시물로 대신 인정됩니다.",
      "하루 최대 1회까지 집계됩니다.",
      "기간 내 12회를 채우면 배지와 쿠폰이 지급됩니다."
    ]
  },
  {
    id: "challenge-002",
    host: "hq",
    hostName: "리턴라이프 본사",
    title: "14일 유연성 리턴",
    description: "매일 10분 스트레칭 또는 요가를 기록합니다.",
    period: { startAt: "2026.07.15", endAt: "2026.07.28" },
    rule: "콘텐츠 완료 체크 또는 인증 게시물",
    reward: "구독 기간 3일 연장",
    participantCount: 96,
    badgeName: "부드러운 리턴",
    image: "images/returnpass-challenge-banners-v1.webp",
    imagePosition: "50% 50%",
    goalCount: 14,
    myCount: 9,
    steps: [
      "스트레칭·요가 콘텐츠를 완료 체크하면 기록됩니다.",
      "직접 인증 게시물을 올려도 인정됩니다.",
      "하루 1회, 10분 이상을 기준으로 합니다.",
      "14일 중 12일 이상 달성하면 구독 3일이 연장됩니다."
    ]
  },
  {
    id: "challenge-003",
    host: "facility",
    hostName: "머슬팩토리 경상대점",
    title: "점심 20분 걷기",
    description: "평일 점심시간에 20분 이상 걷기를 인증합니다.",
    period: { startAt: "2026.07.20", endAt: "2026.08.09" },
    rule: "운동 인증 게시물에 걷기 태그 추가",
    reward: "단백질 음료 1병",
    participantCount: 42,
    badgeName: "런치 워커",
    image: "images/returnpass-challenge-banners-v1.webp",
    imagePosition: "50% 100%",
    goalCount: 15,
    myCount: 4,
    steps: [
      "평일 점심시간(11~14시) 걷기를 인증합니다.",
      "게시물에 `걷기` 태그를 함께 남겨주세요.",
      "20분 이상 걸은 기록만 인정됩니다.",
      "15회를 채운 회원에게 단백질 음료를 드립니다."
    ]
  }
];

export const postComments: Comment[] = [
  { id: "comment-001", postId: "post-001", uid: "member-1041", authorName: "이지원", text: "등 운동 루틴 공유해주실 수 있나요?", createdAt: "2026.07.26 21:24" },
  { id: "comment-002", postId: "post-001", uid: "member-1042", authorName: "김예림", text: "랫풀다운이랑 시티드로우 위주로 했어요!", createdAt: "2026.07.26 21:31", isAuthor: true },
  { id: "comment-003", postId: "post-001", uid: "member-1026", authorName: "오민준", text: "저도 오늘 같은 시간대에 있었네요 ㅎㅎ", createdAt: "2026.07.26 22:02" },
  { id: "comment-004", postId: "post-001", uid: "member-1039", authorName: "박서준", text: "꾸준히 하시는 거 보기 좋습니다.", createdAt: "2026.07.26 22:40" },
  { id: "comment-005", postId: "post-001", uid: "member-1027", authorName: "한소희", text: "이번 주 출석 챌린지도 같이 달성하시겠어요!", createdAt: "2026.07.27 07:15" },
  { id: "comment-006", postId: "post-002", uid: "member-1021", authorName: "문지은", text: "아침 요가 저도 시작해보려고요.", createdAt: "2026.07.26 08:52" },
  { id: "comment-007", postId: "post-002", uid: "member-1041", authorName: "이지원", text: "릴랙스 플로우 수업 추천드려요.", createdAt: "2026.07.26 09:10", isAuthor: true },
  { id: "comment-008", postId: "post-004", uid: "member-1042", authorName: "김예림", text: "종아리 스트레칭이랑 발목 도수 운동이 도움이 됐어요.", createdAt: "2026.07.25 15:02" },
  { id: "comment-009", postId: "post-004", uid: "trainer-kim", authorName: "김도윤 트레이너", text: "발목 가동성이 부족한 경우가 많습니다. 스쿼트 전 종아리 폼롤러를 먼저 해보세요.", createdAt: "2026.07.25 16:20" },
  { id: "comment-010", postId: "post-005", uid: "member-1023", authorName: "윤하늘", text: "10회 축하드려요!", createdAt: "2026.07.24 20:44" },
  { id: "comment-011", postId: "post-010", uid: "member-1024", authorName: "서민재", text: "점심 걷기 챌린지 같이 하실 분 환영합니다.", createdAt: "2026.07.21 13:30", isAuthor: true },
  { id: "comment-012", postId: "post-014", uid: "member-1019", authorName: "신예린", text: "저는 보통 1시간 반 전에 가볍게 먹어요.", createdAt: "2026.07.17 12:05" }
];

