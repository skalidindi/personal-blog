import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { MdxLink } from "./MdxLink";

describe("MdxLink", () => {
  it("renders site paths without an external marker", () => {
    render(<MdxLink href="/blog">Blog</MdxLink>);

    const link = screen.getByRole("link", { name: "Blog" });
    expect(link).toHaveAttribute("href", "/blog");
    expect(link).not.toHaveAttribute("rel", "external");
  });

  it("marks protocol-relative links as external", () => {
    render(<MdxLink href="//example.com/docs">Documentation</MdxLink>);

    expect(
      screen.getByRole("link", { name: "Documentation, external site" }),
    ).toHaveAttribute("rel", "external");
  });
});
