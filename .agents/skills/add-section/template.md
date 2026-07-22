# Section component starter

Copy into `src/components/<Name>Section.tsx`. Server Component by default.

```tsx
import SectionIntro from "./SectionIntro";
import Icon from "./Icon";
import { featureCards } from "@/lib/site-content";

export default function FeatureSection() {
  return (
    <section
      id="features"
      className="section-animate bg-white px-4 py-16 sm:px-6 sm:py-24 lg:px-8 lg:py-28"
    >
      <div className="mx-auto max-w-7xl">
        <SectionIntro
          eyebrow="Eyebrow"
          title="Nadpis sekce"
          description="Krátký popis sekce v češtině."
        />

        <div className="mt-12 grid grid-cols-1 gap-6 sm:mt-16 sm:grid-cols-2 lg:grid-cols-3">
          {featureCards.map((card) => (
            <div key={card.title} className="premium-card p-6">
              <div className="premium-icon-box mb-4 flex h-12 w-12 items-center justify-center">
                <Icon name={card.icon} size={22} />
              </div>
              <h3 className="font-display text-xl font-semibold text-slate-950">
                {card.title}
              </h3>
              <p className="mt-2 text-sm leading-7 text-slate-600">
                {card.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
```

Notes:
- Alternate the section background with neighbors: `bg-white` ↔ `bg-[#f8fafc]`.
- Keep the `section-animate` class so `ScrollAnimator` reveals it.
- Icon string names (`card.icon`) must exist in `iconMap` inside `src/components/Icon.tsx`; add the lucide icon there if missing.
- If the section needs interactivity, extract that piece into a separate `"use client"` component and keep this shell a Server Component.
