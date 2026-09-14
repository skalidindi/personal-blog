import createMDX from "@next/mdx";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  pageExtensions: ["js", "jsx", "mdx", "ts", "tsx"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "static.wikia.nocookie.net",
        pathname:
          "/dota2_gamepedia/images/0/00/Shadow_Fiend_minimap_icon.png/revision/**",
      },
    ],
  },
};

const withMDX = createMDX({});

export default withMDX(nextConfig);
