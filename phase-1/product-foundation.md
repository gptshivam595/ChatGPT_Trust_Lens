# Product Foundation

## Product Register

`product`

Trust Lens is a product UI embedded in a ChatGPT-style assistant experience. It is not a landing page, brand site, or marketing demo.

## Product Promise

Trust Lens helps users refine prompts, compare answer directions, and evaluate AI-generated outputs before acting on them.

The product supports human judgment. It does not replace judgment, certify truth, or guarantee correctness.

## One-Sentence Product Definition

Trust Lens is a multi-stage review layer that helps users improve prompts, choose the right answer direction, and inspect assumptions, missing context, uncertainty, and claims before using an AI-generated response.

## Primary Users

### Product And Design Students

Need structured answers for assignments, product case studies, presentations, and portfolio work.

Primary value:

- Better prompt framing.
- Clearer product solution structure.
- Review support before submission or presentation.

### Knowledge Workers

Use AI for drafts, briefs, research summaries, and decision support.

Primary value:

- Identify assumptions.
- Spot unsupported claims.
- Decide what needs verification before reuse.

### Product Managers And Builders

Use AI to explore product concepts, workflows, and trade-offs.

Primary value:

- More decision-ready outputs.
- Better visibility into risks and missing context.
- Clear next actions.

### AI-Cautious Users

Want AI speed without blindly trusting outputs.

Primary value:

- Clear evidence labels.
- Cautious language.
- Visible user control.

## User Jobs

- Improve a vague prompt before generation.
- Understand why a prompt may create answer-quality risk.
- Add missing intent through quick clarifying questions.
- Compare possible answer directions before committing to a final response.
- Review the final output for assumptions, missing context, uncertainty, and claims.
- Inspect why a phrase is source-backed, needs verification, or is an assumption.
- Run deeper claim review through Recheck Output.
- Choose what to do next: use as draft, add context, verify first, ask alternative view, or regenerate.

## Product Principles

### 1. Judgment Before Certainty

Trust Lens should make the user more thoughtful, not more blindly confident.

### 2. Progressive Evaluation

Review starts before generation, continues before the final answer, and becomes detailed after the final answer.

### 3. Evidence Has Boundaries

A source can support one claim without verifying the full answer.

### 4. Control Stays With The User

The product should always show next actions and let the user decide how to proceed.

### 5. Friction Should Match Risk

The prototype uses the full review flow for demonstration. A future product should use risk-based activation.

## Non-Goals

- Do not provide a numeric trust score.
- Do not say an answer is verified by AI.
- Do not guarantee accuracy.
- Do not imply the user can safely use an answer without review.
- Do not make Trust Lens the final authority.
- Do not turn every low-risk prompt into a heavy review workflow in future production.

## Hard Product Invariant

Trust Lens must not appear before the final answer exists.

Allowed before final answer:

- Prompt Readiness Check.
- Clarifying questions.
- Improved Prompt Preview.
- Answer Direction Previews.

Not allowed before final answer:

- Trust Lens side panel.
- Trust Lens collapsed rail.
- Trust Lens tabs.
- Trust Lens decision bar.

Allowed after final answer:

- Trust Lens side panel.
- Collapsed rail.
- Inline highlight interactions.
- Source passage modal.
- Recheck Output.
- Recheck Summary.
- Decision bar.

## Prototype Success

The prototype succeeds if:

- The user can complete the full flow with the sample prompt.
- The user understands why Trust Lens opens after final answer only.
- The user can identify at least one assumption and one claim to verify.
- The user can open a source passage from a highlighted phrase.
- The user can run Recheck Output.
- The user understands the answer is useful as a starting point, not guaranteed truth.

