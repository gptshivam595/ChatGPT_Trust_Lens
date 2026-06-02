# Mock Data Inventory

This inventory confirms all mock data required for frontend implementation.

Exact TypeScript values are defined in `../IMPLEMENTATION_CONTRACTS.md`, Section 1.

## Target File

```text
src/data/trustLensMockData.ts
```

## Required Exports

| Export | Purpose | Status |
| --- | --- | --- |
| `samplePrompt` | Demo prompt loaded by the sample prompt button. | Defined |
| `improvedPromptTemplate` | Editable improved prompt preview. | Defined |
| `emptyStateCopy` | Empty state title, subtitle, capabilities, sample button. | Defined |
| `promptReadinessRisks` | Risk chips in Prompt Readiness Check. | Defined |
| `qualityRiskRows` | Risk rows and levels in Prompt Readiness Check. | Defined |
| `clarificationQuestions` | Three question groups with default selections. | Defined |
| `answerDirections` | Three answer direction preview cards. | Defined |
| `highlightDefinitions` | Six inline highlight definitions and tooltip metadata. | Defined |
| `finalAnswerBlocks` | Structured final answer with highlighted segments. | Defined |
| `trustLensQualityRows` | Quality tab rows. | Defined |
| `assumptions` | Assumptions tab items with impact notes. | Defined |
| `missingContextItems` | Missing Context tab items with why-it-matters text. | Defined |
| `claimsBeforeRecheck` | Claim cards before recheck. | Defined |
| `claimsAfterRecheck` | Claim cards after recheck. | Defined |
| `alternatives` | Alternatives tab counterarguments. | Defined |
| `recheckSteps` | Six progress steps. | Defined |
| `mockSources` | Mock source passage records. | Defined |

## Highlight ID Coverage

The final answer must reference these IDs:

- `h-evaluate-before-acting`
- `h-missing-context-risk`
- `h-more-control`
- `h-quality-review`
- `h-not-blind-trust`
- `h-verify-before-using`

Each ID is defined in `highlightDefinitions`.

## Recheck Result Requirements

Post-recheck counts:

- Claims reviewed: `4`
- Supported: `1`
- Needs verification: `2`
- Assumption/inference: `1`
- Conflicting evidence: `0`

These counts are represented by `claimsAfterRecheck`.

## Mock Source Requirements

Mock sources must:

- Use `mock://` URL labels.
- Show exact supporting sentence.
- Avoid implying a real external source exists.
- Support a specific claim, not the full answer.

Required source IDs:

- `source-ai-output-review`
- `source-human-judgment`

## Implementation Notes

- Do not fetch mock data from the network.
- Do not use raw HTML for final answer content.
- Do not make `finalAnswerBlocks` a single string.
- Keep mock data deterministic so QA and demo walkthroughs are stable.

