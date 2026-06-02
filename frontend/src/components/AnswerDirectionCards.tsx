import { CheckCircle2 } from "lucide-react";
import { directionCopy } from "../data/trustLensCopy";
import type { AnswerDirection, AnswerDirectionId } from "../state/appTypes";

interface AnswerDirectionCardsProps {
  directions: AnswerDirection[];
  onSelectDirection: (directionId: AnswerDirectionId) => void;
}

export function AnswerDirectionCards({
  directions,
  onSelectDirection,
}: AnswerDirectionCardsProps) {
  return (
    <section className="rounded-[10px] border border-tl-border bg-tl-surface">
      <div className="border-b border-tl-border px-4 py-4 sm:px-5">
        <h2 className="text-lg font-semibold leading-7 text-tl-text">
          {directionCopy.title}
        </h2>
        <p className="mt-1 max-w-[68ch] text-sm leading-6 text-tl-text-muted">
          {directionCopy.subtitle}
        </p>
      </div>

      <div className="grid gap-3 px-4 py-4 sm:px-5 lg:grid-cols-3">
        {directions.map((direction) => (
          <article
            className={[
              "flex min-h-[260px] flex-col rounded-[8px] border bg-tl-panel p-4 transition duration-tl-fast hover:-translate-y-px hover:bg-tl-surface",
              direction.recommended
                ? "border-tl-accent shadow-sm"
                : "border-tl-border hover:border-tl-border-strong",
            ].join(" ")}
            key={direction.id}
          >
            <div className="flex items-start justify-between gap-3">
              <h3 className="text-base font-semibold leading-6 text-tl-text">
                {direction.title}
              </h3>
              {direction.recommended ? (
                <CheckCircle2
                  className="shrink-0 text-tl-accent"
                  size={18}
                  strokeWidth={1.75}
                />
              ) : null}
            </div>

            <p className="mt-2 w-fit rounded-full border border-tl-border bg-tl-surface px-2 py-0.5 text-xs font-semibold text-tl-text-muted">
              {direction.badge}
            </p>

            <p className="mt-4 text-sm font-semibold leading-5 text-tl-text">
              {direction.headline}
            </p>
            <p className="mt-2 flex-1 text-sm leading-6 text-tl-text-muted">
              {direction.description}
            </p>

            <button
              className="focus-ring mt-4 inline-flex min-h-10 items-center justify-center rounded-[8px] border border-tl-border bg-tl-surface px-3 text-sm font-semibold text-tl-text transition hover:bg-tl-panel"
              type="button"
              onClick={() => onSelectDirection(direction.id)}
            >
              {direction.cta}
            </button>
          </article>
        ))}
      </div>
    </section>
  );
}
