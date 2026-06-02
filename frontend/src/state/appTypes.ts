export type WorkflowStep =
  | "initial"
  | "prompt_submitted"
  | "prompt_readiness_loading"
  | "prompt_readiness_ready"
  | "improved_prompt_ready"
  | "answer_directions_loading"
  | "answer_directions_ready"
  | "final_answer_loading"
  | "final_answer_ready";

export type TrustLensTab =
  | "quality"
  | "assumptions"
  | "missing_context"
  | "claims"
  | "alternatives";

export type AnswerDirectionId = "summary" | "analysis" | "decision_ready";

export type HighlightKind = "source" | "verify" | "assumption" | "product_logic";

export type RecheckStatus = "idle" | "running" | "complete";

export type RiskLevel = "Low" | "Medium" | "Medium to High" | "High";

export type ClarificationSelections = Record<string, string>;

export interface ChatMessage {
  id: string;
  role: "user";
  content: string;
}

export interface RiskChip {
  id: string;
  label: string;
}

export interface QualityRiskRow {
  id: string;
  label: string;
  level: RiskLevel;
}

export interface ClarificationQuestion {
  id: string;
  question: string;
  defaultOptionId: string;
  options: {
    id: string;
    label: string;
  }[];
}

export interface AnswerDirection {
  id: AnswerDirectionId;
  title: string;
  badge: string;
  headline: string;
  description: string;
  cta: string;
  recommended?: boolean;
}

export interface QualitySignal {
  id: string;
  label: string;
  value: string;
  description?: string;
}

export interface AssumptionItem {
  id: string;
  text: string;
  impact: string;
}

export interface MissingContextItem {
  id: string;
  context: string;
  whyItMatters: string;
}

export interface AlternativeItem {
  id: string;
  perspective: string;
  description: string;
}

export interface RecheckStep {
  id: string;
  label: string;
  description: string;
}

export interface ToastMessage {
  id: string;
  message: string;
  duration?: number;
}

export interface SourcePassage {
  id: string;
  title: string;
  urlLabel: string;
  passage: string;
  highlightedSentence: string;
}

export interface HighlightDefinition {
  id: string;
  kind: HighlightKind;
  label: "Source" | "Verify" | "Assumption" | "Product logic";
  text: string;
  tooltipTitle: string;
  tooltipBody: string;
  sourceId?: string;
}

export interface ClaimItem {
  id: string;
  claim: string;
  type: string;
  evidenceStatus:
    | "Supported"
    | "Needs verification"
    | "Conflicting evidence"
    | "No clear evidence found"
    | "Assumption/inference"
    | "Plausible, needs testing"
    | "Uncertain";
  whyVerify: string;
  suggestedAction: string;
}

export type FinalAnswerSegment =
  | {
      type: "text";
      text: string;
    }
  | {
      type: "highlight";
      highlightId: string;
      text: string;
    };

export type FinalAnswerBlock =
  | {
      type: "heading";
      text: string;
    }
  | {
      type: "paragraph";
      segments: FinalAnswerSegment[];
    }
  | {
      type: "section";
      title: string;
      segments: FinalAnswerSegment[];
    }
  | {
      type: "list";
      items: FinalAnswerSegment[][];
    };

export interface EmptyStateCopy {
  title: string;
  subtitle: string;
  capabilities: {
    id?: string;
    title: string;
    description: string;
  }[];
  samplePromptButton: string;
}

export interface ModalState {
  sourcePassageOpen: boolean;
  activeSourceId: string | null;
}

export interface AppState {
  workflowStep: WorkflowStep;
  sessionId: string | null;
  readinessId: string | null;
  answerId: string | null;
  recheckJobId: string | null;
  composerValue: string;
  originalPrompt: string;
  editableOriginalPrompt: string;
  originalPromptEditorOpen: boolean;
  originalPromptDraft: string;
  improvedPrompt: string;
  selectedClarifications: ClarificationSelections;
  selectedPromptMode: "original" | "improved";
  selectedDirection: AnswerDirectionId | null;
  messages: ChatMessage[];
  sidebarOpen: boolean;
  trustLensOpen: boolean;
  activeTrustLensTab: TrustLensTab;
  activeTooltipId: string | null;
  modalState: ModalState;
  recheckStatus: RecheckStatus;
  recheckProgressStep: number;
  recheckComplete: boolean;
  toast: ToastMessage | null;
  toastSequence: number;
  contextInputOpen: boolean;
  addedContextDraft: string;
  extraAssistantMessages: string[];
  promptReadinessRisks: RiskChip[];
  qualityRiskRows: QualityRiskRow[];
  clarificationQuestions: ClarificationQuestion[];
  answerDirections: AnswerDirection[];
  finalAnswerBlocks: FinalAnswerBlock[];
  highlightDefinitions: HighlightDefinition[];
  qualitySignals: QualitySignal[];
  assumptions: AssumptionItem[];
  missingContext: MissingContextItem[];
  claimsBeforeRecheck: ClaimItem[];
  claimsAfterRecheck: ClaimItem[];
  alternatives: AlternativeItem[];
  alternativesRecommendation: string;
  recheckSteps: RecheckStep[];
  sourcePassages: SourcePassage[];
}

export type ApiResult<T> =
  | { success: true; data: T; meta?: unknown }
  | {
      success: false;
      error: { code: string; message: string; details?: unknown[] };
      meta?: unknown;
    };
