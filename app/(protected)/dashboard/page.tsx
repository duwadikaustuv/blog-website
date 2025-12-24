import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";

async function getArticlesCount() {
  return await prisma.article.count({ where: { published: true } });
}

async function getRecentArticles() {
  const articles = await prisma.article.findMany({
    where: { published: true },
    include: { author: { select: { name: true } } },
    orderBy: { createdAt: "desc" },
    take: 5,
  });

  return articles.map((article) => ({
    id: article.id,
    title: article.title,
    slug: article.slug,
    date: article.createdAt.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }),
    readTime: article.readTime || "5 min read",
  }));
}

export default async function DashboardPage() {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  const articlesCount = await getArticlesCount();
  const recentArticles = await getRecentArticles();

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="mb-12 border-b border-gray-300 dark:border-gray-700 pb-8">
          <h1 className="text-3xl font-bold text-black dark:text-white mb-2">
            Welcome, {session.user?.name}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Your dashboard overview
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3 mb-12">
          <div className="rounded-lg border border-gray-300 dark:border-gray-700 p-6">
            <h3 className="text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-2">
              Total Posts
            </h3>
            <p className="text-3xl font-bold text-black dark:text-white">
              {articlesCount}
            </p>
          </div>

          <div className="rounded-lg border border-gray-300 dark:border-gray-700 p-6">
            <h3 className="text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-2">
              Reading Time
            </h3>
            <p className="text-3xl font-bold text-black dark:text-white">
              8 min
            </p>
          </div>

          <div className="rounded-lg border border-gray-300 dark:border-gray-700 p-6">
            <h3 className="text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-2">
              Status
            </h3>
            <p className="text-3xl font-bold text-black dark:text-white">
              Active
            </p>
          </div>
        </div>

        <div className="rounded-lg border border-gray-300 dark:border-gray-700 p-6">
          <h2 className="text-xl font-bold text-black dark:text-white mb-6">
            Reading List
          </h2>
          <div className="space-y-4">
            {recentArticles.length > 0 ? (
              recentArticles.map((post) => (
                <Link
                  key={post.id}
                  href={`/blog/${post.slug}`}
                  className="block rounded-md border border-gray-300 dark:border-gray-700 p-4 hover:border-black dark:hover:border-white transition-colors"
                >
                  <h3 className="font-semibold text-black dark:text-white mb-1">
                    {post.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {post.date} • {post.readTime}
                  </p>
                </Link>
              ))
            ) : (
              <p className="text-gray-500 dark:text-gray-400 text-center py-8">
                No articles available yet.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
