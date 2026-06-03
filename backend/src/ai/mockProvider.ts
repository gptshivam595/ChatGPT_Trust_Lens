import { getTemplate } from "./promptTemplates.js";
import { hasHighRiskFinding, scanForPromptInjection } from "./safety.js";
import { estimateTokens } from "./telemetry.js";
import type {
  AnswerDirectionPlanner,
  AnswerDirectionsResult,
  ClaimEvaluator,
  ClaimExtractor,
  EvaluatedClaim,
  ExtractedClaim,
  FinalAnswerGenerator,
  FinalAnswerResult,
  HighlightClassifier,
  HighlightDefinition,
  ImprovedPromptGenerator,
  ImprovedPromptResult,
  PipelineMetadata,
  PromptReadinessEvaluator,
  PromptReadinessResult,
  QueryGenerator,
  RetrievedPassage
} from "./types.js";
import type {
  DirectionsInput,
  FinalAnswerInput,
  ImprovePromptInput,
  PromptReadinessInput
} from "../services/mockTrustLensService.js";

const metadataFor = (
  templateKey: Parameters<typeof getTemplate>[0],
  sourceText: string,
  safetyFindings = scanForPromptInjection(sourceText),
  fallbackReason?: string
): PipelineMetadata => {
  const template = getTemplate(templateKey);
  return {
    adapter: "mock",
    template: {
      templateId: template.id,
      version: template.version
    },
    safetyFindings,
    tokenEstimate: estimateTokens(sourceText),
    ...(fallbackReason ? { fallbackReason } : {})
  };
};

export const baseHighlights: HighlightDefinition[] = [
  {
    id: "hl_source_001",
    kind: "source",
    label: "Source",
    text: "review assumptions, uncertainty, missing context, and claims before acting",
    tooltipTitle: "Supported by source",
    tooltipBody:
      "This phrase is backed by the product definition and should still be reviewed in context.",
    sourceId: "source_mock_001"
  },
  {
    id: "hl_verify_001",
    kind: "verify",
    label: "Verify",
    text: "reduce blind acceptance of AI answers",
    tooltipTitle: "Needs verification",
    tooltipBody:
      "This is plausible product value, but it needs user research or usage data before being treated as proven."
  },
  {
    id: "hl_assumption_001",
    kind: "assumption",
    label: "Assumption",
    text: "product students and working PMs",
    tooltipTitle: "Assumption/inference",
    tooltipBody:
      "The audience is inferred from the planning docs and should be validated with target users."
  },
  {
    id: "hl_logic_001",
    kind: "product_logic",
    label: "Product logic",
    text: "Trust Lens should appear after the final answer, not before it",
    tooltipTitle: "Product logic",
    tooltipBody:
      "This is a core interaction rule designed to keep review separate from answer generation."
  }
];

export const baseClaims: EvaluatedClaim[] = [
  {
    id: "claim_001",
    claim: "Trust Lens helps users review assumptions and missing context before acting.",
    type: "Product behavior",
    evidenceStatus: "Supported",
    whyVerify:
      "The claim matches the product definition passage, but source support is not full-answer verification.",
    suggestedAction: "Keep this language, but avoid implying guaranteed correctness."
  },
  {
    id: "claim_002",
    claim: "Trust Lens may reduce blind acceptance of AI answers.",
    type: "Product outcome",
    evidenceStatus: "Needs verification",
    whyVerify: "The benefit is plausible but not proven by the prototype.",
    suggestedAction: "Validate through user interviews or task-completion studies."
  },
  {
    id: "claim_003",
    claim: "Product students and working PMs are the strongest initial audience.",
    type: "Audience",
    evidenceStatus: "Assumption/inference",
    whyVerify: "The audience is selected from planning assumptions.",
    suggestedAction: "Run discovery with both groups before committing positioning."
  },
  {
    id: "claim_004",
    claim: "Risk-based activation may prevent Trust Lens from feeling heavy.",
    type: "UX strategy",
    evidenceStatus: "Plausible, needs testing",
    whyVerify: "Activation timing can change perceived friction.",
    suggestedAction: "Prototype automatic and manual activation variants."
  }
];

