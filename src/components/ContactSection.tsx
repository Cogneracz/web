import SectionIntro from "./SectionIntro";
import { contactChannels } from "@/lib/site-content";

export default function ContactSection() {
  return (
    <section id="contact" className="section-animate bg-white px-4 py-16 sm:px-6 sm:py-24 lg:px-8 lg:py-28">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-16">
          <div>
            <SectionIntro
              eyebrow="Kontakt"
              align="left"
              title={
                <>
                  Máte projekt?{" "}
                  <span className="text-blue-600">Pojďme ho probrat.</span>
                </>
              }
              description="Stačí krátký kontext — co řešíte, jaký systém potřebujete, co už existuje. Na základě toho navrhneme další postup."
            />

            <div className="mt-8 space-y-3 sm:mt-10 sm:space-y-4">
              {contactChannels.map((channel) => (
                <a
                  key={channel.label}
                  href={channel.href}
                  className="premium-card flex items-center gap-4 p-4 sm:p-6"
                >
                  <div className="premium-icon-box flex h-11 w-11 shrink-0 items-center justify-center text-blue-600 sm:h-12 sm:w-12">
                    <i aria-hidden="true" className={`fas ${channel.icon}`} />
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
          </div>

          <div className="premium-card p-5 sm:p-7 lg:p-10">
            <h3 className="font-display text-xl font-semibold text-slate-950 sm:text-2xl lg:text-3xl">
              Co obvykle řešíme
            </h3>
            <ul className="mt-4 space-y-3 text-sm leading-7 text-slate-600 sm:mt-6 sm:space-y-4 sm:text-base">
              <li className="flex gap-3">
                <i aria-hidden="true" className="fas fa-check mt-1.5 text-xs text-blue-600 sm:text-sm" />
                Nový CRM, ERP nebo interní informační systém
              </li>
              <li className="flex gap-3">
                <i aria-hidden="true" className="fas fa-check mt-1.5 text-xs text-blue-600 sm:text-sm" />
                AI vrstva nad dokumenty, procesy nebo zákaznickými daty
              </li>
              <li className="flex gap-3">
                <i aria-hidden="true" className="fas fa-check mt-1.5 text-xs text-blue-600 sm:text-sm" />
                Převzetí rozpracovaného projektu a stabilizace architektury
              </li>
              <li className="flex gap-3">
                <i aria-hidden="true" className="fas fa-check mt-1.5 text-xs text-blue-600 sm:text-sm" />
                E-shop nebo B2B portál napojený na provoz firmy
              </li>
            </ul>

            <div className="mt-6 flex flex-col gap-3 sm:mt-8 sm:flex-row">
              <a
                href="mailto:info@cognera.cz"
                className="btn-primary inline-flex w-full items-center justify-center gap-2 rounded-full bg-blue-600 px-7 py-4 text-base font-semibold text-white sm:w-auto"
              >
                <i aria-hidden="true" className="fas fa-envelope text-sm" />
                Napsat email
              </a>
              <a
                href="tel:+420777123456"
                className="btn-secondary inline-flex w-full items-center justify-center gap-2 rounded-full border border-slate-300 bg-white px-7 py-4 text-base font-semibold text-slate-700 sm:w-auto"
              >
                <i aria-hidden="true" className="fas fa-phone text-sm" />
                Zavolat
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
