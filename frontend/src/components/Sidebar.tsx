import {
  CircleHelp,
  Images,
  MessageSquare,
  Plus,
  Search,
  Sparkles,
  SquarePen,
} from "lucide-react";

const iconProps = {
  size: 21,
  strokeWidth: 1.8,
} as const;

interface SidebarProps {
  onClose: () => void;
  onHistoryClick: () => void;
  onNewChat: () => void;
  onSettingsClick: () => void;
}

export function Sidebar({
  onHistoryClick,
  onNewChat,
  onSettingsClick,
}: SidebarProps) {
  const navItems = [
    { label: "New chat", icon: SquarePen, onClick: onNewChat },
    { label: "Search", icon: Search, onClick: onHistoryClick },
    { label: "Chats", icon: MessageSquare, onClick: onHistoryClick },
    { label: "Library", icon: Images, onClick: onHistoryClick },
  ];

  return (
    <div className="flex h-full min-h-0 flex-col items-center px-2 py-4">
      <button
        aria-label="Trust Lens home"
        className="focus-ring mb-8 inline-flex h-10 w-10 items-center justify-center rounded-full text-tl-text transition hover:bg-tl-surface-muted"
        title="Trust Lens home"
        type="button"
        onClick={onNewChat}
      >
        <Sparkles {...iconProps} />
      </button>

      <nav aria-label="Workspace navigation" className="flex flex-1 flex-col gap-2">
        {navItems.map((item) => {
          const Icon = item.icon;

          return (
            <button
              aria-label={item.label}
              className="focus-ring inline-flex h-10 w-10 items-center justify-center rounded-full text-tl-text transition hover:bg-tl-surface-muted"
              key={item.label}
              title={item.label}
              type="button"
              onClick={item.onClick}
            >
              <Icon {...iconProps} />
            </button>
          );
        })}
      </nav>

      <div className="flex flex-col items-center gap-3">
        <button
          aria-label="Help"
          className="focus-ring inline-flex h-10 w-10 items-center justify-center rounded-full text-tl-text transition hover:bg-tl-surface-muted"
          title="Help"
          type="button"
          onClick={onSettingsClick}
        >
          <CircleHelp {...iconProps} />
        </button>
        <button
          aria-label="New chat"
          className="focus-ring inline-flex h-10 w-10 items-center justify-center rounded-full bg-red-500 text-white shadow-sm transition hover:bg-red-600"
          title="New chat"
          type="button"
          onClick={onNewChat}
        >
          <Plus size={20} strokeWidth={2} />
        </button>
      </div>
    </div>
  );
}
