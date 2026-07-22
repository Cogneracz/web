---
name: add-section
description: Add a new content-driven landing-page section to the Cognera site — a Server Component that renders from the typed content model, wired into the page, nav, and scroll-reveal system. Use when adding, splitting, or restructuring a section of the single-page site (services, process, tech, projects, etc.).
argument-hint: [section-name]
---

# Add a page section

The site (`cognera.cz`) is a single page composed of independent sections. Every section follows the same content-model-first pattern. Do **not** hardcode copy into components — copy lives as typed data in `src/lib/site-content.ts` and components render from it.

## Before you write anything

1. **Search before creating** — `Grep`/`Glob` for an existing implementation by section name, domain concept, and by scanning `src/components/*Section.tsx`. A similar section may already exist to extend.
2. **Reuse shared code** — render through `SectionIntro`, the `Icon` system (`@/components/Icon`), `cn()` (`@/lib/utils`), and the shared CSS component classes in `src/app/globals.css` (`section-kicker`, `premium-card`, `premium-icon-box`, `btn-primary`, …). Do not invent parallel styles or a new icon import.
3. **Follow existing patterns** — match the naming (`XxxSection.tsx`), the `<section>` shell, the Tailwind spacing rhythm, and the Server-Component default already used by every sibling section.
4. **Common error handling** — sections are static Server Components; if a section needs data-fetching or interactivity, isolate the interactive part into its own `"use client"` child rather than converting the whole section.
5. **No speculative abstractions** — only extract a shared sub-component when 2+ sections concretely need it.

## Steps

### 1. Model the content (`src/lib/site-content.ts`)
Add (or extend) a typed interface and export the data. Icons are referenced by string name (e.g. `"fa-server"`) resolved through `@/components/Icon`.

```ts
export interface FeatureCard {
  icon: string;      // maps to a lucide icon in Icon.tsx's iconMap
  title: string;
  description: string;
}

export const featureCards: FeatureCard[] = [
  { icon: "fa-rocket", title: "…", description: "…" },
];
```
Keep copy in **Czech** to match the rest of the site. Watch the ≤500-line file guideline (this file is already ~380 lines) — split by domain if it grows.

### 2. Create the component (`src/components/FeatureSection.tsx`)
Use `template.md` in this skill as the starting point. Requirements:
- Server Component (no `"use client"` unless it needs state/effects).
- Root: `<section id="<anchor>" className="section-animate bg-white px-4 py-16 sm:px-6 sm:py-24 lg:px-8 lg:py-28">` — the `section-animate` class is what `ScrollAnimator` reveals on scroll (and it honors `prefers-reduced-motion`).
- Use `<SectionIntro eyebrow="…" title="…" description="…" />` for the heading block.
- Import content from `@/lib/site-content`; render icons via `Icon` / the named exports from `@/components/Icon`.
- Alternate background between sections (`bg-white` vs `bg-[#f8fafc]`) to keep the existing visual rhythm.

### 3. Wire it into the page (`src/app/page.tsx`)
Import the component and place it inside `<main id="main-content">` in the intended order among the other sections.

### 4. Add navigation (`src/lib/site-content.ts` → `navLinks`)
If the section should appear in the header nav, add `{ href: "#<anchor>", label: "…" }` to `navLinks`. The `href` anchor **must** match the section's `id`. `Navigation` renders from `navLinks` automatically.

## Verify
- `npm run lint` and `npm run build` pass.
- Anchor nav scrolls to the new section; it reveals on scroll and is visible immediately with reduced motion enabled.
- Add tests under `__tests__/` if the section contains non-trivial logic (expected / edge / error).
