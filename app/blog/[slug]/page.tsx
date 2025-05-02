import { BackNav } from "@/components/BackNav";
import matter from "gray-matter";
import { Metadata } from "next";
import Link from "next/link";
import fs from "node:fs";
import path from "node:path";
import { remark } from "remark";
import html from "remark-html";

type BlogPostProps = {
  params: {
    slug: string;
  };
};

export async function generateStaticParams() {
  const postsDirectory = path.join(process.cwd(), "posts");
  const filenames = fs.readdirSync(postsDirectory);

  return filenames.map((filename) => ({
    slug: filename.replace(/\.md$/, ""),
  }));
}

export async function generateMetadata({
  params,
}: BlogPostProps): Promise<Metadata> {
  const { slug } = params;
  const postsDirectory = path.join(process.cwd(), "posts");
  const filePath = path.join(postsDirectory, `${slug}.md`);
  const fileContents = fs.readFileSync(filePath, "utf8");
  const { data } = matter(fileContents);

  return {
    title: data.title,
  };
}

export default async function BlogPost({ params }: BlogPostProps) {
  const { slug } = params;
  const postsDirectory = path.join(process.cwd(), "posts");
  const filePath = path.join(postsDirectory, `${slug}.md`);
  const fileContents = fs.readFileSync(filePath, "utf8");

  const { data, content } = matter(fileContents);
  const processedContent = await remark().use(html).process(content);
  const contentHtml = processedContent.toString();

  return (
    <section className="flex flex-col justify-self-center h-screen p-8 w-3xl gap-4">
      <header>
        <BackNav href="/blog" heading="Blogs" />
        <h1 className="font-bold text-lg">{data.title}</h1>
        <div>
          By{" "}
          <address className="inline">
            <Link rel="author" className="hover:underline" href="/">
              Santosh Kalidindi
            </Link>
          </address>
        </div>
      </header>
      <article dangerouslySetInnerHTML={{ __html: contentHtml }} />
      <footer>
        <hr className="mt-2 border-t border-gray-300 dark:border-gray-700" />
        <small>
          <Link rel="author" href="/">
            Santosh Kalidindi
          </Link>{" "}
          © 2010-2025
        </small>
      </footer>
    </section>
  );
}
