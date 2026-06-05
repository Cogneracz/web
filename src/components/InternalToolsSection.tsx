"use client";

import { useRef } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import Icon from "./Icon";

type Step = {
  toolName: string;
  kicker: string;
  oneLiner: string;
  icon: string;
  nodeIndex: number | null;
};

// Scroll-story beats: the lifecycle of one change through the Cognera AI stack.
const STEPS: Step[] = [
  {
    toolName: "Vstupy z firmy",
    kicker: "Surovina",
    oneLiner: "Videa, hlas a dokumentace z celé firmy proudí dovnitř.",
    icon: "fa-layer-group",
    nodeIndex: null,
  },
  {
    toolName: "Anvil",
    kicker: "Zadání",
    oneLiner: "Destiluje vstupy do strukturovaných úkolů nad repozitářem.",
    icon: "fa-anvil",
    nodeIndex: 0,
  },
  {
    toolName: "Forge",
    kicker: "Vývoj",
    oneLiner: "Paralelně orchestruje Claude, GPT i Gemini přes víc harnessů.",
    icon: "fa-hammer",
    nodeIndex: 1,
  },
  {
    toolName: "Temper",
    kicker: "QA",
    oneLiner: "Protaví každou změnu auto-scénáři před nasazením.",
    icon: "fa-flame",
    nodeIndex: 2,
  },
  {
    toolName: "CogneraSpec",
    kicker: "Governance",
    oneLiner: "Vše řídí spec revidovaná člověkem dřív než vznikne kód.",
    icon: "fa-file-lines",
    nodeIndex: null,
  },
  {
    toolName: "Dodávka",
    kicker: "Výsledek",
    oneLiner: "Hotová, otestovaná změna míří do produkce.",
    icon: "fa-rocket",
    nodeIndex: 3,
  },
];

// Primary pipeline nodes — anchor points must match SPINE_D below.
const NODES = [
  { x: 110, y: 210, label: "Anvil", icon: "fa-anvil" },
  { x: 260, y: 250, label: "Forge", icon: "fa-hammer" },
  { x: 410, y: 210, label: "Temper", icon: "fa-flame" },
  { x: 540, y: 235, label: "Dodávka", icon: "fa-rocket" },
];

const SPINE_D =
  "M 110 210 C 180 210 200 250 260 250 C 330 250 350 210 410 210 C 470 210 500 235 540 235";
const RAIL_D = "M 60 320 L 580 320";

// Accessible description of the pipeline (role="img"+aria-label makes the SVG
// atomic, so the narrative must live here for assistive tech).
const SVG_LABEL =
  "Pipeline interních AI nástrojů Cognery: Anvil připraví zadání, Forge ho vyvine, " +
  "Temper otestuje, výsledek se dodá — vše governuje CogneraSpec.";

