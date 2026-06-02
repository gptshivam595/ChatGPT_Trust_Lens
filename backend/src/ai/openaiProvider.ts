import { getTemplate } from "./promptTemplates.js";
import { scanForPromptInjection } from "./safety.js";
import { estimateTokens } from "./telemetry.js";
import type {
  AnswerDirectionPlanner,
  AnswerDirectionsResult,
  FinalAnswerGenerator,
  FinalAnswerResult,
  HighlightDefinition,
  ImprovedPromptGenerator,
  ImprovedPromptResult,
  PipelineMetadata,
  PromptReadinessEvaluator,
  PromptReadinessResult
} from "./types.js";
import type {
  DirectionsInput,
  FinalAnswerInput,
  ImprovePromptInput,
  PromptReadinessInput
} from "../services/mockTrustLensService.js";

type OpenAiProviderOptions = {
  apiKey: string;
  model: string;
};

type OpenAiTextResponse = {
  output_text?: string;
  output?: Array<{
    content?: Array<{
      text?: string;
    }>;
  }>;
};

const responseEndpoint = "https://api.openai.com/v1/responses";

const metadataFor = (
  templateKey: Parameters<typeof getTemplate>[0],
  sourceText: string,
  model: string
): PipelineMetadata => {
  const template = getTemplate(templateKey);
  return {
    adapter: "openai",
    template: {
      templateId: template.id,
      version: template.version
    },
    safetyFindings: scanForPromptInjection(sourceText),
    tokenEstimate: estimateTokens(sourceText),
    model
  };
};

const extractResponseText = (response: OpenAiTextResponse) => {
  if (response.output_text) {
    return response.output_text;
  }

  return (
    response.output
      ?.flatMap((item) => item.content ?? [])
      .map((content) => content.text ?? "")
      .join("")
      .trim() ?? ""
  );
};

const parseJsonObject = <T>(text: string): T => {
  const trimmed = text.trim();
  const fenced = trimmed.match(/^```(?:json)?\s*([\s\S]*?)\s*```$/i);
  const candidate = fenced?.[1] ?? trimmed;
  return JSON.parse(candidate) as T;
};

const normalizeId = (value: unknown, fallback: string) =>
  typeof value === "string" && value.trim().length > 0 ? value.trim() : fallback;

const textSegment = (text: string) => ({ type: "text", text });

const ensureArray = <T>(value: unknown, fallback: T[]): T[] =>
  Array.isArray(value) ? (value as T[]) : fallback;

const ensureHighlight = (
  value: Record<string, unknown>,
  index: number
): HighlightDefinition => {
  const kind = value.kind;
  const safeKind =
    kind === "source" || kind === "verify" || kind === "assumption" || kind === "product_logic"
      ? kind
      : "verify";
  const labels = {
    source: "Source",
    verify: "Verify",
    assumption: "Assumption",
    product_logic: "Product logic"
  } as const;

  return {
    id: normalizeId(value.id, `hl_openai_${index + 1}`),
    kind: safeKind,
    label: labels[safeKind],
    text: String(value.text ?? "claim to review"),
    tooltipTitle: String(value.tooltipTitle ?? labels[safeKind]),
    tooltipBody: String(value.tooltipBody ?? "Review this model-generated point before acting."),
    ...(safeKind === "source" ? { sourceId: "source_mock_001" } : {})
  };
};

const sanitizeFinalAnswer = (data: FinalAnswerResult, input: FinalAnswerInput) => {
  const candidate = data as Record<string, unknown>;
  const trustLens = (candidate.trustLens ?? {}) as Record<string, unknown>;
  const highlights = ensureArray<Record<string, unknown>>(candidate.highlights, []).map(
    ensureHighlight
  );
  const safeHighlights =
    highlights.length > 0
      ? highlights
      : [
          ensureHighlight(
            {
              id: "hl_openai_1",
              kind: "verify",
              text: "important generated claim",
              tooltipTitle: "Needs verification",
              tooltipBody: "OpenAI generated this point; verify it before acting."
            },
            0
          )
        ];
  const blocks =
    ensureArray(candidate.blocks, []).length > 0
      ? ensureArray(candidate.blocks, [])
      : [
          { type: "heading", text: "Generated Answer" },
          {
            type: "paragraph",
            segments: [
              textSegment("The model generated a response, but the shape needed normalization.")
            ]
          }
        ];

  return {
    answerId: normalizeId(candidate.answerId, `answer_openai_${Date.now()}`),
    selectedDirectionId: input.selectedDirectionId,
    blocks,
    highlights: safeHighlights,
    trustLens: {
      summary: String(trustLens.summary ?? "Review generated answer before acting."),
      qualityRows: ensureArray(trustLens.qualityRows, [
        {
          id: "quality_openai_1",
          label: "Grounding",
          status: "Needs verification",
          note: "OpenAI generated this content from the prompt."
        }
      ]),
      assumptions: ensureArray(trustLens.assumptions, []),
      missingContext: ensureArray(trustLens.missingContext, []),
      claims: ensureArray(trustLens.claims, []),
      alternatives: ensureArray(trustLens.alternatives, [])
    }
  } as unknown as FinalAnswerResult;
};

