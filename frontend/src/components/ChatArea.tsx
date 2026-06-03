import { directionCopy, finalAnswerCopy } from "../data/trustLensCopy";
import type { AnswerDirectionId, AppState, TrustLensTab } from "../state/appTypes";
import { AnswerDirectionCards } from "./AnswerDirectionCards";
import { EmptyState } from "./EmptyState";
import { FinalOutput } from "./FinalOutput";
import { ImprovedPromptPreview } from "./ImprovedPromptPreview";
import { LoadingMessage } from "./LoadingMessage";
import { PromptReadinessCard } from "./PromptReadinessCard";

interface ChatAreaProps {
  state: AppState;
  onCancelOriginalPromptEdit: () => void;
  onContinueWithOriginalPrompt: () => void;
  onGenerateImprovedPrompt: () => void;
  onOpenOriginalPromptEditor: () => void;
  onResetImprovedPrompt: () => void;
  onSaveOriginalPromptEdit: () => void;
  onSelectClarification: (questionId: string, optionId: string) => void;
  onSelectDirection: (directionId: AnswerDirectionId) => void;
  onSetImprovedPrompt: (value: string) => void;
  onSetOriginalPromptDraft: (value: string) => void;
  onAskAlternativeView: () => void;
  onClearActiveTooltip: () => void;
  onCopyDraft: () => void;
  onOpenClaimsFromSummary: () => void;
  onOpenMissingContextFromSummary: () => void;
  onSetActiveTooltip: (highlightId: string) => void;
  onShowInTrustLens: (tab: TrustLensTab) => void;
  onShowToast: (message: string) => void;
  onStartRecheck: () => void;
  onViewHighlightedOutput: () => void;
  onUseSamplePrompt: () => void;
  onUseImprovedPrompt: () => void;
}

export function ChatArea({
  state,
  onCancelOriginalPromptEdit,
  onContinueWithOriginalPrompt,
  onGenerateImprovedPrompt,
  onOpenOriginalPromptEditor,
  onResetImprovedPrompt,
  onSaveOriginalPromptEdit,
  onSelectClarification,
  onSelectDirection,
  onSetImprovedPrompt,
  onSetOriginalPromptDraft,
  onAskAlternativeView,
  onClearActiveTooltip,
  onCopyDraft,
  onOpenClaimsFromSummary,
  onOpenMissingContextFromSummary,
  onSetActiveTooltip,
  onShowInTrustLens,
  onShowToast,
  onStartRecheck,
  onViewHighlightedOutput,
  onUseSamplePrompt,
  onUseImprovedPrompt,
}: ChatAreaProps) {
  const showEmptyState =
    state.workflowStep === "initial" && state.messages.length === 0;
  const selectedDirection = state.answerDirections.find(
    (direction) => direction.id === state.selectedDirection,
  );

  return (
    <main className="min-h-0 flex-1 overflow-y-auto bg-tl-bg">
      <div className="mx-auto flex min-h-full w-full max-w-[760px] flex-col px-4 py-6 sm:px-6 lg:px-8">
        {showEmptyState ? (
          <EmptyState onUseSamplePrompt={onUseSamplePrompt} />
        ) : (
          <div className="flex flex-1 flex-col gap-5 py-8">
            {state.messages.map((message) => (
              <article className="flex justify-end" key={message.id}>
                <div className="max-w-[620px] rounded-[10px] border border-tl-border bg-tl-surface px-4 py-3 text-base leading-6 shadow-sm">
                  <p className="whitespace-pre-wrap">{message.content}</p>
                </div>
              </article>
            ))}

            {state.workflowStep === "prompt_submitted" ||
            state.workflowStep === "prompt_readiness_loading" ? (
              <LoadingMessage
                detail="Checking missing context, ambiguity, and answer-quality risk before generation."
                text="Running Prompt Readiness Check..."
              />
            ) : null}

            {state.workflowStep === "prompt_readiness_ready" ? (
              <PromptReadinessCard
                state={state}
                onCancelOriginalPromptEdit={onCancelOriginalPromptEdit}
                onContinueWithOriginalPrompt={onContinueWithOriginalPrompt}
                onGenerateImprovedPrompt={onGenerateImprovedPrompt}
                onOpenOriginalPromptEditor={onOpenOriginalPromptEditor}
                onSaveOriginalPromptEdit={onSaveOriginalPromptEdit}
                onSelectClarification={onSelectClarification}
                onSetOriginalPromptDraft={onSetOriginalPromptDraft}
              />
            ) : null}

            {state.workflowStep === "improved_prompt_ready" ? (
              <>
                <PromptReadinessCard
                  mode="summary"
                  state={state}
                  onCancelOriginalPromptEdit={onCancelOriginalPromptEdit}
                  onContinueWithOriginalPrompt={onContinueWithOriginalPrompt}
                  onGenerateImprovedPrompt={onGenerateImprovedPrompt}
                  onOpenOriginalPromptEditor={onOpenOriginalPromptEditor}
                  onSaveOriginalPromptEdit={onSaveOriginalPromptEdit}
                  onSelectClarification={onSelectClarification}
                  onSetOriginalPromptDraft={onSetOriginalPromptDraft}
                />
                <ImprovedPromptPreview
                  improvedPrompt={state.improvedPrompt}
                  originalPrompt={state.editableOriginalPrompt}
                  onContinueWithOriginalPrompt={onContinueWithOriginalPrompt}
                  onResetImprovedPrompt={onResetImprovedPrompt}
                  onSetImprovedPrompt={onSetImprovedPrompt}
                  onUseImprovedPrompt={onUseImprovedPrompt}
                />
              </>
            ) : null}

            {state.workflowStep === "answer_directions_loading" ? (
              <LoadingMessage
                detail="Preparing response shapes before creating the final answer."
                text={directionCopy.loadingText}
              />
            ) : null}

            {state.workflowStep === "answer_directions_ready" ? (
              <AnswerDirectionCards
                directions={state.answerDirections}
                onSelectDirection={onSelectDirection}
              />
            ) : null}

            {state.workflowStep === "final_answer_loading" ? (
              <LoadingMessage
                detail="Keeping the final answer structured so highlighted claims can be reviewed."
                text={`${finalAnswerCopy.loadingPrefix} ${selectedDirection?.title ?? "selected direction"}...`}
              />
            ) : null}

            {state.workflowStep === "final_answer_ready" ? (
              <FinalOutput
                activeTooltipId={state.activeTooltipId}
                extraAssistantMessages={state.extraAssistantMessages}
                finalAnswerBlocks={state.finalAnswerBlocks}
                highlightDefinitions={state.highlightDefinitions}
                recheckComplete={state.recheckComplete}
                recheckProgressStep={state.recheckProgressStep}
                recheckStatus={state.recheckStatus}
                recheckSteps={state.recheckSteps}
                sourcePassages={state.sourcePassages}
                onAddMissingContextFromSummary={onOpenMissingContextFromSummary}
                onAskAlternativeView={onAskAlternativeView}
                onClearActiveTooltip={onClearActiveTooltip}
                onCopyDraft={onCopyDraft}
                onOpenClaimsFromSummary={onOpenClaimsFromSummary}
                onSetActiveTooltip={onSetActiveTooltip}
                onShowInTrustLens={onShowInTrustLens}
                onShowToast={onShowToast}
                onStartRecheck={onStartRecheck}
                onViewHighlightedOutput={onViewHighlightedOutput}
              />
            ) : null}
          </div>
        )}
      </div>
    </main>
  );
}
