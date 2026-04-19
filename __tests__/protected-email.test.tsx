import { afterEach, describe, expect, jest, test } from "@jest/globals";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import {
  CONTACT_FORM_TARGET_ID,
  CONTACT_SECTION_TARGET_ID,
  scrollToContactForm,
} from "@/lib/contact-target";

jest.mock("@/components/ContactForm", () => ({
  __esModule: true,
  default: function MockContactForm() {
    return <form aria-label="Kontaktní formulář" />;
  },
}));

const CONTACT_ADDRESS = "info@cognera.cz";
const SCROLL_OPTIONS = { behavior: "smooth", block: "start" };

function createTarget(id: string) {
  const target = document.createElement("div");
  const scrollIntoView = jest.fn();
  target.id = id;
  target.scrollIntoView = scrollIntoView;
  document.body.appendChild(target);
  return scrollIntoView;
}

afterEach(() => {
  cleanup();
  document.body.innerHTML = "";
  jest.restoreAllMocks();
});

describe("protected email contact", () => {
  test("scrolls to the exact contact form target when it exists", () => {
    const scrollIntoView = createTarget(CONTACT_FORM_TARGET_ID);

    expect(scrollToContactForm()).toBe(true);
    expect(scrollIntoView).toHaveBeenCalledWith(SCROLL_OPTIONS);
  });

  test("falls back to the contact section when the form target is missing", () => {
    const scrollIntoView = createTarget(CONTACT_SECTION_TARGET_ID);

    expect(scrollToContactForm()).toBe(true);
    expect(scrollIntoView).toHaveBeenCalledWith(SCROLL_OPTIONS);
  });

  test("renders the contact section email without mailto or raw address text", () => {
    const { container } = render(<ContactSection />);

    expect(container.querySelector('a[href^="mailto:"]')).toBeNull();
    expect(
      screen.getByRole("button", { name: /kontaktní formulář/i })
    ).toBeInTheDocument();
    expect(document.getElementById(CONTACT_FORM_TARGET_ID)).toBeInTheDocument();
  });

  test("scrolls from the contact section protected email button to the form", () => {
    render(<ContactSection />);

    const target = document.getElementById(CONTACT_FORM_TARGET_ID);
    if (!target) throw new Error("Expected contact form target to exist");

    const scrollIntoView = jest.fn();
    target.scrollIntoView = scrollIntoView;

    fireEvent.click(
      screen.getByRole("button", { name: /kontaktní formulář/i })
    );

    expect(scrollIntoView).toHaveBeenCalledWith(SCROLL_OPTIONS);
  });

  test("renders footer email controls as protected buttons", () => {
    const scrollIntoView = createTarget(CONTACT_FORM_TARGET_ID);
    const { container } = render(<Footer />);

    expect(container.querySelector('a[href^="mailto:"]')).toBeNull();

    const buttons = screen.getAllByRole("button");
    expect(buttons).toHaveLength(2);

    buttons.forEach((button) => fireEvent.click(button));
    expect(scrollIntoView).toHaveBeenCalledTimes(2);
  });

  test("keeps the raw public email out of server-rendered contact sources", () => {
    const sourceFiles = [
      "src/components/ContactSection.tsx",
      "src/components/Footer.tsx",
      "src/components/ProtectedEmailButton.tsx",
      "src/lib/site-content.ts",
      "src/app/layout.tsx",
    ];

    sourceFiles.forEach((file) => {
      const source = readFileSync(join(process.cwd(), file), "utf8");
      expect(source).not.toContain(CONTACT_ADDRESS);
      expect(source).not.toContain(`mailto:${CONTACT_ADDRESS}`);
    });
  });
});
