import fs from "node:fs";
import path from "node:path";

import type { ComponentType } from "react";

export type PostMetadata = {
  author: string;
  date: string;
  description: string;
  title: string;
};

type PostModule = {
  default: ComponentType;
  metadata: PostMetadata;
};

export function getPostsDirectory() {
  return path.join(process.cwd(), "posts");
}

export function getPostSlugs() {
  const postsDirectory = getPostsDirectory();

  return fs
    .readdirSync(postsDirectory)
    .filter((filename) => filename.endsWith(".mdx"))
    .map((filename) => filename.replace(/\.mdx$/, ""))
    .sort();
}

export async function getPost(slug: string): Promise<PostModule> {
  return import(`@/posts/${slug}.mdx`);
}
