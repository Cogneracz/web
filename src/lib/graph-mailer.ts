// graph-mailer.ts
// Odesílání mailu přes Microsoft Graph API (Application permission Mail.Send).
// Nahrazuje nodemailer/SMTP. Žádný app password, žádný Basic auth.
//
// App-only (client-credentials) flow: token z @azure/identity, odeslání přes
// POST /users/{MAIL_FROM}/sendMail. App má Mail.Send omezené na info@ přes
// Exchange Application Access Policy / RBAC for Applications.

import { ClientSecretCredential } from "@azure/identity";

const GRAPH_SCOPE = "https://graph.microsoft.com/.default";
const SENDMAIL_ENDPOINT = "https://graph.microsoft.com/v1.0/users";

interface GraphConfig {
  tenantId: string;
  clientId: string;
  clientSecret: string;
  from: string;
  to: string;
}

function readConfig(): GraphConfig | null {
  const tenantId = process.env.GRAPH_TENANT_ID;
  const clientId = process.env.GRAPH_CLIENT_ID;
  const clientSecret = process.env.GRAPH_CLIENT_SECRET;
  if (!tenantId || !clientId || !clientSecret) return null;

  return {
    tenantId,
    clientId,
    clientSecret,
    from: process.env.MAIL_FROM || "info@cognera.cz",
    // CONTACT_EMAIL kept as fallback so an already-provisioned host env keeps working.
    to: process.env.MAIL_TO || process.env.CONTACT_EMAIL || "info@cognera.cz",
  };
}

// Lazy module-level singleton — the MSAL token cache survives across warm
// invocations instead of re-authenticating on every request.
let credential: ClientSecretCredential | null = null;

function getCredential(config: GraphConfig): ClientSecretCredential {
  if (!credential) {
    credential = new ClientSecretCredential(
      config.tenantId,
      config.clientId,
      config.clientSecret,
    );
  }
  return credential;
}

function log(level: string, message: string, data?: Record<string, unknown>) {
  console.log(
    JSON.stringify({ ts: new Date().toISOString(), level, message, ...data }),
  );
}

// Verbose per-send tracing — opt in with GRAPH_DEBUG=1 so production stays quiet.
function debug(message: string, data?: Record<string, unknown>) {
  if (process.env.GRAPH_DEBUG === "1" || process.env.GRAPH_DEBUG === "true") {
    log("info", message, data);
  }
}

export interface SendMailInput {
  subject: string;
  bodyHtml: string;
  replyToEmail?: string;
  replyToName?: string;
}

export async function sendContactMail({
  subject,
  bodyHtml,
  replyToEmail,
  replyToName,
}: SendMailInput): Promise<void> {
  const config = readConfig();

  // Dev no-op: without Graph config outside production, don't attempt a send.
  if (!config) {
    log("warn", "graph: NO CONFIG — skipping real send", {
      nodeEnv: process.env.NODE_ENV,
      hasTenant: !!process.env.GRAPH_TENANT_ID,
      hasClient: !!process.env.GRAPH_CLIENT_ID,
      hasSecret: !!process.env.GRAPH_CLIENT_SECRET,
    });
    if (process.env.NODE_ENV !== "production") {
      log("info", "DEV: would send Graph mail", { subject });
      return;
    }
    throw new Error("Graph mailer není nakonfigurován");
  }

  debug("graph: sending", { from: config.from, to: config.to, subject });

  const token = await getCredential(config).getToken(GRAPH_SCOPE);
  if (!token) throw new Error("Nepodařilo se získat Graph token");
  debug("graph: token acquired", {
    tokenLen: token.token.length,
    expiresOn: token.expiresOnTimestamp
      ? new Date(token.expiresOnTimestamp).toISOString()
      : null,
  });

  const message: Record<string, unknown> = {
    subject,
    body: { contentType: "HTML", content: bodyHtml },
    toRecipients: [{ emailAddress: { address: config.to } }],
  };

  // replyTo = návštěvník, aby šlo na dotaz odpovědět přímo jemu.
  if (replyToEmail) {
    message.replyTo = [
      {
        emailAddress: {
          address: replyToEmail,
          name: replyToName || replyToEmail,
        },
      },
    ];
  }

  const res = await fetch(
    `${SENDMAIL_ENDPOINT}/${encodeURIComponent(config.from)}/sendMail`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token.token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message, saveToSentItems: true }),
    },
  );

  if (!res.ok) {
    const errText = await res.text();
    log("error", "graph: sendMail FAILED", { status: res.status, body: errText });
    throw new Error(`Graph sendMail selhal: ${res.status} ${errText}`);
  }

  debug("graph: sendMail OK", {
    status: res.status,
    requestId: res.headers.get("request-id"),
    to: config.to,
    from: config.from,
  });
}
