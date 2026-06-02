# Trust Lens Backend Migrations

These migrations define the PostgreSQL runway for Phase 4 and later.

The Phase 4 service runs locally with `STORAGE_DRIVER=file` by default, so these SQL files are not applied automatically. A future PostgreSQL repository implementation can use these migrations as the durable production schema.

## Naming

Each migration has an up/down pair:

```text
YYYYMMDD_NNNNNN_description.up.sql
YYYYMMDD_NNNNNN_description.down.sql
```

## Phase 4 Boundary

Included:

- Core Trust Lens sessions.
- Prompt inputs.
- Prompt readiness results.
- Improved prompts.
- Answer direction sets.
- Generated final answers.
- Source passages.
- Recheck jobs.
- Recheck steps.

Not included:

- User accounts.
- Authentication tables.
- Billing.
- Real LLM provider logs.
- Vector indexes.
- Redis state.

