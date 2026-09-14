import type { PostMetadata } from "./post";
import { absoluteUrl, siteConfig } from "./site";

export function escapeXml(value: string) {
  return value.replace(/[&<>"']/g, (character) => {
    const entities: Record<string, string> = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&apos;",
    };

    return entities[character];
  });
}

export function buildRssFeed(posts: PostMetadata[]) {
  const items = posts
    .filter((post) => !post.draft)
    .toSorted((left, right) =>
      right.publishedAt.localeCompare(left.publishedAt),
    )
    .map((post) => {
      const url = absoluteUrl(`/blog/${post.slug}`);

      return `    <item>
      <title>${escapeXml(post.title)}</title>
      <description>${escapeXml(post.description)}</description>
      <link>${escapeXml(url)}</link>
      <guid isPermaLink="true">${escapeXml(url)}</guid>
      <pubDate>${new Date(`${post.publishedAt}T00:00:00.000Z`).toUTCString()}</pubDate>
    </item>`;
    })
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>${escapeXml(siteConfig.name)}</title>
    <description>${escapeXml(siteConfig.description)}</description>
    <link>${escapeXml(siteConfig.url.toString())}</link>
    <language>en-us</language>
${items}
  </channel>
</rss>`;
}
