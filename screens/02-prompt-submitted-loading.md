# Screen 02: Prompt Submitted And Readiness Loading

## Purpose

Show that the user prompt was accepted and that ChatGPT is evaluating prompt quality before generation.

## Entry Conditions

- User submits a non-empty prompt.
- `workflowStep = "prompt_submitted"` then immediate transition to `prompt_readiness_loading`.
- No Trust Lens panel.

## Layout

```text
Chat Content

User Message
  Help me prepare a product solution...

Assistant Loading Row
  Running Prompt Readiness Check...
  animated dots or shimmer

Sticky Composer
```

## Visible Elements

### User Message

Displays submitted prompt in a user message bubble or card.

Default text:

`Help me prepare a product solution for improving trust in AI-generated outputs.`

### Assistant Loading State

Text:

`Running Prompt Readiness Check...`

Visual:

- Small typing indicator or shimmer.
- No spinner-only state.
- Subtle motion.

## Behavior

- User message appears immediately.
- Prompt readiness loading appears immediately after submit.
- After about `800ms`, transition to Prompt Readiness Check.
- Composer may remain visible but should not interrupt the loading state.

## Click Actions

| Element | Action | State Change |
| --- | --- | --- |
| Send button during loading | Optional disabled, or allow new prompt reset if implemented. | Prefer disabled for prototype clarity. |
| New chat | Reset to initial state. | `workflowStep = "initial"` |

## Accessibility

- Loading text should be visible, not animation-only.
- Loading region can use `aria-live="polite"`.
- Reduced motion should replace shimmer with static loading text.

## Responsive Notes

Mobile:

- User message spans most width but keeps readable margins.
- Loading row stays in chat scroll area.

## Exit Conditions

Timed transition after `800ms`.

Next screen:

- `03-prompt-readiness-check.md`