export class MockPromptReadinessEvaluator implements PromptReadinessEvaluator {
  async evaluate(input: PromptReadinessInput) {
    const safetyFindings = scanForPromptInjection(input.prompt);
    const injectionRiskChip =
      safetyFindings.length > 0 ? [{ id: "instruction-override", label: "Instruction override risk" }] : [];
    const injectionExplanation = hasHighRiskFinding(safetyFindings)
      ? " The prompt also contains possible instruction override language, so generated output should be treated carefully."
      : "";

    return {
      data: {
        readinessId: "readiness_mock_001",
        riskBadge: "Medium answer-quality risk",
        explanation:
          "The prompt has a useful direction, but the audience, decision context, and evidence standard need more detail before the final answer is generated." +
          injectionExplanation,
        riskChips: [
          { id: "audience", label: "Audience unclear" },
          { id: "evidence", label: "Evidence standard missing" },
          { id: "format", label: "Output format unspecified" },
          ...injectionRiskChip
        ],
        qualityRows: [
          { id: "specificity", label: "Prompt specificity", level: "Medium" },
          { id: "context", label: "Context depth", level: "Low" },
          { id: "actionability", label: "Actionability", level: "Medium to High" }
        ],
        clarifyingQuestions: [
          {
            id: "audience",
            question: "Who will use the final answer?",
            defaultOptionId: "product-students",
            options: [
              { id: "product-students", label: "Product and design students" },
              { id: "working-pms", label: "Working product managers" },
              { id: "founders", label: "Early-stage founders" }
            ]
          },
          {
            id: "depth",
            question: "How detailed should the output be?",
            defaultOptionId: "decision-ready",
            options: [
              { id: "quick", label: "Quick overview" },
              { id: "decision-ready", label: "Decision-ready analysis" },
              { id: "deep", label: "Deep research framing" }
            ]
          }
        ]
      } satisfies PromptReadinessResult,
      metadata: metadataFor("readiness", input.prompt, safetyFindings)
    };
  }
}

export class MockImprovedPromptGenerator implements ImprovedPromptGenerator {
  async generate(input: ImprovePromptInput) {
    return {
      data: {
        improvedPromptId: "improved_prompt_mock_001",
        originalPrompt: input.originalPrompt,
        improvedPrompt:
          "Create a decision-ready product analysis for Trust Lens, an AI review layer that helps users evaluate AI outputs. Focus on product students and working PMs. Include the user problem, core workflow, risks, evidence boundaries, and a phased implementation plan. Use cautious language and separate assumptions from source-backed claims.",
        changes: [
          {
            id: "audience",
            label: "Added audience",
            description: "Clarifies that the answer should serve product students and working PMs."
          },
          {
            id: "format",
            label: "Added output shape",
            description: "Requests product analysis, risk framing, and phased implementation structure."
          },
          {
            id: "certainty",
            label: "Added evidence boundary",
            description: "Requires assumptions and source-backed claims to stay visibly separate."
          }
        ]
      } satisfies ImprovedPromptResult,
      metadata: metadataFor("improvedPrompt", input.originalPrompt)
    };
  }
}

export class MockAnswerDirectionPlanner implements AnswerDirectionPlanner {
  async plan(input: DirectionsInput) {
    const data = {
      recommendedDirectionId: "decision_ready",
      directions: [
        {
          id: "summary",
          title: "Quick Summary",
          badge: "Fastest",
          headline: "A short product overview with the main Trust Lens idea.",
          description: "Best when the user wants a crisp explanation before deeper work.",
          cta: "Use summary"
        },
        {
          id: "analysis",
          title: "Detailed Analysis",
          badge: "Broader",
          headline: "A fuller breakdown of workflow, risks, and product logic.",
          description: "Best when the user wants to compare tradeoffs and refine the concept.",
          cta: "Use analysis"
        },
        {
          id: "decision_ready",
          title: "Decision-Ready Output",
          badge: "Recommended",
          headline: "A structured product answer with assumptions and verification needs.",
          description:
            "Best when the answer will guide planning, roadmap, or implementation work.",
          cta: "Use decision-ready",
          recommended: true
        }
      ]
    } as unknown as AnswerDirectionsResult;

    return {
      data,
      metadata: metadataFor("directions", input.selectedPrompt)
    };
  }
}

