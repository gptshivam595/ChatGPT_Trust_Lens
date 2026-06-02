import { recheckCopy } from "../data/trustLensCopy";

interface RecheckSummaryProps {
  onAddMissingContext: () => void;
  onOpenClaims: () => void;
  onViewHighlightedOutput: () => void;
}

const rows = [
  { label: "Supported", value: 1 },
  { label: "Needs verification", value: 2 },
  { label: "Assumption/inference", value: 1 },
  { label: "Conflicting evidence", value: 0 },
];

export function RecheckSummary({
  onAddMissingContext,
  onOpenClaims,
  onViewHighlightedOutput,
}: RecheckSummaryProps) {
  return (
    <section className="rounded-[10px] border border-tl-border bg-tl-surface px-4 py-4 shadow-sm">
      <h2 className="text-lg font-semibold leading-7 text-tl-text">
        {recheckCopy.summaryTitle}
      </h2>
      <p className="mt-2 text-sm leading-6 text-tl-text-muted">
        {recheckCopy.summaryText}
      </p>

      <dl className="mt-4 grid gap-2 sm:grid-cols-2">
        {rows.map((row) => (
          <div
            className="flex items-center justify-between gap-3 rounded-[8px] border border-tl-border bg-tl-panel px-3 py-2"
            key={row.label}
          >
            <dt className="text-sm font-medium text-tl-text-muted">{row.label}</dt>
            <dd className="text-sm font-semibold text-tl-text">{row.value}</dd>
          </div>
        ))}
      </dl>

      <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
        <button
          className="focus-ring inline-flex min-h-10 items-center justify-center rounded-[8px] bg-tl-accent px-3.5 text-sm font-semibold text-tl-accent-ink transition hover:brightness-95"
          type="button"
          onClick={onOpenClaims}
        >
          {recheckCopy.openClaimsButton}
        </button>
        <button
          className="focus-ring inline-flex min-h-10 items-center justify-center rounded-[8px] border border-tl-border bg-tl-panel px-3.5 text-sm font-semibold text-tl-text transition hover:bg-tl-surface"
          type="button"
          onClick={onViewHighlightedOutput}
        >
          {recheckCopy.viewHighlightedOutputButton}
        </button>
        <button
          className="focus-ring inline-flex min-h-10 items-center justify-center rounded-[8px] border border-tl-border bg-tl-panel px-3.5 text-sm font-semibold text-tl-text transition hover:bg-tl-surface"
          type="button"
          onClick={onAddMissingContext}
        >
          {recheckCopy.addMissingContextButton}
        </button>
      </div>
    </section>
  );
}
