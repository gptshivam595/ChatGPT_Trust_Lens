# Phase 9 Implementation Plan

## Objective

Implement the second half of the main frontend generation flow: answer direction loading, answer direction cards, direction selection, final answer loading, structured final answer rendering, inline highlights, highlight popovers, Recheck Output entry points, and More actions menu.

This phase renders the final answer and prepares post-final state, but it does not build the Trust Lens panel, Trust Lens tabs, decision bar, source modal, or recheck progress UI.

## Recommended Skills

Primary:

- `$frontend-design`: answer direction cards, final output readability, highlight treatment, and product-quality interactions.
- `$accessibility`: keyboard-selectable direction cards, focusable inline highlights, popovers, and semantic answer structure.
- `$component-recipes`: reusable final answer, inline highlight, menu, button, and popover component patterns.

Supporting:

- `$api-designer`: compatibility with answer-directions and final-answer contracts.
- `$debugger`: guards for direction selection, final answer timers, duplicate action prevention, and render gates.
- `$impeccable`: visual polish, anti-slop review, and Trust Lens invariant check.

## Source Inputs

- `../screens/05-answer-direction-previews.md`
- `../screens/06-final-answer.md`
- `../screens/08-inline-highlight-popovers.md`
- `../microservice/contracts/answer-directions.response.schema.json`
- `../microservice/contracts/final-answer.response.schema.json`
- `../DESIGN.md`
- `../IMPLEMENTATION_CONTRACTS.md`
- `../frontend/`

## Scope

In scope:

- Timed transition from `answer_directions_loading` to `answer_directions_ready`.
- `AnswerDirectionPreviewCards` with Quick Summary, Detailed Analysis, and Decision-Ready Output.
- Recommended card treatment.
- Keyboard-selectable direction buttons.
- Direction selection guard and duplicate prevention.
- Timed transition from `final_answer_loading` to `final_answer_ready`.
- Structured final answer rendering from `FinalAnswerBlock[]`.
- Inline highlight rendering from `HighlightDefinition[]`.
- Source, Verify, Assumption, and Product Logic highlight styles.
- Focus and hover popovers.
- Escape closes active popover.
- Visible `Recheck Output` button below final answer.
- More actions menu with Recheck with Trust Lens, Copy draft, and Ask for alternative view.
- Copy draft toast.
- Add to recheck queue toast.
- Ask alternative view mock assistant message.
- Source passage action handoff toast for Phase 11.
- Show in Trust Lens action sets post-final Trust Lens state for Phase 10 handoff.

Out of scope:

- Trust Lens panel.
- Collapsed Trust Lens rail.
- Trust Lens tabs.
- Sticky decision bar.
- Recheck progress.
- Recheck summary.
- Source passage modal.
- Focus trap or modal return-focus behavior.
- Real backend calls.
- Deployment.

## Product Invariants

- Final answer content is rendered only after `workflowStep = "final_answer_ready"`.
- `trustLensOpen` can become `true` only after final answer exists.
- No Trust Lens panel, collapsed rail, tabs, or decision bar are rendered in Phase 9.
- Recheck Output is visible, not hidden only in a menu.
- No final answer content is rendered from raw HTML.
- Inline source labels explain claim-level support only, not full-answer verification.
- No numeric trust score appears.

## Technical Workstream

Tasks:

- Extend `AppAction` with direction and final answer actions.
- Add `COMPLETE_ANSWER_DIRECTIONS`, `SELECT_ANSWER_DIRECTION`, `COMPLETE_FINAL_ANSWER`, `SET_ACTIVE_TOOLTIP`, `CLEAR_ACTIVE_TOOLTIP`, `START_RECHECK`, `COPY_DRAFT`, `ASK_ALTERNATIVE_VIEW`, `SOURCE_PASSAGE_HANDOFF`, and `SHOW_IN_TRUST_LENS`.
- Add guarded transitions:
  - `answer_directions_loading` -> `answer_directions_ready`
  - `answer_directions_ready` -> `final_answer_loading`
  - `final_answer_loading` -> `final_answer_ready`
- Keep timers in `App.tsx` with cleanup.

Deliverables:

- `../frontend/src/state/appReducer.ts`
- `../frontend/src/App.tsx`

## UI Workstream

Tasks:

- Build `AnswerDirectionCards`.
- Build `FinalOutput`.
- Build `InlineHighlight`.
- Build `MoreActionsMenu`.
- Render extra assistant message after Ask alternative view.
- Replace Phase 8 answer-direction handoff with actual cards and final answer flow.

Deliverables:

- `../frontend/src/components/AnswerDirectionCards.tsx`
- `../frontend/src/components/FinalOutput.tsx`
- `../frontend/src/components/InlineHighlight.tsx`
- `../frontend/src/components/MoreActionsMenu.tsx`
- `../frontend/src/components/ChatArea.tsx`

## Accessibility Workstream

Tasks:

- Direction card CTAs are native buttons.
- Recommended state is text, not color only.
- Selected direction includes check icon and selected label during loading.
- Final answer heading uses semantic heading.
- Inline highlights are focusable native buttons.
- Highlight popovers use `aria-expanded` and `aria-controls`.
- Popover actions are reachable by keyboard.
- Escape closes active popover.
- More actions menu uses button/menu semantics and Escape close.

Deliverables:

- Accessible final-answer and highlight interaction components.

## Definition Of Done

- User can choose an answer direction.
- Direction cards stack on mobile and use three columns on desktop.
- Final answer loading uses selected direction title.
- Final answer appears after direction selection.
- `trustLensOpen` is set only after final answer readiness.
- Inline highlights are visible and focusable.
- Highlight popovers show correct labels and actions.
- Recheck Output button is visible below final answer.
- More actions menu works.
- Ask alternative view appends a mock assistant message.
- Final answer uses structured blocks, not raw HTML.
- Typecheck passes.
- Lint passes.
- Build passes.
- Format check passes.
- Audit passes.
- No Trust Lens panel, rail, tabs, or decision bar is rendered in Phase 9.

