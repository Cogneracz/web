import SectionIntro from "./SectionIntro";
import { processSteps } from "@/lib/site-content";

export default function ProcessSection() {
  return (
    <section id="process" className="section-animate bg-white px-4 py-16 sm:px-6 sm:py-24 lg:px-8 lg:py-28">
      <div className="mx-auto max-w-7xl">
        <SectionIntro
          eyebrow="Jak pracujeme"
          title={
            <>
              <span className="text-blue-600">Agentic Engineering</span>{" "}v&nbsp;praxi
            </>
          }
          description="Nejsme běžný dev tým ani AI startup. Kombinujeme obojí — systematicky, s jasnou odpovědností a důrazem na kvalitu výsledku."
        />

        <div className="mt-10 grid gap-4 sm:mt-14 sm:gap-6 lg:grid-cols-3">
          {processSteps.map((step) => (
            <article key={step.number} className="premium-card p-5 sm:p-7 lg:p-8">
              <div className="flex items-center gap-4">
                <div className="premium-icon-box flex h-11 w-11 items-center justify-center text-blue-600 sm:h-12 sm:w-12">
                  <i aria-hidden="true" className={`fas ${step.icon} text-base sm:text-lg`} />
                </div>
                <span className="font-display text-3xl font-semibold text-slate-200 sm:text-4xl">
                  {step.number}
                </span>
              </div>

              <h3 className="mt-4 font-display text-xl font-semibold text-slate-950 sm:mt-6 sm:text-2xl">
                {step.title}
              </h3>
              <p className="mt-2 text-sm leading-7 text-slate-600 sm:mt-3 sm:text-base">
                {step.description}
              </p>
            </article>
          ))}
        </div>

        <div className="mt-8 rounded-xl border border-blue-100 bg-blue-50/60 p-5 sm:mt-12 sm:rounded-2xl sm:p-8">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm leading-7 font-medium text-slate-700 sm:text-lg sm:leading-8">
              <span className="font-semibold text-blue-700">Agentic Engineering</span>{" "}
              = vývoj software s AI agenty pod dohledem seniorních vývojářů.
              AI generuje kód a testy, senioři řídí architekturu, dělají code review
              a garantují kvalitu. Rychlejší dodávka, konzistentní výstup.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
