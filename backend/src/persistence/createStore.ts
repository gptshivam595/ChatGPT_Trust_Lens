import type { AppConfig } from "../config.js";
import { LocalFileTrustLensStore } from "./localFileStore.js";
import { MemoryTrustLensStore } from "./memoryStore.js";
import type { TrustLensStore } from "./types.js";

export const createTrustLensStore = (config: AppConfig): TrustLensStore => {
  if (config.storageDriver === "memory") {
    return new MemoryTrustLensStore();
  }

  return new LocalFileTrustLensStore(config.dataDir);
};
