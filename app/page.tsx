import Link from "next/link";
import BlogCard from "@/components/blog/BlogCard";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { BlogPost } from "@/types";

// Force dynamic rendering - prevents build-time database access
export const dynamic = "force-dynamic";

interface ArticleFromDB {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  coverImage: string | null;
  readTime: string | null;
  tags: string | null;
  createdAt: Date;
  author: {
    name: string | null;
    image: string | null;
  };
}

async function getPublishedArticles(): Promise<BlogPost[]> {
  try {
    const articles: ArticleFromDB[] = await prisma.article.findMany({
      where: { published: true },
      include: { author: { select: { name: true, image: true } } },
      orderBy: { createdAt: "desc" },
      take: 6,
    });
    
    return articles.map((article: ArticleFromDB) => ({
      id: article.id,
      title: article.title,
      slug: article.slug,
      excerpt: article.excerpt,
      coverImage: article.coverImage || "/images/default-cover.jpg",
      author: {
        name: article.author.name || "Anonymous",
        avatar: article.author.image || "/images/default-avatar.jpg",
      },
      date: article.createdAt.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
      readTime: article.readTime || "5 min read",
      tags: article.tags ? JSON.parse(article.tags) : [],
    }));
  } catch (error) {
    console.error("Failed to fetch articles:", error);
    return [];
  }
}

export default async function Home() {
  const blogPosts = await getPublishedArticles();
  const latestSlug = blogPosts.length > 0 ? blogPosts[0].slug : "getting-started-with-our-blog";
  const session = await auth();
  
  return (
    <div className="bg-white dark:bg-black min-h-screen">
      {/* Hero Section */}
      <section className="border-b border-gray-300 dark:border-gray-700">
        <div className="mx-auto max-w-7xl px-6 py-24">
          <div className="max-w-3xl">
            <h1 className="text-5xl font-bold tracking-tight text-black dark:text-white mb-6">
              Thoughtful Writing for People Who Build Things
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
              Essays and short reads on leadership, personal growth, and doing better work without the noise. Practical ideas, written clearly, for people who value substance over trends.
            </p>
            <div className="flex gap-4">
              <Link
                href={`/blog/${latestSlug}`}
                className="rounded-md px-6 py-3 bg-black dark:bg-white text-white dark:text-black text-sm font-medium border border-black dark:border-white hover:bg-white hover:text-black dark:hover:bg-black dark:hover:text-white transition-colors"
              >
                Read the Latest
              </Link>
              {!session && (
                <Link
                  href="/register"
                  className="rounded-md px-6 py-3 border border-black dark:border-white text-black dark:text-white text-sm font-medium hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors"
                >
                  Start Reading
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Featured Posts Section */}
      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-black dark:text-white mb-2">
            Featured Articles
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Latest insights and stories
          </p>
        </div>

        {blogPosts.length > 0 ? (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {blogPosts.map((post) => (
              <BlogCard key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-400">
              No articles published yet. Check back soon!
            </p>
          </div>
        )}
      </section>

      {/* CTA Section - Only show when not logged in */}
      {!session && (
        <section className="border-t border-gray-300 dark:border-gray-700">
          <div className="mx-auto max-w-7xl px-6 py-24">
            <div className="max-w-2xl">
              <h2 className="text-3xl font-bold text-black dark:text-white mb-4">
                Join ClearMargin
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
                Get new posts delivered when they're worth reading. No spam, no gimmicks. Just clear thinking on work, growth, and leadership from people who've spent time in the real world.
              </p>
              <Link
                href="/register"
                className="inline-block rounded-md px-6 py-3 bg-black dark:bg-white text-white dark:text-black text-sm font-medium border border-black dark:border-white hover:bg-white hover:text-black dark:hover:bg-black dark:hover:text-white transition-colors"
              >
                Sign Up Free
              </Link>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
