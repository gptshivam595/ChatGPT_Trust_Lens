# Screen 04: Improved Prompt Preview

## Purpose

Show how ChatGPT can turn the original prompt and clarifications into a stronger, more specific prompt.

## Entry Conditions

- `workflowStep = "improved_prompt_ready"`.
- Prompt Readiness Check has been completed.
- No final answer exists.
- No Trust Lens panel.

## Layout

```text
Prompt Readiness Check remains above

Improved Prompt Preview Card
  Header
  Description
  Original Prompt
  Improved Prompt textarea
  Actions
```

## Visible Elements

### Header

`Improved Prompt Preview`

### Description

`Based on your clarification, ChatGPT can use a more specific prompt to generate a stronger answer.`

### Original Prompt Section

Label:

`Original Prompt`

Text:

`Help me prepare a product solution for improving trust in AI-generated outputs.`

### Improved Prompt Section

Label:

`Improved Prompt`

Editable textarea text:

`Create a decision-ready product solution for a ChatGPT feature that helps users evaluate AI-generated outputs before acting on them. Focus on trust, correctness, completeness, reasoning quality, uncertainty, missing context, assumptions, and claim verification. The answer should support human judgment rather than replacing it. Include product flow, key UI components, user controls, and risks.`

### Actions

Primary:

`Use improved prompt`

Secondary:

`Continue with original prompt`

Optional ghost:

`Reset improved prompt`

## Visual Treatment

- Original prompt should feel read-only.
- Improved prompt textarea should feel editable and active.
- Use side-by-side layout on wide desktop only if width supports it.
- Use stacked layout when Trust Lens is not present and content width is narrow.

## Click Actions

| Element | Action | State Change |
| --- | --- | --- |
| Improved prompt textarea | Edit improved prompt. | Update `improvedPrompt`. |
| Use improved prompt | Continue with edited improved prompt. | `selectedPromptMode = "improved"`, `workflowStep = "answer_directions_loading"` |
| Continue with original prompt | Continue using original prompt. | `selectedPromptMode = "original"`, `workflowStep = "answer_directions_loading"` |
| Reset improved prompt | Restore default improved prompt. | Stay on same screen. |

## Validation

- If improved prompt is empty, disable `Use improved prompt`.
- `Continue with original prompt` remains available.

## Accessibility

- Textarea needs visible label.
- Read-only original prompt should be announced clearly.
- Primary and secondary actions should be keyboard reachable.

## Responsive Notes

Mobile:

- Original and improved prompt sections stack.
- Textarea height should be enough for editing but not consume the full screen.

## Exit Conditions

Timed transition starts after choosing prompt mode.

Next screen:

- `05-answer-direction-previews.md`

