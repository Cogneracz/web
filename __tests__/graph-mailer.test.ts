import { afterEach, beforeEach, describe, expect, jest, test } from "@jest/globals";

// Control getToken per test; the mock survives jest.resetModules() because it
// lives in test scope, while the mailer's credential singleton is rebuilt fresh.
const mockGetToken =
  jest.fn<() => Promise<{ token: string } | null>>();

jest.mock("@azure/identity", () => ({
  ClientSecretCredential: jest
    .fn()
    .mockImplementation(() => ({ getToken: mockGetToken })),
}));

const GRAPH_ENV = {
  GRAPH_TENANT_ID: "tenant-123",
  GRAPH_CLIENT_ID: "client-456",
  GRAPH_CLIENT_SECRET: "secret-789",
  MAIL_FROM: "info@cognera.cz",
  MAIL_TO: "info@cognera.cz",
};

const ORIGINAL_ENV = process.env;

async function loadMailer() {
  const mod = await import("@/lib/graph-mailer");
  return mod.sendContactMail;
}

beforeEach(() => {
  jest.resetModules();
  jest.clearAllMocks();
  process.env = { ...ORIGINAL_ENV };
  mockGetToken.mockResolvedValue({ token: "fake-token" });
});

afterEach(() => {
  process.env = ORIGINAL_ENV;
});

describe("graph-mailer sendContactMail", () => {
  test("success: posts to /users/{from}/sendMail with correct recipients, replyTo and auth", async () => {
    Object.assign(process.env, GRAPH_ENV);
    const fetchMock = jest
      .fn<typeof fetch>()
      .mockResolvedValue({
        ok: true,
        status: 202,
        headers: { get: () => "test-request-id" },
        text: async () => "",
      } as unknown as Response);
    global.fetch = fetchMock as unknown as typeof fetch;

    const sendContactMail = await loadMailer();
    await sendContactMail({
      subject: "Kontaktní formulář — Jan",
      bodyHtml: "<p>Ahoj</p>",
      replyToEmail: "visitor@example.com",
      replyToName: "Jan Novák",
    });

    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(url).toBe(
      "https://graph.microsoft.com/v1.0/users/info%40cognera.cz/sendMail"
    );
    expect(init.method).toBe("POST");
    const headers = init.headers as Record<string, string>;
    expect(headers.Authorization).toBe("Bearer fake-token");
    expect(headers["Content-Type"]).toBe("application/json");

    const payload = JSON.parse(init.body as string);
    expect(payload.saveToSentItems).toBe(true);
    expect(payload.message.body.contentType).toBe("HTML");
    expect(payload.message.toRecipients[0].emailAddress.address).toBe(
      "info@cognera.cz"
    );
    expect(payload.message.replyTo[0].emailAddress.address).toBe(
      "visitor@example.com"
    );
    expect(payload.message.replyTo[0].emailAddress.name).toBe("Jan Novák");
  });

  test("dev no-op: missing Graph config outside production does not call fetch", async () => {
    delete process.env.GRAPH_TENANT_ID;
    delete process.env.GRAPH_CLIENT_ID;
    delete process.env.GRAPH_CLIENT_SECRET;
    process.env.NODE_ENV = "test";
    const fetchMock = jest.fn<typeof fetch>();
    global.fetch = fetchMock as unknown as typeof fetch;

    const sendContactMail = await loadMailer();
    await expect(
      sendContactMail({ subject: "x", bodyHtml: "<p>x</p>" })
    ).resolves.toBeUndefined();

    expect(fetchMock).not.toHaveBeenCalled();
  });

  test("error: a non-2xx Graph response rejects with the status", async () => {
    Object.assign(process.env, GRAPH_ENV);
    const fetchMock = jest
      .fn<typeof fetch>()
      .mockResolvedValue({
        ok: false,
        status: 403,
        text: async () => "Forbidden",
      } as unknown as Response);
    global.fetch = fetchMock as unknown as typeof fetch;

    const sendContactMail = await loadMailer();
    await expect(
      sendContactMail({ subject: "x", bodyHtml: "<p>x</p>" })
    ).rejects.toThrow(/403/);
  });

  test("error: missing config in production throws instead of silently passing", async () => {
    delete process.env.GRAPH_TENANT_ID;
    delete process.env.GRAPH_CLIENT_ID;
    delete process.env.GRAPH_CLIENT_SECRET;
    process.env.NODE_ENV = "production";
    const fetchMock = jest.fn<typeof fetch>();
    global.fetch = fetchMock as unknown as typeof fetch;

    const sendContactMail = await loadMailer();
    await expect(
      sendContactMail({ subject: "x", bodyHtml: "<p>x</p>" })
    ).rejects.toThrow(/nakonfigurován/);
    expect(fetchMock).not.toHaveBeenCalled();
  });
});
