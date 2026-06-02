import { X } from "lucide-react";
import { trustLensCopy } from "../data/trustLensCopy";
import type { AppState, TrustLensTab } from "../state/appTypes";
import { TrustLensDecisionBar } from "./TrustLensDecisionBar";
import { TrustLensTabs } from "./TrustLensTabs";

interface TrustLensPanelProps {
  state: AppState;
  onAskAlternativeView: () => void;
  onClose: () => void;
  onOpenContextInput: () => void;
  onRegenerate: () => void;
  onSaveContext: () => void;
  onSetContextDraft: (value: string) => void;
  onStartRecheck: () => void;
  onTabChange: (tab: TrustLensTab) => void;
  onUseAsDraft: () => void;
  onVerifyFirst: () => void;
}

export function TrustLensPanel({
  state,
  onAskAlternativeView,
  onClose,
  onOpenContextInput,
  onRegenerate,
  onSaveContext,
  onSetContextDraft,
  onStartRecheck,
  onTabChange,
  onUseAsDraft,
  onVerifyFirst,
}: TrustLensPanelProps) {
  return (
    <section
      aria-label={trustLensCopy.ariaLabel}
      className="flex h-full min-h-0 flex-col bg-tl-surface text-tl-text"
    >
      <header className="border-b border-tl-border px-4 py-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold leading-7">{trustLensCopy.title}</h2>
            <p className="mt-1 text-sm leading-5 text-tl-text-muted">
              {trustLensCopy.subheader}
            </p>
          </div>
          <button
            aria-label="Close Trust Lens"
            className="focus-ring inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-[8px] text-tl-text-muted transition hover:bg-tl-panel hover:text-tl-text"
            type="button"
            onClick={onClose}
          >
            <X size={18} strokeWidth={1.75} />
          </button>
        </div>

        <div className="mt-3 inline-flex rounded-full border border-tl-verify/30 bg-tl-verify-bg px-2.5 py-1 text-xs font-semibold text-tl-text">
          {trustLensCopy.badge}
        </div>

        <div className="mt-4 rounded-[8px] border border-tl-border bg-tl-panel p-3">
          <p className="text-xs font-semibold uppercase leading-4 text-tl-text-soft">
            Summary
          </p>
          <p className="mt-2 text-sm leading-5 text-tl-text-muted">
            {trustLensCopy.summary}
          </p>
        </div>
      </header>

      <TrustLensTabs
        activeTab={state.activeTrustLensTab}
        alternatives={state.alternatives}
        alternativesRecommendation={state.alternativesRecommendation}
        assumptions={state.assumptions}
        claimsAfterRecheck={state.claimsAfterRecheck}
        claimsBeforeRecheck={state.claimsBeforeRecheck}
        contextDraft={state.addedContextDraft}
        contextInputOpen={state.contextInputOpen}
        missingContext={state.missingContext}
        qualitySignals={state.qualitySignals}
        recheckComplete={state.recheckComplete}
        recheckRunning={state.recheckStatus === "running"}
        onOpenContextInput={onOpenContextInput}
        onSaveContext={onSaveContext}
        onSetContextDraft={onSetContextDraft}
        onStartRecheck={onStartRecheck}
        onTabChange={onTabChange}
      />

      <TrustLensDecisionBar
        onAskAlternativeView={onAskAlternativeView}
        onOpenContextInput={onOpenContextInput}
        onRegenerate={onRegenerate}
        onUseAsDraft={onUseAsDraft}
        onVerifyFirst={onVerifyFirst}
      />
    </section>
  );
}
