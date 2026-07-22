# api - Agent Guidelines

## Purpose
The backend of the site: Next.js App Router Route Handlers that serve the contact form. There is no database — these endpoints issue anti-abuse tokens, verify the visitor through several independent layers, and deliver a validated message by email via Microsoft Graph. All heavy logic is delegated to `@/lib`; the handlers are thin orchestrators.

## Key Files & Subdirectories
- `contact/route.ts` — `POST /api/contact`. The hardened submission pipeline, in order: content-type check → body-size cap (10 KB) → honeypot (silent accept) → IP rate limit → single-use JS token → CSRF token → ALTCHA proof-of-work verification → Zod validation → per-email rate limit → spam analysis (silent accept) → send mail via `sendContactMail`. Pinned to `runtime = "nodejs"` because `@azure/identity` is Node-only. Builds the HTML mail body inline (`buildContactHtml`).
- `altcha/route.ts` — `GET /api/altcha`. Issues an ALTCHA challenge (`createChallenge`, SHA-256, `maxNumber` 100000, 30-minute expiry) signed with `ALTCHA_HMAC_KEY`.
- `security-tokens/route.ts` — `GET /api/security-tokens`. Returns a fresh `{ csrfToken, jsToken, honeypotName }` triple for the client form to attach to its submission.

## Patterns & Conventions
- **Thin handlers, logic in `@/lib`** — routes call `@/lib/security`, `@/lib/validation`, and `@/lib/graph-mailer`; they do not reimplement crypto, validation, or mail.
- **Structured JSON logging** via a local `log(level, message, data)` helper (`{ ts, level, message, ...data }`) written to `console.log`.
- **Czech error messages to the client, English messages in logs.** Responses use `NextResponse.json({ error }, { status })`.
- **Silent accept for abuse** — honeypot hits and detected spam return `{ success: true }` so bots learn nothing.
- **Cheap checks before expensive ones** — cheap header/token checks run before ALTCHA verification and the Graph mail send.
- **Fail closed on missing secrets** — a missing `ALTCHA_HMAC_KEY` yields a 4xx/5xx rather than skipping verification.

## Dependencies
- `@/lib/security` — `validateCsrfToken`, `validateJsToken`, `generateCsrfToken`, `generateJsToken`, `getRandomHoneypotName`, `checkIpRateLimit`, `checkEmailRateLimit`, `getClientIp`.
- `@/lib/validation` — `contactFormSchema`, `analyzeContent`.
- `@/lib/graph-mailer` — `sendContactMail`.
- `altcha-lib` — `createChallenge`, `verifySolution`.
- `next/server` — `NextRequest`, `NextResponse`.

## Review guidelines

- Check transaction boundaries, idempotency, retry safety, cancellation token propagation, async/thread safety, exception-to-HTTP mapping, nullability, authorization, DTO compatibility, and side effects.
- Watch for incorrect dependency direction and hidden coupling.
- Treat N+1 queries, implicit lazy loading in hot paths, incorrect tracking, and broken query semantics as P1 when they affect changed code.
- Flag backward compatibility risks in APIs, events, DTOs, and serialized payloads (the `security-tokens` response and the `contact` request body are a contract shared with `@/components/ContactForm`).
- Flag code duplication: new code that reimplements logic already available in `@/lib` shared services, utilities, or helpers.
- Flag ad-hoc error handling when the shared `log()` pattern and the `try/catch → NextResponse.json` convention already exist.
- Flag new dependencies/libraries when existing project dependencies already cover the same functionality.
- Ensure the ordering of anti-abuse checks is preserved (cheap → expensive), that no branch leaks internal errors or PII to the client, and that any user-derived value placed into the mail HTML stays sanitized/escaped upstream in `@/lib/validation`.

## Child Work Units
None — these route handlers are leaf files.

## Parent Context
See [@../AGENTS.md](../AGENTS.md) for the App Router context, and [@../../../AGENTS.md](../../../AGENTS.md) for the project root.

## Reusable Code & Shared Patterns
- **All security primitives already exist in `@/lib/security`** — tokens, rate limiting, honeypot names, and proxy-aware client-IP extraction. Never hand-roll HMAC or rate limits in a route.
- **Validation and spam detection live in `@/lib/validation`** (`contactFormSchema` sanitizes and escapes input; `analyzeContent` flags spam). Reuse them; do not re-validate ad hoc.
- **Email delivery is `sendContactMail` in `@/lib/graph-mailer`** — it owns credentials, the token cache, and the dev no-op.
- **Logging** — copy the existing `log()` helper shape for consistency across handlers.

## AI Agent Instructions
- **In-memory state:** rate-limit counters and the used-JS-token set live in module memory — they are per-instance and reset on restart. Do not assume they are shared across processes or deploys; a multi-instance deployment would need shared storage.
- **Runtime:** keep `contact/route.ts` on `runtime = "nodejs"` (Graph/`@azure/identity` cannot run on the edge). New routes touching Node APIs must set the same.
- **Secrets from env only:** `ALTCHA_HMAC_KEY`, `CSRF_SECRET`, `JS_TOKEN_SECRET`, and the `GRAPH_*` / `MAIL_*` variables. Missing values must fail closed, never bypass a check.
- **Testing:** add at least 3 tests (expected, edge, error) per new behavior under `__tests__/`; keep the request/response contract in sync with `@/components/ContactForm`.
- **CRITICAL: Before creating any new file, search this directory and `@/lib` for an existing implementation. Reuse and extend existing code — do not duplicate.**

## Available Skills

| Skill | Description | Invocation |
|-------|-------------|------------|
| `contact-pipeline` | Safely add to or modify the contact submission and anti-abuse pipeline — preserves the check order, the client↔route↔lib contract, and the silent-accept/fail-closed conventions. | `/contact-pipeline` |
