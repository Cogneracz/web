"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { navLinks } from "@/lib/site-content";
import { Phone, Menu, X } from "./Icon";

export default function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  const handleMobileLink = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
      e.preventDefault();
      setMobileMenuOpen(false);
      setTimeout(() => {
        const target = document.querySelector(href);
        target?.scrollIntoView({ behavior: "smooth" });
      }, 350);
    },
    []
  );

  return (
    <>
      <nav
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
          scrolled ? "glass-nav py-3" : "bg-transparent py-5"
        }`}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4">
            <Link href="#home" className="flex min-w-0 items-center gap-3">
              <Image
                src="/logo-128.png"
                alt="Cognera"
                width={40}
                height={40}
                priority
                className="rounded-xl"
              />
              <span className="font-display text-xl font-semibold tracking-tight text-slate-950">
                Cognera
              </span>
            </Link>

            <div className="hidden items-center gap-1 rounded-full border border-slate-200/80 bg-white/80 px-2 py-1.5 lg:flex">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="rounded-full px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50 hover:text-blue-600"
                >
                  {link.label}
                </Link>
              ))}
            </div>

            <div className="hidden items-center gap-3 lg:flex">
              <a
                href="tel:+420777123456"
                className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:text-blue-600"
              >
                <Phone size={14} className="text-blue-600" aria-hidden="true" />
                +420 777 123 456
              </a>
              <Link
                href="#contact"
                className="btn-primary inline-flex items-center gap-2 rounded-full bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white"
              >
                Kontaktujte nás
              </Link>
            </div>

            <button
              type="button"
              aria-label={mobileMenuOpen ? "Zavřít menu" : "Otevřít menu"}
              aria-expanded={mobileMenuOpen}
              onClick={() => setMobileMenuOpen((o) => !o)}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 transition-colors hover:text-blue-600 lg:hidden"
            >
              {mobileMenuOpen ? (
                <X size={16} aria-hidden="true" />
              ) : (
                <Menu size={16} aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </nav>

      <div
        className={`fixed inset-0 z-40 bg-slate-950/20 transition-opacity duration-300 lg:hidden ${
          mobileMenuOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={() => setMobileMenuOpen(false)}
      />

      <aside
        className={`fixed inset-y-0 right-0 z-50 w-full max-w-sm border-l border-slate-200 bg-white px-6 pb-8 pt-24 transition-transform duration-300 lg:hidden ${
          mobileMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="space-y-2">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={(e) => handleMobileLink(e, link.href)}
              className="block rounded-xl border border-slate-200 px-5 py-4 text-lg font-semibold text-slate-800 transition-colors hover:border-blue-300 hover:text-blue-600"
            >
              {link.label}
            </a>
          ))}
        </div>

        <div className="mt-8 space-y-3">
          <a
            href="tel:+420777123456"
            className="flex items-center gap-3 text-lg font-medium text-slate-700"
          >
            <Phone size={16} className="text-blue-600" aria-hidden="true" />
            +420 777 123 456
          </a>
          <a
            href="#contact"
            onClick={(e) => handleMobileLink(e, "#contact")}
            className="btn-primary mt-4 inline-flex w-full items-center justify-center rounded-full bg-blue-600 px-5 py-4 text-base font-semibold text-white"
          >
            Kontaktujte nás
          </a>
        </div>
      </aside>
    </>
  );
}
