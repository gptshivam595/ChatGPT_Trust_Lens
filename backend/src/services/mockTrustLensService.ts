import type {
  JsonObject,
  StoredRecheckJob,
  StoredSourcePassage,
  TrustLensStore,
  TrustLensStoreSnapshot
} from "../persistence/types.js";
import { TrustLensAiOrchestrator } from "../ai/orchestrator.js";
import type { AppConfig } from "../config.js";
import { ApiError } from "../utils/errors.js";

type ClarificationAnswer = {
  questionId: string;
  optionId: string;
  label: string;
};

export type CreateSessionInput = {
  clientMode: "prototype" | "production";
  timezone?: string;
  locale?: string;
};

export type PromptReadinessInput = {
  sessionId: string;
  prompt: string;
  context?: JsonObject;
};

export type ImprovePromptInput = {
  sessionId: string;
  readinessId: string;
  originalPrompt: string;
  clarifications: ClarificationAnswer[];
};

export type DirectionsInput = {
  sessionId: string;
  selectedPrompt: string;
  selectedPromptMode: "original" | "improved";
  clarifications?: ClarificationAnswer[];
};

export type FinalAnswerInput = {
  sessionId: string;
  selectedPrompt: string;
  selectedPromptMode: "original" | "improved";
  selectedDirectionId: "summary" | "analysis" | "decision_ready";
};

export type RecheckStartInput = {
  sessionId: string;
  answerId: string;
  mode: "claim_level";
  includeSourcePassages?: boolean;
};

const nowIso = () => new Date().toISOString();

const nextId = (prefix: string, count: number) =>
  `${prefix}_${String(count + 1).padStart(3, "0")}`;

const assertSessionExists = (snapshot: TrustLensStoreSnapshot, sessionId: string) => {
  if (!snapshot.sessions[sessionId]) {
    throw new ApiError("NOT_FOUND", "Trust Lens session was not found.", 404);
  }
};

const assertAnswerExists = (snapshot: TrustLensStoreSnapshot, answerId: string) => {
  if (!snapshot.generatedAnswers[answerId]) {
    throw new ApiError("NOT_FOUND", "Final answer was not found.", 404);
  }
};

const defaultSourcePassage = (): StoredSourcePassage => ({
  id: "source_mock_001",
  title: "Trust Lens Product Definition",
  urlLabel: "Internal planning docs",
  passage:
    "Trust Lens helps users refine prompts, compare answer directions, and review assumptions, uncertainty, missing context, and claims before acting on an AI response.",
  highlightedSentence:
    "Trust Lens helps users refine prompts, compare answer directions, and review assumptions, uncertainty, missing context, and claims before acting on an AI response.",
  createdAt: nowIso()
});

const ensureDefaultSourcePassage = (snapshot: TrustLensStoreSnapshot) => {
  if (!snapshot.sourcePassages.source_mock_001) {
    snapshot.sourcePassages.source_mock_001 = defaultSourcePassage();
  }
};

const promptReadinessPayload = () => ({
  readinessId: "readiness_mock_001",
  riskBadge: "Medium answer-quality risk",
  explanation:
    "The prompt has a useful direction, but the audience, decision context, and evidence standard need more detail before the final answer is generated.",
  riskChips: [
    { id: "audience", label: "Audience unclear" },
    { id: "evidence", label: "Evidence standard missing" },
    { id: "format", label: "Output format unspecified" }
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
});

const improvedPromptPayload = (input: ImprovePromptInput) => ({
  improvedPromptId: nextId("improved_prompt_mock", 0),
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
});

const answerDirectionsPayload = () => ({
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
      description: "Best when the answer will guide planning, roadmap, or implementation work.",
      cta: "Use decision-ready",
      recommended: true
    }
  ]
});

