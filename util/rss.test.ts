import { describe, expect, it } from "vitest";

import { buildRssFeed, escapeXml } from "./rss";

describe("escapeXml", () => {
  it("escapes all XML-sensitive characters", () => {
    expect(escapeXml(`Rock & Roll <script> "quote" 'apostrophe'`)).toBe(
      "Rock &amp; Roll &lt;script&gt; &quot;quote&quot; &apos;apostrophe&apos;",
    );
  });
});

describe("buildRssFeed", () => {
  it("generates escaped RSS items with canonical URLs", () => {
    const xml = buildRssFeed([
      {
        title: "Types & tests",
        description: "Use <strong>contracts</strong>.",
        slug: "types-tests",
        publishedAt: "2026-09-13",
        tags: ["TypeScript"],
        draft: false,
        readingTimeMinutes: 1,
        wordCount: 100,
      },
    ]);

    expect(xml).toContain('<rss version="2.0">');
    expect(xml).toContain("<title>Types &amp; tests</title>");
    expect(xml).toContain(
      "<link>https://www.santoshk.me/blog/types-tests</link>",
    );
    expect(xml).toContain("Use &lt;strong&gt;contracts&lt;/strong&gt;.");
  });

  it("excludes drafts and orders published posts newest-first", () => {
    const metadata = {
      description: "Description",
      tags: [],
      draft: false,
      readingTimeMinutes: 1,
      wordCount: 10,
    };
    const xml = buildRssFeed([
      { ...metadata, title: "Old", slug: "old", publishedAt: "2025-01-01" },
      {
        ...metadata,
        title: "Draft",
        slug: "draft",
        publishedAt: "2027-01-01",
        draft: true,
      },
      { ...metadata, title: "New", slug: "new", publishedAt: "2026-01-01" },
    ]);

    expect(xml).not.toContain("<title>Draft</title>");
    expect(xml.indexOf("<title>New</title>")).toBeLessThan(
      xml.indexOf("<title>Old</title>"),
    );
  });
});
