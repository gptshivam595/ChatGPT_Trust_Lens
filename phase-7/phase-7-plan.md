# Phase 7 Implementation Plan

## Objective

Build the frontend foundation for Trust Lens as a product UI: a Vite React TypeScript app with Tailwind tokens, a persistent ChatGPT-style shell, responsive sidebar behavior, composer interactions, empty state, and mock shell feedback.

This phase creates the interface base for later frontend phases. It does not implement Prompt Readiness, Improved Prompt Preview, Answer Direction Preview, Final Answer, Trust Lens panel, Recheck, inline highlights, or source modal behavior.

## Recommended Skills

Primary:

- `$frontend-design`: product UI structure, component hierarchy, responsive shell, and interface craft.
- `$design-taste-frontend`: anti-generic standards, restraint, density, and visual discipline.
- `$impeccable`: PRODUCT/DESIGN context usage, product-register UI standards, and polish gates.

Supporting:

- `$accessibility`: keyboard behavior, focus states, semantic controls, drawer labels, and disabled control handling.
- `$build-engineer`: Vite, TypeScript, Tailwind, ESLint, package scripts, and local build setup.
- `$component-recipes`: reusable shell, sidebar, top bar, composer, empty state, and toast patterns.

## Source Inputs

- `../PRODUCT.md`
- `../DESIGN.md`
- `../ARCHITECTURE.md`
- `../12_PHASE_PLAN.md`
- `../IMPLEMENTATION_CONTRACTS.md`
- `../screens/00-global-shell.md`
- `../screens/01-empty-state.md`
- `../screens/12-responsive-mobile-tablet.md`

## Scope

In scope:

- `frontend/` Vite React TypeScript app.
- Strict TypeScript configuration.
- Tailwind CSS v3 setup using Trust Lens OKLCH tokens.
- ESLint, Prettier, typecheck, build, preview, and dev scripts.
- App-level reducer for shell state.
- `AppLayout`, `Sidebar`, `TopBar`, `ChatArea`, `EmptyState`, `Composer`, and `Toast`.
- Desktop sidebar.
- Tablet and mobile sidebar drawer.
- Empty composer disabled send state.
- Enter submits, Shift+Enter inserts newline.
- Sample prompt fills composer without auto-submitting.
- New chat reset.
- Mock history, settings, and model selector toasts.
- `100dvh` layout stability.

Out of scope:

- Backend API wiring.
- Full app state machine beyond shell interactions.
- Prompt readiness cards.
- Clarifying questions.
- Improved prompt preview.
- Answer direction cards.
- Final answer generation.
- Trust Lens panel, rail, tabs, decision bar, Recheck, inline highlights, and source modal.
- Authentication.
- Deployment.

## Product Invariants

- Trust Lens panel does not render in Phase 7.
- Collapsed Trust Lens rail does not render in Phase 7.
- Trust Lens tabs do not render in Phase 7.
- Decision bar does not render in Phase 7.
- No numeric trust score appears.
- Copy stays calm, evidence-aware, and user-controlled.

## Technical Workstream

Tasks:

- Create `frontend/package.json`.
- Add Vite, React, TypeScript, Tailwind, lucide-react, ESLint, and Prettier dependencies.
- Add `vite.config.ts`, `tsconfig.json`, `tsconfig.node.json`, `tailwind.config.js`, `postcss.config.js`, and ESLint config.
- Add `index.html`, `src/main.tsx`, `src/App.tsx`, and `src/styles.css`.

Deliverables:

- `../frontend/package.json`
- `../frontend/vite.config.ts`
- `../frontend/tsconfig.json`
- `../frontend/tailwind.config.js`
- `../frontend/src/`

## Design System Workstream

Tasks:

- Encode Trust Lens CSS variables from `DESIGN.md`.
- Map Tailwind tokens from `IMPLEMENTATION_CONTRACTS.md`.
- Add focus ring, radius, elevation, transition, and reduced-motion rules.
- Use a light neutral product theme.
- Use lucide-react as the single icon family with standard stroke width.

Deliverables:

- `../frontend/tailwind.config.js`
- `../frontend/src/styles.css`

## Shell Workstream

Tasks:

- Build persistent layout with a 260px desktop sidebar and flexible main column.
- Add a compact top bar with mobile menu, title, `Trust Lens enabled` label, and model pill.
- Add a dark neutral sidebar with app name, prototype badge, new chat, history, and profile/settings footer.
- Add responsive sidebar drawer with backdrop and Escape close.
- Keep composer sticky at the bottom of the main column.

Deliverables:

- `../frontend/src/components/AppLayout.tsx`
- `../frontend/src/components/Sidebar.tsx`
- `../frontend/src/components/TopBar.tsx`
- `../frontend/src/components/Composer.tsx`

## Empty State Workstream

Tasks:

- Add the initial empty state title and subtitle from `screens/01-empty-state.md`.
- Add three compact capability surfaces.
- Add `Use sample prompt` action that fills composer only.
- Keep the empty state centered without becoming a marketing hero.

Deliverables:

- `../frontend/src/components/ChatArea.tsx`
- `../frontend/src/components/EmptyState.tsx`
- `../frontend/src/data/trustLensCopy.ts`

## Interaction Workstream

Tasks:

- Add reducer actions for sample prompt, composer editing, submit, new chat, drawer open/close, and toast feedback.
- Submit non-empty composer into a local user message and show a Phase 8 handoff toast.
- Show mock toasts for history, settings, and model selector.
- Automatically dismiss toasts.

Deliverables:

- `../frontend/src/App.tsx`
- `../frontend/src/state/appState.ts`
- `../frontend/src/components/Toast.tsx`

## Accessibility Workstream

Tasks:

- Use native buttons and textarea.
- Add accessible labels for icon-only buttons.
- Keep disabled send announced through native disabled state.
- Add visible focus rings.
- Add `aria-live="polite"` for toast feedback.
- Close drawer on Escape.
- Hide drawer from desktop behind responsive CSS.

Deliverables:

- Component accessibility behavior across `../frontend/src/components/`.

## Definition Of Done

- App installs locally with `npm.cmd install`.
- Typecheck passes.
- Lint passes.
- Production build passes.
- App opens locally in a browser.
- Sample prompt fills composer.
- Send is disabled when composer is empty.
- Enter submits and Shift+Enter inserts a newline.
- New chat resets composer and local messages.
- Sidebar is visible on desktop.
- Sidebar becomes a drawer on tablet/mobile.
- Mock history, settings, and model selector toasts work.
- No Trust Lens panel, rail, tabs, or decision bar appears in initial state.
- UI follows `DESIGN.md`: restrained light product theme, no AI-purple gradient, no glassmorphism, no nested cards, no score UI.