const highlights: JsonObject[] = [
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

const claimsBeforeRecheck = [
  {
    id: "claim_001",
    claim: "Trust Lens helps users review assumptions and missing context before acting.",
    type: "Product behavior",
    evidenceStatus: "Supported",
    whyVerify: "The claim matches the documented product intent.",
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

const claimsAfterRecheck = claimsBeforeRecheck.map((claim) =>
  claim.id === "claim_004"
    ? {
        ...claim,
        evidenceStatus: "Needs verification",
        suggestedAction: "Test activation thresholds with low-risk and high-stakes prompts."
      }
    : claim
);

const finalAnswerPayload = (input: FinalAnswerInput) => ({
  answerId: nextId("answer_mock", 0),
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
  highlights,
  trustLens: {
    summary:
      "Review recommended. The answer is useful for planning, but the audience choice and product outcome claims still need validation.",
    qualityRows: [
      {
        id: "correctness",
        label: "Correctness",
        status: "Medium confidence",
        note: "The answer follows the documented product model but includes untested outcome claims."
      },
      {
        id: "completeness",
        label: "Completeness",
        status: "Useful draft",
        note: "It covers the main workflow, risks, and implementation direction."
      },
      {
        id: "uncertainty",
        label: "Uncertainty",
        status: "Needs verification",
        note: "Audience and behavior-change claims need evidence."
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
    claims: claimsBeforeRecheck,
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
});

const runningRecheckSteps = [
  {
    id: "extract_claims",
    title: "Extracting claims",
    description: "Finding claims that may need review.",
    status: "running"
  },
  {
    id: "classify_evidence",
    title: "Classifying evidence",
    description: "Separating source-backed statements from assumptions.",
    status: "pending"
  },
  {
    id: "update_review",
    title: "Updating review",
    description: "Refreshing claim labels and highlight metadata.",
    status: "pending"
  }
];

const completedRecheckSteps = [
  { ...runningRecheckSteps[0], status: "complete" },
  { ...runningRecheckSteps[1], status: "complete" },
  { ...runningRecheckSteps[2], status: "complete" }
];

type RecheckAiResult = Awaited<ReturnType<TrustLensAiOrchestrator["evaluateRecheck"]>>;

const completeRecheckJob = (job: StoredRecheckJob, result: RecheckAiResult): StoredRecheckJob => {
  const updatedAt = nowIso();
  return {
    ...job,
    status: "complete",
    activeStepIndex: 2,
    steps: completedRecheckSteps,
    summary: result.data.summary as JsonObject,
    claims: result.data.claims as JsonObject[],
    highlights: result.data.highlights as JsonObject[],
    payload: {
      ...(job.payload ?? {}),
      _ai: {
        telemetry: result.telemetry,
        template: result.metadata.template,
        safetyFindings: result.metadata.safetyFindings
      }
    },
    updatedAt,
    completedAt: updatedAt
  };
};

export class MockTrustLensService {
  private readonly ai: TrustLensAiOrchestrator;

  constructor(
    private readonly store: TrustLensStore,
    aiOrConfig?: TrustLensAiOrchestrator | Pick<AppConfig, "aiProvider" | "openaiApiKey" | "defaultModel">
  ) {
    this.ai =
      aiOrConfig instanceof TrustLensAiOrchestrator
        ? aiOrConfig
        : new TrustLensAiOrchestrator(aiOrConfig);
  }

  async createSession(input: CreateSessionInput) {
    return this.store.update((snapshot) => {
      ensureDefaultSourcePassage(snapshot);
      const sessionId = nextId("session_mock", Object.keys(snapshot.sessions).length);
      const createdAt = nowIso();
      const session = {
        sessionId,
        createdAt,
        clientMode: input.clientMode,
        ...(input.timezone ? { timezone: input.timezone } : {}),
        ...(input.locale ? { locale: input.locale } : {})
      };
      snapshot.sessions[sessionId] = session;
      return {
        sessionId,
        createdAt
      };
    });
  }

  async getPromptReadiness(input: PromptReadinessInput) {
    const result = await this.ai.evaluateReadiness(input);
    return this.store.update((snapshot) => {
      assertSessionExists(snapshot, input.sessionId);
      const createdAt = nowIso();
      const promptId = nextId("prompt_mock", Object.keys(snapshot.prompts).length);
      snapshot.prompts[promptId] = {
        promptId,
        sessionId: input.sessionId,
        prompt: input.prompt,
        ...(input.context ? { context: input.context } : {}),
        createdAt
      };

      const payload = result.data as JsonObject & { readinessId: string };
      snapshot.readinessResults[payload.readinessId] = {
        id: payload.readinessId,
        sessionId: input.sessionId,
        createdAt,
        payload: {
          ...payload,
          _ai: {
            telemetry: result.telemetry,
            template: result.metadata.template,
            safetyFindings: result.metadata.safetyFindings
          }
        } as unknown as JsonObject
      };
      return payload;
    });
  }

  async generateImprovedPrompt(input: ImprovePromptInput) {
    const result = await this.ai.generateImprovedPrompt(input);
    return this.store.update((snapshot) => {
      assertSessionExists(snapshot, input.sessionId);
      const payload = result.data as unknown as JsonObject & { improvedPromptId: string };
      snapshot.improvedPrompts[payload.improvedPromptId] = {
        id: payload.improvedPromptId,
        sessionId: input.sessionId,
        createdAt: nowIso(),
        payload: {
          ...payload,
          _ai: {
            telemetry: result.telemetry,
            template: result.metadata.template,
            safetyFindings: result.metadata.safetyFindings
          }
        } as unknown as JsonObject
      };
      return payload;
    });
  }

  async getAnswerDirections(input: DirectionsInput) {
    const result = await this.ai.planAnswerDirections(input);
    return this.store.update((snapshot) => {
      assertSessionExists(snapshot, input.sessionId);
      const payload = result.data;
      const id = nextId("direction_set_mock", Object.keys(snapshot.answerDirectionSets).length);
      snapshot.answerDirectionSets[id] = {
        id,
        sessionId: input.sessionId,
        createdAt: nowIso(),
        payload: {
          ...payload,
          selectedPrompt: input.selectedPrompt,
          selectedPromptMode: input.selectedPromptMode,
          clarifications: input.clarifications ?? [],
          _ai: {
            telemetry: result.telemetry,
            template: result.metadata.template,
            safetyFindings: result.metadata.safetyFindings
          }
        } as unknown as JsonObject
      };
      return payload;
    });
  }

  async generateFinalAnswer(input: FinalAnswerInput) {
    const result = await this.ai.generateFinalAnswer(input);
    return this.store.update((snapshot) => {
      assertSessionExists(snapshot, input.sessionId);
      ensureDefaultSourcePassage(snapshot);
      const payload = result.data as unknown as JsonObject & {
        answerId: string;
        selectedDirectionId: FinalAnswerInput["selectedDirectionId"];
      };
      snapshot.generatedAnswers[payload.answerId] = {
        id: payload.answerId,
        answerId: payload.answerId,
        sessionId: input.sessionId,
        selectedDirectionId: input.selectedDirectionId,
        createdAt: nowIso(),
        payload: {
          ...payload,
          selectedPrompt: input.selectedPrompt,
          selectedPromptMode: input.selectedPromptMode,
          _ai: {
            telemetry: result.telemetry,
            template: result.metadata.template,
            safetyFindings: result.metadata.safetyFindings
          }
        } as unknown as JsonObject
      };
      return payload;
    });
  }

  async startRecheck(input: RecheckStartInput) {
    return this.store.update((snapshot) => {
      assertSessionExists(snapshot, input.sessionId);
      assertAnswerExists(snapshot, input.answerId);

      const existingRunningJob = Object.values(snapshot.recheckJobs).find(
        (job) => job.answerId === input.answerId && job.status === "running"
      );
      if (existingRunningJob) {
        throw new ApiError(
          "RECHECK_ALREADY_RUNNING",
          "A recheck job is already running for this answer.",
          409
        );
      }

      const jobId = nextId("job_mock_recheck", Object.keys(snapshot.recheckJobs).length);
      const createdAt = nowIso();
      const job: StoredRecheckJob = {
        jobId,
        sessionId: input.sessionId,
        answerId: input.answerId,
        mode: input.mode,
        status: "running",
        activeStepIndex: 0,
        steps: runningRecheckSteps,
        createdAt,
        updatedAt: createdAt,
        payload: {
          includeSourcePassages: input.includeSourcePassages ?? true
        }
      };
      snapshot.recheckJobs[jobId] = job;

      return {
        jobId,
        status: job.status,
        activeStepIndex: job.activeStepIndex,
        steps: job.steps
      };
    });
  }

  async getRecheckStatus(jobId: string) {
    const currentSnapshot = await this.store.read();
    const currentJob = currentSnapshot.recheckJobs[jobId];
    if (!currentJob) {
      throw new ApiError("NOT_FOUND", "Recheck job was not found.", 404);
    }

    const answer = currentSnapshot.generatedAnswers[currentJob.answerId];
    const evaluation =
      currentJob.status === "running" && answer
        ? await this.ai.evaluateRecheck(answer.payload)
        : undefined;

    return this.store.update((snapshot) => {
      const job = snapshot.recheckJobs[jobId];
      if (!job) {
        throw new ApiError("NOT_FOUND", "Recheck job was not found.", 404);
      }

      const nextJob = job.status === "running" && evaluation ? completeRecheckJob(job, evaluation) : job;
      snapshot.recheckJobs[jobId] = nextJob;

      return {
        jobId: nextJob.jobId,
        status: nextJob.status,
        activeStepIndex: nextJob.activeStepIndex,
        steps: nextJob.steps,
        ...(nextJob.summary ? { summary: nextJob.summary } : {}),
        ...(nextJob.claims ? { claims: nextJob.claims } : {}),
        ...(nextJob.highlights ? { highlights: nextJob.highlights } : {}),
        ...(nextJob.failureReason ? { failureReason: nextJob.failureReason } : {})
      };
    });
  }

  async getSourcePassage(sourceId: string) {
    const retrieved = await this.ai.getSource(sourceId);
    return this.store.update((snapshot) => {
      ensureDefaultSourcePassage(snapshot);
      if (!snapshot.sourcePassages[sourceId] && retrieved) {
        snapshot.sourcePassages[sourceId] = {
          id: retrieved.id,
          title: retrieved.title,
          urlLabel: retrieved.urlLabel,
          passage: retrieved.passage,
          highlightedSentence: retrieved.highlightedSentence,
          createdAt: nowIso()
        };
      }
      const source = snapshot.sourcePassages[sourceId];
      if (!source) {
        throw new ApiError("NOT_FOUND", "Source passage was not found.", 404);
      }

      return {
        id: source.id,
        title: source.title,
        urlLabel: source.urlLabel,
        passage: source.passage,
        highlightedSentence: source.highlightedSentence
      };
    });
  }
}
