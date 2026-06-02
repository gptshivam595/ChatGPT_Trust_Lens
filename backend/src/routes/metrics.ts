import type { FastifyInstance } from "fastify";
import type { TrustLensStore } from "../persistence/types.js";
import type { MetricsCollector } from "../observability/metrics.js";
import { successEnvelope } from "../utils/envelope.js";

export const registerMetricsRoute = async (
  app: FastifyInstance,
  metrics: MetricsCollector,
  store: TrustLensStore
) => {
  app.get("/metrics", async (request) => {
    const snapshot = await store.read();

    return successEnvelope(request, {
      runtime: metrics.snapshot(),
      storage: {
        mode: store.mode,
        sessions: Object.keys(snapshot.sessions).length,
        prompts: Object.keys(snapshot.prompts).length,
        readinessResults: Object.keys(snapshot.readinessResults).length,
        improvedPrompts: Object.keys(snapshot.improvedPrompts).length,
        answerDirectionSets: Object.keys(snapshot.answerDirectionSets).length,
        generatedAnswers: Object.keys(snapshot.generatedAnswers).length,
        sourcePassages: Object.keys(snapshot.sourcePassages).length,
        recheckJobs: {
          total: Object.keys(snapshot.recheckJobs).length,
          running: Object.values(snapshot.recheckJobs).filter((job) => job.status === "running")
            .length,
          complete: Object.values(snapshot.recheckJobs).filter((job) => job.status === "complete")
            .length,
          failed: Object.values(snapshot.recheckJobs).filter((job) => job.status === "failed")
            .length
        }
      }
    });
  });
};
