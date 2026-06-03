import type { FocusEvent } from "react";
import type {
  HighlightDefinition,
  SourcePassage,
  TrustLensTab,
} from "../state/appTypes";

interface InlineHighlightProps {
  highlight: HighlightDefinition;
  active: boolean;
  source: SourcePassage | null;
  onAddToRecheck: () => void;
  onClear: () => void;
  onOpen: (highlightId: string) => void;
  onShowInTrustLens: (tab: TrustLensTab) => void;
}

const highlightStyles: Record<HighlightDefinition["kind"], string> = {
  source: "decoration-tl-source bg-tl-source-bg text-tl-text hover:bg-tl-source-bg",
  verify: "decoration-tl-verify bg-tl-verify-bg text-tl-text hover:bg-tl-verify-bg",
  assumption:
    "decoration-tl-assumption bg-tl-assumption-bg text-tl-text hover:bg-tl-assumption-bg",
  product_logic:
    "decoration-tl-assumption bg-tl-panel text-tl-text hover:bg-tl-assumption-bg",
};

export function InlineHighlight({
  highlight,
  active,
  source,
  onAddToRecheck,
  onClear,
  onOpen,
  onShowInTrustLens,
}: InlineHighlightProps) {
  const popoverId = `popover-${highlight.id}`;
  const sourcePageHref = highlight.sourceId
    ? `/source/${encodeURIComponent(highlight.sourceId)}`
    : null;

  const handleBlur = (event: FocusEvent<HTMLSpanElement>) => {
    if (!event.currentTarget.contains(event.relatedTarget)) {
      onClear();
    }
  };

  return (
    <span
      className="relative inline-flex"
      onBlur={handleBlur}
      onMouseEnter={() => onOpen(highlight.id)}
      onMouseLeave={onClear}
    >
      <button
        aria-controls={popoverId}
        aria-expanded={active}
        className={[
          "focus-ring inline rounded-[4px] px-1 py-0.5 text-left underline decoration-dotted decoration-2 underline-offset-4 transition",
          highlightStyles[highlight.kind],
        ].join(" ")}
        data-highlight-trigger={highlight.id}
        type="button"
        onFocus={() => onOpen(highlight.id)}
      >
        {highlight.text}
        <span className="ml-1 rounded-full border border-current/20 px-1.5 py-0.5 align-middle text-[10px] font-semibold leading-3">
          {highlight.label}
        </span>
      </button>

      {active ? (
        <span
          className="absolute left-0 top-full z-20 mt-2 w-[min(20rem,calc(100vw-2rem))] rounded-[8px] border border-tl-border bg-tl-surface p-3 text-left text-sm leading-5 text-tl-text shadow-tl-soft"
          id={popoverId}
          role="dialog"
        >
          <span className="block font-semibold">{highlight.tooltipTitle}</span>
          <span className="mt-1 block text-tl-text-muted">{highlight.tooltipBody}</span>
          {highlight.kind === "source" ? (
            <span className="mt-2 block text-xs font-medium text-tl-text-soft">
              Source: {source?.title ?? highlight.sourceId ?? "Linked source"}
              {source?.urlLabel ? (
                <span className="mt-0.5 block break-all font-mono">
                  {source.urlLabel}
                </span>
              ) : null}
            </span>
          ) : null}
          <span className="mt-3 flex flex-wrap gap-2">
            {highlight.kind === "source" && sourcePageHref ? (
              <a
                className="focus-ring rounded-[8px] bg-tl-accent px-2.5 py-1.5 text-xs font-semibold text-tl-accent-ink"
                href={sourcePageHref}
                rel="noopener noreferrer"
                target="_blank"
              >
                Open source page
              </a>
            ) : null}

            {highlight.kind === "assumption" ? (
              <button
                className="focus-ring rounded-[8px] bg-tl-accent px-2.5 py-1.5 text-xs font-semibold text-tl-accent-ink"
                type="button"
                onClick={() => onShowInTrustLens("assumptions")}
              >
                Show in Trust Lens
              </button>
            ) : null}

            {highlight.kind === "verify" || highlight.kind === "product_logic" ? (
              <button
                className="focus-ring rounded-[8px] bg-tl-accent px-2.5 py-1.5 text-xs font-semibold text-tl-accent-ink"
                type="button"
                onClick={onAddToRecheck}
              >
                Add to recheck queue
              </button>
            ) : null}
          </span>
        </span>
      ) : null}
    </span>
  );
}
