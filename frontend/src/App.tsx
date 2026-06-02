import { useEffect, useReducer, useRef } from "react";
import { AppLayout } from "./components/AppLayout";
import { ChatArea } from "./components/ChatArea";
import { CollapsedTrustLensRail } from "./components/CollapsedTrustLensRail";
import { Composer } from "./components/Composer";
import { Sidebar } from "./components/Sidebar";
import { SourcePassageModal } from "./components/SourcePassageModal";
import { Toast } from "./components/Toast";
import { TopBar } from "./components/TopBar";
import { TrustLensPanel } from "./components/TrustLensPanel";
import {
  createTrustLensSession,
  generateFinalAnswer,
  generateImprovedPrompt,
  getAnswerDirections,
  getRecheckStatus,
  getSourcePassage,
  runPromptReadiness,
  startRecheck,
  trustLensApiModeEnabled,
} from "./api/trustLensClient";
import { toastMessages } from "./data/trustLensCopy";
import { clarificationQuestions } from "./data/trustLensMockData";
import { appReducer, createInitialAppState } from "./state/appReducer";
import type { AnswerDirectionId } from "./state/appTypes";

export default function App() {
  const [state, dispatch] = useReducer(
    appReducer,
    clarificationQuestions,
    createInitialAppState,
  );
  const sourceReturnFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!state.toast) {
      return;
    }

    const timeout = window.setTimeout(() => {
      dispatch({ type: "DISMISS_TOAST", id: state.toast!.id });
    }, state.toast.duration ?? 2800);

    return () => window.clearTimeout(timeout);
  }, [state.toast]);

  useEffect(() => {
    if (state.workflowStep !== "prompt_submitted") {
      return;
    }

    const frame = window.setTimeout(() => {
      dispatch({ type: "START_READINESS_LOADING" });
    }, 0);

    return () => window.clearTimeout(frame);
  }, [state.workflowStep]);

  useEffect(() => {
    if (state.workflowStep !== "prompt_readiness_loading") {
      return;
    }

    let cancelled = false;

    async function completeReadiness() {
      const sessionResult = await createTrustLensSession();

      if (!sessionResult.success) {
        if (!cancelled) {
          dispatch({ type: "COMPLETE_READINESS" });
          dispatch({
            type: "SHOW_TOAST",
            message: sessionResult.error.message,
          });
        }
        return;
      }

      const readinessResult = await runPromptReadiness({
        sessionId: sessionResult.data.sessionId,
        prompt: state.editableOriginalPrompt,
      });

      if (cancelled) {
        return;
      }

      if (!readinessResult.success) {
        dispatch({
          type: "COMPLETE_READINESS",
          sessionId: sessionResult.data.sessionId,
        });
        dispatch({
          type: "SHOW_TOAST",
          message: readinessResult.error.message,
        });
        return;
      }

      dispatch({
        type: "COMPLETE_READINESS",
        sessionId: sessionResult.data.sessionId,
        readinessId: readinessResult.data.readinessId,
        risks: readinessResult.data.risks,
        qualityRows: readinessResult.data.qualityRows,
        clarificationQuestions: readinessResult.data.clarificationQuestions,
      });
    }

    const timeout = window.setTimeout(() => {
      void completeReadiness();
    }, 350);

    return () => {
      cancelled = true;
      window.clearTimeout(timeout);
    };
  }, [state.editableOriginalPrompt, state.workflowStep]);

  useEffect(() => {
    if (!state.sidebarOpen) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        dispatch({ type: "CLOSE_SIDEBAR" });
      }
    };

    document.body.classList.add("drawer-lock");
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.classList.remove("drawer-lock");
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [state.sidebarOpen]);

  useEffect(() => {
    if (state.workflowStep !== "answer_directions_loading") {
      return;
    }

    let cancelled = false;

    async function completeAnswerDirections() {
      const directionsResult = await getAnswerDirections({
        sessionId: state.sessionId ?? undefined,
        selectedPrompt:
          state.selectedPromptMode === "improved"
            ? state.improvedPrompt
            : state.editableOriginalPrompt,
        selectedPromptMode: state.selectedPromptMode,
      });

      if (cancelled) {
        return;
      }

      if (!directionsResult.success) {
        dispatch({ type: "COMPLETE_ANSWER_DIRECTIONS" });
        dispatch({
          type: "SHOW_TOAST",
          message: directionsResult.error.message,
        });
        return;
      }

      dispatch({
        type: "COMPLETE_ANSWER_DIRECTIONS",
        directions: directionsResult.data.directions,
        recommendedDirectionId: directionsResult.data.recommendedDirectionId,
      });
    }

    const timeout = window.setTimeout(() => {
      void completeAnswerDirections();
    }, 350);

    return () => {
      cancelled = true;
      window.clearTimeout(timeout);
    };
  }, [
    state.editableOriginalPrompt,
    state.improvedPrompt,
    state.selectedPromptMode,
    state.sessionId,
    state.workflowStep,
  ]);

  useEffect(() => {
    if (state.workflowStep !== "final_answer_loading") {
      return;
    }

    let cancelled = false;

    async function completeFinalAnswer() {
      const answerResult = await generateFinalAnswer({
        sessionId: state.sessionId ?? undefined,
        selectedPrompt:
          state.selectedPromptMode === "improved"
            ? state.improvedPrompt
            : state.editableOriginalPrompt,
        selectedPromptMode: state.selectedPromptMode,
        selectedDirectionId: state.selectedDirection ?? "decision_ready",
      });

      if (cancelled) {
        return;
      }

      if (!answerResult.success) {
        dispatch({ type: "COMPLETE_FINAL_ANSWER" });
        dispatch({
          type: "SHOW_TOAST",
          message: answerResult.error.message,
        });
        return;
      }

      dispatch({
        type: "COMPLETE_FINAL_ANSWER",
        answerId: answerResult.data.answerId,
        blocks: answerResult.data.blocks,
        highlights: answerResult.data.highlights,
        qualitySignals: answerResult.data.trustLens.qualitySignals,
        assumptions: answerResult.data.trustLens.assumptions,
        missingContext: answerResult.data.trustLens.missingContext,
        claims: answerResult.data.trustLens.claims,
        alternatives: answerResult.data.trustLens.alternatives,
        alternativesRecommendation:
          answerResult.data.trustLens.alternativesRecommendation,
      });
    }

    const timeout = window.setTimeout(() => {
      void completeFinalAnswer();
    }, 350);

    return () => {
      cancelled = true;
      window.clearTimeout(timeout);
    };
  }, [
    state.editableOriginalPrompt,
    state.improvedPrompt,
    state.selectedDirection,
    state.selectedPromptMode,
    state.sessionId,
    state.workflowStep,
  ]);

  useEffect(() => {
    if (!state.activeTooltipId) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        dispatch({ type: "CLEAR_ACTIVE_TOOLTIP" });
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [state.activeTooltipId]);

  useEffect(() => {
    if (state.recheckStatus !== "running") {
      return;
    }

    let cancelled = false;

    async function advanceRecheck() {
      if (trustLensApiModeEnabled && state.recheckJobId) {
        const statusResult = await getRecheckStatus(state.recheckJobId);

        if (cancelled) {
          return;
        }

        if (!statusResult.success) {
          dispatch({ type: "COMPLETE_RECHECK" });
          dispatch({
            type: "SHOW_TOAST",
            message: statusResult.error.message,
          });
          return;
        }

        if (statusResult.data.status === "complete") {
          dispatch({
            type: "COMPLETE_RECHECK",
            claims: statusResult.data.claims,
          });
          return;
        }

        dispatch({ type: "ADVANCE_RECHECK_STEP" });
        return;
      }

      if (state.recheckProgressStep >= state.recheckSteps.length - 1) {
        const statusResult = await getRecheckStatus(state.recheckProgressStep);

        if (!cancelled) {
          dispatch({
            type: "COMPLETE_RECHECK",
            claims: statusResult.success ? statusResult.data.claims : undefined,
          });
        }
        return;
      }

      dispatch({ type: "ADVANCE_RECHECK_STEP" });
    }

    const timeout = window.setTimeout(() => {
      void advanceRecheck();
    }, 325);

    return () => {
      cancelled = true;
      window.clearTimeout(timeout);
    };
  }, [
    state.recheckJobId,
    state.recheckProgressStep,
    state.recheckStatus,
    state.recheckSteps.length,
  ]);

  const activeSource =
    state.sourcePassages.find(
      (source) => source.id === state.modalState.activeSourceId,
    ) ?? null;

  const handleGenerateImprovedPrompt = async () => {
    const improvedPromptResult = await generateImprovedPrompt({
      sessionId: state.sessionId ?? undefined,
      readinessId: state.readinessId ?? undefined,
      originalPrompt: state.editableOriginalPrompt,
      clarifications: Object.entries(state.selectedClarifications).map(
        ([questionId, optionId]) => ({
          questionId,
          optionId,
          label: optionId,
        }),
      ),
    });

    if (!improvedPromptResult.success) {
      dispatch({ type: "GENERATE_IMPROVED_PROMPT" });
      dispatch({
        type: "SHOW_TOAST",
        message: improvedPromptResult.error.message,
      });
      return;
    }

    dispatch({
      type: "GENERATE_IMPROVED_PROMPT",
      improvedPrompt: improvedPromptResult.data.improvedPrompt,
    });
  };

  const handleSelectDirection = (directionId: AnswerDirectionId) => {
    dispatch({ type: "SELECT_ANSWER_DIRECTION", directionId });
  };

  const handleStartRecheck = async () => {
    if (
      state.workflowStep !== "final_answer_ready" ||
      state.recheckStatus === "running"
    ) {
      dispatch({ type: "START_RECHECK" });
      return;
    }

    const recheckResult = await startRecheck({
      sessionId: state.sessionId ?? undefined,
      answerId: state.answerId ?? undefined,
    });

    if (!recheckResult.success) {
      dispatch({ type: "START_RECHECK" });
      dispatch({
        type: "SHOW_TOAST",
        message: recheckResult.error.message,
      });
      return;
    }

    dispatch({
      type: "START_RECHECK",
      jobId: recheckResult.data.jobId,
      steps: recheckResult.data.steps,
    });
  };

  const handleOpenSourceModal = async (
    sourceId: string | null,
    highlightId: string,
  ) => {
    const highlightTrigger = document.querySelector<HTMLElement>(
      `[data-highlight-trigger='${highlightId}']`,
    );
    sourceReturnFocusRef.current =
      highlightTrigger ??
      (document.activeElement instanceof HTMLElement ? document.activeElement : null);

    if (sourceId) {
      const sourceResult = await getSourcePassage(sourceId);

      if (sourceResult.success) {
        dispatch({
          type: "CACHE_SOURCE_PASSAGE",
          source: sourceResult.data.source,
        });
      }
    }

    dispatch({ type: "OPEN_SOURCE_MODAL", sourceId });
  };

  const handleCloseSourceModal = () => {
    dispatch({ type: "CLOSE_SOURCE_MODAL" });
    window.setTimeout(() => {
      sourceReturnFocusRef.current?.focus();
      sourceReturnFocusRef.current = null;
    }, 0);
  };

  const handleViewHighlightedOutput = () => {
    document
      .querySelector<HTMLElement>("[data-final-answer='true']")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const sidebar = (
    <Sidebar
      onClose={() => dispatch({ type: "CLOSE_SIDEBAR" })}
      onHistoryClick={() =>
        dispatch({
          type: "SHOW_TOAST",
          message: toastMessages.historyUnavailable,
        })
      }
      onNewChat={() => dispatch({ type: "RESET_CHAT" })}
      onSettingsClick={() =>
        dispatch({
          type: "SHOW_TOAST",
          message: toastMessages.settingsUnavailable,
        })
      }
    />
  );
  const canShowTrustLens = state.workflowStep === "final_answer_ready";
  const trustLensPanel = (
    <TrustLensPanel
      state={state}
      onAskAlternativeView={() => dispatch({ type: "ASK_ALTERNATIVE_VIEW" })}
      onClose={() => dispatch({ type: "CLOSE_TRUST_LENS" })}
      onOpenContextInput={() => dispatch({ type: "OPEN_CONTEXT_INPUT" })}
      onRegenerate={() => dispatch({ type: "MOCK_REGENERATE" })}
      onSaveContext={() => dispatch({ type: "SAVE_CONTEXT" })}
      onSetContextDraft={(value) => dispatch({ type: "SET_CONTEXT_DRAFT", value })}
      onStartRecheck={handleStartRecheck}
      onTabChange={(tab) => dispatch({ type: "SET_TRUST_LENS_TAB", tab })}
      onUseAsDraft={() => dispatch({ type: "USE_AS_DRAFT" })}
      onVerifyFirst={() => dispatch({ type: "VERIFY_FIRST" })}
    />
  );
  const trustLensRail = (
    <CollapsedTrustLensRail onOpen={() => dispatch({ type: "OPEN_TRUST_LENS" })} />
  );

  return (
    <>
      <AppLayout
        sidebar={sidebar}
        sidebarOpen={state.sidebarOpen}
        canShowTrustLens={canShowTrustLens}
        onCloseSidebar={() => dispatch({ type: "CLOSE_SIDEBAR" })}
        onCloseTrustLens={() => dispatch({ type: "CLOSE_TRUST_LENS" })}
        trustLens={trustLensPanel}
        trustLensOpen={state.trustLensOpen}
        trustLensRail={trustLensRail}
      >
        <TopBar
          onOpenSidebar={() => dispatch({ type: "OPEN_SIDEBAR" })}
          onModelClick={() =>
            dispatch({
              type: "SHOW_TOAST",
              message: toastMessages.modelSelectorMocked,
            })
          }
        />

        <ChatArea
          state={state}
          onCancelOriginalPromptEdit={() =>
            dispatch({ type: "CANCEL_ORIGINAL_PROMPT_EDIT" })
          }
          onContinueWithOriginalPrompt={() =>
            dispatch({ type: "CONTINUE_WITH_ORIGINAL_PROMPT" })
          }
          onGenerateImprovedPrompt={handleGenerateImprovedPrompt}
          onOpenOriginalPromptEditor={() =>
            dispatch({ type: "OPEN_ORIGINAL_PROMPT_EDITOR" })
          }
          onResetImprovedPrompt={() => dispatch({ type: "RESET_IMPROVED_PROMPT" })}
          onSaveOriginalPromptEdit={() =>
            dispatch({ type: "SAVE_ORIGINAL_PROMPT_EDIT" })
          }
          onSelectClarification={(questionId, optionId) =>
            dispatch({ type: "SELECT_CLARIFICATION", questionId, optionId })
          }
          onSelectDirection={handleSelectDirection}
          onSetImprovedPrompt={(value) =>
            dispatch({ type: "SET_IMPROVED_PROMPT", value })
          }
          onSetOriginalPromptDraft={(value) =>
            dispatch({ type: "SET_ORIGINAL_PROMPT_DRAFT", value })
          }
          onUseSamplePrompt={() => dispatch({ type: "USE_SAMPLE_PROMPT" })}
          onUseImprovedPrompt={() => dispatch({ type: "USE_IMPROVED_PROMPT" })}
          onAskAlternativeView={() => dispatch({ type: "ASK_ALTERNATIVE_VIEW" })}
          onClearActiveTooltip={() => dispatch({ type: "CLEAR_ACTIVE_TOOLTIP" })}
          onCopyDraft={() => dispatch({ type: "COPY_DRAFT" })}
          onOpenClaimsFromSummary={() => dispatch({ type: "OPEN_CLAIMS_FROM_SUMMARY" })}
          onOpenMissingContextFromSummary={() =>
            dispatch({ type: "OPEN_MISSING_CONTEXT_FROM_SUMMARY" })
          }
          onOpenSourceModal={handleOpenSourceModal}
          onShowInTrustLens={(tab) => dispatch({ type: "SHOW_IN_TRUST_LENS", tab })}
          onShowToast={(message) => dispatch({ type: "SHOW_TOAST", message })}
          onStartRecheck={handleStartRecheck}
          onSetActiveTooltip={(highlightId) =>
            dispatch({ type: "SET_ACTIVE_TOOLTIP", highlightId })
          }
          onViewHighlightedOutput={handleViewHighlightedOutput}
        />

        <Composer
          disabled={state.workflowStep !== "initial"}
          value={state.composerValue}
          onChange={(value) => dispatch({ type: "SET_COMPOSER", value })}
          onSubmit={() => dispatch({ type: "SUBMIT_PROMPT" })}
        />
      </AppLayout>

      <Toast toast={state.toast} />
      {state.modalState.sourcePassageOpen ? (
        <SourcePassageModal source={activeSource} onClose={handleCloseSourceModal} />
      ) : null}
    </>
  );
}
