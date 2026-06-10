import { describe, expect, test } from "@jest/globals";
import { render } from "@testing-library/react";
import StructuredData from "@/components/StructuredData";

type Node = { "@type": string; [key: string]: unknown };

function parseGraph(container: HTMLElement): Node[] {
  const script = container.querySelector(
    'script[type="application/ld+json"]',
  );
  if (!script) throw new Error("JSON-LD script not found");
  const data = JSON.parse(script.textContent || "{}");
  return data["@graph"] as Node[];
}

describe("StructuredData", () => {
  // Expected use case: emits a valid JSON-LD @graph with the Cognera organization
  test("emits an Organization node for Cognera", () => {
    const { container } = render(<StructuredData />);
    const graph = parseGraph(container);
    const org = graph.find((n) => n["@type"] === "Organization");

    expect(org).toBeDefined();
    expect(org?.name).toBe("Cognera");
    expect(org?.url).toBe("https://cognera.cz");
  });

  // Edge case: WebSite + ProfessionalService nodes are present and Cognera-accurate
  test("includes WebSite and ProfessionalService nodes with the contact phone", () => {
    const { container } = render(<StructuredData />);
    const graph = parseGraph(container);

    expect(graph.find((n) => n["@type"] === "WebSite")).toBeDefined();
    const service = graph.find((n) => n["@type"] === "ProfessionalService");
    expect(service).toBeDefined();

    const org = graph.find((n) => n["@type"] === "Organization");
    const contact = org?.contactPoint as { telephone?: string } | undefined;
    expect(contact?.telephone).toBe("+420607204423");
  });

  // Error / boundary case: no Centera branding leaks and the payload is valid JSON
  test("contains no Centera references and parses as valid JSON", () => {
    const { container } = render(<StructuredData />);
    const script = container.querySelector(
      'script[type="application/ld+json"]',
    );
    const raw = script?.textContent || "";

    expect(() => JSON.parse(raw)).not.toThrow();
    expect(raw.toLowerCase()).not.toContain("centera");
    expect(raw).not.toContain("FAQPage");
  });
});
