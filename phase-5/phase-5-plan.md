# Phase 5 Implementation Plan

## Objective

Define and implement the Trust Lens AI orchestration layer while preserving evidence boundaries, cautious labels, and frontend contract compatibility.

Phase 5 creates provider interfaces and deterministic mock adapters for LLM generation, retrieval, claim extraction, claim evaluation, highlight classification, prompt-injection defense, fallback behavior, and telemetry metadata. The backend remains fully runnable without real provider keys.

## Recommended Skills

Primary:

- `$llm-architect`: AI pipeline boundaries, prompt template versioning, RAG separation, fallback design, and future provider routing.
- `$ai-engineer`: deterministic adapter implementation, orchestration mechanics, claim evaluation, and telemetry hooks.
- `$ai-security`: prompt injection defense, retrieved-content isolation, unsafe instruction detection, and cautious failure behavior.

Supporting:

- `$backend-developer`: service integration, TypeScript interfaces, tests, and route compatibility.
- `$data-engineer`: retrieval artifact shape, source passage metadata, and evidence data flow.
- `$architect-reviewer`: verifies the AI pipeline does not create false certainty or frontend coupling.

## Source Inputs

- `../12_PHASE_PLAN.md`
- `../ARCHITECTURE.md`
- `../PRODUCT.md`
- `../microservice/api-overview.md`
- `../microservice/contracts/common.schema.json`
- `../phase-4/phase-4-completion-report.md`

## Scope

In scope:

- AI provider interfaces.
- Prompt template registry with template IDs and versions.
- Deterministic mock provider.
- Deterministic mock retriever.
- Claim extractor.
- Query generator.
- Claim evaluator.
- Highlight classifier.
- Prompt injection scanner.
- Retrieved-content isolation.
- Cautious fallback helpers.
- Internal telemetry event shape.
- Backend service integration.
- Tests for pipeline shape, safety scanning, and cautious labels.

Out of scope:

- Real LLM provider calls.
- Embeddings.
- Vector database.
- Web search.
- Reranking models.
- Real background workers.
- Prompt-template A/B testing.
- Production monitoring dashboards.
- Fine-tuning.

## Provider Interfaces

Phase 5 defines:

- `PromptReadinessEvaluator`
- `ImprovedPromptGenerator`
- `AnswerDirectionPlanner`
- `FinalAnswerGenerator`
- `ClaimExtractor`
- `QueryGenerator`
- `Retriever`
- `ClaimEvaluator`
- `HighlightClassifier`

Each interface must return contract-compatible artifacts or internal typed artifacts that can be transformed into existing API response shapes.

## Prompt Template Registry

Template requirements:

- Every template has an ID.
- Every template has a version.
- Templates live outside route handlers.
- Templates include cautious language constraints.
- Templates tell future model providers not to claim final truth.
- Retrieval context must be treated as untrusted data.

## Safety Model

Prompt injection scanning should detect:

- Role override attempts.
- System prompt extraction.
- Developer mode or jailbreak phrasing.
- Tool-abuse instructions.
- Indirect injection markers inside retrieved content.

Behavior:

- User prompt injection findings do not crash the prototype.
- Readiness response includes a cautious risk signal.
- Retrieved content is sanitized and wrapped as data.
- Source support never becomes full-answer verification.
- Failure states produce `Needs verification` or `No clear evidence found`.

## AI Flow

```text
Prompt readiness
  -> scan user prompt
  -> evaluate ambiguity and missing context
  -> return readiness artifacts

Improved prompt
  -> use template registry
  -> combine original prompt and clarifications
  -> return editable improved prompt

Answer directions
  -> plan three distinct answer shapes
  -> choose recommendation

Final answer
  -> generate structured blocks
  -> classify highlights
  -> extract claims
  -> retrieve source passages
  -> evaluate evidence boundaries
  -> return Trust Lens artifacts

Recheck
  -> generate evidence queries
  -> retrieve passages
  -> evaluate claims
  -> update claim labels and highlights
```

## Telemetry Design

Phase 5 adds internal telemetry event types but does not ship external monitoring.

Track:

- Pipeline step.
- Template ID.
- Template version.
- Adapter name.
- Duration.
- Token estimate.
- Safety finding count.
- Fallback reason.

Do not log by default:

- Full user prompts.
- Full final answers.
- Full retrieved passages.
- Provider secrets.

## Workstreams

### Workstream 1: AI Types And Templates

Deliverables:

- `../backend/src/ai/types.ts`
- `../backend/src/ai/promptTemplates.ts`

### Workstream 2: Safety And Telemetry

Deliverables:

- `../backend/src/ai/safety.ts`
- `../backend/src/ai/telemetry.ts`

### Workstream 3: Mock Provider And Retrieval

Deliverables:

- `../backend/src/ai/mockProvider.ts`
- `../backend/src/ai/mockRetrieval.ts`

### Workstream 4: Orchestration

Deliverable:

- `../backend/src/ai/orchestrator.ts`

### Workstream 5: Backend Integration

Deliverables:

- `../backend/src/services/mockTrustLensService.ts`
- `../backend/src/config.ts`
- `../backend/src/routes/health.ts`
- `../backend/README.md`

### Workstream 6: Tests

Deliverables:

- `../backend/test/aiPipeline.test.ts`
- Updated backend API tests where needed.

## Definition Of Done

- AI interfaces exist.
- Prompt template registry exists and has versioned templates.
- Mock AI provider returns the same API contract shapes as Phase 4.
- Mock retrieval returns exact source passages.
- Prompt injection scanner detects direct and indirect instruction override patterns.
- Retrieved text is treated as untrusted data.
- Claim evaluation returns explainable labels.
- Source-backed claims still include evidence boundaries.
- Failure/fallback behavior remains cautious.
- Frontend API contracts do not change.
- Typecheck, build, tests, and audit pass.

