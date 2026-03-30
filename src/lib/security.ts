import crypto from "crypto";

const CSRF_SECRET = process.env.CSRF_SECRET || "dev-csrf-secret";
const JS_TOKEN_SECRET = process.env.JS_TOKEN_SECRET || "dev-js-token-secret";
const CSRF_TTL = 30 * 60 * 1000; // 30 minutes

// ---------- CSRF ----------

export function generateCsrfToken(): string {
  const timestamp = Date.now().toString();
  const random = crypto.randomBytes(16).toString("hex");
  const payload = `${timestamp}.${random}`;
  const signature = crypto
    .createHmac("sha256", CSRF_SECRET)
    .update(payload)
    .digest("hex");
  return `${payload}.${signature}`;
}

export function validateCsrfToken(token: string): boolean {
  const parts = token.split(".");
  if (parts.length !== 3) return false;

  const [timestamp, random, signature] = parts;
  const payload = `${timestamp}.${random}`;
  const expectedSig = crypto
    .createHmac("sha256", CSRF_SECRET)
    .update(payload)
    .digest("hex");

  if (
    !crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSig))
  ) {
    return false;
  }

  const age = Date.now() - parseInt(timestamp, 10);
  return age >= 0 && age < CSRF_TTL;
}

// ---------- JS Token (single-use) ----------

const usedJsTokens = new Set<string>();

export function generateJsToken(): string {
  const id = crypto.randomBytes(16).toString("hex");
  const timestamp = Date.now().toString();
  const payload = `${id}.${timestamp}`;
  const signature = crypto
    .createHmac("sha256", JS_TOKEN_SECRET)
    .update(payload)
    .digest("hex");
  return `${payload}.${signature}`;
}

export function validateJsToken(token: string): boolean {
  const parts = token.split(".");
  if (parts.length !== 3) return false;

  const [id, timestamp, signature] = parts;
  const payload = `${id}.${timestamp}`;
  const expectedSig = crypto
    .createHmac("sha256", JS_TOKEN_SECRET)
    .update(payload)
    .digest("hex");

  if (
    !crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSig))
  ) {
    return false;
  }

  if (usedJsTokens.has(token)) return false;
  usedJsTokens.add(token);

  // Cleanup old tokens periodically
  if (usedJsTokens.size > 10000) {
    usedJsTokens.clear();
  }

  const age = Date.now() - parseInt(timestamp, 10);
  return age >= 0 && age < CSRF_TTL;
}

// ---------- Honeypot ----------

const HONEYPOT_NAMES = [
  "website_url",
  "company_website",
  "homepage",
  "url",
  "website",
  "fax_number",
];

export function getRandomHoneypotName(): string {
  return HONEYPOT_NAMES[Math.floor(Math.random() * HONEYPOT_NAMES.length)];
}

// ---------- Rate Limiting ----------

interface RateEntry {
  count: number;
  resetAt: number;
}

const ipRateLimits = new Map<string, RateEntry>();
const emailRateLimits = new Map<string, RateEntry>();

function checkRate(
  map: Map<string, RateEntry>,
  key: string,
  maxRequests: number,
  windowMs: number
): boolean {
  const now = Date.now();
  const entry = map.get(key);

  if (!entry || now > entry.resetAt) {
    map.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }

  if (entry.count >= maxRequests) return false;
  entry.count++;
  return true;
}

export function checkIpRateLimit(ip: string): boolean {
  return checkRate(ipRateLimits, ip, 3, 5 * 60 * 1000); // 3 per 5 min
}

export function checkEmailRateLimit(email: string): boolean {
  return checkRate(emailRateLimits, email, 1, 60 * 60 * 1000); // 1 per hour
}

// ---------- IP Detection ----------

export function getClientIp(headers: Headers): string {
  return (
    headers.get("cf-connecting-ip") ||
    headers.get("fly-client-ip") ||
    headers.get("fastly-client-ip") ||
    headers.get("x-real-ip") ||
    headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    "unknown"
  );
}
