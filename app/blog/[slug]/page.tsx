import { Metadata } from "next";
import Link from "next/link";

import { BackNav } from "@/components/BackNav";
import { ShareButton } from "@/components/ShareButton";
import { formatDate } from "@/util/date";
import { getPost, getPostSlugs } from "@/util/post";

type BlogPostProps = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateStaticParams() {
  return getPostSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: BlogPostProps): Promise<Metadata> {
  const { slug } = await params;
  const { metadata } = await getPost(slug);

  return {
    title: metadata.title,
    description: metadata.description,
  };
}

export default async function BlogPost({ params }: BlogPostProps) {
  const { slug } = await params;
  const { default: Post, metadata } = await getPost(slug);

  return (
    <section className="flex flex-col justify-self-center h-screen p-8 w-full sm:w-3xl gap-4">
      <header>
        <div className="flex flex-row items-center justify-between">
          <BackNav href="/blog" heading="Blogs" />
          <ShareButton
            title={metadata.title}
            text={metadata.description}
            path={slug}
          />
        </div>
        <h1 className="font-bold text-lg mt-4">{metadata.title}</h1>
        <div>
          By{" "}
          <address className="inline">
            <Link
              rel="author"
              className="hover:underline active:scale-95 active:bg-gray-100 transition-transform"
              href="/"
            >
              Santosh Kalidindi
            </Link>
          </address>
        </div>
        <em>
          <time
            className="text-sm text-gray-600 dark:text-gray-400"
            dateTime={metadata.date}
          >
            {formatDate(new Date(metadata.date).toString())}
          </time>
        </em>
      </header>
      <article className="prose prose-slate lg:prose-lg dark:prose-invert">
        <Post />
      </article>
      <footer>
        <hr className="border-t border-gray-300 dark:border-gray-700" />
        <small>
          <Link rel="author" href="/">
            Santosh Kalidindi
          </Link>{" "}
          © {new Date().getFullYear()}
        </small>
      </footer>
    </section>
  );
}
