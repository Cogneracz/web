import { afterEach, beforeEach, describe, expect, jest, test } from "@jest/globals";
import { act, fireEvent, render, screen, within } from "@testing-library/react";
import InternalToolsSection from "@/components/InternalToolsSection";
import { internalTools } from "@/lib/site-content";

type TriggerConfig = {
  trigger: Element;
  onEnter: () => void;
  onEnterBack: () => void;
};

// Captured ScrollTrigger.create configs so tests can simulate scroll beats.
const mockTriggers: TriggerConfig[] = [];

// Executing mock of the GSAP layer: useGSAP runs the callback in an effect
// (like @gsap/react) and gsap.matchMedia reports the desktop+motion branch,
// so the real select()/ScrollTrigger wiring is exercised in jsdom.
jest.mock("@/lib/gsap", () => {
  const { useEffect } = jest.requireActual<typeof import("react")>("react");
  return {
    gsap: {
      utils: { toArray: (value: ArrayLike<Element>) => Array.from(value) },
      matchMedia: () => ({
        add: (
          _conditions: unknown,
          handler: (ctx: {
            conditions: { motion: boolean; fallback: boolean };
          }) => void,
        ) => {
          handler({ conditions: { motion: true, fallback: false } });
        },
        revert: () => undefined,
      }),
    },
    ScrollTrigger: {
      create: (config: TriggerConfig) => {
        mockTriggers.push(config);
      },
      refresh: () => undefined,
    },
    useGSAP: (callback: () => void) => {
      useEffect(() => {
        callback();
        // The component's own cleanup runs via mm.revert(); nothing to undo here.
        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, []);
    },
  };
});

// Intake beat + one beat per internal tool + delivery beat.
const STEP_COUNT = internalTools.length + 2;

type ScrollCall = { element: Element; options?: ScrollIntoViewOptions };

let scrollCalls: ScrollCall[];
const originalScrollIntoView = Element.prototype.scrollIntoView;

beforeEach(() => {
  mockTriggers.length = 0;
  scrollCalls = [];
  Element.prototype.scrollIntoView = function (
    this: Element,
    options?: boolean | ScrollIntoViewOptions,
  ) {
    scrollCalls.push({
      element: this,
      options: typeof options === "object" ? options : undefined,
    });
  };
});

afterEach(() => {
  Element.prototype.scrollIntoView = originalScrollIntoView;
});

function getRailButton(container: HTMLElement, index: number) {
  const button = container.querySelector<HTMLButtonElement>(
    `button[data-rail-index="${index}"]`,
  );
  if (!button) {
    throw new Error(`Rail button with data-rail-index="${index}" not found`);
  }
  return button;
}

describe("InternalToolsSection rail", () => {
  test("renders an accessible nav with a button per step, first one active", () => {
    render(<InternalToolsSection />);

    const nav = screen.getByRole("navigation", { name: "Kroky AI stacku" });
    const buttons = within(nav).getAllByRole("button");
    expect(buttons).toHaveLength(STEP_COUNT);
    expect(buttons[0]).toHaveAttribute("aria-current", "step");
    expect(buttons[1]).not.toHaveAttribute("aria-current");
  });

  test("clicking a rail node activates it and scrolls its card to the center", () => {
    const { container } = render(<InternalToolsSection />);

    fireEvent.click(getRailButton(container, 4));

    const steps = container.querySelectorAll("[data-step]");
    expect(scrollCalls).toHaveLength(1);
    expect(scrollCalls[0].element).toBe(steps[4]);
    expect(scrollCalls[0].options).toEqual({
      behavior: "smooth",
      block: "center",
    });
    // Active state updates immediately — even before any ScrollTrigger fires
    // (this is what keeps the rail honest under prefers-reduced-motion).
    expect(getRailButton(container, 4)).toHaveAttribute("aria-current", "step");
    expect(getRailButton(container, 0)).not.toHaveAttribute("aria-current");
  });

  test("clicking the last rail node scrolls the last step card", () => {
    const { container } = render(<InternalToolsSection />);

    fireEvent.click(getRailButton(container, STEP_COUNT - 1));

    const steps = container.querySelectorAll("[data-step]");
    expect(scrollCalls).toHaveLength(1);
    expect(scrollCalls[0].element).toBe(steps[STEP_COUNT - 1]);
  });

  test("scroll beats drive aria-current and card activation", () => {
    const { container } = render(<InternalToolsSection />);

    // One ScrollTrigger per step was registered by the motion branch.
    expect(mockTriggers).toHaveLength(STEP_COUNT);

    act(() => mockTriggers[5].onEnter());

    const steps = container.querySelectorAll("[data-step]");
    expect(getRailButton(container, 5)).toHaveAttribute("aria-current", "step");
    expect(getRailButton(container, 0)).not.toHaveAttribute("aria-current");
    expect(steps[5]).toHaveClass("is-active");
    expect(steps[0]).not.toHaveClass("is-active");

    act(() => mockTriggers[2].onEnterBack());

    expect(getRailButton(container, 2)).toHaveAttribute("aria-current", "step");
    expect(steps[2]).toHaveClass("is-active");
    expect(steps[5]).not.toHaveClass("is-active");
  });

  test("scrolls without animation when the user prefers reduced motion", () => {
    const matchMediaSpy = jest
      .spyOn(window, "matchMedia")
      .mockImplementation((query: string) => ({
        matches: query.includes("prefers-reduced-motion"),
        media: query,
        onchange: null,
        addListener: () => undefined,
        removeListener: () => undefined,
        addEventListener: () => undefined,
        removeEventListener: () => undefined,
        dispatchEvent: () => false,
      }));

    try {
      const { container } = render(<InternalToolsSection />);

      fireEvent.click(getRailButton(container, 2));

      expect(scrollCalls[0].options).toEqual({
        behavior: "auto",
        block: "center",
      });
    } finally {
      matchMediaSpy.mockRestore();
    }
  });

  test("does not crash when scrollIntoView is unavailable", () => {
    // Simulate an environment without scrollIntoView (e.g. bare jsdom).
    Element.prototype.scrollIntoView =
      undefined as unknown as typeof Element.prototype.scrollIntoView;

    const { container } = render(<InternalToolsSection />);

    expect(() => fireEvent.click(getRailButton(container, 1))).not.toThrow();
  });
});
