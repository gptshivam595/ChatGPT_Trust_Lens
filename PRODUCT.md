# Trust Lens Product Standard

## Product Register

`product`

Trust Lens is an interactive product UI, not a marketing site. The interface should feel like a serious AI work surface: calm, clear, review-oriented, and efficient under repeated use.

## Product Summary

Trust Lens is a ChatGPT-style review layer that helps users refine prompts, choose an answer direction, and evaluate AI-generated outputs before acting on them.

The product does not certify truth. It helps users understand what an answer depends on, what is missing, what is assumed, and what should be checked before reuse.

## Core Promise

Trust Lens supports human judgment by making prompt quality, answer direction, assumptions, uncertainty, missing context, and claim-level verification visible at the right moment.

## Primary Users

### Product And Design Students

Need structured outputs for assignments, case studies, presentations, and portfolio projects. They benefit from prompt improvement, answer direction choices, and review guidance.

### Knowledge Workers

Use AI for drafts, briefs, research summaries, and decision support. They need help spotting assumptions, missing context, and claims that should not be reused blindly.

### Product Managers And Builders

Use AI to shape product concepts, workflows, feature proposals, and risk analysis. They need structured reasoning and clear evaluation boundaries.

### AI-Cautious Users

Want the speed of AI without surrendering judgment. They need clear labels, visible caveats, and control over next actions.

## User Jobs

- Improve a vague prompt before generation.
- Understand why a prompt may produce weak or risky output.
- Answer a few clarifying questions without feeling blocked.
- Compare possible answer directions before committing to a long response.
- Review a final answer for assumptions, missing context, uncertainty, and claims.
- Inspect why a phrase is source-backed, needs verification, or is an assumption.
- Recheck an output when the answer may be reused in important work.
- Decide whether to use as draft, add context, verify first, ask for an alternative view, or regenerate.

## Product Non-Goals

- Do not replace human judgment.
- Do not guarantee correctness.
- Do not use numeric trust scores.
- Do not say "verified by AI."
- Do not imply users can safely use an answer without review.
- Do not force heavy review flows for every low-risk task in a future product.
- Do not turn source-backed labels into universal truth claims.

## Experience Principles

### Judgment Before Certainty

The product should help users think better, not tell them what to trust. Use labels such as `Review recommended`, `Needs verification`, `Medium confidence`, `Depends on context`, and `Assumption/inference`.

### Progressive Evaluation

Trust support starts before generation with Prompt Readiness, continues before final generation with Answer Direction Preview, and appears after generation through the Trust Lens review panel.

### User Control Stays Visible

The user should always have a next decision available: use as draft, add context, verify first, ask alternative view, or regenerate.

### Evidence Has Boundaries

Source-backed means a mock source passage supports a specific claim. It does not mean the entire answer is verified.

### Review Should Feel Helpful, Not Punitive

Avoid alarmist language unless a claim is explicitly conflicting or high-risk. The default tone is careful, useful, and calm.

## Core User Journey

1. User enters or selects a sample prompt.
2. ChatGPT runs a Prompt Readiness Check.
3. The user answers quick clarifying questions.
4. ChatGPT generates an Improved Prompt Preview.
5. User chooses improved prompt or original prompt.
6. ChatGPT presents three answer direction previews.
7. User selects one direction.
8. ChatGPT generates the final answer.
9. Trust Lens opens automatically after the final answer.
10. The final answer includes inline highlighted claims.
11. User inspects highlights, source passages, assumptions, and verification needs.
12. User runs Recheck Output.
13. Recheck updates claim labels and shows a summary.
14. User chooses a final decision action.

## Required Product Invariant

Trust Lens must not appear before the final answer exists.

Allowed after final answer:

- Trust Lens panel.
- Collapsed Trust Lens rail.
- Trust Lens tabs.
- Decision bar.
- Recheck summary.

Not allowed before final answer:

- Right-side Trust Lens panel.
- Collapsed Trust Lens rail.
- Trust Lens tabs.
- Trust Lens decision bar.

## Risk Model

The prototype uses a fixed medium-risk sample flow. A future product can use risk-based activation.

| Signal | Product Meaning | Prototype Behavior |
| --- | --- | --- |
| Missing context | The prompt lacks details needed for a strong answer. | Show readiness warning and clarification questions. |
| Ambiguous goal | The answer could go in multiple directions. | Show answer direction previews. |
| High-stakes possible | Output may influence decisions or external work. | Use careful review language. |
| Verification needed | Claims may need external validation. | Show inline highlights and Claims to Verify. |
| Assumptions present | The answer inferred unstated context. | Show assumption labels and Assumptions tab. |

