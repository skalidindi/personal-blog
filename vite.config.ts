import { cloudflare } from "@cloudflare/vite-plugin";
import mdx from "@mdx-js/rollup";
import rehypeShiki from "@shikijs/rehype";
import { staticAssetsAdapter } from "@vinext/cloudflare/cache/static-assets-adapter";
import { imagesOptimizer } from "@vinext/cloudflare/images/images-optimizer";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";
import vinext from "vinext";
import { defineConfig } from "vite";

const mdxPlugin = mdx({
  providerImportSource: "@/mdx-components",
  remarkPlugins: [remarkGfm],
  rehypePlugins: [
    rehypeSlug,
    [rehypeAutolinkHeadings, { behavior: "wrap" }],
    [
      rehypeShiki,
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
          light: "github-light-high-contrast",
          dark: "github-dark",
        },
      },
    ],
  ],
});

export default defineConfig({
  plugins: [
    {
      ...mdxPlugin,
      // MDX's transform strips queries; let Vite handle raw source imports.
      transform: {
        filter: { id: { exclude: /\?raw(?:&|$)/ } },
        handler: mdxPlugin.transform,
      },
    },
    vinext({
      react: { compiler: true },
      cache: { cdn: staticAssetsAdapter() },
      prerender: { routes: "*" },
      images: { optimizer: imagesOptimizer() },
    }),
    cloudflare({
      viteEnvironment: {
        name: "rsc",
        childEnvironments: ["ssr"],
      },
    }),
  ],
});
