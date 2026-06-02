# Idempotency And Race Guards

This document defines API and frontend safety behavior for duplicate clicks, stale responses, and invalid transitions.

## Idempotency Headers

Recommended for future API mode:

```text
Idempotency-Key: <client-generated-uuid>
```

Use for:

- `POST /trust-lens/final-answer`
- `POST /trust-lens/recheck`

Not required for:

- Local mock mode.
- Tab switches.
- Source lookup.

## Request Correlation

Future frontend API adapter should track:

- `sessionId`
- `answerId`
- `jobId`
- active request token or abort controller.

If the user starts a new chat, stale responses must be ignored.

## Guard Rules

### Submit Prompt

Allowed only when:

```ts
workflowStep === "initial" && composerValue.trim() !== ""
```

If not allowed:

- No-op.

### Use Sample Prompt

Behavior:

- Fill composer only.
- Do not auto-submit.

### Select Answer Direction

Allowed only when:

```ts
workflowStep === "answer_directions_ready"
```

After selection:

- Disable other direction cards.
- Move to final answer loading.

### Final Answer Ready

Allowed only when:

```ts
workflowStep === "final_answer_loading"
```

After success:

- Set `workflowStep = "final_answer_ready"`.
- Set `trustLensOpen = true`.
- Set `activeTrustLensTab = "quality"`.

### Open Trust Lens

Allowed only when:

```ts
workflowStep === "final_answer_ready"
```

### Start Recheck

Allowed only when:

```ts
workflowStep === "final_answer_ready" &&
recheckStatus !== "running"
```

If running:

- Disable button or no-op.

### Complete Recheck

Allowed only when:

```ts
workflowStep === "final_answer_ready" &&
recheckStatus === "running"
```

After completion:

- Set `recheckStatus = "complete"`.
- Show Recheck Summary.
- Switch Trust Lens tab to `claims`.

### Open Source Modal

Allowed when:

- Highlight kind is `source`.
- `sourceId` exists.

If source is missing:

- Show fallback modal: `Source passage unavailable in prototype.`

### New Chat During Recheck

Behavior:

- Reset all app state.
- Cancel timers.
- Ignore pending API responses.
- Close modal, popover, and toast.

## Stale Response Rules

Ignore API responses if:

- The session ID no longer matches current session.
- The workflow step no longer accepts that response.
- The user clicked New Chat.
- The request was aborted.

## Duplicate Action Rules

| Action | Duplicate Behavior |
| --- | --- |
| Send prompt | Ignore after first submit. |
| Direction selection | Disable cards after first selection. |
| Recheck Output | Disable while running. |
| Source modal open | Reuse current modal state. |
| Toast | Replace existing toast. |

## Frontend Implementation Note

Even in mock mode, implement these guards. Timers can create the same race conditions as network requests.

