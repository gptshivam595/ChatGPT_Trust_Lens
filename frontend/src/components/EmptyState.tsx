import { ArrowRight, FileSearch, Layers3, Sparkles } from "lucide-react";
import { emptyStateCopy } from "../data/trustLensMockData";

const icons = {
  "prompt-readiness": FileSearch,
  "answer-direction": Layers3,
  "output-review": Sparkles,
} as const;

interface EmptyStateProps {
  onUseSamplePrompt: () => void;
}

export function EmptyState({ onUseSamplePrompt }: EmptyStateProps) {
  return (
    <section className="flex flex-1 items-center py-8">
      <div className="w-full">
        <div className="mx-auto max-w-[700px] text-center">
          <h1 className="text-2xl font-semibold leading-8 text-tl-text sm:text-3xl sm:leading-[38px]">
            {emptyStateCopy.title}
          </h1>
          <p className="mx-auto mt-3 max-w-[68ch] text-sm leading-6 text-tl-text-muted sm:text-base">
            {emptyStateCopy.subtitle}
          </p>
        </div>

        <div className="mt-8 grid gap-3 sm:grid-cols-3">
          {emptyStateCopy.capabilities.map((capability) => {
            const iconId = capability.id ?? "prompt-readiness";
            const Icon = icons[iconId as keyof typeof icons];

            return (
              <div
                className="rounded-[8px] border border-tl-border bg-tl-surface px-4 py-4 text-left"
                key={capability.id}
              >
                <div className="mb-3 inline-flex h-8 w-8 items-center justify-center rounded-[6px] bg-tl-surface-muted text-tl-accent">
                  <Icon size={17} strokeWidth={1.75} />
                </div>
                <h2 className="text-sm font-semibold leading-5 text-tl-text">
                  {capability.title}
                </h2>
                <p className="mt-1.5 text-sm leading-5 text-tl-text-muted">
                  {capability.description}
                </p>
              </div>
            );
          })}
        </div>

        <div className="mt-7 flex justify-center">
          <button
            className="focus-ring inline-flex min-h-11 items-center gap-2 rounded-[8px] bg-tl-accent px-4 py-2.5 text-sm font-semibold text-tl-accent-ink transition hover:brightness-95 active:translate-y-px"
            type="button"
            onClick={onUseSamplePrompt}
          >
            {emptyStateCopy.samplePromptButton}
            <ArrowRight size={17} strokeWidth={1.75} />
          </button>
        </div>
      </div>
    </section>
  );
}
