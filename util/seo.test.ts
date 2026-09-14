import { describe, expect, it } from "vitest";

import { serializeJsonLd } from "./seo";

describe("serializeJsonLd", () => {
  it("escapes opening angle brackets without corrupting JSON", () => {
    const serialized = serializeJsonLd({ description: "</script><script>" });

    expect(serialized).not.toContain("<");
    expect(JSON.parse(serialized)).toEqual({
      description: "</script><script>",
    });
  });
});
