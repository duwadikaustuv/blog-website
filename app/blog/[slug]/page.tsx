import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

async function getArticle(slug: string) {
  const article = await prisma.article.findUnique({
    where: { slug, published: true },
    include: { author: { select: { name: true, image: true } } },
  });

  return article;
}

export async function generateMetadata({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const article = await getArticle(slug);

  if (!article) {
    return { title: "Article Not Found" };
  }

  return {
    title: article.title,
    description: article.excerpt,
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const article = await getArticle(slug);

  if (!article) {
    notFound();
  }

  const tags = article.tags ? JSON.parse(article.tags) : [];
  const formattedDate = article.createdAt.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="bg-white dark:bg-black min-h-screen">
      <article className="mx-auto max-w-4xl px-4 sm:px-6 py-8 sm:py-16 w-full overflow-x-hidden">
        {/* Header */}
        <header className="mb-12">
          <div className="flex gap-2 mb-6">
            {tags.map((tag: string) => (
              <span
                key={tag}
                className="text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide"
              >
                #{tag}
              </span>
            ))}
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-black dark:text-white mb-6 leading-tight">
            {article.title}
          </h1>

          <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
            {article.excerpt}
          </p>

          <div className="flex items-center gap-4 pb-8 border-b border-gray-200 dark:border-gray-800">
            <div className="w-12 h-12 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden flex items-center justify-center">
              {article.author.image ? (
                <Image
                  src={article.author.image}
                  alt={article.author.name || "Author"}
                  width={48}
                  height={48}
                  className="object-cover"
                />
              ) : (
                <span className="text-lg font-medium text-gray-600 dark:text-gray-400">
                  {article.author.name?.charAt(0) || "A"}
                </span>
              )}
            </div>
            <div>
              <p className="font-medium text-black dark:text-white">
                {article.author.name || "Anonymous"}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {formattedDate} · {article.readTime || "5 min read"}
              </p>
            </div>
          </div>
        </header>

        {/* Cover Image */}
        {article.coverImage && (
          <div className="mb-12">
            <div className="relative aspect-video overflow-hidden">
              <Image
                src={article.coverImage}
                alt={article.title}
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>
        )}

        {/* Content */}
        <div
          className="prose prose-lg max-w-none dark:prose-invert w-full overflow-x-hidden
            prose-headings:text-black dark:prose-headings:text-white
            prose-p:text-gray-700 dark:prose-p:text-gray-300
            prose-a:text-black dark:prose-a:text-white prose-a:underline
            prose-strong:text-black dark:prose-strong:text-white
            prose-ul:text-gray-700 dark:prose-ul:text-gray-300
            prose-ol:text-gray-700 dark:prose-ol:text-gray-300
            prose-li:text-gray-700 dark:prose-li:text-gray-300
            prose-blockquote:border-gray-300 dark:prose-blockquote:border-gray-700
            prose-blockquote:text-gray-700 dark:prose-blockquote:text-gray-300
            prose-img:rounded-lg prose-img:w-full prose-img:h-auto prose-img:max-w-full"
          style={{ 
            hyphens: 'none', 
            WebkitHyphens: 'none', 
            MozHyphens: 'none', 
            msHyphens: 'none',
            wordBreak: 'normal',
            overflowWrap: 'break-word'
          }}
          dangerouslySetInnerHTML={{ 
            __html: article.content
              .replace(/\u00AD/g, "") // Remove soft hyphens
              .replace(/&shy;/g, "")  // Remove soft hyphen entities
              .replace(/<wbr\s*\/?>/gi, "") // Remove wbr tags
              .replace(/&nbsp;/g, " ") // Remove non-breaking space entities
              .replace(/\u00A0/g, " ") // Remove non-breaking space characters
              .replace(/\u202F/g, " ") // Remove narrow non-breaking space
          }}
        />

        {/* Footer */}
        <footer className="mt-16 pt-8 border-t border-gray-200 dark:border-gray-800">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back to all articles
          </Link>
        </footer>
      </article>
    </div>
  );
}
