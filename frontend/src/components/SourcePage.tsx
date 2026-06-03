import { ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { getSourcePassage } from "../api/trustLensClient";
import type { SourcePassage } from "../state/appTypes";

interface SourcePageProps {
  sourceId: string;
}

function renderPassage(source: SourcePassage) {
  const sentenceIndex = source.passage.indexOf(source.highlightedSentence);

  if (sentenceIndex < 0) {
    return (
      <mark className="rounded-[6px] bg-tl-source-bg px-1 text-tl-text">
        {source.passage}
      </mark>
    );
  }

  const before = source.passage.slice(0, sentenceIndex);
  const after = source.passage.slice(
    sentenceIndex + source.highlightedSentence.length,
  );

  return (
    <>
      {before}
      <mark className="rounded-[6px] bg-tl-source-bg px-1 text-tl-text">
        {source.highlightedSentence}
      </mark>
      {after}
    </>
  );
}

export function SourcePage({ sourceId }: SourcePageProps) {
  const [source, setSource] = useState<SourcePassage | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function loadSource() {
      setLoading(true);
      const result = await getSourcePassage(sourceId);

      if (cancelled) {
        return;
      }

      if (result.success) {
        setSource(result.data.source);
        setError(null);
      } else {
        setError(result.error.message);
      }

      setLoading(false);
    }

    loadSource();

    return () => {
      cancelled = true;
    };
  }, [sourceId]);

  return (
    <main className="min-h-dvh bg-tl-bg px-4 py-8 text-tl-text sm:px-6">
      <article className="mx-auto max-w-3xl rounded-[10px] border border-tl-border bg-tl-surface shadow-sm">
        <header className="border-b border-tl-border px-4 py-5 sm:px-6">
          <p className="text-xs font-semibold uppercase tracking-wide text-tl-text-soft">
            Trust Lens Source
          </p>
          <h1 className="mt-2 text-2xl font-semibold leading-8">
            {source?.title ?? "Source passage"}
          </h1>
        </header>

        <div className="space-y-4 px-4 py-5 sm:px-6">
          {loading ? (
            <p className="rounded-[8px] border border-tl-border bg-tl-panel p-3 text-sm text-tl-text-muted">
              Loading source...
            </p>
          ) : null}

          {!loading && error ? (
            <p className="rounded-[8px] border border-tl-border bg-tl-panel p-3 text-sm text-tl-text-muted">
              {error}
            </p>
          ) : null}

          {!loading && source ? (
            <>
              <div className="rounded-[8px] border border-tl-border bg-tl-panel p-3">
                <p className="text-xs font-semibold uppercase tracking-wide text-tl-text-soft">
                  Source location
                </p>
                <p className="mt-1 break-all font-mono text-sm leading-6 text-tl-text-muted">
                  {source.urlLabel}
                </p>
              </div>

              <p className="rounded-[8px] border border-tl-border bg-tl-panel p-4 text-base leading-7 text-tl-text">
                {renderPassage(source)}
              </p>
            </>
          ) : null}
        </div>

        <footer className="flex flex-wrap gap-2 border-t border-tl-border px-4 py-4 sm:px-6">
          <a
            className="focus-ring inline-flex min-h-10 items-center justify-center gap-2 rounded-[8px] bg-tl-accent px-3.5 text-sm font-semibold text-tl-accent-ink transition hover:brightness-95"
            href="/"
          >
            <ArrowLeft size={16} strokeWidth={1.75} />
            Back to Trust Lens
          </a>
        </footer>
      </article>
    </main>
  );
}