export class MockFinalAnswerGenerator implements FinalAnswerGenerator {
  async generate(input: FinalAnswerInput) {
    const data = {
      answerId: "answer_mock_001",
      selectedDirectionId: input.selectedDirectionId,
      blocks: [
        {
          type: "heading",
          text: "Trust Lens: Product Analysis"
        },
        {
          type: "paragraph",
          segments: [
            {
              type: "text",
              text: "Trust Lens is a review layer for AI outputs. It helps users "
            },
            {
              type: "highlight",
              highlightId: "hl_source_001",
              text: "review assumptions, uncertainty, missing context, and claims before acting"
            },
            {
              type: "text",
              text: " on a generated answer."
            }
          ]
        },
        {
          type: "section",
          title: "Core Product Bet",
          segments: [
            {
              type: "text",
              text: "The product bet is that a structured review layer can "
            },
            {
              type: "highlight",
              highlightId: "hl_verify_001",
              text: "reduce blind acceptance of AI answers"
            },
            {
              type: "text",
              text: " while still keeping the generation flow fast."
            }
          ]
        },
        {
          type: "list",
          items: [
            [
              {
                type: "highlight",
                highlightId: "hl_assumption_001",
                text: "product students and working PMs"
              },
              {
                type: "text",
                text: " are a reasonable starting audience."
              }
            ],
            [
              {
                type: "highlight",
                highlightId: "hl_logic_001",
                text: "Trust Lens should appear after the final answer, not before it"
              },
              {
                type: "text",
                text: " so review does not interrupt answer generation."
              }
            ]
          ]
        }
      ],
      highlights: baseHighlights,
      trustLens: {
        summary:
          "Review recommended. The answer is useful for planning, but the audience choice and product outcome claims still need validation.",
        qualityRows: [
          {
            id: "correctness",
            label: "Correctness",
            status: "Medium",
            note: "Rates how correct the output appears based on the available prompt, context, and visible claims."
          },
          {
            id: "completeness",
            label: "Completeness",
            status: "Medium",
            note: "Rates whether the output covers the important parts of the user's request."
          },
          {
            id: "reasoning-quality",
            label: "Reasoning Quality",
            status: "Medium",
            note: "Rates whether the output's logic is clear, consistent, and reasonable."
          },
          {
            id: "uncertainty",
            label: "Uncertainty",
            status: "Medium",
            note: "Rates how much ambiguity, missing evidence, or verification need remains."
          }
        ],
        assumptions: [
          {
            id: "assumption_001",
            text: "Users want review after generation rather than before it.",
            impact: "This shapes the core interaction timing."
          },
          {
            id: "assumption_002",
            text: "Cautious labels will build more trust than numeric scoring.",
            impact: "This affects the product language and visual system."
          }
        ],
        missingContext: [
          {
            id: "missing_001",
            text: "No user research results are attached.",
            whyItMatters: "The value proposition should be validated before launch."
          },
          {
            id: "missing_002",
            text: "No task-risk threshold is defined.",
            whyItMatters: "Trust Lens activation may need to vary by task type."
          }
        ],
        claims: baseClaims,
        alternatives: [
          {
            id: "alt_001",
            title: "Manual review mode",
            description:
              "Trust Lens could stay optional and let users open it only for high-stakes outputs."
          },
          {
            id: "alt_002",
            title: "Risk-based activation",
            description:
              "The product could open the full panel only when the prompt or answer shows higher review risk."
          }
        ]
      }
    } as unknown as FinalAnswerResult;

    return {
      data,
      metadata: metadataFor("finalAnswer", input.selectedPrompt)
    };
  }
}

export class MockClaimExtractor implements ClaimExtractor {
  async extract(finalAnswer: FinalAnswerResult): Promise<ExtractedClaim[]> {
    const trustLens = (finalAnswer as { trustLens?: { claims?: unknown[] } }).trustLens;
    if (Array.isArray(trustLens?.claims) && trustLens.claims.length > 0) {
      return trustLens.claims.map((claim, index) => {
        const record =
          typeof claim === "object" && claim !== null && !Array.isArray(claim)
            ? (claim as Record<string, unknown>)
            : { claim };
        return {
          id: typeof record.id === "string" ? record.id : `claim_generated_${index + 1}`,
          claim: typeof record.claim === "string" ? record.claim : String(record.text ?? claim),
          type: typeof record.type === "string" ? record.type : "Generated claim",
          decisionCritical: record.evidenceStatus !== "Supported"
        };
      });
    }

    return baseClaims.map((claim) => ({
      id: claim.id,
      claim: claim.claim,
      type: claim.type,
      decisionCritical: claim.evidenceStatus !== "Supported"
    }));
  }
}

export class MockQueryGenerator implements QueryGenerator {
  async generateQueries(claims: ExtractedClaim[]) {
    return claims.map((claim) => claim.claim);
  }
}

export class MockClaimEvaluator implements ClaimEvaluator {
  async evaluate(claims: ExtractedClaim[], passages: RetrievedPassage[]) {
    return claims.map((claim) => {
      const base = baseClaims.find((candidate) => candidate.id === claim.id);
      if (!base) {
        return {
          id: claim.id,
          claim: claim.claim,
          type: claim.type,
          evidenceStatus: passages.length > 0 ? "Needs verification" : "No clear evidence found",
          whyVerify:
            "The claim does not have enough deterministic support in the current retrieval set.",
          suggestedAction: "Verify this claim with a trusted external source."
        } satisfies EvaluatedClaim;
      }

      if (base.id === "claim_004") {
        return {
          ...base,
          evidenceStatus: "Needs verification",
          suggestedAction: "Test activation thresholds with low-risk and high-stakes prompts."
        } satisfies EvaluatedClaim;
      }

      return base;
    });
  }
}

export class MockHighlightClassifier implements HighlightClassifier {
  async classify(answer: FinalAnswerResult, claims: EvaluatedClaim[]) {
    const answerHighlights = (answer as { highlights?: HighlightDefinition[] }).highlights;
    if (Array.isArray(answerHighlights) && answerHighlights.length > 0) {
      return answerHighlights;
    }

    return claims.slice(0, 4).map((claim, index) => ({
      id: `hl_generated_${index + 1}`,
      kind: claim.evidenceStatus === "Assumption/inference" ? "assumption" : "verify",
      label: claim.evidenceStatus === "Assumption/inference" ? "Assumption" : "Verify",
      text: claim.claim,
      tooltipTitle: claim.evidenceStatus,
      tooltipBody: claim.whyVerify
    }));
  }
}
