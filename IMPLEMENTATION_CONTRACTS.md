# Trust Lens Implementation Contracts

This file closes the implementation gaps found during external review.

It is the build-time contract for the coding agent. Use it with:

- `ARCHITECTURE.md`
- `PRODUCT.md`
- `DESIGN.md`
- `12_PHASE_PLAN.md`
- `screens/`
- `microservice/`

## Gap Review Status

| Gap | Status | Resolution |
| --- | --- | --- |
| Missing mock data inventory | Fixed here | See Section 1. |
| Missing type definitions | Fixed here | See Section 2. |
| Missing screen specifications | Already fixed | See `screens/`. |
| Missing copy inventory | Fixed here | See Section 3. |
| Missing component prop contracts | Fixed here | See Section 4. |
| Missing state machine guards | Fixed here | See Section 5. |
| Missing responsive CSS specs | Fixed here | See Section 6. |
| Missing accessibility contracts | Fixed here | See Section 7. |
| Missing Tailwind/OKLCH config | Fixed here | See Section 8. |
| Missing edge cases | Fixed here | See Section 9. |
| Missing package spec | Fixed here | See Section 10. |
| Codex-ready checklist | Fixed here | See Section 11. |

## 1. Complete Mock Data Inventory

Target file during implementation:

```text
src/data/trustLensMockData.ts
```

Use this data as the complete prototype source of truth.

