---
name: contact-pipeline
description: Safely add to or modify the contact form's submission and anti-abuse pipeline — the three-way contract between the ContactForm client component, the /api/contact route handler, and the @/lib security/validation/mailer modules. Use when touching contact submission, spam/bot defenses, security tokens, ALTCHA, rate limiting, or Microsoft Graph email delivery.
---

# Work on the contact pipeline

The contact form is the site's only dynamic surface and is protected by a layered anti-abuse pipeline. Three parts form one contract and must stay in sync:

- **Client** — `src/components/ContactForm.tsx` (`"use client"`): local validation, fetches security tokens, runs the ALTCHA widget, assembles the payload, POSTs to `/api/contact`.
- **Route** — `src/app/api/contact/route.ts` (`runtime = "nodejs"`): orchestrates the checks in order and sends mail. Sibling routes: `api/security-tokens/route.ts` (issues the token triple), `api/altcha/route.ts` (issues the ALTCHA challenge).
- **Lib** — `src/lib/security.ts` (tokens, rate limits, honeypot, client IP), `src/lib/validation.ts` (`contactFormSchema`, `analyzeContent`), `src/lib/graph-mailer.ts` (`sendContactMail`).

## Before you write anything

1. **Search before creating** — `Grep`/`Glob` for the helper you need in `src/lib/security.ts`, `src/lib/validation.ts`, and `src/lib/graph-mailer.ts` before adding logic. The primitives (HMAC tokens, rate limits, honeypot, IP extraction, sanitization, spam analysis, mailer) already exist.
2. **Reuse shared code** — call the `@/lib` functions from the route; never re-implement crypto, validation, rate limiting, or mail inside a handler.
3. **Follow existing patterns** — keep the numbered check order, the `NextResponse.json({ error }, { status })` shape, and the structured `log(level, message, data)` JSON logging already in the route.
4. **Common error handling** — wrap the handler body in `try/catch`; on unexpected failure return a generic Czech 500 and log the real error server-side. Never leak internal errors, stack traces, or secrets to the client.
5. **No speculative abstractions** — only factor out a new `@/lib` helper when a second real caller exists.

## The pipeline order (in `contact/route.ts`) — preserve it
Cheap/local checks run before expensive ones so bots are rejected before any crypto or network work:

1. Content-Type is `application/json`.
2. Body size ≤ 10 KB (`content-length`).
3. Honeypot filled → **silent accept** (`{ success: true }`).
4. IP rate limit (`checkIpRateLimit`, 3 / 5 min).
5. Single-use JS token (`validateJsToken`).
6. CSRF token (`validateCsrfToken`).
7. ALTCHA proof-of-work (`verifySolution` with `ALTCHA_HMAC_KEY`).
8. Zod validation (`contactFormSchema.safeParse`).
9. Per-email rate limit (`checkEmailRateLimit`, 1 / hour).
10. Spam analysis (`analyzeContent`) → **silent accept** if flagged.
11. Send via `sendContactMail`.

Conventions to keep:
- **Silent-accept for abuse** (honeypot, spam): return `{ success: true }` so bots learn nothing — do not return an error.
- **Fail closed on missing secrets** (e.g. absent `ALTCHA_HMAC_KEY` → 4xx/5xx), never skip the check.
- **Czech error messages** to the client; English/JSON in logs.
- **Sanitize before rendering into email** — `contactFormSchema` strips HTML and escapes entities; keep any new user field flowing through it before it reaches `buildContactHtml`.

## Keeping the contract in sync
When you add/rename/remove a field or token, update **all three** places:
- `ContactForm.tsx` — the input, local validation, and the POST payload keys.
- `contact/route.ts` — the corresponding check and its use in `buildContactHtml`.
- `validation.ts` (`contactFormSchema` / `ContactFormData`) and, for tokens, `security.ts` + `security-tokens/route.ts`.
Mismatched keys silently break submissions — verify the payload shape end to end.

## Constraints & gotchas
- Keep `contact/route.ts` on `runtime = "nodejs"` — `@azure/identity` (Graph) cannot run on the edge.
- Secrets come from env only: `ALTCHA_HMAC_KEY`, `CSRF_SECRET`, `JS_TOKEN_SECRET`, `GRAPH_TENANT_ID`, `GRAPH_CLIENT_ID`, `GRAPH_CLIENT_SECRET`, `MAIL_FROM`, `MAIL_TO` (see `.env.example`). Without Graph config in non-production, `sendContactMail` is a safe no-op.
- Rate-limit counters and used-JS-token set are **in-memory / per-instance** and reset on restart; a multi-instance deployment needs shared storage — don't assume persistence.
- Token comparisons must stay constant-time (`crypto.timingSafeEqual`).

## Verify
- `npm test` (`jest --runInBand`) — `__tests__/graph-mailer.test.ts` and related tests must stay green; add expected/edge/error tests for new behavior.
- `npm run build` and `npm run lint` pass.
- Manually exercise the form: a valid submit succeeds; a missing/invalid token, a tripped honeypot, and a rate-limited repeat all behave as designed.
