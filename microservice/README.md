# Trust Lens Microservice Documentation

This folder documents the future Trust Lens backend microservice contract.

It is documentation only. No backend implementation is included here.

## Purpose

The Trust Lens frontend can run fully with local mock data for the prototype. These contracts define how the frontend will later interact with backend APIs when Trust Lens becomes a full-stack product.

## Folder Structure

```text
microservice/
  README.md
  api-overview.md
  frontend-integration.md
  contracts/
    common.schema.json
    session-create.request.schema.json
    session-create.response.schema.json
    prompt-readiness.request.schema.json
    prompt-readiness.response.schema.json
    improved-prompt.request.schema.json
    improved-prompt.response.schema.json
    answer-directions.request.schema.json
    answer-directions.response.schema.json
    final-answer.request.schema.json
    final-answer.response.schema.json
    recheck-start.request.schema.json
    recheck-start.response.schema.json
    recheck-status.response.schema.json
    source-passage.response.schema.json
```

## Base URL

Local development:

```text
http://localhost:8080/api/v1
```

Render production:

```text
https://<render-service-name>.onrender.com/api/v1
```

Frontend environment variable:

```text
VITE_API_BASE_URL=https://<render-service-name>.onrender.com/api/v1
```

## Endpoint Summary

| Endpoint | Method | Purpose |
| --- | --- | --- |
| `/trust-lens/sessions` | `POST` | Create a Trust Lens session. |
| `/trust-lens/readiness` | `POST` | Evaluate prompt readiness and return clarification questions. |
| `/trust-lens/improved-prompt` | `POST` | Generate an improved prompt from user clarifications. |
| `/trust-lens/directions` | `POST` | Return answer direction previews. |
| `/trust-lens/final-answer` | `POST` | Generate final answer and review artifacts. |
| `/trust-lens/recheck` | `POST` | Start deeper claim-level review. |
| `/trust-lens/recheck/{jobId}` | `GET` | Poll recheck progress and final results. |
| `/trust-lens/sources/{sourceId}` | `GET` | Fetch source passage details. |

## Frontend Rule

The frontend must not call Trust Lens panel APIs or show Trust Lens UI before final answer exists.

Allowed API sequence:

```text
Create Session
  -> Prompt Readiness
  -> Improved Prompt
  -> Answer Directions
  -> Final Answer
  -> Trust Lens Panel becomes visible
  -> Recheck
  -> Recheck Polling
  -> Source Passage lookup as needed
```

## Contract Style

- JSON Schema draft 2020-12.
- Every response uses `{ data, meta }`.
- Every error uses `{ error, meta }`.
- Every response includes `requestId`.
- Future production APIs should support authentication if sessions persist user data.

