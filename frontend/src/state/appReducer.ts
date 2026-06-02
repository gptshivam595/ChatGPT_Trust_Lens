import {
  alternatives,
  alternativesRecommendation,
  answerDirections,
  assumptions,
  claimsAfterRecheck,
  claimsBeforeRecheck,
  clarificationQuestions,
  finalAnswerBlocks,
  highlightDefinitions,
  improvedPromptTemplate,
  missingContext,
  mockSources,
  promptReadinessRisks,
  qualityRiskRows,
  qualitySignals,
  recheckSteps,
  samplePrompt,
} from "../data/trustLensMockData";
import { alternativeViewMessage, toastMessages } from "../data/trustLensCopy";
import type {
  AnswerDirectionId,
  AnswerDirection,
  AppState,
  AssumptionItem,
  ClaimItem,
  ClarificationQuestion,
  FinalAnswerBlock,
  HighlightDefinition,
  MissingContextItem,
  QualityRiskRow,
  QualitySignal,
  RecheckStep,
  RiskChip,
  SourcePassage,
  ToastMessage,
  TrustLensTab,
  AlternativeItem,
} from "./appTypes";

export type AppAction =
  | { type: "SET_COMPOSER"; value: string }
  | { type: "USE_SAMPLE_PROMPT" }
  | { type: "SUBMIT_PROMPT" }
  | { type: "START_READINESS_LOADING" }
  | {
      type: "COMPLETE_READINESS";
      sessionId?: string;
      readinessId?: string;
      risks?: RiskChip[];
      qualityRows?: QualityRiskRow[];
      clarificationQuestions?: ClarificationQuestion[];
    }
  | { type: "SELECT_CLARIFICATION"; questionId: string; optionId: string }
  | { type: "OPEN_ORIGINAL_PROMPT_EDITOR" }
  | { type: "SET_ORIGINAL_PROMPT_DRAFT"; value: string }
  | { type: "SAVE_ORIGINAL_PROMPT_EDIT" }
  | { type: "CANCEL_ORIGINAL_PROMPT_EDIT" }
  | { type: "GENERATE_IMPROVED_PROMPT"; improvedPrompt?: string }
  | { type: "SET_IMPROVED_PROMPT"; value: string }
  | { type: "RESET_IMPROVED_PROMPT" }
  | { type: "USE_IMPROVED_PROMPT" }
  | { type: "CONTINUE_WITH_ORIGINAL_PROMPT" }
  | {
      type: "COMPLETE_ANSWER_DIRECTIONS";
      directions?: AnswerDirection[];
      recommendedDirectionId?: AnswerDirectionId;
    }
  | { type: "SELECT_ANSWER_DIRECTION"; directionId: AnswerDirectionId }
  | {
      type: "COMPLETE_FINAL_ANSWER";
      answerId?: string;
      blocks?: FinalAnswerBlock[];
      highlights?: HighlightDefinition[];
      qualitySignals?: QualitySignal[];
      assumptions?: AssumptionItem[];
      missingContext?: MissingContextItem[];
      claims?: ClaimItem[];
      alternatives?: AlternativeItem[];
      alternativesRecommendation?: string;
    }
  | { type: "SET_ACTIVE_TOOLTIP"; highlightId: string }
  | { type: "CLEAR_ACTIVE_TOOLTIP" }
  | { type: "START_RECHECK"; jobId?: string; steps?: RecheckStep[] }
  | { type: "ADVANCE_RECHECK_STEP" }
  | { type: "COMPLETE_RECHECK"; claims?: ClaimItem[] }
  | { type: "COPY_DRAFT" }
  | { type: "ASK_ALTERNATIVE_VIEW" }
  | { type: "OPEN_SOURCE_MODAL"; sourceId: string | null }
  | { type: "CACHE_SOURCE_PASSAGE"; source: SourcePassage }
  | { type: "CLOSE_SOURCE_MODAL" }
  | { type: "SHOW_IN_TRUST_LENS"; tab: TrustLensTab }
  | { type: "OPEN_TRUST_LENS" }
  | { type: "CLOSE_TRUST_LENS" }
  | { type: "SET_TRUST_LENS_TAB"; tab: TrustLensTab }
  | { type: "USE_AS_DRAFT" }
  | { type: "OPEN_CONTEXT_INPUT" }
  | { type: "OPEN_CLAIMS_FROM_SUMMARY" }
  | { type: "OPEN_MISSING_CONTEXT_FROM_SUMMARY" }
  | { type: "SET_CONTEXT_DRAFT"; value: string }
  | { type: "SAVE_CONTEXT" }
  | { type: "VERIFY_FIRST" }
  | { type: "MOCK_REGENERATE" }
  | { type: "RESET_CHAT" }
  | { type: "OPEN_SIDEBAR" }
  | { type: "CLOSE_SIDEBAR" }
  | { type: "SHOW_TOAST"; message: string }
  | { type: "DISMISS_TOAST"; id: string };

