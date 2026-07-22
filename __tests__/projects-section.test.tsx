import { describe, expect, jest, test } from "@jest/globals";
import { render, screen, within } from "@testing-library/react";
import type { ImgHTMLAttributes } from "react";
import ProjectsSection from "@/components/ProjectsSection";
import { projects } from "@/lib/site-content";

// Plain ts-jest setup (no next/jest), so next/image is replaced with a bare img.
jest.mock("next/image", () => ({
  __esModule: true,
  default: (props: ImgHTMLAttributes<HTMLImageElement>) => {
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    return <img {...props} />;
  },
}));

function getProjectCard(subtitle: string) {
  const card = screen.getByText(subtitle).closest("article");
  if (!card) {
    throw new Error(`Card article for "${subtitle}" not found`);
  }
  return card;
}

describe("ProjectsSection", () => {
  test("renders a card for every project with its copy", () => {
    const { container } = render(<ProjectsSection />);

    expect(container.querySelectorAll("article")).toHaveLength(projects.length);
    projects.forEach((project) => {
      const card = within(getProjectCard(project.subtitle));
      expect(card.getByText(project.name)).toBeInTheDocument();
      expect(card.getByText(project.description)).toBeInTheDocument();
      expect(card.getByText(project.domain)).toBeInTheDocument();
    });
  });

  test("renders highlights, metrics, and tech tags inside each project card", () => {
    render(<ProjectsSection />);

    projects.forEach((project) => {
      const card = within(getProjectCard(project.subtitle));
      project.highlights.forEach((highlight) => {
        expect(card.getByText(highlight)).toBeInTheDocument();
      });
      project.metrics.forEach((metric) => {
        // Exactly one visible value and one visible label per metric — the
        // <dl> must not duplicate labels for screen readers.
        expect(card.getAllByText(metric.value)).toHaveLength(1);
        expect(card.getAllByText(metric.label)).toHaveLength(1);
      });
      project.tags.forEach((tag) => {
        expect(card.getByText(tag)).toBeInTheDocument();
      });
      // Highlights keep list semantics (role="list" survives Tailwind reset).
      expect(card.getAllByRole("list").length).toBeGreaterThan(0);
    });
  });

  test("renders featured projects full-width and exactly once", () => {
    const { container } = render(<ProjectsSection />);

    const featured = projects.filter((project) => project.featured);
    // The section is designed around one featured card — data must provide it.
    expect(featured.length).toBeGreaterThan(0);

    const featuredCards = container.querySelectorAll("article.lg\\:col-span-2");
    expect(featuredCards).toHaveLength(featured.length);
    featured.forEach((project) => {
      expect(getProjectCard(project.subtitle)).toHaveClass("lg:col-span-2");
    });
  });

  test("shows a logo image when available and a rendered fallback icon otherwise", () => {
    const { container } = render(<ProjectsSection />);

    projects.forEach((project) => {
      if (project.logo) {
        expect(screen.getByAltText(project.name)).toBeInTheDocument();
      }
    });

    // Every project without a logo must resolve its icon name to a real icon —
    // an unknown name would render an empty box (Icon returns null).
    const iconBoxes = container.querySelectorAll(".premium-icon-box");
    expect(iconBoxes).toHaveLength(
      projects.filter((project) => !project.logo).length,
    );
    iconBoxes.forEach((box) => {
      expect(box.querySelector("svg")).not.toBeNull();
    });
  });
});
