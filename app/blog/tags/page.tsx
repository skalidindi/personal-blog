import type { Metadata } from "next";
import Link from "next/link";

import { BackNav } from "@/components/BackNav";
import { getTags } from "@/util/post";

const title = "Topics";
const description = "Browse engineering notes by topic.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/blog/tags" },
  openGraph: { type: "website", url: "/blog/tags", title, description },
  twitter: { card: "summary_large_image", title, description },
};

export default async function TagsPage() {
  const tags = await getTags();

  return (
    <main className="mx-auto min-h-dvh w-full max-w-6xl px-5 py-8 pb-16 lg:px-8">
      <BackNav href="/blog" heading="Engineering notes" />
      <header className="my-16 max-w-3xl">
        <h1 className="text-5xl leading-none font-bold tracking-[-0.055em] sm:text-7xl">
          Topics
        </h1>
        <p className="mt-5 text-lg leading-8 text-gray-600 dark:text-gray-300">
          Browse notes by language, platform, or engineering concern.
        </p>
      </header>
      <ul className="grid gap-3">
        {tags.map((tag) => (
          <li key={tag.slug}>
            <Link
              className="flex items-center justify-between border-b border-gray-200 py-4 font-semibold dark:border-gray-800"
              href={`/blog/tags/${tag.slug}`}
            >
              <span>{tag.name}</span>
              <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
                {tag.count} {tag.count === 1 ? "post" : "posts"}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
