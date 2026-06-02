import type {
  AlternativeItem,
  AssumptionItem,
  ClaimItem,
  MissingContextItem,
  QualitySignal,
  TrustLensTab,
} from "../state/appTypes";

interface TrustLensTabsProps {
  activeTab: TrustLensTab;
  alternatives: AlternativeItem[];
  alternativesRecommendation: string;
  assumptions: AssumptionItem[];
  claimsAfterRecheck: ClaimItem[];
  claimsBeforeRecheck: ClaimItem[];
  contextInputOpen: boolean;
  contextDraft: string;
  missingContext: MissingContextItem[];
  qualitySignals: QualitySignal[];
  recheckComplete: boolean;
  recheckRunning: boolean;
  onOpenContextInput: () => void;
  onSaveContext: () => void;
  onSetContextDraft: (value: string) => void;
  onStartRecheck: () => void;
  onTabChange: (tab: TrustLensTab) => void;
}

const tabs: { id: TrustLensTab; label: string }[] = [
  { id: "quality", label: "Quality" },
  { id: "assumptions", label: "Assumptions" },
  { id: "missing_context", label: "Missing Context" },
  { id: "claims", label: "Claims" },
  { id: "alternatives", label: "Alternatives" },
];

const statusTone: Record<string, string> = {
  Supported: "bg-tl-source-bg text-tl-text",
  "Needs verification": "bg-tl-verify-bg text-tl-text",
  "Conflicting evidence": "bg-tl-conflict-bg text-tl-text",
  "No clear evidence found": "bg-tl-panel text-tl-text-muted",
  "Assumption/inference": "bg-tl-assumption-bg text-tl-text",
  "Plausible, needs testing": "bg-tl-verify-bg text-tl-text",
  Uncertain: "bg-tl-panel text-tl-text-muted",
};

