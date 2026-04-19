import Image from "next/image";
import Link from "next/link";
import {
  Mail,
  Phone,
  Globe,
  MapPin,
  ArrowRight,
  CalendarCheck,
  LinkedinIcon,
} from "./Icon";
import ProtectedEmailButton, { ProtectedEmailText } from "./ProtectedEmailButton";

const navigationLinks = [
  { href: "#home", label: "Domů" },
  { href: "#services", label: "Služby" },
  { href: "#process", label: "Jak pracujeme" },
  { href: "#tech", label: "Technologie" },
  { href: "#projects", label: "Reference" },
  { href: "#contact", label: "Kontakt" },
];

const companyLinks = [
  {
    href: "https://www.linkedin.com/company/cognera-s-r-o/",
    label: "LinkedIn",
    external: true,
  },
  {
    href: "https://rejstrik-firem.kurzy.cz/23743514/cognera-sro/",
    label: "Obchodní rejstřík",
    external: true,
  },
  { href: "#process", label: "Agentic Engineering", external: false },
  { href: "#tech", label: "Technologický stack", external: false },
];

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-slate-200 bg-white py-14 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-10 sm:gap-12 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div>
            <div className="mb-6 flex items-center gap-3">
              <Image
                src="/logo-128.png"
                alt="Cognera"
                width={40}
                height={33}
                className="rounded-xl"
              />
              <span className="font-display text-xl font-semibold tracking-tight text-slate-950">
                Cognera
              </span>
            </div>
            <p className="mb-6 font-light leading-relaxed text-slate-500">
              Agentic Engineering Studio. Vyvíjíme enterprise software
              s AI agenty pod dohledem seniorních vývojářů a architektů.
            </p>
            <div className="flex items-center gap-3">
              <a
                href="https://www.linkedin.com/company/cognera-s-r-o/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn Cognera"
                className="flex h-11 w-11 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-slate-500 transition-all hover:border-blue-400 hover:bg-transparent hover:text-blue-600"
              >
                <LinkedinIcon size={16} />
              </a>
              <ProtectedEmailButton
                aria-label="Email"
                className="flex h-11 w-11 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-slate-500 transition-all hover:border-blue-400 hover:bg-transparent hover:text-blue-600"
              >
                <Mail size={16} aria-hidden="true" />
              </ProtectedEmailButton>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="font-display mb-6 text-lg font-bold text-slate-800">
              Navigace
            </h3>
            <ul className="space-y-3 font-light">
              {navigationLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="inline-flex w-max items-center text-slate-600 transition-colors hover:text-blue-600"
                  >
                    <ArrowRight
                      size={12}
                      className="mr-2 text-slate-300"
                      aria-hidden="true"
                    />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-display mb-6 text-lg font-bold text-slate-800">
              Společnost
            </h3>
            <ul className="space-y-3 font-light">
              {companyLinks.map((link) => (
                <li key={link.href}>
                  {link.external ? (
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex w-max items-center text-slate-600 transition-colors hover:text-blue-600"
                    >
                      <ArrowRight
                        size={12}
                        className="mr-2 text-slate-300"
                        aria-hidden="true"
                      />
                      {link.label}
                    </a>
                  ) : (
                    <Link
                      href={link.href}
                      className="inline-flex w-max items-center text-slate-600 transition-colors hover:text-blue-600"
                    >
                      <ArrowRight
                        size={12}
                        className="mr-2 text-slate-300"
                        aria-hidden="true"
                      />
                      {link.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-display mb-6 text-lg font-bold text-slate-800">
              Kontakt
            </h3>
            <ul className="space-y-4 font-light text-slate-600">
              <li className="flex items-center">
                <div className="mr-3 flex h-8 w-8 items-center justify-center rounded-full border border-slate-200">
                  <Phone size={14} className="text-blue-600" aria-hidden="true" />
                </div>
                <a
                  href="tel:+420607204423"
                  className="transition-colors hover:text-blue-600"
                >
                  +420 607 204 423
                </a>
              </li>
              <li className="flex items-center">
                <div className="mr-3 flex h-8 w-8 items-center justify-center rounded-full border border-slate-200">
                  <Mail size={14} className="text-blue-600" aria-hidden="true" />
                </div>
                <ProtectedEmailButton
                  className="inline-flex min-h-6 items-center transition-colors hover:text-blue-600"
                >
                  <ProtectedEmailText />
                </ProtectedEmailButton>
              </li>
              <li className="flex items-center">
                <div className="mr-3 flex h-8 w-8 items-center justify-center rounded-full border border-slate-200">
                  <Globe size={14} className="text-indigo-500" aria-hidden="true" />
                </div>
                <a
                  href="https://www.cognera.cz"
                  className="transition-colors hover:text-indigo-600"
                >
                  www.cognera.cz
                </a>
              </li>
              <li className="flex items-start">
                <div className="mr-3 mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-50">
                  <MapPin size={14} className="text-blue-600" aria-hidden="true" />
                </div>
                <div>
                  <span className="block text-slate-700">Cognera s.r.o.</span>
                  <span className="block text-sm text-slate-500">
                    Panská 571, 391 55 Chýnov
                  </span>
                  <span className="block text-sm text-slate-500">
                    IČO: 23743514 · DIČ: CZ23743514
                  </span>
                </div>
              </li>
            </ul>

            <Link
              href="#contact"
              className="btn-primary mt-6 inline-flex items-center rounded-full border-2 border-blue-600 px-6 py-3 text-sm font-semibold text-blue-600 transition-colors hover:bg-blue-600 hover:text-white"
            >
              <CalendarCheck size={14} className="mr-2" aria-hidden="true" />
              Probrat projekt
            </Link>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-slate-100 pt-8 text-sm md:flex-row">
          <p className="font-light text-slate-500">
            &copy; {currentYear} Cognera s.r.o. Všechna práva vyhrazena.
          </p>
          <p className="text-slate-500">
            Agentic Engineering — vývoj software s AI a seniorním dohledem.
          </p>
        </div>
      </div>
    </footer>
  );
}
