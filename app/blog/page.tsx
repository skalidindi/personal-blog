import { BlogLink } from "@/components/BlogEntry";
import { blogs } from "@/util/blogs";
import Link from "next/link";

export default function Blog() {
  return (
    <section className="flex flex-col justify-self-center h-screen p-8 w-3xl">
      <nav>
        <Link className="inline-flex items-center gap-2 group" href="/">
          <svg
            className="w-6 h-6 text-gray-500 transition-transform transform group-hover:-translate-x-1 group-hover:text-blue-500"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m12 19-7-7 7-7" />
            <path d="M19 12H5" />
          </svg>
          <span className="group-hover:text-blue-500">Back</span>
        </Link>
      </nav>
      <section className="mt-4 flex flex-col gap-4">
        {blogs.map((item) => (
          <BlogLink key={item.link} blogItem={item} />
        ))}
      </section>
    </section>
  );
}
