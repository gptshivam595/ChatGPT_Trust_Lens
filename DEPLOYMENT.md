# Trust Lens Deployment Runbook

Trust Lens supports two deployment modes today:

- Frontend-only prototype on Vercel.
- Full-stack mock demo with frontend on Vercel and backend on Render.

The recommended first deployment is frontend-only mock mode.

## Mode 1: Vercel Frontend-Only Prototype

Use this mode for the public clickable demo.

### Vercel Settings

The Vercel project root directory is `frontend`, and the repo includes `frontend/vercel.json` with:

```json
{
  "installCommand": "npm ci",
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

### Environment Variables

Set this in Vercel:

```text
VITE_API_BASE_URL=mock
```

This keeps the deployed frontend independent from Render.

### Local Preflight

```powershell
cd frontend
npm.cmd ci
npm.cmd run format
npm.cmd run typecheck
npm.cmd run lint
npm.cmd run build
npm.cmd audit --audit-level=moderate
```

### Vercel Smoke Test

After deployment:

```powershell
powershell -ExecutionPolicy Bypass -File scripts/smoke-deployment.ps1 -FrontendUrl "https://<vercel-project>.vercel.app"
```

Manual smoke test:

1. Load the deployed URL.
2. Click `Use sample prompt`.
3. Submit the prompt.
4. Complete or skip Prompt Readiness.
5. Choose `Decision-Ready Output`.
6. Confirm the final answer appears.
7. Confirm Trust Lens appears only after the final answer.
8. Open a source passage from a source-backed highlight.
9. Run `Recheck Output`.
10. Confirm Recheck Summary appears and Claims update.

## Mode 2: Render Backend + Vercel Frontend

Use this mode when you want the backend mock API deployed too.

### Render Settings

The repo includes `render.yaml`.

Backend service:

```text
Root directory: backend
Build command: npm ci && npm run build
Start command: npm run start
Health check path: /health
```

Set `CORS_ORIGIN` in Render after the Vercel URL exists:

```text
CORS_ORIGIN=https://<vercel-project>.vercel.app
```

Keep these values for the mock deployment:

```text
NODE_ENV=production
AI_PROVIDER=mock
RETRIEVAL_PROVIDER=mock
STORAGE_DRIVER=file
```

The `file` storage driver works for a demo but is ephemeral on a free web service. Use a database-backed adapter before production data retention matters.

### Backend Local Preflight

```powershell
cd backend
npm.cmd ci
npm.cmd run typecheck
npm.cmd run test
npm.cmd run build
npm.cmd audit --audit-level=moderate
```

### Render Smoke Test

```powershell
powershell -ExecutionPolicy Bypass -File scripts/smoke-deployment.ps1 -BackendUrl "https://<render-service>.onrender.com"
```

Expected:

- `/health` returns `200`.
- `/ready` returns `200`.

### Connect Vercel To Render

Only after Render is healthy, set this in Vercel:

```text
VITE_API_BASE_URL=https://<render-service>.onrender.com/api/v1
```

Redeploy the Vercel frontend after changing the variable.

The frontend product flow calls the backend in API mode for session creation, Prompt Readiness, improved prompt, answer directions, final answer, source passage, and recheck.

The frontend API adapter in `frontend/src/api/trustLensClient.ts` can call the Render backend when `VITE_API_BASE_URL` is set to a URL. Mock mode remains the default and safest public prototype path, so use frontend-only mode unless you specifically want the full-stack mock demo.

### Local Full-Stack Smoke

When Vite uses a fallback port, the backend development CORS defaults allow common local ports from `5173` through `5180`.

```powershell
cd backend
npm.cmd run build
npm.cmd run start

cd ../frontend
$env:VITE_API_BASE_URL="http://127.0.0.1:4000/api/v1"
npm.cmd run dev -- --host 127.0.0.1
```

## Rollback

Vercel:

1. Open the Vercel project deployments.
2. Promote the previous successful deployment.
3. Reset `VITE_API_BASE_URL=mock` if the backend is unhealthy.

Render:

1. Open the Render service events.
2. Roll back to the previous successful deploy.
3. If CORS blocks the frontend, update `CORS_ORIGIN` and redeploy.

## Known Limits

- No secrets are committed.
- The backend uses deterministic mock AI and retrieval providers.
- The deployed backend does not use PostgreSQL or Redis yet.
- Render free services can cold start.
- Frontend-only mode is the safest public prototype path.
- Full-stack API mode is a deployment runway, not a production trust system.
