# Phase 11 Implementation Plan

## Objective

Finish the advanced post-final interactions for the Trust Lens prototype: source passage inspection, mock recheck progress, post-recheck summary, claim status updates, and the accessibility/responsive polish needed before deployment.

Phase 11 begins only after Phase 10 has created the final-answer-only Trust Lens panel. It must not change the core product invariant: Trust Lens and all review controls are available only when `workflowStep = "final_answer_ready"`.

## Recommended Skills

Primary:

- `$accessibility-tester`: keyboard path, modal focus, focus return, live region behavior, and reduced-motion checks.
- `$a11y-audit`: WCAG-oriented scan/fix/verify workflow and issue prioritization.
- `$impeccable`: product UI polish, responsive QA, and cautious trust language.

Supporting:

- `$frontend-design`: final interaction craft, compact review surfaces, and responsive visual refinement.
- `$debugger`: reducer guards, recheck timer cleanup, stale action prevention, and edge-case handling.
- `$core-web-vitals`: layout stability and interaction responsiveness sanity checks.

## Source Inputs

- `../screens/08-inline-highlight-popovers.md`
- `../screens/09-source-passage-modal.md`
- `../screens/10-recheck-progress.md`
- `../screens/11-recheck-summary.md`
- `../screens/12-responsive-mobile-tablet.md`
- `../IMPLEMENTATION_CONTRACTS.md`
- `../DESIGN.md`
- `../PRODUCT.md`
- `../ARCHITECTURE.md`
- `../frontend/`

## Scope

In scope:

- Source-backed highlight opens a source passage modal.
- Modal shows source title, mock URL label, passage, highlighted supporting sentence, and fallback copy if the source is unavailable.
- Modal uses native keyboard-reachable controls, Escape close, backdrop close, focus trap, and focus return.
- Recheck Output starts a six-step mock recheck sequence.
- Recheck runs through:
  - Claim Extraction.
  - Query Generation.
  - Information Retrieval.
  - Cross-Referencing.
  - Evaluation.
  - Visual Highlighting.
- Recheck button and menu action cannot start duplicate runs while running.
- Recheck progress uses text statuses and `aria-live="polite"`.
- Completion sets `recheckStatus = "complete"`, `recheckComplete = true`, opens Trust Lens, and switches to Claims.
- Recheck Summary appears below the final answer.
- Summary actions open Claims, scroll/view highlighted output, and open Missing Context.
- Claims tab switches from `claimsBeforeRecheck` to `claimsAfterRecheck`.
- Toasts and existing decision actions remain intact.
- Responsive and accessibility polish for the new surfaces.

Out of scope:

- Real source retrieval.
- Real recheck polling.
- Backend integration.
- Deployment.
- Automated browser screenshot verification if the browser tooling is unavailable.

## Product Invariants

- Trust Lens must never render before final answer exists.
- Recheck cannot run before final answer exists.
- Source passage modal cannot open before final answer exists.
- Source-backed means the passage supports a specific claim, not the whole answer.
- No numeric trust score appears.
- Recheck results remain cautious and review-oriented.
- Copy must not imply that AI has certified or guaranteed correctness.

## Technical Workstream

Tasks:

- Replace the placeholder `SOURCE_PASSAGE_HANDOFF` action with `OPEN_SOURCE_MODAL` and `CLOSE_SOURCE_MODAL`.
- Add `ADVANCE_RECHECK_STEP` and `COMPLETE_RECHECK`.
- Add summary actions for Claims and Missing Context.
- Update `START_RECHECK` so it opens Trust Lens, resets progress to step 0, and guards duplicate runs.
- Add timer effect in `App.tsx` that advances every 300ms to 350ms and completes after the sixth step.
- Clear timer effects automatically when state changes or New Chat resets.
- Render `SourcePassageModal` at the app root when modal state is open.
- Preserve source modal focus return with a trigger element ref.

Deliverables:

- `../frontend/src/state/appReducer.ts`
- `../frontend/src/App.tsx`

## UI Workstream

Tasks:

- Build `SourcePassageModal`.
- Build `RecheckProgress`.
- Build `RecheckSummary`.
- Extend `FinalOutput` to render progress while running and summary after completion.
- Extend `InlineHighlight` to open the modal only for source-backed highlights.
- Extend `TrustLensTabs` to use post-recheck claim statuses.
- Disable visible recheck controls while running.

Deliverables:

- `../frontend/src/components/SourcePassageModal.tsx`
- `../frontend/src/components/RecheckProgress.tsx`
- `../frontend/src/components/RecheckSummary.tsx`
- `../frontend/src/components/FinalOutput.tsx`
- `../frontend/src/components/InlineHighlight.tsx`
- `../frontend/src/components/TrustLensTabs.tsx`
- `../frontend/src/components/MoreActionsMenu.tsx`

## Accessibility Workstream

Tasks:

- Modal uses `role="dialog"` and `aria-modal="true"`.
- Modal title is connected with `aria-labelledby`.
- Modal description/fallback is connected with `aria-describedby`.
- Focus moves into the modal on open.
- Tab and Shift+Tab stay inside the modal.
- Escape closes the modal.
- Closing returns focus to the originating source highlight action.
- Recheck progress uses `aria-live="polite"` and announces `Step X of 6`.
- Progress state is shown with visible text, not color alone.
- Buttons retain visible focus and disabled states.
- Claims tab statuses include text labels.

Deliverables:

- Accessible modal, progress, summary, and tab updates.

## Responsive And Polish Workstream

Tasks:

- Keep modal near full-screen on mobile and centered on larger screens.
- Keep summary buttons wrapping cleanly.
- Keep recheck progress compact below the final answer.
- Avoid layout shift during step changes.
- Respect reduced motion through existing global CSS.
- Ensure new buttons and cards use the existing 8px radius and neutral palette.
- Avoid nested card styling beyond repeated data rows and modal/surface frames.

Deliverables:

- Mobile-friendly source modal, progress, and summary surfaces.

## Definition Of Done

- Source-backed highlight opens the source passage modal.
- Missing source shows fallback copy.
- Modal closes from X, backdrop, Back to output, and Escape.
- Modal traps focus while open and returns focus after close.
- Recheck runs through all six steps.
- Recheck progress uses text status and live announcements.
- Duplicate recheck starts are blocked while running.
- Recheck Summary appears below final answer after completion.
- Summary buttons open Claims, view highlighted output, and open Missing Context.
- Claims tab updates after recheck.
- Trust Lens still never appears before final answer.
- Typecheck, lint, build, format, audit, and whitespace checks pass or documented limitations are captured.
