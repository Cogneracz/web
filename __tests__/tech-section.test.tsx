import { describe, expect, test } from "@jest/globals";
import { fireEvent, render } from "@testing-library/react";
import TechSection from "@/components/TechSection";
import { techCategories } from "@/lib/site-content";

function getRailButton(container: HTMLElement, index: number) {
  const btn = container.querySelector<HTMLButtonElement>(
    `button[data-tech-index="${index}"]`
  );
  if (!btn) {
    throw new Error(`Rail button with data-tech-index="${index}" not found`);
  }
  return btn;
}

describe("TechSection", () => {
  test("renders a rail button for each tech category", () => {
    const { container } = render(<TechSection />);

    techCategories.forEach((_, i) => {
      expect(getRailButton(container, i)).toBeInTheDocument();
    });
  });

  test("marks the first category as active by default", () => {
    const { container } = render(<TechSection />);

    expect(getRailButton(container, 0)).toHaveAttribute("aria-pressed", "true");
    expect(getRailButton(container, 1)).toHaveAttribute("aria-pressed", "false");
  });

  test("switches the active tab when another category is clicked", () => {
    const { container } = render(<TechSection />);

    fireEvent.click(getRailButton(container, 2));

    expect(getRailButton(container, 0)).toHaveAttribute("aria-pressed", "false");
    expect(getRailButton(container, 2)).toHaveAttribute("aria-pressed", "true");
  });
});
