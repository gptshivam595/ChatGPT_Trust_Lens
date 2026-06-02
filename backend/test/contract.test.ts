import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import Ajv2020 from "ajv/dist/2020.js";
import addFormats from "ajv-formats";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import type { FastifyInstance } from "fastify";
import { buildApp } from "../src/app.js";

const contractsDir = resolve("../microservice/contracts");

const loadSchema = (fileName: string) =>
  JSON.parse(readFileSync(resolve(contractsDir, fileName), "utf8"));

const ajv = new Ajv2020({ strict: false, allErrors: true });
addFormats(ajv);
ajv.addSchema(loadSchema("common.schema.json"));

const validateWith = (schemaFile: string, data: unknown) => {
  const validate = ajv.compile(loadSchema(schemaFile));
  const valid = validate(data);
  expect(validate.errors ?? []).toEqual([]);
  expect(valid).toBe(true);
};

describe("Trust Lens API contracts", () => {
  let app: FastifyInstance;

  beforeAll(async () => {
    app = await buildApp({
      port: 0,
      nodeEnv: "test",
      logLevel: "silent",
      corsOrigins: ["http://localhost:5173"],
      storageDriver: "memory",
      dataDir: "data-test",
      aiProvider: "mock",
      retrievalProvider: "mock",
      bodyLimitBytes: 1_000_000,
      rateLimitMax: 100,
      rateLimitWindow: "1 minute"
    });
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it("validates request fixtures against request schemas", () => {
    validateWith("session-create.request.schema.json", { clientMode: "prototype" });
    validateWith("prompt-readiness.request.schema.json", {
      sessionId: "session_mock_001",
      prompt: "Analyze Trust Lens."
    });
    validateWith("final-answer.request.schema.json", {
      sessionId: "session_mock_001",
      selectedPrompt: "Analyze Trust Lens.",
      selectedPromptMode: "improved",
      selectedDirectionId: "decision_ready"
    });
    validateWith("recheck-start.request.schema.json", {
      sessionId: "session_mock_001",
      answerId: "answer_mock_001",
      mode: "claim_level"
    });
  });

  it("validates API responses against response schemas", async () => {
    const sessionResponse = await app.inject({
      method: "POST",
      url: "/api/v1/trust-lens/sessions",
      payload: { clientMode: "prototype" }
    });
    const session = sessionResponse.json();
    validateWith("session-create.response.schema.json", session);

    const readinessResponse = await app.inject({
      method: "POST",
      url: "/api/v1/trust-lens/readiness",
      payload: { sessionId: session.data.sessionId, prompt: "Analyze Trust Lens." }
    });
    validateWith("prompt-readiness.response.schema.json", readinessResponse.json());

    const improvedResponse = await app.inject({
      method: "POST",
      url: "/api/v1/trust-lens/improved-prompt",
      payload: {
        sessionId: session.data.sessionId,
        readinessId: "readiness_mock_001",
        originalPrompt: "Analyze Trust Lens.",
        clarifications: [
          { questionId: "audience", optionId: "product-students", label: "Product students" }
        ]
      }
    });
    validateWith("improved-prompt.response.schema.json", improvedResponse.json());

    const directionsResponse = await app.inject({
      method: "POST",
      url: "/api/v1/trust-lens/directions",
      payload: {
        sessionId: session.data.sessionId,
        selectedPrompt: "Analyze Trust Lens.",
        selectedPromptMode: "improved"
      }
    });
    validateWith("answer-directions.response.schema.json", directionsResponse.json());

    const finalAnswerResponse = await app.inject({
      method: "POST",
      url: "/api/v1/trust-lens/final-answer",
      payload: {
        sessionId: session.data.sessionId,
        selectedPrompt: "Analyze Trust Lens.",
        selectedPromptMode: "improved",
        selectedDirectionId: "decision_ready"
      }
    });
    const finalAnswer = finalAnswerResponse.json();
    validateWith("final-answer.response.schema.json", finalAnswer);

    const recheckStartResponse = await app.inject({
      method: "POST",
      url: "/api/v1/trust-lens/recheck",
      payload: {
        sessionId: session.data.sessionId,
        answerId: finalAnswer.data.answerId,
        mode: "claim_level"
      }
    });
    const recheckStart = recheckStartResponse.json();
    validateWith("recheck-start.response.schema.json", recheckStart);

    const recheckStatusResponse = await app.inject({
      method: "GET",
      url: `/api/v1/trust-lens/recheck/${recheckStart.data.jobId}`
    });
    validateWith("recheck-status.response.schema.json", recheckStatusResponse.json());

    const sourceResponse = await app.inject({
      method: "GET",
      url: "/api/v1/trust-lens/sources/source_mock_001"
    });
    validateWith("source-passage.response.schema.json", sourceResponse.json());
  });
});
