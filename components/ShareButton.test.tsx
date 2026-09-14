import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";

import { ShareButton } from "./ShareButton";

describe("ShareButton", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("shares the post through the Web Share API", async () => {
    const share = vi.fn<() => Promise<void>>().mockResolvedValue(undefined);
    Object.defineProperty(navigator, "share", {
      configurable: true,
      value: share,
    });

    render(
      <ShareButton
        path="es2026-features"
        text="Four useful JavaScript features"
        title="Four ES2026 features worth using"
      />,
    );

    await userEvent.click(
      screen.getByRole("button", {
        name: "Share Four ES2026 features worth using",
      }),
    );

    expect(share).toHaveBeenCalledWith({
      title: "Four ES2026 features worth using",
      text: "Four useful JavaScript features",
      url: "https://santoshk.me/blog/es2026-features",
    });
  });

  it("warns when the Web Share API is unavailable", async () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => undefined);
    Object.defineProperty(navigator, "share", {
      configurable: true,
      value: undefined,
    });

    render(
      <ShareButton
        path="es2026-features"
        text="Four useful JavaScript features"
        title="Four ES2026 features worth using"
      />,
    );

    await userEvent.click(
      screen.getByRole("button", {
        name: "Share Four ES2026 features worth using",
      }),
    );

    expect(warn).toHaveBeenCalledWith(
      "Web Share API is not supported in this browser.",
    );
  });
});
