# Trust Lens Design Standard

## Design Read

Trust Lens is a serious AI productivity interface for users reviewing generated work before acting on it. The design language should be calm, precise, trust-first, and work-focused.

This is a product UI, not a landing page. It should not feel like a generic SaaS marketing surface.

## Design Position

Target feeling:

- Clear
- Quiet
- Capable
- Reliable
- Human-controlled
- Product-ready

Avoid:

- AI-purple gradient aesthetics.
- Decorative glassmorphism.
- Oversized marketing hero layouts.
- Identical card grids everywhere.
- Nested cards.
- Loud gamified trust scores.
- Dark tech styling just because the product is AI.

## Design Dials

| Dial | Value | Reason |
| --- | --- | --- |
| Design variance | 4/10 | Serious tool UI needs structure and predictability. |
| Motion intensity | 3/10 | Motion should clarify state changes, not perform. |
| Visual density | 6/10 | The app handles review information and repeated actions. |

## Visual System

### Theme

Use a light neutral product theme by default.

Scene:

A user is reviewing AI output during school, work, or product planning on a laptop in normal daylight. The UI should reduce anxiety and help them scan evidence and decisions quickly.

Dark mode can be added later, but the first standard should be a focused light interface.

### Color Strategy

Use a restrained palette:

- Tinted neutral surfaces.
- One primary interaction accent.
- Semantic colors only for evidence states.
- No numeric score color ramps.

Recommended OKLCH tokens:

```css
:root {
  --tl-bg: oklch(0.975 0.006 95);
  --tl-surface: oklch(0.995 0.004 95);
  --tl-surface-muted: oklch(0.94 0.006 95);
  --tl-panel: oklch(0.985 0.005 95);
  --tl-sidebar: oklch(0.22 0.008 95);
  --tl-sidebar-muted: oklch(0.34 0.008 95);

  --tl-text: oklch(0.22 0.01 95);
  --tl-text-muted: oklch(0.48 0.01 95);
  --tl-text-soft: oklch(0.62 0.01 95);
  --tl-border: oklch(0.86 0.008 95);
  --tl-border-strong: oklch(0.74 0.01 95);

  --tl-accent: oklch(0.54 0.13 245);
  --tl-accent-ink: oklch(0.99 0.004 95);
  --tl-focus: oklch(0.62 0.14 245);

  --tl-source: oklch(0.47 0.11 150);
  --tl-source-bg: oklch(0.94 0.035 150);
  --tl-verify: oklch(0.58 0.12 78);
  --tl-verify-bg: oklch(0.95 0.05 78);
  --tl-assumption: oklch(0.55 0.11 245);
  --tl-assumption-bg: oklch(0.94 0.035 245);
  --tl-conflict: oklch(0.52 0.15 28);
  --tl-conflict-bg: oklch(0.95 0.035 28);

  --tl-radius-sm: 6px;
  --tl-radius-md: 8px;
  --tl-radius-lg: 10px;
  --tl-shadow-soft: 0 16px 40px oklch(0.22 0.01 95 / 0.08);
}
```

Color rules:

- Use `--tl-accent` for primary actions and focus only.
- Use source, verify, assumption, and conflict colors only for semantic evidence states.
- Do not use color alone. Every semantic color needs text labels.
- Avoid pure `#000` and pure `#fff`.
- Keep contrast WCAG AA or better.

## Typography

Recommended type stack:

```css
--tl-font-sans: "Geist", "Segoe UI", system-ui, sans-serif;
--tl-font-mono: "Geist Mono", "SFMono-Regular", Consolas, monospace;
```

Typography rules:

- Use sans-serif only.
- Do not use decorative serif display type.
- Body line length should stay between 65 and 75 characters.
- Avoid negative letter spacing.
- Do not scale font size directly with viewport width.
- Use size, weight, and spacing for hierarchy.

Type scale:

| Token | Size | Line Height | Use |
| --- | --- | --- | --- |
| `text-xs` | 12px | 16px | Metadata, badges, labels. |
| `text-sm` | 14px | 20px | Sidebar, compact rows, tabs. |
| `text-base` | 16px | 24px | Main body and chat text. |
| `text-lg` | 18px | 28px | Card titles and section leads. |
| `text-xl` | 20px | 28px | Assistant section titles. |
| `text-2xl` | 24px | 32px | Empty state title. |
| `text-3xl` | 30px | 38px | Rare product-level heading. |

## Layout Standards

### Desktop Shell

```text
Sidebar: 260px
Main chat: flexible
Trust Lens panel: 420px after final answer
Composer: sticky inside main chat
```

Rules:

- Full viewport height uses `100dvh`, not `100vh` or `h-screen`.
- Main chat content max width should be about `760px` before Trust Lens opens.
- When Trust Lens opens, main chat can reduce to about `720px`.
- Trust Lens has its own scroll container.
- Main chat and Trust Lens should never scroll as one shared column.

