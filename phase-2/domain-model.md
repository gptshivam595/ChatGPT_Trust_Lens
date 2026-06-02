# Backend Domain Model

This document defines the future backend domain entities for Trust Lens.

It is a conceptual model for contracts and future implementation. It is not a database schema yet.

## Entity Overview

```text
TrustLensSession
  -> Prompt
  -> PromptReadinessResult
  -> ClarificationAnswer[]
  -> ImprovedPrompt
  -> AnswerDirection[]
  -> GeneratedAnswer
      -> FinalAnswerBlock[]
      -> Highlight[]
      -> Claim[]
      -> SourcePassage[]
      -> TrustLensReview
  -> RecheckJob
      -> RecheckStep[]
      -> Claim[] after review
```

## TrustLensSession

Purpose:

Represents one user flow through the Trust Lens experience.

Fields:

- `sessionId`
- `createdAt`
- `clientMode`
- `locale`
- `timezone`

Owned by:

- Backend in future API mode.
- Frontend local generated ID in mock mode.

Lifecycle:

- Created when user submits first prompt or when the app chooses to initialize a session.
- Can expire based on future retention policy.

## Prompt

Purpose:

Stores the user's original prompt.

Fields:

- `promptId`
- `sessionId`
- `text`
- `source`
- `createdAt`

Notes:

- Prompt text may be sensitive.
- Do not log raw prompt text by default in production.

## PromptReadinessResult

Purpose:

Represents the pre-generation quality risk assessment.

Fields:

- `readinessId`
- `sessionId`
- `riskBadge`
- `explanation`
- `riskChips`
- `qualityRows`
- `clarifyingQuestions`

Frontend use:

- Renders Prompt Readiness Check card.

## ClarificationAnswer

Purpose:

Stores selected clarification choices.

Fields:

- `questionId`
- `optionId`
- `label`

Frontend use:

- Maps question ID to selected option ID.

## ImprovedPrompt

Purpose:

Stores the generated improved prompt.

Fields:

- `improvedPromptId`
- `sessionId`
- `originalPrompt`
- `improvedPrompt`
- `changes`

Frontend use:

- Renders editable Improved Prompt Preview.

Important:

- The frontend may edit the improved prompt after receiving it.
- The selected prompt sent to directions/final-answer may differ from the original backend improved prompt.

## AnswerDirection

Purpose:

Represents one pre-final answer format choice.

Fields:

- `id`
- `title`
- `badge`
- `headline`
- `description`
- `cta`
- `recommended`

Allowed IDs:

- `summary`
- `analysis`
- `decision_ready`

Frontend use:

- Renders the three Answer Direction Preview cards.

## GeneratedAnswer

Purpose:

Represents the final answer and its review artifacts.

Fields:

- `answerId`
- `sessionId`
- `selectedDirectionId`
- `blocks`
- `highlights`
- `trustLens`

Important:

- Final answer content is structured blocks, not HTML.
- Trust Lens review artifacts are returned with final answer response.
- Frontend opens Trust Lens only after this entity exists.

## FinalAnswerBlock

Purpose:

Structured answer display content.

Block types:

- `heading`
- `paragraph`
- `section`
- `list`

Segment types:

- `text`
- `highlight`

Frontend use:

- Renders final answer and inline highlight triggers.

## Highlight

Purpose:

Defines highlighted phrases in the final answer.

Fields:

- `id`
- `kind`
- `label`
- `text`
- `tooltipTitle`
- `tooltipBody`
- `sourceId`

Kinds:

- `source`
- `verify`
- `assumption`
- `product_logic`

## Claim

Purpose:

Represents a claim that may need evidence, testing, or assumption review.

Fields:

- `id`
- `claim`
- `type`
- `evidenceStatus`
- `whyVerify`
- `suggestedAction`

Evidence statuses:

- `Supported`
- `Needs verification`
- `Conflicting evidence`
- `No clear evidence found`
- `Assumption/inference`
- `Plausible, needs testing`
- `Uncertain`

## SourcePassage

Purpose:

Represents a source passage shown in the Source Passage Modal.

Fields:

- `id`
- `title`
- `urlLabel`
- `passage`
- `highlightedSentence`

Important:

- Source passage supports a specific highlighted claim.
- It does not verify the whole answer.

## TrustLensReview

Purpose:

Container for review panel content returned with final answer.

Fields:

- `summary`
- `qualityRows`
- `assumptions`
- `missingContext`
- `claims`
- `alternatives`

Frontend use:

- Renders Trust Lens panel tabs.

## RecheckJob

Purpose:

Represents asynchronous deeper claim review.

Fields:

- `jobId`
- `sessionId`
- `answerId`
- `status`
- `activeStepIndex`
- `steps`
- `summary`
- `claims`
- `highlights`
- `failureReason`

Statuses:

- `queued`
- `running`
- `complete`
- `failed`

Frontend use:

- Renders Recheck Progress.
- Polls until `complete` or `failed`.
- Updates Claims tab after completion.

## RecheckStep

Purpose:

Represents one visible step in the recheck process.

Steps:

1. Claim Extraction
2. Query Generation
3. Information Retrieval
4. Cross-Referencing
5. Evaluation
6. Visual Highlighting

Step statuses:

- `pending`
- `running`
- `complete`
- `failed`

## Domain Invariants

- A final answer belongs to one session.
- A recheck job belongs to one final answer.
- A source passage may be referenced by one or more highlights.
- A source-backed highlight should have a `sourceId`.
- Verify, assumption, and product-logic highlights do not require `sourceId`.
- Trust Lens panel data is available only after final answer response.

