import { FileSearch } from "lucide-react";
import { finalAnswerCopy, toastMessages } from "../data/trustLensCopy";
import type {
  FinalAnswerBlock,
  FinalAnswerSegment,
  HighlightDefinition,
  RecheckStatus,
  RecheckStep,
  SourcePassage,
  TrustLensTab,
} from "../state/appTypes";
import { InlineHighlight } from "./InlineHighlight";
import { MoreActionsMenu } from "./MoreActionsMenu";
import { RecheckProgress } from "./RecheckProgress";
import { RecheckSummary } from "./RecheckSummary";

interface FinalOutputProps {
  activeTooltipId: string | null;
  extraAssistantMessages: string[];
  finalAnswerBlocks: FinalAnswerBlock[];
  highlightDefinitions: HighlightDefinition[];
  recheckComplete: boolean;
  recheckProgressStep: number;
  recheckStatus: RecheckStatus;
  recheckSteps: RecheckStep[];
  sourcePassages: SourcePassage[];
  onAddMissingContextFromSummary: () => void;
  onAskAlternativeView: () => void;
  onClearActiveTooltip: () => void;
  onCopyDraft: () => void;
  onOpenClaimsFromSummary: () => void;
  onShowToast: (message: string) => void;
  onSetActiveTooltip: (highlightId: string) => void;
  onShowInTrustLens: (tab: TrustLensTab) => void;
  onStartRecheck: () => void;
  onViewHighlightedOutput: () => void;
}

function renderSegments(
  segments: FinalAnswerSegment[],
  props: Pick<
    FinalOutputProps,
    | "activeTooltipId"
    | "onClearActiveTooltip"
    | "onSetActiveTooltip"
    | "onShowInTrustLens"
    | "onShowToast"
  > & {
    highlightsById: Record<string, HighlightDefinition>;
    sourcesById: Record<string, SourcePassage>;
  },
) {
  return segments.map((segment, index) => {
    if (segment.type === "text") {
      return <span key={`${segment.text}-${index}`}>{segment.text}</span>;
    }

    const highlight = props.highlightsById[segment.highlightId];

    if (!highlight) {
      return <span key={segment.highlightId}>{segment.text}</span>;
    }

    return (
      <InlineHighlight
        active={props.activeTooltipId === highlight.id}
        highlight={highlight}
        key={highlight.id}
        source={highlight.sourceId ? props.sourcesById[highlight.sourceId] ?? null : null}
        onAddToRecheck={() => props.onShowToast(toastMessages.addToRecheck)}
        onClear={props.onClearActiveTooltip}
        onOpen={props.onSetActiveTooltip}
        onShowInTrustLens={props.onShowInTrustLens}
      />
    );
  });
}

function renderBlock(
  block: FinalAnswerBlock,
  props: Pick<
    FinalOutputProps,
    | "activeTooltipId"
    | "onClearActiveTooltip"
    | "onSetActiveTooltip"
    | "onShowInTrustLens"
    | "onShowToast"
  > & {
    highlightsById: Record<string, HighlightDefinition>;
    sourcesById: Record<string, SourcePassage>;
  },
) {
  switch (block.type) {
    case "heading":
      return (
        <h1 className="text-2xl font-semibold leading-8 text-tl-text" key={block.text}>
          {block.text}
        </h1>
      );
    case "paragraph":
      return (
        <p className="text-base leading-7 text-tl-text" key={block.segments[0]?.text}>
          {renderSegments(block.segments, props)}
        </p>
      );
    case "section":
      return (
        <section className="space-y-2" key={block.title}>
          <h2 className="text-lg font-semibold leading-7 text-tl-text">
            {block.title}
          </h2>
          <p className="text-base leading-7 text-tl-text">
            {renderSegments(block.segments, props)}
          </p>
        </section>
      );
    case "list":
      return (
        <ul className="list-disc space-y-2 pl-5" key={block.items.length}>
          {block.items.map((item, index) => (
            <li className="text-base leading-7 text-tl-text" key={index}>
              {renderSegments(item, props)}
            </li>
          ))}
        </ul>
      );
    default:
      return null;
  }
}

export function FinalOutput({
  activeTooltipId,
  extraAssistantMessages,
  finalAnswerBlocks,
  highlightDefinitions,
  recheckComplete,
  recheckProgressStep,
  recheckStatus,
  recheckSteps,
  sourcePassages,
  onAddMissingContextFromSummary,
  onAskAlternativeView,
  onClearActiveTooltip,
  onCopyDraft,
  onOpenClaimsFromSummary,
  onSetActiveTooltip,
  onShowInTrustLens,
  onShowToast,
  onStartRecheck,
  onViewHighlightedOutput,
}: FinalOutputProps) {
  const recheckRunning = recheckStatus === "running";
  const highlightsById = highlightDefinitions.reduce<
    Record<string, HighlightDefinition>
  >((lookup, highlight) => {
    lookup[highlight.id] = highlight;
    return lookup;
  }, {});
  const sourcesById = sourcePassages.reduce<Record<string, SourcePassage>>(
    (lookup, source) => {
      lookup[source.id] = source;
      return lookup;
    },
    {},
  );
  const segmentProps = {
    activeTooltipId,
    highlightsById,
    sourcesById,
    onClearActiveTooltip,
    onSetActiveTooltip,
    onShowInTrustLens,
    onShowToast,
  };

  return (
    <>
      <article
        className="rounded-[10px] border border-tl-border bg-tl-surface px-4 py-5 shadow-sm sm:px-5"
        data-final-answer="true"
      >
        <div className="space-y-5">
          {finalAnswerBlocks.map((block) => renderBlock(block, segmentProps))}
        </div>

        <div className="mt-6 flex flex-col gap-2 border-t border-tl-border pt-4 sm:flex-row sm:items-center">
          <button
            className="focus-ring inline-flex min-h-10 items-center justify-center gap-2 rounded-[8px] bg-tl-accent px-3.5 text-sm font-semibold text-tl-accent-ink transition hover:brightness-95 disabled:cursor-not-allowed disabled:bg-tl-surface-muted disabled:text-tl-text-soft"
            disabled={recheckRunning}
            type="button"
            onClick={onStartRecheck}
          >
            <FileSearch size={16} strokeWidth={1.75} />
            {finalAnswerCopy.recheckButton}
          </button>
          <MoreActionsMenu
            recheckDisabled={recheckRunning}
            onAskAlternativeView={onAskAlternativeView}
            onCopyDraft={onCopyDraft}
            onStartRecheck={onStartRecheck}
          />
        </div>
      </article>

      {recheckRunning ? (
        <RecheckProgress activeStepIndex={recheckProgressStep} steps={recheckSteps} />
      ) : null}

      {recheckComplete ? (
        <RecheckSummary
          onAddMissingContext={onAddMissingContextFromSummary}
          onOpenClaims={onOpenClaimsFromSummary}
          onViewHighlightedOutput={onViewHighlightedOutput}
        />
      ) : null}

      {extraAssistantMessages.map((message, index) => (
        <article
          className="rounded-[10px] border border-tl-border bg-tl-panel px-4 py-3 text-sm leading-6 text-tl-text-muted"
          key={`${message}-${index}`}
        >
          {message}
        </article>
      ))}
    </>
  );
}
