import Image from "next/image";
import Link from "next/link";
import { navLinks } from "@/lib/site-content";
import { Mail, Phone, LinkedinIcon } from "./Icon";

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 px-4 py-10 sm:px-6 sm:py-14 lg:px-8 lg:py-16">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-8 sm:gap-10 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.6fr)_minmax(0,0.8fr)]">
          <div>
            <div className="flex items-center gap-3">
              <Image src="/logo-128.png" alt="Cognera" width={36} height={36} className="rounded-xl" />
              <span className="font-display text-xl font-semibold tracking-tight text-slate-950">
                Cognera
              </span>
            </div>

            <p className="mt-4 max-w-md text-base leading-7 text-slate-600">
              Agentic Engineering Studio. Vyvíjíme enterprise software
              s AI agenty pod dohledem seniorních vývojářů.
            </p>
          </div>

          <div>
            <h2 className="text-sm font-semibold uppercase tracking-widest text-slate-400">
              Navigace
            </h2>
            <ul className="mt-4 space-y-3">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-base font-medium text-slate-600 transition-colors hover:text-blue-600"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="text-sm font-semibold uppercase tracking-widest text-slate-400">
              Kontakt
            </h2>
            <div className="mt-4 space-y-3">
              <a
                href="mailto:info@cognera.cz"
                className="flex items-center gap-3 text-base text-slate-600 transition-colors hover:text-blue-600"
              >
                <Mail size={16} className="text-blue-600" aria-hidden="true" />
                info@cognera.cz
              </a>
              <a
                href="tel:+420777123456"
                className="flex items-center gap-3 text-base text-slate-600 transition-colors hover:text-blue-600"
              >
                <Phone size={16} className="text-blue-600" aria-hidden="true" />
                +420 777 123 456
              </a>
              <div className="flex items-center gap-2 pt-1">
                <a
                  href="https://www.linkedin.com/company/cognera-s-r-o/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn Cognera"
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition-colors hover:border-blue-300 hover:bg-blue-50 hover:text-blue-600"
                >
                  <LinkedinIcon size={16} />
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 grid gap-4 border-t border-slate-200 pt-6 text-sm text-slate-500 sm:mt-12 sm:grid-cols-3">
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-slate-400">
              Sídlo
            </h3>
            <address className="mt-2 not-italic leading-6">
              Cognera s.r.o.
              <br />
              Panská 571
              <br />
              391 55 Chýnov
            </address>
          </div>
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-slate-400">
              Fakturační údaje
            </h3>
            <p className="mt-2 leading-6">
              IČO: 23743514
              <br />
              DIČ: CZ23743514
            </p>
          </div>
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-slate-400">
              Jednatel
            </h3>
            <p className="mt-2 leading-6">
              Jiří Studnička
              <br />
              <a
                href="https://rejstrik-firem.kurzy.cz/23743514/cognera-sro/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-500 underline decoration-slate-300 underline-offset-2 transition-colors hover:text-blue-600 hover:decoration-blue-400"
              >
                Obchodní rejstřík
              </a>
            </p>
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-2 border-t border-slate-200 pt-6 text-xs text-slate-400 sm:flex-row sm:items-center sm:justify-between sm:text-sm">
          <p>&copy; {new Date().getFullYear()} Cognera s.r.o. Všechna práva vyhrazena.</p>
          <p>Agentic Engineering — vývoj software s AI a seniorním dohledem.</p>
        </div>
      </div>
    </footer>
  );
}
