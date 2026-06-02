import { AlertTriangle, Check, Pencil } from "lucide-react";
import { readinessCopy } from "../data/trustLensCopy";
import type { AppState } from "../state/appTypes";

interface PromptReadinessCardProps {
  mode?: "interactive" | "summary";
  state: AppState;
  onCancelOriginalPromptEdit: () => void;
  onContinueWithOriginalPrompt: () => void;
  onGenerateImprovedPrompt: () => void;
  onOpenOriginalPromptEditor: () => void;
  onSaveOriginalPromptEdit: () => void;
  onSelectClarification: (questionId: string, optionId: string) => void;
  onSetOriginalPromptDraft: (value: string) => void;
}

export function PromptReadinessCard({
  mode = "interactive",
  state,
  onCancelOriginalPromptEdit,
  onContinueWithOriginalPrompt,
  onGenerateImprovedPrompt,
  onOpenOriginalPromptEditor,
  onSaveOriginalPromptEdit,
  onSelectClarification,
  onSetOriginalPromptDraft,
}: PromptReadinessCardProps) {
  const isSummary = mode === "summary";
  const canSaveOriginalPrompt = state.originalPromptDraft.trim().length > 0;

  return (
    <section className="rounded-[10px] border border-tl-border bg-tl-surface">
      <div className="border-b border-tl-border px-4 py-4 sm:px-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold leading-7 text-tl-text">
              {readinessCopy.title}
            </h2>
            <p className="mt-1 max-w-[68ch] text-sm leading-6 text-tl-text-muted">
              {readinessCopy.explanation}
            </p>
          </div>
          <div className="inline-flex w-fit items-center gap-1.5 rounded-full border border-tl-verify/30 bg-tl-verify-bg px-2.5 py-1 text-xs font-semibold text-tl-text">
            <AlertTriangle size={14} strokeWidth={1.75} />
            {readinessCopy.badge}
          </div>
        </div>
      </div>

      <div className="space-y-5 px-4 py-4 sm:px-5">
        <div>
          <p className="text-xs font-semibold uppercase leading-4 text-tl-text-soft">
            Risk signals
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            {state.promptReadinessRisks.map((risk) => (
              <span
                className="rounded-full border border-tl-border bg-tl-panel px-2.5 py-1 text-xs font-medium text-tl-text-muted"
                key={risk.id}
              >
                {risk.label}
              </span>
            ))}
          </div>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase leading-4 text-tl-text-soft">
            Quality risk rows
          </p>
          <div className="mt-2 divide-y divide-tl-border rounded-[8px] border border-tl-border">
            {state.qualityRiskRows.map((row) => (
              <div
                className="flex items-center justify-between gap-4 px-3 py-2.5 text-sm"
                key={row.id}
              >
                <span className="text-tl-text">{row.label}</span>
                <span className="shrink-0 rounded-full bg-tl-panel px-2 py-0.5 text-xs font-medium text-tl-text-muted">
                  {row.level}
                </span>
              </div>
            ))}
          </div>
        </div>

        {state.originalPromptEditorOpen && !isSummary ? (
          <div className="rounded-[8px] border border-tl-border bg-tl-panel p-3">
            <label
              className="text-sm font-semibold text-tl-text"
              htmlFor="original-prompt-edit"
            >
              Original prompt
            </label>
            <textarea
              className="focus-ring mt-2 min-h-24 w-full resize-y rounded-[10px] border border-tl-border bg-tl-surface px-3 py-2 text-sm leading-6 text-tl-text outline-none placeholder:text-tl-text-soft"
              id="original-prompt-edit"
              value={state.originalPromptDraft}
              onChange={(event) => onSetOriginalPromptDraft(event.target.value)}
            />
            <div className="mt-3 flex flex-col gap-2 sm:flex-row">
              <button
                className="focus-ring inline-flex h-9 items-center justify-center rounded-[8px] bg-tl-accent px-3 text-sm font-semibold text-tl-accent-ink transition hover:brightness-95 disabled:cursor-not-allowed disabled:bg-tl-surface-muted disabled:text-tl-text-soft"
                disabled={!canSaveOriginalPrompt}
                type="button"
                onClick={onSaveOriginalPromptEdit}
              >
                {readinessCopy.saveOriginalButton}
              </button>
              <button
                className="focus-ring inline-flex h-9 items-center justify-center rounded-[8px] border border-tl-border bg-tl-surface px-3 text-sm font-semibold text-tl-text transition hover:bg-tl-panel"
                type="button"
                onClick={onCancelOriginalPromptEdit}
              >
                {readinessCopy.cancelOriginalButton}
              </button>
            </div>
          </div>
        ) : null}

        <div>
          <p className="text-sm font-semibold text-tl-text">{readinessCopy.intro}</p>
          <div className="mt-3 space-y-4">
            {state.clarificationQuestions.map((question) => (
              <fieldset
                className="rounded-[8px] border border-tl-border bg-tl-panel p-3"
                disabled={isSummary}
                key={question.id}
              >
                <legend className="px-1 text-sm font-semibold text-tl-text">
                  {question.question}
                </legend>
                <div className="mt-3 flex flex-wrap gap-2">
                  {question.options.map((option) => {
                    const selected =
                      state.selectedClarifications[question.id] === option.id;

                    return (
                      <label
                        className={[
                          "inline-flex min-h-9 cursor-pointer items-center gap-1.5 rounded-full border px-3 py-1 text-sm font-medium transition",
                          selected
                            ? "border-tl-accent bg-tl-assumption-bg text-tl-text"
                            : "border-tl-border bg-tl-surface text-tl-text-muted hover:border-tl-border-strong hover:text-tl-text",
                          isSummary ? "cursor-default" : "",
                        ].join(" ")}
                        key={option.id}
                      >
                        <input
                          checked={selected}
                          className="sr-only"
                          disabled={isSummary}
                          name={`clarification-${question.id}`}
                          type="radio"
                          value={option.id}
                          onChange={() => onSelectClarification(question.id, option.id)}
                        />
                        {selected ? <Check size={14} strokeWidth={1.75} /> : null}
                        {option.label}
                      </label>
                    );
                  })}
                </div>
              </fieldset>
            ))}
          </div>
        </div>

        {!isSummary ? (
          <div className="flex flex-col gap-2 border-t border-tl-border pt-4 sm:flex-row sm:items-center">
            <button
              className="focus-ring inline-flex min-h-10 items-center justify-center rounded-[8px] bg-tl-accent px-3.5 text-sm font-semibold text-tl-accent-ink transition hover:brightness-95"
              type="button"
              onClick={onGenerateImprovedPrompt}
            >
              {readinessCopy.generateButton}
            </button>
            <button
              className="focus-ring inline-flex min-h-10 items-center justify-center rounded-[8px] border border-tl-border bg-tl-surface px-3.5 text-sm font-semibold text-tl-text transition hover:bg-tl-panel"
              type="button"
              onClick={onContinueWithOriginalPrompt}
            >
              {readinessCopy.skipButton}
            </button>
            <button
              className="focus-ring inline-flex min-h-10 items-center justify-center gap-1.5 rounded-[8px] px-3 text-sm font-semibold text-tl-text-muted transition hover:bg-tl-panel hover:text-tl-text"
              type="button"
              onClick={onOpenOriginalPromptEditor}
            >
              <Pencil size={15} strokeWidth={1.75} />
              {readinessCopy.editOriginalButton}
            </button>
          </div>
        ) : null}
      </div>
    </section>
  );
}
