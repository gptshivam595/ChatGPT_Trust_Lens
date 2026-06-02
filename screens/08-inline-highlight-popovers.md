# Screen 08: Inline Highlight Popovers

## Purpose

Explain why a phrase is highlighted and let the user inspect source, queue verification, or jump to Trust Lens context.

## Entry Conditions

- Final answer is visible.
- User hovers or focuses an inline highlight.

## Highlight Types

### Source

Visual:

- Green dotted underline.
- Small `Source` label.

Popover:

Title:

`Source-backed claim`

Body:

`This claim is supported by a retrieved source.`

Metadata:

`Source: Mock research note, 2026`

Action:

`View source passage`

### Verify

Visual:

- Amber dotted underline.
- Small `Verify` label.

Popover:

Title:

`Needs verification`

Body:

`This claim may require external validation before using it in important work.`

Action:

`Add to recheck queue`

### Assumption

Visual:

- Blue dotted underline.
- Small `Assumption` label.

Popover:

Title:

`Assumption`

Body:

`This statement depends on an assumption inferred from the prompt or selected answer direction.`

Action:

`Show in Trust Lens`

### Product Logic

Visual:

- Neutral or blue dotted underline.
- Small `Product logic` label.

Popover:

Title:

`Product logic`

Body:

`This describes the intended behavior of the prototype and should be validated with users.`

Action:

`Add to recheck queue`

## Layout

```text
Text with highlighted phrase [Source]
                    +---------------------------+
                    | Source-backed claim       |
                    | This claim is supported...|
                    | Source: Mock research...  |
                    | [View source passage]     |
                    +---------------------------+
```

## Click Actions

| Element | Action | State Change |
| --- | --- | --- |
| Highlight hover | Open popover. | `activeTooltipId = highlightId` |
| Highlight focus | Open popover. | `activeTooltipId = highlightId` |
| Mouse leave | Close popover unless focus remains inside. | `activeTooltipId = null` |
| Escape | Close popover. | `activeTooltipId = null` |
| View source passage | Open source modal. | `modalState.sourcePassageOpen = true` |
| Add to recheck queue | Show toast. | `toast = "Added to Recheck Output."` |
| Show in Trust Lens | Open panel and assumptions tab. | `trustLensOpen = true`, `activeTrustLensTab = "assumptions"` |

## Accessibility

- Highlight trigger must be focusable.
- Use popover behavior because actions exist inside.
- `aria-expanded` reflects popover state.
- `aria-controls` points to popover content.
- Popover buttons are reachable by keyboard.

## Responsive Notes

Mobile:

- Popover can become a small bottom sheet or inline disclosure.
- It must not overflow the viewport.

## Exit Conditions

User closes popover, opens source modal, queues recheck, or switches Trust Lens tab.

