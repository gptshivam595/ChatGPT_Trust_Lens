# Screen 07: Trust Lens Panel

## Purpose

Review final output quality, assumptions, missing context, claims, and alternatives after the final answer is generated.

## Entry Conditions

- `workflowStep = "final_answer_ready"`.
- `trustLensOpen = true`.

## Layout

```text
Right Panel

Trust Lens                         [Close]
Review output quality before acting...
[Review recommended]

Summary

[Quality] [Assumptions] [Missing Context] [Claims] [Alternatives]

Tab Content

Sticky Decision Bar
Use as draft | Add context | Verify first | Ask alternative view | Regenerate
```

## Panel Header

Title:

`Trust Lens`

Subheader:

`Review output quality before acting on this response.`

Badge:

`Review recommended`

Summary:

`This answer is useful as a product concept, but some claims depend on assumptions, missing context, and validation through user research.`

## Tabs

### Quality

Rows:

| Signal | Status | Note |
| --- | --- | --- |
| Correctness | Medium confidence | General product reasoning is plausible, but market and behavior claims need validation. |
| Completeness | Good starting point | Covers core flow, but needs user segment, metrics, and edge cases for final product proposal. |
| Reasoning quality | Strong but simplified | The flow is logical, but trade-offs should be tested with real users. |
| Usefulness | High for prototype planning | Clear enough to guide a product prototype. |
| Uncertainty | Medium | Confidence varies by section. Source-backed claims are stronger than inferred product claims. |

Action:

`Recheck Output`

### Assumptions

Items:

- The user is designing a product prototype, not a production-ready system.
- The user wants ChatGPT-like UI behavior.
- The output is intended for a product management assignment or case study.
- The user values human judgment and does not want a black-box trust score.
- The final solution should focus on output evaluation, not just hallucination detection.

Each item includes:

- Assumption text.
- Impact label.

### Missing Context

Items:

- Target user segment is not fully defined.
- Primary use case is not locked: research, writing, coding, or career prep.
- Success metrics are not specified.
- Prototype platform is not specified: web, mobile, or browser extension.
- No constraints are given around latency, cost, or source availability.
- No decision on when Trust Lens should appear automatically versus manually.

Each item includes:

- Why it matters.
- `Add context` action.

### Claims To Verify

Cards:

1. `Polished AI outputs can increase over-trust.`
2. `Prompt clarification improves output quality.`
3. `Source-backed highlights improve trust.`
4. `Three answer previews help users choose better responses.`

Each card includes:

- Claim.
- Type.
- Evidence status.
- Why verify.
- Suggested action.

### Alternatives

Items:

- Too much evaluation may slow users down.
- Users may blindly trust Trust Lens labels.
- Source-backed claims may create false confidence.
- Clarifying questions may reduce speed.

Recommendation:

`Use risk-based activation. Show full Trust Lens for high-stakes or low-context prompts, and keep it optional for simple tasks.`

## Decision Bar

Buttons:

- `Use as draft`
- `Add context`
- `Verify first`
- `Ask alternative view`
- `Regenerate`

## Click Actions

| Element | Action | State Change |
| --- | --- | --- |
| Close icon | Collapse panel. | `trustLensOpen = false` |
| Collapsed rail | Reopen panel. | `trustLensOpen = true` |
| Tab | Switch tab. | `activeTrustLensTab = selected tab` |
| Quality Recheck Output | Start recheck. | `recheckStatus = "running"` |
| Missing Context Add context | Show toast. | `toast = "Context added to next revision."` |
| Use as draft | Show toast. | `toast = "Marked as draft. Review before sharing externally."` |
| Add context | Open context input. | `contextInputOpen = true` |
| Verify first | Switch to Claims tab. | `activeTrustLensTab = "claims"` |
| Ask alternative view | Add counterargument assistant message. | Append mock message. |
| Regenerate | Show toast or mock preview. | `toast = "Mock regenerated answer preview prepared."` |

## Accessibility

- Panel has accessible name: `Trust Lens`.
- Close button has `aria-label="Close Trust Lens"`.
- Tabs use ARIA tab pattern.
- Decision bar buttons are keyboard reachable.
- Tab content uses headings.

## Responsive Notes

Tablet:

- Right drawer overlay.

Mobile:

- Full-screen drawer.
- Tabs may scroll horizontally.
- Decision bar may wrap to two rows.

## Exit Conditions

User can:

- Close panel.
- Start recheck.
- Open source modal from final output.
- Continue reviewing tabs.

