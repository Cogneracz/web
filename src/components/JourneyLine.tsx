"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";

/**
 * Decorative scroll-drawn connector line threading the process step nodes.
 * Sits behind the (opaque) step cards, so it reads as a journey thread
 * entering and leaving each card through the gaps. Desktop only.
 */
export default function JourneyLine() {
  const pathRef = useRef<SVGPathElement>(null);

  useGSAP(() => {
    const path = pathRef.current;
    if (!path) return;
    const len = path.getTotalLength();
    gsap.set(path, { strokeDasharray: len, strokeDashoffset: len });

    const mm = gsap.matchMedia();
    mm.add(
      {
        animate: "(prefers-reduced-motion: no-preference)",
        reduce: "(prefers-reduced-motion: reduce)",
      },
      (ctx) => {
        if (ctx.conditions?.reduce) {
          gsap.set(path, { strokeDashoffset: 0 });
          return;
        }
        gsap.to(path, {
          strokeDashoffset: 0,
          ease: "none",
          scrollTrigger: {
            trigger: path,
            start: "top 80%",
            end: "bottom 55%",
            scrub: 1,
          },
        });
      },
    );

    return () => mm.revert();
  });

  return (
    <svg
      className="pointer-events-none absolute inset-x-0 top-[3.25rem] z-0 hidden h-12 w-full lg:block"
      viewBox="0 0 1000 48"
      fill="none"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <path
        ref={pathRef}
        d="M 60 24 C 200 24 260 6 360 6 C 470 6 540 42 660 42 C 760 42 820 24 940 24"
        stroke="#2563eb"
        strokeWidth="2.5"
        strokeLinecap="round"
        opacity="0.45"
      />
    </svg>
  );
}