export function createInitialClarificationSelections(
  questions: ClarificationQuestion[],
) {
  return questions.reduce<Record<string, string>>((selections, question) => {
    selections[question.id] = question.defaultOptionId;
    return selections;
  }, {});
}

export function createInitialAppState(
  clarificationQuestions: ClarificationQuestion[],
): AppState {
  return {
    workflowStep: "initial",
    sessionId: null,
    readinessId: null,
    answerId: null,
    recheckJobId: null,
    composerValue: "",
    originalPrompt: "",
    editableOriginalPrompt: "",
    originalPromptEditorOpen: false,
    originalPromptDraft: "",
    improvedPrompt: improvedPromptTemplate,
    selectedClarifications:
      createInitialClarificationSelections(clarificationQuestions),
    selectedPromptMode: "original",
    selectedDirection: null,
    messages: [],
    sidebarOpen: false,
    trustLensOpen: false,
    activeTrustLensTab: "quality",
    activeTooltipId: null,
    modalState: {
      sourcePassageOpen: false,
      activeSourceId: null,
    },
    recheckStatus: "idle",
    recheckProgressStep: 0,
    recheckComplete: false,
    toast: null,
    toastSequence: 0,
    contextInputOpen: false,
    addedContextDraft: "",
    extraAssistantMessages: [],
    promptReadinessRisks,
    qualityRiskRows,
    clarificationQuestions,
    answerDirections,
    finalAnswerBlocks,
    highlightDefinitions,
    qualitySignals,
    assumptions,
    missingContext,
    claimsBeforeRecheck,
    claimsAfterRecheck,
    alternatives,
    alternativesRecommendation,
    recheckSteps,
    sourcePassages: mockSources,
  };
}

function nextToast(
  state: AppState,
  message: string,
): Pick<AppState, "toast" | "toastSequence"> {
  const sequence = state.toastSequence + 1;
  const toast: ToastMessage = {
    id: `toast-${sequence}`,
    message,
  };

  return {
    toast,
    toastSequence: sequence,
  };
}

function resetReviewState(): Pick<
  AppState,
  | "sessionId"
  | "readinessId"
  | "answerId"
  | "recheckJobId"
  | "selectedPromptMode"
  | "selectedDirection"
  | "trustLensOpen"
  | "activeTrustLensTab"
  | "activeTooltipId"
  | "modalState"
  | "recheckStatus"
  | "recheckProgressStep"
  | "recheckComplete"
  | "contextInputOpen"
  | "addedContextDraft"
  | "extraAssistantMessages"
> {
  return {
    sessionId: null,
    readinessId: null,
    answerId: null,
    recheckJobId: null,
    selectedPromptMode: "original",
    selectedDirection: null,
    trustLensOpen: false,
    activeTrustLensTab: "quality",
    activeTooltipId: null,
    modalState: {
      sourcePassageOpen: false,
      activeSourceId: null,
    },
    recheckStatus: "idle",
    recheckProgressStep: 0,
    recheckComplete: false,
    contextInputOpen: false,
    addedContextDraft: "",
    extraAssistantMessages: [],
  };
}

