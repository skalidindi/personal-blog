import { describe, expect, it } from "vitest";

import { getPostSlugs } from "./post";

describe("getPostSlugs", () => {
  it("discovers published MDX posts", () => {
    expect(getPostSlugs()).toEqual(["new-parent-essentials"]);
  });
});
