# Screen 06: Final Output

## Purpose

Display the generated answer and make claim-level review available through inline highlights and Recheck Output.

## Entry Conditions

- `workflowStep = "final_answer_loading"` then `final_answer_ready`.
- User selected an answer direction.
- Trust Lens opens automatically after final answer renders.

## Loading Layout

```text
Assistant Loading Row
  Generating final answer using Decision-Ready Output...
```

## Ready Layout

```text
Assistant Final Answer
  Title
  Intro paragraph with inline highlights
  Sections
  Bullets
  Inline highlighted claims
  Visible Recheck Output button
  More actions menu

Trust Lens Panel opens on right
```

## Visible Elements

### Title

`Trust Lens: A Review Layer for Better AI Output Evaluation`

### Body Requirements

The final answer should include:

- Short intro.
- Structured sections.
- Bullet points.
- Inline highlighted phrases.

Required sections:

1. `Before generation: Prompt Readiness Check`
2. `Before final answer: Answer Direction Preview`
3. `After generation: Trust Lens Output Review`
4. `Inline evidence and verification`
5. `Recheck Output workflow`
6. `Why this supports human judgment`

### Required Highlighted Phrases

| Phrase | Highlight Type |
| --- | --- |
| `evaluate AI-generated outputs before acting on them` | Source |
| `detects missing context, ambiguity, and answer-quality risk` | Product logic or assumption |
| `gives users more control` | Verify |
| `reviews correctness, completeness, reasoning quality, usefulness, and uncertainty` | Product logic |
| `not to make users blindly trust the AI` | Source |
| `what they should verify before using it` | Verify |

### Output Actions

Visible button:

`Recheck Output`

More actions menu:

- `Recheck with Trust Lens`
- `Copy draft`
- `Ask for alternative view`

## Visual Treatment

- Assistant answer uses readable content column.
- Highlight underlines are dotted.
- Highlight label text is visible.
- Recheck button is below final answer, not hidden only in menu.
- More actions button is secondary.

## Click Actions

| Element | Action | State Change |
| --- | --- | --- |
| Recheck Output | Start recheck progress. | `recheckStatus = "running"`, `trustLensOpen = true` |
| More actions | Open menu. | Menu open. |
| Recheck with Trust Lens | Same as visible Recheck Output. | `recheckStatus = "running"` |
| Copy draft | Show toast. | `toast = "Draft copied in prototype."` |
| Ask for alternative view | Append alternative view assistant message. | Add mock assistant message. |
| Inline Source highlight | Show source popover. | `activeTooltipId = source highlight id` |
| Inline Verify highlight | Show verification popover. | `activeTooltipId = verify highlight id` |
| Inline Assumption highlight | Show assumption popover. | `activeTooltipId = assumption highlight id` |

## Automatic Actions

When final answer appears:

- Set `workflowStep = "final_answer_ready"`.
- Set `trustLensOpen = true`.
- Set `activeTrustLensTab = "quality"`.

## Accessibility

- Final answer title should be a heading.
- Highlight triggers must be keyboard focusable.
- Recheck Output button must be reachable after answer content.
- More actions menu should support Escape close.

## Responsive Notes

Desktop:

- Trust Lens opens on right.

Tablet:

- Trust Lens opens as right drawer.

Mobile:

- Trust Lens opens full-screen or can be shown after a brief panel transition.
- Final answer remains available when drawer is closed.

## Exit Conditions

Possible next screens:

- `07-trust-lens-panel.md`
- `08-inline-highlight-popovers.md`
- `10-recheck-progress.md`

