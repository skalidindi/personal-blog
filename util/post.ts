import fs from "node:fs";
import path from "node:path";

import GithubSlugger from "github-slugger";
import { notFound } from "next/navigation";
import { cache, type ComponentType } from "react";

const WORDS_PER_MINUTE = 220;
const POST_SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const MARKDOWN_LINK_PATTERN = /!?(?:\[([^\]]+)\])\([^\s)]+(?:\s+"[^"]*")?\)/g;

export type PostMetadata = {
  title: string;
  description: string;
  slug: string;
  publishedAt: string;
  updatedAt?: string;
  tags: string[];
  draft: boolean;
  socialImage?: string;
  readingTimeMinutes: number;
  wordCount: number;
};

export type PostHeading = {
  depth: 2 | 3;
  id: string;
  text: string;
};

export type Post = PostMetadata & {
  Content: ComponentType;
  headings: PostHeading[];
  sourceFile: string;
};

type PostModule = {
  default: ComponentType;
  metadata: unknown;
};

type FilterOptions = {
  includeDrafts?: boolean;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isPostModule(value: unknown): value is PostModule {
  return (
    isRecord(value) &&
    "metadata" in value &&
    typeof value.default === "function"
  );
}

function getPostsDirectory() {
  return path.join(process.cwd(), "posts");
}

function getPostFilenames() {
  return fs
    .readdirSync(getPostsDirectory())
    .filter((filename) => filename.endsWith(".mdx"))
    .sort();
}

function metadataError(
  sourceFile: string,
  field: string,
  detail: string,
): never {
  throw new Error(`${sourceFile}: metadata.${field} ${detail}`);
}

function requiredString(
  metadata: Record<string, unknown>,
  field: string,
  sourceFile: string,
) {
  const value = metadata[field];

  if (typeof value !== "string" || value.trim() === "") {
    metadataError(sourceFile, field, "must be a non-empty string");
  }

  return value.trim();
}

function optionalString(
  metadata: Record<string, unknown>,
  field: string,
  sourceFile: string,
) {
  const value = metadata[field];

  if (value === undefined) {
    return undefined;
  }

  if (typeof value !== "string" || value.trim() === "") {
    metadataError(sourceFile, field, "must be a non-empty string when set");
  }

  return value.trim();
}

function validateDate(value: string, field: string, sourceFile: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    metadataError(sourceFile, field, "must use YYYY-MM-DD format");
  }

  const parsed = new Date(`${value}T00:00:00.000Z`);

  if (
    Number.isNaN(parsed.valueOf()) ||
    parsed.toISOString().slice(0, 10) !== value
  ) {
    metadataError(sourceFile, field, "must be a valid calendar date");
  }
}

function validateTags(value: unknown, sourceFile: string) {
  if (value === undefined) {
    return [];
  }

  if (!Array.isArray(value) || value.some((tag) => typeof tag !== "string")) {
    metadataError(sourceFile, "tags", "must be an array of strings");
  }

  const tags = value.map((tag) => tag.trim());
  if (tags.some((tag) => tag === "")) {
    metadataError(sourceFile, "tags", "cannot contain empty values");
  }

  if (new Set(tags.map((tag) => tag.toLowerCase())).size !== tags.length) {
    metadataError(sourceFile, "tags", "cannot contain duplicates");
  }

  const slugs = tags.map(tagSlug);
  if (slugs.some((slug) => slug === "")) {
    metadataError(sourceFile, "tags", "must contain letters or numbers");
  }
  if (new Set(slugs).size !== slugs.length) {
    metadataError(sourceFile, "tags", "must have unique URL slugs");
  }

  return tags;
}

function stripMarkdownLinks(value: string) {
  return value.replace(MARKDOWN_LINK_PATTERN, "$1");
}

