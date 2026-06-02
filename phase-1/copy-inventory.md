# Copy Inventory

This file defines the product copy required for the Trust Lens prototype.

All copy must remain cautious, specific, and judgment-supportive.

## Banned Copy

Do not use:

- `Verified by AI`
- `Guaranteed accurate`
- `Safe to use`
- `Trust score`
- `Fully verified`
- `100% correct`
- `You can safely use this`

## Preferred Labels

Use:

- `Review recommended`
- `Medium confidence`
- `Needs verification`
- `Depends on context`
- `Supported by source`
- `Assumption/inference`
- `Useful as a starting point`
- `Product logic`

## Empty State

Title:

`Improve and evaluate AI outputs with Trust Lens`

Subtitle:

`Trust Lens helps you refine prompts, compare answer directions, and review assumptions, uncertainty, missing context, and claims before acting on an AI response.`

Capability 1:

- Title: `Prompt Readiness`
- Description: `Detects missing context and answer-quality risk before generation.`

Capability 2:

- Title: `Answer Direction Preview`
- Description: `Shows possible response directions before creating the final answer.`

Capability 3:

- Title: `Output Review`
- Description: `Surfaces assumptions, missing context, uncertainty, and claims to verify.`

Button:

`Use sample prompt`

Sample prompt:

`Help me prepare a product solution for improving trust in AI-generated outputs.`

## Composer

Placeholder:

`Ask anything, or paste a task you want help evaluating...`

Send button accessible label:

`Send message`

## Prompt Readiness Check

Title:

`Prompt Readiness Check`

Badge:

`Medium answer-quality risk`

Explanation:

`This prompt may produce a useful answer, but the goal, audience, required depth, and verification needs are not fully clear.`

Intro:

`Answer 3 quick questions to improve the prompt.`

Risk chips:

- `Missing context`
- `Ambiguous goal`
- `High-stakes intent possible`
- `Needs evaluation support`

Rows:

- `Missing context: Medium`
- `Ambiguity: Medium`
- `High-stakes intent: Medium`
- `Need for factual verification: Medium`
- `Answer-quality risk: Medium to High`

Actions:

- `Generate improved prompt`
- `Skip and continue`
- `Edit original prompt`

## Clarifying Questions

Question 1:

`What is this output mainly for?`

Options:

- `Personal understanding`
- `College/project submission`
- `Work presentation`
- `Product case study`
- `Decision-making`

Question 2:

`What level of depth do you need?`

Options:

- `Quick summary`
- `Structured explanation`
- `Detailed product thinking`
- `Decision-ready output`

Question 3:

`How reliable should the final answer be?`

Options:

- `Good enough draft`
- `Needs careful review`
- `Should include assumptions`
- `Should flag claims to verify`

## Improved Prompt Preview

Title:

`Improved Prompt Preview`

Description:

`Based on your clarification, ChatGPT can use a more specific prompt to generate a stronger answer.`

Labels:

- `Original prompt`
- `Improved prompt`

Actions:

- `Use improved prompt`
- `Continue with original prompt`
- `Reset improved prompt`

Improved prompt:

`Create a decision-ready product solution for a ChatGPT feature that helps users evaluate AI-generated outputs before acting on them. Focus on trust, correctness, completeness, reasoning quality, uncertainty, missing context, assumptions, and claim verification. The answer should support human judgment rather than replacing it. Include product flow, key UI components, user controls, and risks.`

## Answer Direction Preview

Loading:

`Generating answer directions...`

Title:

`Choose an answer direction`

Subtitle:

`Before generating the final response, choose the format that best matches your intent.`

Card 1:

- Title: `Quick Summary`
- Badge: `Fastest`
- Headline: `Best for a short overview`
- Description: `A concise answer that summarizes the solution in simple points. Useful when you need a quick direction, but it may not deeply cover trade-offs or implementation details.`
- CTA: `Choose summary`

Card 2:

- Title: `Detailed Analysis`
- Badge: `Balanced`
- Headline: `Best for understanding the full idea`
- Description: `A more complete explanation that covers the product flow, user value, risks, and reasoning behind the solution.`
- CTA: `Choose analysis`

Card 3:

- Title: `Decision-Ready Output`
- Badge: `Recommended`
- Headline: `Best match for your intent`
- Description: `A structured product-ready response with feature flow, UI behavior, evaluation logic, user controls, and trust-related edge cases.`
- CTA: `Choose decision-ready`

Final answer loading:

`Generating final answer using Decision-Ready Output...`

## Final Output

Title:

`Trust Lens: A Review Layer for Better AI Output Evaluation`

Visible action:

`Recheck Output`

More actions:

- `Recheck with Trust Lens`
- `Copy draft`
- `Ask for alternative view`

## Inline Highlight Popovers

Source title:

`Source-backed claim`

Source body:

`This claim is supported by a retrieved source.`

Source metadata:

`Source: Mock research note, 2026`

Source action:

`View source passage`

Verify title:

`Needs verification`

Verify body:

`This claim may require external validation before using it in important work.`

Verify action:

`Add to recheck queue`

Assumption title:

`Assumption`

Assumption body:

`This statement depends on an assumption inferred from the prompt or selected answer direction.`

Assumption action:

`Show in Trust Lens`

## Trust Lens Panel

Title:

`Trust Lens`

Subheader:

`Review output quality before acting on this response.`

Badge:

`Review recommended`

Summary:

`This answer is useful as a product concept, but some claims depend on assumptions, missing context, and validation through user research.`

Tabs:

- `Quality`
- `Assumptions`
- `Missing Context`
- `Claims to Verify`
- `Alternatives`

Decision actions:

- `Use as draft`
- `Add context`
- `Verify first`
- `Ask alternative view`
- `Regenerate`

## Recheck

Button:

`Recheck Output`

Progress title:

`Rechecking output...`

Steps:

- `Claim Extraction`
- `Query Generation`
- `Information Retrieval`
- `Cross-Referencing`
- `Evaluation`
- `Visual Highlighting`

Complete:

`Recheck complete`

Summary title:

`Recheck Summary`

Summary body:

`Trust Lens reviewed 4 claims in this answer. Most of the product logic is plausible, but several claims should be validated through user research before being used in a final deck.`

Summary rows:

- `Supported: 1`
- `Needs verification: 2`
- `Assumption/inference: 1`
- `Conflicting evidence: 0`

Summary actions:

- `Open Claims`
- `View highlighted output`
- `Add missing context`

## Toasts

- `Added to Recheck Output.`
- `Context added to next revision.`
- `Marked as draft. Review before sharing externally.`
- `Mock regenerated answer preview prepared.`
- `Alternative view requested.`
- `Mock chat history is not connected in this prototype.`
- `Settings are not part of this prototype.`
- `Model selection is mocked for this prototype.`
- `Source passage unavailable in prototype.`