```ts
import type {
  AlternativeItem,
  AnswerDirection,
  AssumptionItem,
  ClaimItem,
  ClarificationQuestion,
  EmptyStateCopy,
  FinalAnswerBlock,
  HighlightDefinition,
  MissingContextItem,
  QualityRiskRow,
  QualitySignal,
  RecheckStep,
  RiskChip,
  SourcePassage,
} from "../state/appTypes";

export const samplePrompt =
  "Help me prepare a product solution for improving trust in AI-generated outputs.";

export const improvedPromptTemplate =
  "Create a decision-ready product solution for a ChatGPT feature that helps users evaluate AI-generated outputs before acting on them. Focus on trust, correctness, completeness, reasoning quality, uncertainty, missing context, assumptions, and claim verification. The answer should support human judgment rather than replacing it. Include product flow, key UI components, user controls, and risks.";

export const emptyStateCopy: EmptyStateCopy = {
  title: "Improve and evaluate AI outputs with Trust Lens",
  subtitle:
    "Trust Lens helps you refine prompts, compare answer directions, and review assumptions, uncertainty, missing context, and claims before acting on an AI response.",
  capabilities: [
    {
      title: "Prompt Readiness",
      description:
        "Detects missing context and answer-quality risk before generation.",
    },
    {
      title: "Answer Direction Preview",
      description:
        "Shows possible response directions before creating the final answer.",
    },
    {
      title: "Output Review",
      description:
        "Surfaces assumptions, missing context, uncertainty, and claims to verify.",
    },
  ],
  samplePromptButton: "Use sample prompt",
};

export const promptReadinessRisks: RiskChip[] = [
  { id: "missing-context", label: "Missing context" },
  { id: "ambiguous-goal", label: "Ambiguous goal" },
  { id: "high-stakes-possible", label: "High-stakes intent possible" },
  { id: "needs-evaluation", label: "Needs evaluation support" },
];

export const qualityRiskRows: QualityRiskRow[] = [
  { id: "missing-context", label: "Missing context", level: "Medium" },
  { id: "ambiguity", label: "Ambiguity", level: "Medium" },
  { id: "high-stakes", label: "High-stakes intent", level: "Medium" },
  {
    id: "verification",
    label: "Need for factual verification",
    level: "Medium",
  },
  {
    id: "answer-quality",
    label: "Answer-quality risk",
    level: "Medium to High",
  },
];

export const clarificationQuestions: ClarificationQuestion[] = [
  {
    id: "purpose",
    question: "What is this output mainly for?",
    defaultOptionId: "product-case-study",
    options: [
      { id: "personal-understanding", label: "Personal understanding" },
      { id: "college-project", label: "College/project submission" },
      { id: "work-presentation", label: "Work presentation" },
      { id: "product-case-study", label: "Product case study" },
      { id: "decision-making", label: "Decision-making" },
    ],
  },
  {
    id: "depth",
    question: "What level of depth do you need?",
    defaultOptionId: "decision-ready",
    options: [
      { id: "quick-summary", label: "Quick summary" },
      { id: "structured-explanation", label: "Structured explanation" },
      { id: "detailed-product-thinking", label: "Detailed product thinking" },
      { id: "decision-ready", label: "Decision-ready output" },
    ],
  },
  {
    id: "reliability",
    question: "How reliable should the final answer be?",
    defaultOptionId: "include-assumptions",
    options: [
      { id: "good-enough-draft", label: "Good enough draft" },
      { id: "careful-review", label: "Needs careful review" },
      { id: "include-assumptions", label: "Should include assumptions" },
      { id: "flag-claims", label: "Should flag claims to verify" },
    ],
  },
];

export const answerDirections: AnswerDirection[] = [
  {
    id: "summary",
    title: "Quick Summary",
    badge: "Fastest",
    headline: "Best for a short overview",
    description:
      "A concise answer that summarizes the solution in simple points. Useful when you need a quick direction, but it may not deeply cover trade-offs or implementation details.",
    cta: "Choose summary",
  },
  {
    id: "analysis",
    title: "Detailed Analysis",
    badge: "Balanced",
    headline: "Best for understanding the full idea",
    description:
      "A more complete explanation that covers the product flow, user value, risks, and reasoning behind the solution.",
    cta: "Choose analysis",
  },
  {
    id: "decision_ready",
    title: "Decision-Ready Output",
    badge: "Recommended",
    headline: "Best match for your intent",
    description:
      "A structured product-ready response with feature flow, UI behavior, evaluation logic, user controls, and trust-related edge cases.",
    cta: "Choose decision-ready",
    recommended: true,
  },
];

export const highlightDefinitions: HighlightDefinition[] = [
  {
    id: "h-evaluate-before-acting",
    kind: "source",
    label: "Source",
    text: "evaluate AI-generated outputs before acting on them",
    tooltipTitle: "Source-backed claim",
    tooltipBody: "This claim is supported by a retrieved source.",
    sourceId: "source-ai-output-review",
  },
  {
    id: "h-missing-context-risk",
    kind: "product_logic",
    label: "Product logic",
    text: "detects missing context, ambiguity, and answer-quality risk",
    tooltipTitle: "Product logic",
    tooltipBody:
      "This describes the intended behavior of the prototype and should be tested with users.",
  },
  {
    id: "h-more-control",
    kind: "verify",
    label: "Verify",
    text: "gives users more control",
    tooltipTitle: "Needs verification",
    tooltipBody:
      "This is a product outcome claim. Validate it through usability testing or user research.",
  },
  {
    id: "h-quality-review",
    kind: "product_logic",
    label: "Product logic",
    text: "reviews correctness, completeness, reasoning quality, usefulness, and uncertainty",
    tooltipTitle: "Product feature",
    tooltipBody:
      "This is a feature capability claim within the prototype.",
  },
  {
    id: "h-not-blind-trust",
    kind: "source",
    label: "Source",
    text: "not to make users blindly trust the AI",
    tooltipTitle: "Source-backed principle",
    tooltipBody:
      "This principle is supported by the product requirement to support human judgment.",
    sourceId: "source-human-judgment",
  },
  {
    id: "h-verify-before-using",
    kind: "verify",
    label: "Verify",
    text: "what they should verify before using it",
    tooltipTitle: "Needs verification",
    tooltipBody:
      "The specific verification needs depend on the task, source quality, and user context.",
  },
];

export const finalAnswerBlocks: FinalAnswerBlock[] = [
  {
    type: "heading",
    text: "Trust Lens: A Review Layer for Better AI Output Evaluation",
  },
  {
    type: "paragraph",
    segments: [
      { type: "text", text: "Trust Lens is a review layer that helps users " },
      {
        type: "highlight",
        highlightId: "h-evaluate-before-acting",
        text: "evaluate AI-generated outputs before acting on them",
      },
      {
        type: "text",
        text: ". It reduces over-trust by making assumptions, missing context, uncertain claims, and alternative perspectives visible.",
      },
    ],
  },
  {
    type: "section",
    title: "Before generation: Prompt Readiness Check",
    segments: [
      {
        type: "text",
        text: "The experience starts with a Prompt Readiness Check that ",
      },
      {
        type: "highlight",
        highlightId: "h-missing-context-risk",
        text: "detects missing context, ambiguity, and answer-quality risk",
      },
      {
        type: "text",
        text: ". When risk is medium or high, it asks quick clarifying questions before generation.",
      },
    ],
  },
  {
    type: "section",
    title: "Before final answer: Answer Direction Preview",
    segments: [
      {
        type: "text",
        text: "After the prompt is ready, ChatGPT shows Quick Summary, Detailed Analysis, and Decision-Ready Output previews. This ",
      },
      {
        type: "highlight",
        highlightId: "h-more-control",
        text: "gives users more control",
      },
      {
        type: "text",
        text: " over the response shape before the final answer is generated.",
      },
    ],
  },
  {
    type: "section",
    title: "After generation: Trust Lens Output Review",
    segments: [
      {
        type: "text",
        text: "Once the final output is generated, Trust Lens opens a side panel that ",
      },
      {
        type: "highlight",
        highlightId: "h-quality-review",
        text: "reviews correctness, completeness, reasoning quality, usefulness, and uncertainty",
      },
      {
        type: "text",
        text: ". It also surfaces assumptions, missing context, claims to verify, and alternative perspectives.",
      },
    ],
  },
  {
    type: "section",
    title: "Inline evidence and verification",
    segments: [
      {
        type: "text",
        text: "The output includes inline highlights. Source-backed claims use a green dotted underline, claims needing verification use amber, and assumptions use blue.",
      },
    ],
  },
  {
    type: "section",
    title: "Recheck Output workflow",
    segments: [
      {
        type: "text",
        text: "A Recheck Output button allows the user to run deeper review. This process extracts claims, generates queries, retrieves mock evidence, cross-references sources, evaluates claim status, and updates the visual highlights.",
      },
    ],
  },
  {
    type: "section",
    title: "Why this supports human judgment",
    segments: [
      { type: "text", text: "The goal is " },
      {
        type: "highlight",
        highlightId: "h-not-blind-trust",
        text: "not to make users blindly trust the AI",
      },
      {
        type: "text",
        text: ". The goal is to help users understand what the answer depends on, what may be missing, and ",
      },
      {
        type: "highlight",
        highlightId: "h-verify-before-using",
        text: "what they should verify before using it",
      },
      { type: "text", text: "." },
    ],
  },
  {
    type: "list",
    items: [
      [
        {
          type: "text",
          text: "Use Prompt Readiness to reduce unclear requests before generation.",
        },
      ],
      [
        {
          type: "text",
          text: "Use Answer Direction Preview to choose the response format intentionally.",
        },
      ],
      [
        {
          type: "text",
          text: "Use Trust Lens after generation to review assumptions, missing context, and claims.",
        },
      ],
    ],
  },
];

export const trustLensQualityRows: QualitySignal[] = [
  {
    id: "correctness",
    label: "Correctness",
    value: "Medium confidence",
    description:
      "General product reasoning is plausible, but market and behavior claims need validation.",
  },
  {
    id: "completeness",
    label: "Completeness",
    value: "Good starting point",
    description:
      "Covers core flow, but needs user segment, metrics, and edge cases for final product proposal.",
  },
  {
    id: "reasoning-quality",
    label: "Reasoning quality",
    value: "Strong but simplified",
    description:
      "The flow is logical, but trade-offs should be tested with real users.",
  },
  {
    id: "usefulness",
    label: "Usefulness",
    value: "High for prototype planning",
    description: "Clear enough to guide a product prototype.",
  },
  {
    id: "uncertainty",
    label: "Uncertainty",
    value: "Medium",
    description:
      "Confidence varies by section. Source-backed claims are stronger than inferred product claims.",
  },
];

export const assumptions: AssumptionItem[] = [
  {
    id: "prototype-not-production",
    text: "The user is designing a product prototype, not a production-ready system.",
    impact:
      "If this is for production, technical architecture, data privacy, and evaluation reliability need deeper treatment.",
  },
  {
    id: "chatgpt-like-ui",
    text: "The user wants ChatGPT-like UI behavior.",
    impact:
      "If this is a standalone product, navigation, onboarding, and brand identity may need a different structure.",
  },
  {
    id: "case-study-intent",
    text: "The output is intended for a product management assignment or case study.",
    impact:
      "If this is for executive decision-making, metrics and evidence standards should be stricter.",
  },
  {
    id: "human-judgment",
    text: "The user values human judgment and does not want a black-box trust score.",
    impact:
      "If stakeholders expect a score, the product needs education around why labels are safer than fake precision.",
  },
  {
    id: "output-evaluation-focus",
    text: "The final solution should focus on output evaluation, not just hallucination detection.",
    impact:
      "If hallucination detection is the only goal, the UI could be narrower and more evidence-centric.",
  },
];

export const missingContextItems: MissingContextItem[] = [
  {
    id: "target-user-segment",
    context: "Target user segment is not fully defined.",
    whyItMatters:
      "Different users need different levels of interruption, explanation, and evidence detail.",
  },
  {
    id: "primary-use-case",
    context:
      "Primary use case is not locked: research, writing, coding, or career prep.",
    whyItMatters:
      "Trust Lens activation and review depth should vary by task type.",
  },
  {
    id: "success-metrics",
    context: "Success metrics are not specified.",
    whyItMatters:
      "Without metrics, it is hard to prove whether Trust Lens improves judgment or just adds friction.",
  },
  {
    id: "platform",
    context: "Prototype platform is not specified: web, mobile, or browser extension.",
    whyItMatters:
      "Panel behavior, composer layout, and review density depend on platform constraints.",
  },
  {
    id: "constraints",
    context:
      "No constraints are given around latency, cost, or source availability.",
    whyItMatters:
      "Real-time review and source retrieval can be expensive or slow in production.",
  },
  {
    id: "activation-timing",
    context:
      "No decision on when Trust Lens should appear automatically versus manually.",
    whyItMatters:
      "Always-on review may slow low-risk tasks, while manual review may be missed on important tasks.",
  },
];

export const claimsBeforeRecheck: ClaimItem[] = [
  {
    id: "overtrust",
    claim: "Polished AI outputs can increase over-trust.",
    type: "Behavioral claim",
    evidenceStatus: "Needs verification",
    whyVerify:
      "This should be supported by user interviews, survey data, or existing research.",
    suggestedAction: "Validate through interviews and survey responses.",
  },
  {
    id: "prompt-clarification",
    claim: "Prompt clarification improves output quality.",
    type: "Product logic claim",
    evidenceStatus: "Plausible, needs testing",
    whyVerify:
      "Some users may find clarification useful, while others may see it as friction.",
    suggestedAction:
      "Test skip rate and acceptance rate of improved prompts.",
  },
  {
    id: "source-highlights",
    claim: "Source-backed highlights improve trust.",
    type: "UX claim",
    evidenceStatus: "Uncertain",
    whyVerify:
      "Users may trust green highlights too much unless uncertainty is clearly shown.",
    suggestedAction:
      "Measure whether users still inspect sources before acting.",
  },
  {
    id: "three-previews",
    claim: "Three answer previews help users choose better responses.",
    type: "Interaction design claim",
    evidenceStatus: "Needs verification",
    whyVerify:
      "Too many options may create decision fatigue for some users.",
    suggestedAction:
      "Compare one-answer flow vs three-preview flow in task testing.",
  },
];

export const claimsAfterRecheck: ClaimItem[] = [
  {
    ...claimsBeforeRecheck[0],
    evidenceStatus: "Supported",
    whyVerify:
      "Mock evidence supports the narrower claim that polished AI output can encourage over-reliance when uncertainty is hidden.",
  },
  {
    ...claimsBeforeRecheck[1],
    evidenceStatus: "Needs verification",
  },
  {
    ...claimsBeforeRecheck[2],
    evidenceStatus: "Needs verification",
  },
  {
    ...claimsBeforeRecheck[3],
    evidenceStatus: "Assumption/inference",
    whyVerify:
      "The benefit is inferred from the interaction design and should be tested with real users.",
  },
];

export const alternatives: AlternativeItem[] = [
  {
    id: "evaluation-friction",
    perspective: "Too much evaluation may slow users down.",
    description:
      "For low-risk tasks like rewriting a casual message, Trust Lens may create unnecessary friction.",
  },
  {
    id: "label-overtrust",
    perspective: "Users may blindly trust Trust Lens labels.",
    description:
      "If the UI uses strong colors or labels, users may treat them as final truth rather than judgment support.",
  },
  {
    id: "source-false-confidence",
    perspective: "Source-backed claims may create false confidence.",
    description:
      "A source can support one part of a claim while the overall recommendation may still be context-dependent.",
  },
  {
    id: "clarification-speed",
    perspective: "Clarifying questions may reduce speed.",
    description:
      "Users who want quick outputs may skip clarification unless the value is obvious.",
  },
];

export const recheckSteps: RecheckStep[] = [
  {
    id: "claim-extraction",
    label: "Claim Extraction",
    description:
      "Identifying factual, numeric, technical, and decision-critical claims.",
  },
  {
    id: "query-generation",
    label: "Query Generation",
    description:
      "Creating search-style queries for claims that need evidence.",
  },
  {
    id: "information-retrieval",
    label: "Information Retrieval",
    description: "Finding mock supporting or conflicting information.",
  },
  {
    id: "cross-referencing",
    label: "Cross-Referencing",
    description:
      "Comparing the generated output against retrieved evidence.",
  },
  {
    id: "evaluation",
    label: "Evaluation",
    description: "Labeling claims by evidence status.",
  },
  {
    id: "visual-highlighting",
    label: "Visual Highlighting",
    description: "Updating inline highlights and Trust Lens results.",
  },
];

export const mockSources: SourcePassage[] = [
  {
    id: "source-ai-output-review",
    title: "Mock research note: AI output review behavior",
    urlLabel: "mock://research/ai-output-review-2026",
    passage:
      "Users often rely on polished AI outputs unless the interface makes uncertainty, assumptions, and review needs visible near the generated text.",
    highlightedSentence:
      "Users often rely on polished AI outputs unless the interface makes uncertainty, assumptions, and review needs visible near the generated text.",
  },
  {
    id: "source-human-judgment",
    title: "Mock product principle: Judgment-supporting AI",
    urlLabel: "mock://principles/judgment-support-2026",
    passage:
      "Trust features should support human judgment by showing uncertainty and evidence boundaries instead of presenting an automated trust score as final authority.",
    highlightedSentence:
      "Trust features should support human judgment by showing uncertainty and evidence boundaries instead of presenting an automated trust score as final authority.",
  },
];
```

