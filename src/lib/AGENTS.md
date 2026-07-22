# lib - Agent Guidelines

## Purpose
The shared, framework-agnostic core of the app: input validation, request security, email delivery, the typed site content model, the GSAP singleton, and small utilities. It is consumed by both the backend (`@/app/api`) and the frontend (`@/components`, `@/app`, `next.config.ts`). Most modules are pure, dependency-light functions and are the intended home for logic that would otherwise be duplicated across routes or components.

## Key Files & Subdirectories
- `validation.ts` — `contactFormSchema` (Zod v4) with sanitization (`stripHtml`, HTML-entity escaping) piped into length/format rules, the `ContactFormData` type, and `analyzeContent()` spam detection (keyword list EN/CZ, URL count, excessive-uppercase).
- `security.ts` — HMAC-signed CSRF tokens (`generateCsrfToken`/`validateCsrfToken`, 30-min TTL, `timingSafeEqual`), single-use JS tokens (`generateJsToken`/`validateJsToken`, in-memory used-set), honeypot field names (`getRandomHoneypotName`), in-memory rate limiting (`checkIpRateLimit` 3/5min, `checkEmailRateLimit` 1/hr), and proxy-aware `getClientIp()`.
- `graph-mailer.ts` — Microsoft Graph app-only mail (`sendContactMail`) using `ClientSecretCredential` (client-credentials flow, `Mail.Send`). Lazy module-level credential singleton (warm MSAL token cache), dev no-op when unconfigured, `GRAPH_DEBUG` tracing.
- `securityHeaders.ts` — `getSecurityHeaders(isProduction)` and `buildCspHeader()`; the full CSP + hardening header set consumed by `next.config.ts` (HSTS/`upgrade-insecure-requests` only in production).
- `site-content.ts` — the typed content model (~381 lines): interfaces (`ServiceCard`, `ProcessStep`, `ProjectRef`, `ContactChannel`, `TechCategory`, `InternalTool`, …) and the exported data that every section component renders.
- `gsap.ts` — registers `ScrollTrigger` + `useGSAP` once on the client and sets defaults; re-exports `{ gsap, ScrollTrigger, useGSAP }`.
- `utils.ts` — `cn()` (clsx + tailwind-merge).
- `contact-target.ts` — `scrollToContactForm()` and the `CONTACT_FORM_TARGET_ID` / `CONTACT_SECTION_TARGET_ID` constants.

## Patterns & Conventions
- **Pure, testable functions.** `graph-mailer`, `securityHeaders`, and validation logic have unit tests in `__tests__/`; keep new logic here testable in isolation.
- **Env-driven config with safe fallbacks.** Dev secrets and the dev no-op mailer let the app run without real credentials — these fallbacks are insecure by design and must never be relied on in production.
- **Module-level singletons for expensive resources** — the Graph credential and the GSAP plugin registration are initialized once.
- **Constant-time comparison** (`crypto.timingSafeEqual`) for all token verification.
- **Typed content as the single source of truth** — copy lives in `site-content.ts`, not in components.

## Dependencies
- External: `zod` (v4, imported as `zod/v4`), `@azure/identity`, `gsap` / `@gsap/react`, `clsx`, `tailwind-merge`, Node `crypto`.
- Consumed by: `@/app/api/*` (security, validation, graph-mailer), `@/components/*` (site-content, gsap, utils, contact-target), `@/app/*`, and `next.config.ts` (securityHeaders).

## Review guidelines

This directory mixes backend logic (security, validation, mailer, headers) with shared frontend utilities (site-content, gsap, utils, contact-target). Apply the checks relevant to the file under review.

- **Security & correctness (backend):** verify constant-time token comparison, TTL handling, and that env secrets are never logged or returned to clients. Confirm error handling maps failures correctly and never returns success on failure. Treat secret/PII leakage in logs or payloads as P1.
- **Sanitization:** any change to `validation.ts` must preserve HTML stripping/escaping before values reach the mail body or the DOM.
- **Duplication:** flag new code that reimplements logic already available here (token generation, rate limiting, `cn()`, `scrollToContactForm`, the content model) — these are the shared primitives the rest of the app depends on.
- **Ad-hoc error handling / logging:** prefer the existing structured `log()` shape and the established return conventions.
- **New dependencies:** flag new libraries when an existing dependency already covers the need.
- **Content model:** additions to `site-content.ts` should extend the existing typed interfaces, not introduce untyped shapes; watch the ~500-line file-size guideline (currently ~381 lines).
- **Contract stability:** `ContactFormData` and the exported content types are shared contracts with `@/components` and `@/app/api` — flag breaking changes.

## Child Work Units
None — these are leaf modules.

## Parent Context
See [@../../AGENTS.md](../../AGENTS.md) for the project root.

## Reusable Code & Shared Patterns
This directory **is** the shared-code hub. Before adding logic elsewhere, reuse:
- `cn()` for class merging (`utils.ts`).
- `contactFormSchema` / `analyzeContent` for any input handling (`validation.ts`).
- The token, rate-limit, honeypot, and client-IP helpers (`security.ts`).
- `sendContactMail` for outbound email (`graph-mailer.ts`).
- `getSecurityHeaders` / `buildCspHeader` for HTTP hardening (`securityHeaders.ts`).
- The typed content model in `site-content.ts` for any site copy.
- The GSAP singleton in `gsap.ts` (never register plugins elsewhere).
- `scrollToContactForm()` + target-id constants (`contact-target.ts`).

## AI Agent Instructions
- **In-memory state** (rate-limit maps, used-JS-token set) is per-instance and resets on restart. Do not assume shared/persistent state; document the limitation if it matters for a change, and prefer shared storage before scaling to multiple instances.
- **Secrets** come from environment variables only (`CSRF_SECRET`, `JS_TOKEN_SECRET`, `ALTCHA_HMAC_KEY`, `GRAPH_*`, `MAIL_*`). The hardcoded dev fallbacks must never be used in production paths.
- **`gsap.ts` is client-only** (guards on `typeof window`); keep it out of server-side code paths.
- **Testing:** add at least 3 tests (expected, edge, error) per new function under `__tests__/`; several modules here are already covered — keep them green after changes.
- **CRITICAL: Before creating any new file, search this directory for an existing implementation. Reuse and extend existing code — do not duplicate.**
