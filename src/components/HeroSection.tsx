import { heroStats } from "@/lib/site-content";

export default function HeroSection() {
  return (
    <section
      id="home"
      className="relative overflow-hidden bg-white px-4 pb-16 pt-28 sm:px-6 sm:pb-24 sm:pt-36 lg:px-8 lg:pb-28 lg:pt-40"
    >
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-4xl text-center">
          <p className="hero-fade-in section-kicker mb-4 sm:mb-6">
            Agentic Engineering Studio
          </p>

          <h1 className="hero-fade-in-delayed font-display text-[2rem] font-semibold leading-[1.12] tracking-[-0.03em] text-slate-950 sm:text-5xl sm:leading-[1.08] lg:text-6xl xl:text-7xl">
            Vyvíjíme software s&nbsp;AI&nbsp;agenty.{" "}
            <span className="text-blue-600">
              Pod dohledem seniorních vývojářů.
            </span>
          </h1>

          <p className="hero-fade-in-more-delayed mx-auto mt-5 max-w-2xl text-base leading-7 text-slate-600 sm:mt-8 sm:text-lg sm:leading-8">
            Stavíme enterprise systémy novou cestou. AI agenti pokrývají rutinní
            vývoj, seniorní vývojáři řídí architekturu, kvalitu a bezpečnost.
            Výsledek — rychlejší dodávka bez kompromisů.
          </p>

          <div className="hero-fade-in-more-delayed mt-8 flex flex-col gap-3 sm:mt-10 sm:flex-row sm:items-center sm:justify-center sm:gap-4">
            <a
              href="#contact"
              className="btn-primary inline-flex w-full items-center justify-center gap-2 rounded-full bg-blue-600 px-8 py-4 text-base font-semibold text-white sm:w-auto"
            >
              <i aria-hidden="true" className="fas fa-calendar-check text-sm" />
              Probrat projekt
            </a>
            <a
              href="#process"
              className="btn-secondary inline-flex w-full items-center justify-center gap-2 rounded-full border border-slate-300 bg-white px-8 py-4 text-base font-semibold text-slate-700 sm:w-auto"
            >
              <i aria-hidden="true" className="fas fa-arrow-down text-sm" />
              Jak pracujeme
            </a>
          </div>
        </div>

        <div className="hero-fade-in-more-delayed mx-auto mt-10 grid max-w-3xl grid-cols-3 gap-4 border-t border-slate-200 pt-8 sm:mt-16 sm:gap-8 sm:pt-10">
          {heroStats.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="font-display text-2xl font-semibold tabular-nums text-slate-950 sm:text-3xl lg:text-4xl">
                {stat.value}
              </div>
              <div className="mt-1 text-xs text-slate-500 sm:mt-2 sm:text-sm">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
