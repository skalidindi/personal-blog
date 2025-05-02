import { formatDate } from "@/util/date";
import Link from "next/link";

export type BlogItem = {
  title: string;
  date: string;
  link: string;
};

export function BlogLink({ blogItem }: { blogItem: BlogItem }) {
  return (
    <Link className="flex flex-col gap-2 px-4 py-2" href={blogItem.link}>
      <time dateTime={blogItem.date}>{formatDate(blogItem.date)}</time>
      <h2>{blogItem.title}</h2>
    </Link>
  );
}
