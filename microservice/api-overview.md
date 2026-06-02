# Trust Lens API Overview

## Architecture Boundary

The backend is a future microservice behind the frontend prototype.

```text
React Frontend
  -> Trust Lens API
      -> Prompt Readiness
      -> Prompt Improvement
      -> Answer Direction Planning
      -> Final Answer Generation
      -> Claim Recheck
      -> Source Passage Lookup
```

## Design Principles

- The backend returns structured artifacts, not raw HTML.
- The frontend owns presentation and interaction state.
- The backend owns future evaluation logic, source retrieval, and claim status generation.
- Source-backed does not mean fully verified.
- Recheck is asynchronous.
- All user-facing certainty language must remain cautious.

## Standard Success Response

```json
{
  "data": {},
  "meta": {
    "requestId": "req_01HZY7V9Y6Y2",
    "apiVersion": "v1"
  }
}
```

## Standard Error Response

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "The request body is invalid.",
    "details": [
      {
        "field": "prompt",
        "message": "Prompt is required."
      }
    ]
  },
  "meta": {
    "requestId": "req_01HZY7V9Y6Y2",
    "apiVersion": "v1"
  }
}
```

## Error Codes

| Code | HTTP Status | Meaning |
| --- | --- | --- |
| `VALIDATION_ERROR` | 400 | Request body or params are invalid. |
| `UNAUTHORIZED` | 401 | Authentication required in production mode. |
| `FORBIDDEN` | 403 | User cannot access the session or source. |
| `NOT_FOUND` | 404 | Session, answer, job, or source not found. |
| `RATE_LIMITED` | 429 | Too many expensive operations. |
| `RECHECK_ALREADY_RUNNING` | 409 | A recheck job is already running for this answer. |
| `LLM_PROVIDER_TIMEOUT` | 504 | Future model provider timeout. |
| `INTERNAL_ERROR` | 500 | Unexpected server error. |

## Data Ownership

Frontend owns:

- Current screen.
- Open or closed panel state.
- Active tab.
- Popover state.
- Modal state.
- Toast state.
- Scroll position.

Backend owns in future production:

- Session ID.
- Prompt readiness result.
- Improved prompt text.
- Answer direction options.
- Final answer structured blocks.
- Claim extraction result.
- Recheck job progress and result.
- Source passage details.

## API Sequence

```text
POST /trust-lens/sessions
POST /trust-lens/readiness
POST /trust-lens/improved-prompt
POST /trust-lens/directions
POST /trust-lens/final-answer
POST /trust-lens/recheck
GET  /trust-lens/recheck/{jobId}
GET  /trust-lens/sources/{sourceId}
```

## Authentication

Prototype mode:

- No authentication.

Future production:

- Use bearer token or session-based auth.
- Authorize access by `sessionId`.
- Do not expose one user's source passages or review artifacts to another user.

## Idempotency

Recommended for:

- `POST /trust-lens/recheck`
- `POST /trust-lens/final-answer`

Header:

```text
Idempotency-Key: <client-generated-uuid>
```

## Rate Limiting

Future production should rate limit:

- Final answer generation.
- Recheck start.
- Source retrieval.

Prototype mode can ignore rate limits.

