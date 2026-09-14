import type { Metadata } from "next";
import Link from "next/link";

import { BackNav } from "@/components/BackNav";
import { PostLink } from "@/components/PostLink";
import { getPosts } from "@/util/post";

const title = "Engineering notes";
const description =
  "Notes on JavaScript, web platforms, and reliable software engineering.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/blog" },
  openGraph: { type: "website", url: "/blog", title, description },
  twitter: { card: "summary_large_image", title, description },
};

export default async function BlogsList() {
  const posts = await getPosts();

  return (
    <main className="mx-auto min-h-dvh w-full max-w-6xl px-5 py-8 pb-16 lg:px-8">
      <BackNav href="/" heading="Home" />
      <header className="my-16 max-w-3xl">
        <h1 className="text-5xl leading-none font-bold tracking-[-0.055em] sm:text-7xl">
          Engineering notes
        </h1>
        <p className="mt-5 text-lg leading-8 text-gray-600 dark:text-gray-300">
          Practical details from building and operating software.
        </p>
        <Link
          className="mt-6 inline-block font-semibold underline underline-offset-4 hover:text-blue-600 dark:hover:text-blue-400"
          href="/blog/tags"
        >
          Browse by topic
        </Link>
      </header>
      <section aria-label="Posts" className="grid gap-4">
        {posts.map((post) => (
          <PostLink key={post.slug} post={post} />
        ))}
      </section>
    </main>
  );
}
