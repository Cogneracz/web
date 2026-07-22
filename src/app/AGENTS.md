# app - Agent Guidelines

## Purpose
The Next.js App Router directory. It defines the site's single page, the root HTML layout, the global design system, and the SEO/PWA metadata routes. All rendered UI is composed here from components in `@/components`; the dynamic backend lives in the `api/` child work unit.

## Key Files & Subdirectories
- `layout.tsx` — root layout. Loads the Inter + Outfit Google fonts (as CSS variables), declares the full `metadata` and `viewport` objects (Czech `cs-CZ`, OpenGraph, Twitter, icons, robots), renders the skip link and `<StructuredData />`, and sets `lang="cs"`.
- `page.tsx` — the home page: composes `Navigation`, the section components (`Hero`, `Services`, `Process`, `InternalTools`, `Tech`, `Projects`, `Contact`), `Footer`, and `ScrollAnimator`.
- `globals.css` — the design system (~559 lines): Tailwind v4 `@import "tailwindcss"`, `@theme inline` tokens (`--font-inter`, `--font-outfit`, `--color-primary`), base resets, and shared component classes used across components.
- `robots.ts` — `MetadataRoute.Robots`. Allows `/` (disallows `/api/`) and explicitly welcomes AI/LLM crawlers (GPTBot, ClaudeBot, PerplexityBot, …) for GEO.
- `sitemap.ts` — `MetadataRoute.Sitemap` for the single canonical URL.
- `manifest.ts` — `MetadataRoute.Manifest` PWA manifest (name, icons, theme color).
- `api/` — backend route handlers; documented in its own AGENTS.md.

## Patterns & Conventions
- **App Router file conventions** — `layout`/`page` plus code-based metadata routes (`robots.ts`, `sitemap.ts`, `manifest.ts`) return typed `MetadataRoute.*` values.
- **Metadata API for SEO** — the canonical/OG/Twitter data is a static `metadata` export in `layout.tsx`; `metadataBase` is `https://cognera.cz`.
- **Single-page composition** — there is one route; sections are ordinary components assembled in `page.tsx`.
- **Design tokens are centralized** in `globals.css` via `@theme inline`; components consume Tailwind utilities and the shared component classes rather than inline style values.
- **Server Components by default** — nothing here is a client component; interactivity is delegated to client components under `@/components`.

## Dependencies
- `@/components/*` — every section and the `StructuredData` component.
- `next/font/google` — Inter and Outfit typefaces.
- `next` — `Metadata`, `Viewport`, and `MetadataRoute` types.

## Review guidelines

- Reuse existing shared components and design-system patterns — flag any new component that duplicates an existing shared component.
- Check loading, error, and empty states — must use shared error/loading patterns, not ad-hoc implementations.
- Check for state loss across refresh, navigation, and modal reopen scenarios.
- Check API contract mismatches, optimistic update bugs, and inconsistent component behavior.
- Treat user-visible data loss, broken submit flows, and critical UI regressions as P1.
- Flag hardcoded design values (colors, spacing, typography) when design tokens exist in `globals.css`.
- Flag new utility functions or hooks that duplicate existing shared utilities or hooks.
- Flag introduction of new libraries when existing project dependencies cover the same functionality.
- Verify metadata routes return valid `MetadataRoute.*` shapes and that canonical/`metadataBase` URLs stay consistent with `robots.ts`/`sitemap.ts`.

## Child Work Units
- [@./api/AGENTS.md](./api/AGENTS.md) - Backend route handlers (contact, altcha challenge, security tokens).

## Parent Context
See [@../../AGENTS.md](../../AGENTS.md) for broader context.

## Reusable Code & Shared Patterns
- **`globals.css` is the single source of the design system** — reuse its `@theme` tokens and component classes; do not introduce parallel color/spacing definitions.
- **Fonts** are exposed as the CSS variables `--font-inter` / `--font-outfit` (mapped to `--font-sans` / `--font-display`); reference these, don't re-import fonts.
- **Metadata** — extend the existing `metadata` object in `layout.tsx` rather than adding per-page `<head>` tags.

## AI Agent Instructions
- Keep `layout.tsx` free of client-only logic; if a section needs interactivity, build it as a client component in `@/components`.
- When adding a route or page, add matching sitemap/robots entries and keep `metadataBase`/canonical URLs aligned.
- `globals.css` is large — add new tokens/classes deliberately and keep them grouped; prefer extending existing classes.
- **CRITICAL: Before creating any new file, search this directory, `@/components`, and `@/lib` for an existing implementation. Reuse and extend existing code — do not duplicate.**
