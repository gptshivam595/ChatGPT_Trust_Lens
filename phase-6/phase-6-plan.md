# Phase 6 Implementation Plan

## Objective

Make the backend reliable enough for a full-stack mock demo and future Render deployment.

Phase 6 adds test coverage, contract validation, security defaults, observability, graceful shutdown, environment validation, and deployment configuration while keeping the Trust Lens API response contracts stable.

## Recommended Skills

Primary:

- `$backend-developer`: integration tests, health checks, graceful shutdown, route reliability, and service readiness.
- `$application-security`: request validation, CORS allowlist, security headers, body limits, rate limiting, and logging safety.
- `$devops-engineer`: environment configuration, operational checks, Render readiness, and deployment files.

Supporting:

- `$api-test-suite-builder`: route and contract test coverage.
- `$dependency-auditor`: dependency and package risk review.
- `$devops-incident-responder`: logs, metrics, runtime diagnostics, and operational failure review.
- `$deployment-engineer`: Render build/start commands, health checks, and rollback-oriented docs.

## Source Inputs

- `../microservice/contracts/*.json`
- `../microservice/frontend-integration.md`
- `../12_PHASE_PLAN.md`
- `../backend/`
- `../phase-5/phase-5-completion-report.md`

## Scope

In scope:

- Request body size limit.
- Security headers.
- CORS allowlist.
- Rate limiting for expensive endpoints.
- Standard validation and error response checks.
- Contract tests against JSON Schemas.
- Request metrics collector.
- Operational `/metrics` endpoint.
- Readiness check includes storage, AI provider, retrieval provider, and rate limit configuration.
- Graceful shutdown.
- Render Blueprint file.
- Optional Dockerfile.
- Backend README updates.
- Security and readiness tests.

Out of scope:

- Production auth.
- Real secrets manager.
- External monitoring dashboard.
- Render deployment execution.
- CI pipeline execution.
- PostgreSQL runtime adapter.
- Redis-backed rate limiting.

## Security Workstream

Tasks:

- Add `@fastify/helmet`.
- Add `@fastify/rate-limit`.
- Configure body size limit.
- Keep CORS allowlist explicit.
- Avoid logging raw prompts.
- Add rate limit tests.
- Add security header tests.

Deliverables:

- `../backend/src/app.ts`
- `../backend/src/config.ts`
- `../backend/test/securityReadiness.test.ts`

## Observability Workstream

Tasks:

- Add request metrics collector.
- Track total requests.
- Track status code counts.
- Track method/route counts.
- Track average latency.
- Track error count.
- Track store artifact counts.
- Expose `/metrics`.

Deliverables:

- `../backend/src/observability/metrics.ts`
- `../backend/src/routes/metrics.ts`

## Contract Test Workstream

Tasks:

- Validate representative request fixtures.
- Validate API responses against JSON Schemas.
- Register `common.schema.json` refs.
- Include final answer, recheck, and source passage response checks.

Deliverable:

- `../backend/test/contract.test.ts`

## Operational Readiness Workstream

Tasks:

- Add graceful shutdown.
- Add Render Blueprint.
- Add Dockerfile and docker ignore.
- Update backend README.
- Document environment variables and deployment commands.

Deliverables:

- `../render.yaml`
- `../backend/Dockerfile`
- `../backend/.dockerignore`
- `../backend/README.md`

## Definition Of Done

- Unit, integration, security, and contract tests pass.
- Contract fixtures validate.
- Health and readiness endpoints pass.
- Backend rejects invalid input.
- Recheck duplicate start is handled.
- CORS is configured for local and deployed frontend.
- Security headers are present.
- Expensive endpoints are rate-limited.
- Metrics endpoint returns request and storage counters.
- Render build/start configuration exists.
- No secrets are committed.
- Typecheck, build, tests, and dependency audit pass.

