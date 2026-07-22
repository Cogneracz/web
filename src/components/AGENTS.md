# components - Agent Guidelines

## Purpose
All React UI for the site: the page sections, the shared icon system, structured data, animation primitives (GSAP scrollytelling and a three.js particle scene), and the interactive contact form. Sections are data-driven from `@/lib/site-content` and styled with Tailwind v4 utilities plus the shared component classes in `@/app/globals.css`.

## Key Files & Subdirectories
- **Section components** (Server Components) — `HeroSection`, `ServicesSection`, `ProcessSection`, `InternalToolsSection`, `TechSection`, `ProjectsSection`, `ContactSection`, `Footer`. Each renders copy from `@/lib/site-content`.
- **Interactive / client components** (`"use client"`) — `Navigation` (mobile menu), `ContactForm` (the full form: local + shared validation, security-token fetch, ALTCHA widget, honeypot, submit flow), `RotatingText`, `ProtectedEmailButton` (+ `ProtectedEmailText`, email obfuscation), `ParticleMorph`, `ScrollAnimator`, `JourneyLine`.
- **Animation** — `ParticleMorph.tsx` (react-three-fiber / three.js particle morph, desktop/mobile particle counts, imperative R3F refs), `ScrollAnimator.tsx` (GSAP ScrollTrigger reveal + manual scroll restoration, honors `prefers-reduced-motion`), `JourneyLine.tsx`, `RotatingText.tsx`.
- **`Icon.tsx`** — maps FontAwesome-style string names (`"fa-robot"`, …) to `lucide-react` icons for content-driven icons, re-exports named icons (`Check`, `Send`, `Menu`, …), and provides inline brand SVGs (`LinkedinIcon`, `GithubIcon`).
- **`StructuredData.tsx`** — injects JSON-LD (`Organization`/site schema) into the document.
- **`SectionIntro.tsx`, `InlineHighlight.tsx`** — small shared presentational helpers.

## Patterns & Conventions
- **Server Components by default;** add `"use client"` only for state, effects, or animation. Keep the client boundary as small as possible.
- **Content comes from `@/lib/site-content`** — do not hardcode section copy; extend the typed model there.
- **Styling via Tailwind v4 + shared classes** from `globals.css` (`premium-card`, `form-input`, `btn-primary`, `section-kicker`, `hero-fade-in`, …). Use `cn()` from `@/lib/utils` for conditional classes.
- **Icons via `@/components/Icon`** — string-named icons through the map, or the re-exported named icons; do not import `lucide-react` directly in feature components when `Icon` already re-exports what you need.
- **Accessibility is expected** — `aria-*`, roles (`listbox`/`option`), `aria-hidden` on decorative icons, the skip link, and reduced-motion fallbacks.
- **Czech UI copy** throughout.

## Dependencies
- `@/lib/site-content` — typed content for every section.
- `@/lib/gsap` — the GSAP + ScrollTrigger + `useGSAP` singleton (always import GSAP from here).
- `@/lib/utils` — `cn()` class merge.
- `@/lib/contact-target` — `scrollToContactForm()` and the target-id constants used by `ProtectedEmailButton`.
- External: `lucide-react`, `gsap` / `@gsap/react`, `@react-three/fiber` / `@react-three/drei` / `three`, `altcha`.
- The `/api/security-tokens`, `/api/altcha`, and `/api/contact` endpoints (consumed by `ContactForm`).

## Review guidelines

- Reuse existing shared components and design-system patterns — flag any new component that duplicates an existing shared component (`Icon`, `SectionIntro`, `RotatingText`, `InlineHighlight`, the shared CSS classes).
- Check loading, error, and empty states — must use shared error/loading patterns, not ad-hoc implementations (see `ContactForm`'s submit/error handling).
- Check for state loss across refresh, navigation, and modal reopen scenarios (e.g. security-token refresh after a failed submit).
- Check API contract mismatches, optimistic update bugs, and inconsistent component behavior — `ContactForm` must stay in sync with the `/api/contact` request shape and `@/lib/validation`.
- Treat user-visible data loss, broken submit flows, and critical UI regressions as P1.
- Flag hardcoded design values (colors, spacing, typography) when design tokens / component classes exist in `globals.css`.
- Flag new utility functions or hooks that duplicate existing shared utilities (`cn`, `scrollToContactForm`) or hooks.
- Flag introduction of new libraries when existing project dependencies cover the same functionality.
- Verify client/server boundaries: three.js and GSAP code must stay in `"use client"` components, and GSAP must be imported from `@/lib/gsap` (never register plugins ad hoc).
- Verify motion respects `prefers-reduced-motion` (as `ScrollAnimator` does).

## Child Work Units
None — component subfolders are not separate work units.

## Parent Context
See [@../../AGENTS.md](../../AGENTS.md) for the project root, and [@../app/AGENTS.md](../app/AGENTS.md) for where these components are composed.

## Reusable Code & Shared Patterns
- **`Icon.tsx`** — the icon map + re-exported icons + brand SVGs. Add new icons here, not per-component.
- **Shared CSS component classes** in `@/app/globals.css` — reuse before writing new Tailwind combinations.
- **`cn()`** (`@/lib/utils`) for conditional class merging.
- **`@/lib/gsap`** — the one place plugins are registered and defaults set; import GSAP from here everywhere.
- **`scrollToContactForm()`** (`@/lib/contact-target`) — the shared "jump to contact" behavior used by CTAs.
- **`RotatingText`, `SectionIntro`, `InlineHighlight`, `ScrollAnimator`** — reuse these presentational/animation helpers.

## AI Agent Instructions
- **Client/server boundary:** three.js (`ParticleMorph`) and GSAP (`ScrollAnimator`, `JourneyLine`) are client-only; never import them into a Server Component. Import GSAP exclusively from `@/lib/gsap`.
- **Performance:** `ParticleMorph` uses distinct desktop/mobile particle counts and imperative R3F refs — preserve those when editing, and keep the animation off the main-content critical path.
- **Validation parity:** `ContactForm`'s client-side checks mirror `@/lib/validation`; when server rules change, update both so users see consistent errors.
- **Accessibility:** keep `aria-*`/roles, focus handling, and reduced-motion fallbacks intact.
- **Testing:** component tests live in `__tests__/` (Testing Library + jsdom); add expected/edge/error tests for new behavior.
- **CRITICAL: Before creating any new file, search this directory and `@/lib` for an existing implementation. Reuse and extend existing code — do not duplicate.**

## Available Skills

| Skill | Description | Invocation |
|-------|-------------|------------|
| `add-section` | Add a new content-driven page section — a Server Component here that renders from `@/lib/site-content`, uses `SectionIntro`/`Icon`/shared classes, and is wired into the page, nav, and scroll reveal. | `/add-section [section-name]` |
