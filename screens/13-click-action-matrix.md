# Screen 13: Click Action Matrix

## Purpose

Define every important click action and expected state result across the prototype.

## Global Actions

| Action | Available When | Result |
| --- | --- | --- |
| New chat | Always | Reset to initial state. |
| Chat history item | Always | Show mock toast. |
| Sidebar settings/profile | Always | Show mock toast. |
| Mobile menu | Tablet/mobile | Open sidebar drawer. |
| Sidebar close | Sidebar drawer open | Close sidebar drawer. |
| Model selector | Always | Show mock toast. |

## Empty State Actions

| Action | Result |
| --- | --- |
| Use sample prompt | Fill composer with sample prompt. |
| Send empty composer | No action, button disabled. |
| Send filled composer | Submit prompt and start readiness loading. |

## Prompt Readiness Actions

| Action | Result |
| --- | --- |
| Select clarification chip | Update selected option. |
| Generate improved prompt | Show Improved Prompt Preview. |
| Skip and continue | Go to answer direction loading using original prompt. |
| Edit original prompt | Show or enable original prompt editor. |
| Save original edit | Update editable original prompt. |

## Improved Prompt Actions

| Action | Result |
| --- | --- |
| Edit improved prompt | Update `improvedPrompt`. |
| Use improved prompt | Go to answer direction loading with improved prompt. |
| Continue with original prompt | Go to answer direction loading with original prompt. |
| Reset improved prompt | Restore default improved prompt. |

## Answer Direction Actions

| Action | Result |
| --- | --- |
| Choose summary | Start final answer loading with `summary`. |
| Choose analysis | Start final answer loading with `analysis`. |
| Choose decision-ready | Start final answer loading with `decision_ready`. |

## Final Output Actions

| Action | Result |
| --- | --- |
| Recheck Output | Open Trust Lens if needed and start recheck. |
| More actions | Open menu. |
| Recheck with Trust Lens | Same as Recheck Output. |
| Copy draft | Show toast. |
| Ask for alternative view | Append mock counterargument message. |

## Inline Highlight Actions

| Action | Result |
| --- | --- |
| Hover Source highlight | Open source popover. |
| Focus Source highlight | Open source popover. |
| View source passage | Open Source Passage Modal. |
| Hover Verify highlight | Open verify popover. |
| Add to recheck queue | Show toast. |
| Hover Assumption highlight | Open assumption popover. |
| Show in Trust Lens | Open Trust Lens and Assumptions tab. |
| Escape | Close active popover or modal. |

## Trust Lens Actions

| Action | Result |
| --- | --- |
| Close Trust Lens | Collapse panel to rail. |
| Open Trust Lens rail | Reopen panel. |
| Quality tab | Show quality tab. |
| Assumptions tab | Show assumptions tab. |
| Missing Context tab | Show missing context tab. |
| Claims tab | Show claims tab. |
| Alternatives tab | Show alternatives tab. |
| Quality Recheck Output | Start recheck. |
| Missing Context Add context | Show context toast. |

## Decision Bar Actions

| Action | Result |
| --- | --- |
| Use as draft | Toast: `Marked as draft. Review before sharing externally.` |
| Add context | Open context input. |
| Verify first | Switch to Claims tab. |
| Ask alternative view | Append mock counterargument assistant message. |
| Regenerate | Toast: `Mock regenerated answer preview prepared.` |

## Recheck Actions

| Action | Result |
| --- | --- |
| Start recheck | `recheckStatus = "running"`, progress begins. |
| Click recheck while running | Disabled or toast, no duplicate job. |
| Complete recheck | `recheckStatus = "complete"`, show summary, switch Claims tab. |
| Open Claims from summary | Open Trust Lens Claims tab. |
| Add missing context from summary | Open Missing Context tab. |
| View highlighted output | Scroll to final answer. |

## Source Modal Actions

| Action | Result |
| --- | --- |
| Back to output | Close modal and return focus. |
| X close | Close modal. |
| Backdrop click | Close modal. |
| Escape | Close modal. |

## State Guard Matrix

| Action | Guard |
| --- | --- |
| Open Trust Lens | Only if final answer exists. |
| Start Recheck | Only if final answer exists and recheck is not running. |
| Open source modal | Only from source-backed highlight. |
| Show assumptions from highlight | Only if final answer exists. |
| Select answer direction | Only from answer directions ready state. |
| Final answer ready | Only from final answer loading state. |

