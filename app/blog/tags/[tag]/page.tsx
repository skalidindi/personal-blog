import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { BackNav } from "@/components/BackNav";
import { PostLink } from "@/components/PostLink";
import { getPublishedPosts, getTags, tagSlug } from "@/util/post";

type TagPageProps = {
  params: Promise<{ tag: string }>;
};

export const dynamicParams = false;

export async function generateStaticParams() {
  return (await getTags()).map(({ slug }) => ({ tag: slug }));
}

async function findTag(slug: string) {
  const tag = (await getTags()).find((candidate) => candidate.slug === slug);
  if (!tag) {
    notFound();
  }
  return tag;
}

export async function generateMetadata({
  params,
}: TagPageProps): Promise<Metadata> {
  const { tag: slug } = await params;
  const tag = await findTag(slug);
  const title = `${tag.name} notes`;
  const description = `Engineering notes filed under ${tag.name}.`;
  const url = `/blog/tags/${tag.slug}`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { type: "website", url, title, description },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function TagPage({ params }: TagPageProps) {
  const { tag: slug } = await params;
  const tag = await findTag(slug);
  const posts = (await getPublishedPosts()).filter((post) =>
    post.tags.some((name) => tagSlug(name) === tag.slug),
  );

  return (
    <main className="mx-auto min-h-dvh w-full max-w-6xl px-5 py-8 pb-16 lg:px-8">
      <BackNav href="/blog/tags" heading="Topics" />
      <header className="my-16 max-w-3xl">
        <p className="mb-3 text-xs font-bold tracking-[0.13em] text-blue-600 uppercase dark:text-blue-400">
          Topic
        </p>
        <h1 className="text-5xl leading-none font-bold tracking-[-0.055em] sm:text-7xl">
          {tag.name}
        </h1>
        <p className="mt-5 text-lg leading-8 text-gray-600 dark:text-gray-300">
          {tag.count}{" "}
          {tag.count === 1 ? "engineering note" : "engineering notes"}
        </p>
      </header>
      <section aria-label={`${tag.name} posts`} className="grid gap-4">
        {posts.map((post) => (
          <PostLink key={post.slug} post={post} />
        ))}
      </section>
    </main>
  );
}
