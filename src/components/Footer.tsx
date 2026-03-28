import Image from "next/image";
import Link from "next/link";
import { footerTags, navLinks } from "@/lib/site-content";

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

            <p className="mt-5 text-sm font-medium text-slate-400">
              {footerTags.join(" / ")}
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
                <i aria-hidden="true" className="fas fa-envelope text-sm text-blue-600" />
                info@cognera.cz
              </a>
              <a
                href="tel:+420777123456"
                className="flex items-center gap-3 text-base text-slate-600 transition-colors hover:text-blue-600"
              >
                <i aria-hidden="true" className="fas fa-phone text-sm text-blue-600" />
                +420 777 123 456
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-2 border-t border-slate-200 pt-6 text-xs text-slate-400 sm:mt-10 sm:flex-row sm:items-center sm:justify-between sm:text-sm">
          <p>&copy; {new Date().getFullYear()} Cognera. Všechna práva vyhrazena.</p>
          <p>Agentic Engineering — vývoj software s AI a seniorním dohledem.</p>
        </div>
      </div>
    </footer>
  );
}
