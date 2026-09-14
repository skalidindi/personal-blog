import { describe, expect, it } from "vitest";

import { getPostContent } from "./post";

describe("getPostContent", () => {
  it("loads a published post and its front matter", () => {
    const post = getPostContent("new-parent-essentials.md");

    expect(post.data).toMatchObject({
      author: "Santosh Kalidindi",
      date: "2025-05-01",
      description:
        "The three most useful items my partner and I have purchased so far",
      title: "New Parent Essentials",
    });
    expect(post.content).toContain(
      "## 1. Nanit Baby Monitor: Your New Best Friend",
    );
  });
});
