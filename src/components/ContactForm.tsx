"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import { Check, Send, Loader2 } from "./Icon";

type CountryKey = "cz" | "sk";

function Flag({ emoji, className }: { emoji: string; className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={className}
      style={{
        fontFamily:
          '"Apple Color Emoji","Segoe UI Emoji","Noto Color Emoji","Twemoji Mozilla",sans-serif',
        lineHeight: 1,
      }}
    >
      {emoji}
    </span>
  );
}

const COUNTRIES: Record<CountryKey, { code: string; label: string; emoji: string }> = {
  cz: { code: "+420", label: "Česká republika", emoji: "🇨🇿" },
  sk: { code: "+421", label: "Slovensko", emoji: "🇸🇰" },
};

interface FormState {
  name: string;
  email: string;
  phone: string;
  company: string;
  message: string;
  gdprConsent: boolean;
}

interface SecurityTokens {
  csrfToken: string;
  jsToken: string;
  honeypotName: string;
}

const INITIAL_STATE: FormState = {
  name: "",
  email: "",
  phone: "",
  company: "",
  message: "",
  gdprConsent: false,
};

export default function ContactForm() {
  const [form, setForm] = useState<FormState>(INITIAL_STATE);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [tokens, setTokens] = useState<SecurityTokens | null>(null);
  const [altchaPayload, setAltchaPayload] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [country, setCountry] = useState<CountryKey>("cz");
  const [countryOpen, setCountryOpen] = useState(false);
  const countryBoxRef = useRef<HTMLDivElement>(null);
  const altchaRef = useRef<HTMLElement>(null);

  // Close country dropdown on outside click / Escape
  useEffect(() => {
    if (!countryOpen) return;
    const onDown = (e: MouseEvent) => {
      if (!countryBoxRef.current?.contains(e.target as Node)) {
        setCountryOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setCountryOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [countryOpen]);

  // Load ALTCHA widget
  useEffect(() => {
    import("altcha").catch(console.error);
  }, []);

  // Fetch security tokens
  const fetchTokens = useCallback(async () => {
    try {
      const res = await fetch("/api/security-tokens");
      if (res.ok) setTokens(await res.json());
    } catch (e) {
      console.error("Failed to fetch security tokens", e);
    }
  }, []);

  useEffect(() => {
    fetchTokens();
  }, [fetchTokens]);

  // Listen for ALTCHA state changes
  useEffect(() => {
    const widget = altchaRef.current;
    if (!widget) return;

    const handler = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (detail?.state === "verified" && detail?.payload) {
        setAltchaPayload(detail.payload);
      }
    };
    widget.addEventListener("statechange", handler);
    return () => widget.removeEventListener("statechange", handler);
  }, []);

  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    if (form.name.trim().length < 2)
      errs.name = "Jméno musí mít alespoň 2 znaky";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      errs.email = "Zadejte platnou emailovou adresu";
    if (form.phone && !/^\d{3}\s?\d{3}\s?\d{3}$/.test(form.phone.trim()))
      errs.phone = "Zadejte 9 číslic bez předvolby";
    if (form.message.trim().length < 10)
      errs.message = "Zpráva musí mít alespoň 10 znaků";
    if (!form.gdprConsent) errs.gdprConsent = "Souhlas je povinný";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);

    if (!validate()) return;
    if (!altchaPayload) {
      setServerError("Dokončete ověření proti robotům.");
      return;
    }
    if (!tokens) {
      setServerError("Chyba bezpečnostních tokenů. Obnovte stránku.");
      return;
    }

    setSubmitting(true);
    try {
      const phoneCombined = form.phone.trim()
        ? `${COUNTRIES[country].code} ${form.phone.trim()}`
        : "";
      const payload: Record<string, unknown> = {
        ...form,
        phone: phoneCombined,
        csrfToken: tokens.csrfToken,
        jsToken: tokens.jsToken,
        honeypotName: tokens.honeypotName,
        altchaPayload,
      };
      // Set honeypot field to empty (bots would fill it)
      payload[tokens.honeypotName] = "";

      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok || data.success) {
        setSubmitted(true);
      } else {
        setServerError(data.error || "Odeslání se nezdařilo.");
        await fetchTokens(); // Refresh tokens on failure
      }
    } catch {
      setServerError("Chyba připojení. Zkuste to znovu.");
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="premium-card p-6 text-center sm:p-10">
        <div className="premium-icon-box mx-auto flex h-14 w-14 items-center justify-center text-green-600">
          <Check size={28} aria-hidden="true" />
        </div>
        <h3 className="mt-5 font-display text-2xl font-semibold text-slate-950">
          Zpráva odeslána
        </h3>
        <p className="mt-3 text-base text-slate-600">
          Děkujeme za zájem. Ozveme se vám co nejdříve.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label
            htmlFor="cf-name"
            className="mb-1.5 block text-sm font-medium text-slate-700"
          >
            Jméno *
          </label>
          <input
            id="cf-name"
            type="text"
            autoComplete="name"
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            className={`form-input ${errors.name ? "form-input-error" : ""}`}
            placeholder="Jan Novák"
          />
          {errors.name && (
            <p className="mt-1 text-xs text-red-500">{errors.name}</p>
          )}
        </div>
        <div>
          <label
            htmlFor="cf-email"
            className="mb-1.5 block text-sm font-medium text-slate-700"
          >
            Email *
          </label>
          <input
            id="cf-email"
            type="email"
            autoComplete="email"
            inputMode="email"
            value={form.email}
            onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
            className={`form-input ${errors.email ? "form-input-error" : ""}`}
            placeholder="jan@firma.cz"
          />
          {errors.email && (
            <p className="mt-1 text-xs text-red-500">{errors.email}</p>
          )}
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div ref={countryBoxRef} className="relative">
          <label
            htmlFor="cf-phone"
            className="mb-1.5 block text-sm font-medium text-slate-700"
          >
            Telefon
          </label>
          <div
            className={`flex items-stretch rounded-xl border bg-white transition-colors focus-within:border-blue-600 ${
              errors.phone ? "border-red-400" : "border-slate-200"
            }`}
          >
            <button
              type="button"
              onClick={() => setCountryOpen((o) => !o)}
              aria-haspopup="listbox"
              aria-expanded={countryOpen}
              aria-label={`Předvolba ${COUNTRIES[country].code}, ${COUNTRIES[country].label}`}
              className="flex items-center gap-2 rounded-l-xl border-r border-slate-200 px-3 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
            >
              <Flag
                emoji={COUNTRIES[country].emoji}
                className="text-base leading-none"
              />

              <span className="tabular-nums">{COUNTRIES[country].code}</span>
              <ChevronDown
                size={14}
                aria-hidden="true"
                className={`text-slate-400 transition-transform duration-200 ${
                  countryOpen ? "rotate-180" : ""
                }`}
              />
            </button>
            <input
              id="cf-phone"
              type="tel"
              autoComplete="tel-national"
              inputMode="tel"
              value={form.phone}
              onChange={(e) =>
                setForm((f) => ({ ...f, phone: e.target.value }))
              }
              placeholder="607 204 423"
              style={{ fontSize: "max(16px, 1rem)" }}
              className="min-w-0 flex-1 rounded-r-xl bg-transparent px-4 py-3 text-slate-900 outline-none placeholder:text-slate-400"
            />
          </div>
          {countryOpen && (
            <ul
              role="listbox"
              aria-label="Zvolte zemi"
              className="absolute left-0 top-full z-20 mt-2 w-[min(18rem,100%)] overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg"
            >
              {(Object.keys(COUNTRIES) as CountryKey[]).map((key) => {
                const { code, label, emoji } = COUNTRIES[key];
                const isSelected = country === key;
                return (
                  <li key={key}>
                    <button
                      type="button"
                      role="option"
                      aria-selected={isSelected}
                      onClick={() => {
                        setCountry(key);
                        setCountryOpen(false);
                      }}
                      className={`flex w-full items-center gap-3 px-4 py-3 text-left text-sm transition-colors hover:bg-slate-50 ${
                        isSelected ? "bg-blue-50/60 text-slate-950" : "text-slate-700"
                      }`}
                    >
                      <Flag emoji={emoji} className="text-lg leading-none" />
                      <span className="flex-1 font-medium">{label}</span>
                      <span className="tabular-nums text-slate-500">{code}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
          {errors.phone && (
            <p className="mt-1 text-xs text-red-500">{errors.phone}</p>
          )}
        </div>
        <div>
          <label
            htmlFor="cf-company"
            className="mb-1.5 block text-sm font-medium text-slate-700"
          >
            Společnost
          </label>
          <input
            id="cf-company"
            type="text"
            autoComplete="organization"
            value={form.company}
            onChange={(e) =>
              setForm((f) => ({ ...f, company: e.target.value }))
            }
            className="form-input"
            placeholder="Název společnosti"
          />
        </div>
      </div>

      <div>
        <label
          htmlFor="cf-message"
          className="mb-1.5 block text-sm font-medium text-slate-700"
        >
          Zpráva *
        </label>
        <textarea
          id="cf-message"
          rows={4}
          value={form.message}
          onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
          className={`form-input resize-none ${errors.message ? "form-input-error" : ""}`}
          placeholder="Popište váš projekt nebo dotaz..."
        />
        {errors.message && (
          <p className="mt-1 text-xs text-red-500">{errors.message}</p>
        )}
      </div>

      {/* Honeypot — invisible to users */}
      {tokens?.honeypotName && (
        <div
          aria-hidden="true"
          style={{ position: "absolute", left: "-9999px" }}
        >
          <input
            type="text"
            name={tokens.honeypotName}
            tabIndex={-1}
            autoComplete="off"
          />
        </div>
      )}

      <div className="rounded-xl border border-slate-200 p-3">
        <altcha-widget
          ref={altchaRef}
          challengeurl="/api/altcha"
          hidelogo
          hidefooter
          strings={JSON.stringify({
            label: "Nejsem robot",
            verifying: "Ověřuji…",
            verified: "Ověřeno",
            error: "Ověření selhalo",
            expired: "Ověření vypršelo",
            footer: "Chráněno pomocí ALTCHA",
          })}
        />
      </div>

      <div className="flex items-start gap-3">
        <input
          id="cf-gdpr"
          type="checkbox"
          checked={form.gdprConsent}
          onChange={(e) =>
            setForm((f) => ({ ...f, gdprConsent: e.target.checked }))
          }
          className="mt-1 h-4 w-4 rounded border-slate-300 text-blue-600"
        />
        <label htmlFor="cf-gdpr" className="text-sm text-slate-600">
          Souhlasím se zpracováním osobních údajů za účelem odpovědi na můj
          dotaz. *
        </label>
      </div>
      {errors.gdprConsent && (
        <p className="-mt-3 text-xs text-red-500">{errors.gdprConsent}</p>
      )}

      {serverError && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {serverError}
        </div>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="btn-primary w-full rounded-full bg-blue-600 px-8 py-4 text-base font-semibold text-white disabled:opacity-50"
      >
        {submitting ? (
          <span className="inline-flex items-center gap-2">
            <Loader2 size={16} className="animate-spin" aria-hidden="true" />
            Odesílám...
          </span>
        ) : (
          <span className="inline-flex items-center gap-2">
            <Send size={16} aria-hidden="true" />
            Odeslat zprávu
          </span>
        )}
      </button>
    </form>
  );
}
