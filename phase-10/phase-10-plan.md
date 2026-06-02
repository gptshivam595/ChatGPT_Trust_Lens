# Phase 10 Implementation Plan

## Objective

Build the post-final Trust Lens review panel with render gating, responsive drawer behavior, collapsed rail, ARIA tabs, review data tabs, and sticky decision controls.

Phase 10 begins only after the final answer exists. It consumes the final-answer-ready state created in Phase 9 and makes the review layer visible, but it does not implement recheck progress, recheck summary, source passage modal, or full accessibility QA from Phase 11.

## Recommended Skills

Primary:

- `$frontend-design`: Trust Lens panel layout, review density, tab hierarchy, drawer behavior, and decision bar craft.
- `$accessibility`: ARIA tabs, drawer labels, keyboard-reachable decision actions, and visible focus states.
- `$impeccable`: product-register polish, cognitive load, cautious copy, and anti-slop review.

Supporting:

- `$design-systems`: consistent tabs, buttons, badges, panel shells, and compact data rows.
- `$component-recipes`: reusable panel, rail, tabs, tab content, and decision bar patterns.
- `$architect-reviewer`: verifies the Trust Lens render invariant remains intact.

## Source Inputs

- `../screens/07-trust-lens-panel.md`
- `../screens/12-responsive-mobile-tablet.md`
- `../screens/13-click-action-matrix.md`
- `../PRODUCT.md`
- `../DESIGN.md`
- `../ARCHITECTURE.md`
- `../frontend/`

## Scope

In scope:

- `canShowTrustLens = workflowStep === "final_answer_ready"` render gate.
- Trust Lens panel opens automatically after final answer.
- Trust Lens panel closes to a collapsed rail.
- Collapsed rail reopens panel.
- `TrustLensPanel` header, subheader, `Review recommended` badge, close button, and summary.
- `TrustLensTabs` with Quality, Assumptions, Missing Context, Claims to Verify, and Alternatives.
- ARIA tab pattern using `role="tablist"`, `role="tab"`, and `role="tabpanel"`.
- Quality tab rows and Recheck Output action.
- Assumptions tab with impact notes.
- Missing Context tab with Add context actions.
- Claims tab with claim type, evidence status, why verify, and suggested action.
- Alternatives tab with risk-based activation recommendation.
- Sticky decision bar:
  - Use as draft.
  - Add context.
  - Verify first.
  - Ask alternative view.
  - Regenerate.
- Context input surface for Add context.
- Responsive behavior:
  - Inline panel on desktop.
  - Right drawer overlay on tablet.
  - Full-screen drawer on mobile.

Out of scope:

- Recheck progress UI.
- Recheck summary UI.
- Post-recheck claim status updates.
- Source passage modal.
- Modal focus trap.
- Full keyboard QA pass.
- Real backend calls.
- Deployment.

## Product Invariants

- Trust Lens panel must never render before `workflowStep = "final_answer_ready"`.
- Collapsed rail must never render before final answer.
- Tabs and decision bar must never render before final answer.
- No numeric trust score appears.
- Claims are framed as evidence statuses, not absolute truth.
- Source-backed labels remain claim-level and do not imply the full answer is verified.

## Technical Workstream

Tasks:

- Add reducer actions:
  - `OPEN_TRUST_LENS`.
  - `CLOSE_TRUST_LENS`.
  - `SET_TRUST_LENS_TAB`.
  - `USE_AS_DRAFT`.
  - `OPEN_CONTEXT_INPUT`.
  - `SET_CONTEXT_DRAFT`.
  - `SAVE_CONTEXT`.
  - `VERIFY_FIRST`.
  - `MOCK_REGENERATE`.
- Reuse existing `START_RECHECK` and `ASK_ALTERNATIVE_VIEW`.
- Guard all panel actions behind `final_answer_ready`.

Deliverables:

- `../frontend/src/state/appReducer.ts`
- `../frontend/src/App.tsx`

## Data Workstream

Tasks:

- Expand `qualitySignals` to five rows.
- Expand assumptions to five items.
- Expand missing context to six items.
- Expand alternatives to four items plus risk-based recommendation.
- Keep claims at four claim cards.
- Avoid scores and overconfident language.

Deliverables:

- `../frontend/src/data/trustLensMockData.ts`

## UI Workstream

Tasks:

- Build `TrustLensPanel`.
- Build `TrustLensTabs`.
- Build tab content components.
- Build `TrustLensDecisionBar`.
- Build `CollapsedTrustLensRail`.
- Add panel/rail slot to `AppLayout`.
- Keep main chat and panel as separate scroll containers.

Deliverables:

- `../frontend/src/components/TrustLensPanel.tsx`
- `../frontend/src/components/TrustLensTabs.tsx`
- `../frontend/src/components/TrustLensDecisionBar.tsx`
- `../frontend/src/components/CollapsedTrustLensRail.tsx`
- `../frontend/src/components/AppLayout.tsx`

## Accessibility Workstream

Tasks:

- Panel uses `aria-label="Trust Lens review panel"`.
- Close button uses `aria-label="Close Trust Lens"`.
- Tabs use stable `id`, `aria-controls`, and `aria-selected`.
- Tab panels use matching `aria-labelledby`.
- Decision buttons are native buttons with visible focus.
- Context input uses a visible label.
- Drawer close remains reachable on mobile.

Deliverables:

- Accessible panel, tabs, and decision bar components.

## Definition Of Done

- Panel appears automatically after final answer.
- Panel never appears before final answer.
- Close collapses panel into rail.
- Rail reopens panel without resetting active tab.
- Tabs are keyboard reachable and ARIA-labeled.
- Quality, Assumptions, Missing Context, Claims, and Alternatives tabs render useful content.
- Decision bar actions work.
- Add context shows an input and can save a toast.
- Verify first switches to Claims tab.
- Ask alternative view appends a mock assistant response.
- Regenerate shows a mock regenerate toast.
- Desktop panel is inline.
- Tablet/mobile panel uses overlay/full-screen behavior.
- Typecheck, lint, build, format, and audit pass.

