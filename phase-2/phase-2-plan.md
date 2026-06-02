# Phase 2 Implementation Plan

## Objective

Implement the backend domain model, API contract review, and frontend integration design for the future Trust Lens microservice.

This phase must preserve the frontend-first prototype path. It documents backend boundaries without making the prototype dependent on a backend.

## Recommended Skills

Primary:

- `$api-designer`: endpoint design, request/response contracts, HTTP semantics, and versioning.
- `$backend-developer`: domain modeling, validation, error handling, and service boundaries.
- `$senior-backend`: idempotency, API hardening, production readiness, and contract quality.

Supporting:

- `$architect-reviewer`: macro architecture, coupling, and future evolution review.
- `$api-documenter`: developer-facing API clarity.
- `$frontend-design`: ensures API outputs support required frontend UI states.

## Source Inputs

- `../ARCHITECTURE.md`
- `../PRODUCT.md`
- `../IMPLEMENTATION_CONTRACTS.md`
- `../microservice/README.md`
- `../microservice/api-overview.md`
- `../microservice/frontend-integration.md`
- `../microservice/contracts/*.json`
- `../screens/13-click-action-matrix.md`

## Scope

In scope:

- Backend purpose and scope.
- Domain entity model.
- Endpoint sequence review.
- JSON Schema contract review.
- Screen-to-API mapping.
- Frontend API client contract.
- Mock mode vs API mode behavior.
- Idempotency and race guard rules.
- Future auth, privacy, and retention notes.
- Contract acceptance checklist.

Out of scope:

- Backend runtime code.
- Database migrations.
- Real LLM calls.
- Real retrieval.
- Authentication implementation.
- Render deployment.

## Workstreams

### Workstream 1: Backend Purpose And Scope

Purpose:

Clarify what the backend is responsible for in a future full-stack version and what remains frontend-owned.

Tasks:

- Confirm backend is production runway.
- Confirm prototype remains mock-first.
- Define frontend-owned state.
- Define backend-owned artifacts.
- Define non-goals.

Deliverable:

- `backend-purpose-and-scope.md`

### Workstream 2: Domain Model

Purpose:

Define the backend entities and relationships needed to support the Trust Lens flow.

Tasks:

- Define `TrustLensSession`.
- Define prompt readiness entities.
- Define prompt improvement entities.
- Define answer direction entities.
- Define final answer artifacts.
- Define highlights, claims, and sources.
- Define recheck jobs and progress steps.
- Define artifact lifecycle.

Deliverable:

- `domain-model.md`

### Workstream 3: Endpoint Contract Review

Purpose:

Review every endpoint and JSON Schema contract for completeness and frontend compatibility.

Tasks:

- Review session create contract.
- Review prompt readiness contract.
- Review improved prompt contract.
- Review answer directions contract.
- Review final answer contract.
- Review recheck start contract.
- Review recheck status contract.
- Review source passage contract.
- Confirm every response includes `{ data, meta }`.
- Confirm every error uses `{ error, meta }`.

Deliverable:

- `endpoint-contract-review.md`

### Workstream 4: Screen-To-API Mapping

Purpose:

Map all frontend screens and click actions to future API calls.

Tasks:

- Map empty state submit to session create and readiness.
- Map readiness card to readiness result.
- Map improved prompt action.
- Map direction preview action.
- Map final answer generation.
- Map Trust Lens panel data source.
- Map Recheck Output.
- Map source modal.

Deliverable:

- `screen-api-mapping.md`

### Workstream 5: Frontend API Client Contract

Purpose:

Define how the frontend will call or mock APIs while keeping UI state local.

Tasks:

- Define `ApiResult<T>`.
- Define client function list.
- Define mock mode.
- Define API mode.
- Define error behavior.
- Define fallback behavior.
- Define state updates by API result.

Deliverable:

- `frontend-api-client-contract.md`

### Workstream 6: Idempotency And Race Guards

Purpose:

Prevent duplicate jobs, stale responses, and invalid UI transitions.

Tasks:

- Define idempotency use.
- Define request correlation.
- Define duplicate recheck behavior.
- Define final answer generation guards.
- Define source modal guards.
- Define new chat cancellation behavior.

Deliverable:

- `idempotency-and-race-guards.md`

### Workstream 7: Auth, Privacy, And Retention

Purpose:

Document future production boundaries for user prompts, answer artifacts, source passages, and telemetry.

Tasks:

- Define prototype mode.
- Define production auth requirement.
- Define prompt retention assumptions.
- Define source retention assumptions.
- Define telemetry boundaries.
- Define sensitive logging rules.

Deliverable:

- `auth-privacy-retention.md`

### Workstream 8: Quality Checklist And Completion Report

Purpose:

Prove Phase 2 is complete and ready for Phase 3 or frontend mock/API adapter work.

Tasks:

- Create contract checklist.
- Validate JSON files parse.
- Confirm every endpoint has a schema.
- Confirm every screen action maps to API or local mock behavior.
- Create completion report.

Deliverables:

- `contract-quality-checklist.md`
- `phase-2-completion-report.md`

## Execution Order

1. Create Phase 2 folder index.
2. Write this Phase 2 implementation plan.
3. Implement backend purpose and scope.
4. Implement domain model.
5. Implement endpoint contract review.
6. Implement screen-to-API mapping.
7. Implement frontend API client contract.
8. Implement idempotency and race guard document.
9. Implement auth, privacy, and retention document.
10. Implement quality checklist.
11. Implement completion report.
12. Validate JSON contracts.

## Definition Of Done

- Backend purpose is clear.
- Domain entities are documented.
- Every endpoint is reviewed.
- Every JSON contract parses.
- Every screen action has an API or mock behavior mapping.
- Frontend can remain mock-first.
- Final answer response includes all Trust Lens artifacts.
- Recheck is asynchronous.
- Source passage lookup is separated from final answer generation.
- Future production auth and privacy notes are documented.

