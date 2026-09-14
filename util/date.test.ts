import { describe, expect, it } from "vitest";

import { formatDate } from "./date";

describe("formatDate", () => {
  it("formats a post date for readers", () => {
    expect(formatDate("2025-05-01")).toBe("May 1, 2025");
  });

  it("uses the UTC calendar date", () => {
    expect(formatDate("2025-05-01T23:30:00-07:00")).toBe("May 2, 2025");
  });
});