## Trust Labels

Use these labels:

- `Source`
- `Verify`
- `Assumption`
- `Product logic`
- `Supported`
- `Needs verification`
- `Assumption/inference`
- `No clear evidence found`
- `Conflicting evidence`
- `Medium confidence`
- `Depends on context`
- `Useful as a starting point`
- `Review recommended`

Avoid these labels:

- `100% correct`
- `Guaranteed accurate`
- `Verified by AI`
- `Safe to use`
- `Trust score`
- `Fully verified`

## Product Copy Voice

Voice:

- Clear
- Calm
- Specific
- Non-alarmist
- User-controlled
- Evidence-aware

Avoid:

- Salesy language
- Fear-based warnings
- Overconfident claims
- Dense legalistic language
- Generic AI assistant filler

Good examples:

- `This answer is useful as a starting point, but several claims should be reviewed before external use.`
- `This was inferred from your clarification choices.`
- `This claim should be validated through user research or product metrics.`
- `A source supports this passage, but the broader recommendation may still depend on context.`

## Feature Requirements

### Prompt Readiness Check

Purpose:

Detect missing context and answer-quality risk before generation.

Must include:

- Medium answer-quality risk badge.
- Short explanation.
- Risk chips.
- Quality risk rows.
- Three clarifying questions.
- Primary action to generate improved prompt.
- Secondary action to skip.
- Ability to edit original prompt.

### Improved Prompt Preview

Purpose:

Show how clarification improves answer quality before generation.

Must include:

- Original prompt.
- Editable improved prompt.
- Use improved prompt action.
- Continue with original prompt action.

### Answer Direction Preview

Purpose:

Let users choose the response shape before final generation.

Must include:

- Quick Summary.
- Detailed Analysis.
- Decision-Ready Output.
- Recommended visual treatment on Decision-Ready Output.
- Clear selected state.

### Final Output

Purpose:

Show the generated answer with reviewable claims.

Must include:

- Structured answer.
- Inline highlights.
- Visible Recheck Output button.
- Three-dot menu with Recheck with Trust Lens.

### Trust Lens Panel

Purpose:

Review output quality after final generation.

Must include:

- Header and review recommended badge.
- Summary card.
- Tabs:
  - Quality
  - Assumptions
  - Missing Context
  - Claims to Verify
  - Alternatives
- Sticky decision bar.
- Close and reopen behavior.

### Recheck Output

Purpose:

Simulate deeper claim review.

Must include:

- Claim Extraction.
- Query Generation.
- Information Retrieval.
- Cross-Referencing.
- Evaluation.
- Visual Highlighting.
- Completion state.
- Recheck summary.
- Updated claim labels.

## Success Metrics

Prototype success:

- User completes the full sample flow without typing.
- User understands why Trust Lens opens after final answer only.
- User can identify at least one assumption and one claim to verify.
- User can open a source passage from an inline highlight.
- User can run Recheck Output and understand the result summary.
- User sees final decision actions and understands they remain in control.

Future product success:

- Improved prompt acceptance rate.
- Clarification completion rate.
- Direction preview selection rate.
- Recheck Output usage rate.
- Source passage inspection rate.
- Claims tab engagement.
- User-reported trust calibration.
- Reduced blind reuse of unsupported claims.

## Product Risks

| Risk | Impact | Product Response |
| --- | --- | --- |
| Users over-trust source labels | High | Use exact source passages and evidence-boundary copy. |
| Flow feels too slow | Medium | Future product should use risk-based activation. |
| Too many labels create cognitive load | Medium | Keep labels short and consistent. |
| Users skip clarification | Medium | Make skip available but explain value of improved prompt. |
| Trust Lens feels like final authority | High | Avoid scores, guarantees, and verification claims. |

## Acceptance Checklist

- [ ] Product register is `product`.
- [ ] Trust Lens never appears before final answer.
- [ ] Copy supports judgment, not certainty.
- [ ] Recheck Output is visible, not hidden only in a menu.
- [ ] Source-backed labels show exact passage support.
- [ ] User can close and reopen Trust Lens.
- [ ] User can choose decision actions after final output.
- [ ] Mobile flow remains usable.
- [ ] No numeric trust score appears anywhere.
