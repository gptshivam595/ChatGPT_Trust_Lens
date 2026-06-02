import { ChevronDown, Menu, ShieldCheck } from "lucide-react";

const iconProps = {
  size: 18,
  strokeWidth: 1.75,
} as const;

interface TopBarProps {
  onModelClick: () => void;
  onOpenSidebar: () => void;
}

export function TopBar({ onModelClick, onOpenSidebar }: TopBarProps) {
  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b border-tl-border bg-tl-surface/95 px-3 sm:px-5">
      <div className="flex min-w-0 items-center gap-2">
        <button
          aria-label="Open sidebar"
          className="focus-ring inline-flex h-9 w-9 items-center justify-center rounded-[8px] text-tl-text-muted transition hover:bg-tl-surface-muted hover:text-tl-text lg:hidden"
          type="button"
          onClick={onOpenSidebar}
        >
          <Menu {...iconProps} />
        </button>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-tl-text">ChatGPT</p>
          <div className="mt-0.5 flex items-center gap-1.5 text-xs text-tl-text-muted sm:hidden">
            <ShieldCheck size={14} strokeWidth={1.75} />
            <span>Trust Lens enabled</span>
          </div>
        </div>
      </div>

      <div className="flex min-w-0 items-center gap-2">
        <div className="hidden items-center gap-1.5 rounded-full border border-tl-border bg-tl-panel px-2.5 py-1 text-xs font-medium text-tl-text-muted sm:flex">
          <ShieldCheck size={14} strokeWidth={1.75} />
          Trust Lens enabled
        </div>
        <button
          className="focus-ring inline-flex h-9 items-center gap-1.5 rounded-[8px] border border-tl-border bg-tl-surface px-2.5 text-sm font-medium text-tl-text transition hover:border-tl-border-strong hover:bg-tl-panel"
          type="button"
          onClick={onModelClick}
        >
          GPT-5.5
          <ChevronDown size={16} strokeWidth={1.75} />
        </button>
      </div>
    </header>
  );
}
