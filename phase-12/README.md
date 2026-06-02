# Phase 12: Deployment To Vercel And Render

This folder contains the Phase 12 implementation plan and completion evidence for deploying Trust Lens.

Phase 12 prepares:

- Frontend-only prototype deployment on Vercel.
- Optional full-stack mock demo with frontend on Vercel and backend on Render.
- Deployment environment variables.
- Smoke-test and rollback guidance.

## Deliverables

| File | Purpose |
| --- | --- |
| `phase-12-plan.md` | Detailed implementation plan for Phase 12. |
| `phase-12-completion-report.md` | Acceptance status, verification, and deployment notes. |

## Implementation Output

| Path | Purpose |
| --- | --- |
| `../vercel.json` | Vercel build/output/rewrite config for the Vite frontend. |
| `../render.yaml` | Render backend service blueprint. |
| `../DEPLOYMENT.md` | Operator runbook for Vercel, Render, env vars, smoke tests, rollback, and known limits. |
| `../scripts/smoke-deployment.ps1` | Local/deployed smoke probe for frontend and backend URLs. |
| `../frontend/.env.example` | Frontend deployment env example. |
| `../.gitignore` | Root ignore rules for deployment artifacts, dependencies, and local env files. |
| `../.dockerignore` | Docker context cleanup for backend image builds. |

## Source Documents

- `../12_PHASE_PLAN.md`
- `../phase-11/phase-11-completion-report.md`
- `../frontend/package.json`
- `../backend/package.json`
- `../backend/README.md`
- `../microservice/frontend-integration.md`

## Phase 12 Status

Implemented as deployment readiness, configuration, runbook, and local verification.
