import {
  createEmptySnapshot,
  type TrustLensStore,
  type TrustLensStoreSnapshot
} from "./types.js";

const cloneSnapshot = (snapshot: TrustLensStoreSnapshot): TrustLensStoreSnapshot =>
  structuredClone(snapshot);

export class MemoryTrustLensStore implements TrustLensStore {
  readonly mode = "memory" as const;
  private snapshot: TrustLensStoreSnapshot;

  constructor(initialSnapshot: TrustLensStoreSnapshot = createEmptySnapshot()) {
    this.snapshot = cloneSnapshot(initialSnapshot);
  }

  async init() {
    return;
  }

  async read() {
    return cloneSnapshot(this.snapshot);
  }

  async write(snapshot: TrustLensStoreSnapshot) {
    this.snapshot = cloneSnapshot(snapshot);
  }

  async update<T>(mutator: (snapshot: TrustLensStoreSnapshot) => T) {
    const next = cloneSnapshot(this.snapshot);
    const result = mutator(next);
    this.snapshot = next;
    return result;
  }
}
