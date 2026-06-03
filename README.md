# Trust Lens

Trust Lens is a ChatGPT-style prototype that helps users refine prompts, choose an answer direction, and review generated output before acting on it.

It is built as a serious AI work surface rather than a marketing page. The product does not claim to certify truth. It helps users see assumptions, missing context, uncertainty, source-backed passages, and claims that need verification.

## Live Demo

| Surface | URL |
| --- | --- |
| Frontend | https://trust-lens-rouge.vercel.app |
| Backend | https://trust-lens-backend.onrender.com |
| Example source page | https://trust-lens-rouge.vercel.app/source/source-ai-output-review |

The Vercel frontend can run in mock mode or call the Render backend when `VITE_API_BASE_URL` points to the backend API.

## Core Product Idea

Trust Lens adds a review layer around AI-generated answers:

1. The user submits a prompt.
2. The app runs a Prompt Readiness Check.
3. The user can answer clarifying questions.
4. The app creates an Improved Prompt Preview.
5. The user chooses an answer direction.
6. The final answer is generated.
7. Trust Lens opens only after the final answer exists.
8. The final output shows inline highlights.
9. The side panel reviews quality, assumptions, missing context, claims, and alternatives.
10. The user can recheck output, inspect sources, add context, verify first, regenerate, or use the answer as a draft.

The key product invariant is:

```text
Trust Lens must not appear before the final answer exists.
```

## Highlight And Source Behavior

Final answers can include inline highlights:

| Highlight | Meaning | Behavior |
| --- | --- | --- |
| `Source` | A specific sentence is backed by a source passage. | Hover/focus shows the source context. The source link opens a source page in a new browser tab. |
| `Verify` | The sentence needs verification before reuse. | Hover/focus explains why verification is needed and lets the user add it to recheck. |
| `Assumption` | The sentence depends on an inferred or unstated assumption. | Hover/focus explains the assumption and can jump to the Assumptions tab. |
| `Product logic` | The sentence is part of the prototype's product logic. | Hover/focus explains the design logic and can be added to recheck. |

Source pages use the route:

```text
/source/:sourceId
```

Example:

```text
https://trust-lens-rouge.vercel.app/source/source-ai-output-review
```

## Quality Review Dimensions

The Trust Lens Quality tab uses four review dimensions:

| Dimension | Purpose |
| --- | --- |
| Correctness | Rates how correct the output appears based on the prompt, context, and visible claims. |
| Completeness | Rates whether the output covers the important parts of the user's request. |
| Reasoning Quality | Rates whether the output logic is clear, consistent, and reasonable. |
| Uncertainty | Rates how much ambiguity, missing evidence, or verification need remains. |

Each dimension uses a `Low`, `Medium`, or `High` level.

## Tech Stack

| Area | Stack |
| --- | --- |
| Frontend | React 18, TypeScript, Vite, Tailwind CSS, lucide-react |
| Backend | Node.js, TypeScript, Fastify, Vitest |
| Contracts | JSON Schema under `microservice/contracts` |
| Deployment | Vercel for frontend, Render for backend |
| Persistence | Local file store by default, memory store for tests |
| AI mode | Mock or OpenAI provider, with mock retrieval |

## Repository Structure

```text
.
|-- frontend/                 React/Vite Trust Lens UI
|-- backend/                  Fastify API and AI orchestration boundary
|-- microservice/contracts/   JSON Schema API contracts
|-- screens/                  Screen-level product specifications
|-- phase-1..phase-12/        Implementation plans and completion reports
|-- ARCHITECTURE.md           System architecture
|-- DESIGN.md                 Design standard
|-- DEPLOYMENT.md             Deployment runbook
|-- PRODUCT.md                Product standard
|-- IMPLEMENTATION_CONTRACTS.md
|-- render.yaml               Render backend blueprint
```

## Prerequisites

Use Node.js 22 or newer.

```powershell
node --version
npm --version
```

On Windows PowerShell, use `npm.cmd` if script execution policy blocks `npm.ps1`.

## Local Frontend Setup

```powershell
cd frontend
npm.cmd ci
npm.cmd run dev -- --host 127.0.0.1
```

Default local URL:

```text
http://127.0.0.1:5173
```

Useful frontend scripts:

```powershell
npm.cmd run dev
npm.cmd run typecheck
npm.cmd run build
npm.cmd run preview
npm.cmd run lint
npm.cmd run format
```

## Local Backend Setup

```powershell
cd backend
npm.cmd ci
npm.cmd run dev
```

Default local URL:

```text
http://localhost:4000
```

Useful backend scripts:

```powershell
npm.cmd run dev
npm.cmd run typecheck
npm.cmd run test
npm.cmd run build
npm.cmd run start
```

## Local Full-Stack Mode

Start the backend:

```powershell
cd backend
npm.cmd run dev
```

Start the frontend against the backend:

```powershell
cd frontend
$env:VITE_API_BASE_URL="http://127.0.0.1:4000/api/v1"
npm.cmd run dev -- --host 127.0.0.1
```

Mock-only frontend mode:

```powershell
$env:VITE_API_BASE_URL="mock"
```

## Environment Variables

### Frontend

| Variable | Default | Purpose |
| --- | --- | --- |
| `VITE_API_BASE_URL` | `mock` | Use `mock` for frontend-only mode or a backend URL such as `https://trust-lens-backend.onrender.com/api/v1`. |

