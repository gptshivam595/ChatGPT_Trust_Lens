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

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const textValue = (value: unknown, fallback: string) => {
  if (typeof value === "string" && value.trim().length > 0) {
    return value.trim();
  }

  if (typeof value === "number" || typeof value === "boolean") {
    return String(value);
  }

  return fallback;
};

const collectPlainText = (value: unknown, depth = 0): string => {
  if (depth > 4 || value == null) return "";
  if (typeof value === "string") return value.trim();
  if (typeof value === "number" || typeof value === "boolean") return String(value);
  if (Array.isArray(value)) {
    return value
      .map((item) => collectPlainText(item, depth + 1))
      .filter(Boolean)
      .join(" ");
  }
  if (isRecord(value)) {
    return Object.entries(value)
      .filter(([key]) => !["id", "type", "kind", "highlightId", "sourceId"].includes(key))
      .map(([, item]) => collectPlainText(item, depth + 1))
      .filter(Boolean)
      .join(" ");
  }
  return "";
};

const slugify = (value: unknown, fallback: string) => {
  const text = textValue(value, fallback)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "")
    .slice(0, 48);
  return text.length > 0 ? text : fallback;
};

const normalizeId = (value: unknown, fallback: string) =>
  typeof value === "string" && value.trim().length > 0 ? value.trim() : fallback;

const textSegment = (text: string) => ({ type: "text", text });

const ensureArray = <T>(value: unknown, fallback: T[]): T[] =>
  Array.isArray(value) ? (value as T[]) : fallback;

const ensureObjectArray = (value: unknown) => (Array.isArray(value) ? value : []);

const normalizeRiskChip = (value: unknown, index: number) => {
  const record = isRecord(value) ? value : { label: value };
  const label = textValue(record.label ?? record.text ?? record.id, `Risk signal ${index + 1}`);
  return {
    id: slugify(record.id ?? label, `risk_${index + 1}`),
    label
  };
};

const qualityLevels = ["Low", "Medium", "Medium to High", "High"] as const;

const normalizeQualityLevel = (value: unknown) => {
  const candidate = textValue(value, "Medium");
  if ((qualityLevels as readonly string[]).includes(candidate)) {
    return candidate;
  }

  const lower = candidate.toLowerCase();
  if (lower.includes("low")) return "Low";
  if (lower.includes("high") && lower.includes("medium")) return "Medium to High";
  if (lower.includes("high")) return "High";
  return "Medium";
};

const normalizeQualityRow = (value: unknown, index: number) => {
  const record = isRecord(value) ? value : { label: value };
  const label = textValue(record.label ?? record.name ?? record.id, `Quality signal ${index + 1}`);
  return {
    id: slugify(record.id ?? label, `quality_${index + 1}`),
    label,
    level: normalizeQualityLevel(record.level ?? record.status ?? record.value)
  };
};

const normalizeOption = (value: unknown, questionIndex: number, optionIndex: number) => {
  const record = isRecord(value) ? value : { label: value };
  const label = textValue(record.label ?? record.text ?? record.value ?? record.id, `Option ${optionIndex + 1}`);
  return {
    id: slugify(record.id ?? record.value ?? label, `q${questionIndex + 1}_option_${optionIndex + 1}`),
    label
  };
};

const normalizeClarifyingQuestion = (value: unknown, index: number) => {
  const record = isRecord(value) ? value : { question: value };
  const question = textValue(record.question ?? record.label ?? record.text, `Clarifying question ${index + 1}?`);
  const options = ensureObjectArray(record.options).map((option, optionIndex) =>
    normalizeOption(option, index, optionIndex)
  );
  const safeOptions =
    options.length > 0
      ? options
      : [
          { id: `q${index + 1}_option_1`, label: "Use a concise answer" },
          { id: `q${index + 1}_option_2`, label: "Use a detailed answer" }
        ];
  const defaultOptionId = textValue(record.defaultOptionId, safeOptions[0].id);

  return {
    id: slugify(record.id ?? question, `question_${index + 1}`),
    question,
    defaultOptionId: safeOptions.some((option) => option.id === defaultOptionId)
      ? defaultOptionId
      : safeOptions[0].id,
    options: safeOptions
  };
};

