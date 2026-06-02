import cors from "@fastify/cors";
import helmet from "@fastify/helmet";
import rateLimit from "@fastify/rate-limit";
import Fastify from "fastify";
import { randomUUID } from "node:crypto";
import { contracts } from "./contracts.js";
import { loadConfig, validateConfig, type AppConfig } from "./config.js";
import { MetricsCollector } from "./observability/metrics.js";
import { createTrustLensStore } from "./persistence/createStore.js";
import { registerHealthRoutes } from "./routes/health.js";
import { registerMetricsRoute } from "./routes/metrics.js";
import { registerTrustLensRoutes } from "./routes/trustLens.js";
import { MockTrustLensService } from "./services/mockTrustLensService.js";
import { errorEnvelope } from "./utils/envelope.js";
import { handleError } from "./utils/errors.js";

export const buildApp = async (config: AppConfig = loadConfig()) => {
  const app = Fastify({
    bodyLimit: config.bodyLimitBytes,
    logger: config.nodeEnv === "test" ? false : { level: config.logLevel },
    disableRequestLogging: true,
    requestIdLogLabel: "requestId",
    requestIdHeader: "x-request-id",
    genReqId: () => `req_${randomUUID()}`
  });

  const configIssues = validateConfig(config);
  if (configIssues.length > 0) {
    throw new Error(`Invalid backend configuration: ${configIssues.join(" ")}`);
  }

  app.addSchema(contracts.common);
  const store = createTrustLensStore(config);
  await store.init();
  const trustLensService = new MockTrustLensService(store);
  const metrics = new MetricsCollector();

  await app.register(helmet, {
    contentSecurityPolicy: false
  });
  await app.register(cors, {
    origin: config.corsOrigins.includes("*") ? true : config.corsOrigins
  });
  await app.register(rateLimit, {
    max: config.rateLimitMax,
    timeWindow: config.rateLimitWindow,
    global: false,
    hook: "preHandler",
    skipOnError: true
  });

  app.addHook("onRequest", async (request) => {
    metrics.markStart(request);
  });

  app.addHook("onResponse", async (request, reply) => {
    metrics.markComplete(request, reply.statusCode);
  });

  await registerHealthRoutes(app, config);
  await registerMetricsRoute(app, metrics, store);
  await registerTrustLensRoutes(app, trustLensService);

  app.setNotFoundHandler((request, reply) => {
    reply.status(404).send(errorEnvelope(request, "NOT_FOUND", "Route not found."));
  });

  app.setErrorHandler(handleError);

  return app;
};
