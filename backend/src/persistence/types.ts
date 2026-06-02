export type JsonPrimitive = string | number | boolean | null;
export type JsonValue = JsonPrimitive | JsonValue[] | { [key: string]: JsonValue };
export type JsonObject = { [key: string]: JsonValue };

export type StoredSession = {
  sessionId: string;
  createdAt: string;
  clientMode: "prototype" | "production";
  timezone?: string;
  locale?: string;
};

export type StoredPromptInput = {
  promptId: string;
  sessionId: string;
  prompt: string;
  context?: JsonObject;
  createdAt: string;
};

export type StoredArtifact<T extends JsonObject = JsonObject> = {
  id: string;
  sessionId: string;
  createdAt: string;
  payload: T;
};

export type StoredAnswer<T extends JsonObject = JsonObject> = StoredArtifact<T> & {
  answerId: string;
  selectedDirectionId: string;
};

export type StoredSourcePassage = {
  id: string;
  title: string;
  urlLabel: string;
  passage: string;
  highlightedSentence: string;
  createdAt: string;
};

export type StoredRecheckJob<T extends JsonObject = JsonObject> = {
  jobId: string;
  sessionId: string;
  answerId: string;
  mode: "claim_level";
  status: "queued" | "running" | "complete" | "failed";
  activeStepIndex: number;
  steps: JsonObject[];
  summary?: JsonObject;
  claims?: JsonObject[];
  highlights?: JsonObject[];
  failureReason?: string;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
  payload?: T;
};

export type TrustLensStoreSnapshot = {
  version: 1;
  sessions: Record<string, StoredSession>;
  prompts: Record<string, StoredPromptInput>;
  readinessResults: Record<string, StoredArtifact>;
  improvedPrompts: Record<string, StoredArtifact>;
  answerDirectionSets: Record<string, StoredArtifact>;
  generatedAnswers: Record<string, StoredAnswer>;
  sourcePassages: Record<string, StoredSourcePassage>;
  recheckJobs: Record<string, StoredRecheckJob>;
};

export interface TrustLensStore {
  readonly mode: "file" | "memory";
  init(): Promise<void>;
  read(): Promise<TrustLensStoreSnapshot>;
  write(snapshot: TrustLensStoreSnapshot): Promise<void>;
  update<T>(mutator: (snapshot: TrustLensStoreSnapshot) => T): Promise<T>;
}

export const createEmptySnapshot = (): TrustLensStoreSnapshot => ({
  version: 1,
  sessions: {},
  prompts: {},
  readinessResults: {},
  improvedPrompts: {},
  answerDirectionSets: {},
  generatedAnswers: {},
  sourcePassages: {},
  recheckJobs: {}
});