const sanitizePromptReadiness = (data: PromptReadinessResult, input: PromptReadinessInput) => {
  const candidate = data as Record<string, unknown>;
  const riskChips = ensureObjectArray(candidate.riskChips ?? candidate.risks).map(normalizeRiskChip);
  const qualityRows = ensureObjectArray(candidate.qualityRows).map(normalizeQualityRow);
  const clarifyingQuestions = ensureObjectArray(
    candidate.clarifyingQuestions ?? candidate.clarificationQuestions
  ).map(normalizeClarifyingQuestion);

  return {
    readinessId: normalizeId(candidate.readinessId, `readiness_openai_${Date.now()}`),
    riskBadge: "Medium answer-quality risk",
    explanation: textValue(
      candidate.explanation ?? candidate.summary,
      "The prompt can be answered, but a few details should be clarified before relying on the result."
    ),
    riskChips:
      riskChips.length > 0
        ? riskChips
        : [
            { id: "context", label: "Context may need detail" },
            { id: "evidence", label: "Evidence standard needs review" }
          ],
    qualityRows:
      qualityRows.length > 0
        ? qualityRows
        : [
            { id: "specificity", label: "Prompt specificity", level: "Medium" },
            { id: "actionability", label: "Actionability", level: "Medium to High" }
          ],
    clarifyingQuestions:
      clarifyingQuestions.length > 0
        ? clarifyingQuestions
        : [
            {
              id: "audience",
              question: "Who should the answer be optimized for?",
              defaultOptionId: "primary_user",
              options: [
                { id: "primary_user", label: "Primary user" },
                { id: "stakeholders", label: "Stakeholders" }
              ]
            },
            {
              id: "depth",
              question: "How detailed should the answer be?",
              defaultOptionId: "decision_ready",
              options: [
                { id: "concise", label: "Concise" },
                { id: "decision_ready", label: "Decision-ready" }
              ]
            }
          ],
    originalPrompt: input.prompt
  } as unknown as PromptReadinessResult;
};

const normalizeChange = (value: unknown, index: number) => {
  const record = isRecord(value) ? value : { description: value };
  const description = textValue(
    record.description ?? record.text ?? record.label,
    `Improvement ${index + 1}`
  );
  const label = textValue(record.label ?? record.title, `Change ${index + 1}`);

  return {
    id: slugify(record.id ?? label, `change_${index + 1}`),
    label,
    description
  };
};

const sanitizeImprovedPrompt = (data: ImprovedPromptResult, input: ImprovePromptInput) => {
  const candidate = data as Record<string, unknown>;
  const changes = ensureObjectArray(candidate.changes).map(normalizeChange);

  return {
    improvedPromptId: normalizeId(candidate.improvedPromptId, `improved_prompt_openai_${Date.now()}`),
    originalPrompt: input.originalPrompt,
    improvedPrompt: textValue(candidate.improvedPrompt, input.originalPrompt),
    changes:
      changes.length > 0
        ? changes
        : [
            {
              id: "specificity",
              label: "Added specificity",
              description: "Clarifies the expected scope, audience, and output criteria."
            }
          ]
  } as unknown as ImprovedPromptResult;
};

const directionIds = ["summary", "analysis", "decision_ready"] as const;
type DirectionId = (typeof directionIds)[number];

const directionDefaults: Record<DirectionId, { title: string; badge: string; cta: string }> = {
  summary: { title: "Quick Summary", badge: "Fastest", cta: "Use summary" },
  analysis: { title: "Detailed Analysis", badge: "Broader", cta: "Use analysis" },
  decision_ready: {
    title: "Decision-Ready Output",
    badge: "Recommended",
    cta: "Use decision-ready"
  }
};

const isDirectionId = (value: unknown): value is DirectionId =>
  typeof value === "string" && (directionIds as readonly string[]).includes(value);

const normalizeDirection = (value: unknown, id: DirectionId, index: number, selectedPrompt: string) => {
  const record = isRecord(value) ? value : {};
  const defaults = directionDefaults[id];

  return {
    id,
    title: textValue(record.title, defaults.title),
    badge: textValue(record.badge, defaults.badge),
    headline: textValue(
      record.headline,
      id === "summary"
        ? "Condense the answer into the most important points."
        : id === "analysis"
          ? "Explore tradeoffs, assumptions, and implementation details."
          : "Turn the prompt into a practical, review-ready response."
    ),
    description: textValue(
      record.description,
      `Use this direction for: ${selectedPrompt.slice(0, 140)}`
    ),
    cta: textValue(record.cta, defaults.cta),
    ...(id === "decision_ready" || record.recommended === true ? { recommended: id === "decision_ready" } : {}),
    _index: index
  };
};

