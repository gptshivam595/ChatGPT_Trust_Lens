# Screen 00: Global App Shell

## Purpose

Define the persistent app frame used by every state of the Trust Lens prototype.

## Entry Conditions

This shell is visible from app load through the full flow.

Trust Lens panel area is conditionally rendered only after `workflowStep === "final_answer_ready"`.

## Desktop Layout

```text
+----------------------+----------------------------------+----------------------+
| Sidebar              | Main Column                      | Trust Lens Panel     |
|                      |                                  | after final only     |
| App name             | Top bar                          | Header               |
| Badge                | Chat scroll area                 | Tabs                 |
| New chat             |                                  | Tab content          |
| History              |                                  | Decision bar         |
| Footer profile       | Composer                         |                      |
+----------------------+----------------------------------+----------------------+
```

## Regions

### Left Sidebar

Width:

- Desktop: `260px`.
- Tablet and mobile: hidden behind menu.

Visual:

- Dark muted neutral background.
- Light foreground text.
- Compact density.
- Subtle dividers.

Contains:

- App name: `ChatGPT`.
- Badge: `Trust Lens Prototype`.
- New chat button.
- Chat history:
  - `AI trust research`
  - `Product solution draft`
  - `Research survey analysis`
- Footer profile/settings row.

### Main Column

Contains:

- Top bar.
- Scrollable chat content.
- Sticky bottom composer.

Before Trust Lens opens:

- Chat content max width around `760px`.
- Centered in the available area.

After Trust Lens opens:

- Chat content can reduce to around `720px`.
- Main area remains independently scrollable.

### Top Bar

Contains:

- Title: `ChatGPT`.
- Label: `Trust Lens enabled`.
- Model pill: `GPT-5.5`.
- Mobile menu button on tablet/mobile.

### Composer

Placeholder:

`Ask anything, or paste a task you want help evaluating...`

Contains:

- Textarea.
- Send button with icon.

Rules:

- Sticky at bottom of main column.
- Disabled send button when composer is empty.
- Enter submits.
- Shift+Enter inserts new line.
- Focus ring visible.

### Trust Lens Region

Before final answer:

- Not rendered.

After final answer:

- If `trustLensOpen = true`, show panel.
- If `trustLensOpen = false`, show collapsed vertical `Trust Lens` rail.

## Click Actions

| Element | Action |
| --- | --- |
| New chat | Reset flow to initial state after confirmation or immediate prototype reset. |
| Chat history item | Show toast: `Mock chat history is not connected in this prototype.` |
| Sidebar footer row | Show toast: `Settings are not part of this prototype.` |
| Mobile menu | Open sidebar drawer. |
| Close sidebar | Close sidebar drawer. |
| Send button | Submit composer if non-empty. |
| Model pill | Show toast: `Model selection is mocked for this prototype.` |
| Trust Lens rail | Open Trust Lens panel after final answer. |

## Accessibility

- Sidebar drawer needs accessible label.
- Mobile menu button has `aria-label="Open sidebar"`.
- Send button has `aria-label="Send message"`.
- Top bar controls have visible focus.
- Composer textarea has descriptive placeholder and label.

## Responsive Notes

Tablet:

- Sidebar becomes overlay drawer.
- Trust Lens becomes right overlay drawer.

Mobile:

- Sidebar and Trust Lens are full-screen drawers.
- Composer remains sticky and visible.
- Top bar is compact.

## Exit Conditions

This shell never exits. It adapts as the workflow progresses.

