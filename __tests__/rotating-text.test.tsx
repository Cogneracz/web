import { describe, expect, test } from "@jest/globals";
import { render } from "@testing-library/react";
import RotatingText from "@/components/RotatingText";

describe("RotatingText", () => {
  // Expected use case
  test("renders one span per word and labels itself with the first word", () => {
    const words = ["První", "Druhý", "Třetí"];
    const { container } = render(<RotatingText words={words} />);

    const root = container.querySelector('[role="text"]');
    expect(root).toBeInTheDocument();
    expect(root).toHaveAttribute("aria-label", "První");

    const wordSpans = container.querySelectorAll('[aria-hidden="true"]');
    expect(wordSpans).toHaveLength(words.length);
    expect(wordSpans[0]).toHaveTextContent("První");
  });

  // Edge case: a single word still renders without a rotation timeline
  test("renders a single word without crashing", () => {
    const { container } = render(<RotatingText words={["Jediný"]} />);
    const wordSpans = container.querySelectorAll('[aria-hidden="true"]');
    expect(wordSpans).toHaveLength(1);
    expect(wordSpans[0]).toHaveTextContent("Jediný");
  });

  // Error / boundary case: empty word list renders the container with no items
  test("renders nothing breakable for an empty word list", () => {
    const { container } = render(<RotatingText words={[]} />);
    const root = container.querySelector('[role="text"]');
    expect(root).toBeInTheDocument();
    expect(root).not.toHaveAttribute("aria-label");
    expect(container.querySelectorAll('[aria-hidden="true"]')).toHaveLength(0);
  });
});