const sanitizeAnswerDirections = (data: AnswerDirectionsResult, input: DirectionsInput) => {
  const candidate = data as Record<string, unknown>;
  const generatedDirections = ensureObjectArray(candidate.directions);
  const directions = directionIds.map((id, index) => {
    const match =
      generatedDirections.find((direction) => isRecord(direction) && direction.id === id) ??
      generatedDirections[index];
    const normalized = normalizeDirection(match, id, index, input.selectedPrompt);
    const { _index: _unused, ...direction } = normalized;
    return direction;
  });

  return {
    recommendedDirectionId: isDirectionId(candidate.recommendedDirectionId)
      ? candidate.recommendedDirectionId
      : "decision_ready",
    directions
  } as unknown as AnswerDirectionsResult;
};

const ensureHighlight = (
  value: unknown,
  index: number
): HighlightDefinition => {
  const record = isRecord(value) ? value : { text: value };
  const kind = record.kind;
  const safeKind =
    kind === "source" ||
    kind === "verify" ||
    kind === "assumption" ||
    kind === "product_logic"
      ? kind
      : "verify";
  const labels = {
    source: "Source",
    verify: "Verify",
    assumption: "Assumption",
    product_logic: "Product logic"
  } as const;

  return {
    id: normalizeId(record.id, `hl_openai_${index + 1}`),
    kind: safeKind,
    label: labels[safeKind],
    text: textValue(
      record.text ?? record.claim ?? record.phrase ?? record.quote ?? record.content,
      collectPlainText(record) || "claim to review"
    ),
    tooltipTitle: textValue(record.tooltipTitle, labels[safeKind]),
    tooltipBody: textValue(
      record.tooltipBody ?? record.reason,
      "Review this model-generated point before acting."
    ),
    ...(safeKind === "source" && typeof record.sourceId === "string"
      ? { sourceId: record.sourceId }
      : {})
  };
};

const normalizeSegment = (value: unknown, index: number, highlightIds: Set<string>) => {
  const record = isRecord(value) ? value : { text: value };
  const text = textValue(
    record.text ?? record.content ?? record.label ?? record.title ?? record.description,
    collectPlainText(record)
  );
  if (record.type === "highlight" && text && highlightIds.has(textValue(record.highlightId, ""))) {
    return {
      type: "highlight",
      highlightId: textValue(record.highlightId, `hl_openai_${index + 1}`),
      text
    };
  }

  return textSegment(text || "Review this generated point before acting.");
};

const normalizeSegments = (value: unknown, fallbackText: string, highlightIds: Set<string>) => {
  if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
    return [textSegment(textValue(value, fallbackText))];
  }

  const segments = ensureObjectArray(value).map((segment, index) =>
    normalizeSegment(segment, index, highlightIds)
  );

  return segments.length > 0 ? segments : [textSegment(fallbackText)];
};

const normalizeListItems = (value: unknown, fallbackText: string, highlightIds: Set<string>) => {
  if (!Array.isArray(value)) return [[textSegment(fallbackText)]];

  const items = value.map((item, index) => {
    if (Array.isArray(item)) {
      return normalizeSegments(item, fallbackText, highlightIds);
    }
    return [normalizeSegment(item, index, highlightIds)];
  });

  return items.length > 0 ? items : [[textSegment(fallbackText)]];
};

