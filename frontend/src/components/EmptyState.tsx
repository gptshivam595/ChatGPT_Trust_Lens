import { Network } from "lucide-react";

interface EmptyStateProps {
  onUseSamplePrompt: () => void;
}

export function EmptyState({ onUseSamplePrompt }: EmptyStateProps) {
  return (
    <section className="flex flex-1 items-center justify-center pb-36 pt-8">
      <div className="w-full text-center">
        <h1 className="text-[29px] font-normal leading-10 text-black sm:text-[30px]">
          What&apos;s on your mind today?
        </h1>

        <button
          className="focus-ring mt-56 inline-flex min-h-12 items-center gap-2 rounded-full border border-tl-border bg-tl-surface px-4 py-2 text-base font-semibold text-black shadow-sm transition hover:bg-tl-surface-muted max-sm:mt-44"
          type="button"
          onClick={onUseSamplePrompt}
        >
          <Network size={20} strokeWidth={1.8} />
          Company knowledge
        </button>

        <p className="pointer-events-none fixed bottom-3 left-0 right-0 mx-auto max-w-[860px] px-4 text-center text-sm leading-5 text-tl-text-muted lg:left-16">
          Trust Lens can make mistakes. Company knowledge and AI output should be
          checked before you act.
        </p>
      </div>
    </section>
  );
}
