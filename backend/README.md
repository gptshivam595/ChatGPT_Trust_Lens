# Trust Lens Backend

This is the Phase 3 backend skeleton for Trust Lens.

It exposes the documented API contracts with deterministic mock responses. It does not use a database, Redis, authentication, real LLM calls, or real retrieval.

Phase 4 adds a local durable file store by default. PostgreSQL migration SQL is included as production runway, but the service does not require PostgreSQL to run locally.

## Stack

- Node.js
- TypeScript
- Fastify
- Vitest

## Local Setup

```bash
cd backend
npm install
npm run dev
```

Default local URL:

```text
http://localhost:4000
```

## Scripts

```bash
npm run dev
npm run build
npm run start
npm run test
npm run typecheck
```

## Environment

Copy `.env.example` if local environment overrides are needed.

| Variable | Default | Purpose |
| --- | --- | --- |
| `PORT` | `4000` | Local backend port. |
| `NODE_ENV` | `development` | Runtime environment. |
| `LOG_LEVEL` | `info` | Fastify logger level. |
| `CORS_ORIGIN` | `http://localhost:5173,http://127.0.0.1:5173` | Allowed frontend origins. |
| `STORAGE_DRIVER` | `file` | Use `file` for local persistence or `memory` for tests. |
| `DATA_DIR` | `data` | Directory for local `trust-lens-store.json`. |
| `AI_PROVIDER` | `mock` | Reserved provider selector. Phase 5 supports deterministic mock only. |
| `RETRIEVAL_PROVIDER` | `mock` | Reserved retrieval selector. Phase 5 supports deterministic mock only. |
| `BODY_LIMIT_BYTES` | `1000000` | Maximum JSON request body size. |
| `RATE_LIMIT_MAX` | `60` | Per-window request limit for Trust Lens API routes. |
| `RATE_LIMIT_WINDOW` | `1 minute` | Rate limit window for Trust Lens API routes. |
| `CONTRACTS_DIR` | empty | Optional override for JSON Schema contract directory. |
| `DATABASE_URL` | empty | Reserved for later phases. |
| `REDIS_URL` | empty | Reserved for later phases. |
| `LLM_PROVIDER_API_KEY` | empty | Reserved for later phases. |

No real secrets should be committed.

## Health Routes

```text
GET /health
GET /ready
GET /metrics
```

## Trust Lens Routes

All Trust Lens API routes are under `/api/v1`.

```text
POST /api/v1/trust-lens/sessions
POST /api/v1/trust-lens/readiness
POST /api/v1/trust-lens/improved-prompt
POST /api/v1/trust-lens/directions
POST /api/v1/trust-lens/final-answer
POST /api/v1/trust-lens/recheck
GET  /api/v1/trust-lens/recheck/:jobId
GET  /api/v1/trust-lens/sources/:sourceId
```

## Response Envelopes

Success:

```json
{
  "data": {},
  "meta": {
    "requestId": "req_...",
    "apiVersion": "v1"
  }
}
```

Error:

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "The request body is invalid.",
    "details": []
  },
  "meta": {
    "requestId": "req_...",
    "apiVersion": "v1"
  }
}
```

## Contract Source

Request validation loads schemas from:

```text
../microservice/contracts/
```

Build output also packages a copy of the contracts into:

```text
dist/contracts-json/
```

Runtime lookup order:

1. `CONTRACTS_DIR` if set.
2. Repo-level `../microservice/contracts`.
3. Packaged `dist/contracts-json`.

The backend registers `common.schema.json` for shared `$ref` definitions and uses the documented request contracts for POST body validation.

## Persistence

Default local persistence:

```text
STORAGE_DRIVER=file
DATA_DIR=data
```

The backend writes local state to:

```text
backend/data/trust-lens-store.json
```

This directory is ignored by Git.

For isolated test runs, use:

```text
STORAGE_DRIVER=memory
```

PostgreSQL-ready migration files live in:

```text
backend/migrations/
```

They are not applied automatically in Phase 4.

## Mock Behavior

The backend returns deterministic mock data and persists the artifacts:

- Stable session ID: `session_mock_001`
- Stable answer ID: `answer_mock_001`
- Stable recheck job ID: `job_mock_recheck_001`
- Stable source ID: `source_mock_001`

Final answer responses include and persist:

- Structured answer blocks
- Inline highlight metadata
- Trust Lens summary
- Quality rows
- Assumptions
- Missing context
- Claims
- Alternatives

## AI Pipeline

Phase 5 adds an AI orchestration boundary without calling real providers.

Current adapters:

```text
AI_PROVIDER=mock
RETRIEVAL_PROVIDER=mock
```

The backend includes:

- Versioned prompt template registry.
- Prompt readiness evaluator.
- Improved prompt generator.
- Answer direction planner.
- Final answer generator.
- Claim extractor.
- Query generator.
- Mock retriever.
- Claim evaluator.
- Highlight classifier.
- Prompt-injection scanner.
- Internal telemetry metadata.

Retrieved passages are treated as untrusted data. Source-backed labels do not mean the whole answer is verified.

## Security And Observability

Phase 6 adds:

- Security headers through Helmet.
- Explicit CORS allowlist.
- JSON body size limit.
- Rate limiting on Trust Lens API routes.
- Request IDs.
- Structured Fastify logs.
- `/metrics` route with request, status, latency, and storage counters.
- Graceful shutdown for `SIGINT` and `SIGTERM`.

The backend does not log raw prompts by default.

## Render Readiness

Render Blueprint:

```text
../render.yaml
```

Backend service settings:

```text
Root directory: backend
Build command: npm ci && npm run build
Start command: npm run start
Health check path: /health
```

Set `CORS_ORIGIN` in Render to the deployed Vercel frontend origin when using API mode.

Optional container build files:

```text
Dockerfile
.dockerignore
```

Build the optional image from the repository root so the Docker build can package both backend code and shared contracts:

```bash
docker build -f backend/Dockerfile .
```

## Frontend Integration

For a full-stack mock demo, set the frontend variable:

```text
VITE_API_BASE_URL=http://localhost:4000/api/v1
```

The frontend-only prototype can continue using mock mode:

```text
VITE_API_BASE_URL=mock
```

## Phase Boundaries

Not included in the current backend implementation:

- Real claim extraction
- Real source retrieval
- Authentication and authorization
- Rate limiting
- Actual cloud deployment from this machine. Phase 12 adds Render-ready config and the deployment runbook in `../DEPLOYMENT.md`.

- PostgreSQL runtime adapter
- Redis-backed job queue
- Real background worker process
- Production retention enforcement
