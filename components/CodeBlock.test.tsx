import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { CodeBlock } from "./CodeBlock";

describe("CodeBlock", () => {
  it("copies the rendered code and announces success", async () => {
    const writeText = vi.fn<() => Promise<void>>().mockResolvedValue(undefined);
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: { writeText },
    });

    render(
      <CodeBlock>
        <code>const answer = 42;</code>
      </CodeBlock>,
    );

    await userEvent.click(screen.getByRole("button", { name: "Copy code" }));

    expect(writeText).toHaveBeenCalledWith("const answer = 42;");
    expect(
      screen.getByRole("button", { name: "Code copied" }),
    ).toHaveTextContent("Copied");
  });
});
