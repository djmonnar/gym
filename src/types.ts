export type CustomerScreen =
  | "splash"
  | "onboarding"
  | "login"
  | "location"
  | "home"
  | "search"
  | "detail"
  | "plans"
  | "checkout"
  | "complete"
  | "pass"
  | "subscription"
  | "history"
  | "support"
  | "my"
  | "shop"
  | "shopDetail"
  | "cart"
  | "shopComplete";

export type AdminScreen = "adminHome" | "adminMembers" | "adminQr";

export type ScreenId = CustomerScreen | AdminScreen;

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

export type Plan = {
  id: string;
  name: string;
  price: number;
  description: string;
  benefits: string[];
  recommended?: boolean;
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

export type MemberStatus = "이용중" | "만료예정" | "해지예약" | "만료";

export type AdminMember = {
  id: string;
  name: string;
  phone: string;
  plan: string;
  expiresAt: string;
  status: MemberStatus;
};
