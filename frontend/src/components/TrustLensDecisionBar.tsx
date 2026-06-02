import {
  FileCheck2,
  MessageSquarePlus,
  RefreshCw,
  SearchCheck,
  ShieldCheck,
} from "lucide-react";

interface TrustLensDecisionBarProps {
  onAskAlternativeView: () => void;
  onOpenContextInput: () => void;
  onRegenerate: () => void;
  onUseAsDraft: () => void;
  onVerifyFirst: () => void;
}

const iconProps = { size: 15, strokeWidth: 1.75 } as const;

export function TrustLensDecisionBar({
  onAskAlternativeView,
  onOpenContextInput,
  onRegenerate,
  onUseAsDraft,
  onVerifyFirst,
}: TrustLensDecisionBarProps) {
  const actions = [
    {
      id: "draft",
      label: "Use as draft",
      icon: FileCheck2,
      onClick: onUseAsDraft,
    },
    {
      id: "context",
      label: "Add context",
      icon: MessageSquarePlus,
      onClick: onOpenContextInput,
    },
    {
      id: "verify",
      label: "Verify first",
      icon: SearchCheck,
      onClick: onVerifyFirst,
    },
    {
      id: "alternative",
      label: "Ask alternative view",
      icon: ShieldCheck,
      onClick: onAskAlternativeView,
    },
    {
      id: "regenerate",
      label: "Regenerate",
      icon: RefreshCw,
      onClick: onRegenerate,
    },
  ];

  return (
    <div className="border-t border-tl-border bg-tl-surface p-3">
      <div className="grid grid-cols-2 gap-2">
        {actions.map((action) => {
          const Icon = action.icon;

          return (
            <button
              className="focus-ring inline-flex min-h-10 items-center justify-center gap-1.5 rounded-[8px] border border-tl-border bg-tl-panel px-2 text-xs font-semibold text-tl-text transition hover:border-tl-border-strong hover:bg-tl-surface"
              key={action.id}
              type="button"
              onClick={action.onClick}
            >
              <Icon {...iconProps} />
              <span>{action.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
