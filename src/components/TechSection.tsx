"use client";

import { useState } from "react";
import SectionIntro from "./SectionIntro";
import Icon from "./Icon";
import { techCategories } from "@/lib/site-content";

export default function TechSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const active = techCategories[activeIndex];

  return (
    <section
      id="tech"
      className="section-animate bg-[#f8fafc] px-4 py-16 sm:px-6 sm:py-24 lg:px-8 lg:py-28"
    >
      <div className="mx-auto max-w-7xl">
        <SectionIntro
          eyebrow="Technologie"
          title={
            <>
              Pracujeme s{" "}
              <span className="text-blue-600">ověřeným stackem</span>.
            </>
          }
          description="Od frontendu po infrastrukturu. Používáme stabilní, prověřené technologie v aktuálních LTS verzích — a integrujeme se s českými i mezinárodními systémy."
        />

        <div className="mt-10 grid gap-6 sm:mt-14 lg:grid-cols-12 lg:gap-8">
          {/* Category rail */}
          <nav
            aria-label="Kategorie technologií"
            className="lg:col-span-4 lg:sticky lg:top-24 lg:self-start"
          >
            <ul className="flex gap-2 overflow-x-auto pb-2 lg:flex-col lg:gap-1.5 lg:overflow-visible lg:pb-0">
              {techCategories.map((cat, i) => {
                const isActive = i === activeIndex;
                return (
                  <li key={cat.name} className="flex-shrink-0 lg:flex-shrink">
                    <button
                      type="button"
                      onClick={() => setActiveIndex(i)}
                      aria-pressed={isActive}
                      className={`group flex w-full items-center gap-3 whitespace-nowrap rounded-xl border px-4 py-3 text-left transition-all duration-200 lg:whitespace-normal ${
                        isActive
                          ? "border-blue-600 bg-white text-slate-950 shadow-sm"
                          : "border-slate-200 bg-white/60 text-slate-600 hover:border-slate-300 hover:bg-white hover:text-slate-900"
                      }`}
                    >
                      <span
                        className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg border transition-colors duration-200 ${
                          isActive
                            ? "border-blue-200 bg-blue-50 text-blue-600"
                            : "border-slate-200 bg-white text-slate-500 group-hover:border-blue-200 group-hover:bg-blue-50 group-hover:text-blue-600"
                        }`}
                      >
                        <Icon name={cat.icon} size={16} />
                      </span>
                      <span className="font-display text-sm font-semibold sm:text-base">
                        {cat.name}
                      </span>
                      <span
                        className={`ml-auto hidden text-xs font-medium transition-opacity duration-200 lg:inline ${
                          isActive ? "text-blue-600 opacity-100" : "text-slate-400 opacity-0 group-hover:opacity-100"
                        }`}
                      >
                        {cat.items.length}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Detail panel */}
          <div className="lg:col-span-8">
            <article
              key={active.name}
              className="premium-card p-6 sm:p-8 lg:p-10"
            >
              <div className="flex items-start gap-4">
                <div className="premium-icon-box flex h-12 w-12 items-center justify-center">
                  <Icon name={active.icon} size={22} className="text-blue-600" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-display text-xl font-semibold text-slate-950 sm:text-2xl">
                    {active.name}
                  </h3>
                  {active.description && (
                    <p className="mt-2 text-sm leading-7 text-slate-600 sm:text-base">
                      {active.description}
                    </p>
                  )}
                </div>
              </div>

              <div className="mt-6 border-t border-slate-200 pt-6 sm:mt-8 sm:pt-8">
                <h4 className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">
                  Stack
                </h4>
                <ul className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {active.items.map((item) => (
                    <li
                      key={item.name}
                      className="flex items-center justify-between rounded-lg border border-slate-200 bg-white px-4 py-3 transition-colors duration-200 hover:border-blue-300 hover:bg-blue-50/50"
                    >
                      <span className="font-display text-sm font-semibold text-slate-900 sm:text-base">
                        {item.name}
                      </span>
                      {item.version && (
                        <span className="text-xs font-medium text-slate-400 sm:text-sm">
                          {item.version}
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          </div>
        </div>
      </div>
    </section>
  );
}
