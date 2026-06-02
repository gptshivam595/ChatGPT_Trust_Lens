# Demo Script

This script presents the complete Trust Lens prototype flow.

Target length:

Under 2 minutes.

## Demo Setup

Open the app on the initial empty state.

Presenter framing:

`This prototype shows Trust Lens, a ChatGPT-style review layer that helps users improve prompts, choose an answer direction, and evaluate AI output before acting on it. The goal is not to make users blindly trust the AI. The goal is to help them understand what an answer depends on.`

## Step 1: Empty State

Action:

Click `Use sample prompt`.

Narration:

`The user can start without typing. The sample prompt is intentionally broad so Trust Lens can show how it improves answer quality.`

Viewer should notice:

- Empty state explains three capabilities.
- Composer is populated, not auto-submitted.

## Step 2: Submit Prompt

Action:

Click send.

Narration:

`After submission, ChatGPT does not immediately generate a final answer. It first checks whether the prompt is ready.`

Viewer should notice:

- User message appears.
- Loading text says `Running Prompt Readiness Check...`.
- Trust Lens panel is not visible.

## Step 3: Prompt Readiness Check

Action:

Review the card.

Narration:

`Trust Lens identifies medium answer-quality risk because the prompt lacks goal, audience, depth, and verification details. It asks three quick questions instead of forcing the user to rewrite everything manually.`

Viewer should notice:

- Risk chips.
- Quality risk rows.
- Default clarifying choices.
- `Generate improved prompt` primary action.

## Step 4: Improved Prompt Preview

Action:

Click `Generate improved prompt`.

Narration:

`The improved prompt turns a vague request into a decision-ready product task. The user can edit it, accept it, or continue with the original prompt.`

Viewer should notice:

- Original and improved prompts.
- Improved prompt is editable.
- User remains in control.

## Step 5: Answer Direction Preview

Action:

Click `Use improved prompt`.

Narration:

`Before creating the final answer, ChatGPT shows three possible answer directions. This lets the user choose the response shape before spending attention on a long output.`

Viewer should notice:

- Quick Summary.
- Detailed Analysis.
- Decision-Ready Output.
- Recommended option is subtle, not forced.

## Step 6: Final Answer

Action:

Click `Choose decision-ready`.

Narration:

`Now the final answer is generated. Only after the final answer exists does Trust Lens open on the right.`

Viewer should notice:

- Final answer appears.
- Inline highlights appear.
- Trust Lens panel opens automatically after the answer.
- Recheck Output button is visible below the answer.

## Step 7: Inline Highlight

Action:

Hover or focus a source-backed highlight.

Narration:

`Inline highlights explain what kind of review a phrase needs. Green means a mock source supports this specific phrase, not the whole answer.`

Action:

Click `View source passage`.

Viewer should notice:

- Source modal shows exact supporting sentence.
- Source support is claim-specific.

## Step 8: Trust Lens Panel

Action:

Click through Trust Lens tabs.

Narration:

`The side panel organizes review into quality, assumptions, missing context, claims to verify, and alternatives. It avoids a fake trust score and gives the user specific review categories.`

Viewer should notice:

- Quality uses labels, not percentages.
- Assumptions have impact notes.
- Missing context has actions.
- Claims explain why verification matters.
- Alternatives show trade-offs.

## Step 9: Recheck Output

Action:

Click `Recheck Output`.

Narration:

`Recheck simulates deeper claim-level review: extracting claims, generating queries, retrieving mock evidence, cross-referencing, evaluating, and updating highlights.`

Viewer should notice:

- Six visible progress steps.
- Checkmarks as steps complete.
- Trust Lens remains open.

## Step 10: Recheck Summary

Action:

Wait for completion.

Narration:

`The result is not a trust score. It is a claim-level summary: one supported, two needing verification, one assumption or inference, and no conflicting evidence.`

Viewer should notice:

- Recheck Summary below final answer.
- Claims tab updates.
- `Open Claims` and `Add missing context` actions.

## Step 11: Decision Bar

Action:

Click `Verify first`.

Narration:

`Trust Lens ends by keeping the user in control. They can use the answer as a draft, add context, verify first, ask for another view, or regenerate.`

Viewer should notice:

- Decision actions are visible.
- Product supports judgment instead of replacing it.

## Closing Line

`Trust Lens is designed to make AI output more inspectable. It does not ask the user to blindly trust the answer. It helps them see what is supported, what is assumed, what is missing, and what should be checked before use.`

