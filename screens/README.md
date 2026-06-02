# Trust Lens Screen Specifications

This folder defines every screen, state, click action, and interaction required for the Trust Lens prototype.

Use these files with:

- `PRODUCT.md` for product intent and copy rules.
- `DESIGN.md` for visual standards.
- `ARCHITECTURE.md` for state, component, and data contracts.
- `12_PHASE_PLAN.md` for execution order.

## Screen Inventory

| File | Screen Or State | Purpose |
| --- | --- | --- |
| `00-global-shell.md` | Global app shell | Shared sidebar, top bar, chat area, composer, responsive behavior. |
| `01-empty-state.md` | Initial empty state | Welcome view and sample prompt entry. |
| `02-prompt-submitted-loading.md` | Prompt submitted and readiness loading | User message and Prompt Readiness loading state. |
| `03-prompt-readiness-check.md` | Prompt Readiness Check | Risk review and clarifying questions. |
| `04-improved-prompt-preview.md` | Improved Prompt Preview | Original vs improved prompt comparison and prompt choice. |
| `05-answer-direction-previews.md` | Answer Direction Previews | Three possible answer directions before final answer. |
| `06-final-answer.md` | Final Output | Structured answer, inline highlights, visible recheck action. |
| `07-trust-lens-panel.md` | Trust Lens Panel | Right review panel with tabs and decision bar. |
| `08-inline-highlight-popovers.md` | Inline Highlight Popovers | Hover/focus claim details and actions. |
| `09-source-passage-modal.md` | Source Passage Modal | Mock source viewer focused on exact supporting passage. |
| `10-recheck-progress.md` | Recheck Progress | Six-step simulated deeper review flow. |
| `11-recheck-summary.md` | Recheck Summary | Post-recheck output summary and updated claim behavior. |
| `12-responsive-mobile-tablet.md` | Responsive Screens | Tablet and mobile layout behavior. |
| `13-click-action-matrix.md` | Click Action Matrix | Complete action-to-state mapping. |

## Global Product Rule

Trust Lens UI must not appear before the final answer exists.

Before final answer:

- No Trust Lens right panel.
- No Trust Lens collapsed rail.
- No Trust Lens tabs.
- No Trust Lens decision bar.

After final answer:

- Trust Lens opens automatically.
- User may close it.
- Collapsed Trust Lens rail may appear.
- Recheck and source interactions are available.

## Global Visual Rules

- Use a calm, light, neutral product UI.
- Keep cards at `8px` radius.
- Avoid decorative gradients and glassmorphism.
- Use borders before shadows.
- No nested cards.
- Every semantic color must have a text label.
- No numeric trust score.
- No claim of guaranteed correctness.

## Global Interaction Rules

- Buttons use native `button` behavior.
- All controls need visible focus states.
- Tooltips or popovers must open on focus, not only hover.
- Recheck can be triggered only after final answer.
- Recheck cannot start twice while already running.
- Closing Trust Lens does not reset answer, tab, or recheck state.
- Source modal returns the user to the output context.

## Global Screen Geometry

Desktop:

```text
+----------------------+----------------------------------+----------------------+
| Sidebar              | Main Chat Area                   | Trust Lens Panel     |
| 260px                | Flexible                         | 420px after final    |
+----------------------+----------------------------------+----------------------+
```

Before final answer:

```text
+----------------------+---------------------------------------------------------+
| Sidebar              | Main Chat Area                                          |
| 260px                | Centered content around 760px                          |
+----------------------+---------------------------------------------------------+
```

Mobile:

```text
+--------------------------------------------------+
| Top bar with menu                                |
| Chat content                                     |
| Sticky composer                                  |
| Trust Lens as full-screen drawer after final     |
+--------------------------------------------------+
```

## Naming Standard

Screen files use this format:

```text
NN-screen-name.md
```

Each screen spec contains:

- Purpose.
- Entry conditions.
- Layout.
- Visible elements.
- Behavior.
- Click actions.
- Accessibility.
- Responsive notes.
- Exit conditions.

