import { heroStats } from "@/lib/site-content";
import { CalendarCheck, ArrowDown } from "./Icon";
import RotatingText from "./RotatingText";
import ParticleMorph from "./ParticleMorph";

export default function HeroSection() {
  return (
    <section
      id="home"
      className="relative overflow-hidden bg-white px-4 pb-16 pt-28 sm:px-6 sm:pb-24 sm:pt-36 lg:px-8 lg:pb-28 lg:pt-40"
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-50/60 via-white to-white" />
        <div className="absolute -right-32 top-0 h-[26rem] w-[26rem] rounded-full bg-blue-300/20 blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-2 lg:gap-16">
        {/* LEFT — copy (our style) */}
        <div className="text-center lg:text-left">
          <p className="hero-fade-in section-kicker mb-4 sm:mb-6">
            Agentic Engineering Studio
          </p>

          <h1 className="hero-fade-in-delayed font-display text-[2rem] font-semibold leading-[1.12] tracking-[-0.03em] text-slate-950 sm:text-5xl sm:leading-[1.08] lg:text-6xl">
            Vyvíjíme software s&nbsp;AI&nbsp;agenty.
          </h1>

          <div className="hero-fade-in-delayed mt-2 sm:mt-3">
            <RotatingText
              className="font-display text-2xl font-semibold tracking-[-0.02em] text-blue-600 sm:text-3xl lg:text-4xl"
              justifyClass="justify-center lg:justify-start"
              words={[
                "Pod dohledem seniorů.",
                "Architektura pod kontrolou.",
                "Rychleji, bez kompromisů.",
              ]}
            />
          </div>

          <p className="hero-fade-in-more-delayed mx-auto mt-5 max-w-xl text-base leading-7 text-slate-600 sm:mt-7 sm:text-lg sm:leading-8 lg:mx-0">
            AI agenti píší kód, senioři řídí architekturu a kvalitu. Rychlejší
            dodávka bez kompromisů.
          </p>

          <div className="hero-fade-in-more-delayed mt-8 flex flex-col gap-3 sm:mt-10 sm:flex-row sm:items-center sm:justify-center sm:gap-4 lg:justify-start">
            <a
              href="#contact"
              className="btn-primary inline-flex w-full items-center justify-center gap-2 rounded-full bg-blue-600 px-8 py-4 text-base font-semibold text-white sm:w-auto"
            >
              <CalendarCheck size={16} aria-hidden="true" />
              Probrat projekt
            </a>
            <a
              href="#process"
              className="btn-secondary inline-flex w-full items-center justify-center gap-2 rounded-full border border-slate-300 bg-white px-8 py-4 text-base font-semibold text-slate-700 sm:w-auto"
            >
              <ArrowDown size={16} aria-hidden="true" />
              Jak pracujeme
            </a>
          </div>

          <div className="hero-fade-in-more-delayed mt-10 flex flex-wrap justify-center gap-x-10 gap-y-6 border-t border-slate-200 pt-8 sm:mt-12 lg:justify-start">
            {heroStats.map((stat) => (
              <div key={stat.label} className="text-center lg:text-left">
                <div className="font-display text-3xl font-semibold tabular-nums text-slate-950 sm:text-4xl">
                  {stat.value}
                </div>
                <div className="mt-1 text-xs text-slate-500 sm:text-sm">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT — custom particle-morph scene (self-hosted, seamless on white) */}
        <ParticleMorph className="hero-cards-fade-in relative h-[340px] w-full sm:h-[440px] lg:h-[580px]" />
      </div>
    </section>
  );
}
