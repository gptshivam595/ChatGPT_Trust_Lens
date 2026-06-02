# Screen 12: Responsive Tablet And Mobile Behavior

## Purpose

Define how every screen adapts across desktop, tablet, and mobile.

## Breakpoints

| Range | Behavior |
| --- | --- |
| `>= 1024px` | Desktop shell with visible sidebar and inline Trust Lens panel. |
| `768px to 1023px` | Tablet shell with collapsible sidebar and Trust Lens drawer. |
| `< 768px` | Mobile shell with menu sidebar and full-screen Trust Lens drawer. |

## Desktop

```text
+----------------------+----------------------------------+----------------------+
| Sidebar 260px        | Main chat                        | Trust Lens 420px     |
+----------------------+----------------------------------+----------------------+
```

Rules:

- Sidebar always visible.
- Top bar compact.
- Composer sticky in main column.
- Trust Lens panel inline after final answer.
- Direction previews use three columns.

## Tablet

```text
+------------------------------------------------------------+
| Top bar with sidebar menu                                  |
| Main chat                                                  |
| Composer                                                   |
| Trust Lens right drawer overlay after final answer         |
+------------------------------------------------------------+
```

Rules:

- Sidebar hidden behind menu.
- Trust Lens panel opens as right overlay drawer.
- Drawer width around `420px`, capped by viewport.
- Main chat remains readable.
- Backdrop may appear behind drawer.

## Mobile

```text
+------------------------------------------+
| Top bar                                  |
| Chat content                             |
| Composer sticky bottom                   |
+------------------------------------------+

Trust Lens:
+------------------------------------------+
| Full-screen drawer                       |
| Header                                   |
| Tabs                                     |
| Content                                  |
| Decision bar                             |
+------------------------------------------+
```

Rules:

- Sidebar opens full-screen or nearly full-screen.
- Trust Lens opens full-screen after final answer.
- Direction cards stack.
- Capability cards stack.
- Prompt sections stack.
- Tabs can scroll horizontally.
- Decision bar can wrap to two rows.
- Composer must not be hidden behind drawer controls when drawer is closed.

## Per-Screen Responsive Notes

| Screen | Mobile Behavior |
| --- | --- |
| Empty State | Cards stack, title scale reduces, sample prompt remains visible. |
| Readiness Check | Questions stack, chip options wrap. |
| Improved Prompt | Original and improved prompts stack. |
| Direction Previews | Cards stack vertically. |
| Final Answer | Full-width readable column with margins. |
| Trust Lens Panel | Full-screen drawer. |
| Popovers | Use bottom sheet or inline disclosure if viewport is too narrow. |
| Source Modal | Full-screen dialog. |
| Recheck Progress | Full-width progress surface. |
| Recheck Summary | Buttons stack or wrap. |

## Mobile Click Actions

| Element | Action |
| --- | --- |
| Menu button | Open sidebar drawer. |
| Sidebar backdrop | Close sidebar drawer. |
| Trust Lens close | Close full-screen Trust Lens drawer. |
| Collapsed Trust Lens button | Open full-screen Trust Lens drawer. |
| Tab row swipe | Horizontally scroll tabs. |

## Accessibility

- Drawers need focus management.
- Full-screen drawer close button must be first or near-first focusable control.
- Backdrop click is optional, Escape close is required where supported.
- Body scroll should be locked while full-screen drawer or modal is open.

## Layout Failure Checks

- No overlapping composer and drawer controls.
- No horizontal body scroll.
- No clipped tab labels without scroll.
- No button text wrapping on desktop.
- No inaccessible tiny touch targets on mobile.
- Touch targets should be at least `44px` high where possible.

