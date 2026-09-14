import Link from "next/link";

import { TagList } from "@/components/TagList";
import { formatDate } from "@/util/date";
import type { PostMetadata } from "@/util/post";

type PostLinkProps = {
  post: Pick<
    PostMetadata,
    | "description"
    | "publishedAt"
    | "readingTimeMinutes"
    | "slug"
    | "tags"
    | "title"
  >;
};

export function PostLink({ post }: PostLinkProps) {
  return (
    <article className="rounded-xl border border-gray-200 p-6 dark:border-gray-800">
      <div className="flex flex-wrap items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
        <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
        <span aria-hidden="true">/</span>
        <span>{post.readingTimeMinutes} min read</span>
      </div>
      <h2 className="mt-3 text-2xl font-bold tracking-tight">
        <Link
          className="hover:text-blue-600 dark:hover:text-blue-400"
          href={`/blog/${post.slug}`}
        >
          {post.title}
        </Link>
      </h2>
      <p className="mt-2 leading-7 text-gray-600 dark:text-gray-300">
        {post.description}
      </p>
      <TagList tags={post.tags} />
    </article>
  );
}
