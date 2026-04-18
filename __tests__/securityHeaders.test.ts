import { describe, expect, test } from "@jest/globals";
import { buildCspHeader, getSecurityHeaders } from "@/lib/securityHeaders";

describe("security header helpers", () => {
  test("builds a valid CSP header from directives", () => {
    expect(buildCspHeader(["default-src 'self'", "img-src 'self' data:"])).toBe(
      "default-src 'self'; img-src 'self' data:"
    );
  });

  test("trims whitespace and skips empty directives", () => {
    expect(buildCspHeader([" default-src 'self' ", "  ", "style-src 'self'"])).toBe(
      "default-src 'self'; style-src 'self'"
    );
  });

  test("throws when no CSP directives are provided", () => {
    expect(() => buildCspHeader(["   ", ""])).toThrow(
      "Content Security Policy requires at least one directive."
    );
  });

  test("adds stricter production headers", () => {
    const productionHeaders = getSecurityHeaders(true);
    const developmentHeaders = getSecurityHeaders(false);

    expect(
      productionHeaders.find((header) => header.key === "Strict-Transport-Security")
    ).toEqual({
      key: "Strict-Transport-Security",
      value: "max-age=63072000; includeSubDomains; preload",
    });

    expect(
      productionHeaders.find((header) => header.key === "Content-Security-Policy")?.value
    ).not.toContain("'unsafe-eval'");
    expect(
      developmentHeaders.find((header) => header.key === "Content-Security-Policy")?.value
    ).toContain("'unsafe-eval'");
  });
});
