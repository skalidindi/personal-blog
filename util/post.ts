import matter from "gray-matter";
import fs from "node:fs";
import path from "node:path";

export function getPostsDirectory() {
  return path.join(process.cwd(), "posts");
}

export function getPostContent(filename: string) {
  const postsDirectory = getPostsDirectory();
  const filePath = path.join(postsDirectory, filename);
  const fileContents = fs.readFileSync(filePath, "utf8");

  return matter(fileContents);
}
