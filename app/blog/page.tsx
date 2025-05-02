import { BackNav } from "@/components/BackNav";
import { PostLink } from "@/components/PostLink";
import { getPostContent, getPostsDirectory } from "@/util/post";
import fs from "node:fs";

export type Post = {
  slug: string;
  title: string;
  date: string;
};

export default function BlogsList() {
  const postsDirectory = getPostsDirectory();
  const filenames = fs.readdirSync(postsDirectory);

  const posts: Post[] = filenames.map((filename) => {
    const { data } = getPostContent(filename);

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
