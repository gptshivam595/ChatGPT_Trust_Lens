import {
  MockAnswerDirectionPlanner,
  MockClaimEvaluator,
  MockClaimExtractor,
  MockFinalAnswerGenerator,
  MockHighlightClassifier,
  MockImprovedPromptGenerator,
  MockPromptReadinessEvaluator,
  MockQueryGenerator
} from "./mockProvider.js";
import { MockRetriever } from "./mockRetrieval.js";
import { createTelemetryEvent, type AiTelemetryEvent } from "./telemetry.js";
import type { FinalAnswerResult } from "./types.js";
import type {
  DirectionsInput,
  FinalAnswerInput,
  ImprovePromptInput,
  PromptReadinessInput
} from "../services/mockTrustLensService.js";

const timed = async <T>(
  step: string,
  operation: () => Promise<{ data: T; metadata: Parameters<typeof createTelemetryEvent>[1] }>
) => {
  const startedAt = Date.now();
  const result = await operation();
  return {
    ...result,
    telemetry: createTelemetryEvent(step, result.metadata, Date.now() - startedAt)
  };
};

export class TrustLensAiOrchestrator {
  readonly adapter = "mock";
  readonly retriever = new MockRetriever();
  private readonly readiness = new MockPromptReadinessEvaluator();
  private readonly improvedPrompt = new MockImprovedPromptGenerator();
  private readonly directions = new MockAnswerDirectionPlanner();
  private readonly finalAnswer = new MockFinalAnswerGenerator();
  private readonly claimExtractor = new MockClaimExtractor();
  private readonly queryGenerator = new MockQueryGenerator();
  private readonly claimEvaluator = new MockClaimEvaluator();
  private readonly highlightClassifier = new MockHighlightClassifier();

  async evaluateReadiness(input: PromptReadinessInput) {
    return timed("prompt_readiness", () => this.readiness.evaluate(input));
  }

  async generateImprovedPrompt(input: ImprovePromptInput) {
    return timed("improved_prompt", () => this.improvedPrompt.generate(input));
  }

  async planAnswerDirections(input: DirectionsInput) {
    return timed("answer_directions", () => this.directions.plan(input));
  }

  async generateFinalAnswer(input: FinalAnswerInput) {
    return timed("final_answer", () => this.finalAnswer.generate(input));
  }

  async evaluateRecheck(finalAnswer: FinalAnswerResult) {
    const startedAt = Date.now();
    const claims = await this.claimExtractor.extract(finalAnswer);
    const queries = await this.queryGenerator.generateQueries(claims);
    const passageGroups = await Promise.all(queries.map((query) => this.retriever.retrieve(query)));
    const passages = passageGroups.flat();
    const evaluatedClaims = await this.claimEvaluator.evaluate(claims, passages);
    const highlights = await this.highlightClassifier.classify(finalAnswer, evaluatedClaims);
    const metadata = {
      adapter: "mock" as const,
      template: {
        templateId: "trust-lens-recheck",
        version: "2026-06-02.1"
      },
      safetyFindings: passages.flatMap((passage) => passage.safetyFindings),
      tokenEstimate: queries.join(" ").length
    };

    return {
      data: {
        summary: {
          claimsReviewed: evaluatedClaims.length,
          supported: evaluatedClaims.filter((claim) => claim.evidenceStatus === "Supported").length,
          needsVerification: evaluatedClaims.filter(
            (claim) => claim.evidenceStatus === "Needs verification"
          ).length,
          assumptionInference: evaluatedClaims.filter(
            (claim) => claim.evidenceStatus === "Assumption/inference"
          ).length,
          conflictingEvidence: evaluatedClaims.filter(
            (claim) => claim.evidenceStatus === "Conflicting evidence"
          ).length
        },
        claims: evaluatedClaims,
        highlights
      },
      metadata,
      telemetry: createTelemetryEvent("recheck", metadata, Date.now() - startedAt)
    };
  }

  async getSource(sourceId: string) {
    return this.retriever.getSource(sourceId);
  }
}

export type { AiTelemetryEvent };
