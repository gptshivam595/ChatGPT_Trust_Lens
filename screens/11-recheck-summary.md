# Screen 11: Recheck Summary

## Purpose

Show the result of deeper review and give users clear next actions.

## Entry Conditions

- `recheckStatus = "complete"`.
- Final answer exists.
- Trust Lens is available.

## Layout

```text
Below Final Answer

+----------------------------------------------+
| Recheck Summary                              |
| Trust Lens reviewed 4 claims...              |
| Supported: 1                                 |
| Needs verification: 2                        |
| Assumption/inference: 1                      |
| Conflicting evidence: 0                      |
| [Open Claims] [View highlighted output]      |
| [Add missing context]                        |
+----------------------------------------------+
```

## Visible Elements

Title:

`Recheck Summary`

Content:

`Trust Lens reviewed 4 claims in this answer. Most of the product logic is plausible, but several claims should be validated through user research before being used in a final deck.`

Rows:

- `Supported: 1`
- `Needs verification: 2`
- `Assumption/inference: 1`
- `Conflicting evidence: 0`

Buttons:

- `Open Claims`
- `View highlighted output`
- `Add missing context`

## Trust Lens Claims Tab Updates

After recheck, claim statuses should use:

- `Supported`
- `Needs verification`
- `Conflicting evidence`
- `No clear evidence found`
- `Assumption/inference`

Required summary:

- `4 claims reviewed`
- `1 supported`
- `2 need verification`
- `1 assumption/inference`
- `0 conflicting evidence`

## Click Actions

| Element | Action | State Change |
| --- | --- | --- |
| Open Claims | Open Trust Lens and Claims tab. | `trustLensOpen = true`, `activeTrustLensTab = "claims"` |
| View highlighted output | Scroll final answer into view. | No data change. |
| Add missing context | Open Trust Lens Missing Context tab. | `trustLensOpen = true`, `activeTrustLensTab = "missing_context"` |
| Recheck Output again | Start recheck again if allowed. | `recheckStatus = "running"` |

## Visual Treatment

- Summary card uses subtle border.
- Rows are compact.
- No score meter.
- No progress bars.
- Buttons are clear and compact.

## Accessibility

- Summary title should be a heading.
- Result counts should be readable as text.
- Buttons have clear focus states.

## Responsive Notes

Mobile:

- Buttons stack or wrap cleanly.
- Counts stay readable.

## Exit Conditions

User can continue reviewing claims, missing context, highlights, or decision actions.

