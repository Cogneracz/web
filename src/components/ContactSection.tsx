import SectionIntro from "./SectionIntro";
import ContactForm from "./ContactForm";
import Icon from "./Icon";
import { Check } from "./Icon";
import { contactChannels } from "@/lib/site-content";

export default function ContactSection() {
  return (
    <section id="contact" className="section-animate bg-[#f8fafc] px-4 py-16 sm:px-6 sm:py-24 lg:px-8 lg:py-28">
      <div className="mx-auto max-w-7xl">
        <SectionIntro
          eyebrow="Kontakt"
          title={
            <>
              Máte projekt?{" "}
              <span className="text-blue-600">Pojďme ho probrat.</span>
            </>
          }
          description="Stačí krátký kontext — co řešíte, jaký systém potřebujete, co už existuje. Na základě toho navrhneme další postup."
        />

        <div className="mt-10 grid gap-8 sm:mt-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] lg:gap-12">
          <div>
            <div className="space-y-3">
              {contactChannels.map((channel) => (
                <a
                  key={channel.label}
                  href={channel.href}
                  className="premium-card flex items-center gap-4 p-4 sm:p-5"
                >
                  <div className="premium-icon-box flex h-11 w-11 shrink-0 items-center justify-center text-blue-600 sm:h-12 sm:w-12">
                    <Icon name={channel.icon} size={20} className="text-blue-600" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-semibold uppercase tracking-widest text-slate-400 sm:text-sm">
                      {channel.label}
                    </div>
                    <div className="mt-1 truncate text-base font-semibold text-slate-950 sm:text-lg">
                      {channel.value}
                    </div>
                  </div>
                </a>
              ))}
            </div>

            <div className="mt-6 premium-card p-5 sm:p-6">
              <h3 className="font-display text-lg font-semibold text-slate-950">
                Co obvykle řešíme
              </h3>
              <ul className="mt-3 space-y-2 text-sm leading-7 text-slate-600">
                <li className="flex gap-2.5">
                  <Check size={12} className="mt-1.5 shrink-0 text-blue-600" aria-hidden="true" />
                  Nový CRM, ERP nebo interní informační systém
                </li>
                <li className="flex gap-2.5">
                  <Check size={12} className="mt-1.5 shrink-0 text-blue-600" aria-hidden="true" />
                  AI vrstva nad dokumenty nebo zákaznickými daty
                </li>
                <li className="flex gap-2.5">
                  <Check size={12} className="mt-1.5 shrink-0 text-blue-600" aria-hidden="true" />
                  Převzetí projektu a stabilizace architektury
                </li>
                <li className="flex gap-2.5">
                  <Check size={12} className="mt-1.5 shrink-0 text-blue-600" aria-hidden="true" />
                  Integrace s českými systémy (ARES, ISDS, ISDOC)
                </li>
              </ul>
            </div>
          </div>

          <div className="premium-card p-5 sm:p-7 lg:p-8">
            <h3 className="mb-6 font-display text-xl font-semibold text-slate-950 sm:text-2xl">
              Napište nám
            </h3>
            <ContactForm />
          </div>
        </div>
      </div>
    </section>
  );
}
