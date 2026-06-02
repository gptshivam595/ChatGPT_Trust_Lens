import { X } from "lucide-react";
import { useEffect, useRef, type KeyboardEvent } from "react";
import { toastMessages } from "../data/trustLensCopy";
import type { SourcePassage } from "../state/appTypes";

interface SourcePassageModalProps {
  source: SourcePassage | null;
  onClose: () => void;
}

const focusableSelector = [
  "button:not([disabled])",
  "a[href]",
  "textarea:not([disabled])",
  "input:not([disabled])",
  "select:not([disabled])",
  "[tabindex]:not([tabindex='-1'])",
].join(",");

function renderPassage(source: SourcePassage) {
  const sentenceIndex = source.passage.indexOf(source.highlightedSentence);

  if (sentenceIndex < 0) {
    return (
      <mark className="rounded-[6px] bg-tl-source-bg px-1 text-tl-text">
        {source.passage}
      </mark>
    );
  }

  const before = source.passage.slice(0, sentenceIndex);
  const after = source.passage.slice(sentenceIndex + source.highlightedSentence.length);

  return (
    <>
      {before}
      <mark className="rounded-[6px] bg-tl-source-bg px-1 text-tl-text">
        {source.highlightedSentence}
      </mark>
      {after}
    </>
  );
}

export function SourcePassageModal({ source, onClose }: SourcePassageModalProps) {
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);
  const descriptionId = source
    ? "source-passage-modal-description"
    : "source-passage-modal-fallback";

  useEffect(() => {
    closeButtonRef.current?.focus();
  }, []);

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Escape") {
      event.preventDefault();
      onClose();
      return;
    }

    if (event.key !== "Tab") {
      return;
    }

    const focusableElements = Array.from(
      dialogRef.current?.querySelectorAll<HTMLElement>(focusableSelector) ?? [],
    );

    if (focusableElements.length === 0) {
      return;
    }

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    if (event.shiftKey && document.activeElement === firstElement) {
      event.preventDefault();
      lastElement.focus();
      return;
    }

    if (!event.shiftKey && document.activeElement === lastElement) {
      event.preventDefault();
      firstElement.focus();
    }
  };

  return (
    <div className="fixed inset-0 z-modal px-3 py-4 sm:px-6 sm:py-8">
      <button
        aria-label="Close source passage"
        className="absolute inset-0 cursor-default bg-tl-text/25"
        type="button"
        onClick={onClose}
      />
      <div
        aria-describedby={descriptionId}
        aria-labelledby="source-passage-modal-title"
        aria-modal="true"
        className="relative mx-auto flex max-h-[calc(100dvh-2rem)] w-full max-w-2xl flex-col overflow-hidden rounded-[10px] border border-tl-border bg-tl-surface text-tl-text shadow-tl-soft sm:max-h-[calc(100dvh-4rem)]"
        ref={dialogRef}
        role="dialog"
        onKeyDown={handleKeyDown}
      >
        <header className="flex items-start justify-between gap-3 border-b border-tl-border px-4 py-4">
          <div>
            <h2
              className="text-lg font-semibold leading-7"
              id="source-passage-modal-title"
            >
              Source passage
            </h2>
            <p className="mt-1 text-sm leading-5 text-tl-text-muted">
              Source-backed labels support a specific claim, not the full answer.
            </p>
          </div>
          <button
            aria-label="Close source passage"
            className="focus-ring inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-[8px] text-tl-text-muted transition hover:bg-tl-panel hover:text-tl-text"
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
          >
            <X size={18} strokeWidth={1.75} />
          </button>
        </header>

        <div className="min-h-0 overflow-y-auto px-4 py-4">
          {source ? (
            <div id={descriptionId}>
              <p className="text-sm font-semibold leading-5 text-tl-text">
                {source.title}
              </p>
              <p className="mt-1 break-all font-mono text-xs leading-5 text-tl-text-soft">
                {source.urlLabel}
              </p>
              <p className="mt-4 rounded-[8px] border border-tl-border bg-tl-panel p-3 text-base leading-7 text-tl-text">
                {renderPassage(source)}
              </p>
            </div>
          ) : (
            <p
              className="rounded-[8px] border border-tl-border bg-tl-panel p-3 text-sm leading-6 text-tl-text-muted"
              id={descriptionId}
            >
              {toastMessages.sourceUnavailable}
            </p>
          )}
        </div>

        <footer className="border-t border-tl-border px-4 py-3">
          <button
            className="focus-ring inline-flex min-h-10 items-center justify-center rounded-[8px] bg-tl-accent px-3.5 text-sm font-semibold text-tl-accent-ink transition hover:brightness-95"
            type="button"
            onClick={onClose}
          >
            Back to output
          </button>
        </footer>
      </div>
    </div>
  );
}
