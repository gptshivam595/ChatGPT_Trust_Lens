import type { FastifyInstance } from "fastify";
import type { AppConfig } from "../config.js";
import { successEnvelope } from "../utils/envelope.js";

export const registerHealthRoutes = async (app: FastifyInstance, config: AppConfig) => {
  app.get("/health", async (request) =>
    successEnvelope(request, {
      status: "ok",
      service: "trust-lens-backend"
    })
  );

  app.get("/ready", async (request) =>
    successEnvelope(request, {
      status: "ready",
      mode: config.aiProvider,
      dependencies: {
        contracts: "loaded",
        storage: config.storageDriver,
        aiProvider: config.aiProvider,
        retrievalProvider: config.retrievalProvider,
        database: "not_configured",
        redis: "not_configured",
        llmProvider: config.aiProvider === "openai" ? "configured" : "not_configured",
        model: config.defaultModel
      }
    })
  );
};
