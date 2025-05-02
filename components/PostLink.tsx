import { Post } from "@/app/blog/page";
import { formatDate } from "@/util/date";
import Link from "next/link";

export function PostLink({ post }: { post: Post }) {
  return (
    <Link
      className="flex flex-col px-4 py-2 bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg dark:hover:drop-shadow-[0_4px_4px_rgba(255,255,255,0.15)] transition-shadow duration-300"
      href={`/blog/${post.slug}`}
    >
      <time
        className="text-sm text-gray-600 dark:text-gray-400"
        dateTime={post.date}
      >
        {formatDate(post.date)}
      </time>
      <h2 className="font-semibold text-gray-900 dark:text-gray-100">
        {post.title}
      </h2>
    </Link>
  );
}
