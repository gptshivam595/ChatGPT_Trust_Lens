# Phase 1 Implementation Plan

## Objective

Implement the research, product, copy, mock data, evidence, and asset foundation required before building the Trust Lens frontend or backend.

This phase removes ambiguity for later implementation. A developer should not need to invent product copy, mock content, evidence labels, or the demo narrative.

## Recommended Skills

Primary:

- `$senior-pm`: product scope, acceptance criteria, milestone clarity, and risk framing.
- `$deep-research`: evidence boundaries, source assumptions, and review logic.
- `$content-strategy`: exact copy, language rules, and information hierarchy.

Supporting:

- `$design-taste-frontend`: visual direction and anti-generic design guardrails.
- `$impeccable`: product UI quality bar and design-system context.
- `$architect-reviewer`: alignment between product, architecture, and build phases.

## Source Inputs

- `../PRODUCT.md`
- `../DESIGN.md`
- `../ARCHITECTURE.md`
- `../IMPLEMENTATION_CONTRACTS.md`
- `../screens/README.md`
- `../screens/01-empty-state.md`
- `../screens/03-prompt-readiness-check.md`
- `../screens/06-final-answer.md`
- `../screens/07-trust-lens-panel.md`
- `../screens/13-click-action-matrix.md`

## Workstreams

### Workstream 1: Product Foundation

Purpose:

Confirm what Trust Lens is, who it serves, what it must not claim, and what user jobs it supports.

Tasks:

- Confirm product register is `product`.
- Confirm product promise.
- Confirm primary users.
- Confirm user jobs.
- Confirm non-goals.
- Confirm trust and evidence principles.
- Confirm the hard invariant: Trust Lens appears only after final answer.

Deliverable:

- `product-foundation.md`

Acceptance:

- Product intent is clear.
- User jobs are clear.
- Product non-goals prevent overconfident implementation.

### Workstream 2: Copy Inventory

Purpose:

Provide exact UI copy for every important screen, state, label, action, and toast.

Tasks:

- Extract empty-state copy.
- Extract Prompt Readiness copy.
- Extract Improved Prompt copy.
- Extract Answer Direction copy.
- Extract Final Output action copy.
- Extract Trust Lens panel copy.
- Extract highlight popover copy.
- Extract Recheck copy.
- Extract toast messages.
- Document banned language.

Deliverable:

- `copy-inventory.md`

Acceptance:

- Every major component has exact copy.
- Copy remains cautious and judgment-supportive.
- No numeric trust score or guarantee language appears.

### Workstream 3: Mock Data Inventory

Purpose:

Document the exact mock data required by `src/data/trustLensMockData.ts`.

Tasks:

- List all required exports.
- Document purpose of each export.
- Document completion status of each export.
- Link to `IMPLEMENTATION_CONTRACTS.md` as the exact code source.
- Confirm final answer blocks include all required highlight IDs.
- Confirm post-recheck claim counts match product requirements.

Deliverable:

- `mock-data-inventory.md`

Acceptance:

- No mock data export is missing.
- No placeholder content remains required for Phase 7 or Phase 8.
- Frontend can implement directly from `IMPLEMENTATION_CONTRACTS.md`.

### Workstream 4: Evidence Boundaries

Purpose:

Define how Trust Lens should talk about evidence, source support, verification, assumptions, and product logic.

Tasks:

- Define source-backed.
- Define needs verification.
- Define assumption/inference.
- Define product logic.
- Define conflicting evidence.
- Define no clear evidence found.
- Define source modal boundaries.
- Define forbidden evidence claims.

Deliverable:

- `evidence-boundaries.md`

Acceptance:

- Source labels do not imply full verification.
- Verification language is clear.
- Assumptions are not presented as facts.

### Workstream 5: Asset Inventory

Purpose:

Define all visual and interaction assets needed by the prototype.

Tasks:

- Define icon needs.
- Define semantic label treatments.
- Define loading and progress visuals.
- Define source modal visuals.
- Define sidebar identity treatment.
- Define responsive drawer behavior assets.
- Define visual rules for what not to create.

Deliverable:

- `asset-inventory.md`

Acceptance:

- Asset list supports all screens.
- No decorative or marketing-only assets are required.
- All assets follow `DESIGN.md`.

### Workstream 6: Demo Script

Purpose:

Give presenters and developers a clear walkthrough of the complete Trust Lens story.

Tasks:

- Write the demo setup.
- Write screen-by-screen narration.
- Call out what the viewer should notice.
- Include expected clicks.
- Include success ending.

Deliverable:

- `demo-script.md`

Acceptance:

- Full sample flow is understandable in under 2 minutes.
- Trust Lens timing is emphasized.
- Human judgment principle is clear.

### Workstream 7: Checklists And Handoff

Purpose:

Prove Phase 1 is complete and ready for implementation.

Tasks:

- Create product checklist.
- Create copy checklist.
- Create design checklist.
- Create mock data checklist.
- Create evidence checklist.
- Create handoff checklist.
- Create completion report.

Deliverables:

- `phase-1-checklists.md`
- `phase-1-completion-report.md`

Acceptance:

- Every Phase 1 acceptance criterion is explicitly marked.
- Next-phase teams know where to begin.

## Execution Order

1. Create folder index.
2. Write this Phase 1 implementation plan.
3. Implement product foundation.
4. Implement copy inventory.
5. Implement mock data inventory.
6. Implement evidence boundaries.
7. Implement asset inventory.
8. Implement demo script.
9. Implement checklists.
10. Implement completion report.
11. Run validation.

## Phase 1 Definition Of Done

- Product foundation exists.
- Copy inventory exists.
- Mock data inventory exists.
- Evidence boundary document exists.
- Asset inventory exists.
- Demo script exists.
- Checklists exist.
- Completion report exists.
- The build team can begin Phase 7 without inventing content.
- The backend/API team can begin Phase 2 with clear product boundaries.

