import {
  answerDirections,
  claimsAfterRecheck,
  alternatives,
  alternativesRecommendation,
  assumptions,
  finalAnswerBlocks,
  highlightDefinitions,
  claimsBeforeRecheck,
  clarificationQuestions,
  missingContext,
  improvedPromptTemplate,
  mockSources,
  promptReadinessRisks,
  qualitySignals,
  qualityRiskRows,
  recheckSteps,
  samplePrompt,
} from "../data/trustLensMockData";
import type {
  AlternativeItem,
  AnswerDirection,
  ApiResult,
  AssumptionItem,
  ClarificationSelections,
  ClarificationQuestion,
  ClaimItem,
  FinalAnswerBlock,
  HighlightDefinition,
  MissingContextItem,
  QualitySignal,
  QualityRiskRow,
  RecheckStep,
  RiskChip,
  SourcePassage,
} from "../state/appTypes";

export interface CreateSessionData {
  sessionId: string;
}

export interface PromptReadinessData {
  readinessId?: string;
  risks: RiskChip[];
  qualityRows: QualityRiskRow[];
  clarificationQuestions: ClarificationQuestion[];
}

export interface ImprovedPromptData {
  improvedPrompt: string;
  changes: string[];
}

export interface AnswerDirectionsData {
  directions: AnswerDirection[];
  recommendedDirectionId: "decision_ready";
}

export interface FinalAnswerData {
  answerId: string;
  blocks: FinalAnswerBlock[];
  highlights: HighlightDefinition[];
  trustLens: TrustLensReviewData;
}

export interface RecheckStartData {
  jobId: string;
  steps: RecheckStep[];
}

export interface RecheckStatusData {
  status: "running" | "complete";
  activeStepIndex: number;
  claims: ClaimItem[];
}

export interface SourcePassageData {
  source: SourcePassage;
}

type ApiError = {
  code: string;
  message: string;
  details?: unknown[];
};

type ApiEnvelope<T> =
  | { data: T; meta?: unknown }
  | {
      error: ApiError;
      meta?: unknown;
    };

type ClarificationAnswerInput = {
  questionId: string;
  optionId: string;
  label: string;
};

type PromptReadinessInput = {
  sessionId?: string;
  prompt?: string;
};

type ImprovedPromptInput =
  | ClarificationSelections
  | {
      sessionId?: string;
      readinessId?: string;
      originalPrompt?: string;
      clarifications?: ClarificationAnswerInput[];
    };

type DirectionsInput = {
  sessionId?: string;
  selectedPrompt?: string;
  selectedPromptMode?: "original" | "improved";
  clarifications?: ClarificationAnswerInput[];
};

type FinalAnswerInput = {
  sessionId?: string;
  selectedPrompt?: string;
  selectedPromptMode?: "original" | "improved";
  selectedDirectionId?: "summary" | "analysis" | "decision_ready";
};

type RecheckInput = {
  sessionId?: string;
  answerId?: string;
};

type BackendReadinessData = {
  readinessId?: string;
  riskChips: RiskChip[];
  qualityRows: QualityRiskRow[];
  clarifyingQuestions: ClarificationQuestion[];
};

type BackendImprovedPromptData = {
  improvedPrompt: string;
  changes: { label?: string; description?: string }[];
};

type BackendRecheckStep = {
  id: string;
  title?: string;
  label?: string;
  description: string;
};

type BackendRecheckStartData = {
  jobId: string;
  steps: BackendRecheckStep[];
};

type BackendRecheckStatusData = {
  status: "queued" | "running" | "complete" | "failed";
  activeStepIndex: number;
  claims?: ClaimItem[];
};

type BackendTrustLensReviewData = {
  summary: string;
  qualityRows: {
    id: string;
    label: string;
    status: string;
    note: string;
  }[];
  assumptions: AssumptionItem[];
  missingContext: {
    id: string;
    text: string;
    whyItMatters: string;
  }[];
  claims: ClaimItem[];
  alternatives: {
    id: string;
    title: string;
    description: string;
  }[];
};

type BackendFinalAnswerData = {
  answerId: string;
  selectedDirectionId: string;
  blocks: FinalAnswerBlock[];
  highlights: HighlightDefinition[];
  trustLens: BackendTrustLensReviewData;
};

export interface TrustLensReviewData {
  summary: string;
  qualitySignals: QualitySignal[];
  assumptions: AssumptionItem[];
  missingContext: MissingContextItem[];
  claims: ClaimItem[];
  alternatives: AlternativeItem[];
  alternativesRecommendation: string;
}

