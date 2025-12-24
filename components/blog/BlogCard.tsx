import Link from "next/link";
import { BlogPost } from "@/types";
import { formatDate } from "@/lib/utils";

interface BlogCardProps {
  post: BlogPost;
}

export default function BlogCard({ post }: BlogCardProps) {
  return (
    <article className="rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-black hover:border-black dark:hover:border-white transition-colors">
      <Link href={`/blog/${post.slug}`}>
        <div className="p-6">
          <div className="mb-4 flex items-center gap-3 text-xs text-gray-600 dark:text-gray-400 uppercase tracking-wide">
            <time dateTime={post.date}>{formatDate(post.date)}</time>
            <span>•</span>
            <span>{post.readTime}</span>
          </div>

          <h2 className="mb-3 text-xl font-semibold text-black dark:text-white leading-tight">
            {post.title}
          </h2>

          <p className="mb-4 text-sm text-gray-600 dark:text-gray-400 line-clamp-2 leading-relaxed">
            {post.excerpt}
          </p>

          <div className="flex flex-wrap gap-2 mb-4">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="px-2 py-1 text-xs font-medium rounded border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300"
              >
                {tag}
              </span>
            ))}
          </div>

          <div className="text-xs font-medium text-black dark:text-white uppercase tracking-wide">
            Read Article →
          </div>
        </div>
      </Link>
    </article>
  );
}
