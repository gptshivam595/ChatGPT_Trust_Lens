import { AudioLines, ChevronDown, Mic, Plus, SendHorizontal } from "lucide-react";
import { useEffect, useRef } from "react";

interface ComposerProps {
  disabled?: boolean;
  initial?: boolean;
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
}

export function Composer({
  disabled = false,
  initial = false,
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
    <footer
      className={
        initial
          ? "composer-floating px-3 sm:px-5"
          : "shrink-0 bg-tl-bg px-3 pb-4 pt-2 sm:px-5"
      }
    >
      <form
        className="mx-auto flex min-h-[72px] max-w-[964px] items-center gap-2 rounded-full border border-tl-border bg-tl-surface px-5 py-2 shadow-tl-composer transition focus-within:border-tl-border-strong"
        onSubmit={(event) => {
          event.preventDefault();
          onSubmit();
        }}
      >
        <button
          aria-label="Add attachment"
          className="focus-ring inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-tl-text transition hover:bg-tl-surface-muted"
          disabled={disabled}
          title="Add attachment"
          type="button"
        >
          <Plus size={24} strokeWidth={1.75} />
        </button>

        <label className="sr-only" htmlFor="trust-lens-composer">
          Message
        </label>
        <textarea
          ref={textareaRef}
          className="min-h-10 flex-1 resize-none bg-transparent px-1 py-2 text-[18px] leading-6 text-tl-text outline-none placeholder:text-tl-text-soft"
          id="trust-lens-composer"
          disabled={disabled}
          placeholder={disabled ? "New chat starts another prompt..." : "Ask anything"}
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
          aria-label="Thinking mode"
          className="focus-ring hidden h-10 shrink-0 items-center gap-1 rounded-full px-2 text-base text-tl-text-soft transition hover:bg-tl-surface-muted hover:text-tl-text sm:inline-flex"
          disabled={disabled}
          type="button"
        >
          Thinking
          <ChevronDown size={17} strokeWidth={1.75} />
        </button>
        <button
          aria-label="Voice input"
          className="focus-ring inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-tl-text transition hover:bg-tl-surface-muted"
          disabled={disabled}
          title="Voice input"
          type="button"
        >
          <Mic size={22} strokeWidth={1.9} />
        </button>
        <button
          aria-label="Send message"
          className="focus-ring inline-flex h-[46px] w-[46px] shrink-0 items-center justify-center rounded-full bg-black text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:bg-black disabled:text-white"
          disabled={!canSubmit}
          type="submit"
        >
          {value.trim().length > 0 ? (
            <SendHorizontal size={19} strokeWidth={1.8} />
          ) : (
            <AudioLines size={22} strokeWidth={2} />
          )}
        </button>
      </form>
    </footer>
  );
}