const normalizeBlocks = (
  value: unknown,
  input: FinalAnswerInput,
  highlightIds: Set<string>,
  fallbackText: string
) => {
  const blocks = ensureObjectArray(value)
    .map((block, index) => {
      const record = isRecord(block) ? block : { type: "paragraph", segments: [{ text: block }] };
      if (record.type === "heading") {
        return {
          type: "heading",
          text: textValue(record.text ?? record.title ?? record.heading ?? record.content, "Generated Answer")
        };
      }
      if (record.type === "section") {
        return {
          type: "section",
          title: textValue(record.title ?? record.heading, `Section ${index + 1}`),
          segments: normalizeSegments(
            record.segments ??
              record.content ??
              record.body ??
              record.text ??
              record.description ??
              record.details ??
              collectPlainText(record),
            fallbackText,
            highlightIds
          )
        };
      }
      if (record.type === "list") {
        return {
          type: "list",
          items: normalizeListItems(
            record.items ?? record.bullets ?? record.points ?? record.steps,
            fallbackText,
            highlightIds
          )
        };
      }
      return {
        type: "paragraph",
        segments: normalizeSegments(
          record.segments ??
            record.content ??
            record.body ??
            record.text ??
            record.description ??
            record.details ??
            collectPlainText(record),
          fallbackText,
          highlightIds
        )
      };
    })
    .filter(Boolean);

  return blocks.length > 0
    ? blocks
    : [
        { type: "heading", text: "Generated Answer" },
        {
          type: "paragraph",
          segments: [textSegment(fallbackText || `Response for: ${input.selectedPrompt.slice(0, 220)}`)]
        }
      ];
};

const evidenceStatuses = [
  "Supported",
  "Needs verification",
  "Conflicting evidence",
  "No clear evidence found",
  "Assumption/inference",
  "Plausible, needs testing",
  "Uncertain"
] as const;

const normalizeEvidenceStatus = (value: unknown) => {
  const candidate = textValue(value, "Needs verification");
  return (evidenceStatuses as readonly string[]).includes(candidate) ? candidate : "Needs verification";
};

const normalizeClaim = (value: unknown, index: number, selectedPrompt: string) => {
  const record = isRecord(value) ? value : { claim: value };
  return {
    id: normalizeId(record.id, `claim_openai_${index + 1}`),
    claim: textValue(record.claim ?? record.text, `Review generated claim for: ${selectedPrompt.slice(0, 120)}`),
    type: textValue(record.type ?? record.category, "Generated claim"),
    evidenceStatus: normalizeEvidenceStatus(record.evidenceStatus ?? record.status),
    whyVerify: textValue(
      record.whyVerify ?? record.reason,
      "This point was generated by the model and should be verified before acting."
    ),
    suggestedAction: textValue(
      record.suggestedAction ?? record.action,
      "Check the claim against trusted sources or real project data."
    )
  };
};

const finalQualityRowTemplates = [
  {
    id: "correctness",
    label: "Correctness",
    status: "Medium",
    note: "Rates how correct the output appears based on the available prompt, context, and visible claims.",
    aliases: ["correctness", "accuracy", "factuality", "truthfulness"]
  },
  {
    id: "completeness",
    label: "Completeness",
    status: "Medium",
    note: "Rates whether the output covers the important parts of the user's request.",
    aliases: ["completeness", "coverage", "thoroughness"]
  },
  {
    id: "reasoning-quality",
    label: "Reasoning Quality",
    status: "Medium",
    note: "Rates whether the output's logic is clear, consistent, and reasonable.",
    aliases: ["reasoning_quality", "reasoning", "logic", "logical_quality", "coherence", "reasonable"]
  },
  {
    id: "uncertainty",
    label: "Uncertainty",
    status: "Medium",
    note: "Rates how much ambiguity, missing evidence, or verification need remains.",
    aliases: ["uncertainty", "uncertainity", "uncertain", "ambiguity", "verification_need"]
  }
] as const;

const normalizeFinalQualityStatus = (value: unknown) => {
  const candidate = textValue(value, "Medium");
  const lower = candidate.toLowerCase();
  if (lower.includes("low")) return "Low";
  if (lower.includes("high")) return "High";
  return "Medium";
};

const normalizeFinalQualityRow = (value: unknown, index: number) => {
  const record = isRecord(value) ? value : { note: value };
  const label = textValue(record.label ?? record.name, "");
  return {
    id: slugify(record.id ?? label, `quality_openai_${index + 1}`),
    label,
    status: normalizeFinalQualityStatus(record.status ?? record.value ?? record.level),
    note: textValue(record.note ?? record.description, "Review this generated content before acting.")
  };
};

