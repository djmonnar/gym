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
  FacilityCategory,
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
} from "../../types";

export type FacilityCategoryOption = {
  id: FacilityCategory;
  label: string;
};

export type ReturnPassSnapshot = {
  facilities: Facility[];
  gyms: Facility[];
  filters: string[];
  facilityCategories: readonly FacilityCategoryOption[];
  plans: Plan[];
  activePass: PassInfo;
  paymentRecords: PaymentRecord[];
  adminMembers: AdminMember[];
  qrVerificationResults: QrVerificationResult[];
  entryLogs: AdminEntryLog[];
  ptTrainers: Trainer[];
  ptSubscriptionPlans: PtSubscriptionPlan[];
  weeklyRoutine: RoutinePlan;
  dietRecommendation: DietRecommendation;
  shopProducts: Product[];
  contents: Content[];
  aiDietPlan: AiDietPlan;
  aiRoutine: AiRoutine;
  aiVisualAssets: AiVisualAssets;
  communityPosts: Post[];
  challenges: Challenge[];
  postComments: Comment[];
  vendors: Vendor[];
  sellerShippingPolicies: SellerShipping[];
};

export interface ReturnPassRepository {
  getSnapshot(): Readonly<ReturnPassSnapshot>;
  listFacilities(category?: FacilityCategory): Promise<Facility[]>;
  listTrainers(facilityId?: string): Promise<Trainer[]>;
  listContents(): Promise<Content[]>;
  listProducts(): Promise<Product[]>;
  listCommunityPosts(facilityId?: string): Promise<Post[]>;
  listChallenges(): Promise<Challenge[]>;
  listComments(postId: string): Promise<Comment[]>;
}
