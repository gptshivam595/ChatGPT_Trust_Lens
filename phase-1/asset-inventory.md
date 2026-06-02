# Asset Inventory

This file defines visual and interaction assets needed for the Trust Lens prototype.

The product should feel like a calm AI work surface, not a marketing page.

## Icon Family

Use one icon family:

`lucide-react`

Standard stroke width:

`1.75`

## Required Icons

| Asset | Use |
| --- | --- |
| New chat icon | Sidebar new chat button. |
| Send icon | Composer send button. |
| Menu icon | Mobile sidebar open button. |
| Close icon | Sidebar drawer, Trust Lens panel, modal. |
| Check icon | Selected answer direction, completed recheck step. |
| Alert or warning icon | Prompt readiness risk badge or row. |
| Info icon | Tooltips or explanatory metadata. |
| File text or source icon | Source-backed claims and source passage modal. |
| Search or refresh icon | Recheck Output action. |
| More horizontal icon | Final answer more actions menu. |
| Panel icon | Collapsed Trust Lens rail if needed. |

## Semantic Label Assets

Inline highlights require text labels:

- `Source`
- `Verify`
- `Assumption`
- `Product logic`

Visual treatment:

- Source: green dotted underline.
- Verify: amber dotted underline.
- Assumption: blue dotted underline.
- Product logic: neutral or blue dotted underline.

Every semantic label must include text, not color alone.

## Loading And Progress Assets

Prompt Readiness loading:

- Text: `Running Prompt Readiness Check...`
- Subtle typing indicator or shimmer.
- Reduced motion fallback: static text.

Answer direction loading:

- Text: `Generating answer directions...`
- Subtle loading row.

Final answer loading:

- Text: `Generating final answer using Decision-Ready Output...`
- Dynamic direction name.

Recheck progress:

- Six step rows.
- Pending, running, complete state.
- Checkmark for complete.
- `aria-live` announcement.

## Source Passage Modal Assets

Required visual pieces:

- Modal title.
- Source title.
- Mock URL label.
- Passage text.
- Highlighted supporting sentence.
- Back to output button.

Modal should use:

- Subtle border.
- Soft shadow.
- No heavy dark overlay.
- Claim-specific support copy.

## Sidebar Identity Assets

Required:

- App label: `ChatGPT`.
- Feature badge: `Trust Lens Prototype`.
- Mock chat history rows.
- Footer settings/profile row.

No logo artwork is required for Phase 1.

## Empty State Assets

Capability cards can use icons, but icons are optional.

If used:

- Prompt Readiness: alert or checklist icon.
- Answer Direction Preview: split or layout icon.
- Output Review: file search or shield-like review icon.

Do not use decorative illustration art unless it supports the product UI.

## Responsive Assets

Drawer behavior:

- Sidebar drawer below desktop.
- Trust Lens right drawer on tablet.
- Trust Lens full-screen drawer on mobile.

Required controls:

- Menu open.
- Close drawer.
- Collapsed Trust Lens rail after final answer.

## Visual Asset Rules

Use:

- Light neutral theme.
- Semantic highlight colors.
- Borders before shadows.
- Consistent radius.
- Product-density spacing.

Avoid:

- AI-purple gradients.
- Decorative glassmorphism.
- Floating decorative blobs.
- Marketing hero illustrations.
- Nested cards.
- Numeric trust meters.

