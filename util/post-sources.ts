// Vite bundles the MDX and raw text; Workers do not contain the source checkout.
const modules = import.meta.glob("../posts/*.mdx");
const sources = import.meta.glob<string>("../posts/*.mdx", {
  query: "?raw",
  import: "default",
  eager: true,
});

export async function loadPostSources() {
  return Promise.all(
    Object.keys(modules)
      .sort()
      .map(async (modulePath) => ({
        sourceFile: modulePath.slice("../posts/".length),
        source: sources[modulePath],
        postModule: await modules[modulePath](),
      })),
  );
}
