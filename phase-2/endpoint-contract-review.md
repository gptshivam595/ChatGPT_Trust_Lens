# Endpoint Contract Review

This document reviews every future Trust Lens API endpoint and maps it to JSON Schema contracts.

Base URL:

```text
/api/v1
```

## Contract Style

Success responses:

```json
{
  "data": {},
  "meta": {
    "requestId": "req_123",
    "apiVersion": "v1"
  }
}
```

Error responses:

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "The request body is invalid.",
    "details": []
  },
  "meta": {
    "requestId": "req_123",
    "apiVersion": "v1"
  }
}
```

## Endpoint 1: Create Session

Endpoint:

```text
POST /trust-lens/sessions
```

Contracts:

- Request: `../microservice/contracts/session-create.request.schema.json`
- Response: `../microservice/contracts/session-create.response.schema.json`

Frontend trigger:

- User submits first prompt.

Purpose:

Creates a session ID for the Trust Lens flow.

Review status:

- Request supports `clientMode`, `timezone`, and `locale`.
- Response returns `sessionId` and `createdAt`.
- Enough for frontend to correlate later calls.

## Endpoint 2: Prompt Readiness

Endpoint:

```text
POST /trust-lens/readiness
```

Contracts:

- Request: `../microservice/contracts/prompt-readiness.request.schema.json`
- Response: `../microservice/contracts/prompt-readiness.response.schema.json`

Frontend trigger:

- Prompt submitted.

Purpose:

Evaluates prompt readiness and returns risk signals plus clarifying questions.

Review status:

- Request includes `sessionId` and `prompt`.
- Response includes readiness ID, risk badge, explanation, risk chips, quality rows, and clarifying questions.
- Supports Prompt Readiness screen fully.

## Endpoint 3: Improved Prompt

Endpoint:

```text
POST /trust-lens/improved-prompt
```

Contracts:

- Request: `../microservice/contracts/improved-prompt.request.schema.json`
- Response: `../microservice/contracts/improved-prompt.response.schema.json`

Frontend trigger:

- User clicks `Generate improved prompt`.

Purpose:

Generates a more specific prompt based on original prompt and clarification answers.

Review status:

- Request includes `sessionId`, `readinessId`, `originalPrompt`, and `clarifications`.
- Response includes original and improved prompt.
- Supports editable improved prompt preview.

## Endpoint 4: Answer Directions

Endpoint:

```text
POST /trust-lens/directions
```

Contracts:

- Request: `../microservice/contracts/answer-directions.request.schema.json`
- Response: `../microservice/contracts/answer-directions.response.schema.json`

Frontend trigger:

- User continues with improved or original prompt.

Purpose:

Returns three answer direction preview cards.

Review status:

- Request includes selected prompt and prompt mode.
- Response returns exactly three directions.
- Response includes recommended direction ID.

## Endpoint 5: Final Answer

Endpoint:

```text
POST /trust-lens/final-answer
```

Contracts:

- Request: `../microservice/contracts/final-answer.request.schema.json`
- Response: `../microservice/contracts/final-answer.response.schema.json`

Frontend trigger:

- User selects an answer direction.

Purpose:

Generates final answer and returns Trust Lens review artifacts.

Review status:

- Request includes selected prompt, prompt mode, and direction ID.
- Response includes `answerId`, selected direction, structured blocks, highlights, and `trustLens`.
- Response includes enough data to open Trust Lens without a second fetch.
- Final answer response must be received before the frontend can render Trust Lens.

## Endpoint 6: Start Recheck

Endpoint:

```text
POST /trust-lens/recheck
```

Contracts:

- Request: `../microservice/contracts/recheck-start.request.schema.json`
- Response: `../microservice/contracts/recheck-start.response.schema.json`

Frontend trigger:

- User clicks `Recheck Output`.

Purpose:

Starts asynchronous claim-level recheck.

Review status:

- Request includes `sessionId`, `answerId`, and `mode`.
- Response includes `jobId`, status, active step, and steps.
- Supports asynchronous progress UI.

## Endpoint 7: Recheck Status

Endpoint:

```text
GET /trust-lens/recheck/{jobId}
```

Contract:

- Response: `../microservice/contracts/recheck-status.response.schema.json`

Frontend trigger:

- Poll while recheck is running.

Purpose:

Returns job progress or final result.

Review status:

- Response supports queued, running, complete, and failed states.
- Complete response can include summary, updated claims, and updated highlights.
- Supports Recheck Summary and Claims tab update.

## Endpoint 8: Source Passage

Endpoint:

```text
GET /trust-lens/sources/{sourceId}
```

Contract:

- Response: `../microservice/contracts/source-passage.response.schema.json`

Frontend trigger:

- User clicks `View source passage`.

Purpose:

Fetches a source passage for a source-backed highlight.

Review status:

- Response returns exact passage and highlighted sentence.
- Source lookup remains separate from final answer generation.

## Error Codes

Required error codes:

- `VALIDATION_ERROR`
- `UNAUTHORIZED`
- `FORBIDDEN`
- `NOT_FOUND`
- `RATE_LIMITED`
- `RECHECK_ALREADY_RUNNING`
- `LLM_PROVIDER_TIMEOUT`
- `INTERNAL_ERROR`

## Contract Acceptance

- Every route has a request contract when it accepts a body.
- Every route has a response contract.
- Every response has `meta.requestId`.
- Every response has `meta.apiVersion`.
- Every response supports frontend UI states.
- No response implies guaranteed correctness.

