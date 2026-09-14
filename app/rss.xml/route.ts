import { getPublishedPosts } from "@/util/post";
import { buildRssFeed } from "@/util/rss";

export async function GET() {
  return new Response(buildRssFeed(await getPublishedPosts()), {
    headers: { "Content-Type": "application/rss+xml; charset=utf-8" },
  });
}
