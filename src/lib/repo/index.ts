import { isFirebaseConfigured } from "../firebase";
import { FirebaseReturnPassRepository } from "./firebaseReturnPassRepository";
import { MockReturnPassRepository } from "./mockReturnPassRepository";

export type { ReturnPassRepository, ReturnPassSnapshot } from "./contracts";

const mockReturnPassRepository = new MockReturnPassRepository();

export const returnPassRepository = isFirebaseConfigured
  ? new FirebaseReturnPassRepository(mockReturnPassRepository)
  : mockReturnPassRepository;
export const prototypeData = returnPassRepository.getSnapshot();
