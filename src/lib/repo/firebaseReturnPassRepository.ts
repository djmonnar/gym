import type { DocumentData, QueryDocumentSnapshot } from "firebase/firestore";
import { getFirestoreDatabase } from "../firebase";
import type { Facility, FacilityCategory, Product } from "../../types";
import type { ReturnPassRepository } from "./contracts";

const toFacility = (snapshot: QueryDocumentSnapshot<DocumentData>): Facility => ({
  ...(snapshot.data() as Omit<Facility, "id">),
  id: snapshot.id
});

const toProduct = (snapshot: QueryDocumentSnapshot<DocumentData>): Product => ({
  ...(snapshot.data() as Omit<Product, "id">),
  id: snapshot.id
});

export class FirebaseReturnPassRepository implements ReturnPassRepository {
  constructor(private readonly fallback: ReturnPassRepository) {}

  getSnapshot() {
    return this.fallback.getSnapshot();
  }

  async listFacilities(category?: FacilityCategory) {
    try {
      const database = await getFirestoreDatabase();
      if (!database) return this.fallback.listFacilities(category);

      const { collection, getDocs, query, where } = await import("firebase/firestore");
      const facilitiesQuery = query(collection(database, "facilities"), where("status", "==", "active"));
      const result = await getDocs(facilitiesQuery);
      const facilities = result.docs.map(toFacility);

      if (!facilities.length) return this.fallback.listFacilities(category);
      return category ? facilities.filter((facility) => facility.category === category) : facilities;
    } catch (error) {
      console.warn("Firestore 시설 조회에 실패해 더미 데이터를 사용합니다.", error);
      return this.fallback.listFacilities(category);
    }
  }

  async listTrainers(facilityId?: string) {
    return this.fallback.listTrainers(facilityId);
  }

  async listContents() {
    return this.fallback.listContents();
  }

  async listProducts() {
    try {
      const database = await getFirestoreDatabase();
      if (!database) return this.fallback.listProducts();

      const { collection, getDocs, query, where } = await import("firebase/firestore");
      // 보안 규칙이 status == 'active' 문서만 읽기를 허용하므로 쿼리도 동일하게 제한합니다.
      const productsQuery = query(collection(database, "products"), where("status", "==", "active"));
      const result = await getDocs(productsQuery);
      const products = result.docs.map(toProduct);

      if (!products.length) return this.fallback.listProducts();
      return products;
    } catch (error) {
      console.warn("Firestore 상품 조회에 실패해 더미 데이터를 사용합니다.", error);
      return this.fallback.listProducts();
    }
  }

  async listCommunityPosts(facilityId?: string) {
    return this.fallback.listCommunityPosts(facilityId);
  }

  async listChallenges() {
    return this.fallback.listChallenges();
  }

  async listComments(postId: string) {
    return this.fallback.listComments(postId);
  }
}
