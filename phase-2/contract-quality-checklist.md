# Phase 2 Contract Quality Checklist

This checklist confirms that the Phase 2 backend/API contract package is ready for either Phase 3 backend skeleton work or Phase 7 frontend mock-first implementation.

## Review Status

| Area | Status | Evidence |
| --- | --- | --- |
| Endpoint inventory | Pass | `endpoint-contract-review.md` covers all eight planned endpoints. |
| JSON Schema coverage | Pass | Every request body and response has a schema in `../microservice/contracts/`. |
| Success envelope | Pass | Contracts and docs require `{ data, meta }` for successful API responses. |
| Error envelope | Pass | Contracts and docs require `{ error, meta }` for API failures. |
| Frontend API client shape | Pass | `frontend-api-client-contract.md` uses the shared `ApiResult<T>` shape from `IMPLEMENTATION_CONTRACTS.md`. |
| Mock-first behavior | Pass | `frontend-api-client-contract.md` and `screen-api-mapping.md` preserve local mock mode as the default. |
| Screen action coverage | Pass | `screen-api-mapping.md` maps every important screen action to an API call or local-only behavior. |
| Final answer gate | Pass | Trust Lens render rule is explicitly tied to `workflowStep === "final_answer_ready"`. |
| Trust Lens artifacts | Pass | Final answer response is documented as the initial source for Trust Lens panel artifacts. |
| Recheck async model | Pass | Recheck starts with `POST /trust-lens/recheck` and progresses through `GET /trust-lens/recheck/{jobId}` polling. |
| Source passage separation | Pass | Source passage lookup remains a separate `GET /trust-lens/sources/{sourceId}` endpoint. |
| Idempotency rules | Pass | `idempotency-and-race-guards.md` defines duplicate submit, final answer, recheck, polling, and new chat guards. |
| Privacy runway | Pass | `auth-privacy-retention.md` documents future auth, retention, telemetry, and sensitive logging boundaries. |
| No false certainty | Pass | Product and API docs avoid "verified", "trust score", and guaranteed correctness language. |

## Required Contract Files

| Contract | Status |
| --- | --- |
| `common.schema.json` | Present |
| `session-create.request.schema.json` | Present |
| `session-create.response.schema.json` | Present |
| `prompt-readiness.request.schema.json` | Present |
| `prompt-readiness.response.schema.json` | Present |
| `improved-prompt.request.schema.json` | Present |
| `improved-prompt.response.schema.json` | Present |
| `answer-directions.request.schema.json` | Present |
| `answer-directions.response.schema.json` | Present |
| `final-answer.request.schema.json` | Present |
| `final-answer.response.schema.json` | Present |
| `recheck-start.request.schema.json` | Present |
| `recheck-start.response.schema.json` | Present |
| `recheck-status.response.schema.json` | Present |
| `source-passage.response.schema.json` | Present |

## Endpoint Acceptance Checklist

### `POST /trust-lens/sessions`

- [x] Request contract exists.
- [x] Response contract exists.
- [x] Creates session correlation ID.
- [x] Does not require production auth in prototype mode.

### `POST /trust-lens/readiness`

- [x] Request contract exists.
- [x] Response contract exists.
- [x] Supports readiness badge, risk explanation, quality rows, risk chips, and clarifying questions.
- [x] Uses cautious review language instead of correctness claims.

### `POST /trust-lens/improved-prompt`

- [x] Request contract exists.
- [x] Response contract exists.
- [x] Supports clarification-driven prompt improvement.
- [x] Keeps improved prompt editable in the frontend.

### `POST /trust-lens/directions`

- [x] Request contract exists.
- [x] Response contract exists.
- [x] Returns three direction previews.
- [x] Includes a recommended direction without forcing selection.

### `POST /trust-lens/final-answer`

- [x] Request contract exists.
- [x] Response contract exists.
- [x] Returns final answer blocks.
- [x] Returns inline highlight definitions.
- [x] Returns Trust Lens summary and tab artifacts.
- [x] Enables Trust Lens only after final answer response is ready.

### `POST /trust-lens/recheck`

- [x] Request contract exists.
- [x] Response contract exists.
- [x] Starts an asynchronous recheck job.
- [x] Supports duplicate-click protection through idempotency and running-state guards.

### `GET /trust-lens/recheck/{jobId}`

- [x] Response contract exists.
- [x] Supports queued, running, complete, and failed states.
- [x] Can return updated claims and highlights on completion.
- [x] Allows frontend polling to stop safely.

### `GET /trust-lens/sources/{sourceId}`

- [x] Response contract exists.
- [x] Keeps source passage retrieval separate from final answer generation.
- [x] Supports source modal rendering.
- [x] Supports fallback UI when unavailable.

## Frontend Integration Checklist

- [x] API mode and mock mode use the same normalized result shape.
- [x] API client never throws directly into UI components.
- [x] Network errors become `ApiResult` failures.
- [x] Final answer failure does not render Trust Lens.
- [x] Recheck start failure keeps previous claim results.
- [x] Recheck polling failure keeps previous claim results and allows retry.
- [x] Source passage failure opens a fallback modal instead of blocking the whole answer.
- [x] New chat cancels pending timers and ignores stale request responses.
- [x] State fields remain separated: `workflowStep`, `trustLensOpen`, `activeTrustLensTab`, and `recheckStatus`.

## Drift Checks For Later Phases

Phase 3 should verify:

- Generated backend DTOs match the JSON Schema files.
- Backend validation rejects malformed bodies with `VALIDATION_ERROR`.
- API responses always include `meta.requestId`.
- Recheck endpoints return `RECHECK_ALREADY_RUNNING` when needed.

Phase 7 and Phase 8 should verify:

- Mock data matches API response shapes.
- Frontend adapter uses `success`, not `ok`.
- Trust Lens does not render from prompt existence, readiness completion, or direction visibility.
- Mobile and desktop UI states handle API loading, failure, retry, and stale responses.

## Remaining Non-Blocking Notes

- Authentication is intentionally documented as future production work.
- Real LLM and retrieval behavior is intentionally out of scope for Phase 2.
- Contract tests should be added when runtime backend code exists.
