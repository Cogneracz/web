import { describe, expect, test } from "@jest/globals";
import { render } from "@testing-library/react";
import InlineHighlight from "@/components/InlineHighlight";

describe("InlineHighlight", () => {
  // Expected use case
  test("wraps text in a <mark> with the hover-mark treatment", () => {
    const { container } = render(<InlineHighlight>Agentic</InlineHighlight>);
    const mark = container.querySelector("mark");
    expect(mark).toBeInTheDocument();
    expect(mark).toHaveTextContent("Agentic");
    expect(mark).toHaveClass("hover-mark");
  });

  // Edge case: extra className is merged onto the mark
  test("merges an extra className", () => {
    const { container } = render(
      <InlineHighlight className="text-blue-600">Senior</InlineHighlight>,
    );
    const mark = container.querySelector("mark");
    expect(mark).toHaveClass("hover-mark");
    expect(mark).toHaveClass("text-blue-600");
  });

  // Error / boundary case: nested ReactNode children render intact
  test("renders nested element children", () => {
    const { container } = render(
      <InlineHighlight>
        <strong>AI</strong> agenti
      </InlineHighlight>,
    );
    const mark = container.querySelector("mark");
    expect(mark?.querySelector("strong")).toHaveTextContent("AI");
    expect(mark).toHaveTextContent("AI agenti");
  });
});
