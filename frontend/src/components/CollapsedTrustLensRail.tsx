import { PanelRightOpen } from "lucide-react";

interface CollapsedTrustLensRailProps {
  onOpen: () => void;
}

export function CollapsedTrustLensRail({ onOpen }: CollapsedTrustLensRailProps) {
  return (
    <button
      aria-label="Open Trust Lens"
      className="focus-ring flex h-full min-h-12 w-full items-center justify-center gap-2 bg-tl-panel px-2 py-3 text-sm font-semibold text-tl-text transition hover:bg-tl-surface lg:[writing-mode:vertical-rl]"
      type="button"
      onClick={onOpen}
    >
      <PanelRightOpen size={17} strokeWidth={1.75} />
      Trust Lens
    </button>
  );
}
