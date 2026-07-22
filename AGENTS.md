# web (cognera-web) - Agent Guidelines

## Purpose
Marketing/company website for Cognera (`cognera.cz`) — a single-page, Czech-language Next.js 16 application built with the App Router and React 19. The site is a static-first landing page (hero, services, process, tech, projects, contact) with one dynamic surface: a heavily hardened contact form that verifies the visitor and delivers mail via Microsoft Graph. It is built as a self-hosted `standalone` Next.js server deployed behind nginx + systemd.

## Key Files & Subdirectories
- `src/` — application source (App Router). Split into child work units below; `src/types/` holds ambient TypeScript declarations (e.g. `altcha.d.ts` typing the `<altcha-widget>` custom element) and has no own AGENTS.md.
- `__tests__/` — Jest + Testing Library unit tests running on jsdom (`graph-mailer`, `securityHeaders`, and several component tests). No own AGENTS.md — add new tests here.
- `deploy/` — production deployment assets: `deploy.sh`, `setup.sh`, `cognera-web.nginx`, `cognera-web.service`, and `README.md`. Ships the `standalone` build behind nginx + systemd. No own AGENTS.md.
- `public/` — static assets: favicons, `og-image.png`, hero images (`images/hero/*.jpg`), `llms.txt`, brand logos.
- `next.config.ts` — `output: "standalone"`, `poweredByHeader: false`, unoptimized images, and per-request security headers from `src/lib/securityHeaders.ts`.
- `tsconfig.json` — strict TypeScript; path alias `@/*` → `src/*`.
- `jest.config.mjs` / `jest.setup.ts` — jsdom test environment, ts-jest, `@/` module mapping, `testMatch` under `__tests__/`.
- `eslint.config.mjs`, `postcss.config.mjs`, `.env.example` — lint, PostCSS/Tailwind, and the documented environment variables.

## Patterns & Conventions
- **App Router, Server Components by default.** `"use client"` is added only where interactivity or animation requires it.
- **Path alias `@/*` → `src/*`** everywhere; do not use long relative import chains.
- **Content-model driven.** All site copy lives as typed data in `src/lib/site-content.ts`; components render from it rather than hardcoding strings.
- **Czech user-facing copy; English (or structured JSON) logs.** Error messages returned to the browser are in Czech.
- **Layered anti-abuse** protects the single dynamic endpoint (`/api/contact`).
- **File size guideline: ≤500 lines** per file; split when approaching it.

## Dependencies
Self-contained single package (`cognera-web`, no workspaces). Core stack: Next.js 16 + React 19, TypeScript (strict), Tailwind CSS v4, GSAP + ScrollTrigger, three.js / `@react-three/fiber` / `@react-three/drei`, `zod` v4, `@azure/identity` (Microsoft Graph mail), `altcha` / `altcha-lib`, `lucide-react`, `clsx` + `tailwind-merge`.

## Review guidelines

### Review process
- Perform a complete pass over all changed files before returning.
- Do not stop after the first finding.
- Continue scanning after finding a P1 and return a consolidated list of all substantiated findings.
- Review changes in the context of request flow, data flow, contracts, and migrations.
- Raise only issues introduced or materially worsened by the PR, even if the evidence spans unchanged files.

### Severity policy for GitHub review
- In GitHub review, treat the following as P1 unless clearly harmless:
  - missing authorization or tenant isolation
  - transaction boundary mistakes or missing rollback safety
  - race conditions, async misuse, deadlocks, or cancellation bugs
  - nullability regressions / possible NullReferenceException on changed paths
  - API / DTO / serialization contract breaks
  - risky or irreversible migrations
  - data loss or corruption risk
  - N+1 queries or lazy loading in hot paths
  - secrets or PII leakage in logs, telemetry, or client payloads
  - broken exception handling that returns success on failure
  - missing tests for changed business logic

### Review style
- Prefer minimal, safe, and auditable remediations.
- Still report the defect even if the safest fix is larger than a small patch.
- Do not ask for large refactors unless they are required to prevent a defect.
- State assumptions explicitly when context is missing.
- Avoid noise: formatting-only diffs, renames without behavioral impact, and style-only comments.

### Output
- Return findings first, ordered by severity.
- Include exact file and line references.
- Explain the concrete failure mode and production impact.
- If no findings are reported, explicitly state which risk areas were checked.

## Child Work Units
- [@./src/app/AGENTS.md](./src/app/AGENTS.md) - App Router: pages, root layout, global design system, and SEO metadata routes.
- [@./src/components/AGENTS.md](./src/components/AGENTS.md) - React section components, GSAP/three.js animation, and the contact form.
- [@./src/lib/AGENTS.md](./src/lib/AGENTS.md) - Shared library: validation, security, mailer, content model, and utilities.

## Parent Context
This is the project root; there is no parent AGENTS.md.

## Reusable Code & Shared Patterns
Before adding new code, check these first:
- **`src/lib/` is the shared hub** — `cn()` class merge (`utils.ts`), the typed content model (`site-content.ts`), security primitives (`security.ts`), input validation + spam analysis (`validation.ts`), Microsoft Graph mailer (`graph-mailer.ts`), the GSAP singleton (`gsap.ts`), and the CSP/security-header builder (`securityHeaders.ts`).
- **Design system** — `src/app/globals.css` defines Tailwind v4 `@theme` tokens (`--font-inter`, `--font-outfit`, `--color-primary`) and shared component classes (`premium-card`, `form-input`, `btn-primary`, `section-kicker`, …). Reuse these instead of hardcoding colors/spacing.
- **Icon system** — `src/components/Icon.tsx` maps string names to `lucide-react` icons and re-exports named icons plus inline brand SVGs.

## AI Agent Instructions
- **Read the nearest AGENTS.md before working in a subdirectory** — `src/app`, `src/app/api`, `src/components`, and `src/lib` each have domain-specific guidance.
- **The contact endpoint needs environment variables** (`ALTCHA_HMAC_KEY`, `CSRF_SECRET`, `JS_TOKEN_SECRET`, `GRAPH_TENANT_ID`, `GRAPH_CLIENT_ID`, `GRAPH_CLIENT_SECRET`, `MAIL_FROM`, `MAIL_TO`). See `.env.example`. In non-production without Graph config the mailer is a safe no-op.
- **Testing:** every new piece of logic needs at least 3 tests (expected, edge, error) under `__tests__/`. Run `npm test` (`jest --runInBand`). After changing logic, update affected tests.
- **Keep files ≤500 lines** and respect the single-responsibility split already in place.
- **CRITICAL: before creating any new file, search this directory and `src/lib` for an existing implementation. Reuse and extend — do not duplicate.**

## Available Skills

| Skill | Description | Invocation |
|-------|-------------|------------|
| `add-section` | Add a content-driven landing-page section — Server Component rendering from the typed content model, wired into the page, nav, and scroll-reveal system. | `/add-section [section-name]` |
| `contact-pipeline` | Safely add to or modify the contact form's submission and anti-abuse pipeline (ContactForm ↔ `/api/contact` ↔ `@/lib` security/validation/mailer). | `/contact-pipeline` |
