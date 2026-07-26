import {
  activePass,
  adminMembers,
  aiDietPlan,
  aiRoutine,
  challenges,
  communityPosts,
  contents,
  dietRecommendation,
  entryLogs,
  facilities,
  facilityCategories,
  filters,
  gyms,
  paymentRecords,
  plans,
  ptSubscriptionPlans,
  ptTrainers,
  qrVerificationResults,
  shopProducts,
  weeklyRoutine
} from "../../data/returnpass";
import type { FacilityCategory } from "../../types";
import type { ReturnPassRepository, ReturnPassSnapshot } from "./contracts";

const snapshot: ReturnPassSnapshot = {
  facilities,
  gyms,
  filters,
  facilityCategories,
  plans,
  activePass,
  paymentRecords,
  adminMembers,
  qrVerificationResults,
  entryLogs,
  ptTrainers,
  ptSubscriptionPlans,
  weeklyRoutine,
  dietRecommendation,
  shopProducts,
  contents,
  aiDietPlan,
  aiRoutine,
  communityPosts,
  challenges
};

export class MockReturnPassRepository implements ReturnPassRepository {
  getSnapshot() {
    return snapshot;
  }

  async listFacilities(category?: FacilityCategory) {
    return category ? facilities.filter((facility) => facility.category === category) : facilities;
  }

  async listTrainers(facilityId?: string) {
    return facilityId ? ptTrainers.filter((trainer) => trainer.facilityIds.includes(facilityId)) : ptTrainers;
  }

  async listContents() {
    return contents;
  }

  async listProducts() {
    return shopProducts;
  }

  async listCommunityPosts(facilityId?: string) {
    return facilityId ? communityPosts.filter((post) => post.facilityId === facilityId) : communityPosts;
  }

  async listChallenges() {
    return challenges;
  }
}