const configuredApiBaseUrl = import.meta.env.VITE_API_BASE_URL?.trim() ?? "mock";
const apiBaseUrl = configuredApiBaseUrl.replace(/\/+$/, "");
export const trustLensApiModeEnabled =
  apiBaseUrl.length > 0 && apiBaseUrl.toLowerCase() !== "mock";

const fallbackSessionId = "session_mock_001";
const fallbackReadinessId = "readiness_mock_001";
const fallbackAnswerId = "answer_mock_001";

function toApiError(error: unknown): ApiError {
  if (error instanceof Error) {
    return {
      code: "NETWORK_ERROR",
      message: error.message,
    };
  }

  return {
    code: "NETWORK_ERROR",
    message: "Trust Lens API request failed.",
  };
}

function isErrorEnvelope<T>(
  envelope: ApiEnvelope<T>,
): envelope is Extract<ApiEnvelope<T>, { error: ApiError }> {
  return "error" in envelope;
}

async function apiRequest<BackendData, ClientData>(
  path: string,
  init: RequestInit,
  normalize: (data: BackendData) => ClientData,
): Promise<ApiResult<ClientData>> {
  try {
    const response = await fetch(`${apiBaseUrl}${path}`, {
      ...init,
      headers: {
        "Content-Type": "application/json",
        ...(init.headers ?? {}),
      },
    });
    const envelope = (await response.json()) as ApiEnvelope<BackendData>;

    if (!response.ok || isErrorEnvelope(envelope)) {
      const error = isErrorEnvelope(envelope)
        ? envelope.error
        : {
            code: "HTTP_ERROR",
            message: `Trust Lens API returned HTTP ${response.status}.`,
          };

      return {
        success: false,
        error,
        meta: envelope.meta,
      };
    }

    return {
      success: true,
      data: normalize(envelope.data),
      meta: envelope.meta,
    };
  } catch (error) {
    return {
      success: false,
      error: toApiError(error),
    };
  }
}

function postApi<BackendData, ClientData>(
  path: string,
  body: unknown,
  normalize: (data: BackendData) => ClientData,
) {
  return apiRequest<BackendData, ClientData>(
    path,
    {
      method: "POST",
      body: JSON.stringify(body),
    },
    normalize,
  );
}

function getApi<BackendData, ClientData>(
  path: string,
  normalize: (data: BackendData) => ClientData,
) {
  return apiRequest<BackendData, ClientData>(
    path,
    {
      method: "GET",
    },
    normalize,
  );
}

function normalizeRecheckSteps(steps: BackendRecheckStep[]): RecheckStep[] {
  return steps.map((step) => ({
    id: step.id,
    label: step.label ?? step.title ?? step.id,
    description: step.description,
  }));
}

function clarificationRecordToAnswers(
  selections: ClarificationSelections,
): ClarificationAnswerInput[] {
  return Object.entries(selections).map(([questionId, optionId]) => ({
    questionId,
    optionId,
    label: optionId,
  }));
}

function isDetailedImprovedPromptInput(
  input: ImprovedPromptInput,
): input is Exclude<ImprovedPromptInput, ClarificationSelections> {
  return (
    "sessionId" in input ||
    "readinessId" in input ||
    "originalPrompt" in input ||
    Array.isArray((input as { clarifications?: unknown }).clarifications)
  );
}

function defaultTrustLensReview(): TrustLensReviewData {
  return {
    summary:
      "Review recommended. The answer is useful for planning, but assumptions and product outcome claims still need validation.",
    qualitySignals,
    assumptions,
    missingContext,
    claims: claimsBeforeRecheck,
    alternatives,
    alternativesRecommendation,
  };
}

const qualitySignalAliases: Record<string, string[]> = {
  correctness: ["correctness", "accuracy", "factuality", "truthfulness"],
  completeness: ["completeness", "coverage", "thoroughness"],
  "reasoning-quality": [
    "reasoning_quality",
    "reasoning",
    "logic",
    "logical_quality",
    "coherence",
    "reasonable",
  ],
  uncertainty: [
    "uncertainty",
    "uncertainity",
    "uncertain",
    "ambiguity",
    "verification_need",
  ],
};

function qualityKey(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
}

function normalizeQualityValue(value: string) {
  const lower = value.toLowerCase();
  if (lower.includes("low")) return "Low";
  if (lower.includes("high")) return "High";
  return "Medium";
}

