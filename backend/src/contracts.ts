import { existsSync, readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

type JsonValue =
  | string
  | number
  | boolean
  | null
  | JsonValue[]
  | { [key: string]: JsonValue };

export type JsonSchema = Record<string, JsonValue>;

const moduleDir = dirname(fileURLToPath(import.meta.url));

const candidateContractDirs = [
  process.env.CONTRACTS_DIR,
  resolve(moduleDir, "../../microservice/contracts"),
  resolve(moduleDir, "contracts-json")
].filter(Boolean) as string[];

const contractsDir = candidateContractDirs.find((candidate) =>
  existsSync(resolve(candidate, "common.schema.json"))
);

if (!contractsDir) {
  throw new Error(
    `Unable to locate Trust Lens contract schemas. Checked: ${candidateContractDirs.join(", ")}`
  );
}

const sanitizeSchema = (value: JsonValue): JsonValue => {
  if (Array.isArray(value)) return value.map(sanitizeSchema);
  if (value && typeof value === "object") {
    const next: Record<string, JsonValue> = {};
    for (const [key, child] of Object.entries(value)) {
      if (key === "$schema") continue;
      next[key] = sanitizeSchema(child);
    }
    return next;
  }
  return value;
};

const loadSchema = (fileName: string, idOverride?: string): JsonSchema => {
  const raw = JSON.parse(readFileSync(resolve(contractsDir, fileName), "utf8")) as JsonSchema;
  const schema = sanitizeSchema(raw) as JsonSchema;
  if (idOverride) schema.$id = idOverride;
  return schema;
};

export const contracts = {
  common: loadSchema("common.schema.json"),
  sessionCreateRequest: loadSchema("session-create.request.schema.json"),
  sessionCreateResponse: loadSchema("session-create.response.schema.json"),
  promptReadinessRequest: loadSchema("prompt-readiness.request.schema.json"),
  promptReadinessResponse: loadSchema("prompt-readiness.response.schema.json"),
  improvedPromptRequest: loadSchema("improved-prompt.request.schema.json"),
  improvedPromptResponse: loadSchema("improved-prompt.response.schema.json"),
  answerDirectionsRequest: loadSchema("answer-directions.request.schema.json"),
  answerDirectionsResponse: loadSchema("answer-directions.response.schema.json"),
  finalAnswerRequest: loadSchema("final-answer.request.schema.json"),
  finalAnswerResponse: loadSchema("final-answer.response.schema.json"),
  recheckStartRequest: loadSchema("recheck-start.request.schema.json"),
  recheckStartResponse: loadSchema("recheck-start.response.schema.json"),
  recheckStatusResponse: loadSchema("recheck-status.response.schema.json"),
  sourcePassageResponse: loadSchema("source-passage.response.schema.json")
};