## 2. Complete Type Definitions

Target file during implementation:

```text
src/state/appTypes.ts
```

```ts
export type WorkflowStep =
  | "initial"
  | "prompt_submitted"
  | "prompt_readiness_loading"
  | "prompt_readiness_ready"
  | "improved_prompt_ready"
  | "answer_directions_loading"
  | "answer_directions_ready"
  | "final_answer_loading"
  | "final_answer_ready";

export type TrustLensTab =
  | "quality"
  | "assumptions"
  | "missing_context"
  | "claims"
  | "alternatives";

export type AnswerDirectionId = "summary" | "analysis" | "decision_ready";

export type HighlightKind =
  | "source"
  | "verify"
  | "assumption"
  | "product_logic";

export type RecheckStatus = "idle" | "running" | "complete";

export type RiskLevel = "Low" | "Medium" | "Medium to High" | "High";

export type ClarificationSelections = Record<string, string>;

export interface RiskChip {
  id: string;
  label: string;
}

export interface QualityRiskRow {
  id: string;
  label: string;
  level: RiskLevel;
}

export interface ClarificationQuestion {
  id: string;
  question: string;
  defaultOptionId: string;
  options: {
    id: string;
    label: string;
  }[];
}

export interface AnswerDirection {
  id: AnswerDirectionId;
  title: string;
  badge: string;
  headline: string;
  description: string;
  cta: string;
  recommended?: boolean;
}

export interface QualitySignal {
  id: string;
  label: string;
  value: string;
  description?: string;
}

export interface AssumptionItem {
  id: string;
  text: string;
  impact: string;
}

export interface MissingContextItem {
  id: string;
  context: string;
  whyItMatters: string;
}

export interface AlternativeItem {
  id: string;
  perspective: string;
  description: string;
}

export interface RecheckStep {
  id: string;
  label: string;
  description: string;
}

export interface ToastMessage {
  id: string;
  message: string;
  duration?: number;
}

export interface SourcePassage {
  id: string;
  title: string;
  urlLabel: string;
  passage: string;
  highlightedSentence: string;
}

export interface HighlightDefinition {
  id: string;
  kind: HighlightKind;
  label: "Source" | "Verify" | "Assumption" | "Product logic";
  text: string;
  tooltipTitle: string;
  tooltipBody: string;
  sourceId?: string;
}

export interface ClaimItem {
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
}

export type FinalAnswerSegment =
  | {
      type: "text";
      text: string;
    }
  | {
      type: "highlight";
      highlightId: string;
      text: string;
    };

export type FinalAnswerBlock =
  | {
      type: "heading";
      text: string;
    }
  | {
      type: "paragraph";
      segments: FinalAnswerSegment[];
    }
  | {
      type: "section";
      title: string;
      segments: FinalAnswerSegment[];
    }
  | {
      type: "list";
      items: FinalAnswerSegment[][];
    };

export interface EmptyStateCopy {
  title: string;
  subtitle: string;
  capabilities: {
    title: string;
    description: string;
  }[];
  samplePromptButton: string;
}

export interface ModalState {
  sourcePassageOpen: boolean;
  activeSourceId: string | null;
}

export interface AppState {
  workflowStep: WorkflowStep;
  composerValue: string;
  originalPrompt: string;
  editableOriginalPrompt: string;
  improvedPrompt: string;
  selectedClarifications: ClarificationSelections;
  selectedPromptMode: "original" | "improved";
  selectedDirection: AnswerDirectionId | null;
  trustLensOpen: boolean;
  activeTrustLensTab: TrustLensTab;
  activeTooltipId: string | null;
  modalState: ModalState;
  recheckStatus: RecheckStatus;
  recheckProgressStep: number;
  recheckComplete: boolean;
  toast: ToastMessage | null;
  contextInputOpen: boolean;
  addedContextDraft: string;
  extraAssistantMessages: string[];
}

export type ApiResult<T> =
  | { success: true; data: T; meta?: unknown }
  | {
      success: false;
      error: { code: string; message: string; details?: unknown[] };
      meta?: unknown;
    };
```

