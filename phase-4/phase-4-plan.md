# Phase 4 Implementation Plan

## Objective

Add backend persistence and asynchronous recheck job state to the Trust Lens backend while keeping the service runnable without external infrastructure.

Phase 4 bridges Phase 3 deterministic mock routes and later production services. It introduces repository boundaries, durable local file storage, PostgreSQL-ready migration SQL, and persisted artifacts for sessions, prompts, final answers, source passages, and recheck jobs.

## Recommended Skills

Primary:

- `$database-designer`: schema design, table relationships, JSONB artifact strategy, indexes, and rollback migration structure.
- `$database-administrator`: migration safety, operational boundaries, local data handling, and future backup/retention readiness.
- `$backend-developer`: repository interfaces, persistence adapter implementation, route integration, and tests.

Supporting:

- `$senior-backend`: idempotency, async recheck state, error semantics, and service boundaries.
- `$data-management`: prompt/artifact retention and sensitive data lifecycle.
- `$architect-reviewer`: validates persistence does not break mock-first frontend flow or overbuild real AI behavior.

## Source Inputs

- `../12_PHASE_PLAN.md`
- `../phase-2/domain-model.md`
- `../phase-2/idempotency-and-race-guards.md`
- `../phase-3/phase-3-completion-report.md`
- `../microservice/contracts/recheck-start.request.schema.json`
- `../microservice/contracts/recheck-start.response.schema.json`
- `../microservice/contracts/recheck-status.response.schema.json`
- `../microservice/contracts/source-passage.response.schema.json`

## Scope

In scope:

- Persistent store abstraction.
- Local durable file-backed store.
- In-memory store for tests.
- Session persistence.
- Prompt persistence.
- Prompt readiness persistence.
- Improved prompt persistence.
- Answer direction persistence.
- Final answer artifact persistence.
- Source passage persistence.
- Recheck job persistence.
- Duplicate running recheck guard.
- Mock async recheck status transition.
- PostgreSQL-ready migration files.
- Backend README and environment updates.
- Persistence and API tests.

Out of scope:

- Running PostgreSQL locally.
- Applying migrations automatically.
- Redis.
- Real background worker queue.
- Real LLM or retrieval providers.
- Auth.
- Production retention enforcement.
- Render deployment.

## Storage Strategy

Phase 4 uses two storage layers:

1. Local file store for runnable development.
   - Default storage driver: `file`.
   - Default data directory: `backend/data`.
   - Persists JSON state to `trust-lens-store.json`.
   - Ignored by Git.

2. PostgreSQL migration runway for production.
   - Migration SQL lives under `backend/migrations`.
   - Tables use relational IDs plus JSONB artifact columns.
   - Later phases can add a PostgreSQL repository implementation.

## Data Entities

| Entity | Purpose |
| --- | --- |
| `trust_lens_sessions` | One user flow through the Trust Lens experience. |
| `prompt_inputs` | Original user prompts and optional context. |
| `prompt_readiness_results` | Readiness review artifacts and clarifying questions. |
| `improved_prompts` | Generated improved prompt and changes. |
| `answer_direction_sets` | Three answer direction cards and recommendation. |
| `generated_answers` | Final answer blocks, highlights, and Trust Lens artifacts. |
| `source_passages` | Source passage modal content. |
| `recheck_jobs` | Async recheck state and summary. |
| `recheck_steps` | Visible recheck progress steps. |

## Workstreams

### Workstream 1: Persistence Model

Tasks:

- Define persisted entity types.
- Define store snapshot shape.
- Add local file store.
- Add in-memory store for tests.
- Add ID generation helpers.
- Add initialization and source seeding.

Deliverables:

- `../backend/src/persistence/types.ts`
- `../backend/src/persistence/localFileStore.ts`
- `../backend/src/persistence/memoryStore.ts`
- `../backend/src/persistence/createStore.ts`

### Workstream 2: Service Refactor

Tasks:

- Convert mock service from stateless functions into a persisted service class.
- Persist session creation.
- Persist prompt readiness against a session.
- Persist improved prompts.
- Persist answer directions.
- Persist final answers and source passages.
- Persist recheck jobs.
- Return `RECHECK_ALREADY_RUNNING` for duplicate running jobs.
- Advance mock recheck jobs from running to complete during polling.

Deliverables:

- `../backend/src/services/mockTrustLensService.ts`
- `../backend/src/routes/trustLens.ts`
- `../backend/src/app.ts`

### Workstream 3: Migration Runway

Tasks:

- Add PostgreSQL up migration.
- Add rollback migration.
- Add indexes for session, answer, source, and recheck lookups.
- Use JSONB for flexible artifact payloads.
- Document migration purpose and local file store boundary.

Deliverables:

- `../backend/migrations/20260602_000001_create_trust_lens_core.up.sql`
- `../backend/migrations/20260602_000001_create_trust_lens_core.down.sql`
- `../backend/migrations/README.md`

### Workstream 4: Docs And Environment

Tasks:

- Add `STORAGE_DRIVER`.
- Add `DATA_DIR`.
- Update readiness route to report storage mode.
- Update backend README with persistence mode and migration notes.
- Ignore local data files.

Deliverables:

- `../backend/.env.example`
- `../backend/.gitignore`
- `../backend/README.md`

### Workstream 5: Tests And Verification

Tasks:

- Update API tests for persisted behavior.
- Add file-store durability test.
- Add duplicate recheck test.
- Add completed recheck persistence test.
- Run typecheck, build, tests, and audit.

Deliverables:

- `../backend/test/trustLensApi.test.ts`
- `../backend/test/persistence.test.ts`

## Definition Of Done

- Backend still runs locally without external services.
- Local file store persists data outside process memory.
- In-memory store supports isolated tests.
- Session, prompt readiness, improved prompt, directions, final answer, source passages, and recheck jobs are stored.
- Final answer artifacts can be persisted and read back through subsequent operations.
- Recheck start stores a running job.
- Duplicate running recheck returns `RECHECK_ALREADY_RUNNING`.
- Recheck status polling completes and persists summary, claims, and highlights.
- PostgreSQL up/down migrations exist.
- Typecheck passes.
- Build passes.
- Tests pass.
- Dependency audit is clean.

