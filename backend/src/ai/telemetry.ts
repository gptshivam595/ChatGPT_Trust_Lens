import type { PipelineMetadata, TemplateRef } from "./types.js";

export type AiTelemetryEvent = {
  step: string;
  adapter: "mock" | "openai";
  template: TemplateRef;
  durationMs: number;
  tokenEstimate: number;
  safetyFindingCount: number;
  fallbackReason?: string;
  model?: string;
};

export const estimateTokens = (text: string) => Math.max(1, Math.ceil(text.length / 4));

export const createTelemetryEvent = (
  step: string,
  metadata: PipelineMetadata,
  durationMs: number
): AiTelemetryEvent => ({
  step,
  adapter: metadata.adapter,
  template: metadata.template,
  durationMs,
  tokenEstimate: metadata.tokenEstimate,
  safetyFindingCount: metadata.safetyFindings.length,
  ...(metadata.fallbackReason ? { fallbackReason: metadata.fallbackReason } : {}),
  ...(metadata.model ? { model: metadata.model } : {})
});
