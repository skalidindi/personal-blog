import fs from "node:fs";
import path from "node:path";

import { notFound } from "next/navigation";
import type { ComponentType } from "react";

type PostMetadata = {
  author: string;
  date: string;
  description: string;
  title: string;
};

type PostModule = {
  default: ComponentType;
  metadata: PostMetadata;
};

function getPostsDirectory() {
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
  if (!getPostSlugs().includes(slug)) {
    notFound();
  }

  return import(`@/posts/${slug}.mdx`);
}
