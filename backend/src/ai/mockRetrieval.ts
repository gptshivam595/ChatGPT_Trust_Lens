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

export class MockRetriever implements Retriever {
  async retrieve(_query: string) {
    return [withSafety(sourcePassages.source_mock_001)];
  }

  async getSource(sourceId: string) {
    const passage = sourcePassages[sourceId];
    return passage ? withSafety(passage) : undefined;
  }
}
