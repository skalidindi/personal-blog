import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { PostLink } from "./PostLink";

describe("PostLink", () => {
  it("links to the post and presents its title and publication date", () => {
    render(
      <PostLink
        post={{
          slug: "es2026-features",
          title: "Four ES2026 features worth using",
          date: "2026-09-13",
        }}
      />,
    );

    expect(
      screen.getByRole("link", { name: /Four ES2026 features worth using/ }),
    ).toHaveAttribute("href", "/blog/es2026-features");
    expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent(
      "Four ES2026 features worth using",
    );
    expect(screen.getByText("September 13, 2026")).toHaveAttribute(
      "datetime",
      "2026-09-13",
    );
  });
});
