import { NextRequest, NextResponse } from "next/server";
import { verifySolution } from "altcha-lib";
import nodemailer from "nodemailer";
import {
  validateCsrfToken,
  validateJsToken,
  checkIpRateLimit,
  checkEmailRateLimit,
  getClientIp,
} from "@/lib/security";
import { contactFormSchema, analyzeContent } from "@/lib/validation";

function log(level: string, message: string, data?: Record<string, unknown>) {
  const entry = { ts: new Date().toISOString(), level, message, ...data };
  console.log(JSON.stringify(entry));
}

export async function POST(request: NextRequest) {
  const ip = getClientIp(request.headers);

  try {
    // 1. Content-Type check
    const contentType = request.headers.get("content-type");
    if (!contentType?.includes("application/json")) {
      return NextResponse.json(
        { error: "Neplatný formát požadavku" },
        { status: 400 }
      );
    }

    // 2. Body size check
    const contentLength = parseInt(
      request.headers.get("content-length") || "0",
      10
    );
    if (contentLength > 10_000) {
      return NextResponse.json(
        { error: "Požadavek je příliš velký" },
        { status: 413 }
      );
    }

    const body = await request.json();

    // 3. Honeypot check — silently accept if filled
    if (body.honeypotName && body[body.honeypotName]) {
      log("warn", "Honeypot triggered", { ip });
      return NextResponse.json({ success: true });
    }

    // 4. IP rate limit
    if (!checkIpRateLimit(ip)) {
      log("warn", "IP rate limit exceeded", { ip });
      return NextResponse.json(
        { error: "Příliš mnoho požadavků. Zkuste to později." },
        { status: 429 }
      );
    }

    // 5. JS token validation
    if (!body.jsToken || !validateJsToken(body.jsToken)) {
      log("warn", "Invalid JS token", { ip });
      return NextResponse.json(
        { error: "Neplatný bezpečnostní token. Obnovte stránku." },
        { status: 403 }
      );
    }

    // 6. CSRF token validation
    if (!body.csrfToken || !validateCsrfToken(body.csrfToken)) {
      log("warn", "Invalid CSRF token", { ip });
      return NextResponse.json(
        { error: "Neplatný bezpečnostní token. Obnovte stránku." },
        { status: 403 }
      );
    }

    // 7. ALTCHA verification
    const hmacKey = process.env.ALTCHA_HMAC_KEY;
    if (!hmacKey || !body.altchaPayload) {
      log("warn", "Missing ALTCHA", { ip });
      return NextResponse.json(
        { error: "Ověření proti robotům selhalo. Zkuste to znovu." },
        { status: 400 }
      );
    }

    const altchaValid = await verifySolution(body.altchaPayload, hmacKey);
    if (!altchaValid) {
      log("warn", "ALTCHA verification failed", { ip });
      return NextResponse.json(
        { error: "Ověření proti robotům selhalo." },
        { status: 400 }
      );
    }

    // 8. Zod validation
    const result = contactFormSchema.safeParse(body);
    if (!result.success) {
      const errors = result.error.issues.map((i) => i.message);
      return NextResponse.json(
        { error: errors[0] || "Neplatná data" },
        { status: 400 }
      );
    }

    const data = result.data;

    // 9. Email rate limit
    if (!checkEmailRateLimit(data.email)) {
      log("warn", "Email rate limit exceeded", { ip, email: data.email });
      return NextResponse.json(
        {
          error:
            "Z této emailové adresy byl již odeslán formulář. Zkuste to později.",
        },
        { status: 429 }
      );
    }

    // 10. Spam analysis
    const spam = analyzeContent(data.message);
    if (spam.isSpam) {
      log("warn", "Spam detected", { ip, reason: spam.reason });
      return NextResponse.json({ success: true }); // Silent accept
    }

    // 11. Send email
    await sendEmail(data, ip);
    log("info", "Contact form submitted successfully", {
      ip,
      email: data.email,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    log("error", "Contact form error", {
      ip,
      error: error instanceof Error ? error.message : "unknown",
    });
    return NextResponse.json(
      { error: "Odeslání se nezdařilo. Zkuste to prosím znovu." },
      { status: 500 }
    );
  }
}

async function sendEmail(
  data: {
    name: string;
    email: string;
    phone?: string;
    company?: string;
    message: string;
  },
  ip: string
) {
  const smtpHost = process.env.SMTP_HOST;
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;
  const contactEmail = process.env.CONTACT_EMAIL || "info@cognera.cz";

  if (!smtpHost || !smtpUser || !smtpPass) {
    if (process.env.NODE_ENV !== "production") {
      log("info", "DEV: Would send email", { to: contactEmail, data });
      return;
    }
    throw new Error("SMTP not configured");
  }

  const transporter = nodemailer.createTransport({
    host: smtpHost,
    port: parseInt(process.env.SMTP_PORT || "587", 10),
    secure: process.env.SMTP_SECURE === "true",
    auth: { user: smtpUser, pass: smtpPass },
  });

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #0f172a;">Nová zpráva z kontaktního formuláře</h2>
      <table style="width: 100%; border-collapse: collapse;">
        <tr><td style="padding: 8px 0; font-weight: bold; color: #64748b;">Jméno:</td><td style="padding: 8px 0;">${data.name}</td></tr>
        <tr><td style="padding: 8px 0; font-weight: bold; color: #64748b;">Email:</td><td style="padding: 8px 0;"><a href="mailto:${data.email}">${data.email}</a></td></tr>
        ${data.phone ? `<tr><td style="padding: 8px 0; font-weight: bold; color: #64748b;">Telefon:</td><td style="padding: 8px 0;">${data.phone}</td></tr>` : ""}
        ${data.company ? `<tr><td style="padding: 8px 0; font-weight: bold; color: #64748b;">Společnost:</td><td style="padding: 8px 0;">${data.company}</td></tr>` : ""}
      </table>
      <div style="margin-top: 16px; padding: 16px; background: #f8fafc; border-radius: 8px;">
        <p style="font-weight: bold; color: #64748b; margin: 0 0 8px 0;">Zpráva:</p>
        <p style="margin: 0; white-space: pre-wrap;">${data.message}</p>
      </div>
      <p style="margin-top: 16px; font-size: 12px; color: #94a3b8;">IP: ${ip} | ${new Date().toISOString()}</p>
    </div>
  `;

  await transporter.sendMail({
    from: process.env.SMTP_FROM || smtpUser,
    to: contactEmail,
    replyTo: data.email,
    subject: `Kontaktní formulář — ${data.name}`,
    html,
  });
}
