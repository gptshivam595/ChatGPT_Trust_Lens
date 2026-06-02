import { RotateCcw } from "lucide-react";
import { improvedPromptCopy } from "../data/trustLensCopy";

interface ImprovedPromptPreviewProps {
  improvedPrompt: string;
  originalPrompt: string;
  onContinueWithOriginalPrompt: () => void;
  onResetImprovedPrompt: () => void;
  onSetImprovedPrompt: (value: string) => void;
  onUseImprovedPrompt: () => void;
}

export function ImprovedPromptPreview({
  improvedPrompt,
  originalPrompt,
  onContinueWithOriginalPrompt,
  onResetImprovedPrompt,
  onSetImprovedPrompt,
  onUseImprovedPrompt,
}: ImprovedPromptPreviewProps) {
  const canUseImprovedPrompt = improvedPrompt.trim().length > 0;

  return (
    <section className="rounded-[10px] border border-tl-border bg-tl-surface">
      <div className="border-b border-tl-border px-4 py-4 sm:px-5">
        <h2 className="text-lg font-semibold leading-7 text-tl-text">
          {improvedPromptCopy.title}
        </h2>
        <p className="mt-1 max-w-[68ch] text-sm leading-6 text-tl-text-muted">
          {improvedPromptCopy.description}
        </p>
      </div>

      <div className="grid gap-4 px-4 py-4 sm:px-5">
        <div>
          <p className="text-sm font-semibold text-tl-text">
            {improvedPromptCopy.originalLabel}
          </p>
          <div
            aria-label="Read-only original prompt"
            className="mt-2 rounded-[8px] border border-tl-border bg-tl-panel px-3 py-3 text-sm leading-6 text-tl-text-muted"
          >
            {originalPrompt}
          </div>
        </div>

        <div>
          <label
            className="text-sm font-semibold text-tl-text"
            htmlFor="improved-prompt-preview"
          >
            {improvedPromptCopy.improvedLabel}
          </label>
          <textarea
            className="focus-ring mt-2 min-h-40 w-full resize-y rounded-[10px] border border-tl-border bg-tl-surface px-3 py-3 text-sm leading-6 text-tl-text outline-none placeholder:text-tl-text-soft"
            id="improved-prompt-preview"
            value={improvedPrompt}
            onChange={(event) => onSetImprovedPrompt(event.target.value)}
          />
        </div>

        <div className="flex flex-col gap-2 border-t border-tl-border pt-4 sm:flex-row sm:items-center">
          <button
            className="focus-ring inline-flex min-h-10 items-center justify-center rounded-[8px] bg-tl-accent px-3.5 text-sm font-semibold text-tl-accent-ink transition hover:brightness-95 disabled:cursor-not-allowed disabled:bg-tl-surface-muted disabled:text-tl-text-soft"
            disabled={!canUseImprovedPrompt}
            type="button"
            onClick={onUseImprovedPrompt}
          >
            {improvedPromptCopy.useButton}
          </button>
          <button
            className="focus-ring inline-flex min-h-10 items-center justify-center rounded-[8px] border border-tl-border bg-tl-surface px-3.5 text-sm font-semibold text-tl-text transition hover:bg-tl-panel"
            type="button"
            onClick={onContinueWithOriginalPrompt}
          >
            {improvedPromptCopy.continueButton}
          </button>
          <button
            className="focus-ring inline-flex min-h-10 items-center justify-center gap-1.5 rounded-[8px] px-3 text-sm font-semibold text-tl-text-muted transition hover:bg-tl-panel hover:text-tl-text"
            type="button"
            onClick={onResetImprovedPrompt}
          >
            <RotateCcw size={15} strokeWidth={1.75} />
            {improvedPromptCopy.resetButton}
          </button>
        </div>
      </div>
    </section>
  );
}
