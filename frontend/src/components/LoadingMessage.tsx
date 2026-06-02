import { LoaderCircle } from "lucide-react";

interface LoadingMessageProps {
  text: string;
  detail?: string;
}

export function LoadingMessage({ text, detail }: LoadingMessageProps) {
  return (
    <section
      aria-live="polite"
      className="flex items-start gap-3 rounded-[10px] border border-tl-border bg-tl-panel px-4 py-3 text-sm leading-6 text-tl-text-muted"
    >
      <LoaderCircle
        aria-hidden="true"
        className="mt-1 shrink-0 animate-spin text-tl-accent motion-reduce:animate-none"
        size={18}
        strokeWidth={1.75}
      />
      <div>
        <p className="font-medium text-tl-text">{text}</p>
        {detail ? <p className="mt-1">{detail}</p> : null}
      </div>
    </section>
  );
}
