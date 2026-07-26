import { MockReturnPassRepository } from "./mockReturnPassRepository";

export type { ReturnPassRepository, ReturnPassSnapshot } from "./contracts";

export const returnPassRepository = new MockReturnPassRepository();
export const prototypeData = returnPassRepository.getSnapshot();
