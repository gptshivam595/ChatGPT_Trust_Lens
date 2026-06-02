import { CheckCircle2 } from "lucide-react";
import type { ToastMessage } from "../state/appTypes";

interface ToastProps {
  toast: ToastMessage | null;
}

export function Toast({ toast }: ToastProps) {
  return (
    <div
      aria-live="polite"
      className="pointer-events-none fixed bottom-4 left-1/2 z-toast w-[calc(100%-2rem)] max-w-sm -translate-x-1/2 sm:left-auto sm:right-4 sm:translate-x-0"
    >
      {toast ? (
        <div className="flex items-start gap-2 rounded-[8px] border border-tl-border bg-tl-surface px-3 py-2.5 text-sm leading-5 text-tl-text shadow-tl-soft">
          <CheckCircle2
            className="mt-0.5 shrink-0 text-tl-source"
            size={17}
            strokeWidth={1.75}
          />
          <span>{toast.message}</span>
        </div>
      ) : null}
    </div>
  );
}
