# Frontend API Client Contract

This document defines the future frontend API adapter.

The first prototype should use mock mode by default.

## Environment

```ts
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "mock";
```

Mock mode:

```ts
API_BASE_URL === "mock" || API_BASE_URL === ""
```

API mode:

```ts
API_BASE_URL.startsWith("http")
```

## ApiResult Type

Use the same shape as `IMPLEMENTATION_CONTRACTS.md`.

```ts
type ApiResult<T> =
  | { success: true; data: T; meta?: unknown }
  | {
      success: false;
      error: { code: string; message: string; details?: unknown[] };
      meta?: unknown;
    };
```

## Required Client Functions

```ts
createTrustLensSession(input): Promise<ApiResult<CreateSessionData>>
runPromptReadiness(input): Promise<ApiResult<PromptReadinessData>>
generateImprovedPrompt(input): Promise<ApiResult<ImprovedPromptData>>
getAnswerDirections(input): Promise<ApiResult<AnswerDirectionsData>>
generateFinalAnswer(input): Promise<ApiResult<FinalAnswerData>>
startRecheck(input): Promise<ApiResult<RecheckStartData>>
getRecheckStatus(jobId): Promise<ApiResult<RecheckStatusData>>
getSourcePassage(sourceId): Promise<ApiResult<SourcePassageData>>
```

## Client Responsibilities

- Choose mock mode or API mode.
- Serialize request bodies according to contracts.
- Parse standard success response.
- Parse standard error response.
- Preserve `requestId` metadata when available.
- Convert network failure into `ApiResult` error.
- Never throw directly into UI components.

## Mock Mode Behavior

Mock mode should:

- Generate local `sessionId`.
- Use deterministic mock data.
- Simulate latency with timers.
- Simulate recheck progress locally.
- Return the same data shape as API mode.

Mock mode should not:

- Use `fetch`.
- Require `.env`.
- Persist data.
- Call real models or retrieval.

## API Mode Behavior

API mode should:

- Use `fetch`.
- Include `Content-Type: application/json`.
- Include `Idempotency-Key` for final answer and recheck when implemented.
- Read `{ data, meta }` on success.
- Read `{ error, meta }` on failure.

## State Updates

| Client Function | Success State Update | Failure Behavior |
| --- | --- | --- |
| `createTrustLensSession` | Store `sessionId`. | Use local ID or show error. |
| `runPromptReadiness` | `workflowStep = "prompt_readiness_ready"` | Show fallback readiness card. |
| `generateImprovedPrompt` | `workflowStep = "improved_prompt_ready"` | Keep original prompt path available. |
| `getAnswerDirections` | `workflowStep = "answer_directions_ready"` | Use fallback directions. |
| `generateFinalAnswer` | `workflowStep = "final_answer_ready"`, `trustLensOpen = true` | Show retry, do not show Trust Lens. |
| `startRecheck` | `recheckStatus = "running"` | Show toast, keep old claims. |
| `getRecheckStatus` | Update step or complete summary. | Show retry, keep old claims. |
| `getSourcePassage` | Open modal with passage. | Open fallback modal. |

## Error Handling Rules

- UI components receive normalized errors.
- Validation errors can show inline messages where appropriate.
- Recheck errors use toast or inline progress error.
- Source passage errors show fallback modal.
- Final answer errors must not show Trust Lens.

## Future Type Generation

When implementation begins, consider generating TypeScript DTOs from JSON Schema or manually keeping DTOs aligned with `microservice/contracts`.

Contract drift should be checked during Phase 6.

