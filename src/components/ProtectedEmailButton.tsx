"use client";

import type { ReactNode } from "react";
import { scrollToContactForm } from "@/lib/contact-target";

const EMAIL_PARTS = ["info", "@", "cognera", ".", "cz"] as const;

interface ProtectedEmailButtonProps {
  ariaLabel?: string;
  children: ReactNode;
  className?: string;
}

export function ProtectedEmailText() {
  return (
    <span aria-hidden="true">
      {EMAIL_PARTS.map((part, index) => (
        <span key={`${part}-${index}`}>{part}</span>
      ))}
    </span>
  );
}

export default function ProtectedEmailButton({
  ariaLabel = "Přejít na kontaktní formulář",
  children,
  className,
}: ProtectedEmailButtonProps) {
  return (
    <button
      type="button"
      aria-label={ariaLabel}
      className={className}
      onClick={() => scrollToContactForm()}
    >
      {children}
    </button>
  );
}
