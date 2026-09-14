import { ImageResponse } from "next/og";

import { siteConfig } from "@/util/site";

export const alt = "Santosh Kalidindi engineering notes";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    <div
      style={{
        alignItems: "flex-start",
        background: "#0c0a09",
        color: "#fafaf9",
        display: "flex",
        flexDirection: "column",
        height: "100%",
        justifyContent: "center",
        padding: "84px",
        width: "100%",
      }}
    >
      <div style={{ color: "#a8a29e", fontSize: 30, marginBottom: 28 }}>
        {siteConfig.url.hostname}
      </div>
      <div style={{ fontSize: 76, fontWeight: 700, letterSpacing: "-0.04em" }}>
        Engineering notes
      </div>
      <div style={{ color: "#d6d3d1", fontSize: 34, marginTop: 24 }}>
        {siteConfig.description}
      </div>
    </div>,
    size,
  );
}
