import { afterAll, beforeAll, describe, expect, it } from "vitest";
import type { FastifyInstance } from "fastify";
import { buildApp } from "../src/app.js";

describe("Trust Lens backend skeleton", () => {
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
      retrievalProvider: "mock"
    });
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it("returns health status", async () => {
    const response = await app.inject({ method: "GET", url: "/health" });
    const body = response.json();

    expect(response.statusCode).toBe(200);
    expect(body.data.status).toBe("ok");
    expect(body.meta.apiVersion).toBe("v1");
    expect(body.meta.requestId).toMatch(/^req_/);
  });

  it("returns readiness status without external dependencies", async () => {
    const response = await app.inject({ method: "GET", url: "/ready" });
    const body = response.json();

    expect(response.statusCode).toBe(200);
    expect(body.data.status).toBe("ready");
    expect(body.data.dependencies.storage).toBe("memory");
    expect(body.data.dependencies.aiProvider).toBe("mock");
    expect(body.data.dependencies.retrievalProvider).toBe("mock");
    expect(body.data.dependencies.database).toBe("not_configured");
    expect(body.data.dependencies.llmProvider).toBe("not_configured");
  });

  it("validates session creation request bodies", async () => {
    const response = await app.inject({
      method: "POST",
      url: "/api/v1/trust-lens/sessions",
      payload: {}
    });
    const body = response.json();

    expect(response.statusCode).toBe(400);
    expect(body.error.code).toBe("VALIDATION_ERROR");
    expect(body.meta.apiVersion).toBe("v1");
  });

  it("creates a deterministic mock session", async () => {
    const response = await app.inject({
      method: "POST",
      url: "/api/v1/trust-lens/sessions",
      payload: { clientMode: "prototype", timezone: "Asia/Calcutta", locale: "en-IN" }
    });
    const body = response.json();

    expect(response.statusCode).toBe(200);
    expect(body.data.sessionId).toBe("session_mock_001");
    expect(Date.parse(body.data.createdAt)).not.toBeNaN();
  });

  it("returns prompt readiness artifacts", async () => {
    const response = await app.inject({
      method: "POST",
      url: "/api/v1/trust-lens/readiness",
      payload: { sessionId: "session_mock_001", prompt: "Analyze Trust Lens." }
    });
    const body = response.json();

    expect(response.statusCode).toBe(200);
    expect(body.data.riskBadge).toBe("Medium answer-quality risk");
    expect(body.data.clarifyingQuestions.length).toBeGreaterThan(0);
  });

  it("returns final answer with Trust Lens artifacts", async () => {
    const response = await app.inject({
      method: "POST",
      url: "/api/v1/trust-lens/final-answer",
      payload: {
        sessionId: "session_mock_001",
        selectedPrompt: "Analyze Trust Lens.",
        selectedPromptMode: "improved",
        selectedDirectionId: "decision_ready"
      }
    });
    const body = response.json();

    expect(response.statusCode).toBe(200);
    expect(body.data.answerId).toBe("answer_mock_001");
    expect(body.data.blocks.length).toBeGreaterThan(0);
    expect(body.data.highlights.length).toBeGreaterThan(0);
    expect(body.data.trustLens.claims.length).toBeGreaterThan(0);
    expect(body.data.trustLens.summary).toContain("Review recommended");
  });

  it("starts and polls a deterministic mock recheck", async () => {
    const startResponse = await app.inject({
      method: "POST",
      url: "/api/v1/trust-lens/recheck",
      payload: {
        sessionId: "session_mock_001",
        answerId: "answer_mock_001",
        mode: "claim_level"
      }
    });
    const startBody = startResponse.json();

    expect(startResponse.statusCode).toBe(200);
    expect(startBody.data.status).toBe("running");

    const duplicateResponse = await app.inject({
      method: "POST",
      url: "/api/v1/trust-lens/recheck",
      payload: {
        sessionId: "session_mock_001",
        answerId: "answer_mock_001",
        mode: "claim_level"
      }
    });
    const duplicateBody = duplicateResponse.json();

    expect(duplicateResponse.statusCode).toBe(409);
    expect(duplicateBody.error.code).toBe("RECHECK_ALREADY_RUNNING");

    const statusResponse = await app.inject({
      method: "GET",
      url: `/api/v1/trust-lens/recheck/${startBody.data.jobId}`
    });
    const statusBody = statusResponse.json();

    expect(statusResponse.statusCode).toBe(200);
    expect(statusBody.data.status).toBe("complete");
    expect(statusBody.data.summary.claimsReviewed).toBe(4);
  });

  it("returns source passage details", async () => {
    const response = await app.inject({
      method: "GET",
      url: "/api/v1/trust-lens/sources/source_mock_001"
    });
    const body = response.json();

    expect(response.statusCode).toBe(200);
    expect(body.data.id).toBe("source_mock_001");
    expect(body.data.highlightedSentence).toContain("Trust Lens helps users");
  });

  it("returns not found for an unknown source passage", async () => {
    const response = await app.inject({
      method: "GET",
      url: "/api/v1/trust-lens/sources/missing_source"
    });
    const body = response.json();

    expect(response.statusCode).toBe(404);
    expect(body.error.code).toBe("NOT_FOUND");
  });
});