const normalizeFinalQualityRows = (value: unknown) => {
  const rows = ensureObjectArray(value).map(normalizeFinalQualityRow);

  return finalQualityRowTemplates.map(({ aliases, ...template }) => {
    const match = rows.find((row) => {
      const rowId = slugify(row.id, "");
      const rowLabel = slugify(row.label, "");
      const aliasValues: readonly string[] = aliases;
      return (
        rowId === template.id ||
        rowLabel === template.id ||
        aliasValues.includes(rowId) ||
        aliasValues.includes(rowLabel)
      );
    });

    return {
      ...template,
      ...(match
        ? {
            status: match.status,
            note: match.note
          }
        : {})
    };
  });
};

const normalizeAssumption = (value: unknown, index: number) => {
  const record = isRecord(value) ? value : { text: value };
  return {
    id: normalizeId(record.id, `assumption_openai_${index + 1}`),
    text: textValue(record.text ?? record.assumption, "Generated assumption"),
    impact: textValue(record.impact ?? record.whyItMatters, "This affects how reliable the answer is.")
  };
};

const normalizeMissingContext = (value: unknown, index: number) => {
  const record = isRecord(value) ? value : { text: value };
  return {
    id: normalizeId(record.id, `missing_openai_${index + 1}`),
    text: textValue(record.text ?? record.context, "Missing context"),
    whyItMatters: textValue(
      record.whyItMatters ?? record.impact,
      "This could change the recommended answer."
    )
  };
};

const normalizeAlternative = (value: unknown, index: number) => {
  const record = isRecord(value) ? value : { title: value };
  return {
    id: normalizeId(record.id, `alt_openai_${index + 1}`),
    title: textValue(record.title ?? record.perspective, `Alternative ${index + 1}`),
    description: textValue(record.description, "Consider this path before deciding.")
  };
};

const sanitizeFinalAnswer = (data: FinalAnswerResult, input: FinalAnswerInput) => {
  const candidate = data as Record<string, unknown>;
  const trustLens = (candidate.trustLens ?? {}) as Record<string, unknown>;
  const highlights = ensureArray<unknown>(candidate.highlights, []).map(ensureHighlight);
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
  const highlightIds = new Set(safeHighlights.map((highlight) => String(highlight.id)));
  const fallbackAnswerText = textValue(
    trustLens.summary,
    `Response for: ${input.selectedPrompt.slice(0, 220)}`
  );
  const blocks = normalizeBlocks(
    candidate.blocks ?? candidate.sections ?? candidate.answer ?? candidate.content,
    input,
    highlightIds,
    fallbackAnswerText
  );
  const qualityRows = normalizeFinalQualityRows(trustLens.qualityRows);
  const assumptions = ensureObjectArray(trustLens.assumptions).map(normalizeAssumption);
  const missingContext = ensureObjectArray(trustLens.missingContext).map(normalizeMissingContext);
  const claims = ensureObjectArray(trustLens.claims).map((claim, index) =>
    normalizeClaim(claim, index, input.selectedPrompt)
  );
  const alternatives = ensureObjectArray(trustLens.alternatives).map(normalizeAlternative);

  return {
    answerId: normalizeId(candidate.answerId, `answer_openai_${Date.now()}`),
    selectedDirectionId: input.selectedDirectionId,
    blocks,
    highlights: safeHighlights,
    trustLens: {
      summary: String(trustLens.summary ?? "Review generated answer before acting."),
      qualityRows,
      assumptions,
      missingContext,
      claims:
        claims.length > 0
          ? claims
          : [normalizeClaim(undefined, 0, input.selectedPrompt)],
      alternatives
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

    return {
      data: sanitizePromptReadiness(data, input),
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

    return {
      data: sanitizeImprovedPrompt(data, input),
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
      data: sanitizeAnswerDirections(data, input),
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
matching highlight object. Use kind "verify" for claims that need verification. Use kind "source"
with a sourceId only when the highlighted sentence is backed by a retrieved source passage.
trustLens must include summary, qualityRows, assumptions,
missingContext, claims, and alternatives. trustLens.qualityRows must contain exactly four rows:
Correctness, Completeness, Reasoning Quality, and Uncertainty. Each quality row status must be
Low, Medium, or High. The answer must directly respond to selectedPrompt.`,
      input
    );

    return {
      data: sanitizeFinalAnswer(data, input),
      metadata: metadataFor("finalAnswer", input.selectedPrompt, this.options.model)
    };
  }
}
