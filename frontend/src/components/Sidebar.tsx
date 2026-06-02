import {
  MessageSquare,
  PanelLeftClose,
  Plus,
  Settings,
  UserCircle,
} from "lucide-react";
import { sidebarHistoryItems } from "../data/trustLensCopy";

const iconProps = {
  size: 18,
  strokeWidth: 1.75,
} as const;

interface SidebarProps {
  onClose: () => void;
  onHistoryClick: () => void;
  onNewChat: () => void;
  onSettingsClick: () => void;
}

export function Sidebar({
  onClose,
  onHistoryClick,
  onNewChat,
  onSettingsClick,
}: SidebarProps) {
  return (
    <div className="flex h-full min-h-0 flex-col px-3 py-4">
      <div className="mb-4 flex items-center justify-between gap-3 px-2">
        <div className="min-w-0">
          <p className="text-sm font-semibold leading-5 text-tl-accent-ink">ChatGPT</p>
          <p className="mt-1 inline-flex rounded-full border border-tl-accent-ink/20 bg-tl-accent-ink/10 px-2 py-0.5 text-[11px] font-medium leading-4 text-tl-accent-ink/80">
            Trust Lens Prototype
          </p>
        </div>
        <button
          aria-label="Close sidebar"
          className="focus-ring inline-flex h-9 w-9 items-center justify-center rounded-[8px] text-tl-accent-ink/70 transition hover:bg-tl-accent-ink/10 hover:text-tl-accent-ink lg:hidden"
          type="button"
          onClick={onClose}
        >
          <PanelLeftClose {...iconProps} />
        </button>
      </div>

      <button
        className="focus-ring mb-4 inline-flex h-10 items-center gap-2 rounded-[8px] border border-tl-accent-ink/20 bg-tl-accent-ink/10 px-3 text-sm font-medium text-tl-accent-ink transition hover:bg-tl-accent-ink/20"
        type="button"
        onClick={onNewChat}
      >
        <Plus {...iconProps} />
        New chat
      </button>

      <nav aria-label="Mock chat history" className="min-h-0 flex-1 overflow-y-auto">
        <p className="px-2 pb-2 text-xs font-medium uppercase leading-4 text-tl-accent-ink/50">
          Recent
        </p>
        <div className="space-y-1">
          {sidebarHistoryItems.map((item) => (
            <button
              className="focus-ring flex w-full items-center gap-2 rounded-[8px] px-2 py-2 text-left text-sm leading-5 text-tl-accent-ink/70 transition hover:bg-tl-accent-ink/10 hover:text-tl-accent-ink"
              key={item}
              type="button"
              onClick={onHistoryClick}
            >
              <MessageSquare {...iconProps} />
              <span className="truncate">{item}</span>
            </button>
          ))}
        </div>
      </nav>

      <button
        className="focus-ring mt-4 flex w-full items-center gap-3 rounded-[8px] border-t border-tl-accent-ink/10 px-2 py-3 text-left text-sm text-tl-accent-ink/75 transition hover:bg-tl-accent-ink/10 hover:text-tl-accent-ink"
        type="button"
        onClick={onSettingsClick}
      >
        <UserCircle size={24} strokeWidth={1.75} />
        <span className="min-w-0 flex-1">
          <span className="block truncate font-medium">You</span>
          <span className="block truncate text-xs text-tl-accent-ink/50">Settings</span>
        </span>
        <Settings {...iconProps} />
      </button>
    </div>
  );
}
