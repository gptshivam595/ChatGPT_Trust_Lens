# Auth, Privacy, And Retention Notes

This document defines future production boundaries. It does not require implementation during the prototype.

## Prototype Mode

Prototype mode:

- No authentication.
- No backend persistence.
- No real telemetry.
- No real source retrieval.
- No user prompt leaves the browser.

## Future Production Auth

If prompts, answers, or review artifacts persist, production must add authentication.

Possible auth models:

- Bearer token.
- Session cookie.
- Existing ChatGPT account/session integration.

Authorization rule:

- A user can access only their own sessions, answers, recheck jobs, and source artifacts.

## Prompt Privacy

Prompt text may include sensitive user data.

Production requirements:

- Do not log raw prompts by default.
- Redact prompt fields from structured logs.
- Define retention period.
- Allow deletion if product requirements demand it.
- Avoid sending prompts to third-party providers without documented consent.

## Answer Artifact Privacy

Generated answers and Trust Lens review artifacts may reveal user intent.

Production requirements:

- Treat generated answer artifacts as user data.
- Restrict access by session owner.
- Avoid exposing answer IDs across users.
- Define retention and deletion policy.

## Source Passage Privacy

Source passages may come from public, private, or licensed sources in future production.

Production requirements:

- Store source provenance.
- Do not imply source endorsement.
- Respect source access permissions.
- Show exact passage support only where allowed.

## Telemetry Boundaries

Safe telemetry:

- Step completion.
- Button clicks.
- Recheck started.
- Recheck completed.
- Error type.
- Latency.
- Non-sensitive status counts.

Sensitive telemetry:

- Raw prompt text.
- Full generated answer.
- Source passage text.
- User-entered context.

Sensitive telemetry should be disabled or redacted unless explicitly required and approved.

## Retention Defaults

Prototype:

- Browser session only.

Future demo backend:

- Short-lived sessions.
- Easy data reset.
- No long-term retention unless needed.

Production:

- Retention policy must be explicit.
- Deletion path must be defined.
- Audit logs should avoid raw content where possible.

## Security Notes

Future backend should include:

- Request validation.
- CORS allowlist.
- Rate limiting.
- Request IDs.
- Structured logs with redaction.
- Secrets via environment variables.
- No provider keys in frontend.

