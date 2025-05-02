import { BackNav } from "@/components/BackNav";
import { ShareButton } from "@/components/ShareButton";
import { formatDate } from "@/util/date";
import { getPostContent, getPostsDirectory } from "@/util/post";
import { Metadata } from "next";
import Link from "next/link";
import fs from "node:fs";
import { remark } from "remark";
import html from "remark-html";

type BlogPostProps = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateStaticParams() {
  const postsDirectory = getPostsDirectory();
  const filenames = fs.readdirSync(postsDirectory);

  return filenames.map((filename) => ({
    slug: filename.replace(/\.md$/, ""),
  }));
}

export async function generateMetadata({
  params,
}: BlogPostProps): Promise<Metadata> {
  const { slug } = await params;
  const { data } = getPostContent(`${slug}.md`);

  return {
    title: data.title,
  };
}

export default async function BlogPost({ params }: BlogPostProps) {
  const { slug } = await params;

  const { data, content } = getPostContent(`${slug}.md`);
  const processedContent = await remark().use(html).process(content);
  const contentHtml = processedContent.toString();

  return (
    <section className="flex flex-col justify-self-center h-screen p-8 w-full sm:w-3xl gap-4">
      <header>
        <div className="flex flex-row items-center justify-between">
          <BackNav href="/blog" heading="Blogs" />
          <ShareButton title={data.title} text={data.description} path={slug} />
        </div>
        <h1 className="font-bold text-lg mt-4">{data.title}</h1>
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
            dateTime={data.date}
          >
            {formatDate(new Date(data.date).toString())}
          </time>
        </em>
      </header>
      <article
        className="prose prose-slate lg:prose-lg"
        dangerouslySetInnerHTML={{ __html: contentHtml }}
      />
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
