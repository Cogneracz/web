"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";

export default function RotatingText({
  words,
  className = "",
  justifyClass = "justify-center",
}: {
  words: string[];
  className?: string;
  justifyClass?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const wordRefs = useRef<HTMLSpanElement[]>([]);

  useGSAP(
    () => {
      const items = wordRefs.current.slice(0, words.length).filter(Boolean);
      if (items.length === 0) return;

      gsap.set(items, { autoAlpha: 0, y: 0 });
      gsap.set(items[0], { autoAlpha: 1, y: 0 });
      if (items.length < 2) return;

      const mm = gsap.matchMedia();
      mm.add(
        {
          animate: "(prefers-reduced-motion: no-preference)",
          reduce: "(prefers-reduced-motion: reduce)",
        },
        (ctx) => {
          if (ctx.conditions?.reduce) {
            gsap.set(items, { autoAlpha: 0, y: 0 });
            gsap.set(items[0], { autoAlpha: 1 });
            return;
          }

          const tl = gsap.timeline({ repeat: -1 });
          items.forEach((item, i) => {
            const next = items[(i + 1) % items.length];
            tl.to(item, {
              autoAlpha: 0,
              y: -8,
              duration: 0.22,
              ease: "power2.in",
              delay: 2,
            })
              .set(item, { y: 0 })
              .fromTo(
                next,
                { autoAlpha: 0, y: 8 },
                {
                  autoAlpha: 1,
                  y: 0,
                  duration: 0.28,
                  ease: "power2.out",
                  immediateRender: false,
                },
              );
          });
        },
      );

      return () => mm.revert();
    },
    { scope: ref },
  );

  return (
    <span
      ref={ref}
      aria-label={words[0] || undefined}
      className={`relative isolate block overflow-hidden ${className}`}
      role="text"
      style={{ height: "1.35em", lineHeight: 1 }}
    >
      {words.map((w, i) => (
        <span
          key={w}
          ref={(node) => {
            if (node) wordRefs.current[i] = node;
          }}
          aria-hidden="true"
          className={`absolute inset-0 flex items-center ${justifyClass} whitespace-nowrap leading-none`}
        >
          {w}
        </span>
      ))}
    </span>
  );
}