export function TrustLensTabs({
  activeTab,
  alternatives,
  alternativesRecommendation,
  assumptions,
  claimsAfterRecheck,
  claimsBeforeRecheck,
  contextInputOpen,
  contextDraft,
  missingContext,
  qualitySignals,
  recheckComplete,
  recheckRunning,
  onOpenContextInput,
  onSaveContext,
  onSetContextDraft,
  onStartRecheck,
  onTabChange,
}: TrustLensTabsProps) {
  const claims = recheckComplete ? claimsAfterRecheck : claimsBeforeRecheck;

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div
        aria-label="Review categories"
        className="flex gap-1 overflow-x-auto border-b border-tl-border px-3 py-2"
        role="tablist"
      >
        {tabs.map((tab, index) => (
          <button
            aria-controls={`trust-lens-panel-${tab.id}`}
            aria-selected={activeTab === tab.id}
            className={[
              "focus-ring whitespace-nowrap rounded-[8px] px-2.5 py-1.5 text-xs font-semibold transition",
              activeTab === tab.id
                ? "bg-tl-text text-tl-accent-ink"
                : "text-tl-text-muted hover:bg-tl-panel hover:text-tl-text",
            ].join(" ")}
            id={`trust-lens-tab-${tab.id}`}
            key={tab.id}
            role="tab"
            tabIndex={activeTab === tab.id ? 0 : -1}
            type="button"
            onClick={() => onTabChange(tab.id)}
            onKeyDown={(event) => {
              if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") {
                return;
              }

              event.preventDefault();
              const direction = event.key === "ArrowRight" ? 1 : -1;
              const nextIndex = (index + direction + tabs.length) % tabs.length;
              onTabChange(tabs[nextIndex].id);
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto p-4">
        <div
          aria-labelledby={`trust-lens-tab-${activeTab}`}
          id={`trust-lens-panel-${activeTab}`}
          role="tabpanel"
          tabIndex={0}
        >
          {activeTab === "quality" ? (
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-tl-text">Quality signals</h3>
              <div className="divide-y divide-tl-border rounded-[8px] border border-tl-border bg-tl-surface">
                {qualitySignals.map((signal) => (
                  <div className="px-3 py-3" key={signal.id}>
                    <div className="flex items-start justify-between gap-3">
                      <p className="text-sm font-semibold text-tl-text">
                        {signal.label}
                      </p>
                      <span className="shrink-0 rounded-full bg-tl-panel px-2 py-0.5 text-xs font-semibold text-tl-text-muted">
                        {signal.value}
                      </span>
                    </div>
                    <p className="mt-1 text-sm leading-5 text-tl-text-muted">
                      {signal.description}
                    </p>
                  </div>
                ))}
              </div>
              <button
                className="focus-ring inline-flex min-h-10 items-center justify-center rounded-[8px] bg-tl-accent px-3 text-sm font-semibold text-tl-accent-ink transition hover:brightness-95 disabled:cursor-not-allowed disabled:bg-tl-surface-muted disabled:text-tl-text-soft"
                disabled={recheckRunning}
                type="button"
                onClick={onStartRecheck}
              >
                Recheck Output
              </button>
            </div>
          ) : null}

          {activeTab === "assumptions" ? (
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-tl-text">
                Assumptions and impact
              </h3>
              {assumptions.map((item) => (
                <div
                  className="rounded-[8px] border border-tl-border bg-tl-assumption-bg p-3"
                  key={item.id}
                >
                  <p className="text-sm font-semibold leading-5 text-tl-text">
                    {item.text}
                  </p>
                  <p className="mt-2 text-sm leading-5 text-tl-text-muted">
                    <span className="font-semibold text-tl-text">Impact: </span>
                    {item.impact}
                  </p>
                </div>
              ))}
            </div>
          ) : null}

          {activeTab === "missing_context" ? (
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-tl-text">Missing context</h3>
              {missingContext.map((item) => (
                <div
                  className="rounded-[8px] border border-tl-border bg-tl-surface p-3"
                  key={item.id}
                >
                  <p className="text-sm font-semibold leading-5 text-tl-text">
                    {item.context}
                  </p>
                  <p className="mt-2 text-sm leading-5 text-tl-text-muted">
                    {item.whyItMatters}
                  </p>
                  <button
                    className="focus-ring mt-3 inline-flex min-h-9 items-center justify-center rounded-[8px] border border-tl-border bg-tl-panel px-3 text-xs font-semibold text-tl-text transition hover:bg-tl-surface"
                    type="button"
                    onClick={onOpenContextInput}
                  >
                    Add context
                  </button>
                </div>
              ))}

              {contextInputOpen ? (
                <div className="rounded-[8px] border border-tl-border bg-tl-panel p-3">
                  <label
                    className="text-sm font-semibold text-tl-text"
                    htmlFor="trust-lens-context"
                  >
                    Added context
                  </label>
                  <textarea
                    className="focus-ring mt-2 min-h-24 w-full resize-y rounded-[10px] border border-tl-border bg-tl-surface px-3 py-2 text-sm leading-6 text-tl-text outline-none"
                    id="trust-lens-context"
                    value={contextDraft}
                    onChange={(event) => onSetContextDraft(event.target.value)}
                  />
                  <button
                    className="focus-ring mt-3 inline-flex min-h-9 items-center justify-center rounded-[8px] bg-tl-accent px-3 text-xs font-semibold text-tl-accent-ink transition hover:brightness-95"
                    type="button"
                    onClick={onSaveContext}
                  >
                    Save context
                  </button>
                </div>
              ) : null}
            </div>
          ) : null}

          {activeTab === "claims" ? (
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-tl-text">Claims to verify</h3>
              {recheckComplete ? (
                <p className="text-sm leading-5 text-tl-text-muted">
                  4 claims reviewed: 1 supported, 2 need verification, 1
                  assumption/inference, 0 conflicting evidence.
                </p>
              ) : null}
              {claims.map((claim) => (
                <div
                  className="rounded-[8px] border border-tl-border bg-tl-surface p-3"
                  key={claim.id}
                >
                  <p className="text-sm font-semibold leading-5 text-tl-text">
                    {claim.claim}
                  </p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <span className="rounded-full bg-tl-panel px-2 py-0.5 text-xs font-semibold text-tl-text-muted">
                      {claim.type}
                    </span>
                    <span
                      className={[
                        "rounded-full px-2 py-0.5 text-xs font-semibold",
                        statusTone[claim.evidenceStatus] ??
                          "bg-tl-panel text-tl-text-muted",
                      ].join(" ")}
                    >
                      {claim.evidenceStatus}
                    </span>
                  </div>
                  <p className="mt-2 text-sm leading-5 text-tl-text-muted">
                    {claim.whyVerify}
                  </p>
                  <p className="mt-2 text-xs font-semibold leading-5 text-tl-text">
                    Suggested action: {claim.suggestedAction}
                  </p>
                </div>
              ))}
            </div>
          ) : null}

          {activeTab === "alternatives" ? (
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-tl-text">
                Alternative perspectives
              </h3>
              {alternatives.map((item) => (
                <div
                  className="rounded-[8px] border border-tl-border bg-tl-surface p-3"
                  key={item.id}
                >
                  <p className="text-sm font-semibold leading-5 text-tl-text">
                    {item.perspective}
                  </p>
                  <p className="mt-2 text-sm leading-5 text-tl-text-muted">
                    {item.description}
                  </p>
                </div>
              ))}
              <div className="rounded-[8px] border border-tl-accent/30 bg-tl-assumption-bg p-3">
                <p className="text-xs font-semibold uppercase leading-4 text-tl-text-soft">
                  Recommendation
                </p>
                <p className="mt-2 text-sm leading-5 text-tl-text">
                  {alternativesRecommendation}
                </p>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
