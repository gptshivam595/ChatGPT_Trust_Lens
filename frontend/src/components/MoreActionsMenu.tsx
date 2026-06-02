import { MoreHorizontal } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { finalAnswerCopy } from "../data/trustLensCopy";

interface MoreActionsMenuProps {
  recheckDisabled?: boolean;
  onAskAlternativeView: () => void;
  onCopyDraft: () => void;
  onStartRecheck: () => void;
}

export function MoreActionsMenu({
  recheckDisabled = false,
  onAskAlternativeView,
  onCopyDraft,
  onStartRecheck,
}: MoreActionsMenuProps) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    const handlePointerDown = (event: PointerEvent) => {
      if (!menuRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("pointerdown", handlePointerDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("pointerdown", handlePointerDown);
    };
  }, [open]);

  const actions = [
    {
      id: "recheck",
      label: finalAnswerCopy.moreActionsMenu[0],
      onClick: onStartRecheck,
      disabled: recheckDisabled,
    },
    {
      id: "copy",
      label: finalAnswerCopy.moreActionsMenu[1],
      onClick: onCopyDraft,
      disabled: false,
    },
    {
      id: "alternative",
      label: finalAnswerCopy.moreActionsMenu[2],
      onClick: onAskAlternativeView,
      disabled: false,
    },
  ];

  return (
    <div className="relative" ref={menuRef}>
      <button
        aria-expanded={open}
        aria-haspopup="menu"
        className="focus-ring inline-flex min-h-10 items-center gap-2 rounded-[8px] border border-tl-border bg-tl-surface px-3 text-sm font-semibold text-tl-text transition hover:bg-tl-panel"
        type="button"
        onClick={() => setOpen((value) => !value)}
      >
        <MoreHorizontal size={16} strokeWidth={1.75} />
        {finalAnswerCopy.moreActionsLabel}
      </button>

      {open ? (
        <div
          className="absolute bottom-12 right-0 z-20 w-56 rounded-[8px] border border-tl-border bg-tl-surface p-1 shadow-tl-soft"
          role="menu"
        >
          {actions.map((action) => (
            <button
              className="focus-ring block w-full rounded-[6px] px-3 py-2 text-left text-sm font-medium text-tl-text transition hover:bg-tl-panel disabled:cursor-not-allowed disabled:text-tl-text-soft disabled:hover:bg-transparent"
              disabled={action.disabled}
              key={action.id}
              role="menuitem"
              type="button"
              onClick={() => {
                action.onClick();
                setOpen(false);
              }}
            >
              {action.label}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
