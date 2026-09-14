import type { Metadata } from "next";
import Link from "next/link";

import { BackNav } from "@/components/BackNav";
import { ShareButton } from "@/components/ShareButton";
import { TableOfContents } from "@/components/TableOfContents";
import { TagList } from "@/components/TagList";
import { formatDate } from "@/util/date";
import { getPost, getPosts, getPublishedPosts } from "@/util/post";
import { serializeJsonLd } from "@/util/seo";
import { absoluteUrl, siteConfig } from "@/util/site";

type PostPageProps = {
  params: Promise<{ slug: string }>;
};

export const dynamicParams = false;

export async function generateStaticParams() {
  return (await getPosts()).map(({ slug }) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  const canonicalPath = `/blog/${post.slug}`;
  const image = post.socialImage ?? `${canonicalPath}/opengraph-image`;

  return {
    title: post.title,
    description: post.description,
    authors: [siteConfig.author],
    keywords: post.tags,
    alternates: { canonical: canonicalPath },
    openGraph: {
      type: "article",
      url: canonicalPath,
      siteName: siteConfig.name,
      title: post.title,
      description: post.description,
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt ?? post.publishedAt,
      authors: [siteConfig.author.name],
      tags: post.tags,
      images: [{ url: image, alt: post.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
      images: [image],
    },
  };
}

export default async function PostPage({ params }: PostPageProps) {
  const { slug } = await params;
  const post = await getPost(slug);
  const publishedPosts = await getPublishedPosts();
  const postIndex = publishedPosts.findIndex(
    (candidate) => candidate.slug === post.slug,
  );
  const newerPost = publishedPosts[postIndex - 1];
  const olderPost = publishedPosts[postIndex + 1];
  const canonicalUrl = absoluteUrl(`/blog/${post.slug}`);
  const image = absoluteUrl(
    post.socialImage ?? `/blog/${post.slug}/opengraph-image`,
  );
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    url: canonicalUrl,
    mainEntityOfPage: { "@type": "WebPage", "@id": canonicalUrl },
    author: {
      "@type": "Person",
      name: siteConfig.author.name,
      url: siteConfig.author.url,
    },
    datePublished: post.publishedAt,
    dateModified: post.updatedAt ?? post.publishedAt,
    image,
    keywords: post.tags.join(", "),
  };
  const { Content } = post;

  return (
    <main className="mx-auto min-h-dvh w-full max-w-6xl px-5 py-8 pb-16 lg:px-8">
      <script
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(jsonLd) }}
        type="application/ld+json"
      />
      <BackNav href="/blog" heading="Engineering notes" />
      <header className="my-16 grid max-w-3xl gap-5">
        <div>
          <p className="mb-3 text-xs font-bold tracking-[0.13em] text-blue-600 uppercase dark:text-blue-400">
            Engineering note
          </p>
          <h1 className="text-5xl leading-none font-bold tracking-[-0.055em] sm:text-7xl">
            {post.title}
          </h1>
          <p className="mt-5 text-lg leading-8 text-gray-600 dark:text-gray-300">
            {post.description}
          </p>
        </div>
        <ShareButton
          path={post.slug}
          text={post.description}
          title={post.title}
        />
        <div className="flex flex-wrap items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
          <span>By {siteConfig.author.name}</span>
          <span aria-hidden="true">·</span>
          <time dateTime={post.publishedAt}>
            {formatDate(post.publishedAt)}
          </time>
          <span aria-hidden="true">·</span>
          <span>{post.readingTimeMinutes} min read</span>
        </div>
        <TagList tags={post.tags} />
      </header>

      <div className="grid min-w-0 gap-12 lg:grid-cols-[13rem_minmax(0,48rem)]">
        <TableOfContents headings={post.headings} />
        <article className="prose prose-slate min-w-0 max-w-none prose-headings:scroll-mt-8 prose-headings:tracking-tight prose-a:underline-offset-4 dark:prose-invert">
          <Content />
        </article>
      </div>

      {(olderPost || newerPost) && (
        <nav
          aria-label="More posts"
          className="mt-20 grid grid-cols-2 gap-4 border-t border-gray-200 pt-8 dark:border-gray-800"
        >
          {olderPost ? (
            <Link className="font-semibold" href={`/blog/${olderPost.slug}`}>
              <span className="mb-1 block text-xs font-normal text-gray-500 uppercase">
                Older
              </span>
              {olderPost.title}
            </Link>
          ) : (
            <span />
          )}
          {newerPost && (
            <Link
              className="text-right font-semibold"
              href={`/blog/${newerPost.slug}`}
            >
              <span className="mb-1 block text-xs font-normal text-gray-500 uppercase">
                Newer
              </span>
              {newerPost.title}
            </Link>
          )}
        </nav>
      )}
    </main>
  );
}
