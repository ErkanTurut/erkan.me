import Link from "next/link";
import { formatDate, getBlogPosts } from "@/writing/utils";
import { Separator } from "./ui/separator";

export function BlogPosts() {
  let allBlogs = getBlogPosts();

  return (
    <div className="flex flex-col gap-2">
      {allBlogs
        .sort((a, b) => {
          if (
            new Date(a.metadata.publishedAt) > new Date(b.metadata.publishedAt)
          ) {
            return -1;
          }
          return 1;
        })
        .map((post) => (
          <Link
            key={post.slug}
            className="flex flex-col hover:text-primary transition-colors duration-200 ease-in-out"
            href={`/writing/${post.slug}`}
          >
            <div className="w-full flex flex-col md:flex-row items-baseline space-x-0 md:space-x-2">
              <p className="text-muted-foreground whitespace-nowrap shrink-0 tabular-nums italic text-xs ">
                {formatDate(post.metadata.publishedAt, false)}
              </p>
              <div className="hidden md:inline text-muted-foreground">|</div>
              <p className=" tracking-tight underline  underline-offset-2">
                {post.metadata.title}
              </p>
            </div>
          </Link>
        ))}
    </div>
  );
}
