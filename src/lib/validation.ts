import { z } from "zod/v4";

function stripHtml(input: string): string {
  return input.replace(/<[^>]*>/g, "").replace(/<>/g, "");
}

function escapeSpecialChars(input: string): string {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function sanitizeText(input: string): string {
  return escapeSpecialChars(stripHtml(input.trim()));
}

export const contactFormSchema = z.object({
  name: z
    .string()
    .transform(sanitizeText)
    .pipe(
      z
        .string()
        .min(2, "Jméno musí mít alespoň 2 znaky")
        .max(100, "Jméno může mít maximálně 100 znaků")
    ),
  email: z.email("Zadejte platnou emailovou adresu"),
  phone: z
    .string()
    .optional()
    .transform((val) => (val ? val.trim() : undefined))
    .refine(
      (val) => {
        if (!val || val === "") return true;
        return /^\+?(420|421)\s?\d{3}\s?\d{3}\s?\d{3}$/.test(val);
      },
      {
        message:
          "Zadejte platné české nebo slovenské telefonní číslo (+420/+421)",
      }
    ),
  company: z
    .string()
    .optional()
    .transform((val) => {
      if (!val) return undefined;
      const sanitized = sanitizeText(val);
      return sanitized === "" ? undefined : sanitized;
    })
    .refine((val) => val === undefined || val.length <= 200, {
      message: "Název společnosti může mít maximálně 200 znaků",
    }),
  message: z
    .string()
    .transform(sanitizeText)
    .pipe(
      z
        .string()
        .min(10, "Zpráva musí mít alespoň 10 znaků")
        .max(2000, "Zpráva může mít maximálně 2000 znaků")
    ),
  gdprConsent: z.literal(true, {
    message: "Souhlas se zpracováním osobních údajů je povinný",
  }),
});

export type ContactFormData = z.infer<typeof contactFormSchema>;

const SPAM_KEYWORDS = [
  // English
  "viagra",
  "cialis",
  "casino",
  "lottery",
  "crypto",
  "bitcoin",
  "nft",
  "forex",
  "dating",
  "xxx",
  "porn",
  "pills",
  "pharmacy",
  "weight loss",
  "make money",
  "free money",
  "click here",
  "buy now",
  "seo services",
  "guest post",
  "link building",
  // Czech
  "výdělek",
  "vydelek",
  "výhra",
  "výherce",
  "loterie",
  "kredit zdarma",
  "rychlá půjčka",
  "rychla pujcka",
  "nebankovní půjčka",
  "seo služby",
  "seo sluzby",
  "levné seo",
  "nabídka zpětných odkazů",
  "zpětné odkazy",
  "zpetne odkazy",
  "ziskový projekt",
  "investiční příležitost",
  "obchodní nabídka zdarma",
  "pronájem webu",
  "propagace webu",
];

function countUrls(text: string): number {
  const urlPattern = /https?:\/\/|www\./gi;
  return (text.match(urlPattern) || []).length;
}

function detectSpamKeywords(text: string): boolean {
  const lower = text.toLowerCase();
  return SPAM_KEYWORDS.some((kw) => lower.includes(kw));
}

export function analyzeContent(message: string): {
  isSpam: boolean;
  reason?: string;
} {
  if (detectSpamKeywords(message)) {
    return { isSpam: true, reason: "spam_keywords" };
  }
  if (countUrls(message) > 3) {
    return { isSpam: true, reason: "too_many_urls" };
  }
  if (message.length > 20) {
    const upper = message.replace(/[^A-Z]/g, "").length;
    const alpha = message.replace(/[^a-zA-Z]/g, "").length;
    if (alpha > 0 && upper / alpha > 0.7) {
      return { isSpam: true, reason: "excessive_uppercase" };
    }
  }
  return { isSpam: false };
}
