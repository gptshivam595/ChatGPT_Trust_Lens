import { afterAll, beforeAll, describe, expect, it } from "vitest";
import type { FastifyInstance } from "fastify";
import { buildApp } from "../src/app.js";
import { loadConfig } from "../src/config.js";

describe("Security and operational readiness", () => {
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
      bodyLimitBytes: 256,
      rateLimitMax: 2,
      rateLimitWindow: "1 minute"
    });
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it("sets security headers", async () => {
    const response = await app.inject({ method: "GET", url: "/health" });

    expect(response.headers["x-frame-options"]).toBe("SAMEORIGIN");
    expect(response.headers["x-content-type-options"]).toBe("nosniff");
    expect(response.headers["referrer-policy"]).toBeDefined();
  });

  it("applies CORS for allowlisted frontend origins", async () => {
    const response = await app.inject({
      method: "OPTIONS",
      url: "/api/v1/trust-lens/sessions",
      headers: {
        origin: "http://localhost:5173",
        "access-control-request-method": "POST"
      }
    });

    expect(response.statusCode).toBe(204);
    expect(response.headers["access-control-allow-origin"]).toBe("http://localhost:5173");
  });

  it("allows common local Vite fallback origins by default", () => {
    const originalCorsOrigin = process.env.CORS_ORIGIN;
    delete process.env.CORS_ORIGIN;

    const config = loadConfig();

    if (originalCorsOrigin === undefined) {
      delete process.env.CORS_ORIGIN;
    } else {
      process.env.CORS_ORIGIN = originalCorsOrigin;
    }

    expect(config.corsOrigins).toContain("http://127.0.0.1:5180");
    expect(config.corsOrigins).toContain("http://localhost:5174");
  });

  it("rejects oversized request bodies", async () => {
    const response = await app.inject({
      method: "POST",
      url: "/api/v1/trust-lens/sessions",
      payload: {
        clientMode: "prototype",
        extra: "x".repeat(500)
      }
    });

    expect(response.statusCode).toBe(413);
  });

  it("rate limits repeated expensive endpoint calls", async () => {
    const payload = { clientMode: "prototype" };

    await app.inject({ method: "POST", url: "/api/v1/trust-lens/sessions", payload });
    await app.inject({ method: "POST", url: "/api/v1/trust-lens/sessions", payload });
    const limited = await app.inject({
      method: "POST",
      url: "/api/v1/trust-lens/sessions",
      payload
    });

    expect(limited.statusCode).toBe(429);
  });

  it("reports readiness and metrics", async () => {
    const readyResponse = await app.inject({ method: "GET", url: "/ready" });
    const metricsResponse = await app.inject({ method: "GET", url: "/metrics" });
    const metrics = metricsResponse.json();

    expect(readyResponse.statusCode).toBe(200);
    expect(readyResponse.json().data.dependencies.storage).toBe("memory");
    expect(metricsResponse.statusCode).toBe(200);
    expect(metrics.data.runtime.requests.total).toBeGreaterThan(0);
    expect(metrics.data.storage.mode).toBe("memory");
  });
});
