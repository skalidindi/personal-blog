import Link from "next/link";

import { tagSlug } from "@/util/post";

export function TagList({ tags }: { tags: string[] }) {
  if (tags.length === 0) {
    return null;
  }

  return (
    <ul aria-label="Tags" className="mt-4 flex flex-wrap gap-2">
      {tags.map((tag) => (
        <li key={tag}>
          <Link
            className="inline-flex rounded-full bg-gray-100 px-2.5 py-1 text-xs font-semibold text-gray-700 hover:bg-blue-100 hover:text-blue-800 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-blue-950 dark:hover:text-blue-200"
            href={`/blog/tags/${tagSlug(tag)}`}
          >
            {tag}
          </Link>
        </li>
      ))}
    </ul>
  );
}
