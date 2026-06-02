# Frontend API Interaction Guide

This document explains how the Trust Lens frontend will interact with future APIs.

For the current prototype, every API call should be replaceable by local mock data.

## Environment

```ts
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? "mock";
```

If `API_BASE_URL === "mock"`, use local `trustLensMockData.ts`.

If `API_BASE_URL` is a URL, call backend APIs.

## Frontend API Client Shape

```ts
type ApiResult<T> =
  | { success: true; data: T; meta?: ApiMeta }
  | { success: false; error: ApiError; meta?: ApiMeta };

type ApiError = {
  code: string;
  message: string;
  details?: { field?: string; message: string }[];
};

type ApiMeta = {
  requestId?: string;
  apiVersion?: "v1";
};
```

The frontend adapter uses `success` instead of `ok` to stay aligned with
`IMPLEMENTATION_CONTRACTS.md`.

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

## Screen-To-API Mapping

| Screen | Frontend Event | API Call |
| --- | --- | --- |
| Empty State | User submits first prompt | `POST /trust-lens/sessions` then `POST /trust-lens/readiness` |
| Prompt Readiness | Readiness loading | `POST /trust-lens/readiness` |
| Improved Prompt | Generate improved prompt | `POST /trust-lens/improved-prompt` |
| Direction Previews | Continue with prompt | `POST /trust-lens/directions` |
| Final Answer | Select direction | `POST /trust-lens/final-answer` |
| Trust Lens Panel | Opens after final answer | No separate call required if final answer includes review artifacts. |
| Recheck Progress | Click Recheck Output | `POST /trust-lens/recheck` |
| Recheck Progress | Poll progress | `GET /trust-lens/recheck/{jobId}` |
| Source Modal | View source passage | `GET /trust-lens/sources/{sourceId}` |

## Flow Details

### 1. Submit Prompt

Frontend state:

```ts
workflowStep = "prompt_submitted";
```

API calls:

```text
POST /trust-lens/sessions
POST /trust-lens/readiness
```

Frontend behavior:

- Render user message immediately.
- Show `Running Prompt Readiness Check...`.
- When readiness returns, render Prompt Readiness Card.

### 2. Generate Improved Prompt

API call:

```text
POST /trust-lens/improved-prompt
```

Frontend sends:

- `sessionId`
- `originalPrompt`
- `clarifications`

Frontend receives:

- `improvedPrompt`
- `changes`

Frontend behavior:

- Show improved prompt in editable textarea.
- User can edit before continuing.

### 3. Generate Answer Directions

API call:

```text
POST /trust-lens/directions
```

Frontend sends:

- `selectedPrompt`
- `selectedPromptMode`
- `clarifications`

Frontend receives:

- Three direction cards.
- Recommended direction ID.

Frontend behavior:

- Render cards.
- User selects one.

### 4. Generate Final Answer

API call:

```text
POST /trust-lens/final-answer
```

Frontend sends:

- `sessionId`
- `selectedPrompt`
- `selectedDirectionId`

Frontend receives:

- `answerId`
- structured final answer blocks
- highlights
- trust lens summary
- quality rows
- assumptions
- missing context
- claims
- alternatives
- sources metadata

Frontend behavior:

- Render final answer first.
- Then set `trustLensOpen = true`.
- Active tab starts as `quality`.

Critical invariant:

```ts
const canShowTrustLens = workflowStep === "final_answer_ready";
```

### 5. Start Recheck

API call:

```text
POST /trust-lens/recheck
```

Frontend sends:

- `sessionId`
- `answerId`
- `mode = "claim_level"`

Frontend receives:

- `jobId`
- first progress state.

Frontend behavior:

- Set `recheckStatus = "running"`.
- Open Trust Lens panel if closed.
- Disable Recheck Output while running.

### 6. Poll Recheck

API call:

```text
GET /trust-lens/recheck/{jobId}
```

Polling interval:

```text
500ms to 1000ms
```

Stop polling when:

- `status = "complete"`
- `status = "failed"`
- user starts a new session

Frontend behavior on complete:

- Set `recheckStatus = "complete"`.
- Render Recheck Summary below final answer.
- Update Claims tab data.
- Switch active tab to `claims`.

### 7. Source Passage

API call:

```text
GET /trust-lens/sources/{sourceId}
```

Frontend behavior:

- Open Source Passage Modal.
- Show exact supporting sentence.
- If request fails, show fallback:
  - `Source passage unavailable in prototype.`

## Optimistic UI Rules

Allowed:

- Show user message immediately after submit.
- Show local loading states before API returns.
- Open Trust Lens immediately after final answer response is received.

Not allowed:

- Show Trust Lens before final answer response is complete.
- Mark a claim as supported before source/evidence exists.
- Show recheck complete before API status is complete.

## Error Handling

| API Failure | Frontend Behavior |
| --- | --- |
| Session create fails | Continue in local mock mode or show inline error. |
| Readiness fails | Show fallback readiness card with cautious copy. |
| Improved prompt fails | Allow user to continue with original prompt. |
| Directions fail | Show three local fallback directions. |
| Final answer fails | Show inline error and allow retry. No Trust Lens panel. |
| Recheck start fails | Show toast and keep previous results. |
| Recheck polling fails | Show retry option. |
| Source passage fails | Show modal fallback. |

## Mock Mode Mapping

| API Function | Mock Data Source |
| --- | --- |
| `createTrustLensSession` | Generate local `sessionId`. |
| `runPromptReadiness` | `promptReadinessRisks`, `qualityRiskRows`, `clarificationQuestions`. |
| `generateImprovedPrompt` | `improvedPromptTemplate`. |
| `getAnswerDirections` | `answerDirections`. |
| `generateFinalAnswer` | `finalAnswerBlocks`, `highlightDefinitions`, Trust Lens mock data. |
| `startRecheck` | Generate local `jobId`. |
| `getRecheckStatus` | Timed local progress steps. |
| `getSourcePassage` | `mockSources`. |

## Frontend State Updates By API

| API Call | On Success | On Failure |
| --- | --- | --- |
| Create session | Store `sessionId`. | Use local generated session or show error. |
| Readiness | `workflowStep = "prompt_readiness_ready"` | Show fallback readiness state. |
| Improved prompt | `workflowStep = "improved_prompt_ready"` | Stay on readiness card, allow skip. |
| Directions | `workflowStep = "answer_directions_ready"` | Use fallback directions. |
| Final answer | `workflowStep = "final_answer_ready"`, `trustLensOpen = true` | Stay before final answer, show retry. |
| Recheck start | `recheckStatus = "running"` | Show toast. |
| Recheck complete | `recheckStatus = "complete"` | Show retry or keep old claims. |
| Source passage | Open modal. | Open fallback modal. |

## CORS

Render backend must allow the Vercel frontend origin:

```text
https://<vercel-project>.vercel.app
```

Local development:

```text
http://localhost:5173
```
