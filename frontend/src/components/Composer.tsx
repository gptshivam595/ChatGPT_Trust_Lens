import { SendHorizontal } from "lucide-react";
import { useEffect, useRef } from "react";

interface ComposerProps {
  disabled?: boolean;
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
}

export function Composer({
  disabled = false,
  value,
  onChange,
  onSubmit,
}: ComposerProps) {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const canSubmit = value.trim().length > 0 && !disabled;

  useEffect(() => {
    const textarea = textareaRef.current;

    if (!textarea) {
      return;
    }

    textarea.style.height = "auto";
    textarea.style.height = `${Math.min(textarea.scrollHeight, 168)}px`;
  }, [value]);

  return (
    <footer className="shrink-0 border-t border-tl-border bg-tl-bg px-3 py-3 sm:px-5">
      <form
        className="mx-auto flex max-w-[760px] items-end gap-2 rounded-[10px] border border-tl-border bg-tl-surface p-2 shadow-sm transition focus-within:border-tl-focus"
        onSubmit={(event) => {
          event.preventDefault();
          onSubmit();
        }}
      >
        <label className="sr-only" htmlFor="trust-lens-composer">
          Message
        </label>
        <textarea
          ref={textareaRef}
          className="min-h-11 flex-1 resize-none bg-transparent px-2 py-2.5 text-base leading-6 text-tl-text outline-none placeholder:text-tl-text-soft"
          id="trust-lens-composer"
          disabled={disabled}
          placeholder={
            disabled
              ? "New chat starts another prompt..."
              : "Ask anything, or paste a task you want help evaluating..."
          }
          rows={1}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          onKeyDown={(event) => {
            if (disabled || event.key !== "Enter" || event.shiftKey) {
              return;
            }

            event.preventDefault();
            onSubmit();
          }}
        />
        <button
          aria-label="Send message"
          className="focus-ring inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-[8px] bg-tl-accent text-tl-accent-ink transition hover:brightness-95 disabled:cursor-not-allowed disabled:bg-tl-surface-muted disabled:text-tl-text-soft"
          disabled={!canSubmit}
          type="submit"
        >
          <SendHorizontal size={18} strokeWidth={1.75} />
        </button>
      </form>
    </footer>
  );
}
