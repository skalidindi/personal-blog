import { describe, expect, it } from "vitest";

import {
  assertUniquePostSlugs,
  calculateReadingStats,
  extractHeadings,
  filterAndSortPosts,
  validatePostMetadata,
  type PostMetadata,
} from "./post";

const validMetadata = {
  title: "A useful post",
  description: "A concrete description of the post.",
  slug: "useful-post",
  publishedAt: "2026-09-13",
};

function post(overrides: Partial<PostMetadata> = {}): PostMetadata {
  return {
    ...validMetadata,
    tags: [],
    draft: false,
    readingTimeMinutes: 1,
    wordCount: 100,
    ...overrides,
  };
}

describe("validatePostMetadata", () => {
  it("validates required fields and supplies safe defaults", () => {
    expect(
      validatePostMetadata(validMetadata, "one two three", "post.mdx"),
    ).toEqual({
      ...validMetadata,
      tags: [],
      draft: false,
      readingTimeMinutes: 1,
      wordCount: 3,
    });
  });

  it("rejects invalid metadata with the source filename", () => {
    expect(() =>
      validatePostMetadata(
        { ...validMetadata, title: "" },
        "content",
        "broken.mdx",
      ),
    ).toThrow("broken.mdx: metadata.title must be a non-empty string");
  });

  it("rejects tags that collide after URL normalization", () => {
    expect(() =>
      validatePostMetadata(
        { ...validMetadata, tags: ["C++", "C#"] },
        "content",
        "tags.mdx",
      ),
    ).toThrow("tags.mdx: metadata.tags must have unique URL slugs");
  });
});

describe("calculateReadingStats", () => {
  it("calculates words and rounds reading time up at 220 words per minute", () => {
    const source = Array.from({ length: 221 }, () => "word").join(" ");

    expect(calculateReadingStats(source)).toEqual({
      readingTimeMinutes: 2,
      wordCount: 221,
    });
  });
});

describe("assertUniquePostSlugs", () => {
  it("reports both files when metadata slugs collide", () => {
    expect(() =>
      assertUniquePostSlugs([
        { slug: "same-slug", sourceFile: "first.mdx" },
        { slug: "same-slug", sourceFile: "second.mdx" },
      ]),
    ).toThrow('Duplicate post slug "same-slug" in first.mdx and second.mdx');
  });

  it("treats slug casing as a duplicate", () => {
    expect(() =>
      assertUniquePostSlugs([
        { slug: "same-slug", sourceFile: "first.mdx" },
        { slug: "Same-Slug", sourceFile: "second.mdx" },
      ]),
    ).toThrow("first.mdx and second.mdx");
  });
});

describe("filterAndSortPosts", () => {
  it("excludes drafts and sorts published posts newest-first", () => {
    const posts = [
      post({ slug: "old", publishedAt: "2024-01-01" }),
      post({ slug: "draft", publishedAt: "2027-01-01", draft: true }),
      post({ slug: "new", publishedAt: "2026-01-01" }),
    ];

    expect(filterAndSortPosts(posts).map(({ slug }) => slug)).toEqual([
      "new",
      "old",
    ]);
    expect(
      filterAndSortPosts(posts, { includeDrafts: true }).map(
        ({ slug }) => slug,
      ),
    ).toEqual(["draft", "new", "old"]);
  });
});

describe("extractHeadings", () => {
  it("derives h2 and h3 entries with GitHub-compatible unique ids", () => {
    expect(
      extractHeadings(
        "## Install & run\n### Details\n```md\n## Not a heading\n```\nSetext section\n---\n## Install & run",
      ),
    ).toEqual([
      { depth: 2, id: "install--run", text: "Install & run" },
      { depth: 3, id: "details", text: "Details" },
      { depth: 2, id: "setext-section", text: "Setext section" },
      { depth: 2, id: "install--run-1", text: "Install & run" },
    ]);
  });
});
