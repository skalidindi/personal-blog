import fs from "node:fs";
import path from "node:path";

export async function loadPostSources() {
  const directory = path.join(process.cwd(), "posts");
  return Promise.all(
    fs
      .readdirSync(directory)
      .filter((file) => file.endsWith(".mdx"))
      .sort()
      .map(async (sourceFile) => ({
        sourceFile,
        source: fs.readFileSync(path.join(directory, sourceFile), "utf8"),
        postModule: (await import(
          `@/posts/${sourceFile.replace(/\.mdx$/, "")}.mdx`
        )) as unknown,
      })),
  );
}