## 3. Complete Copy Inventory

Target file during implementation:

```text
src/data/trustLensCopy.ts
```

```ts
export const readinessCopy = {
  title: "Prompt Readiness Check",
  badge: "Medium answer-quality risk",
  explanation:
    "This prompt may produce a useful answer, but the goal, audience, required depth, and verification needs are not fully clear.",
  intro: "Answer 3 quick questions to improve the prompt.",
  generateButton: "Generate improved prompt",
  skipButton: "Skip and continue",
  editOriginalButton: "Edit original prompt",
};

export const improvedPromptCopy = {
  title: "Improved Prompt Preview",
  description:
    "Based on your clarification, ChatGPT can use a more specific prompt to generate a stronger answer.",
  originalLabel: "Original prompt",
  improvedLabel: "Improved prompt",
  useButton: "Use improved prompt",
  continueButton: "Continue with original prompt",
  resetButton: "Reset improved prompt",
};

export const directionCopy = {
  loadingText: "Generating answer directions...",
  title: "Choose an answer direction",
  subtitle:
    "Before generating the final response, choose the format that best matches your intent.",
};

export const finalAnswerCopy = {
  loadingPrefix: "Generating final answer using",
  recheckButton: "Recheck Output",
  moreActionsLabel: "More actions",
  moreActionsMenu: [
    "Recheck with Trust Lens",
    "Copy draft",
    "Ask for alternative view",
  ],
};

export const trustLensCopy = {
  title: "Trust Lens",
  ariaLabel: "Trust Lens review panel",
  subheader: "Review output quality before acting on this response.",
  badge: "Review recommended",
  summary:
    "This answer is useful as a product concept, but some claims depend on assumptions, missing context, and validation through user research.",
  collapsedRailLabel: "Trust Lens",
};

export const recheckCopy = {
  title: "Rechecking output...",
  completeMessage: "Recheck complete",
  summaryTitle: "Recheck Summary",
  summaryText:
    "Trust Lens reviewed 4 claims in this answer. Most of the product logic is plausible, but several claims should be validated through user research before being used in a final deck.",
  openClaimsButton: "Open Claims",
  viewHighlightedOutputButton: "View highlighted output",
  addMissingContextButton: "Add missing context",
};

export const toastMessages = {
  addToRecheck: "Added to Recheck Output.",
  contextAdded: "Context added to next revision.",
  useAsDraft: "Marked as draft. Review before sharing externally.",
  regenerate: "Mock regenerated answer preview prepared.",
  alternativeView: "Alternative view requested.",
  historyUnavailable: "Mock chat history is not connected in this prototype.",
  settingsUnavailable: "Settings are not part of this prototype.",
  modelSelectorMocked: "Model selection is mocked for this prototype.",
  sourceUnavailable: "Source passage unavailable in prototype.",
};

export const alternativeViewMessage =
  "Alternative view: Trust Lens could create friction if it appears too often. A stronger product approach may use risk-based activation, showing the full review panel for high-stakes or low-context prompts while keeping it optional for simple drafting tasks.";
```

