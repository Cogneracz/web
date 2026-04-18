import { describe, expect, test } from "@jest/globals";
import { fireEvent, render, screen } from "@testing-library/react";
import TechSection from "@/components/TechSection";

describe("solutions section", () => {
  test("renders the default CRM / ERP solution view", () => {
    render(<TechSection />);

    expect(screen.getByText("Jeden systém pro obchod i provoz")).toBeInTheDocument();
    expect(screen.getByText("Workflow")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "CRM / ERP" })).toHaveAttribute(
      "aria-pressed",
      "true"
    );
  });

  test("switches to the AI integration view when the tab is selected", () => {
    render(<TechSection />);

    fireEvent.click(screen.getByRole("button", { name: "AI integrace" }));

    expect(screen.getByText("AI tam, kde má reálný provozní dopad")).toBeInTheDocument();
    expect(screen.getByText("Znalostní vrstva nad dokumenty a daty")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "AI integrace" })).toHaveAttribute(
      "aria-pressed",
      "true"
    );
  });
});
