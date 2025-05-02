import { BackNav } from "@/components/BackNav";
import { PostLink } from "@/components/PostLink";
import matter from "gray-matter";
import fs from "node:fs";
import path from "node:path";

export type Post = {
  slug: string;
  title: string;
  date: string;
};

export default function BlogsList() {
  const postsDirectory = path.join(process.cwd(), "posts");
  const filenames = fs.readdirSync(postsDirectory);

  const posts: Post[] = filenames.map((filename) => {
    const filePath = path.join(postsDirectory, filename);
    const fileContents = fs.readFileSync(filePath, "utf8");
    const { data } = matter(fileContents);

    return {
      slug: filename.replace(/\.md$/, ""),
      title: data.title,
      date: data.date,
    };
  });

  return (
    <section className="flex flex-col justify-self-center h-screen p-8 w-full sm:w-3xl gap-4">
      <BackNav href="/" heading="Home" />
      <section className="flex flex-col gap-4">
        {posts.map((item) => (
          <PostLink key={item.slug} post={item} />
        ))}
      </section>
    </section>
  );
}