## 4. Missing Component Prop Contracts

Target component interfaces:

```ts
export interface LoadingMessageProps {
  text: string;
  reducedMotion?: boolean;
}

export interface UserMessageProps {
  content: string;
}

export interface RecheckButtonProps {
  onRecheck: () => void;
  disabled?: boolean;
  loading?: boolean;
}

export interface MoreActionsMenuProps {
  items: {
    id: string;
    label: string;
    onClick: () => void;
  }[];
  ariaLabel?: string;
}

export interface RecheckProgressProps {
  steps: RecheckStep[];
  activeStepIndex: number;
  status: "running" | "complete";
  onClose?: () => void;
}

export interface RecheckSummaryProps {
  claimsReviewed: number;
  supported: number;
  needsVerification: number;
  assumptionInference: number;
  conflictingEvidence: number;
  onOpenClaims: () => void;
  onViewHighlightedOutput: () => void;
  onAddMissingContext: () => void;
}

export interface CollapsedTrustLensRailProps {
  onOpen: () => void;
}
```

## 5. State Machine Guards And Action Resolutions

Target file during implementation:

```text
src/state/appReducer.ts
```

Required guards:

```ts
case "SUBMIT_PROMPT": {
  if (state.workflowStep !== "initial") return state;
  const prompt = state.composerValue.trim();
  if (!prompt) return state;
  // Store prompt, clear composer, reset post-final state.
}

case "USE_SAMPLE_PROMPT": {
  // Fill composer only. Do not auto-submit.
}

case "SELECT_ANSWER_DIRECTION": {
  if (state.workflowStep !== "answer_directions_ready") return state;
  // Store direction and move to final_answer_loading.
}

case "START_RECHECK": {
  if (state.workflowStep !== "final_answer_ready") return state;
  if (state.recheckStatus === "running") return state;
  // Open Trust Lens and start recheck.
}

case "OPEN_SOURCE_MODAL": {
  // Only open when sourceId exists.
  // Verify/assumption highlights should not call this.
}

case "ASK_ALTERNATIVE_VIEW": {
  // Append alternativeViewMessage to extraAssistantMessages.
}

case "MOCK_REGENERATE": {
  // Do not reset to initial.
  // Stay on final_answer_ready and show toast:
  // "Mock regenerated answer preview prepared."
}

case "NEW_CHAT": {
  // Reset everything, including recheck timers, modal, tooltip, toast, extra messages.
}
```

