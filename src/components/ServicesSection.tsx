import SectionIntro from "./SectionIntro";
import Icon from "./Icon";
import { serviceCards } from "@/lib/site-content";

export default function ServicesSection() {
  return (
    <section id="services" className="section-animate bg-[#f8fafc] px-4 py-16 sm:px-6 sm:py-24 lg:px-8 lg:py-28">
      <div className="mx-auto max-w-7xl">
        <SectionIntro
          eyebrow="Služby"
          title={
            <>
              Software, který má jasné místo v{" "}
              <span className="text-blue-600">provozu firmy</span>.
            </>
          }
          description="Od enterprise systémů po AI integrace. Každý projekt řídí seniorní tým, který odpovídá za architekturu, code review a dlouhodobou udržitelnost."
        />

        <div className="mt-10 grid gap-4 sm:mt-14 sm:grid-cols-2 sm:gap-6">
          {serviceCards.map((service, index) => (
            <article key={service.title} className="premium-card p-5 sm:p-7 lg:p-8">
              <div className="flex items-start justify-between gap-4">
                <div className="premium-icon-box flex h-11 w-11 items-center justify-center text-blue-600 sm:h-12 sm:w-12">
                  <Icon name={service.icon} size={20} className="text-blue-600" />
                </div>
                <span className="text-sm font-semibold tracking-widest text-slate-300">
                  0{index + 1}
                </span>
              </div>

              <h3 className="mt-4 font-display text-xl font-semibold text-slate-950 sm:mt-6 sm:text-2xl">
                {service.title}
              </h3>
              <p className="mt-2 text-sm leading-7 text-slate-600 sm:mt-3 sm:text-base">
                {service.description}
              </p>

              <p className="mt-4 text-sm font-medium text-slate-400 sm:mt-6">
                {service.tags.join(" / ")}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
