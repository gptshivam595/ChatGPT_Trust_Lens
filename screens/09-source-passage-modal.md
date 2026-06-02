# Screen 09: Source Passage Modal

## Purpose

Show the mock source passage that supports a source-backed claim.

## Entry Conditions

- Final answer is visible.
- User opens a source-backed highlight popover.
- User clicks `View source passage`.

## Layout

```text
Modal Overlay

+------------------------------------------------+
| Source passage                            [X]  |
| Mock research note: AI output review behavior  |
| mock://research/ai-output-review-2026          |
|                                                |
| Passage text with exact supporting sentence    |
| highlighted.                                   |
|                                                |
| [Back to output]                               |
+------------------------------------------------+
```

## Visible Elements

Header:

`Source passage`

Source title example:

`Mock research note: AI output review behavior`

Mock URL:

`mock://research/ai-output-review-2026`

Passage:

`Users often rely on polished AI outputs unless the interface makes uncertainty, assumptions, and review needs visible near the generated text.`

Supporting sentence:

Same sentence, highlighted in the passage.

Action:

`Back to output`

## Visual Treatment

- Modal uses soft shadow and border.
- Backdrop is subtle, not opaque black.
- Highlighted sentence uses source-backed tint.
- Metadata is smaller and muted.

## Click Actions

| Element | Action | State Change |
| --- | --- | --- |
| X close | Close modal. | `modalState.sourcePassageOpen = false` |
| Backdrop | Close modal. | `modalState.sourcePassageOpen = false` |
| Back to output | Close modal and return focus. | `modalState.sourcePassageOpen = false` |
| Escape | Close modal. | `modalState.sourcePassageOpen = false` |

## Accessibility

- Use `role="dialog"`.
- Use `aria-modal="true"`.
- Focus first meaningful element on open.
- Trap focus while open.
- Return focus to originating highlight after close.

## Fallback State

If source is missing:

Text:

`Source passage unavailable in prototype.`

Action:

`Back to output`

## Responsive Notes

Mobile:

- Modal becomes full-screen or near full-screen dialog.
- Passage remains readable.
- Close button remains visible.

## Exit Conditions

User closes modal and returns to final answer.