Timer rules:

- Clear timers when `workflowStep` changes unexpectedly.
- Ignore timed completion actions if current state does not match expected source state.
- New chat during recheck must cancel pending recheck timers.

## 6. Responsive CSS Contracts

Add these tokens to `src/index.css`:

```css
:root {
  --tl-duration-fast: 150ms;
  --tl-duration-base: 250ms;
  --tl-duration-slow: 350ms;
  --tl-duration-panel: 400ms;

  --z-sidebar: 30;
  --z-trust-lens-panel: 40;
  --z-recheck-progress: 45;
  --z-modal: 50;
  --z-toast: 60;
}
```

Layout behavior:

```css
.app-shell {
  min-height: 100dvh;
}

@media (min-width: 1024px) {
  .app-shell {
    display: grid;
    grid-template-columns: 260px minmax(0, 1fr);
  }

  .app-shell[data-trust-lens="open"] {
    grid-template-columns: 260px minmax(420px, 1fr) 420px;
  }
}

@media (min-width: 640px) and (max-width: 1023px) {
  .trust-lens-panel {
    position: fixed;
    inset: 0 0 0 auto;
    width: min(100vw, 440px);
    z-index: var(--z-trust-lens-panel);
  }
}

@media (max-width: 639px) {
  .trust-lens-panel {
    position: fixed;
    inset: 0;
    width: 100vw;
    z-index: var(--z-trust-lens-panel);
  }
}
```

