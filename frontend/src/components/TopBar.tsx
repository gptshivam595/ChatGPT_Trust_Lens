import { CircleDashed, Menu } from "lucide-react";

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
    <header className="flex h-14 shrink-0 items-center justify-between bg-tl-bg px-3 sm:px-5">
      <div className="flex min-w-0 items-center gap-2">
        <button
          aria-label="Open sidebar"
          className="focus-ring inline-flex h-9 w-9 items-center justify-center rounded-full text-tl-text-muted transition hover:bg-tl-surface-muted hover:text-tl-text lg:hidden"
          type="button"
          onClick={onOpenSidebar}
        >
          <Menu {...iconProps} />
        </button>
        <div className="min-w-0 lg:hidden">
          <p className="truncate text-sm font-semibold text-tl-text">Trust Lens</p>
        </div>
      </div>

      <button
        aria-label="Workspace status"
        className="focus-ring inline-flex h-9 w-9 items-center justify-center rounded-full text-tl-text transition hover:bg-tl-surface-muted"
        type="button"
        onClick={onModelClick}
      >
        <CircleDashed size={21} strokeWidth={1.75} />
      </button>
    </header>
  );
}