class OpenAiJsonClient {
  constructor(private readonly options: OpenAiProviderOptions) {}

  async generate<T>(instructions: string, input: unknown): Promise<T> {
    const response = await fetch(responseEndpoint, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.options.apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: this.options.model,
        instructions,
        input: JSON.stringify(input),
        max_output_tokens: 2400
      })
    });

    if (!response.ok) {
      const body = await response.text();
      throw new Error(`OpenAI request failed with HTTP ${response.status}: ${body.slice(0, 300)}`);
    }

    const payload = (await response.json()) as OpenAiTextResponse;
    const text = extractResponseText(payload);
    if (!text) {
      throw new Error("OpenAI response did not include text output.");
    }

    return parseJsonObject<T>(text);
  }
}

const contractInstruction = `
Return only valid JSON. Do not wrap it in Markdown.
Use the user's input as the source of the content.
Do not reuse generic Trust Lens mock copy unless the user explicitly asks about Trust Lens.
`;

export class OpenAiPromptReadinessEvaluator implements PromptReadinessEvaluator {
  private readonly client: OpenAiJsonClient;

  constructor(private readonly options: OpenAiProviderOptions) {
    this.client = new OpenAiJsonClient(options);
  }

  async evaluate(input: PromptReadinessInput) {
    const data = await this.client.generate<PromptReadinessResult>(
      `${contractInstruction}
Create a prompt readiness review JSON object with readinessId, riskBadge exactly
"Medium answer-quality risk", explanation, riskChips, qualityRows, and clarifyingQuestions.
Use 2 clarifying questions with 2-3 options each.`,
      input
    );
    const payload = data as Record<string, unknown>;

    return {
      data: {
        ...payload,
        readinessId: normalizeId(payload.readinessId, `readiness_openai_${Date.now()}`),
        riskBadge: "Medium answer-quality risk"
      } as PromptReadinessResult,
      metadata: metadataFor("readiness", input.prompt, this.options.model)
    };
  }
}

export class OpenAiImprovedPromptGenerator implements ImprovedPromptGenerator {
  private readonly client: OpenAiJsonClient;

  constructor(private readonly options: OpenAiProviderOptions) {
    this.client = new OpenAiJsonClient(options);
  }

  async generate(input: ImprovePromptInput) {
    const data = await this.client.generate<ImprovedPromptResult>(
      `${contractInstruction}
Create an improved prompt JSON object with improvedPromptId, originalPrompt, improvedPrompt,
and changes. The improvedPrompt must be tailored to originalPrompt and the clarifications.`,
      input
    );
    const payload = data as Record<string, unknown>;

    return {
      data: {
        ...payload,
        improvedPromptId: normalizeId(
          payload.improvedPromptId,
          `improved_prompt_openai_${Date.now()}`
        ),
        originalPrompt: input.originalPrompt
      } as ImprovedPromptResult,
      metadata: metadataFor("improvedPrompt", input.originalPrompt, this.options.model)
    };
  }
}

export class OpenAiAnswerDirectionPlanner implements AnswerDirectionPlanner {
  private readonly client: OpenAiJsonClient;

  constructor(private readonly options: OpenAiProviderOptions) {
    this.client = new OpenAiJsonClient(options);
  }

  async plan(input: DirectionsInput) {
    const data = await this.client.generate<AnswerDirectionsResult>(
      `${contractInstruction}
Create exactly three answer directions: summary, analysis, and decision_ready.
Return recommendedDirectionId and directions. Each direction needs id, title, badge, headline,
description, cta, and optional recommended boolean.`,
      input
    );

    return {
      data,
      metadata: metadataFor("directions", input.selectedPrompt, this.options.model)
    };
  }
}

export class OpenAiFinalAnswerGenerator implements FinalAnswerGenerator {
  private readonly client: OpenAiJsonClient;

  constructor(private readonly options: OpenAiProviderOptions) {
    this.client = new OpenAiJsonClient(options);
  }

  async generate(input: FinalAnswerInput) {
    const data = await this.client.generate<FinalAnswerResult>(
      `${contractInstruction}
Create a final answer JSON object with answerId, selectedDirectionId, blocks, highlights,
and trustLens. Blocks must use heading, paragraph, section, or list shapes from the contract.
Use highlight segments for 2-4 important claims. Every highlightId used in blocks must have a
matching highlight object. trustLens must include summary, qualityRows, assumptions,
missingContext, claims, and alternatives. The answer must directly respond to selectedPrompt.`,
      input
    );

    return {
      data: sanitizeFinalAnswer(data, input),
      metadata: metadataFor("finalAnswer", input.selectedPrompt, this.options.model)
    };
  }
}
