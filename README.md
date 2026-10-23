# Personal Blog

[![CI](https://github.com/skalidindi/personal-blog/actions/workflows/ci.yml/badge.svg)](https://github.com/skalidindi/personal-blog/actions/workflows/ci.yml)

Personal blog built with vinext on Cloudflare Workers, using the Next.js App
Router conventions. Posts are trusted local MDX modules, rendered with Tailwind
CSS and published through the site's HTML, RSS, sitemap, and crawler metadata
endpoints.

## Local development

Requirements:

- Node.js 24.22.1 (`.node-version`)
- pnpm 12.14.0

The Volta settings in `package.json` pin both versions. Install dependencies and
start the development server with:

```sh
pnpm install --frozen-lockfile
pnpm exec playwright install chromium
pnpm dev
```

Open <http://localhost:3000>. `pnpm dev` enables Fast Refresh. `pnpm start`
serves the most recent production build without watching source files.

## Quality checks

The project uses Oxlint, Oxfmt, Vitest, React Testing Library, Playwright, Knip,
and the React Compiler.

```sh
pnpm lint          # lint the project
pnpm lint:fix      # apply safe lint fixes
pnpm fmt:check     # check formatting
pnpm fmt           # format the project
pnpm typecheck     # run TypeScript without emitting files
pnpm test          # run Vitest once
pnpm test:watch    # run Vitest in watch mode
pnpm knip          # find unused files, exports, and dependencies
pnpm build         # create a production build
pnpm test:e2e      # run Playwright against a production build
pnpm check         # lint, format, types, Vitest, and Knip
pnpm check:all     # run check, the production build, and Playwright
```

Lefthook runs Oxlint and Oxfmt on staged files before commits. CI runs the
complete quality suite and production E2E tests on pull requests and pushes to
`main`.

## Adding a post

Add a `.mdx` file under `posts/` and export a `metadata` object. The source file
name is only the module name; the validated `slug` determines the public URL.

```mdx
export const metadata = {
  title: "Four ES2026 features worth using",
  description: "Practical examples of useful ES2026 APIs.",
  slug: "es2026-features",
  publishedAt: "2026-09-13",
  tags: ["JavaScript", "ECMAScript"],
  // updatedAt: "2026-09-14",
  // draft: true,
  // socialImage: "/og/es2026-features.png",
};

## The post starts here

Write Markdown and, where needed, JSX or imported React components.
```

The loader validates every module and exposes a typed `PostMetadata` record.
Authors provide these fields:

| Field         | Required | Contract                                                                                            |
| ------------- | -------- | --------------------------------------------------------------------------------------------------- |
| `title`       | Yes      | Non-empty string.                                                                                   |
| `description` | Yes      | Non-empty string used for summaries and metadata.                                                   |
| `slug`        | Yes      | Lowercase letters and numbers separated by single hyphens; it must be unique.                       |
| `publishedAt` | Yes      | Valid calendar date in `YYYY-MM-DD` format.                                                         |
| `updatedAt`   | No       | Same date format; it cannot precede `publishedAt`.                                                  |
| `tags`        | No       | String array; defaults to `[]`, trims values, and rejects empty or case-insensitive duplicate tags. |
| `draft`       | No       | Boolean; defaults to `false`.                                                                       |
| `socialImage` | No       | Root-relative path or absolute URL for sharing metadata.                                            |

`author` is site-wide configuration in `util/site.ts`, not a per-post field.
The loader calculates `wordCount` and `readingTimeMinutes` from the MDX source
at 220 words per minute, rounding reading time up and never returning less than
one minute. Fenced code blocks do not count toward either value. These calculated
fields must not be authored in the MDX metadata.

Draft behavior depends on the loader used:

- Development listings include drafts by default so they can be previewed.
- Production listings, tag pages, RSS, and the sitemap include published posts
  only.
- Invalid metadata and duplicate slugs fail with the source filename in the
  error message.

Tags are displayed using their authored names and routed using a normalized
lowercase hyphen slug. The tag index is available at `/blog/tags`; a tag page is
available at `/blog/tags/<tag-slug>`.

> **Security boundary:** Files under `posts/` are trusted source code. MDX can
> import modules and execute JavaScript or JSX during the build and on the
> server. Never compile user-provided, CMS-provided, uploaded, or otherwise
> untrusted MDX directly. Render untrusted content with a sanitized Markdown
> pipeline or isolate it in a separate sandboxed service.

## MDX and styling pipeline

Vite compiles local `.mdx` files with `@mdx-js/rollup`. The configuration in
`vite.config.ts` uses:

- `remark-gfm` for GitHub-Flavored Markdown.
- `rehype-slug` and `rehype-autolink-headings` for stable linked headings.
- Shiki with GitHub light and dark themes for syntax highlighting. Unknown code
  languages fall back to plain text.

`mdx-components.tsx` provides shared renderers for internal and external links,
copyable code blocks, and horizontally scrollable tables. Tailwind CSS 4 and
`@tailwindcss/typography` style the rendered article with the `prose` classes.

## Site URL, metadata, and feeds

`SITE_URL` controls absolute URLs used by canonical metadata, Open Graph data,
RSS items, and the sitemap. It defaults to:

```text
https://www.santoshk.me
```

Set it for previews or other deployments, for example:

```sh
SITE_URL=https://preview.example.com pnpm build
```

`SITE_URL` must be an absolute `http:` or `https:` URL without a username or
password. The site configuration removes any path, query string, or fragment
and keeps only the origin. Invalid values fail during configuration rather than
silently producing incorrect links.

Next.js metadata provides the site title template, canonical URL, RSS alternate,
Open Graph defaults, and Twitter card defaults. Post metadata supplies the post
title, description, publication dates, tags, and optional `socialImage`.

The public discovery endpoints are:

| URL            | Purpose                                                                                                 |
| -------------- | ------------------------------------------------------------------------------------------------------- |
| `/rss.xml`     | RSS feed containing published posts, ordered newest first. XML values are escaped before serialization. |
| `/sitemap.xml` | Sitemap for the home page, blog pages, tag pages, and published posts.                                  |
| `/robots.txt`  | Crawler policy with a link to the sitemap.                                                              |
| `/icon.png`    | Next.js app icon from `app/icon.png`.                                                                   |

The native `app/opengraph-image.tsx` route generates the site-level Open Graph
image. Open Graph and Twitter metadata use it when a post does not specify
`socialImage`; a post can override it with a root-relative asset or an absolute
URL. Keep all generated absolute URLs based on `SITE_URL` so previews, feeds,
and crawlers agree on the canonical host.

## Deployment

The production site is [www.santoshk.me](https://www.santoshk.me), served by the
`personal-blog` Cloudflare Worker. The root domain redirects to `www` through a
Cloudflare Redirect Rule. `next.config.ts` supplies routing extensions and
security headers to vinext; there is no separate Next.js deployment.

```sh
pnpm dev       # Vite development server on port 3000
pnpm build     # production Worker and prerendered assets
pnpm start     # local production Workers preview
pnpm test:e2e  # browser checks against the Worker
pnpm deploy    # build and publish the Worker
```

Set `SITE_URL` to the public canonical origin and use the pinned Node.js and
pnpm versions from `package.json`. Publishing content requires a rebuild and
deployment.

#### Automatic deployments

Use [Cloudflare Workers Builds](https://developers.cloudflare.com/workers/ci-cd/builds/)
to connect the existing `personal-blog` Worker to `skalidindi/personal-blog`.
In the Worker's **Settings > Builds**, use:

| Setting           | Value                                         |
| ----------------- | --------------------------------------------- |
| Production branch | `main`                                        |
| Build command     | `pnpm check && pnpm build`                    |
| Deploy command    | `pnpm exec cf deploy --prebuilt`              |
| Preview command   | `pnpm exec vinext-cloudflare previews deploy` |
| Root directory    | Repository root                               |

The build command checks the code, then creates the Worker and prerendered
assets. The deploy command publishes that existing Cloudflare Build Output.
Leave branch preview builds disabled initially. If enabled later, the preview
command creates separate Preview output and derives its name from the CI
branch; it does not promote the Worker to production. This rebuild is required
because production Build Output cannot be deployed as a Preview. Cloudflare
manages the deployment API token; no Cloudflare token needs to be added to
GitHub Actions.

Workers Builds detects pnpm 12.14.0 from `packageManager` and Node 24.22.1
from `.node-version`, then installs dependencies automatically. Keep those
pins aligned when updating runtime versions. See the
[build image documentation](https://developers.cloudflare.com/workers/ci-cd/builds/build-image/).

GitHub Actions checks quality and runs the eight browser tests against the
local Cloudflare Worker. Require these checks before merging pull requests;
Workers Builds runs `pnpm check` again before deploying each push to `main`.

The setup follows the [vinext Cloudflare guide](https://vinext.dev/docs/deploying/cloudflare)
and the installed `@vinext/cloudflare` adapters. Pages use the read-only Static
Assets cache; no KV data cache is configured. Publishing content requires a
rebuild and deployment. The `ASSETS` binding uses the adapter's default name.
`runWorkerFirst: ["/*", ...]` protects the private `/_vinext/static-cache/`
files; adding that directory as a second positive rule is redundant and rejected
by the Cloudflare plugin. `IMAGES` supplies Cloudflare image optimization.

See the [migration research](docs/cloudflare-migration-review.md) for official
sources, upstream fixes, and conditions for removing the workarounds.

Compatibility workarounds and limitations:

- MDX is configured explicitly with `@mdx-js/rollup` because vinext 1.3.0's
  automatic setup forwards Next's string plugin names without resolving them.
  The Vite plugin filter excludes `?raw` imports because MDX otherwise compiles
  source text that the post loader needs as a string. This is the one custom
  plugin integration; no dependency files are patched.
- `util/post-sources.ts` uses documented `import.meta.glob` and `?raw` imports
  to bundle content. Workers cannot assume the source checkout exists.
- React Compiler is enabled through `vinext({ react: { compiler: true } })`.
  Vite 8 also requires the installed optional `oxc-transform-react` package.
- Vinext currently treats React `ViewTransition` as a passthrough, so transition
  animations are unavailable.
- Sentry runtime configuration remains present; production reporting has not
  been verified. Vite source map upload is not configured.
- Node-based prerendering warns that the Images binding is unavailable and
  falls back to unoptimized images. The actual Workers preview uses `IMAGES`.
  The beta RSC build also reports upstream source map and chunking warnings.

If pnpm fails while switching to a missing managed version, repair the local
pnpm/Volta installation before retrying. `pnpm install` alone does not add
dependencies that the interrupted initializer never recorded. Do not rerun
`vinext init` over this configured project; its static-cache validation rejects
an existing Cloudflare configuration.

## License

Distributed under the MIT License. See [LICENSE](LICENSE).
