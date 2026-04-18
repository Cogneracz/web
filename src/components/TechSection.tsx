"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import SectionIntro from "./SectionIntro";
import Icon from "./Icon";
import { techCategories } from "@/lib/site-content";

export default function TechSection() {
  // Desktop: active tab in rail
  const [activeIndex, setActiveIndex] = useState(0);
  const active = techCategories[activeIndex];

  // Mobile: which accordion is open (first one by default)
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const railRef = useRef<HTMLUListElement>(null);
  const isFirstRender = useRef(true);
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    const rail = railRef.current;
    if (!rail) return;
    const btn = rail.querySelector<HTMLElement>(
      `[data-tech-index="${activeIndex}"]`
    );
    // offsetParent is null when the element (or an ancestor) is display:none —
    // skip scrolling when the desktop rail is hidden on mobile.
    if (!btn || btn.offsetParent === null) return;
    btn.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "center",
    });
  }, [activeIndex]);

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

        {/* MOBILE — accordion list (all categories visible, tap to expand) */}
        <div className="mt-10 space-y-3 lg:hidden">
          {techCategories.map((cat, i) => {
            const isOpen = openIndex === i;
            const panelId = `tech-panel-${i}`;
            const headerId = `tech-header-${i}`;
            return (
              <article
                key={cat.name}
                className={`premium-card overflow-hidden transition-colors duration-200 ${
                  isOpen ? "border-blue-300" : ""
                }`}
              >
                <button
                  id={headerId}
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  className="flex w-full items-center gap-4 p-5 text-left"
                >
                  <span
                    className={`flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-lg border transition-colors duration-200 ${
                      isOpen
                        ? "border-blue-200 bg-blue-50 text-blue-600"
                        : "border-slate-200 bg-white text-slate-500"
                    }`}
                  >
                    <Icon name={cat.icon} size={18} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-display text-base font-semibold text-slate-950">
                      {cat.name}
                    </h3>
                    <p className="mt-0.5 text-xs text-slate-500">
                      {cat.items.length}{" "}
                      {cat.items.length === 1 ? "položka" : "položek"}
                    </p>
                  </div>
                  <ChevronDown
                    size={20}
                    aria-hidden="true"
                    className={`flex-shrink-0 text-slate-400 transition-transform duration-200 ${
                      isOpen ? "rotate-180 text-blue-600" : ""
                    }`}
                  />
                </button>

                <div
                  id={panelId}
                  role="region"
                  aria-labelledby={headerId}
                  hidden={!isOpen}
                  className="border-t border-slate-200 px-5 pb-5 pt-4"
                >
                  {cat.description && (
                    <p className="text-sm leading-7 text-slate-600">
                      {cat.description}
                    </p>
                  )}
                  <ul className="mt-4 grid grid-cols-1 gap-2">
                    {cat.items.map((item) => (
                      <li
                        key={item.name}
                        className="flex items-center justify-between gap-3 rounded-lg border border-slate-200 bg-white px-4 py-3"
                      >
                        <span className="min-w-0 break-words font-display text-sm font-semibold text-slate-900">
                          {item.name}
                        </span>
                        {item.version && (
                          <span className="flex-shrink-0 whitespace-nowrap text-xs font-medium text-slate-400">
                            {item.version}
                          </span>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            );
          })}
        </div>

        {/* DESKTOP — rail + detail panel */}
        <div className="mt-14 hidden gap-8 lg:grid lg:grid-cols-12">
          <nav
            aria-label="Kategorie technologií"
            className="lg:col-span-4 lg:sticky lg:top-24 lg:self-start"
          >
            <ul ref={railRef} className="flex flex-col gap-1.5">
              {techCategories.map((cat, i) => {
                const isActive = i === activeIndex;
                return (
                  <li key={cat.name}>
                    <button
                      type="button"
                      data-tech-index={i}
                      onClick={() => setActiveIndex(i)}
                      aria-pressed={isActive}
                      className={`group flex w-full min-h-[44px] items-center gap-3 rounded-xl border px-4 py-3 text-left transition-all duration-200 ${
                        isActive
                          ? "border-blue-600 bg-white text-slate-950 shadow-sm ring-1 ring-blue-100"
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
                      <span className="font-display text-base font-semibold">
                        {cat.name}
                      </span>
                      <span
                        className={`ml-auto text-xs font-medium transition-opacity duration-200 ${
                          isActive
                            ? "text-blue-600 opacity-100"
                            : "text-slate-400 opacity-0 group-hover:opacity-100"
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

          <div className="lg:col-span-8">
            <article key={active.name} className="premium-card p-8">
              <div className="flex items-start gap-4">
                <div className="premium-icon-box flex h-12 w-12 items-center justify-center">
                  <Icon
                    name={active.icon}
                    size={22}
                    className="text-blue-600"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-display text-2xl font-semibold text-slate-950">
                    {active.name}
                  </h3>
                  {active.description && (
                    <p className="mt-2 text-base leading-7 text-slate-600">
                      {active.description}
                    </p>
                  )}
                </div>
              </div>

              <div className="mt-8 border-t border-slate-200 pt-8">
                <h4 className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">
                  Stack
                </h4>
                <ul className="mt-4 grid grid-cols-2 gap-2">
                  {active.items.map((item) => (
                    <li
                      key={item.name}
                      className="flex items-center justify-between gap-3 rounded-lg border border-slate-200 bg-white px-4 py-3 transition-colors duration-200 hover:border-blue-300 hover:bg-blue-50/50"
                    >
                      <span className="min-w-0 break-words font-display text-base font-semibold text-slate-900">
                        {item.name}
                      </span>
                      {item.version && (
                        <span className="flex-shrink-0 whitespace-nowrap text-sm font-medium text-slate-400">
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