function normalizeQualitySignals(
  rows: BackendTrustLensReviewData["qualityRows"],
): QualitySignal[] {
  const incomingRows = Array.isArray(rows) ? rows : [];

  return qualitySignals.map((template) => {
    const keys = new Set([
      qualityKey(template.id),
      qualityKey(template.label),
      ...(qualitySignalAliases[template.id] ?? []),
    ]);
    const match = incomingRows.find((row) => {
      return keys.has(qualityKey(row.id)) || keys.has(qualityKey(row.label));
    });

    return match
      ? {
          ...template,
          value: normalizeQualityValue(match.status),
          description: match.note || template.description,
        }
      : template;
  });
}

function normalizeTrustLensReview(
  review: BackendTrustLensReviewData,
): TrustLensReviewData {
  return {
    summary: review.summary,
    qualitySignals: normalizeQualitySignals(review.qualityRows),
    assumptions: review.assumptions,
    missingContext: review.missingContext.map((item) => ({
      id: item.id,
      context: item.text,
      whyItMatters: item.whyItMatters,
    })),
    claims: review.claims,
    alternatives: review.alternatives.map((item) => ({
      id: item.id,
      perspective: item.title,
      description: item.description,
    })),
    alternativesRecommendation,
  };
}

export async function createTrustLensSession(): Promise<ApiResult<CreateSessionData>> {
  if (trustLensApiModeEnabled) {
    return postApi<CreateSessionData & { createdAt: string }, CreateSessionData>(
      "/trust-lens/sessions",
      {
        clientMode: "prototype",
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        locale: navigator.language,
      },
      (data) => ({
        sessionId: data.sessionId,
      }),
    );
  }

  return {
    success: true,
    data: {
      sessionId: `local-session-${Date.now()}`,
    },
    meta: { apiVersion: "v1", mode: "mock" },
  };
}

export async function runPromptReadiness(
  input: PromptReadinessInput = {},
): Promise<ApiResult<PromptReadinessData>> {
  if (trustLensApiModeEnabled) {
    return postApi<BackendReadinessData, PromptReadinessData>(
      "/trust-lens/readiness",
      {
        sessionId: input.sessionId ?? fallbackSessionId,
        prompt: input.prompt ?? samplePrompt,
        context: {
          source: "sample_prompt",
          clientTimestamp: new Date().toISOString(),
        },
      },
      (data) => ({
        readinessId: data.readinessId,
        risks: data.riskChips,
        qualityRows: data.qualityRows,
        clarificationQuestions: data.clarifyingQuestions,
      }),
    );
  }

  return {
    success: true,
    data: {
      risks: promptReadinessRisks,
      qualityRows: qualityRiskRows,
      clarificationQuestions,
    },
    meta: { apiVersion: "v1", mode: "mock" },
  };
}

export async function generateImprovedPrompt(
  input: ImprovedPromptInput,
): Promise<ApiResult<ImprovedPromptData>> {
  if (trustLensApiModeEnabled) {
    const isDetailedInput = isDetailedImprovedPromptInput(input);
    const clarifications = isDetailedInput
      ? (input.clarifications ?? [])
      : clarificationRecordToAnswers(input);

    return postApi<BackendImprovedPromptData, ImprovedPromptData>(
      "/trust-lens/improved-prompt",
      {
        sessionId: isDetailedInput
          ? (input.sessionId ?? fallbackSessionId)
          : fallbackSessionId,
        readinessId: isDetailedInput
          ? (input.readinessId ?? fallbackReadinessId)
          : fallbackReadinessId,
        originalPrompt: isDetailedInput
          ? (input.originalPrompt ?? samplePrompt)
          : samplePrompt,
        clarifications,
      },
      (data) => ({
        improvedPrompt: data.improvedPrompt,
        changes: data.changes.map(
          (change) => change.description ?? change.label ?? "Prompt improved.",
        ),
      }),
    );
  }

  return {
    success: true,
    data: {
      improvedPrompt: improvedPromptTemplate,
      changes: [
        "Clarifies audience and intended use.",
        "Requests evidence boundaries and assumptions.",
        "Asks for product flow, user controls, and risks.",
      ],
    },
    meta: { apiVersion: "v1", mode: "mock" },
  };
}

