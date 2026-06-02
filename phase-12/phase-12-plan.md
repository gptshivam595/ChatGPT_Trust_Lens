# Phase 12 Implementation Plan

## Objective

Prepare Trust Lens for deployment on Vercel and Render, verify local production builds, and document the exact deployment and smoke-test process.

Phase 12 does not introduce new product UI. It packages the completed frontend prototype and backend mock service so the project can be deployed safely in either frontend-only or full-stack mock mode.

## Recommended Skills

Primary:

- `$deployment-engineer`: deployment configuration, smoke checks, rollback procedure, and release evidence.
- `$devops-engineer`: Render service configuration, environment handling, health checks, and operational runbook.
- `Vercel plugin`: preferred for actual Vercel deployment when an authenticated Vercel deployment capability is available.

Supporting:

- `$build-engineer`: frontend/backend build scripts, package metadata, and reproducible local verification.
- `$backend-developer`: Render backend health, readiness, CORS, and runtime settings.
- `$frontend-design`: deployed UI smoke test across desktop and mobile once a public URL exists.

## Source Inputs

- `../12_PHASE_PLAN.md`
- `../phase-11/phase-11-completion-report.md`
- `../frontend/`
- `../backend/`
- `../render.yaml`
- `../microservice/frontend-integration.md`

## Deployment Modes

### Mode 1: Frontend-Only Prototype

Use this for the first public demo.

- Deploy frontend to Vercel.
- Set `VITE_API_BASE_URL=mock`.
- Do not require Render.
- All product data comes from frontend mock data.

### Mode 2: Full-Stack Mock Demo

Use this when the backend API should be visible in deployment.

- Deploy backend to Render.
- Deploy frontend to Vercel.
- Set frontend `VITE_API_BASE_URL=https://<render-service>.onrender.com/api/v1`.
- Set backend `CORS_ORIGIN=https://<vercel-project>.vercel.app`.
- Backend still uses deterministic mock data.

### Mode 3: Production Runway

Use later, after real persistence, auth, LLM providers, retrieval, privacy policy, and monitoring are approved.

- Deploy backend with database/Redis/provider secrets.
- Add persistent storage.
- Add auth/session policy.
- Add production retention and deletion policy.

## Scope

In scope:

- Vercel config for frontend build and SPA rewrite.
- Frontend env example.
- Render blueprint review and production env guardrails.
- Root ignore rules for deployment artifacts.
- Deployment runbook.
- Smoke-test script.
- Local frontend verification.
- Local backend verification.
- Completion report.

Out of scope:

- Actual Vercel deployment if no authenticated deployment tool/session is available.
- Actual Render deployment if no Render account/API credentials are available.
- Real provider secrets.
- Production database or Redis provisioning.
- Real backend integration in the frontend product flow.

## Product Invariants

- Deployment must keep `VITE_API_BASE_URL=mock` as the safest default.
- Full-stack mode remains mock-backed and must not imply production verification.
- No secrets are committed.
- Trust Lens still appears only after the final answer.
- Recheck and source modal behavior remain frontend-safe if backend is unavailable.

## Technical Workstream

Tasks:

- Add `vercel.json` at repo root.
- Add `frontend/.env.example`.
- Update package engine metadata for frontend/backend.
- Keep Render backend health check at `/health`.
- Add root `.gitignore`.
- Expand `.dockerignore` to avoid sending frontend/build artifacts in backend image context.

Deliverables:

- `../vercel.json`
- `../frontend/.env.example`
- `../frontend/package.json`
- `../backend/package.json`
- `../render.yaml`
- `../.gitignore`
- `../.dockerignore`

## Runbook Workstream

Tasks:

- Document frontend-only Vercel deployment.
- Document full-stack Render + Vercel deployment.
- Document required env variables.
- Document smoke-test steps.
- Document rollback steps.
- Document known deployment limitations.

Deliverables:

- `../DEPLOYMENT.md`
- `../scripts/smoke-deployment.ps1`

## Verification Workstream

Frontend checks:

- `npm.cmd run format`
- `npm.cmd run typecheck`
- `npm.cmd run lint`
- `npm.cmd run build`
- `npm.cmd audit --audit-level=moderate`

Backend checks:

- `npm.cmd run typecheck`
- `npm.cmd run test`
- `npm.cmd run build`
- `npm.cmd audit --audit-level=moderate`

Repo checks:

- `git diff --check`
- Frontend HTTP probe.
- Backend `/health` and `/ready` probes when a backend server is available.

## Definition Of Done

- Vercel config exists and points to `frontend/dist`.
- Vercel SPA rewrite exists.
- Frontend env example documents mock and API modes.
- Render blueprint remains deployable for backend.
- Deployment runbook includes Vercel, Render, smoke tests, rollback, and known limits.
- Smoke script can test local or deployed URLs.
- Frontend build passes.
- Backend build/test passes.
- Dependency audits pass or documented.
- Actual cloud deployment status is documented honestly.
