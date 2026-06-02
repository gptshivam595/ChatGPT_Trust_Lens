# Screen 05: Answer Direction Previews

## Purpose

Let the user choose the answer shape before generating the final response.

## Entry Conditions

- User selected improved or original prompt.
- `workflowStep = "answer_directions_loading"` then `answer_directions_ready`.
- No final answer exists.
- No Trust Lens panel.

## Loading Layout

```text
Assistant Loading Row
  Generating answer directions...
```

Loading text:

`Generating answer directions...`

After about `700ms to 900ms`, show direction previews.

## Ready Layout

```text
Choose an answer direction
Before generating the final response...

+------------------+ +------------------+ +------------------+
| Quick Summary    | | Detailed Analysis| | Decision-Ready   |
| Fastest          | | Balanced         | | Recommended      |
| Description      | | Description      | | Description      |
| Choose summary   | | Choose analysis  | | Choose decision  |
+------------------+ +------------------+ +------------------+
```

## Visible Elements

### Section Title

`Choose an answer direction`

### Subtitle

`Before generating the final response, choose the format that best matches your intent.`

### Card 1

Title:

`Quick Summary`

Badge:

`Fastest`

Headline:

`Best for a short overview`

Description:

`A concise answer that summarizes the solution in simple points. Useful when you need a quick direction, but it may not deeply cover trade-offs or implementation details.`

CTA:

`Choose summary`

### Card 2

Title:

`Detailed Analysis`

Badge:

`Balanced`

Headline:

`Best for understanding the full idea`

Description:

`A more complete explanation that covers the product flow, user value, risks, and reasoning behind the solution.`

CTA:

`Choose analysis`

### Card 3

Title:

`Decision-Ready Output`

Badge:

`Recommended`

Headline:

`Best match for your intent`

Description:

`A structured product-ready response with feature flow, UI behavior, evaluation logic, user controls, and trust-related edge cases.`

CTA:

`Choose decision-ready`

## Visual Treatment

- Three cards on desktop.
- Recommended card has subtle accent border.
- Hover changes border and lifts by 1px.
- Selected card shows check icon and selected label.
- No loud gradients.

## Click Actions

| Element | Action | State Change |
| --- | --- | --- |
| Choose summary | Select Quick Summary. | `selectedDirection = "summary"`, `workflowStep = "final_answer_loading"` |
| Choose analysis | Select Detailed Analysis. | `selectedDirection = "analysis"`, `workflowStep = "final_answer_loading"` |
| Choose decision-ready | Select Decision-Ready Output. | `selectedDirection = "decision_ready"`, `workflowStep = "final_answer_loading"` |

## After Selection

Show assistant message:

`Generating final answer using Decision-Ready Output...`

Use selected title dynamically:

- `Generating final answer using Quick Summary...`
- `Generating final answer using Detailed Analysis...`
- `Generating final answer using Decision-Ready Output...`

After about `900ms to 1200ms`, render final answer.

## Accessibility

- Cards should be keyboard selectable.
- Recommended badge is text, not color-only.
- Selected state includes icon and text.

## Responsive Notes

Mobile:

- Cards stack vertically.
- CTA buttons remain one line.
- Recommended card remains visually clear.

## Exit Conditions

Next screen:

- `06-final-answer.md`
- `07-trust-lens-panel.md` opens automatically after final answer.

