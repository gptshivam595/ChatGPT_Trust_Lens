# Screen 10: Recheck Progress

## Purpose

Show the user that Trust Lens is performing a deeper simulated review of the final answer.

## Entry Conditions

- Final answer exists.
- User clicks `Recheck Output` or `Recheck with Trust Lens`.
- `recheckStatus = "running"`.
- `trustLensOpen = true`.

## Layout

```text
Progress Surface

Rechecking output...

[running] Claim Extraction
[pending] Query Generation
[pending] Information Retrieval
[pending] Cross-Referencing
[pending] Evaluation
[pending] Visual Highlighting
```

## Visible Elements

Title:

`Rechecking output...`

Steps:

1. `Claim Extraction`
   - `Identifying factual, numeric, technical, and decision-critical claims.`
2. `Query Generation`
   - `Creating search-style queries for claims that need evidence.`
3. `Information Retrieval`
   - `Finding mock supporting or conflicting information.`
4. `Cross-Referencing`
   - `Comparing the generated output against retrieved evidence.`
5. `Evaluation`
   - `Labeling claims by evidence status.`
6. `Visual Highlighting`
   - `Updating inline highlights and Trust Lens results.`

## Behavior

- Total duration around `2 seconds`.
- Each step moves from pending to running to complete.
- Completed steps show checkmark.
- Active step has text label, not color only.
- Recheck button is disabled while running.

## Click Actions

| Element | Action | State Change |
| --- | --- | --- |
| Recheck Output while idle | Start progress. | `recheckStatus = "running"` |
| Recheck Output while running | No duplicate start. | Show toast or keep disabled. |
| Cancel if implemented | Close progress only, or stop mock job. | Optional, not required. |

## Automatic Actions

On start:

- `trustLensOpen = true`.
- `recheckProgressStep = 0`.

During progress:

- Advance step index every `300ms to 350ms`.

On complete:

- `recheckStatus = "complete"`.
- `recheckComplete = true`.
- `activeTrustLensTab = "claims"`.
- Show `Recheck complete`.
- Then show Recheck Summary below final answer.

## Accessibility

- Progress updates announced with `aria-live="polite"`.
- Steps include text status.
- Reduced motion shows static step changes without animation.

## Responsive Notes

Desktop:

- Progress can be modal, drawer, or inline panel.

Mobile:

- Prefer full-width modal or bottom sheet.
- Do not hide composer permanently.

## Exit Conditions

After completion:

- `11-recheck-summary.md`
- Trust Lens Claims tab is active.

