# Backend Purpose And Scope

## Purpose

The Trust Lens backend is future production runway.

The current prototype can and should run without a backend. The backend contracts exist so a future full-stack version can support real prompt readiness, generation, retrieval, claim review, source lookup, and persistence without changing the frontend's UI architecture.

## Backend Responsibilities

Future backend owns:

- Session creation.
- Prompt readiness evaluation.
- Improved prompt generation.
- Answer direction generation.
- Final answer generation.
- Claim extraction.
- Recheck job start and progress.
- Claim status updates.
- Source passage lookup.
- Future persistence.
- Future auth and authorization.
- Future model and retrieval provider orchestration.

## Frontend Responsibilities

Frontend owns:

- Current screen.
- Main workflow state.
- Trust Lens open or closed state.
- Active Trust Lens tab.
- Tooltip or popover state.
- Modal state.
- Toast state.
- Composer state.
- Scroll behavior.
- Responsive layout.
- Rendering of structured answer blocks.
- Rendering of review artifacts.

## Shared Boundary

The backend returns structured artifacts. The frontend decides how to display them.

Backend must not return raw HTML.

Frontend must not treat backend output as a trust guarantee.

## Non-Goals For Phase 2

- No backend code.
- No database schema implementation.
- No auth implementation.
- No LLM integration.
- No retrieval integration.
- No deployment.
- No migration files.

## Prototype Mode

Prototype mode:

- Uses local mock data.
- Does not call APIs.
- Does not persist user prompts.
- Does not require auth.
- Can deploy frontend-only to Vercel.

## Future API Mode

API mode:

- Uses `VITE_API_BASE_URL`.
- Calls Trust Lens API endpoints.
- Can fall back to mock behavior for non-critical failures.
- Must preserve the Trust Lens render invariant.

## Hard Boundary

The frontend must never show Trust Lens UI before final answer data exists.

Backend response availability does not change this rule.

The only valid frontend gate is:

```ts
workflowStep === "final_answer_ready"
```

## Future Service Shape

```text
React Frontend
  -> Trust Lens API
      -> Session
      -> Prompt Readiness
      -> Prompt Improvement
      -> Answer Direction Planning
      -> Final Answer Generation
      -> Claim Review
      -> Source Passage Lookup
```

## Service Boundary Rules

- Keep source passage lookup separate from final answer generation.
- Keep recheck asynchronous.
- Keep prompt and answer artifacts structured.
- Keep UI state out of backend persistence unless explicitly required later.
- Keep evidence labels cautious.
- Keep source-backed support claim-specific.

