"use client";

import { useRef, useState } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import Icon from "./Icon";
import { internalTools, type InternalTool } from "@/lib/site-content";

type Step = {
  toolName: string;
  kicker: string;
  description: string;
  metric?: string;
  icon: string;
};

// Rich tool copy lives in site-content.ts (single source of truth); the scroll
// story only adds the pipeline framing — the kicker that labels the beat.
const tool = (name: string): InternalTool => {
  const found = internalTools.find((t) => t.name === name);
  if (!found) throw new Error(`InternalToolsSection: unknown tool "${name}"`);
  return found;
};

const step = (name: string, kicker: string): Step => {
  const t = tool(name);
  return {
    toolName: t.name,
    kicker,
    description: t.description,
    metric: t.metric,
    icon: t.icon,
  };
};

// Scroll-story beats: the full lifecycle of one change through the Cognera AI
// stack — intake, the four pipeline tools, and the supporting layer around them.
// Every internal tool gets its own beat so no frame is empty.
const STEPS: Step[] = [
  {
    toolName: "Vstupy z firmy",
    kicker: "Surovina",
    description:
      "Videa ze schůzek, hlasové poznámky, firemní dokumentace i data z interních systémů proudí dovnitř jako surovina pro celý stack. Žádný kontext se neztratí mezi nástroji ani v hlavách lidí.",
    metric: "Multi-zdroj · Multi-modal",
    icon: "fa-building",
  },
  step("Meeting Agent", "Záchyt"),
  step("Anvil", "Zadání"),
  step("CogneraSpec", "Governance"),
  step("Forge", "Vývoj"),
  step("Agent System", "Orchestrace"),
  step("Context Servers", "Kontext"),
  step("Temper", "QA"),
  step("Prompt & Rules Library", "Knihovna"),
  {
    toolName: "Dodávka",
    kicker: "Výsledek",
    description:
      "Hotová, otestovaná a zdokumentovaná změna míří do produkce. Co prošlo celým stackem, je připravené nasadit — bez ručního dohánění a bez překvapení.",
    metric: "Otestováno · Připraveno",
    icon: "fa-rocket",
  },
];

export default function InternalToolsSection() {
  // Index of the beat currently centered in the viewport. Drives the sticky
  // progress rail so the highlighted tool always matches the card being read.
  const [active, setActive] = useState(0);
  const rootRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root) return;

      const steps = gsap.utils.toArray<HTMLElement>(
        root.querySelectorAll("[data-step]"),
      );

      const select = (i: number) => {
        setActive(i);
        steps.forEach((s, idx) => s.classList.toggle("is-active", idx === i));
      };

      const mm = gsap.matchMedia();

      mm.add(
        {
          // Desktop with motion allowed -> sticky rail + scrolled cards.
          motion:
            "(min-width: 1024px) and (prefers-reduced-motion: no-preference)",
          // Mobile OR reduced motion -> static, fully readable stack.
          // Two exhaustive, mutually exclusive queries guarantee one branch
          // always runs.
          fallback: "(max-width: 1023px), (prefers-reduced-motion: reduce)",
        },
        (ctx) => {
          const { fallback } = ctx.conditions as {
            motion: boolean;
            fallback: boolean;
          };

          // Static final state: reduced motion OR mobile (no triggers, no pin).
          if (fallback) {
            steps.forEach((s) => s.classList.add("is-active"));
            return;
          }

          // Desktop + motion: dim inactive cards, drive the rail from scroll.
          root.classList.add("tools-motion");
          select(0);

          steps.forEach((s, i) => {
            ScrollTrigger.create({
              trigger: s,
              start: "top center",
              end: "bottom center",
              onEnter: () => select(i),
              onEnterBack: () => select(i),
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
      className="relative bg-gradient-to-b from-slate-50 via-blue-50/50 to-slate-50 px-4 py-16 sm:px-6 sm:py-24 lg:px-8 lg:py-28"
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

      {/* Story: sticky progress rail + stepped cards */}
      <div className="relative mx-auto mt-10 max-w-7xl lg:mt-16 lg:grid lg:grid-cols-[0.85fr_1.15fr] lg:gap-12">
        {/* Sticky progress rail (desktop). Every beat is its own node, the
            active one lit — so the visual always matches the card being read.
            Decorative: the cards carry the real content, so it's hidden from
            assistive tech to avoid duplicate announcements. */}
        <div
          aria-hidden="true"
          className="top-0 hidden h-screen flex-col justify-center lg:sticky lg:flex"
        >
          <ol className="relative">
            {/* connector spine behind the node icons */}
            <span className="absolute bottom-7 left-[1.375rem] top-7 w-px bg-slate-200" />
            {STEPS.map((s, i) => {
              const state =
                i === active ? "active" : i < active ? "done" : "todo";
              return (
                <li
                  key={s.toolName}
                  className="relative flex items-center gap-4 py-1.5"
                >
                  <span
                    className={`relative z-10 flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border transition-all duration-300 ${
                      state === "active"
                        ? "scale-110 border-blue-600 bg-white text-blue-600 shadow-md shadow-blue-500/20"
                        : state === "done"
                          ? "border-blue-200 bg-blue-50 text-blue-500"
                          : "border-slate-200 bg-white text-slate-300"
                    }`}
                  >
                    <Icon name={s.icon} size={19} />
                    {state === "active" && (
                      <span className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full bg-amber-500 ring-2 ring-white" />
                    )}
                  </span>
                  <span
                    className={`font-display text-lg font-semibold transition-colors duration-300 ${
                      state === "active"
                        ? "text-slate-950"
                        : state === "done"
                          ? "text-slate-500"
                          : "text-slate-400"
                    }`}
                  >
                    {s.toolName}
                  </span>
                </li>
              );
            })}
          </ol>
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
                <div className="flex items-start justify-between gap-4">
                  <div className="premium-icon-box flex h-11 w-11 items-center justify-center bg-blue-50 text-blue-600 sm:h-12 sm:w-12">
                    <Icon name={s.icon} size={20} className="text-blue-600" />
                  </div>
                  {s.metric && (
                    <span className="rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
                      {s.metric}
                    </span>
                  )}
                </div>
                <p className="section-kicker mt-5">{s.kicker}</p>
                <h3 className="mt-1 font-display text-2xl font-semibold text-slate-950 sm:text-3xl">
                  <span className="hover-mark">{s.toolName}</span>
                </h3>
                <p className="mt-3 max-w-md text-base leading-7 text-slate-600">
                  {s.description}
                </p>
              </article>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
