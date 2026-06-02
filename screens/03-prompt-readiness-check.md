# Screen 03: Prompt Readiness Check

## Purpose

Show the user why the prompt may produce a weaker answer and invite quick clarification.

## Entry Conditions

- `workflowStep = "prompt_readiness_ready"`.
- User prompt has been submitted.
- No final answer exists.
- No Trust Lens panel.

## Layout

```text
User Message

Prompt Readiness Check Card
  Header + risk badge
  Explanation
  Risk chips
  Quality risk rows
  Clarifying questions
  Actions
```

## Visible Elements

### Card Header

Title:

`Prompt Readiness Check`

Badge:

`Medium answer-quality risk`

### Explanation

`This prompt may produce a useful answer, but the goal, audience, required depth, and verification needs are not fully clear.`

### Risk Chips

- `Missing context`
- `Ambiguous goal`
- `High-stakes intent possible`
- `Needs evaluation support`

### Quality Risk Rows

| Row | Level |
| --- | --- |
| Missing context | Medium |
| Ambiguity | Medium |
| High-stakes intent | Medium |
| Need for factual verification | Medium |
| Answer-quality risk | Medium to High |

### Clarification Intro

`Answer 3 quick questions to improve the prompt.`

### Question 1

`What is this output mainly for?`

Options:

- `Personal understanding`
- `College/project submission`
- `Work presentation`
- `Product case study`
- `Decision-making`

Default:

`Product case study`

### Question 2

`What level of depth do you need?`

Options:

- `Quick summary`
- `Structured explanation`
- `Detailed product thinking`
- `Decision-ready output`

Default:

`Decision-ready output`

### Question 3

`How reliable should the final answer be?`

Options:

- `Good enough draft`
- `Needs careful review`
- `Should include assumptions`
- `Should flag claims to verify`

Default:

`Should include assumptions`

### Actions

Primary:

`Generate improved prompt`

Secondary:

`Skip and continue`

Ghost:

`Edit original prompt`

## Visual Treatment

- The risk badge uses amber or neutral warning tone, not red.
- Chips are compact and readable.
- Selected option chips use text and subtle accent.
- Rows are separated with dividers, not nested cards.

## Click Actions

| Element | Action | State Change |
| --- | --- | --- |
| Clarification option | Select option for that question. | Update `selectedClarifications`. |
| Generate improved prompt | Generate improved prompt preview. | `workflowStep = "improved_prompt_ready"` |
| Skip and continue | Skip prompt improvement. | `selectedPromptMode = "original"`, `workflowStep = "answer_directions_loading"` |
| Edit original prompt | Reveal editable original prompt textarea or enable inline editing. | Stay on same screen. |
| Save original edit | Update editable original prompt. | Stay on same screen. |
| Cancel original edit | Revert editing UI. | Stay on same screen. |

## Keyboard Actions

- Tab moves through option groups and actions.
- Arrow keys can move inside radio-style chip groups if implemented.
- Enter or Space selects focused option.

## Accessibility

- Each question should be a labeled radio group.
- Selected state must not rely on color alone.
- Risk rows should be readable by screen readers.
- The primary action should be clear after the final question.

## Responsive Notes

Mobile:

- Questions stack.
- Option chips wrap naturally.
- Buttons stack with primary first.

## Exit Conditions

Next screens:

- Generate improved prompt -> `04-improved-prompt-preview.md`
- Skip and continue -> `05-answer-direction-previews.md`

