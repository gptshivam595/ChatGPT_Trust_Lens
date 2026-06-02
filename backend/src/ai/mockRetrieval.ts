import { sanitizeRetrievedText, scanForPromptInjection } from "./safety.js";
import type { RetrievedPassage, Retriever } from "./types.js";

const sourcePassages: Record<string, Omit<RetrievedPassage, "safetyFindings">> = {
  source_mock_001: {
    id: "source_mock_001",
    title: "Trust Lens Product Definition",
    urlLabel: "Internal planning docs",
    passage:
      "Trust Lens helps users refine prompts, compare answer directions, and review assumptions, uncertainty, missing context, and claims before acting on an AI response.",
    highlightedSentence:
      "Trust Lens helps users refine prompts, compare answer directions, and review assumptions, uncertainty, missing context, and claims before acting on an AI response."
  }
};

const withSafety = (passage: Omit<RetrievedPassage, "safetyFindings">): RetrievedPassage => {
  const safetyFindings = scanForPromptInjection(passage.passage);
  return {
    ...passage,
    passage: sanitizeRetrievedText(passage.passage),
    highlightedSentence: sanitizeRetrievedText(passage.highlightedSentence),
    safetyFindings
  };
};

const fallbackPassageFor = (query: string): Omit<RetrievedPassage, "safetyFindings"> => {
  const sanitizedQuery = sanitizeRetrievedText(query).slice(0, 500);
  const passage = `No external source was attached for this generated claim: ${sanitizedQuery}. Treat the claim as requiring verification against trusted sources or project data before acting on it.`;
  return {
    id: "source_generated_context",
    title: "Generated claim review boundary",
    urlLabel: "Generated prompt context",
    passage,
    highlightedSentence: passage
  };
};

export class MockRetriever implements Retriever {
  async retrieve(query: string) {
    return [withSafety(fallbackPassageFor(query))];
  }

  async getSource(sourceId: string) {
    const passage = sourcePassages[sourceId];
    return passage ? withSafety(passage) : undefined;
  }
}
