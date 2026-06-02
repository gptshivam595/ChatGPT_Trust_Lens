import { CheckCircle2, Circle, Loader2 } from "lucide-react";
import { recheckCopy } from "../data/trustLensCopy";
import type { RecheckStep } from "../state/appTypes";

interface RecheckProgressProps {
  steps: RecheckStep[];
  activeStepIndex: number;
}

export function RecheckProgress({ activeStepIndex, steps }: RecheckProgressProps) {
  const activeStep = steps[activeStepIndex] ?? steps[steps.length - 1];

  return (
    <section
      aria-live="polite"
      className="rounded-[10px] border border-tl-border bg-tl-panel px-4 py-4 shadow-sm"
    >
      <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold leading-7 text-tl-text">
            {recheckCopy.title}
          </h2>
          <p className="text-sm leading-5 text-tl-text-muted">
            Step {activeStepIndex + 1} of {steps.length}: {activeStep?.label}
          </p>
        </div>
      </div>

      <ol className="mt-4 space-y-2">
        {steps.map((step, index) => {
          const complete = index < activeStepIndex;
          const active = index === activeStepIndex;
          const stateLabel = complete ? "Complete" : active ? "Running" : "Pending";

          return (
            <li
              className="grid grid-cols-[1.5rem_minmax(0,1fr)] gap-2 rounded-[8px] border border-tl-border bg-tl-surface px-3 py-2"
              key={step.id}
            >
              <span
                aria-hidden="true"
                className="mt-0.5 flex h-5 w-5 items-center justify-center"
              >
                {complete ? (
                  <CheckCircle2
                    className="text-tl-source"
                    size={18}
                    strokeWidth={1.75}
                  />
                ) : active ? (
                  <Loader2
                    className="animate-spin text-tl-accent"
                    size={18}
                    strokeWidth={1.75}
                  />
                ) : (
                  <Circle className="text-tl-text-soft" size={18} strokeWidth={1.75} />
                )}
              </span>
              <span>
                <span className="flex flex-wrap items-center gap-2">
                  <span className="text-sm font-semibold leading-5 text-tl-text">
                    {step.label}
                  </span>
                  <span className="rounded-full bg-tl-panel px-2 py-0.5 text-xs font-semibold text-tl-text-muted">
                    {stateLabel}
                  </span>
                </span>
                <span className="mt-1 block text-sm leading-5 text-tl-text-muted">
                  {step.description}
                </span>
              </span>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