Composer rule:

- On mobile, Trust Lens drawer overlays the composer while open.
- When drawer is closed, composer remains sticky and usable.

## 7. Accessibility Contracts

```ts
export interface TrustLensPanelAria {
  ariaLabel: "Trust Lens review panel";
  ariaDescribedBy: string;
}

export interface TrustLensTabsAria {
  tabListLabel: "Review categories";
  getTabId: (tab: TrustLensTab) => string;
  getPanelId: (tab: TrustLensTab) => string;
}

export interface InlineHighlightAria {
  triggerAriaLabel: string;
  popoverAriaLabel: string;
  ariaExpanded: boolean;
  ariaControls: string;
}

export interface RecheckProgressAria {
  liveRegionText: string;
  ariaLive: "polite";
}

export interface SourceModalAria {
  ariaLabel: "Source passage viewer";
  returnFocusToTrigger: boolean;
}
```

Implementation requirements:

- `TrustLensPanel` uses `aria-label="Trust Lens review panel"`.
- `TrustLensTabs` uses `role="tablist"`, `role="tab"`, and `role="tabpanel"`.
- Inline highlight triggers use `aria-expanded` and `aria-controls`.
- Recheck progress announces: `Step X of 6: <step label>`.
- Source modal uses `role="dialog"` and `aria-modal="true"`.
- Source modal returns focus to the trigger highlight after close.

## 8. Tailwind And OKLCH Configuration

Target file:

```text
tailwind.config.js
```

```js
/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        "tl-bg": "oklch(0.975 0.006 95)",
        "tl-surface": "oklch(0.995 0.004 95)",
        "tl-surface-muted": "oklch(0.94 0.006 95)",
        "tl-panel": "oklch(0.985 0.005 95)",
        "tl-sidebar": "oklch(0.22 0.008 95)",
        "tl-sidebar-muted": "oklch(0.34 0.008 95)",
        "tl-text": "oklch(0.22 0.01 95)",
        "tl-text-muted": "oklch(0.48 0.01 95)",
        "tl-text-soft": "oklch(0.62 0.01 95)",
        "tl-border": "oklch(0.86 0.008 95)",
        "tl-border-strong": "oklch(0.74 0.01 95)",
        "tl-accent": "oklch(0.54 0.13 245)",
        "tl-source": "oklch(0.47 0.11 150)",
        "tl-source-bg": "oklch(0.94 0.035 150)",
        "tl-verify": "oklch(0.58 0.12 78)",
        "tl-verify-bg": "oklch(0.95 0.05 78)",
        "tl-assumption": "oklch(0.55 0.11 245)",
        "tl-assumption-bg": "oklch(0.94 0.035 245)",
        "tl-conflict": "oklch(0.52 0.15 28)",
        "tl-conflict-bg": "oklch(0.95 0.035 28)",
      },
      borderRadius: {
        "tl-sm": "6px",
        "tl-md": "8px",
        "tl-lg": "10px",
      },
      fontFamily: {
        sans: ["Geist", "Segoe UI", "system-ui", "sans-serif"],
        mono: ["Geist Mono", "SFMono-Regular", "Consolas", "monospace"],
      },
      transitionDuration: {
        "tl-fast": "150ms",
        "tl-base": "250ms",
        "tl-slow": "350ms",
        "tl-panel": "400ms",
      },
      zIndex: {
        sidebar: "30",
        "trust-lens": "40",
        recheck: "45",
        modal: "50",
        toast: "60",
      },
    },
  },
  plugins: [],
};
```

## 9. Edge Case Specifications