export function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case "SET_COMPOSER":
      if (state.workflowStep !== "initial") {
        return state;
      }

      return {
        ...state,
        composerValue: action.value,
      };

    case "USE_SAMPLE_PROMPT":
      if (state.workflowStep !== "initial") {
        return state;
      }

      return {
        ...state,
        composerValue: samplePrompt,
        ...nextToast(state, toastMessages.samplePromptAdded),
      };

    case "SUBMIT_PROMPT": {
      if (state.workflowStep !== "initial") {
        return state;
      }

      const prompt = state.composerValue.trim();

      if (!prompt) {
        return state;
      }

      return {
        ...state,
        workflowStep: "prompt_submitted",
        composerValue: "",
        originalPrompt: prompt,
        editableOriginalPrompt: prompt,
        originalPromptDraft: prompt,
        originalPromptEditorOpen: false,
        improvedPrompt: improvedPromptTemplate,
        messages: [
          {
            id: `message-${Date.now()}`,
            role: "user",
            content: prompt,
          },
        ],
        sidebarOpen: false,
        ...resetReviewState(),
      };
    }

    case "START_READINESS_LOADING":
      if (state.workflowStep !== "prompt_submitted") {
        return state;
      }

      return {
        ...state,
        workflowStep: "prompt_readiness_loading",
      };

    case "COMPLETE_READINESS": {
      if (state.workflowStep !== "prompt_readiness_loading") {
        return state;
      }

      const nextClarificationQuestions =
        action.clarificationQuestions ?? state.clarificationQuestions;

      return {
        ...state,
        workflowStep: "prompt_readiness_ready",
        sessionId: action.sessionId ?? state.sessionId,
        readinessId: action.readinessId ?? state.readinessId,
        promptReadinessRisks: action.risks ?? state.promptReadinessRisks,
        qualityRiskRows: action.qualityRows ?? state.qualityRiskRows,
        clarificationQuestions: nextClarificationQuestions,
        selectedClarifications: createInitialClarificationSelections(
          nextClarificationQuestions,
        ),
        ...nextToast(state, toastMessages.readinessReady),
      };
    }

    case "SELECT_CLARIFICATION":
      if (
        state.workflowStep !== "prompt_readiness_ready" &&
        state.workflowStep !== "improved_prompt_ready"
      ) {
        return state;
      }

      return {
        ...state,
        selectedClarifications: {
          ...state.selectedClarifications,
          [action.questionId]: action.optionId,
        },
      };

    case "OPEN_ORIGINAL_PROMPT_EDITOR":
      if (state.workflowStep !== "prompt_readiness_ready") {
        return state;
      }

      return {
        ...state,
        originalPromptEditorOpen: true,
        originalPromptDraft: state.editableOriginalPrompt,
      };

    case "SET_ORIGINAL_PROMPT_DRAFT":
      if (!state.originalPromptEditorOpen) {
        return state;
      }

      return {
        ...state,
        originalPromptDraft: action.value,
      };

    case "SAVE_ORIGINAL_PROMPT_EDIT": {
      if (!state.originalPromptEditorOpen) {
        return state;
      }

      const nextPrompt = state.originalPromptDraft.trim();

      if (!nextPrompt) {
        return state;
      }

      return {
        ...state,
        editableOriginalPrompt: nextPrompt,
        originalPromptDraft: nextPrompt,
        messages: state.messages.map((message, index) =>
          index === 0 ? { ...message, content: nextPrompt } : message,
        ),
        originalPromptEditorOpen: false,
      };
    }

    case "CANCEL_ORIGINAL_PROMPT_EDIT":
      if (!state.originalPromptEditorOpen) {
        return state;
      }

      return {
        ...state,
        originalPromptEditorOpen: false,
        originalPromptDraft: state.editableOriginalPrompt,
      };

    case "GENERATE_IMPROVED_PROMPT":
      if (state.workflowStep !== "prompt_readiness_ready") {
        return state;
      }

      return {
        ...state,
        workflowStep: "improved_prompt_ready",
        improvedPrompt: action.improvedPrompt ?? improvedPromptTemplate,
        originalPromptEditorOpen: false,
        ...nextToast(state, toastMessages.improvedPromptReady),
      };

    case "SET_IMPROVED_PROMPT":
      if (state.workflowStep !== "improved_prompt_ready") {
        return state;
      }

      return {
        ...state,
        improvedPrompt: action.value,
      };

    case "RESET_IMPROVED_PROMPT":
      if (state.workflowStep !== "improved_prompt_ready") {
        return state;
      }

      return {
        ...state,
        improvedPrompt: improvedPromptTemplate,
      };

    case "USE_IMPROVED_PROMPT":
      if (
        state.workflowStep !== "improved_prompt_ready" ||
        !state.improvedPrompt.trim()
      ) {
        return state;
      }

      return {
        ...state,
        workflowStep: "answer_directions_loading",
        selectedPromptMode: "improved",
        ...nextToast(state, toastMessages.phase9Handoff),
      };

    case "CONTINUE_WITH_ORIGINAL_PROMPT":
      if (
        state.workflowStep !== "prompt_readiness_ready" &&
        state.workflowStep !== "improved_prompt_ready"
      ) {
        return state;
      }

      return {
        ...state,
        workflowStep: "answer_directions_loading",
        selectedPromptMode: "original",
        ...nextToast(state, toastMessages.phase9Handoff),
      };

    case "COMPLETE_ANSWER_DIRECTIONS":
      if (state.workflowStep !== "answer_directions_loading") {
        return state;
      }

      return {
        ...state,
        workflowStep: "answer_directions_ready",
        answerDirections: action.directions ?? state.answerDirections,
      };

    case "SELECT_ANSWER_DIRECTION": {
      if (state.workflowStep !== "answer_directions_ready") {
        return state;
      }

      const directionExists = state.answerDirections.some(
        (direction) => direction.id === action.directionId,
      );

      if (!directionExists) {
        return state;
      }

      return {
        ...state,
        workflowStep: "final_answer_loading",
        selectedDirection: action.directionId,
      };
    }

    case "COMPLETE_FINAL_ANSWER":
      if (state.workflowStep !== "final_answer_loading") {
        return state;
      }

      return {
        ...state,
        workflowStep: "final_answer_ready",
        answerId: action.answerId ?? state.answerId,
        finalAnswerBlocks: action.blocks ?? state.finalAnswerBlocks,
        highlightDefinitions: action.highlights ?? state.highlightDefinitions,
        qualitySignals: action.qualitySignals ?? state.qualitySignals,
        assumptions: action.assumptions ?? state.assumptions,
        missingContext: action.missingContext ?? state.missingContext,
        claimsBeforeRecheck: action.claims ?? state.claimsBeforeRecheck,
        alternatives: action.alternatives ?? state.alternatives,
        alternativesRecommendation:
          action.alternativesRecommendation ?? state.alternativesRecommendation,
        trustLensOpen: true,
        activeTrustLensTab: "quality",
      };

    case "SET_ACTIVE_TOOLTIP":
      if (state.workflowStep !== "final_answer_ready") {
        return state;
      }

      return {
        ...state,
        activeTooltipId: action.highlightId,
      };

    case "CLEAR_ACTIVE_TOOLTIP":
      return {
        ...state,
        activeTooltipId: null,
      };

    case "START_RECHECK":
      if (state.workflowStep !== "final_answer_ready") {
        return state;
      }

      if (state.recheckStatus === "running") {
        return {
          ...state,
          ...nextToast(state, "Recheck is already running."),
        };
      }

      return {
        ...state,
        trustLensOpen: true,
        recheckJobId: action.jobId ?? state.recheckJobId,
        recheckSteps: action.steps ?? state.recheckSteps,
        recheckStatus: "running",
        recheckProgressStep: 0,
        recheckComplete: false,
      };

    case "ADVANCE_RECHECK_STEP":
      if (
        state.workflowStep !== "final_answer_ready" ||
        state.recheckStatus !== "running"
      ) {
        return state;
      }

      return {
        ...state,
        recheckProgressStep: state.recheckProgressStep + 1,
      };

    case "COMPLETE_RECHECK":
      if (
        state.workflowStep !== "final_answer_ready" ||
        state.recheckStatus !== "running"
      ) {
        return state;
      }

      return {
        ...state,
        trustLensOpen: true,
        activeTrustLensTab: "claims",
        recheckStatus: "complete",
        recheckComplete: true,
        claimsAfterRecheck: action.claims ?? state.claimsAfterRecheck,
        activeTooltipId: null,
        ...nextToast(state, toastMessages.recheckComplete),
      };

    case "COPY_DRAFT":
      if (state.workflowStep !== "final_answer_ready") {
        return state;
      }

      return {
        ...state,
        ...nextToast(state, "Draft copied in prototype."),
      };

    case "ASK_ALTERNATIVE_VIEW":
      if (state.workflowStep !== "final_answer_ready") {
        return state;
      }

      return {
        ...state,
        extraAssistantMessages: [
          ...state.extraAssistantMessages,
          alternativeViewMessage,
        ],
        ...nextToast(state, toastMessages.alternativeView),
      };

    case "OPEN_SOURCE_MODAL":
      if (state.workflowStep !== "final_answer_ready") {
        return state;
      }

      if (!action.sourceId) {
        return {
          ...state,
          ...nextToast(state, toastMessages.sourceUnavailable),
        };
      }

      return {
        ...state,
        activeTooltipId: null,
        modalState: {
          sourcePassageOpen: true,
          activeSourceId: action.sourceId,
        },
      };

    case "CACHE_SOURCE_PASSAGE": {
      const existingSource = state.sourcePassages.some(
        (source) => source.id === action.source.id,
      );

      return {
        ...state,
        sourcePassages: existingSource
          ? state.sourcePassages.map((source) =>
              source.id === action.source.id ? action.source : source,
            )
          : [...state.sourcePassages, action.source],
      };
    }

    case "CLOSE_SOURCE_MODAL":
      return {
        ...state,
        modalState: {
          sourcePassageOpen: false,
          activeSourceId: null,
        },
      };

    case "SHOW_IN_TRUST_LENS":
      if (state.workflowStep !== "final_answer_ready") {
        return state;
      }

      return {
        ...state,
        trustLensOpen: true,
        activeTrustLensTab: action.tab,
      };

    case "OPEN_TRUST_LENS":
      if (state.workflowStep !== "final_answer_ready") {
        return state;
      }

      return {
        ...state,
        trustLensOpen: true,
      };

    case "CLOSE_TRUST_LENS":
      if (state.workflowStep !== "final_answer_ready") {
        return state;
      }

      return {
        ...state,
        trustLensOpen: false,
      };

    case "SET_TRUST_LENS_TAB":
      if (state.workflowStep !== "final_answer_ready") {
        return state;
      }

      return {
        ...state,
        activeTrustLensTab: action.tab,
      };

    case "USE_AS_DRAFT":
      if (state.workflowStep !== "final_answer_ready") {
        return state;
      }

      return {
        ...state,
        ...nextToast(state, toastMessages.useAsDraft),
      };

    case "OPEN_CONTEXT_INPUT":
      if (state.workflowStep !== "final_answer_ready") {
        return state;
      }

      return {
        ...state,
        contextInputOpen: true,
        activeTrustLensTab: "missing_context",
      };

    case "OPEN_CLAIMS_FROM_SUMMARY":
      if (state.workflowStep !== "final_answer_ready") {
        return state;
      }

      return {
        ...state,
        trustLensOpen: true,
        activeTrustLensTab: "claims",
      };

    case "OPEN_MISSING_CONTEXT_FROM_SUMMARY":
      if (state.workflowStep !== "final_answer_ready") {
        return state;
      }

      return {
        ...state,
        trustLensOpen: true,
        activeTrustLensTab: "missing_context",
        contextInputOpen: true,
      };

    case "SET_CONTEXT_DRAFT":
      if (state.workflowStep !== "final_answer_ready") {
        return state;
      }

      return {
        ...state,
        addedContextDraft: action.value,
      };

    case "SAVE_CONTEXT":
      if (state.workflowStep !== "final_answer_ready") {
        return state;
      }

      return {
        ...state,
        contextInputOpen: false,
        addedContextDraft: "",
        ...nextToast(state, toastMessages.contextAdded),
      };

    case "VERIFY_FIRST":
      if (state.workflowStep !== "final_answer_ready") {
        return state;
      }

      return {
        ...state,
        trustLensOpen: true,
        activeTrustLensTab: "claims",
      };

    case "MOCK_REGENERATE":
      if (state.workflowStep !== "final_answer_ready") {
        return state;
      }

      return {
        ...state,
        ...nextToast(state, toastMessages.regenerate),
      };

    case "RESET_CHAT": {
      const nextState = createInitialAppState(clarificationQuestions);

      return {
        ...nextState,
        toastSequence: state.toastSequence + 1,
        toast: {
          id: `toast-${state.toastSequence + 1}`,
          message: toastMessages.newChatReset,
        },
      };
    }

    case "OPEN_SIDEBAR":
      return {
        ...state,
        sidebarOpen: true,
      };

    case "CLOSE_SIDEBAR":
      return {
        ...state,
        sidebarOpen: false,
      };

    case "SHOW_TOAST":
      return {
        ...state,
        ...nextToast(state, action.message),
      };

    case "DISMISS_TOAST":
      if (state.toast?.id !== action.id) {
        return state;
      }

      return {
        ...state,
        toast: null,
      };

    default:
      return state;
  }
}
