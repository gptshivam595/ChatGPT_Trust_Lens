# Phase 3 Implementation Plan

## Objective

Create a runnable backend service skeleton for Trust Lens that exposes all documented Phase 2 API routes, validates request bodies against the JSON Schema contracts, and returns deterministic mock responses.

This phase prepares the project for a future full-stack demo while preserving the frontend-first prototype path.

## Recommended Skills

Primary:

- `$backend-developer`: Fastify/TypeScript service setup, route handlers, middleware, validation, and local scripts.
- `$senior-backend`: standardized envelopes, defensive defaults, request IDs, error handling, and production runway.
- `$api-test-suite-builder`: route smoke tests, validation tests, and response-shape checks.

Supporting:

- `$build-engineer`: package scripts, TypeScript configuration, Vitest setup, and reliable local build commands.
- `$application-security`: CORS defaults, input validation, and no-secret environment handling.
- `$architect-reviewer`: confirms Phase 3 stays aligned with Phase 2 contracts and does not overbuild persistence or LLM integrations.

## Source Inputs

- `../12_PHASE_PLAN.md`
- `../phase-2/phase-2-completion-report.md`
- `../microservice/api-overview.md`
- `../microservice/frontend-integration.md`
- `../microservice/contracts/*.json`
- `../IMPLEMENTATION_CONTRACTS.md`

## Scope

In scope:

- Backend workspace in `../backend`.
- Fastify app bootstrap.
- TypeScript configuration.
- Environment configuration.
- CORS configuration.
- Request ID generation.
- Standard `{ data, meta }` and `{ error, meta }` response envelopes.
- Health and readiness endpoints.
- All eight Trust Lens API endpoints under `/api/v1`.
- JSON Schema body validation for POST routes.
- Deterministic mock responses.
- Basic not-found handling.
- API smoke and validation tests.
- Backend README and `.env.example`.

Out of scope:

- Persistence.
- PostgreSQL.
- Redis.
- Authentication.
- Rate limiting.
- Real LLM calls.
- Real source retrieval.
- Background workers.
- Render deployment.

## Route Inventory

Health:

- `GET /health`
- `GET /ready`

Trust Lens API:

- `POST /api/v1/trust-lens/sessions`
- `POST /api/v1/trust-lens/readiness`
- `POST /api/v1/trust-lens/improved-prompt`
- `POST /api/v1/trust-lens/directions`
- `POST /api/v1/trust-lens/final-answer`
- `POST /api/v1/trust-lens/recheck`
- `GET /api/v1/trust-lens/recheck/:jobId`
- `GET /api/v1/trust-lens/sources/:sourceId`

## Workstreams

### Workstream 1: Backend Workspace

Tasks:

- Create `backend/package.json`.
- Create TypeScript config.
- Create Vitest config.
- Create `.env.example`.
- Add scripts for `dev`, `build`, `start`, `test`, and `typecheck`.

Deliverable:

- `../backend/package.json`

### Workstream 2: Service Bootstrap

Tasks:

- Build Fastify app factory.
- Add CORS.
- Add request IDs.
- Add health and readiness routes.
- Add not-found handler.
- Add centralized error handler.

Deliverables:

- `../backend/src/app.ts`
- `../backend/src/server.ts`
- `../backend/src/config.ts`
- `../backend/src/routes/health.ts`

### Workstream 3: Contract Loading And Validation

Tasks:

- Load JSON Schema files from `../microservice/contracts`.
- Register `common.schema.json` for `$ref` support.
- Attach request schemas to POST routes.
- Normalize validation failures into `VALIDATION_ERROR`.
- Preserve response contract envelopes.

Deliverables:

- `../backend/src/contracts.ts`
- `../backend/src/utils/envelope.ts`
- `../backend/src/utils/errors.ts`

### Workstream 4: Mock Trust Lens Service

Tasks:

- Create deterministic session, readiness, improved prompt, direction, final answer, recheck, and source passage responses.
- Ensure final answer response includes `blocks`, `highlights`, and full `trustLens` artifacts.
- Ensure recheck start and polling are asynchronous-shaped even though the skeleton is deterministic.
- Ensure labels remain cautious and do not imply guaranteed correctness.

Deliverable:

- `../backend/src/services/mockTrustLensService.ts`

### Workstream 5: API Routes

Tasks:

- Register all `/api/v1/trust-lens/*` routes.
- Return standardized success envelopes.
- Return `NOT_FOUND` for unknown sources.
- Keep route handlers thin and delegate mock data to the service.

Deliverable:

- `../backend/src/routes/trustLens.ts`

### Workstream 6: Tests And Documentation

Tasks:

- Add API smoke tests for health and main Trust Lens endpoints.
- Add validation test for invalid bodies.
- Add not-found test for unknown source passage.
- Add backend README with route list and local setup.
- Add Phase 3 completion report.

Deliverables:

- `../backend/test/trustLensApi.test.ts`
- `../backend/README.md`
- `phase-3-completion-report.md`

## Definition Of Done

- Backend installs cleanly.
- Backend TypeScript compiles.
- `GET /health` returns success.
- `GET /ready` returns success.
- All planned API routes exist.
- Invalid request bodies return `VALIDATION_ERROR`.
- Final answer route returns blocks, highlights, and Trust Lens artifacts.
- Source lookup returns `NOT_FOUND` for unknown source IDs.
- Tests pass.
- Backend does not call real models, retrieval providers, databases, or Redis.

