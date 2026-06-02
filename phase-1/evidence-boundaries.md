# Evidence Boundaries

Trust Lens must be careful about what each evidence label means.

The goal is to support judgment, not automate trust.

## Evidence Label Definitions

### Source

Meaning:

A retrieved mock source passage supports the specific highlighted phrase.

Does not mean:

- The full answer is verified.
- The recommendation is universally true.
- The source is authoritative in the real world.

Required UI behavior:

- Show `Source` label.
- Use green dotted underline.
- Show tooltip explaining support.
- Allow user to view exact source passage.

### Verify

Meaning:

The highlighted phrase is a claim that should be validated before important external use.

Does not mean:

- The claim is false.
- The claim is dangerous.
- The answer should be discarded.

Required UI behavior:

- Show `Verify` label.
- Use amber dotted underline.
- Offer `Add to recheck queue`.
- Explain that validation may require user research, product metrics, or external evidence.

### Assumption

Meaning:

The statement depends on inferred context from the prompt, clarification choices, or selected answer direction.

Does not mean:

- The assumption is wrong.
- The user explicitly said it.

Required UI behavior:

- Show `Assumption` label.
- Use blue dotted underline.
- Offer `Show in Trust Lens`.
- Link to Assumptions tab.

### Product Logic

Meaning:

The statement describes intended product behavior or design logic in the prototype.

Does not mean:

- The behavior has been validated.
- The design will work for all users.

Required UI behavior:

- Show `Product logic` label.
- Use neutral or blue semantic treatment.
- Allow recheck queue or explanatory tooltip.

### Supported

Meaning:

After recheck, mock evidence supports the claim within the limits of the prototype.

Does not mean:

- Guaranteed accurate.
- Fully verified.
- Safe to use without review.

### No Clear Evidence Found

Meaning:

The recheck process did not find enough supporting or conflicting information in mock retrieval.

Required UI behavior:

- Encourage review.
- Avoid alarming copy.

### Conflicting Evidence

Meaning:

Mock retrieval found information that conflicts with the claim.

Required UI behavior:

- Use conflict styling only when this status exists.
- Explain the conflict plainly.
- Do not hide conflicting evidence in collapsed UI.

## Source Modal Boundary Copy

Use this principle in source modal copy:

`This passage supports the highlighted claim. It does not verify the entire answer or guarantee that the recommendation applies in every context.`

## Forbidden Evidence Claims

Never say:

- `Verified by AI`
- `This answer is correct`
- `This source proves the answer`
- `You can safely use this`
- `Fully verified`
- `Trust score`

## Evidence QA Questions

Before implementation is accepted, ask:

- Does every source-backed claim link to a source passage?
- Does the source passage show the exact supporting sentence?
- Does the copy explain that support is claim-specific?
- Are assumptions clearly separated from facts?
- Are needs-verification claims treated as review prompts, not failure states?

