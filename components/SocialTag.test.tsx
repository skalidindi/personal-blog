import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { SocialTag } from "./SocialTag";

describe("SocialTag", () => {
  it("uses client navigation for an internal destination", () => {
    render(<SocialTag href="/blog" label="Blog" title="Read the blog" />);

    const link = screen.getByRole("link", { name: "Blog" });
    expect(link).toHaveAttribute("href", "/blog");
    expect(link).not.toHaveAttribute("target");
  });

  it("opens an external destination in a separate browsing context", () => {
    render(
      <SocialTag
        href="https://www.linkedin.com/in/example"
        label="LinkedIn"
        title="LinkedIn profile"
      />,
    );

    const link = screen.getByRole("link", { name: "LinkedIn" });
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener noreferrer external");
  });
});