### Backend

| Variable | Default | Purpose |
| --- | --- | --- |
| `PORT` | `4000` | Backend port. |
| `NODE_ENV` | `development` | Runtime environment. |
| `LOG_LEVEL` | `info` | Fastify logger level. |
| `CORS_ORIGIN` | local frontend origins | Allowed frontend origins. |
| `STORAGE_DRIVER` | `file` | Use `file` or `memory`. |
| `DATA_DIR` | `data` | Directory for local file persistence. |
| `AI_PROVIDER` | `mock` | Use `mock` or `openai`. |
| `RETRIEVAL_PROVIDER` | `mock` | Retrieval provider selector. |
| `DEFAULT_MODEL` | `gpt-4o-mini` in deploy config | Default model for OpenAI mode. |
| `OPENAI_API_KEY` | unset | Required for OpenAI mode. Do not commit this value. |
| `BODY_LIMIT_BYTES` | `1000000` | Maximum JSON body size. |
| `RATE_LIMIT_MAX` | `60` | Per-window request limit. |
| `RATE_LIMIT_WINDOW` | `1 minute` | Rate limit window. |
| `CONTRACTS_DIR` | unset | Optional override for contract schema lookup. |

## API Overview

Health and readiness:

```text
GET /health
GET /ready
GET /metrics
```

Trust Lens routes live under `/api/v1`:

```text
POST /api/v1/trust-lens/sessions
POST /api/v1/trust-lens/readiness
POST /api/v1/trust-lens/improved-prompt
POST /api/v1/trust-lens/directions
POST /api/v1/trust-lens/final-answer
POST /api/v1/trust-lens/recheck
GET  /api/v1/trust-lens/recheck/:jobId
GET  /api/v1/trust-lens/sources/:sourceId
```

Success envelope:

```json
{
  "data": {},
  "meta": {
    "requestId": "req_...",
    "apiVersion": "v1"
  }
}
```

Error envelope:

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "The request body is invalid.",
    "details": []
  },
  "meta": {
    "requestId": "req_...",
    "apiVersion": "v1"
  }
}
```

## Deployment

### Frontend On Vercel

The Vercel project root is `frontend`.

The frontend config lives at:

```text
frontend/vercel.json
```

Production deploy command:

```powershell
vercel.cmd deploy --prod --yes --project trust-lens --no-color
```

### Backend On Render

The Render blueprint lives at:

```text
render.yaml
```

Backend service settings:

```text
Root directory: backend
Build command: npm ci --include=dev && npm run build
Start command: npm run start
Health check path: /health
```

Manual deploy command:

```powershell
render deploys create srv-d8ff0bbbc2fs73elq1qg --confirm
```

Smoke checks:

```powershell
Invoke-WebRequest -UseBasicParsing -Uri "https://trust-lens-rouge.vercel.app"
Invoke-WebRequest -UseBasicParsing -Uri "https://trust-lens-backend.onrender.com/health"
Invoke-WebRequest -UseBasicParsing -Uri "https://trust-lens-backend.onrender.com/ready"
```

## Testing And Verification

Frontend:

```powershell
cd frontend
npm.cmd run typecheck
npm.cmd run build
```

Backend:

```powershell
cd backend
npm.cmd run typecheck
npm.cmd run test
```

Expected backend test result at the time of this README:

```text
Test Files  5 passed
Tests       25 passed
```

## Product Limits

Trust Lens is a prototype and deployment runway, not a production trust system.

Known limits:

- Source-backed labels support specific passages, not the full answer.
- Verification-needed claims still require external validation.
- Render free services can cold start.
- File storage on Render is suitable for demo use only.
- PostgreSQL and Redis runtime adapters are not wired into production yet.
- Authentication, authorization, and production retention controls are not complete.

## Deeper Documentation

| Document | Purpose |
| --- | --- |
| `PRODUCT.md` | Product promise, user jobs, risk model, and acceptance checklist. |
| `ARCHITECTURE.md` | System architecture, state model, UI contracts, and render invariants. |
| `DESIGN.md` | Visual and interaction design standard. |
| `DEPLOYMENT.md` | Vercel and Render deployment runbook. |
| `IMPLEMENTATION_CONTRACTS.md` | Frontend/backend implementation contracts and mock data contracts. |
| `microservice/api-overview.md` | API contract overview. |
| `screens/README.md` | Screen-by-screen product specifications. |
| `phase-*/README.md` | Phase-level planning and completion evidence. |

## Recommended Demo Script

1. Open https://trust-lens-rouge.vercel.app.
2. Click `Use sample prompt`.
3. Submit the prompt.
4. Review Prompt Readiness.
5. Generate the improved prompt.
6. Continue with the improved prompt.
7. Choose `Decision-Ready Output`.
8. Confirm the final answer appears.
9. Confirm Trust Lens opens after the final answer.
10. Hover highlighted final-answer text.
11. Open a source-backed highlight in a new source page tab.
12. Run `Recheck Output`.
13. Review the updated claims and recheck summary.

## Contributing Notes

- Keep Trust Lens hidden until final answer state.
- Avoid certainty language such as `fully verified`, `guaranteed accurate`, or `safe to use`.
- Keep source-backed and verification-needed claims separate.
- Do not commit secrets.
- Prefer focused changes that preserve the existing interaction model.
