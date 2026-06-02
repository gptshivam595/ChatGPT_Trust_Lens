# Screen 01: Initial Empty State

## Purpose

Introduce Trust Lens and let the user start the complete prototype flow without typing.

## Entry Conditions

- `workflowStep = "initial"`.
- `originalPrompt` is empty.
- `trustLensOpen = false`.
- No final answer exists.

## Layout

```text
Main Chat Area

          Improve and evaluate AI outputs with Trust Lens
          Trust Lens helps you refine prompts...

    + Prompt Readiness + Answer Direction Preview + Output Review

          [Use sample prompt]

Sticky Composer
```

## Visible Elements

### Title

`Improve and evaluate AI outputs with Trust Lens`

### Subtitle

`Trust Lens helps you refine prompts, compare answer directions, and review assumptions, uncertainty, missing context, and claims before acting on an AI response.`

### Capability Cards

Card 1:

- Title: `Prompt Readiness`
- Description: `Detects missing context and answer-quality risk before generation.`

Card 2:

- Title: `Answer Direction Preview`
- Description: `Shows possible response directions before creating the final answer.`

Card 3:

- Title: `Output Review`
- Description: `Surfaces assumptions, missing context, uncertainty, and claims to verify.`

### Sample Prompt Button

Label:

`Use sample prompt`

Sample prompt:

`Help me prepare a product solution for improving trust in AI-generated outputs.`

### Composer

Placeholder remains visible unless sample prompt is loaded.

## Visual Treatment

- Centered but not oversized.
- Calm neutral background.
- Capability cards use subtle borders.
- No Trust Lens panel.
- No right-side empty placeholder.

## Click Actions

| Element | Action | State Change |
| --- | --- | --- |
| Use sample prompt | Fill composer with sample prompt. | `composerValue = samplePrompt` |
| Send button with sample prompt | Submit prompt. | `workflowStep = "prompt_submitted"` |
| Send button empty | No action. | None |
| New chat | Keep/reset initial state. | `workflowStep = "initial"` |

## Keyboard Actions

| Key | Action |
| --- | --- |
| Tab | Move through sample prompt button, composer, send button. |
| Enter on sample prompt button | Fill composer. |
| Enter in composer | Submit if non-empty. |
| Shift+Enter in composer | Insert newline. |

## Accessibility

- Empty state title should be the main heading.
- Capability cards should not be focusable unless interactive.
- Sample prompt button must be reachable by keyboard.
- Send disabled state must be clear to assistive tech.

## Responsive Notes

Mobile:

- Capability cards stack vertically.
- Title uses smaller scale.
- Composer remains sticky.
- No text overlap.

## Exit Conditions

Exit when user submits a prompt.

Next screen:

- `02-prompt-submitted-loading.md`