| Edge Case | Required Behavior |
| --- | --- |
| Empty improved prompt | Disable `Use improved prompt`, keep `Continue with original prompt` available. |
| Double recheck click | Disable button while running or ignore second click. |
| New chat during recheck | Reset all state and cancel timers. |
| Direction click during final loading | Ignore, cards disabled. |
| Source modal for non-source highlight | Show fallback: `Source passage unavailable in prototype.` |
| Mobile orientation change with panel open | Keep panel open and adapt layout. |
| Reduced motion preference | All transitions become instant or near-instant. |
| Source missing | Show fallback modal with back button. |
| Prompt submit while not initial | Ignore unless future multi-turn support is added. |
| Recheck polling failure in future API mode | Keep old claims, show retry toast. |

## 10. Package Specification

Target file during implementation:

```text
package.json
```

```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "preview": "vite preview",
    "lint": "eslint ."
  },
  "dependencies": {
    "@vitejs/plugin-react": "^4.3.0",
    "lucide-react": "^0.468.0",
    "react": "^18.3.1",
    "react-dom": "^18.3.1"
  },
  "devDependencies": {
    "@types/react": "^18.3.0",
    "@types/react-dom": "^18.3.0",
    "@typescript-eslint/eslint-plugin": "^7.0.0",
    "@typescript-eslint/parser": "^7.0.0",
    "autoprefixer": "^10.4.0",
    "eslint": "^8.57.0",
    "postcss": "^8.4.0",
    "tailwindcss": "^3.4.0",
    "typescript": "^5.4.0",
    "vite": "^5.3.0"
  }
}
```

Note:

- Keep package versions reasonably current at implementation time.
- If Vite scaffolding creates newer compatible versions, prefer the scaffolded versions unless they conflict with this contract.

## 11. Codex-Ready Implementation Checklist

### Phase 1: Foundation

- [ ] Create `src/state/appTypes.ts` with all types from Section 2.
- [ ] Create `src/data/trustLensMockData.ts` with all data from Section 1.
- [ ] Create `src/data/trustLensCopy.ts` with copy from Section 3.
- [ ] Configure `tailwind.config.js` with OKLCH tokens from Section 8.
- [ ] Configure `src/index.css` with CSS variables and responsive contracts.
- [ ] Create `package.json` with required dependencies.
- [ ] Initialize Vite, React, TypeScript, and Tailwind.

### Phase 2: Shell And Layout

- [ ] Build `AppLayout`.
- [ ] Build `Sidebar`.
- [ ] Build `TopBar`.
- [ ] Build `Composer`.
- [ ] Build `EmptyState`.
- [ ] Implement desktop, tablet, and mobile layout rules.

### Phase 3: State Machine And Flow

- [ ] Implement `appReducer.ts` with guarded transitions.
- [ ] Implement timers in `App.tsx`.
- [ ] Implement `ChatArea` render gates.
- [ ] Implement `UserMessage`.
- [ ] Implement `LoadingMessage`.
- [ ] Confirm Trust Lens render gate is final-answer-only.

### Phase 4: Pre-Generation Flow

- [ ] Build `PromptReadinessCard`.
- [ ] Build `ClarifyingQuestions`.
- [ ] Build `ImprovedPromptPreview`.
- [ ] Build `AnswerDirectionPreviewCards`.

### Phase 5: Final Answer And Highlights

- [ ] Build `FinalOutput`.
- [ ] Build `InlineHighlight`.
- [ ] Implement highlight popovers.
- [ ] Implement `RecheckButton`.
- [ ] Implement `MoreActionsMenu`.
- [ ] Add scroll management.

### Phase 6: Trust Lens Panel

- [ ] Build `TrustLensPanel`.
- [ ] Build `CollapsedTrustLensRail`.
- [ ] Build `TrustLensTabs`.
- [ ] Build Quality, Assumptions, Missing Context, Claims, and Alternatives tabs.
- [ ] Build `DecisionBar`.

### Phase 7: Recheck And Source

- [ ] Build `RecheckProgress`.
- [ ] Build `RecheckSummary`.
- [ ] Build `SourcePassageModal`.
- [ ] Implement post-recheck claim updates.

### Phase 8: Polish And QA

- [ ] Implement reduced motion.
- [ ] Implement keyboard accessibility.
- [ ] Implement toast system.
- [ ] Verify no nested cards.
- [ ] Verify no numeric trust score.
- [ ] Verify Recheck Output is visible below final answer.
- [ ] Verify Trust Lens never appears before final answer.

## 12. Critical Warnings

- `canShowTrustLens = workflowStep === "final_answer_ready"` only.
- Never derive Trust Lens visibility from prompt existence, readiness completion, or direction visibility.
- Do not implement numeric trust scores.
- Do not render the final answer from raw HTML.
- Keep `Recheck Output` visible below final answer.
- Source modal must show the exact supporting sentence.
- Source-backed means support for a specific claim, not the whole answer.
- Default to mock mode. Do not implement real API calls, auth, or backend integration unless explicitly requested.