export async function getAnswerDirections(
  input: DirectionsInput = {},
): Promise<ApiResult<AnswerDirectionsData>> {
  if (trustLensApiModeEnabled) {
    return postApi<AnswerDirectionsData, AnswerDirectionsData>(
      "/trust-lens/directions",
      {
        sessionId: input.sessionId ?? fallbackSessionId,
        selectedPrompt: input.selectedPrompt ?? improvedPromptTemplate,
        selectedPromptMode: input.selectedPromptMode ?? "improved",
        clarifications: input.clarifications ?? [],
      },
      (data) => data,
    );
  }

  return {
    success: true,
    data: {
      directions: answerDirections,
      recommendedDirectionId: "decision_ready",
    },
    meta: { apiVersion: "v1", mode: "mock" },
  };
}

export async function generateFinalAnswer(
  input: FinalAnswerInput = {},
): Promise<ApiResult<FinalAnswerData>> {
  if (trustLensApiModeEnabled) {
    return postApi<BackendFinalAnswerData, FinalAnswerData>(
      "/trust-lens/final-answer",
      {
        sessionId: input.sessionId ?? fallbackSessionId,
        selectedPrompt: input.selectedPrompt ?? improvedPromptTemplate,
        selectedPromptMode: input.selectedPromptMode ?? "improved",
        selectedDirectionId: input.selectedDirectionId ?? "decision_ready",
      },
      (data) => ({
        answerId: data.answerId,
        blocks: data.blocks,
        highlights: data.highlights,
        trustLens: normalizeTrustLensReview(data.trustLens),
      }),
    );
  }

  return {
    success: true,
    data: {
      answerId: `local-answer-${Date.now()}`,
      blocks: finalAnswerBlocks,
      highlights: highlightDefinitions,
      trustLens: defaultTrustLensReview(),
    },
    meta: { apiVersion: "v1", mode: "mock" },
  };
}

export async function startRecheck(
  input: RecheckInput = {},
): Promise<ApiResult<RecheckStartData>> {
  if (trustLensApiModeEnabled) {
    return postApi<BackendRecheckStartData, RecheckStartData>(
      "/trust-lens/recheck",
      {
        sessionId: input.sessionId ?? fallbackSessionId,
        answerId: input.answerId ?? fallbackAnswerId,
        mode: "claim_level",
        includeSourcePassages: true,
      },
      (data) => ({
        jobId: data.jobId,
        steps: normalizeRecheckSteps(data.steps),
      }),
    );
  }

  return {
    success: true,
    data: {
      jobId: `local-recheck-${Date.now()}`,
      steps: recheckSteps,
    },
    meta: { apiVersion: "v1", mode: "mock" },
  };
}

export async function getRecheckStatus(
  activeStepIndexOrJobId: number | string,
): Promise<ApiResult<RecheckStatusData>> {
  if (trustLensApiModeEnabled) {
    const jobId =
      typeof activeStepIndexOrJobId === "string"
        ? activeStepIndexOrJobId
        : "job_mock_recheck_001";

    return getApi<BackendRecheckStatusData, RecheckStatusData>(
      `/trust-lens/recheck/${encodeURIComponent(jobId)}`,
      (data) => ({
        status: data.status === "complete" ? "complete" : "running",
        activeStepIndex: data.activeStepIndex,
        claims: data.claims ?? claimsAfterRecheck,
      }),
    );
  }

  const activeStepIndex =
    typeof activeStepIndexOrJobId === "number" ? activeStepIndexOrJobId : 0;
  const isComplete = activeStepIndex >= recheckSteps.length - 1;

  return {
    success: true,
    data: {
      status: isComplete ? "complete" : "running",
      activeStepIndex,
      claims: claimsAfterRecheck,
    },
    meta: { apiVersion: "v1", mode: "mock" },
  };
}

export async function getSourcePassage(
  sourceId: string,
): Promise<ApiResult<SourcePassageData>> {
  if (trustLensApiModeEnabled) {
    return getApi<SourcePassage, SourcePassageData>(
      `/trust-lens/sources/${encodeURIComponent(sourceId)}`,
      (source) => ({ source }),
    );
  }

  const source = mockSources.find((item) => item.id === sourceId);

  if (!source) {
    return {
      success: false,
      error: {
        code: "SOURCE_NOT_FOUND",
        message: "Source passage unavailable in prototype.",
      },
      meta: { apiVersion: "v1", mode: "mock" },
    };
  }

  return {
    success: true,
    data: { source },
    meta: { apiVersion: "v1", mode: "mock" },
  };
}
