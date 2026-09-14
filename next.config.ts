import createMDX from "@next/mdx";
import { withSentryConfig } from "@sentry/nextjs/config";
import type { NextConfig } from "next";

const isDevelopment = process.env.NODE_ENV === "development";
const contentSecurityPolicy = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${
    isDevelopment ? " 'unsafe-eval' https://va.vercel-scripts.com" : ""
  }`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' blob: data:",
  "font-src 'self' data:",
  "connect-src 'self' https://o4507139431792640.ingest.us.sentry.io",
  "worker-src 'self' blob:",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  !isDevelopment && "upgrade-insecure-requests",
]
  .filter(Boolean)
  .join("; ");

const nextConfig: NextConfig = {
  reactCompiler: true,
  pageExtensions: ["js", "jsx", "mdx", "ts", "tsx"],
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Content-Security-Policy",
            value: contentSecurityPolicy,
          },
        ],
      },
    ];
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

const withMDX = createMDX({
  options: {
    remarkPlugins: ["remark-gfm"],
    rehypePlugins: [
      "rehype-slug",
      ["rehype-autolink-headings", { behavior: "wrap" }],
      [
        "@shikijs/rehype",
        {
          fallbackLanguage: "text",
          langs: [
            "bash",
            "css",
            "html",
            "javascript",
            "json",
            "markdown",
            "text",
            "tsx",
            "typescript",
          ],
          themes: {
            light: "github-light",
            dark: "github-dark",
          },
        },
      ],
    ],
  },
});

export default withSentryConfig(withMDX(nextConfig), {
  // For all available options, see:
  // https://www.npmjs.com/package/@sentry/webpack-plugin#options

  org: "santosh-kalidindi",

  project: "personal-blog",

  // Only print logs for uploading source maps in CI
  silent: !process.env.CI,

  // For all available options, see:
  // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/

  // Upload a larger set of source maps for prettier stack traces (increases build time)
  widenClientFileUpload: true,

  webpack: {
    // Enables automatic instrumentation of Vercel Cron Monitors. (Does not yet work with App Router route handlers.)
    // See the following for more information:
    // https://docs.sentry.io/product/crons/
    // https://vercel.com/docs/cron-jobs
    automaticVercelMonitors: true,

    // Tree-shaking options for reducing bundle size
    treeshake: {
      // Automatically tree-shake Sentry logger statements to reduce bundle size
      removeDebugLogging: true,
    },
  },
});
