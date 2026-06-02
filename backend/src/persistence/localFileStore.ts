import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import {
  createEmptySnapshot,
  type TrustLensStore,
  type TrustLensStoreSnapshot
} from "./types.js";

const cloneSnapshot = (snapshot: TrustLensStoreSnapshot): TrustLensStoreSnapshot =>
  structuredClone(snapshot);

export class LocalFileTrustLensStore implements TrustLensStore {
  readonly mode = "file" as const;
  private readonly filePath: string;

  constructor(dataDir: string) {
    this.filePath = resolve(dataDir, "trust-lens-store.json");
  }

  async init() {
    await mkdir(dirname(this.filePath), { recursive: true });

    try {
      await readFile(this.filePath, "utf8");
    } catch {
      await this.write(createEmptySnapshot());
    }
  }

  async read() {
    await this.init();
    const raw = await readFile(this.filePath, "utf8");
    const parsed = JSON.parse(raw) as TrustLensStoreSnapshot;
    const snapshot: TrustLensStoreSnapshot = {
      ...createEmptySnapshot(),
      ...parsed,
      version: 1
    };
    return snapshot;
  }

  async write(snapshot: TrustLensStoreSnapshot) {
    await mkdir(dirname(this.filePath), { recursive: true });
    await writeFile(this.filePath, `${JSON.stringify(snapshot, null, 2)}\n`, "utf8");
  }

  async update<T>(mutator: (snapshot: TrustLensStoreSnapshot) => T) {
    const snapshot = cloneSnapshot(await this.read());
    const result = mutator(snapshot);
    await this.write(snapshot);
    return result;
  }
}