### Responsive Behavior

Desktop:

- Sidebar visible.
- Trust Lens panel inline on the right.
- Answer directions use three columns.

Tablet:

- Sidebar collapses behind a menu.
- Trust Lens becomes a right drawer overlay.
- Main content remains readable behind overlay.

Mobile:

- Sidebar hidden behind menu.
- Trust Lens becomes full-screen drawer.
- Direction cards stack vertically.
- Composer remains sticky.
- Tabs can horizontally scroll if needed.

## Shape And Elevation

Shape system:

- Cards: `8px`
- Inputs: `10px`
- Buttons: `8px`
- Pills and badges: full radius only for compact labels.
- Modals and drawers: `10px` on desktop, `0px` or `10px` depending on mobile sheet behavior.

Elevation:

- Use borders before shadows.
- Use soft shadows only for modal, drawer, popover, and active layered surfaces.
- Avoid card inside card.
- Avoid decorative floating panels.

## Component Standards

### Sidebar

Purpose:

Navigation context and mock chat history.

Design:

- Dark muted neutral.
- Compact.
- Not visually dominant.
- App name and feature badge at top.
- History items use quiet hover states.
- Footer profile/settings row is subtle.

### Top Bar

Purpose:

Orient the user inside a ChatGPT-style experience.

Design:

- Minimal.
- Product title on left.
- `Trust Lens enabled` label.
- Model selector pill.
- No large hero treatment.

### Composer

Purpose:

Primary input control.

Design:

- Sticky at bottom.
- Clear placeholder.
- Send icon button.
- Textarea expands modestly.
- Submit disabled when empty.
- Strong focus ring.

States:

- Empty.
- Focused.
- Typing.
- Disabled during critical timed transitions if needed.

### Prompt Readiness Card

Purpose:

Warn about answer-quality risk without alarming the user.

Design:

- Use a restrained bordered surface.
- Medium risk badge should be visible but not red.
- Risk chips should be compact.
- Quality rows should scan quickly.
- Clarifying questions should use segmented chip groups.

Do not:

- Use a giant warning banner.
- Use red for medium risk.
- Hide skip action.

### Improved Prompt Preview

Purpose:

Show how the prompt will improve before answer generation.

Design:

- Original and improved prompt should be visually comparable.
- Improved prompt textarea should feel editable, not decorative.
- Primary action should be `Use improved prompt`.
- Secondary action should be `Continue with original prompt`.

### Answer Direction Cards

Purpose:

Let the user choose the final answer shape.

Design:

- Three cards on desktop.
- Stacked cards on mobile.
- Recommended card gets a subtle accent border.
- Hover state can lift by 1px or change border color.
- Selected state shows check icon and clear label.

Avoid:

- Loud gradient borders.
- Oversized illustration cards.
- Cards that shift layout on hover.

### Final Output

Purpose:

Readable answer with inline review signals.

Design:

- Main column remains calm and readable.
- Sections use clear headings.
- Bullets have generous line height.
- Highlight labels are small and attached to phrase context.
- Recheck Output button is visible below answer.

### Inline Highlights

Source:

- Green dotted underline.
- `Source` text label.
- Tooltip title: `Source-backed claim`.

Verify:

- Amber dotted underline.
- `Verify` text label.
- Tooltip title: `Needs verification`.

Assumption:

- Blue dotted underline.
- `Assumption` text label.
- Tooltip title: `Assumption`.

Product logic:

- Neutral or blue dotted underline.
- `Product logic` text label.
- Tooltip title: `Product logic`.

Rules:

- Tooltips open on hover and focus.
- Tooltip actions are keyboard accessible.
- Tooltip copy must explain evidence limits.
- Source action opens source passage modal.

### Trust Lens Panel

Purpose:

Post-final output review.

Design:

- Width around `420px`.
- Full-height or near full-height.
- Slides in from the right on desktop.
- Full-screen drawer on mobile.
- Header remains stable.
- Tabs stay compact.
- Decision bar is sticky at bottom.

Panel sections:

- Header.
- Review summary.
- Tabs.
- Tab content.
- Decision bar.

Important:

- Panel appears only after final answer.
- If closed, show collapsed Trust Lens rail only after final answer.

### Trust Lens Tabs

Design:

- Use actual tab components, not separate floating windows.
- Active tab has strong text and subtle background or underline.
- Long labels can scroll horizontally on mobile.
- Keep content compact but readable.

Tabs:

- Quality.
- Assumptions.
- Missing Context.
- Claims to Verify.
- Alternatives.

### Decision Bar

Purpose:

Keep the user in control.

Buttons:

- Use as draft.
- Add context.
- Verify first.
- Ask alternative view.
- Regenerate.

Design:

- Sticky bottom inside Trust Lens.
- Compact button group.
- Primary action is not too dominant.
- All buttons fit without wrapping at desktop.
- On mobile, use two rows or horizontal scroll if needed.

