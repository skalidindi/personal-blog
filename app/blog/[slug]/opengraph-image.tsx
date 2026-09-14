import { ImageResponse } from "next/og";

import { getPost } from "@/util/post";
import { siteConfig } from "@/util/site";

export const alt = "Engineering note";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpenGraphImage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPost(slug);

  return new ImageResponse(
    <div
      style={{
        alignItems: "flex-start",
        background: "#0c0a09",
        color: "#fafaf9",
        display: "flex",
        flexDirection: "column",
        height: "100%",
        justifyContent: "space-between",
        padding: "80px",
        width: "100%",
      }}
    >
      <div style={{ color: "#a8a29e", fontSize: 28 }}>
        {siteConfig.url.hostname} / engineering notes
      </div>
      <div
        style={{
          fontSize: 68,
          fontWeight: 700,
          letterSpacing: "-0.04em",
          maxWidth: 1000,
        }}
      >
        {post.title}
      </div>
      <div style={{ color: "#d6d3d1", display: "flex", fontSize: 28, gap: 22 }}>
        <span>Santosh Kalidindi</span>
        <span>·</span>
        <span>{post.readingTimeMinutes} min read</span>
      </div>
    </div>,
    size,
  );
}
