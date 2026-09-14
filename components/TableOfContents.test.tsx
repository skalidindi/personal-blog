import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { TableOfContents } from "./TableOfContents";

const headings = [
  { depth: 2 as const, id: "first", text: "First" },
  { depth: 2 as const, id: "second", text: "Second" },
  { depth: 3 as const, id: "detail", text: "Detail" },
];

describe("TableOfContents", () => {
  it("marks the current section as the reader scrolls", () => {
    let tops = [-40, 400, 800];
    const elements = headings.map(({ id }, index) => {
      const element = document.createElement("h2");
      element.id = id;
      element.getBoundingClientRect = () => new DOMRect(0, tops[index]);
      document.body.append(element);
      return element;
    });
    vi.stubGlobal("requestAnimationFrame", (callback: FrameRequestCallback) => {
      callback(0);
      return 1;
    });
    vi.stubGlobal("cancelAnimationFrame", vi.fn());

    render(<TableOfContents headings={headings} />);

    expect(screen.getByRole("link", { name: "First" })).toHaveAttribute(
      "aria-current",
      "location",
    );

    tops = [-400, 80, 500];
    fireEvent.scroll(window);

    expect(screen.getByRole("link", { name: "Second" })).toHaveAttribute(
      "aria-current",
      "location",
    );

    for (const element of elements) {
      element.remove();
    }
    vi.unstubAllGlobals();
  });
});
