import { BackNav } from "@/components/BackNav";
import { BlogLink } from "@/components/BlogEntry";
import { blogs } from "@/util/blogs";

export default function BlogsList() {
  return (
    <section className="flex flex-col justify-self-center h-screen p-8 w-3xl gap-4">
      <BackNav href="/" heading="Home" />
      <section className="flex flex-col gap-4">
        {blogs.map((item) => (
          <BlogLink key={item.link} blogItem={item} />
        ))}
      </section>
    </section>
  );
}
