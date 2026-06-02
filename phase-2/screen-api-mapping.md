# Screen To API Mapping

This document maps frontend screens and click actions to future API calls.

The current prototype can use local mock data instead of these calls.

## API Flow

```text
Submit prompt
  -> Create session
  -> Prompt readiness
  -> Improved prompt
  -> Answer directions
  -> Final answer
  -> Trust Lens opens
  -> Recheck start
  -> Recheck polling
  -> Source passage lookup
```

## Mapping Table

| Screen | User Action | API Call | Notes |
| --- | --- | --- | --- |
| Empty State | Click `Use sample prompt` | None | Local state only, fills composer. |
| Empty State | Send prompt | `POST /trust-lens/sessions` | Create session if API mode. |
| Empty State | Send prompt | `POST /trust-lens/readiness` | Can run after session creation. |
| Prompt Submitted Loading | Wait | None | UI loading state while readiness request resolves. |
| Prompt Readiness Check | Select clarification | None | Local UI state only. |
| Prompt Readiness Check | Edit original prompt | None | Local UI state only. |
| Prompt Readiness Check | Generate improved prompt | `POST /trust-lens/improved-prompt` | Sends clarification answers. |
| Prompt Readiness Check | Skip and continue | `POST /trust-lens/directions` | Uses original prompt. |
| Improved Prompt Preview | Edit improved prompt | None | Local UI state only. |
| Improved Prompt Preview | Use improved prompt | `POST /trust-lens/directions` | Uses edited improved prompt. |
| Improved Prompt Preview | Continue with original prompt | `POST /trust-lens/directions` | Uses original prompt. |
| Answer Directions | Select direction | `POST /trust-lens/final-answer` | Sends selected direction ID. |
| Final Answer | Render answer | None | Uses final answer response. |
| Trust Lens Panel | Auto-open | None | Uses final answer response artifacts. |
| Trust Lens Panel | Switch tabs | None | Local UI state only. |
| Final Answer | Click `Recheck Output` | `POST /trust-lens/recheck` | Starts async job. |
| Recheck Progress | Poll progress | `GET /trust-lens/recheck/{jobId}` | Poll until complete or failed. |
| Recheck Summary | Open Claims | None | Local tab switch. |
| Recheck Summary | Add missing context | None | Local tab switch. |
| Inline Source Highlight | View source passage | `GET /trust-lens/sources/{sourceId}` | Only for source-backed highlights. |
| Decision Bar | Use as draft | None | Local toast. |
| Decision Bar | Add context | None | Local input. |
| Decision Bar | Verify first | None | Local tab switch. |
| Decision Bar | Ask alternative view | Optional future endpoint | Prototype uses local mock assistant message. |
| Decision Bar | Regenerate | Optional future endpoint | Prototype uses local toast. |

## Trust Lens Render Rule

The Trust Lens panel must not render until:

```ts
workflowStep === "final_answer_ready"
```

The final answer response is the source for initial Trust Lens tab data.

No separate `GET /trust-lens/panel` endpoint is required for the prototype contract.

## Mock Mode Mapping

| API Call | Mock Source |
| --- | --- |
| Session create | Local generated session ID. |
| Prompt readiness | `promptReadinessRisks`, `qualityRiskRows`, `clarificationQuestions`. |
| Improved prompt | `improvedPromptTemplate`. |
| Directions | `answerDirections`. |
| Final answer | `finalAnswerBlocks`, `highlightDefinitions`, Trust Lens mock arrays. |
| Recheck start | Local generated job ID. |
| Recheck polling | Timed local `recheckSteps`. |
| Source passage | `mockSources`. |

## Failure Mapping

| Failure | UI Behavior |
| --- | --- |
| Session create fails | Use local session ID in prototype or show inline error in API mode. |
| Readiness fails | Show cautious fallback readiness card. |
| Improved prompt fails | Allow continue with original prompt. |
| Directions fail | Use local fallback directions. |
| Final answer fails | Stay before final answer, show retry, do not show Trust Lens. |
| Recheck start fails | Show toast, keep old claims. |
| Recheck polling fails | Show retry or keep old claims. |
| Source passage fails | Show source unavailable fallback modal. |

