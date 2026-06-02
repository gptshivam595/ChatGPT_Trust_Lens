# Phase 8 Implementation Plan

## Objective

Implement the first workflow half of the Trust Lens frontend prototype: prompt submit, Prompt Readiness loading, Prompt Readiness Check, clarification selection, original prompt editing, and Improved Prompt Preview.

This phase extends the Phase 7 shell without introducing the final answer or any Trust Lens review panel UI.

## Recommended Skills

Primary:

- `$frontend-design`: flow UI, readiness card hierarchy, clarification controls, improved prompt preview, and product-quality interactions.
- `$best-practices`: reducer structure, state guards, orthogonal state slices, and maintainable React patterns.
- `$debugger`: timer cleanup, stale transition guards, and reset behavior.

Supporting:

- `$accessibility`: radio-style clarification controls, focus-visible states, disabled actions, and loading announcements.
- `$api-designer`: mock API adapter shape aligned with future backend contracts.
- `$impeccable`: PRODUCT/DESIGN context alignment, restrained product UI, and Trust Lens render invariant.

## Source Inputs

- `../ARCHITECTURE.md`
- `../PRODUCT.md`
- `../DESIGN.md`
- `../12_PHASE_PLAN.md`
- `../IMPLEMENTATION_CONTRACTS.md`
- `../screens/02-prompt-submitted-loading.md`
- `../screens/03-prompt-readiness-check.md`
- `../screens/04-improved-prompt-preview.md`
- `../screens/13-click-action-matrix.md`
- `../microservice/frontend-integration.md`
- `../frontend/`

## Scope

In scope:

- Full frontend state types from implementation contracts.
- Full local mock data inventory needed for future phases.
- Copy inventory for Prompt Readiness and Improved Prompt.
- Mock API adapter shell with default mock mode.
- Reducer guards for submit, sample prompt, readiness complete, improved prompt, skip, and reset.
- Timed transition from prompt submit/readiness loading to readiness ready.
- User prompt message rendering.
- Prompt Readiness loading row.
- Prompt Readiness card with medium risk badge, explanation, risk chips, quality rows, and clarifying questions.
- Default clarification selections.
- Clarification option selection.
- Edit original prompt, save, and cancel behavior.
- Improved Prompt Preview with read-only original prompt, editable improved prompt, reset, use improved, and continue original actions.
- Handoff state for `answer_directions_loading` only.

Out of scope:

- Answer direction cards.
- Final answer loading and final answer rendering.
- Inline highlights.
- Trust Lens panel.
- Collapsed Trust Lens rail.
- Trust Lens tabs.
- Decision bar.
- Recheck Output.
- Source passage modal.
- Real backend API calls.
- Deployment.

## Product Invariants

- Trust Lens panel must not render in Phase 8.
- Collapsed Trust Lens rail must not render in Phase 8.
- Trust Lens tabs and decision bar must not render in Phase 8.
- No numeric score appears.
- Readiness language must support user judgment, not imply certainty.
- Skip remains available so the readiness flow does not feel punitive.

## Technical Workstream

Tasks:

- Add `src/state/appTypes.ts`.
- Replace `src/state/appState.ts` with `src/state/appReducer.ts`.
- Keep state slices orthogonal:
  - `workflowStep`
  - `trustLensOpen`
  - `activeTrustLensTab`
  - `recheckStatus`
  - `modalState`
  - `toast`
- Guard invalid reducer transitions.
- Reset post-final and future review state on new prompt or new chat.

Deliverables:

- `../frontend/src/state/appTypes.ts`
- `../frontend/src/state/appReducer.ts`

## Data And API Workstream

Tasks:

- Add `src/data/trustLensMockData.ts` with prompt, readiness data, clarification questions, directions, final answer artifacts, claims, recheck steps, and sources.
- Update `src/data/trustLensCopy.ts` with copy inventory from implementation contracts.
- Add `src/api/trustLensClient.ts` mock adapter shell:
  - `createTrustLensSession`
  - `runPromptReadiness`
  - `generateImprovedPrompt`
  - future-compatible stub methods for directions/final answer/recheck/source.

Deliverables:

- `../frontend/src/data/trustLensMockData.ts`
- `../frontend/src/data/trustLensCopy.ts`
- `../frontend/src/api/trustLensClient.ts`

## UI Workstream

Tasks:

- Replace Phase 7 handoff message in `ChatArea`.
- Add `LoadingMessage`.
- Add `PromptReadinessCard`.
- Add `ClarifyingQuestions`.
- Add `ImprovedPromptPreview`.
- Use existing shell and composer.
- Disable composer outside initial prompt entry for prototype clarity.

Deliverables:

- `../frontend/src/components/LoadingMessage.tsx`
- `../frontend/src/components/PromptReadinessCard.tsx`
- `../frontend/src/components/ImprovedPromptPreview.tsx`
- `../frontend/src/components/ChatArea.tsx`
- `../frontend/src/components/Composer.tsx`

## Timer Workstream

Tasks:

- On `prompt_submitted`, immediately transition to `prompt_readiness_loading`.
- After about `800ms`, complete readiness only if the current workflow step is still `prompt_readiness_loading`.
- Clear timers on reset or state change.
- Prevent stale timer completions after new chat.

Deliverables:

- `../frontend/src/App.tsx`
- `../frontend/src/state/appReducer.ts`

## Accessibility Workstream

Tasks:

- Loading state uses visible text and `aria-live="polite"`.
- Clarifying questions use `fieldset`, `legend`, and radio inputs.
- Selected chips include both visual and semantic state.
- Edit original prompt textarea has a visible label.
- Improved prompt textarea has a visible label.
- Primary action is disabled when improved prompt is empty.

Deliverables:

- Accessible readiness and improved prompt components.

## Definition Of Done

- User can start from empty state and reach Prompt Readiness Check.
- Prompt readiness loading appears and transitions after roughly `800ms`.
- Clarification defaults are selected.
- User can change clarification selections.
- User can edit and save the original prompt.
- User can cancel original prompt editing.
- User can generate Improved Prompt Preview.
- User can edit the improved prompt.
- `Use improved prompt` disables when improved prompt is empty.
- User can continue with original prompt or improved prompt into `answer_directions_loading`.
- New chat resets the workflow.
- Typecheck passes.
- Lint passes.
- Build passes.
- Format check passes.
- Audit passes.
- No Trust Lens panel, rail, tabs, Recheck, source modal, or decision bar appears in Phase 8.

