import type { FastifyInstance } from "fastify";
import { contracts } from "../contracts.js";
import {
  MockTrustLensService,
  type CreateSessionInput,
  type DirectionsInput,
  type FinalAnswerInput,
  type ImprovePromptInput,
  type PromptReadinessInput,
  type RecheckStartInput
} from "../services/mockTrustLensService.js";
import { successEnvelope } from "../utils/envelope.js";

const protectedRoute = { rateLimit: {} };

export const registerTrustLensRoutes = async (
  app: FastifyInstance,
  service: MockTrustLensService
) => {
  app.post(
    "/api/v1/trust-lens/sessions",
    { schema: { body: contracts.sessionCreateRequest }, config: protectedRoute },
    async (request) =>
      successEnvelope(request, await service.createSession(request.body as CreateSessionInput))
  );

  app.post(
    "/api/v1/trust-lens/readiness",
    { schema: { body: contracts.promptReadinessRequest }, config: protectedRoute },
    async (request) =>
      successEnvelope(
        request,
        await service.getPromptReadiness(request.body as PromptReadinessInput)
      )
  );

  app.post(
    "/api/v1/trust-lens/improved-prompt",
    { schema: { body: contracts.improvedPromptRequest }, config: protectedRoute },
    async (request) =>
      successEnvelope(
        request,
        await service.generateImprovedPrompt(request.body as ImprovePromptInput)
      )
  );

  app.post(
    "/api/v1/trust-lens/directions",
    { schema: { body: contracts.answerDirectionsRequest }, config: protectedRoute },
    async (request) =>
      successEnvelope(request, await service.getAnswerDirections(request.body as DirectionsInput))
  );

  app.post(
    "/api/v1/trust-lens/final-answer",
    { schema: { body: contracts.finalAnswerRequest }, config: protectedRoute },
    async (request) =>
      successEnvelope(
        request,
        await service.generateFinalAnswer(request.body as FinalAnswerInput)
      )
  );

  app.post(
    "/api/v1/trust-lens/recheck",
    { schema: { body: contracts.recheckStartRequest }, config: protectedRoute },
    async (request) =>
      successEnvelope(request, await service.startRecheck(request.body as RecheckStartInput))
  );

  app.get<{ Params: { jobId: string } }>(
    "/api/v1/trust-lens/recheck/:jobId",
    { config: protectedRoute },
    async (request) =>
      successEnvelope(request, await service.getRecheckStatus(request.params.jobId))
  );

  app.get<{ Params: { sourceId: string } }>(
    "/api/v1/trust-lens/sources/:sourceId",
    { config: protectedRoute },
    async (request) =>
      successEnvelope(request, await service.getSourcePassage(request.params.sourceId))
  );
};