### Recheck Progress

Purpose:

Make deeper review visible and understandable.

Design:

- Use step list with checkmarks.
- Show one active step.
- Use subtle progress motion.
- Avoid spinner-only UI.
- Completion state says `Recheck complete`.

### Source Passage Modal

Purpose:

Show exact passage support.

Design:

- Dialog with source title, mock URL, passage, highlighted sentence.
- Highlight the exact supporting sentence.
- Include `Back to output`.
- Do not imply the whole source verifies the full answer.

## Motion Standard

Motion intensity is low to moderate.

Use motion for:

- Prompt readiness card fade-in.
- Improved prompt preview slide-up.
- Direction cards subtle stagger.
- Trust Lens panel slide-in.
- Recheck step checkmarks.
- Toast entrance and exit.

Avoid:

- Looping background motion.
- Bounce or elastic easing.
- Decorative animated gradients.
- Hover motion that moves layout.

Motion rules:

```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

Recommended easing:

```css
--tl-ease-out: cubic-bezier(0.16, 1, 0.3, 1);
--tl-ease-in-out: cubic-bezier(0.65, 0, 0.35, 1);
```

## Icon Standard

Use one icon family across the app.

Preferred:

- `lucide-react`, because the architecture already names it and the app needs familiar product UI icons.

Rules:

- Standard stroke width: `1.75`.
- Icon-only buttons require accessible labels.
- Do not hand-roll SVG icons.
- Do not mix icon families.

Core icons:

- New chat.
- Send.
- Check.
- Alert.
- Source or file text.
- Search or recheck.
- Close.
- Menu.
- More horizontal.
- Panel open or sidebar.
- Info.

## Accessibility Standard

Required:

- Native buttons for actions.
- Visible focus rings.
- Keyboard accessible tabs.
- Tooltip or popover visible on focus.
- Modal focus management.
- `aria-live="polite"` for recheck and toast feedback.
- Color is never the only indicator.
- All semantic states include text labels.
- Contrast meets WCAG AA.

Focus ring:

```css
.focus-ring {
  outline: 2px solid var(--tl-focus);
  outline-offset: 2px;
}
```

## Copy And Label Standard

Use:

- `Review recommended`
- `Medium confidence`
- `Needs verification`
- `Depends on context`
- `Supported by source`
- `Assumption/inference`
- `Useful as a starting point`

Avoid:

- `Verified by AI`
- `Guaranteed accurate`
- `Safe to use`
- `Trust score`
- `Fully verified`
- `100% correct`

## Empty, Loading, Error, And Edge States

Every major component needs a full state cycle.

Required states:

- Empty welcome state.
- Prompt readiness loading.
- Direction generation loading.
- Final answer loading.
- Recheck running.
- Recheck complete.
- Toast feedback.
- Source unavailable fallback.
- Empty composer disabled send.

Error-like prototype states should be calm:

- `Source passage unavailable in prototype.`
- `Recheck is already running.`
- `Add more context before regenerating.`

## Responsive Checklist

- [ ] Sidebar collapses below desktop.
- [ ] Trust Lens becomes overlay drawer on tablet.
- [ ] Trust Lens becomes full-screen drawer on mobile.
- [ ] Composer remains usable on mobile.
- [ ] Direction cards stack on mobile.
- [ ] Tabs do not wrap into unreadable rows.
- [ ] Buttons do not wrap at desktop.
- [ ] Long labels remain readable.
- [ ] No text overlaps.
- [ ] No fixed element hides another fixed element.

## Design QA Checklist

- [ ] Product feels like a serious AI work surface.
- [ ] No AI-purple gradient default.
- [ ] No numeric trust scores.
- [ ] No nested cards.
- [ ] No decorative glassmorphism.
- [ ] No source label implies full verification.
- [ ] Color tokens are consistent.
- [ ] Radius system is consistent.
- [ ] All buttons have readable contrast.
- [ ] All highlights have text labels.
- [ ] All interactive controls have focus states.
- [ ] Trust Lens appears only after final answer.
- [ ] Recheck Output is visible below final answer.
- [ ] Mobile layout is usable.
- [ ] Reduced motion is respected.

## Implementation Notes

Recommended component approach:

- Build owned React components.
- Use Tailwind for layout and tokens.
- Keep styling close to components but centralize tokens.
- Use local reducer state for flow.
- Use structured final answer blocks instead of raw HTML.

Recommended file references:

- Product behavior: `PRODUCT.md`
- Visual standards: `DESIGN.md`
- Technical architecture: `ARCHITECTURE.md`
- Execution roadmap: `12_PHASE_PLAN.md`

## Final Design Rule

The interface should make trust review feel like part of the work, not a separate audit. It should be calm enough for repeated use and clear enough that users understand where AI help ends and human judgment begins.
