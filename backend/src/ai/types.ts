import type { JsonObject } from "../persistence/types.js";
import type {
  DirectionsInput,
  FinalAnswerInput,
  ImprovePromptInput,
  PromptReadinessInput
} from "../services/mockTrustLensService.js";

export type TemplateRef = {
  templateId: string;
  version: string;
};

export type SafetySeverity = "low" | "medium" | "high" | "critical";

export type SafetyFinding = {
  id: string;
  label: string;
  severity: SafetySeverity;
  category:
    | "role_override"
    | "system_prompt_extraction"
    | "jailbreak"
    | "tool_abuse"
    | "indirect_injection";
  evidence: string;
};

export type PipelineMetadata = {
  adapter: "mock";
  template: TemplateRef;
  safetyFindings: SafetyFinding[];
  tokenEstimate: number;
  fallbackReason?: string;
};

export type RetrievedPassage = {
  id: string;
  title: string;
  urlLabel: string;
  passage: string;
  highlightedSentence: string;
  safetyFindings: SafetyFinding[];
};

export type ExtractedClaim = {
  id: string;
  claim: string;
  type: string;
  decisionCritical: boolean;
};

export type EvaluatedClaim = {
  id: string;
  claim: string;
  type: string;
  evidenceStatus:
    | "Supported"
    | "Needs verification"
    | "Conflicting evidence"
    | "No clear evidence found"
    | "Assumption/inference"
    | "Plausible, needs testing"
    | "Uncertain";
  whyVerify: string;
  suggestedAction: string;
};

export type HighlightDefinition = JsonObject;

export type PromptReadinessResult = JsonObject;
export type ImprovedPromptResult = JsonObject;
export type AnswerDirectionsResult = JsonObject;
export type FinalAnswerResult = JsonObject;
export type RecheckEvaluationResult = JsonObject;

export interface PromptReadinessEvaluator {
  evaluate(input: PromptReadinessInput): Promise<{
    data: PromptReadinessResult;
    metadata: PipelineMetadata;
  }>;
}

export interface ImprovedPromptGenerator {
  generate(input: ImprovePromptInput): Promise<{
    data: ImprovedPromptResult;
    metadata: PipelineMetadata;
  }>;
}

export interface AnswerDirectionPlanner {
  plan(input: DirectionsInput): Promise<{
    data: AnswerDirectionsResult;
    metadata: PipelineMetadata;
  }>;
}

export interface FinalAnswerGenerator {
  generate(input: FinalAnswerInput): Promise<{
    data: FinalAnswerResult;
    metadata: PipelineMetadata;
  }>;
}

export interface QueryGenerator {
  generateQueries(claims: ExtractedClaim[]): Promise<string[]>;
}

export interface Retriever {
  retrieve(query: string): Promise<RetrievedPassage[]>;
  getSource(sourceId: string): Promise<RetrievedPassage | undefined>;
}

export interface ClaimExtractor {
  extract(finalAnswer: FinalAnswerResult): Promise<ExtractedClaim[]>;
}

export interface ClaimEvaluator {
  evaluate(claims: ExtractedClaim[], passages: RetrievedPassage[]): Promise<EvaluatedClaim[]>;
}

export interface HighlightClassifier {
  classify(answer: FinalAnswerResult, claims: EvaluatedClaim[]): Promise<HighlightDefinition[]>;
}