export default function InternalToolsSection() {
  const rootRef = useRef<HTMLElement>(null);
  const storyRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const railRef = useRef<SVGPathElement>(null);
  const sparkRef = useRef<SVGCircleElement>(null);

  useGSAP(
    () => {
      const root = rootRef.current;
      const path = pathRef.current;
      const rail = railRef.current;
      const spark = sparkRef.current;
      const svg = svgRef.current;
      if (!root || !path || !rail || !svg || !spark) return;

      const nodeGroups = gsap.utils.toArray<SVGGElement>(
        svg.querySelectorAll("[data-node]"),
      );
      const rings = nodeGroups.map((g) =>
        g.querySelector<SVGCircleElement>(".node-ring"),
      );
      const steps = gsap.utils.toArray<HTMLElement>(
        root.querySelectorAll("[data-step]"),
      );

      const len = path.getTotalLength();
      const railLen = rail.getTotalLength();

      // Cumulative, idempotent activation: light every node up to step i.
      const activate = (i: number, animate: boolean) => {
        steps.forEach((s, idx) => s.classList.toggle("is-active", idx === i));
        NODES.forEach((_, ni) => {
          const owner = STEPS.findIndex((s) => s.nodeIndex === ni);
          const lit = owner !== -1 && owner <= i;
          const g = nodeGroups[ni];
          const ring = rings[ni];
          if (!g) return;
          gsap.to(g, { autoAlpha: lit ? 1 : 0.35, duration: animate ? 0.4 : 0 });
          if (ring)
            gsap.to(ring, {
              attr: { r: lit ? 27 : 17 },
              ease: animate ? "back.out(2)" : "none",
              duration: animate ? 0.45 : 0,
            });
        });
        // Governance beat: pulse the CogneraSpec rail.
        if (animate && STEPS[i].toolName === "CogneraSpec") {
          gsap.fromTo(
            rail,
            { strokeWidth: 2 },
            { strokeWidth: 4, duration: 0.3, yoyo: true, repeat: 1 },
          );
        }
      };

      const mm = gsap.matchMedia();

      mm.add(
        {
          // Desktop with motion allowed -> full scroll story.
          motion: "(min-width: 1024px) and (prefers-reduced-motion: no-preference)",
          // Mobile OR reduced motion -> static, fully readable fallback.
          // Two exhaustive, mutually exclusive queries guarantee one branch
          // always runs (a single "(min-width)" query would leave the
          // mobile + no-reduced-motion case matching nothing).
          fallback:
            "(max-width: 1023px), (prefers-reduced-motion: reduce)",
        },
        (ctx) => {
          const conditions = ctx.conditions as {
            motion: boolean;
            fallback: boolean;
          };

          gsap.set(path, { strokeDasharray: len, strokeDashoffset: len });
          gsap.set(rail, { strokeDasharray: railLen, strokeDashoffset: railLen });

          // Static final state: reduced motion OR mobile (no triggers, no pin).
          if (conditions.fallback) {
            gsap.set([path, rail], { strokeDashoffset: 0 });
            gsap.set(nodeGroups, { autoAlpha: 1 });
            gsap.set(rings, { attr: { r: 27 } });
            gsap.set(spark, { autoAlpha: 0 });
            steps.forEach((s) => s.classList.add("is-active"));
            root.classList.remove("tools-preinit");
            return;
          }

          // Desktop + motion.
          root.classList.add("tools-motion");
          gsap.set(nodeGroups, { autoAlpha: 0.35 });
          gsap.set(rings, { attr: { r: 17 } });
          gsap.set(spark, { autoAlpha: 1 });
          // GSAP now owns the start state — drop the pre-init CSS guard.
          root.classList.remove("tools-preinit");
          activate(0, false);

          // The only scrubbed tween: draw spine + rail, spark rides the tip.
          gsap.to([path, rail], {
            strokeDashoffset: 0,
            ease: "none",
            scrollTrigger: {
              trigger: storyRef.current!,
              start: "top top",
              end: "bottom bottom",
              scrub: 1,
              invalidateOnRefresh: true,
              onUpdate: (self) => {
                if (!spark) return;
                const pt = path.getPointAtLength(self.progress * len);
                gsap.set(spark, { x: pt.x - 110, y: pt.y - 210 });
              },
            },
          });

          // Per-step activation (cheap, non-scrubbed, idempotent both directions).
          steps.forEach((step, i) => {
            ScrollTrigger.create({
              trigger: step,
              start: "top center",
              end: "bottom center",
              onEnter: () => activate(i, true),
              onEnterBack: () => activate(i, true),
            });
          });

          return () => root.classList.remove("tools-motion");
        },
      );

      // Recompute trigger positions once the display font has settled.
      (document.fonts?.ready ?? Promise.resolve()).then(() =>
        ScrollTrigger.refresh(),
      );

      return () => mm.revert();
    },
    { scope: rootRef },
  );

  return (
    <section
      id="tools"
      ref={rootRef}
      className="tools-preinit relative bg-gradient-to-b from-slate-50 via-blue-50/50 to-slate-50 px-4 py-16 sm:px-6 sm:py-24 lg:px-8 lg:py-28"
    >
      {/* Orb clip — sibling of the story grid so it never becomes a sticky ancestor */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <div className="absolute -left-32 top-10 h-80 w-80 rounded-full bg-blue-300/30 blur-3xl sm:h-96 sm:w-96" />
        <div className="absolute -right-32 bottom-10 h-80 w-80 rounded-full bg-indigo-300/25 blur-3xl sm:h-96 sm:w-96" />
      </div>

      {/* Header (static) */}
      <div className="relative mx-auto max-w-3xl text-center">
        <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-white px-3.5 py-1.5 text-xs font-bold uppercase tracking-[0.16em] text-blue-600 shadow-sm">
          <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
          Vlastní AI stack
        </span>
        <h2 className="font-display text-2xl font-semibold text-slate-950 sm:text-4xl lg:text-5xl">
          Od zadání k dodávce <span className="text-blue-600">jednou linkou</span>.
        </h2>
        <p className="mt-3 text-sm leading-7 text-slate-600 sm:text-base">
          Anvil → Forge → Temper → dodávka. Scrollni a sleduj, jak změna projde
          celým stackem.
        </p>
      </div>

      {/* Story: sticky SVG pipeline + stepped cards */}
      <div
        ref={storyRef}
        className="relative mx-auto mt-10 max-w-7xl lg:mt-16 lg:grid lg:grid-cols-[1.05fr_0.95fr] lg:gap-12"
      >
        {/* Sticky graphic (desktop) */}
        <div className="top-0 hidden h-screen items-center lg:sticky lg:flex">
          <svg
            ref={svgRef}
            viewBox="0 0 600 400"
            className="h-auto w-full"
            role="img"
            aria-label={SVG_LABEL}
          >
            <defs>
              <filter
                id="spark-glow"
                x="-150%"
                y="-150%"
                width="400%"
                height="400%"
              >
                <feGaussianBlur stdDeviation="4" result="b" />
                <feMerge>
                  <feMergeNode in="b" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* CogneraSpec rail */}
            <path
              ref={railRef}
              className="tools-draw"
              d={RAIL_D}
              stroke="#94a3b8"
              strokeWidth="2"
              strokeDasharray="2 8"
              strokeLinecap="round"
              fill="none"
              opacity="0.6"
            />
            <text x="60" y="345" fontSize="13" fill="#64748b">
              CogneraSpec
            </text>

            {/* Spine */}
            <path
              ref={pathRef}
              className="tools-draw"
              d={SPINE_D}
              stroke="#2563eb"
              strokeWidth="3"
              strokeLinecap="round"
              fill="none"
            />

            {/* Molten spark riding the drawing tip */}
            <circle
              ref={sparkRef}
              className="tools-spark"
              cx="110"
              cy="210"
              r="6"
              fill="#f59e0b"
              filter="url(#spark-glow)"
            />

            {/* Primary nodes */}
            {NODES.map((n) => (
              <g key={n.label} data-node>
                <circle
                  className="node-ring"
                  cx={n.x}
                  cy={n.y}
                  r="27"
                  fill="#ffffff"
                  stroke="#2563eb"
                  strokeWidth="2.5"
                />
                <foreignObject x={n.x - 13} y={n.y - 13} width="26" height="26">
                  <div className="flex h-full w-full items-center justify-center text-blue-600">
                    <Icon name={n.icon} size={18} />
                  </div>
                </foreignObject>
                <text
                  x={n.x}
                  y={n.y + 46}
                  textAnchor="middle"
                  fontSize="13"
                  fontWeight="600"
                  fill="#0f172a"
                >
                  {n.label}
                </text>
              </g>
            ))}
          </svg>
        </div>

        {/* Stepped cards */}
        <ol className="relative">
          {STEPS.map((s) => (
            <li
              key={s.toolName}
              data-step
              className="tools-step flex min-h-0 items-center py-5 lg:min-h-screen lg:py-0"
            >
              <article className="tools-step-card premium-card group w-full p-6 sm:p-8">
                <div className="premium-icon-box mb-5 flex h-11 w-11 items-center justify-center bg-blue-50 text-blue-600 sm:h-12 sm:w-12">
                  <Icon name={s.icon} size={20} className="text-blue-600" />
                </div>
                <p className="section-kicker">{s.kicker}</p>
                <h3 className="mt-1 font-display text-2xl font-semibold text-slate-950 sm:text-3xl">
                  <span className="hover-mark">{s.toolName}</span>
                </h3>
                <p className="mt-3 max-w-md text-base leading-7 text-slate-600">
                  {s.oneLiner}
                </p>
              </article>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
