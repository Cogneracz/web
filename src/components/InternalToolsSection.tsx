import Icon from "./Icon";
import { internalTools } from "@/lib/site-content";

export default function InternalToolsSection() {
  return (
    <section
      id="tools"
      className="section-animate relative overflow-hidden bg-gradient-to-b from-slate-50 via-blue-50/50 to-slate-50 px-4 py-16 sm:px-6 sm:py-24 lg:px-8 lg:py-28"
    >
      {/* Decorative blur orbs */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-32 top-10 h-80 w-80 rounded-full bg-blue-300/30 blur-3xl sm:h-96 sm:w-96"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-32 bottom-10 h-80 w-80 rounded-full bg-indigo-300/25 blur-3xl sm:h-96 sm:w-96"
      />

      <div className="relative mx-auto max-w-7xl">
        <div className="mx-auto max-w-3xl text-center">
          <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-white px-3.5 py-1.5 text-xs font-bold uppercase tracking-[0.16em] text-blue-600 shadow-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
            Vlastní AI stack
          </span>
          <h2 className="font-display text-2xl font-semibold text-slate-950 sm:text-4xl lg:text-5xl">
            Nástroje, které jsme{" "}
            <span className="text-blue-600">postavili pro sebe</span>.
          </h2>
          <p className="mt-3 text-sm leading-7 text-slate-600 sm:mt-5 sm:text-base lg:text-lg lg:leading-8">
            Neprodáváme buzzword „AI“. Stavíme si vlastní AI vývojářský stack —
            orchestraci agentů, spec-driven workflow a issue-to-PR pipeline.
            Na těchto nástrojích stavíme klientské projekty.
          </p>
        </div>

        <div className="mt-10 grid gap-4 sm:mt-14 sm:gap-6 lg:grid-cols-2">
          {internalTools.map((tool) => (
            <article
              key={tool.name}
              className="premium-card group relative overflow-hidden p-5 sm:p-7 lg:p-8"
            >
              <span
                aria-hidden="true"
                className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-transparent via-blue-500/70 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
              />
              <div className="flex items-start justify-between gap-4">
                <div className="premium-icon-box flex h-11 w-11 items-center justify-center bg-blue-50 text-blue-600 sm:h-12 sm:w-12">
                  <Icon name={tool.icon} size={20} className="text-blue-600" />
                </div>
                {tool.metric && (
                  <span className="rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
                    {tool.metric}
                  </span>
                )}
              </div>

              <div className="mt-5 sm:mt-6">
                <p className="section-kicker">{tool.tagline}</p>
                <h3 className="mt-2 font-display text-xl font-semibold text-slate-950 sm:text-2xl">
                  {tool.name}
                </h3>
                <p className="mt-3 text-sm leading-7 text-slate-600 sm:text-base">
                  {tool.description}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
