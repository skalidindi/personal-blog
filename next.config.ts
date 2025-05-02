import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    viewTransition: true,
  },
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

export default nextConfig;
