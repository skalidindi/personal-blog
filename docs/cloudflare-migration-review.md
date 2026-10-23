# Cloudflare migration review

Reviewed online on 2026-10-21, against the installed releases and current official
documentation. The configuration follows vinext's supported Cloudflare setup.
Two MDX compatibility measures remain necessary; neither patches dependencies.

## Findings

| Choice                                                           | Assessment                                                                                                             | Evidence                                                                                                                                                                                                                                                                                                                          |
| ---------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `cf/config`, Cloudflare Vite plugin v2, native vinext entrypoint | Recommended setup. Keep the v2 beta channel; npm's `latest` plugin tag currently points to v1.                         | [vinext Cloudflare deployment](https://github.com/cloudflare/vinext/blob/main/docs/deploying/cloudflare.mdx) explicitly installs `cf` and plugin v2.                                                                                                                                                                              |
| Worker-first routing with both `_next/static` exclusions         | Matches the documented example exactly. The broad `/*` already protects private cache files.                           | [Middleware and static files](https://github.com/cloudflare/vinext/blob/main/docs/deploying/cloudflare.mdx#middleware-and-static-files), [Static Assets cache](https://github.com/cloudflare/vinext/blob/main/docs/caching.mdx#static-assets-response-cache).                                                                     |
| Static Assets cache; no KV data cache                            | Supported for immutable blog output. Rebuild and redeploy to publish changes; this is not runtime ISR.                 | [vinext caching](https://github.com/cloudflare/vinext/blob/main/docs/caching.mdx#static-assets-response-cache) describes the read-only adapter and optional separate data cache.                                                                                                                                                  |
| Vite content imports instead of runtime checkout reads           | Standard Vite functionality, appropriate for Workers.                                                                  | [Glob imports](https://vite.dev/guide/features.html#glob-import), [custom queries](https://vite.dev/guide/features.html#custom-queries), [Workers filesystem](https://developers.cloudflare.com/workers/runtime-apis/nodejs/fs/).                                                                                                 |
| Explicit MDX plugin functions                                    | Supported MDX integration, working around vinext's unresolved Next string plugin options.                              | [MDX Rollup integration](https://mdxjs.com/packages/rollup/), [MDX plugin options](https://mdxjs.com/packages/mdx/#processoroptions). Installed vinext 1.3.0's `ensureMdxDelegate` passes these arrays through without resolving their string entries. This last finding is source inspection, not a claimed upstream bug report. |
| MDX transform hook filter excluding `?raw`                       | Valid compatibility workaround using an official Vite API. Keep until a released MDX plugin supports the query itself. | [Vite hook filters](https://vite.dev/guide/api-plugin.html#hook-filters), [MDX PR #2680](https://github.com/mdx-js/mdx/pull/2680).                                                                                                                                                                                                |
| `ASSETS` and `IMAGES` bindings                                   | Standard adapters with their documented default binding names.                                                         | [Official Cloudflare adapters](https://github.com/cloudflare/vinext/blob/main/packages/cloudflare/README.md).                                                                                                                                                                                                                     |

### Why the MDX filter still exists

MDX PR #2680, "Support Vite raw and url query parameters", merged on July 5, 2026. The current npm release is still `@mdx-js/rollup` 3.1.1. Its transform
removes the query before deciding whether to compile an MDX file, so it also
compiles a `?raw` source import. The Vite hook filter prevents that call.
The upstream PR is evidence for the query bug; it does not address vinext's
separate handling of Next's string plugin options.

The initial migration kept a Vite alias and a separate Next filesystem loader.
After the production cutover, the bundled loader became the sole implementation
in `util/post-sources.ts`; the alias and the filesystem loader were removed.

Workers **does support `node:fs`** under our compatibility settings. Its read-only
`/bundle` directory contains bundled modules, not the original source checkout.
The earlier `/bundle/posts` failure was a packaging assumption, not a missing
filesystem API. Explicit Vite imports avoid adding another file-packaging path.

Do not add all generated Worker globals to this browser app's TypeScript
compilation: the generated HTMLRewriter `Element` declarations conflict with DOM
types. This app currently accesses bindings through the adapters, so those
globals are unnecessary. If application code starts importing native Worker
bindings, give Worker code its own TypeScript configuration as recommended by
[Cloudflare's TypeScript guidance](https://developers.cloudflare.com/workers/languages/typescript/).

## Dependency refresh

All 48 direct dependencies were compared with the live npm registry, rather
than relying solely on cached `pnpm outdated` results. Eleven packages changed:
Sentry 11.8.0, vinext 1.3.0, its Cloudflare adapter 1.2.0, Cloudflare Vite plugin
2.0.0-beta.v.3, `cf` beta.20, Vite 8.3.5, Lucide 1.61.0, Knip 6.42.1,
Oxfmt 0.74.0, Oxlint 1.89.0, and Node 24 types 24.19.2.

Node is updated within the selected 24 release line to 24.22.1; pnpm is pinned
to 12.14.0. Node types intentionally track Node 24, rather than the registry's
Node 26 types. Cloudflare Vite plugin intentionally tracks the required v2 beta,
rather than downgrading to the stable v1 `latest` tag. Registry tags can change
after this review.

pnpm added exact-version `minimumReleaseAgeExclude` entries for six freshly
published packages in `pnpm-workspace.yaml`, including the transitive Response
Store package. These are explicit exceptions needed to install those latest
releases immediately; the general release-age policy is not disabled. Remove
the entries once those releases meet the configured age requirement.

The [Sentry 11 migration guide](https://github.com/getsentry/sentry-javascript/blob/11.8.0/MIGRATION.md)
was checked against the actual configuration. Existing imports and build options
already match v11. Client, server, and edge configs use Sentry 11's default
data collection settings, including `userInfo` and `queues`, as requested. Next's Sentry build plugin still does not upload maps for the Vite
build; production reporting remains unverified.

## Limits

React ViewTransition animations remain unavailable under vinext's shim. The
Node prerender phase still warns about the unavailable Images binding, while
the actual Workers preview serves the optimized portrait. RSC source map and
chunking warnings remain upstream build limitations. These are not hidden by
our configuration.

## Verification after the refresh

Both production builds, TypeScript, lint, formatting, 24 unit tests, and all
eight Workers browser tests passed. Browser checks include feeds, both social
images, the portrait optimizer, uncached 404s, cache privacy, mobile layout,
code copying, theme persistence, and accessibility. Production deployment and
Sentry delivery were not exercised.

### Knip in linked worktrees

Knip 6.42.1 hangs when its Lefthook plugin discovers generated Git hooks in the
shared main checkout. The bounded reproduction timed out after 12 seconds;
restricting Lefthook configuration discovery to `lefthook.yml` completes in
under a second. Vite, Next, and Vitest config loading are not the cause and
remain enabled.

`knip.json` uses the documented
[plugin configuration override](https://knip.dev/reference/configuration#plugins)
to analyze `lefthook.yml` without following generated hooks outside the worktree.
The single `ignoreDependencies: ["lefthook"]` entry accounts for the binary
invoked by those generated hooks, which are no longer scanned. Hook commands
remain analyzed. `cloudflare.config.ts` is an explicit CLI configuration entry
point so its imports are also checked. No application files or dependencies
are excluded to make the check pass.

After this correction, the complete `pnpm check` command passes, including
Knip. Knip also exits successfully with `CI=true`; in that mode its plugin
recognizes the Lefthook binary directly and emits an informational hint about
the local-only dependency exclusion.

## Retirement of the previous deployment (2026-10-23)

Cloudflare Workers is now the only build and deployment target. The default
`dev`, `build`, `start`, `deploy`, and E2E commands use vinext and Vite;
`vinext typegen` generates route types. The parallel Next.js build, its MDX
loader, Vercel Analytics, Speed Insights, script CSP exception, and Sentry
webpack/Vercel monitor configuration have been removed. Sentry runtime
instrumentation remains configured.

`next.config.ts` remains as a plain configuration file for vinext's supported
headers and page extensions. The `next` dependency and `next/*` imports provide
API/type compatibility. The upstream `@vercel/og` dependency remains required
by the social-image implementation; it does not require Vercel hosting.

The domain is served by Cloudflare, and the Vercel project was deleted by its
owner. The earlier deployment and verification statements above describe the
migration at the time of that review.
