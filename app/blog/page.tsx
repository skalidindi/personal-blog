import { BackNav } from "@/components/BackNav";
import { PostLink } from "@/components/PostLink";
import { getPost, getPostSlugs } from "@/util/post";

export type Post = {
  slug: string;
  title: string;
  date: string;
};

export default async function BlogsList() {
  const posts: Post[] = await Promise.all(
    getPostSlugs().map(async (slug) => {
      const { metadata } = await getPost(slug);

      return {
        slug,
        title: metadata.title,
        date: metadata.date,
      };
    }),
  );

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