export function calculateReadingStats(source: string) {
  const content = source
    .replace(/^export\s+const\s+metadata\s*=\s*\{[\s\S]*?^\};?\s*/m, "")
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`([^`]+)`/g, "$1")
    .replace(MARKDOWN_LINK_PATTERN, "$1")
    .replace(/<[^>]+>/g, " ");
  const words = content.match(/[\p{L}\p{N}]+(?:['’_-][\p{L}\p{N}]+)*/gu) ?? [];
  const wordCount = words.length;

  return {
    readingTimeMinutes: Math.max(1, Math.ceil(wordCount / WORDS_PER_MINUTE)),
    wordCount,
  };
}

export function validatePostMetadata(
  value: unknown,
  source: string,
  sourceFile: string,
): PostMetadata {
  if (!isRecord(value)) {
    throw new Error(`${sourceFile}: metadata must be an object`);
  }

  const metadata = value;
  const title = requiredString(metadata, "title", sourceFile);
  const description = requiredString(metadata, "description", sourceFile);
  const slug = requiredString(metadata, "slug", sourceFile);
  const publishedAt = requiredString(metadata, "publishedAt", sourceFile);
  const updatedAt = optionalString(metadata, "updatedAt", sourceFile);
  const socialImage = optionalString(metadata, "socialImage", sourceFile);

  if (!POST_SLUG_PATTERN.test(slug)) {
    metadataError(
      sourceFile,
      "slug",
      "must contain lowercase letters, numbers, and single hyphens only",
    );
  }

  validateDate(publishedAt, "publishedAt", sourceFile);
  if (updatedAt) {
    validateDate(updatedAt, "updatedAt", sourceFile);
    if (updatedAt < publishedAt) {
      metadataError(sourceFile, "updatedAt", "cannot precede publishedAt");
    }
  }

  if (metadata.draft !== undefined && typeof metadata.draft !== "boolean") {
    metadataError(sourceFile, "draft", "must be a boolean");
  }

  if (
    socialImage &&
    !socialImage.startsWith("/") &&
    !URL.canParse(socialImage)
  ) {
    metadataError(sourceFile, "socialImage", "must be a path or absolute URL");
  }

  return {
    title,
    description,
    slug,
    publishedAt,
    updatedAt,
    tags: validateTags(metadata.tags, sourceFile),
    draft: metadata.draft ?? false,
    socialImage,
    ...calculateReadingStats(source),
  };
}

export function assertUniquePostSlugs(
  posts: Array<{ slug: string; sourceFile: string }>,
) {
  const sourcesBySlug = new Map<string, string>();

  for (const { slug, sourceFile } of posts) {
    const normalizedSlug = slug.toLowerCase();
    const previousSource = sourcesBySlug.get(normalizedSlug);
    if (previousSource) {
      throw new Error(
        `Duplicate post slug "${slug}" in ${previousSource} and ${sourceFile}`,
      );
    }
    sourcesBySlug.set(normalizedSlug, sourceFile);
  }
}

export function filterAndSortPosts<
  T extends Pick<PostMetadata, "draft" | "publishedAt">,
>(posts: T[], { includeDrafts = false }: FilterOptions = {}) {
  return posts
    .filter((post) => includeDrafts || !post.draft)
    .toSorted((left, right) =>
      right.publishedAt.localeCompare(left.publishedAt),
    );
}

function headingText(markdown: string) {
  return stripMarkdownLinks(markdown)
    .replace(/[`*_~]/g, "")
    .trim();
}

export function extractHeadings(source: string): PostHeading[] {
  const slugger = new GithubSlugger();
  const headings: PostHeading[] = [];
  const lines = source.replace(/```[\s\S]*?```/g, "").split("\n");

  for (const [index, line] of lines.entries()) {
    const heading = /^(#{2,3})\s+(.+?)\s*#*$/.exec(line);
    const setextHeading =
      index < lines.length - 1 && /^-{3,}\s*$/.test(lines[index + 1]);
    if (!heading && !setextHeading) {
      continue;
    }

    const text = headingText(heading?.[2] ?? line);
    if (!text) {
      continue;
    }
    headings.push({
      depth: heading?.[1] === "###" ? 3 : 2,
      id: slugger.slug(text),
      text,
    });
  }

  return headings;
}

const loadPosts = cache(async (): Promise<Post[]> => {
  const posts = await Promise.all(
    getPostFilenames().map(async (sourceFile) => {
      const fileSlug = sourceFile.replace(/\.mdx$/, "");
      const source = fs.readFileSync(
        path.join(getPostsDirectory(), sourceFile),
        "utf8",
      );
      const postModule: unknown = await import(`@/posts/${fileSlug}.mdx`);
      if (!isPostModule(postModule)) {
        throw new Error(
          `${sourceFile}: must export metadata and a default MDX component`,
        );
      }
      const metadata = validatePostMetadata(
        postModule.metadata,
        source,
        sourceFile,
      );

      return {
        ...metadata,
        Content: postModule.default,
        headings: extractHeadings(source),
        sourceFile,
      };
    }),
  );

  assertUniquePostSlugs(posts);
  return posts;
});

export async function getPosts(options: FilterOptions = {}) {
  const includeDrafts =
    options.includeDrafts ?? process.env.NODE_ENV !== "production";
  return filterAndSortPosts(await loadPosts(), { includeDrafts });
}

export async function getPublishedPosts() {
  return filterAndSortPosts(await loadPosts());
}

export async function getPost(slug: string) {
  const post = (await getPosts()).find((candidate) => candidate.slug === slug);

  if (!post) {
    notFound();
  }

  return post;
}

export function tagSlug(tag: string) {
  return tag
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export async function getTags() {
  const posts = await getPublishedPosts();
  const counts = new Map<string, { name: string; count: number }>();

  for (const post of posts) {
    for (const tag of post.tags) {
      const slug = tagSlug(tag);
      const current = counts.get(slug);
      counts.set(slug, {
        name: current?.name ?? tag,
        count: (current?.count ?? 0) + 1,
      });
    }
  }

  return [...counts.entries()]
    .map(([slug, value]) => ({ slug, ...value }))
    .toSorted((left, right) => left.name.localeCompare(right.name));
}
