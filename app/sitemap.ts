import type { MetadataRoute } from "next";

import { getPublishedPosts, getTags, tagSlug } from "@/util/post";
import { absoluteUrl } from "@/util/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [posts, tags] = await Promise.all([getPublishedPosts(), getTags()]);
  const latestPostDate = posts
    .map((post) => post.updatedAt ?? post.publishedAt)
    .toSorted()
    .at(-1);

  return [
    { url: absoluteUrl("/"), lastModified: latestPostDate },
    { url: absoluteUrl("/blog"), lastModified: latestPostDate },
    { url: absoluteUrl("/blog/tags"), lastModified: latestPostDate },
    ...tags.map((tag) => ({
      url: absoluteUrl(`/blog/tags/${tag.slug}`),
      lastModified: posts
        .filter((post) => post.tags.some((name) => tagSlug(name) === tag.slug))
        .map((post) => post.updatedAt ?? post.publishedAt)
        .toSorted()
        .at(-1),
    })),
    ...posts.map((post) => ({
      url: absoluteUrl(`/blog/${post.slug}`),
      lastModified: post.updatedAt ?? post.publishedAt,
    })),
  ];
}
