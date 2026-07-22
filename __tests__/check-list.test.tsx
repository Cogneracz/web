import { describe, expect, test } from "@jest/globals";
import { render, screen } from "@testing-library/react";
import CheckList from "@/components/CheckList";
import TagChip from "@/components/TagChip";

describe("CheckList", () => {
  test("renders every item as a list item with a check icon", () => {
    render(<CheckList items={["První bod", "Druhý bod", "Třetí bod"]} />);

    const list = screen.getByRole("list");
    const items = screen.getAllByRole("listitem");
    expect(items).toHaveLength(3);
    expect(screen.getByText("Druhý bod")).toBeInTheDocument();
    items.forEach((item) => {
      expect(item.querySelector("svg")).not.toBeNull();
    });
    // Explicit role keeps list semantics in WebKit despite list-style: none.
    expect(list).toHaveAttribute("role", "list");
  });

  test("merges a custom className with the base classes", () => {
    render(<CheckList className="mt-3" items={["Bod"]} />);

    const list = screen.getByRole("list");
    expect(list).toHaveClass("mt-3");
    expect(list).toHaveClass("space-y-2.5");
  });

  test("renders an empty list without crashing when there are no items", () => {
    render(<CheckList items={[]} />);

    expect(screen.getByRole("list")).toBeEmptyDOMElement();
  });
});

describe("TagChip", () => {
  test("renders the label text", () => {
    render(<TagChip label="React 19" />);

    expect(screen.getByText("React 19")).toBeInTheDocument();
  });

  test("renders the blue dot and group-hover styling shared with services", () => {
    const { container } = render(<TagChip label="PostgreSQL" />);

    const chip = container.firstElementChild;
    expect(chip).toHaveClass("group-hover:text-blue-700");
    expect(chip?.querySelector("span")).toHaveClass("bg-blue-500");
  });

  test("renders an empty label without crashing", () => {
    const { container } = render(<TagChip label="" />);

    expect(container.firstElementChild).toBeInTheDocument();
  });
});
